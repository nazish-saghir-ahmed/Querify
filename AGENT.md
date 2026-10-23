# AGENT.MD: Developer & AI Agent Playbook for Querify

> **Comprehensive Engineering Manual for AI Agents (Antigravity, Cursor, Claude Code, Codex) and Human Developers Working on Querify.**

---

## 1. Project Identity & Mission

- **Project Name:** Querify (Text-to-SQL Clarification Engine)
- **Tagline:** Ask in English. Understand your data.
- **Repository:** `https://github.com/nazish-saghir-ahmed/Querify`
- **Live Vercel Frontend:** `https://querify-nine.vercel.app`
- **Core Value Proposition:** Unlike naive Text-to-SQL systems that guess when faced with ambiguity, Querify features a stateful **Clarification Engine** that halts execution, prompts the user with targeted disambiguation options, verifies the resulting SQL with an **Abstract Syntax Tree (AST)** security guard, and executes it with strict resource limits.

---

## 2. Repository Directory Map

```
D:\Querify/
├── backend/                              # Java 17 + Spring Boot 3 Backend
│   ├── src/main/java/com/querify/
│   │   ├── QuerifyApplication.java       # Spring Boot main entry point
│   │   ├── ai/                           # AI provider abstractions & implementations
│   │   │   ├── AiProvider.java           # Interface: generateSql, explainSql
│   │   │   ├── AiService.java            # Orchestration layer for AI generation
│   │   │   ├── DemoModeAiProvider.java   # Deterministic offline heuristic generator
│   │   │   ├── GeminiAiProvider.java     # Google Gemini 1.5/2.0 REST client
│   │   │   └── GeneratedSqlResult.java   # Value object for generated SQL & reasoning
│   │   ├── clarification/                # Multi-turn ambiguity detection & sessions
│   │   │   ├── ClarificationEngine.java   # Polysemy analysis & question generator
│   │   │   └── ClarificationSession.java  # In-memory session state holder
│   │   ├── config/                       # Spring configuration classes
│   │   │   ├── AiConfigProperties.java   # Type-safe AI configuration properties
│   │   │   ├── CorsConfig.java           # Cross-Origin Resource Sharing filter
│   │   │   └── DataSourceConfig.java     # Dynamic HikariCP data source configuration
│   │   ├── controller/                   # REST API controllers
│   │   │   ├── DatabaseExplorerController.java # /api/database/schema, tables, sample
│   │   │   ├── HealthController.java     # /api/health system diagnostic endpoint
│   │   │   ├── HistoryController.java    # /api/history audit logs
│   │   │   └── QueryController.java      # /api/query/analyze, clarify, execute
│   │   ├── dto/                          # Data Transfer Objects
│   │   ├── exception/                    # Custom exceptions & global handler
│   │   │   └── GlobalExceptionHandler.java # Uniform JSON error formatting
│   │   ├── model/                        # JPA / Domain entities
│   │   │   ├── Company.java, AiModel.java, FinancialPerformance.java, etc.
│   │   │   └── QueryHistory.java         # Audit log entity
│   │   ├── repository/                   # Spring Data JPA repositories
│   │   └── sql/                          # AST parsing & database execution
│   │       ├── SqlExecutionService.java  # JdbcTemplate query executor with timeouts
│   │       └── SqlValidator.java         # JSqlParser AST security validator
│   ├── src/main/resources/
│   │   ├── application.properties        # Backend configuration
│   │   └── schema.sql                    # MySQL / H2 schema initialization
│   ├── pom.xml                           # Maven dependencies (Spring Boot, JSqlParser, MySQL)
│   └── mvnw.cmd / mvnw                   # Maven wrapper scripts
│
├── frontend/                             # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── App.jsx                       # Main application shell & tab routing
│   │   ├── main.jsx                      # React 18 DOM mount point & ErrorBoundary wrapper
│   │   ├── index.css                     # Tailwind CSS tokens, animations & obsidian theme
│   │   ├── components/                   # High-craft developer UI components
│   │   │   ├── BrandLogo.jsx             # Architectural database stack & neural diamond
│   │   │   ├── FixedHeroBackground.jsx   # Ultra-HD Stationary 3D AI + Relational DB spatial layer
│   │   │   ├── CursorTrail.jsx           # Canvas-based Electric Mint particle stream
│   │   │   ├── ClarificationModal.jsx    # High-contrast decision modal for multi-turn disambiguation
│   │   │   ├── ErrorBoundary.jsx         # Global crash protection boundary
│   │   │   ├── Footer.jsx                # System footer with links & status
│   │   │   ├── Navbar.jsx                # Linear-style tab pills & live engine badge
│   │   │   ├── QuestionChip.jsx          # Clickable prompt suggestion chips
│   │   │   ├── ResultChart.jsx           # Dynamic Recharts visualization (Bar/Line/Pie)
│   │   │   ├── ResultTable.jsx           # Paginated data table with CSV export
│   │   │   └── SqlViewer.jsx             # Syntax-highlighted SQL with explanation
│   │   ├── pages/                        # View controllers
│   │   │   ├── LandingPage.jsx           # Hero page & interactive terminal walkthrough
│   │   │   ├── WorkspacePage.jsx         # Intelligent Command Console with schema dialect badges
│   │   │   ├── ExplorerPage.jsx          # Database Schema Explorer with ERD topology & column filters
│   │   │   ├── HistoryPage.jsx           # Query execution audit log & KPI metrics cards
│   │   │   └── AboutPage.jsx             # Architecture, pipeline, & viva guide
│   │   └── services/                     # Network & fallback services
│   │       ├── api.js                    # API client with Vercel HTML rewrite detection
│   │       └── clientFallbackData.js     # Zero-backend client demo engine
│   ├── package.json                      # Frontend dependencies (React, Vite, Recharts, Lucide)
│   ├── vite.config.js                    # Vite bundler configuration & local proxy
│   └── tailwind.config.js                # Monochromatic titanium & Electric Mint design tokens
│
├── specs/                                # Formal Engineering Specifications
│   ├── README.md                         # Specifications Index
│   ├── 01_system_architecture_spec.md    # End-to-end architecture & data pipeline
│   ├── 02_clarification_engine_spec.md   # Ambiguity analysis & multi-turn dialogs
│   ├── 03_sql_generation_and_security_spec.md # AST validation & prompt engineering
│   ├── 04_db_explorer_and_schema_catalog_spec.md # Schema discovery & domain catalogs
│   ├── 05_api_and_client_fallback_spec.md # REST contracts & edge fallback protocol
│   └── 06_frontend_ui_ux_spec.md         # UI tokens, components, & error boundaries
│
├── docs/                                 # Technical documentation
│   ├── api-guide.md                      # REST API endpoint reference
│   ├── architecture.md                   # System design & component diagrams
│   ├── database-design.md                # MySQL schema & relational entity mappings
│   ├── demo-guide.md                     # Viva / presentation script
│   ├── deployment-guide.md               # Local, Docker, & Cloud hosting instructions
│   └── viva-preparation.md               # Viva Q&A defense document
│
├── VISION.md                             # High-level vision and philosophy
├── GOALS.md                              # Strategic OKRs and milestone roadmap
├── DECISIONS.md                          # Architectural Decision Records (ADRs)
├── AGENT.md                              # This file (AI developer manual)
├── vercel.json                           # Vercel deployment & routing configuration
└── README.md                             # Public repository documentation
```

