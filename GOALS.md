# Querify Goals & Objectives

> **Strategic Goals, Operational Objectives, and Engineering Milestones for Querify**

---

## 1. High-Level Mission

Querify's primary goal is to **eliminate the accuracy and safety risks of natural language data querying** in enterprise environments by combining state-of-the-art LLMs with rigorous semantic clarification, AST-level query validation, and resilient edge deployments.

---

## 2. Strategic Objectives & Key Results (OKRs)

### Objective 1: 100% Query Safety & Deterministic Security
*Guarantee that zero malicious, mutating, or unapproved SQL statements ever reach the underlying relational database.*
- **KR 1.1**: Enforce 100% AST inspection coverage using JSqlParser before database execution.
- **KR 1.2**: 0% false negatives on SQL injection, multi-statement stacking (`;`), or mutation commands (`INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`).
- **KR 1.3**: Automatic enforcement of safe row limits (`LIMIT 100`) and strict execution timeouts (< 5000 ms) on every query.

### Objective 2: High Clarification Precision & Zero Blind Guessing
*Detect polysemic and ambiguous user questions and guide the user through multi-turn conversational disambiguation.*
- **KR 2.1**: Detect polysemic business metrics (e.g., "best", "top", "active", "performing") with > 95% accuracy.
- **KR 2.2**: Provide targeted, multi-option clarification choices with zero hallucinated database columns.
- **KR 2.3**: Maintain conversational state across clarification turns without losing original user-specified temporal or categorical constraints.

### Objective 3: 99.99% Availability via Resilient Edge Portability
*Provide a seamless, zero-crash experience regardless of network latency, cloud outages, or standalone frontend deployments.*
- **KR 3.1**: 100% functional parity between live Spring Boot backend and client-side fallback engine for sample schemas and demo queries.
- **KR 3.2**: Zero blank/dark screen failures by intercepting Vercel SPA HTML rewrites and wrapping UI in React 18 error boundaries.
- **KR 3.3**: Sub-100ms response time on Vercel client-side queries; sub-1500ms end-to-end latency on live Spring Boot + Gemini AI queries.

### Objective 4: Developer & Agent Extensibility
*Ensure that AI agents (Antigravity, Cursor, Claude Code) and human engineers can understand, maintain, test, and extend the codebase autonomously.*
- **KR 4.1**: Maintain up-to-date specifications (`specs/`) for every major subsystem.
- **KR 4.2**: Maintain comprehensive Architectural Decision Records (`DECISIONS.md`).
- **KR 4.3**: Provide actionable AI developer guidelines (`AGENT.md`) with reproducible build, test, and debugging instructions.

---

## 3. Engineering & Product Goals Matrix

| Goal Category | Description | Target Metric | Current Status |
| :--- | :--- | :--- | :---: |
| **SQL Accuracy** | Correct SQL generation for schema-grounded natural language questions. | > 92% syntax accuracy | **Met** |
| **Ambiguity Handling** | Proactive clarification when multiple metrics or entity paths exist. | 100% trigger on polysemic terms | **Met** |
| **AST Security** | Rejection of non-SELECT statements and unapproved schemas. | 100% rejection rate | **Met** |
| **Frontend Uptime** | Error-boundary protected UI with client-side fallback for offline/edge hosting. | 0 fatal white/dark screen crashes | **Met** |
| **Interactive DB Explorer** | Real-time schema introspection across multi-domain datasets. | Support 4 complex enterprise schemas | **Met** |
| **Visualization Engine** | Automated chart type recommendation based on result cardinality and data types. | Bar, Line, and Pie chart rendering | **Met** |
| **Architecture Documentation** | Living interactive visual architecture maps and rigorous specifications. | 100% Archify readiness & full specs | **Met** |

---

## 4. Milestone Roadmap

### Phase 1: Foundation & Core Engine (Completed)
- [x] Java 17 + Spring Boot 3 enterprise backend scaffolding.
- [x] MySQL 8 schema design (`querify_db`) with companies, AI models, and financial tables.
- [x] Google Gemini 1.5/2.0 REST AI Provider integration.
- [x] Deterministic heuristic `DemoModeAiProvider` for offline testing.
- [x] AST-based `SqlValidator` using JSqlParser with strict SELECT whitelisting.
- [x] Multi-turn `ClarificationEngine` and session cache.
- [x] React 18 + Vite frontend with Tailwind CSS cyberpunk theme and Recharts.

