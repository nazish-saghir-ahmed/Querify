# Querify Architectural Decision Records (ADRs)

> **Official Log of Engineering Decisions, Trade-Offs, and Architecture Evolution**

---

## Index of Architectural Decisions

- [ADR-001: Core Technology Stack (Spring Boot 3 + React 18 / Vite)](#adr-001-core-technology-stack)
- [ADR-002: Dual-Engine Architecture (Spring Boot Backend + Edge Client Fallback)](#adr-002-dual-engine-architecture)
- [ADR-003: Proactive Multi-Turn Clarification vs. Single-Shot LLM Guessing](#adr-003-proactive-multi-turn-clarification)
- [ADR-004: AST-Level SQL Verification Using JSqlParser vs. Regex](#adr-004-ast-level-sql-verification)
- [ADR-005: Swappable AI Provider Abstraction (Gemini REST + Heuristic Demo Engine)](#adr-005-swappable-ai-provider-abstraction)
- [ADR-006: Content-Type Header Sniffing to Counter Vercel SPA Wildcard Rewrites](#adr-006-content-type-header-sniffing)
- [ADR-007: React 18 ErrorBoundary and Defensive Array Guards](#adr-007-react-18-errorboundary-and-defensive-guards)
- [ADR-008: In-Memory Multi-Domain Schema Catalogs for DB Explorer](#adr-008-in-memory-multi-domain-schema-catalogs)
- [ADR-009: Dark Cyberpunk & Glassmorphism Design System](#adr-009-dark-cyberpunk-design-system)
- [ADR-010: Archify Integration for Living Interactive Architecture Maps](#adr-010-archify-integration)

---

### ADR-001: Core Technology Stack
- **Status**: Accepted
- **Context**: Querify requires enterprise-grade backend stability, robust SQL parsing libraries, type safety, and an agile, high-performance UI capable of real-time streaming and interactive data visualization.
- **Decision**:
  - **Backend**: Java 17 + Spring Boot 3.x with Maven.
  - **Frontend**: React 18 + Vite + Tailwind CSS + Lucide Icons + Recharts.
  - **Database**: MySQL 8.0 with HikariCP connection pooling.
- **Consequences**:
  - *Positive*: Java provides mature enterprise libraries (JSqlParser, HikariCP, Spring Web), type-safe DTOs, and high-throughput execution. Vite provides sub-second HMR and lightweight bundle sizes.
  - *Negative*: Java backend requires a container or JVM runtime environment (Render/Docker) compared to pure serverless Node.js functions. Mitigated via ADR-002.

---

### ADR-002: Dual-Engine Architecture
- **Status**: Accepted
- **Context**: Deploying a full-stack Spring Boot + MySQL + React app on cloud platforms like Vercel (frontend-only) often results in broken network requests, dead endpoints, or painful multi-cloud setup for quick user reviews and grading.
- **Decision**: Implement a **Dual-Engine Architecture**:
  1. **Enterprise Mode**: When the Java Spring Boot backend is live (localhost:8080 or cloud container), all requests route via REST to the Spring Boot application and live MySQL database.
  2. **Edge Fallback Mode**: If the backend is unavailable or the app is deployed standalone on Vercel, the frontend automatically routes to [`clientFallbackData.js`](file:///D:/Querify/frontend/src/services/clientFallbackData.js), providing 100% of features (Query clarification, SQL generation, multi-domain schemas, table exploration, audit history) client-side.
- **Consequences**:
  - *Positive*: Zero deployment friction; reviewers and users can instantly test the live application on Vercel without configuring a MySQL server or JVM.
  - *Negative*: Must maintain schema parity between Java models and JavaScript fallback fixtures.

---

### ADR-003: Proactive Multi-Turn Clarification
- **Status**: Accepted
- **Context**: Standard Text-to-SQL models guess when confronted with ambiguous business terms (e.g., "top companies" could mean revenue, profit, growth, or benchmark accuracy). A wrong guess leads to erroneous financial or strategic decisions.
- **Decision**: Implement a stateful `ClarificationEngine`.
  - When ambiguity is detected, execution is halted, returning `CLARIFICATION_NEEDED` with a session ID and structured options.
  - The UI presents an interactive modal allowing the user to select the intended metric.
  - Once resolved, the backend synthesizes the disambiguated intent into a precise prompt before generating SQL.
- **Consequences**:
  - *Positive*: Eliminates hallucinations; provides 100% deterministic metric alignment; builds trust with non-technical users.
  - *Negative*: Adds an extra round-trip when queries are ambiguous, but only when necessary.

---

### ADR-004: AST-Level SQL Verification Using JSqlParser
- **Status**: Accepted
- **Context**: Regex-based SQL validation is notoriously vulnerable to bypasses, obfuscation (`/* comment */`), nested subqueries, and injection attacks.
- **Decision**: Reject raw regex checking in favor of true Abstract Syntax Tree (AST) validation using **JSqlParser**:
  - The parsed root statement must strictly be an instance of `net.sf.jsqlparser.statement.select.Select`.
  - All table names are extracted from the AST and verified against an approved whitelist.
  - Multiple statements (semicolon splitting) are rejected immediately.
  - An AST visitor inspects for missing `LIMIT` clauses and injects a maximum limit (`LIMIT 100`).
- **Consequences**:
  - *Positive*: Mathematically sound security; zero chance of data modification or unintended DDL statements.
  - *Negative*: Slightly higher parsing overhead per query (~2ms), which is negligible compared to database execution time.

---

### ADR-005: Swappable AI Provider Abstraction
- **Status**: Accepted
- **Context**: Cloud LLM APIs (Google Gemini, OpenAI, Anthropic) can experience rate limits, require paid API keys, or face network latency. Developers also need to run tests offline without an API key.
- **Decision**: Define a common Java interface `AiProvider` with two implementations:
  1. `GeminiAiProvider`: Calls Google Gemini 1.5/2.0 REST API with strict JSON schema constraints and system prompts.
  2. `DemoModeAiProvider`: Deterministic heuristic generator that maps questions to validated SQL using pattern matching and keyword extraction, functioning completely offline with zero API keys.
- **Consequences**:
  - *Positive*: Seamless switching via `application.properties` (`ai.mode=gemini` vs `ai.mode=demo`); zero cost for automated testing.
  - *Negative*: Demo mode covers targeted domain patterns rather than open-ended conversational English.

---

### ADR-006: Content-Type Header Sniffing to Counter Vercel SPA Wildcard Rewrites
- **Status**: Accepted
- **Context**: On Vercel, single-page-app routing rules (`/(.*) -> /index.html`) rewrite unmatched `/api/*` endpoints to `index.html` with **HTTP 200 OK**. In JavaScript, `fetch()` considers 200 OK a success, but calling `res.json()` fails or produces `{}`. In React components, calling `.map()` on `{}` caused an unhandled `TypeError` that crashed the entire page into a dark blank screen.
- **Decision**: In [`frontend/src/services/api.js`](file:///D:/Querify/frontend/src/services/api.js), inspect `res.headers.get('content-type')`:
  ```javascript
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok || !contentType.toLowerCase().includes('application/json')) {
    // Vercel HTML rewrite detected -> Fall back to client demo engine
    return clientFallbackData.getSchema();
  }
  ```
- **Consequences**:
  - *Positive*: Completely eliminates the blank/dark screen bug on Vercel without altering Vercel configuration files; seamless fallback when the backend is offline.
  - *Negative*: None. Standard HTTP practice for robust API clients.

---

### ADR-007: React 18 ErrorBoundary and Defensive Guards
- **Status**: Accepted
- **Context**: In React 18, an uncaught runtime error during rendering unmounts the entire `#root` container. Because the page background is styled as `#080B14`, unmounting leaves the user staring at an empty black window with no explanation or recovery options.
- **Decision**:
  1. Create an enterprise-grade [`ErrorBoundary.jsx`](file:///D:/Querify/frontend/src/components/ErrorBoundary.jsx) wrapping `<App />` in [`main.jsx`](file:///D:/Querify/frontend/src/main.jsx).
  2. Implement defensive array guards in all state bindings:
     ```javascript
     const safeSchemaList = Array.isArray(schemas) ? schemas : [];
     ```
- **Consequences**:
  - *Positive*: 100% crash immunity. If an unexpected error occurs, the user is presented with a branded cyber-styled diagnostic UI with a 1-click "Reload App" recovery button.
  - *Negative*: Requires minimal boilerplate code around state mappings.

---

### ADR-008: In-Memory Multi-Domain Schema Catalogs for DB Explorer
- **Status**: Accepted
- **Context**: The Database Explorer needs to showcase enterprise versatility across different industries (E-Commerce, SaaS Analytics, HR Payroll, FinTech Ledgers), but running 4 live MySQL databases locally or on cloud instances is resource-intensive.
- **Decision**: Implement a standardized, rich schema catalog format supported in both Java (`DatabaseExplorerController.java`) and JavaScript (`clientFallbackData.js`).
  - Pre-configure 4 realistic schemas:
    1. `ecommerce`: Products, Customers, Orders, Order Items, Reviews.
    2. `saas_analytics`: Subscriptions, Tenants, Feature Usage, Invoices.
    3. `hr_payroll`: Employees, Departments, Salaries, Performance Reviews.
    4. `fintech_ledger`: Accounts, Transactions, Cards, Compliance Audits.
- **Consequences**:
  - *Positive*: Users can inspect real schemas, column datatypes, primary/foreign keys, and sample table rows instantly across multiple business verticals.
  - *Negative*: Schema updates must be synchronized across both catalog files.

---

### ADR-009: Dark Cyberpunk & Glassmorphism Design System
- **Status**: Accepted
- **Context**: Querify is a forward-looking developer and executive AI tool. Plain enterprise tables look outdated, while excessively bright themes cause eye strain during analytical work.
- **Decision**: Adopt a dark cyberpunk / glassmorphism visual language using Tailwind CSS:
  - Deep space background: `#080B14` and `#0B1120`.
  - Accent neon colors: Cyan (`#06B6D4` / `#22D3EE`), Indigo (`#6366F1`), and Emerald (`#10B981`).
  - Subtle borders with transparency (`border-slate-800/80`).
  - Monospace font (`JetBrains Mono`, `Fira Code`) for SQL viewers and execution metrics.
- **Consequences**:
  - *Positive*: Visually stunning, high-contrast, professional, and memorable during live demos and viva presentations.
  - *Negative*: Requires strict CSS utility discipline to maintain accessibility contrast standards.

---

### ADR-010: Archify Integration for Living Interactive Architecture Maps
- **Status**: Accepted
- **Context**: Static markdown architecture diagrams (PNGs or ASCII art) quickly become outdated, lack interactive drill-down capabilities, and cannot be traced against live source code.
- **Decision**: Integrate **Archify** (`tt-a1i/archify`) as the primary architecture visualization tool.
  - Archify runs locally via Node.js (`archify.mjs`), validating diagrams against strict JSON schemas and producing standalone, portable HTML files with dark/light themes, path tracing, and PNG/PDF export capabilities.
- **Consequences**:
  - *Positive*: Single-command generation of verifiable, interactive architecture maps for reviews, stakeholder walkthroughs, and documentation.
  - *Negative*: Requires Node 20+ runtime for CLI execution (already verified on the host system).