---

## 3. Technology Stack & Version Matrix

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Runtime** | Java OpenJDK | 17 LTS / 21 | High-throughput backend runtime |
| **Framework** | Spring Boot | 3.2.x | REST API, DI, Security, JPA |
| **SQL Parser** | JSqlParser | 4.6+ | Abstract Syntax Tree (AST) validation |
| **Database** | MySQL / H2 | 8.0+ / 2.2+ | Relational storage & in-memory testing |
| **Connection Pool**| HikariCP | 5.1+ | Low-latency JDBC connection pooling |
| **AI LLM / Embed** | OpenRouter / Gemini | Nemotron 3.5 Embed (1B) / 1.5 Flash | Neural Vector Embeddings & Schema Grounded SQL |
| **OpenRouter SDK** | @openrouter/sdk | 1.5.6 | Official TypeScript SDK for OpenRouter API |
| **Frontend** | React | 18.2+ | Declarative UI and state management |
| **Bundler** | Vite | 5.0+ | Fast ESM development and production build |
| **Styling** | Tailwind CSS | 3.4+ | Dark Navy Blue (`#1D3557`), Deep Navy Canvas (`#0D1B2A`), Gold (`#D4AF37`), & Transparent Frosted Glass (`backdrop-blur-xl`) |
| **Charts** | Recharts | 2.10+ | Responsive SVG/Canvas data visualizations with Dark Navy & Gold theme |
| **Icons** | Lucide React | 0.300+ | Lightweight SVG iconography |
| **Diagrams** | Archify | 3.2.0 | Verifiable interactive architecture maps |

---

## 4. Golden Rules for AI Agents & Developers

When modifying or extending this codebase, **you must strictly adhere to the following rules**:

