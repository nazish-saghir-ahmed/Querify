# Querify University Viva Voce Preparation Guide

This document contains 20+ of the most frequent and challenging questions asked by university professors, examiners, and project guides during final year software project evaluations, along with beginner-friendly answers.

---

### Q1. What is the core problem Querify solves?
**Answer:**
Relational databases contain critical business data, but querying them requires technical knowledge of SQL syntax, join conditions, and database normalization. Non-technical stakeholders cannot access this data directly. While basic text-to-SQL chatbots attempt to translate English into SQL, they naively guess when queries are ambiguous (e.g. "show top companies" could mean revenue, profit, or market share). Querify solves this through an autonomous **Clarification Engine** that detects ambiguity, asks multi-turn follow-up questions, and executes safe SQL against MySQL.

---

### Q2. What is the difference between a chatbot and a Clarification Engine?
**Answer:**
A standard chatbot generates an immediate response regardless of whether the user's intent is well-defined. If you ask a chatbot "Which company is best?", it hallucinate or arbitrarily picks a column. In contrast, Querify's Clarification Engine:
1. Performs semantic intent analysis.
2. Identifies missing or polysemic constraints.
3. Pauses execution and returns structured clarification choices.
4. Maintains session state across turns.
5. Resumes execution with the resolved metric without starting from scratch.

---

### Q3. Why did you choose Java and Spring Boot for the backend?
**Answer:**
1. **Enterprise Robustness:** Java 17/21 LTS provides strong type safety, mature memory management, and high concurrency.
2. **Spring Ecosystem:** Spring Boot offers rapid REST API development, automatic dependency injection, and native integration with database connection pools.
3. **Controlled SQL Execution:** `JdbcTemplate` allows fine-grained execution timeout control, transaction isolation, and raw metadata extraction.
4. **Security Libraries:** Java provides enterprise SQL parsers like `JSqlParser` for AST analysis.

---

### Q4. Why did you use MySQL 8 instead of SQLite or MongoDB?
**Answer:**
1. **Relational Integrity:** Financial and company performance data is inherently relational (companies have 1-to-many relationships with models, finances, and investments). Foreign keys with cascading constraints ensure data consistency.
2. **ACID Compliance:** MySQL InnoDB guarantees Atomicity, Consistency, Isolation, and Durability.
3. **Industry Standard:** MySQL 8 is used by major tech companies worldwide and is standard in computer science curricula.

---

### Q5. How do you prevent dangerous SQL and SQL injection?
**Answer:**
We implement a multi-layered defense architecture:
1. **AST Parser Verification:** `SqlValidator` parses the SQL string into an Abstract Syntax Tree using `JSqlParser`. It verifies that the root AST node is strictly an instance of `Select`.
2. **Mutation Blocking:** Commands like `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`, and stored procedure executions (`CALL`, `EXEC`) are completely blocked and return HTTP 403 Forbidden.
3. **Table Whitelisting:** The AST `TablesNamesFinder` checks all referenced tables against our 6 approved domain tables. Any reference to system schemas (`information_schema`, `mysql`, `sys`) is rejected.
4. **Multi-Statement Prevention:** Queries containing multiple statements separated by semicolons are blocked.
5. **Safe Bounds:** The engine automatically enforces a `LIMIT` clause (maximum 100 rows) and a 5-second query timeout.

---

### Q6. How does the AI know about your specific database schema without hallucinating?
**Answer:**
We use **Schema Grounding**. In the AI system prompt, we explicitly inject the complete Data Definition Language (DDL) context:
- Table names (`companies`, `ai_models`, `financial_performance`, etc.)
- Column names and data types
- Foreign key relations (e.g. `financial_performance.company_id` references `companies.company_id`)
- Unit conventions (all monetary values are in millions USD)
- Strict instruction to only query allowed tables and output JSON.

---

### Q7. How does the system handle multi-turn clarification state?
**Answer:**
When an ambiguous query is received, the backend instantiates a `ClarificationSession` keyed by a UUID `sessionId`. It preserves:
- The user's original query.
- The clarification question and offered options.
- The turn count (capped at 2 to prevent infinite loops).
When the user submits their choice, the backend matches the `selectedOptionId`, resolves the semantic metric, and appends the clarified instruction to the execution pipeline.

---

### Q8. What happens if the external AI API is offline or rate-limited?
**Answer:**
Querify incorporates an autonomous **Demo Mode Engine** (`DemoModeAiProvider`). It uses deterministic pattern matching and intent classification to handle over 30 analytical questions and all clarification resolution paths locally with zero API key requirement and zero network latency. In `AiService`, any network failure from the live provider automatically triggers fail-safe fallback to the Demo Engine.

---

### Q9. Why is there a separate backend instead of calling the database directly from React?
**Answer:**
Direct browser-to-database connections violate basic security principles:
1. Database credentials (username/password) would be exposed in client JavaScript.
2. Malicious users could execute arbitrary queries.
3. Secret AI API keys would be publicly visible in network inspect tabs.
The Java backend acts as an authenticated, secure gatekeeper.

---

