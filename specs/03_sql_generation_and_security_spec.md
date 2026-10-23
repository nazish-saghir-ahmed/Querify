# SPEC-03: SQL Generation & AST Security Specification

> **Schema Grounding, Prompt Construction, AST Verification, and Database Execution Security**

---

## 1. Schema-Grounded Prompt Engineering

To prevent LLM hallucination and ensure generated SQL matches the exact MySQL 8 relational schema, `AiService` injects a comprehensive **Schema Context Block** into every prompt sent to Google Gemini 1.5/2.0:

```markdown
SYSTEM PROMPT:
You are an expert SQL engineer for MySQL 8.
Generate ONLY valid, executable, read-only SELECT queries based strictly on the provided schema.

DATABASE SCHEMA:
- companies (company_id INT PK, company_name VARCHAR, ticker VARCHAR, hq_country VARCHAR, founded_year INT, employee_count INT)
- ai_models (model_id INT PK, company_id INT FK, model_name VARCHAR, release_date DATE, parameter_count_billions DECIMAL, context_window_tokens INT, benchmark_score DECIMAL, architecture_type VARCHAR)
- financial_performance (financial_id INT PK, company_id INT FK, fiscal_year INT, annual_revenue_millions DECIMAL, net_income_millions DECIMAL, r_and_d_spending_millions DECIMAL, net_profit_margin DECIMAL)
- ai_investments (investment_id INT PK, company_id INT FK, round_name VARCHAR, amount_millions DECIMAL, valuation_millions DECIMAL, investment_date DATE, lead_investor VARCHAR)
- research_projects (project_id INT PK, company_id INT FK, project_name VARCHAR, domain VARCHAR, start_date DATE, status VARCHAR, publication_count INT)
- market_performance (market_id INT PK, company_id INT FK, recorded_date DATE, market_cap_billions DECIMAL, pe_ratio DECIMAL, stock_price_usd DECIMAL)

CONVENTIONS & RULES:
1. Always use proper JOIN syntax on primary/foreign key pairs (e.g., companies.company_id = financial_performance.company_id).
2. Currency units: Revenue, Net Income, and R&D are in Millions USD ($M). Market Cap is in Billions USD ($B).
3. Do NOT invent columns or tables.
4. Output JSON format: { "sql": "SELECT ...", "explanation": "Brief explanation of query mechanics" }
```

---

## 2. AI Provider Architecture (`AiProvider.java`)

```
                      +-------------------+
                      |   <<Interface>>   |
                      |    AiProvider     |
                      +-------------------+
                                ^
                                |
               +----------------+----------------+
               |                                 |
     +-------------------+             +--------------------+
     |  GeminiAiProvider |             | DemoModeAiProvider |
     +-------------------+             +--------------------+
     - Calls Gemini REST API           - Heuristic keyword matcher
     - Uses JSON Schema constraints    - Zero network dependency
     - Live dynamic generation         - 100% offline predictability
```

### Fallback & Mode Configuration
In `application.properties`:
```properties
# 'gemini' for live Google Gemini REST API; 'demo' for offline heuristic engine
ai.mode=demo
ai.gemini.api-key=${GEMINI_API_KEY:}
ai.gemini.model=gemini-1.5-flash
```
If `ai.mode=gemini` is selected but `GEMINI_API_KEY` is blank or invalid, `AiService` automatically falls back to `DemoModeAiProvider` to prevent service downtime.

---

## 3. AST Structural Security Architecture (`SqlValidator.java`)

All generated SQL queries—regardless of whether they originated from Gemini, the demo provider, or client fallback—must pass through the **Syntax-Aware Lexical Guard & JSqlParser AST Security Pipeline** before reaching the database connection pool.

```
+-----------------------------------------------------------------------------------+
|               SYNTAX-AWARE LEXICAL SCAN & JSqlParser AST PIPELINE                |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Raw User / AI SQL String ]                                                     |
|          |                                                                        |
|          v                                                                        |
|  [ Lexical Scanner: hasMultipleStatements() ]                                     |
|          |                                                                        |
|          +---> Respects quotes ('...', "...") and comments (-- or /* ... */)      |
|          +---> Multiple unquoted intermediate statements? ---> REJECT (Chaining)  |
|          +---> Single trailing semicolon (;)? ---> NORMALIZE (Trim for AST parser)|
|          |                                                                        |
|          v                                                                        |
|  [ Parse Statement via CCJSqlParserUtil.parse(cleanSql) ]                         |
|          |                                                                        |
|          v                                                                        |
|  [ Statement instanceof net.sf.jsqlparser.statement.select.Select? ]              |
|          |                                                                        |
|          +---> NO (INSERT/UPDATE/DELETE/DROP/ALTER/TRUNCATE) ---> REJECT          |
|          |                                                                        |
|          v                                                                        |
|  [ TablesNamesFinder AST Visitor: Extract all referenced tables ]                 |
|          |                                                                        |
|          +---> Any Table NOT in ALLOWED_TABLES whitelist? ---> REJECT             |
|          |     (Blocks: information_schema, mysql, sys, users, query_history)    |
|          v                                                                        |
|  [ Inspect PlainSelect AST for LIMIT clause ]                                     |
|          |                                                                        |
|          +---> No Limit? Appends `LIMIT 100`                                      |
|          +---> Limit > 100? Caps limit at `100`                                   |
|          |                                                                        |
|          v                                                                        |
|  [ PASS: Return Sanitized AST-Validated SQL ]                                     |
+-----------------------------------------------------------------------------------+
```

