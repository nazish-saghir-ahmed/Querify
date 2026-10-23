# SPEC-01: System Architecture Specification

> **Subsystem Boundaries, Component Interactions, and Runtime Topologies for Querify**

---

## 1. System Overview

Querify is a high-assurance, full-stack Text-to-SQL platform engineered to translate natural language inquiries into secure, executable SQL queries. The architecture is explicitly decoupled into three operational tiers:
1. **Presentation Tier (React 18 / Vite)**: Provides declarative UI, state management, interactive query clarification dialogs, schema exploration, and dynamic charting.
2. **Application Tier (Java 17 / Spring Boot 3)**: Orchestrates intent parsing, ambiguity detection, session-based clarification, AI prompting, AST security enforcement, and database query dispatch.
3. **Data Tier (MySQL 8 / HikariCP)**: Relational data store containing domain tables (`querify_db`) and query execution audit history (`query_history`).

---

## 2. Component Architecture Diagram

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER                                     |
|                                                                                       |
|  +--------------------+   +-----------------------+   +----------------------------+  |
|  |  WorkspacePage     |   |  ExplorerPage         |   |  HistoryPage               |  |
|  |  - Input Prompts   |   |  - 4 Domain Catalogs  |   |  - Audit Log Table         |  |
|  |  - Result Charts   |   |  - Column Types & PKs |   |  - Query Latency & Status  |  |
|  +--------------------+   +-----------------------+   +----------------------------+  |
|             \                         |                        /                      |
|              v                        v                       v                       |
|  +---------------------------------------------------------------------------------+  |
|  |                        FRONTEND API ROUTER (`api.js`)                            |  |
|  |  Checks: (res.ok && res.headers['content-type'].includes('application/json'))    |  |
|  +---------------------------------------------------------------------------------+  |
+------------------------------------------|--------------------------------------------+
                    |                      | (Fallback Triggered if Offline/Vercel)
                    | HTTP REST / JSON     v
                    |       +-----------------------------------------------------------+
                    |       |        CLIENT-SIDE DEMO ENGINE (`clientFallbackData.js`)  |
                    |       |  - Heuristic Query Analyzer & Clarification Mock Generator|
                    |       |  - 4 Pre-built Domain Schemas & Sample Rows               |
                    |       |  - Local Execution Engine with SVG Recharts Visualization |
                    |       +-----------------------------------------------------------+
                    v
+---------------------------------------------------------------------------------------+
|                             SPRING BOOT BACKEND (:8080)                               |
|                                                                                       |
|  +----------------------+  +-------------------------+  +--------------------------+  |
|  | QueryController      |  | DatabaseExplorerController | HistoryController        |  |
|  | /api/query/analyze   |  | /api/database/schema    |  | /api/history             |  |
|  | /api/query/clarify   |  | /api/database/sample    |  +--------------------------+  |
|  +----------------------+  +-------------------------+                                |
|             |                                                                         |
|             v                                                                         |
|  +---------------------------------------------------------------------------------+  |
|  | CLARIFICATION ENGINE (`ClarificationEngine.java`)                                |  |
|  | - Evaluates polysemy (best, top, growth, active)                                |  |
|  | - Creates & persists `ClarificationSession`                                     |  |
|  +---------------------------------------------------------------------------------+  |
|             |                                                                         |
|      [Intent Resolved]                                                                |
|             v                                                                         |
|  +---------------------------------------------------------------------------------+  |
|  | AI ORCHESTRATION (`AiService.java`)                                             |  |
|  | - `GeminiAiProvider`: Schema-grounded system prompts to Gemini 1.5/2.0 REST API    |  |
|  | - `DemoModeAiProvider`: Deterministic offline heuristic mapping engine         |  |
|  +---------------------------------------------------------------------------------+  |
|             |                                                                         |
|      [Raw SQL Generated]                                                              |
|             v                                                                         |
|  +---------------------------------------------------------------------------------+  |
|  | AST SECURITY GUARD (`SqlValidator.java`)                                        |  |
|  | - JSqlParser AST Statement verification: Must be instance of `Select`           |  |
|  | - Rejects INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE                         |  |
|  | - Checks table whitelist: companies, ai_models, financial_performance, etc.     |  |
|  | - Injects mandatory LIMIT 100 constraint                                        |  |
|  +---------------------------------------------------------------------------------+  |
|             |                                                                         |
|      [Validated SQL]                                                                  |
|             v                                                                         |
|  +---------------------------------------------------------------------------------+  |
|  | SQL EXECUTION SERVICE (`SqlExecutionService.java`)                              |  |
|  | - HikariCP pooled connection with strict 5-second execution timeout             |  |
|  | - Extracts column metadata, row maps, execution duration, and chart heuristics  |  |
|  | - Asynchronously records audit entry to `query_history`                         |  |
|  +---------------------------------------------------------------------------------+  |
+------------------------------------------|--------------------------------------------+
                                           | JDBC Connection (Port 3306)
                                           v