### Rule 1: Propagate Structured Backend Errors and Guard HTML Rewrites in `api.js`
In [`frontend/src/services/api.js`](file:///D:/Querify/frontend/src/services/api.js), do NOT swallow backend error responses (e.g. HTTP 403 Security Violations):
```javascript
if (!res.ok) {
  if (contentType.toLowerCase().includes('application/json')) {
    const errorJson = await res.json().catch(() => null);
    if (errorJson && (errorJson.message || errorJson.error || errorJson.status)) {
      const err = new Error(errorJson.message || errorJson.error || `HTTP ${res.status}`);
      err.status = errorJson.status || res.status;
      err.response = errorJson;
      throw err; // Propagates real security violation to UI
    }
  }
  return null; // Gateway error or Vercel HTML rewrite triggers edge fallback
}
```
*Rationale:* Swallowing 403s causes the silent fallback anti-pattern where malicious SQL injection attempts falsely appear to succeed with mock data.

### Rule 2: Syntax-Aware Semicolon Handling in `SqlValidator.java`
Standard SQL formatters output queries with a trailing semicolon. Never use raw `.contains(";")` checks. Always use `hasMultipleStatements(sql)` which respects single quotes (`'...'`), double quotes (`"..."`), and comments (`--`, `/*...*/`), allowing a single trailing semicolon while blocking statement chaining (`SELECT 1; DROP TABLE`).

### Rule 3: Never Remove Defensive Array Guards
In React state consumers (e.g., `ExplorerPage.jsx`, `HistoryPage.jsx`), never call `.map()` directly on state variables without defensive guards:
```javascript
const safeList = Array.isArray(items) ? items : [];
```
*Rationale:* Protects against unexpected API payloads, null returns, or network anomalies.

### Rule 4: Never Bypass AST Validation in Backend
Never execute SQL using raw string concatenation or bypass `SqlValidator.validateSelectOnly()`.
*Rationale:* `SqlValidator` uses JSqlParser to ensure statements are strictly `SELECT`, tables are whitelisted, and `LIMIT 100` is enforced.

### Rule 5: Maintain Schema Parity Between Java and JavaScript Fallback
Whenever new tables, columns, or schemas are added to `schema.sql` or `DatabaseExplorerController.java`, identical definitions and sample rows must be mirrored in [`clientFallbackData.js`](file:///D:/Querify/frontend/src/services/clientFallbackData.js).
*Rationale:* Ensures the live Vercel edge deployment never falls out of sync with the Java backend.

---

## 5. Development Workflows & Commands

### Running Locally (Full-Stack Mode)

#### 1. Start the Spring Boot Backend (Port 8080)
```powershell
cd D:\Querify\backend
.\mvnw.cmd spring-boot:run
```
- Health Check: `http://localhost:8080/api/health`
- Swagger/Schema: `http://localhost:8080/api/database/schema`

#### 2. Start the React Frontend (Port 5173)
```powershell
cd D:\Querify\frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
- Access app in browser: `http://localhost:5173`

---

### Building for Production & Deployment

#### Build Frontend Bundle
```powershell
cd D:\Querify\frontend
npm run build
```
Build output is generated into `frontend/dist/`.

#### Commit and Push to Deploy to Vercel
```powershell
cd D:\Querify
git add .
git commit -m "feat/fix: descriptive message"
git push origin main
```
*Vercel automatically triggers a build on git push to `main`.*

---

## 6. Archify Tooling Workflows

Archify is integrated into the workspace for generating interactive architecture diagrams.

### Verify Archify Health
```powershell
node C:\Users\Nazish\.agents\skills\archify\bin\archify.mjs doctor
```

### Validate a Diagram JSON
```powershell
node C:\Users\Nazish\.agents\skills\archify\bin\archify.mjs validate architecture <input.json>
```

### Render an Interactive HTML Diagram
```powershell
node C:\Users\Nazish\.agents\skills\archify\bin\archify.mjs render architecture <input.json> <output.html>
```

---

## 7. Troubleshooting & Incident Playbook

| Symptom | Probable Cause | Action / Resolution |
| :--- | :--- | :--- |
| **Dark / Blank Screen on Vercel** | Vercel rewrote `/api` to HTML; component called `.map()` on `{}`. | Verify `api.js` has `contentType.includes('application/json')` and components use `Array.isArray()`. Check that `ErrorBoundary.jsx` wraps `<App />`. |
| **Backend Port 8080 Busy** | Previous Spring Boot process did not terminate. | Run `netstat -ano \| findstr :8080` and terminate the PID via `taskkill /F /PID <PID>`. |
| **CORS Errors in Browser** | Frontend running on non-whitelisted port. | Check `CorsConfig.java` in backend. Ensure port 5173, 3000, and `querify-nine.vercel.app` are allowed origins. |
| **Gemini AI API Key Quota / Missing** | `GEMINI_API_KEY` not set or quota exceeded. | Switch `ai.mode=demo` in `application.properties` to activate the zero-cost deterministic heuristic engine. |
| **SQL Security Exception** | Query contained non-SELECT statement or unapproved table. | Inspect `SqlValidator.java`. Verify statement is pure `SELECT` and all referenced tables exist in `ALLOWED_TABLES`. |