### 3.1 Syntax-Aware Lexical Scanner (`hasMultipleStatements`)
A naive `.contains(";")` check causes false positives on valid SQL string literals (e.g., `WHERE company_name = 'Acme; Corp'`) and false negatives on single trailing semicolons generated by standard SQL formatters. 

Querify implements a syntax-aware single-pass lexical scanner:
```java
private static boolean hasMultipleStatements(String sql) {
    boolean inSingleQuote = false;
    boolean inDoubleQuote = false;
    boolean inLineComment = false;
    boolean inBlockComment = false;
    int semicolonCount = 0;
    int lastSemicolonPos = -1;

    for (int i = 0; i < sql.length(); i++) {
        char c = sql.charAt(i);
        char next = (i + 1 < sql.length()) ? sql.charAt(i + 1) : '\0';

        // Track comments and quotes
        if (!inSingleQuote && !inDoubleQuote && !inLineComment && !inBlockComment) {
            if (c == '-' && next == '-') { inLineComment = true; i++; continue; }
            if (c == '/' && next == '*') { inBlockComment = true; i++; continue; }
            if (c == '\'') { inSingleQuote = true; continue; }
            if (c == '"') { inDoubleQuote = true; continue; }
            if (c == ';') {
                semicolonCount++;
                lastSemicolonPos = i;
            }
        } else if (inSingleQuote && c == '\'') {
            inSingleQuote = false;
        } else if (inDoubleQuote && c == '"') {
            inDoubleQuote = false;
        } else if (inLineComment && (c == '\n' || c == '\r')) {
            inLineComment = false;
        } else if (inBlockComment && c == '*' && next == '/') {
            inBlockComment = false;
            i++;
        }
    }

    if (semicolonCount == 0) return false;
    if (semicolonCount == 1) {
        // Safe only if it's trailing whitespace after the semicolon
        String remainder = sql.substring(lastSemicolonPos + 1).trim();
        return !remainder.isEmpty();
    }
    return true; // Multiple unquoted semicolons -> statement chaining attack
}
```

### 3.2 Semicolon Policy & AST Normalization
1. **Permitted**: A single trailing semicolon (e.g., `SELECT * FROM companies;`) is safely trimmed prior to AST parsing.
2. **Permitted**: Semicolons inside quoted string literals or comments (e.g., `SELECT * FROM companies WHERE company_name = 'Alpha; Beta' -- test;`).
3. **Forbidden**: Multiple statements or statement chaining (`SELECT 1; DROP TABLE companies;`).

### 3.3 Table Whitelist Policy
Only the following 6 domain tables may be queried:
```java
public static final Set<String> ALLOWED_TABLES = Set.of(
    "companies",
    "ai_models",
    "financial_performance",
    "ai_investments",
    "research_projects",
    "market_performance"
);
```
Direct queries against internal audit logs (`query_history`) or system catalogs (`information_schema`, `mysql`, `sys`) trigger an immediate `SqlSecurityException`.

---

## 4. Controlled Execution Sandbox (`SqlExecutionService.java`)

1. **HikariCP Pool Bounds**:
   - `maximum-pool-size`: 10 connections.
   - `connection-timeout`: 3000 ms.
2. **Query Timeout**:
   - `jdbcTemplate.setQueryTimeout(5)` (enforces strict 5-second deadline per query).
3. **Execution Metrics & Label Normalization**:
   - Latency measured in milliseconds via `System.currentTimeMillis()`.
   - Strips table qualifier prefixes (e.g., `c.company_name` -> `company_name`) from `ResultSetMetaData` to prevent frontend key lookup failures.
   - Populates row maps with canonical lowercase and uppercase keys for resilient client-side rendering.
4. **Audit History Recording**:
   - Query text, execution duration, row count, status (`SUCCESS`, `EXECUTION_ERROR`, or `SECURITY_VIOLATION`), and forensic error messages are recorded in `query_history` asynchronously.
