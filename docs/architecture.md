# Querify Architecture & System Design

**Project Title:** Text-to-SQL Clarification Engine  
**Tagline:** Ask in English. Understand your data.

---

## 1. Executive Architecture Summary

Querify is an enterprise-grade, end-to-end full-stack software application that transforms everyday English questions into safe, executable MySQL 8 queries. 

Unlike conventional text-to-SQL chatbots that naively guess when faced with ambiguity, Querify features an autonomous **Clarification Engine** that pauses execution, prompts the user with targeted multi-turn options, and synthesizes the resolved intent before generating SQL.

```
+-----------------------------------------------------------------------------------+
|                              REACT 18 VITE FRONTEND                               |
|                                                                                   |
|  [ Natural Language Input ] ----> [ Clarification Dialog ] ----> [ Recharts / Table ]|
+-----------------------------------------------------------------------------------+
                                         |
                                         | HTTP JSON REST (/api/query/analyze, clarify)
                                         v
+-----------------------------------------------------------------------------------+
|                            SPRING BOOT JAVA 17/21 BACKEND                         |
|                                                                                   |
|  1. Intent Extraction & Ambiguity Analyzer (ClarificationEngine)                   |
|  2. Multi-Turn Session State Manager (ClarificationSession)                       |
|  3. Swappable AI Engine (Google Gemini 1.5/2.0 REST or Offline DemoMode Engine)    |
|  4. Abstract Syntax Tree (AST) Security Guard (JSqlParser AST Verification)        |
|  5. Query Execution & Metadata Extractor (JdbcTemplate with Query Timeout)        |
+-----------------------------------------------------------------------------------+
                                         |
                                         | Controlled TCP Connection (HikariCP)
                                         v
+-----------------------------------------------------------------------------------+
|                                 MYSQL 8 DATABASE                                  |
|                                                                                   |
|  Schema: querify_db (companies, ai_models, financial_performance, ai_investments,  |
|                      research_projects, market_performance, query_history)        |
+-----------------------------------------------------------------------------------+
```

---

## 2. Core 8-Stage Processing Pipeline

### Stage 1: Natural Language Input
The user inputs an analytical question in plain English into the Workspace (e.g., *"Show me the best performing AI companies"* or *"Which AI companies had highest revenue in 2024?"*).

### Stage 2: Intent Analysis
The backend parses the question into semantic components:
- **Target Entity:** `companies`, `ai_models`, `research_projects`
- **Candidate Metrics:** `revenue`, `profit`, `growth`, `benchmark score`, `investment ROI`
- **Temporal Constraints:** `2024`, `2023`, multi-year trends
- **Ordering & Filtering:** Top 5, Highest, Greater than 500 million

### Stage 3: Ambiguity Detection & Clarification Decision
The `ClarificationEngine` evaluates whether the metric or target can be uniquely resolved:
- **Specific Query:** If the metric is explicit (e.g., *"highest revenue"*), clarification is skipped to prevent user friction.
- **Ambiguous Query:** If the term is polysemic (e.g., *"best performing"*, *"made the most money"*, *"growing fast"*), execution is paused. The backend creates a `ClarificationSession` and returns `CLARIFICATION_NEEDED` with targeted options.

### Stage 4: Multi-Turn Clarification Resolution
The frontend renders an interactive neon modal presenting the clarification prompt and selectable choices. The user's selection is dispatched back to `/api/query/clarify`. The backend updates the session context and synthesizes a precise augmented prompt without losing previous constraints.

### Stage 5: Schema-Grounded SQL Generation
The query is dispatched to the AI provider (`GeminiAiProvider` or `DemoModeAiProvider`). The AI is injected with the complete MySQL schema, table definitions, foreign keys, and monetary unit conventions ($ Millions USD), preventing hallucinations.