+---------------------------------------------------------------------------------------+
|                                    MYSQL DATABASE                                     |
|  Database: `querify_db`                                                               |
|  Tables: companies, ai_models, financial_performance, ai_investments,                 |
|          research_projects, market_performance, query_history                         |
+---------------------------------------------------------------------------------------+
```

---

## 3. Core Data Processing Pipelines

### Pipeline A: Direct Unambiguous Query Execution
1. User enters natural language query into `WorkspacePage`.
2. Frontend dispatches `POST /api/query/analyze` with `{ query: "Show all AI models released in 2024" }`.
3. `ClarificationEngine` evaluates semantic constraints. Metric is explicit (`released in 2024`); no polysemy detected.
4. `AiService` synthesizes prompt containing MySQL schema DDL + user query, calling `AiProvider.generateSql()`.
5. Raw SQL is inspected by `SqlValidator.validateSelectOnly()`.
6. AST validates statement as read-only `Select`; table `ai_models` is verified against whitelist; `LIMIT 100` appended.
7. `SqlExecutionService` executes query via `JdbcTemplate` within a 5000 ms timeout window.
8. Column metadata and row objects are wrapped into `QueryResultDto` and returned with HTTP 200.
9. Frontend renders syntax-highlighted SQL, data table, and deductive Recharts graph.

### Pipeline B: Multi-Turn Clarification Execution
1. User enters ambiguous query: *"Show me the top performing AI companies"*.
2. Frontend dispatches `POST /api/query/analyze`.
3. `ClarificationEngine` detects polysemic term *"top performing"*. Ambiguity status flags `CLARIFICATION_NEEDED`.
4. Engine creates a new `ClarificationSession` with a UUID token, storing the raw query and generating 3 options:
   - Option A: *Net Profit Margin*
   - Option B: *Annual Revenue*
   - Option C: *Stock Market Capitalization*
5. Backend responds with `QueryAnalyzeResponse` containing `status: "CLARIFICATION_NEEDED"`, `sessionId`, and option list.
6. Frontend receives payload and immediately renders `ClarificationModal`.
7. User selects *Annual Revenue*. Frontend dispatches `POST /api/query/clarify` with `{ sessionId, selectedOptionId }`.
8. Backend retrieves `ClarificationSession`, synthesizes disambiguated intent: *"Show top AI companies by annual revenue in 2024"*, and routes to Pipeline A (Stage 4 onwards).

---

## 4. Deployment Topologies

### Topology 1: Local Full-Stack (Development Mode)
- **Frontend**: Vite Dev Server on `http://127.0.0.1:5173`.
- **Backend**: Spring Boot 3 on `http://localhost:8080`.
- **Database**: Local MySQL 8 on port 3306 or embedded in-memory H2.
- **Proxy**: Vite config proxies `/api` to `http://localhost:8080`.

### Topology 2: Distributed Cloud Production
- **Frontend**: Vercel Edge CDN (`https://querify-nine.vercel.app`).
- **Backend**: Dockerized Spring Boot on Render or Fly.io with JVM 17.
- **Database**: Managed Cloud MySQL (e.g., PlanetScale, Supabase, or AWS RDS).
- **Security**: CORS headers restricted to production Vercel domains.

### Topology 3: Edge Standalone Demo Mode (Zero Backend Required)
- **Frontend**: Hosted on Vercel.
- **Fallback Trigger**: If backend is unavailable or `/api` rewrites return HTML, `api.js` seamlessly routes all traffic to `clientFallbackData.js`.
- **Availability**: 100% uptime with zero external server dependencies.

---

## 5. Non-Functional Requirements (NFRs)

- **Latency**:
  - Client-side fallback query: < 80 ms.
  - Spring Boot local query (Demo AI): < 150 ms.
  - Spring Boot live Gemini AI query: < 1800 ms.
- **Security**: Zero SQL injection tolerance; strict AST validation before any database I/O.
- **Reliability**: No uncaught React runtime exception may unmount the DOM tree (enforced by `ErrorBoundary.jsx`).
- **Data Integrity**: Enforce read-only database connections via JDBC flags and AST statement whitelisting.