### Q10. What are the tables in your database schema?
**Answer:**
1. `companies`: Central parent entity (name, industry, country, founded year, type, HQ city).
2. `ai_models`: Model systems (model name, category, release year, parameters, benchmark score).
3. `financial_performance`: Multi-year financials (fiscal year, revenue, profit, costs, growth %).
4. `ai_investments`: Capital allocation (year, amount millions, category, estimated ROI %).
5. `research_projects`: Frontier R&D (project name, research area, budget, status, start date).
6. `market_performance`: Market dominance (fiscal year, market share %, customer growth %, index).
7. `query_history`: Persistent audit log of executed queries and durations.

---

### Q11. How does the frontend decide what chart to render?
**Answer:**
The backend `SqlExecutionService` inspects the column metadata of the returned `ResultSet`:
- If columns include temporal data (`fiscal_year`, `date`), it recommends a **Line Chart**.
- If columns have categorical dimensions (`company_name`, `model_name`) and numeric metrics (`revenue_millions`, `profit_millions`), it recommends a **Bar Chart**.
- If values represent percentage shares with <= 8 rows (`market_share_percent`), it recommends a **Pie Chart**.
The user can also freely toggle chart types via the toolbar.

---

### Q12. What is JSqlParser and why is it better than Regular Expressions for SQL validation?
**Answer:**
Regular expressions rely on lexical string pattern matching. Attackers can bypass regex using SQL comments (`SELECT/*drop*/`), encoding tricks, or subqueries. JSqlParser parses the SQL into a semantic Abstract Syntax Tree (AST), creating typed Java objects for the `SelectBody`, `FromItem`, `Join`, and `Limit`. This allows structural validation of what the query actually does.

---

### Q13. What is CORS and how did you configure it?
**Answer:**
Cross-Origin Resource Sharing is an HTTP-header based security mechanism implemented by web browsers to restrict resource loading from different origins. In Spring Boot, we configured `CorsConfig` implementing `WebMvcConfigurer` to explicitly permit HTTP GET, POST, PUT, DELETE requests from `http://localhost:5173`.

---

### Q14. What are the key automated tests included in the project?
**Answer:**
We wrote 23 comprehensive automated tests covering:
1. `SqlValidatorTest`: Verifies valid SELECTs, safe limit appending, and rejection of DROP, DELETE, INSERT, UPDATE, multi-statements, and system tables.
2. `ClarificationEngineTest`: Tests ambiguity detection on "best performing", "most money", "top models", and verifies that specific queries are not mistakenly flagged.
3. `DemoModeAiProviderTest`: Verifies SQL generation across clarification routes and direct analytical questions.
4. `QuerifyIntegrationTest`: Full end-to-end integration tests using Spring Boot MockMvc and an in-memory H2 database testing health, schema, tables, multi-turn clarification, and HTTP 403 security blocking.

---

### Q15. How does the CSV Export feature work?
**Answer:**
The `ResultTable` component extracts the column headers and active row records from state, formats them into comma-separated values escaping quotes, creates a client-side `Blob` of type `text/csv`, generates a temporary object URL, and triggers an automatic browser download.

---

### Q16. Why did you use synthetic data for company finances?
**Answer:**
For academic transparency and data integrity. Real frontier AI labs (such as OpenAI and Anthropic) are private corporations that do not disclose granular internal compute expenditures or verified monthly burn rates. Creating realistic, logically consistent synthetic data across 20 companies and 3 fiscal years allows us to demonstrate complex analytical queries without presenting unverified estimates as official fact.

---

### Q17. How does the database indexing improve query performance?
**Answer:**
We created targeted indexes on commonly filtered and sorted columns:
- `idx_company_name` on `companies(company_name)`
- `idx_financial_year` on `financial_performance(fiscal_year)`
- `idx_financial_revenue` on `financial_performance(revenue_millions)`
- `idx_model_score` on `ai_models(performance_score)`
These B-Tree indexes enable the MySQL optimizer to perform fast index lookups and range scans instead of full table scans.

---

### Q18. How does the frontend handle loading and error states?
**Answer:**
The workspace implements a state machine:
- **IDLE:** Input bar ready with example chips.
- **THINKING:** Animated spinner and disabled buttons during AI intent analysis.
- **CLARIFYING:** Modal prompt when ambiguity is detected.
- **EXECUTING:** Status feedback during database query execution.
- **SUCCESS:** Synchronized table and Recharts visual display.
- **ERROR:** Alert box showing the exact backend error message with guidance.

---

### Q19. What design system or theme was applied to the frontend?
**Answer:**
A custom dark, futuristic, neon-accented AI SaaS aesthetic built with Tailwind CSS:
- Primary Background: Deep obsidian `#080B14`
- Surface Cards: Navy `#101827` and Slate `#151E30`
- Primary Accent: Electric violet `#8B5CF6`
- Secondary Accent: Cyber cyan `#22D3EE`
- Typography: Inter for clean UI hierarchy and JetBrains Mono for code blocks.

---

### Q20. If you had 3 more months to develop Querify, what would you add?
**Answer:**
1. Multi-database connectivity allowing users to attach their own JDBC connection strings.
2. Vector embeddings (RAG) to dynamically map domain-specific corporate acronyms.
3. Voice-to-SQL audio input using Web Speech API.
4. Natural language query suggestions based on past organizational query frequency.