### Stage 6: AST Structural Security Validation
Before reaching the database, the raw SQL is processed by `SqlValidator` using JSqlParser:
- Strictly verifies root statement is an instance of `net.sf.jsqlparser.statement.select.Select`.
- Rejects `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`, `EXECUTE`.
- Blocks multi-statement execution (semicolon splitting).
- Checks all accessed tables against a whitelist of 6 approved domain tables.
- Blocks access to system schemas (`information_schema`, `mysql`, `sys`).
- Automatically enforces safe `LIMIT` bounds (max 100 rows).

### Stage 7: Controlled Database Execution
The validated query is executed via `JdbcTemplate` with a strict execution timeout (5 seconds). Runtime execution metrics (execution duration in milliseconds and row counts) are captured.

### Stage 8: Dynamic Result Visualization
The result payload is returned to the frontend containing:
- Structured column names and row maps.
- Deductive chart suggestions (Bar Chart for categorical comparisons, Line Chart for multi-year trends, Pie Chart for market allocations).
- Plain-English explanation of the SQL mechanics.
- Audit history logging to MySQL `query_history`.

---

## 3. Package Architecture (com.querify)

```
com.querify/
├── QuerifyApplication.java           # Spring Boot application entry point
├── config/
│   ├── CorsConfig.java               # CORS configuration for local & production ports
│   └── AiConfigProperties.java       # Type-safe AI configuration properties
├── controller/
│   ├── QueryController.java          # Endpoints: /api/query/analyze, clarify, execute
│   ├── DatabaseExplorerController.java# Endpoints: /api/database/schema, tables, sample
│   ├── HistoryController.java        # Endpoints: /api/history (audit logs)
│   └── HealthController.java         # Endpoints: /api/health (diagnostics & uptime)
├── clarification/
│   ├── ClarificationEngine.java      # Ambiguity rules, pattern matching & resolution
│   └── ClarificationSession.java     # Stateful multi-turn conversation session
├── ai/
│   ├── AiProvider.java               # Generic swappable AI provider interface
│   ├── DemoModeAiProvider.java       # Deterministic 100% offline rule-based AI engine
│   ├── GeminiAiProvider.java         # Live Google Gemini 1.5/2.0 REST client
│   ├── AiService.java                # Provider routing with automatic offline fallback
│   └── GeneratedSqlResult.java       # Record holding SQL and plain-English explanation
├── sql/
│   ├── SqlValidator.java             # JSqlParser AST analysis & security gate
│   └── SqlExecutionService.java      # JdbcTemplate execution & chart type deduction
├── model/
│   ├── Company.java                  # JPA entity for companies
│   ├── AiModel.java                  # JPA entity for ai_models
│   ├── FinancialPerformance.java     # JPA entity for financial_performance
│   ├── AiInvestment.java             # JPA entity for ai_investments
│   ├── ResearchProject.java          # JPA entity for research_projects
│   ├── MarketPerformance.java        # JPA entity for market_performance
│   └── QueryHistory.java             # JPA entity for query_history
├── repository/
│   └── QueryHistoryRepository.java   # Spring Data JPA history repository
├── dto/
│   ├── QueryAnalyzeRequest.java      # Request DTO for question analysis
│   ├── QueryAnalyzeResponse.java     # Response DTO with clarification or query result
│   ├── ClarificationQuestion.java    # Follow-up question with candidate options
│   ├── ClarificationOption.java      # Specific selectable metric choice
│   ├── QueryClarifyRequest.java      # User's choice submission DTO
│   ├── QueryExecuteRequest.java      # Direct SQL execution DTO
│   ├── QueryResultDto.java           # Structured rows, columns, and execution time
│   ├── ChartSuggestionDto.java       # Recommended chart type and axis bindings
│   ├── TableSchemaDto.java           # Table schema metadata
│   ├── ColumnSchemaDto.java          # Column metadata
│   └── HealthResponse.java           # Uptime and connectivity diagnostics
└── exception/
    ├── SqlSecurityException.java     # Exception thrown on malicious/invalid SQL
    ├── SqlExecutionException.java    # Exception thrown on runtime DB execution errors
    ├── ClarificationException.java   # Exception thrown on session expiration/errors
    └── GlobalExceptionHandler.java   # Centralized @RestControllerAdvice error handler
```