### Phase 2: Edge Portability & Resiliency (Completed)
- [x] Standalone Vercel deployment support.
- [x] Zero-backend client-side mock engine (`clientFallbackData.js`) covering Query, Explorer, and History.
- [x] Content-Type sniffing in `api.js` to defeat Vercel SPA HTML rewrites.
- [x] Defensive array guards (`Array.isArray()`) across all frontend views.
- [x] Global branded `ErrorBoundary` in React 18 preventing black-screen unmounts.
- [x] Automated deployment pipeline to GitHub (`main`) and Vercel.

### Phase 3: Project Standardization & Specs (Completed)
- [x] Creation of `VISION.md`, `GOALS.md`, `DECISIONS.md`, and `AGENT.md`.
- [x] Creation of formal specification directory `specs/` (System Architecture, Clarification Engine, SQL Security, DB Explorer, API Contracts, UI/UX).
- [x] Integration and verification of **Archify** (`tt-a1i/archify`) for automated interactive system maps.

### Phase 4: Premium Frontend Redesign & Craft Identity (Completed)
- [x] Replaced generic AI purple/blue gradients with bespoke **Intelligent Electric Mint (`#00F5A0`)** and monochromatic titanium tokens.
- [x] Designed and integrated ultra-HD stationary AI + Relational Database 3D background layer (`FixedHeroBackground.jsx`) with fixed viewport pinning.
- [x] Implemented responsive HTML5 Canvas particle cursor stream (`CursorTrail.jsx`) with touch device and `prefers-reduced-motion` safety.
- [x] Redesigned Workspace into an Intelligent Command Console with dialect indicators (`MySQL 8`), AST guard badges, and suggestion chips.
- [x] Enhanced DB Explorer with real-time column/table search filters, PK/FK badges, live sample records, and interactive Relational Schema Topology (ERD).
- [x] Enriched Query History audit trail with KPI cards (Total Executions, Avg Latency, AST 100% Pass) and real-time query filtering.
- [x] Recorded ADR-011 in `DECISIONS.md` and updated `specs/06_frontend_ui_ux_spec.md`.
- [x] Verified 100% operational on live Vercel production deployment (`https://querify-nine.vercel.app/`).

### Phase 5: Dark Navy Blue Redesign, AST Semicolon Normalization & Audit Synchronization (Completed)
- [x] Redesigned visual identity around **Dark Navy Blue** (`#1D3557` brand, `#14253D` hover, `#2B4C7E` slate, `#3A506B` border, `#0D1B2A` deep navy canvas, `#F7F3E9` ivory, `#D4AF37` gold) with transparent frosted glass containers (`backdrop-blur-xl`).
- [x] Implemented syntax-aware lexical scanner `hasMultipleStatements` in `SqlValidator.java` supporting quotes (`'...'`, `"..."`) and comments (`--`, `/*...*/`), safely normalizing single trailing semicolons while strictly rejecting statement chaining.
- [x] Added 14 new unit tests in `SqlValidatorTest.java` (total 28 backend tests passing with 100% build success).
- [x] Fixed `company_name` null rendering across ResultTable and ResultChart via table qualifier stripping and case-insensitive row accessors.
- [x] Fixed metric formatting in `ResultTable.jsx`: percentage keywords evaluated before generic currency keywords (`revenue_growth_percent` now formats as `100.25%`).
- [x] Eliminated silent fallback anti-pattern in `api.js`: authentic HTTP 403 / 400 security violations propagate directly to the UI rather than faking success.
- [x] Protected CSV exports against CSV formula injection (`=`, `+`, `-`, `@`) and added dynamic date-stamped file naming (`query-results-YYYY-MM-DD.csv`).
- [x] Added enterprise security violation audit logging in `SqlExecutionService.java` (`status = SECURITY_VIOLATION`).
- [x] Added transparent runtime database indicator in Navbar (`Live MySQL 8.0` vs `Embedded In-Memory (H2)` vs `Edge Standalone`).
- [x] Recorded ADR-013 in `DECISIONS.md` and updated engineering specs.

### Phase 6: Enterprise Scale & Dialects (Future Roadmap)
- [ ] Multi-dialect AST translation (PostgreSQL, Snowflake, ClickHouse, SQLite).
- [ ] Dynamic database connection manager (allow users to paste their own JDBC connection strings).
- [ ] Vector-indexed schema retrieval (RAG over enterprise metadata catalogs for 500+ table schemas).
- [ ] Export formats: Parquet and PDF analytical briefing reports.
