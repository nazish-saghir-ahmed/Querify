# Querify Vision Statement

> **"Transforming Human Intent into Precision Data Science without Guesswork."**

---

## 1. Executive Summary

In the modern enterprise, **data is ubiquitous, but accessibility is severely bottlenecked**. Business stakeholders, executives, product managers, and operations teams have critical analytical questions every minute, yet they rely on data engineering or BI teams to write complex SQL queries.

Existing **Text-to-SQL solutions** attempt to bridge this gap, but suffer from a fatal flaw: **naive hallucination**. When a user asks an ambiguous question—such as *"Which companies performed the best this year?"*—conventional AI chatbots blindly guess whether "best" implies revenue, net profit margin, stock return, headcount growth, or benchmark accuracy. In enterprise finance and operations, a silent guess is worse than no answer: **it leads to catastrophic business decisions based on unverified SQL**.

**Querify introduces a new paradigm**: The **Proactive Clarification Engine**. Instead of guessing when ambiguity is detected, Querify pauses execution, consults the schema ontology, and converses with the user through structured, targeted clarification options. Only when intent is strictly disambiguated and verified against the Abstract Syntax Tree (AST) does Querify generate and execute production-grade SQL.

---

## 2. Core Pillars of the Querify Philosophy

```
+---------------------------------------------------------------------------------------+
|                                  THE 3 PILLARS OF QUERIFY                             |
+---------------------------------------------------------------------------------------+
|  1. INTERPRETIVE CLARITY       |  2. AST-VERIFIED SAFETY        |  3. RESILIENT EDGE   |
|                                |                                |     PORTABILITY      |
|  - Zero blind guessing         |  - JSqlParser AST analysis     |  - Dual-engine design|
|  - Polysemy & entity detection |  - Mandatory SELECT-only guard |  - Full cloud & local|
|  - Targeted multi-turn dialog  |  - Auto-LIMIT (max 100 rows)   |  - Zero-backend demo |
|  - Explicit metric alignment   |  - Table whitelist enforcement |  - Crash-proof UI    |
+---------------------------------------------------------------------------------------+
```

### Pillar 1: Interpretive Clarity (Disambiguation First)
- **Problem**: Words in natural language are polysemic. "Best", "top", "active", "churned", and "recent" have multiple conflicting definitions depending on the department or business unit.
- **Solution**: Querify treats ambiguity as a first-class citizen. Its multi-turn clarification engine quantifies linguistic and schema ambiguity. If confidence is below 100% or multiple metric paths exist, Querify prompts the user before touching the database.

### Pillar 2: AST-Verified Structural Safety
- **Problem**: LLMs generate syntactically plausible but destructive or dangerous SQL statements (e.g., unintended Cartesian joins, table drops, data mutation, or denial-of-service full-table scans).
- **Solution**: Every query must pass through a strict **JSqlParser Abstract Syntax Tree (AST)** security engine before execution:
  - Read-only enforcement (`SELECT` statements only).
  - Strict table and column whitelisting.
  - Semicolon-splitting and multi-statement injection blocking.
  - Mandatory row bounding (`LIMIT 100`) preventing memory exhaustion.

### Pillar 3: Resilient Edge Portability (Zero-Backend & Full-Stack Parity)
- **Problem**: Modern web applications must be demonstrable, shareable, and resilient across edge environments (like Vercel or Netlify) where monolithic Java backends might not be co-located or accessible.
- **Solution**: Querify features a **Dual-Engine Architecture**:
  - When running locally or in Docker with Spring Boot and MySQL, it operates as an enterprise full-stack analytical platform.
  - When hosted standalone on Vercel, it instantly activates its client-side fallback engine, offering 100% functional parity across all 4 sample schemas, interactive clarification modals, and visualizations with zero server dependencies and zero blank screens.

---

## 3. The Querify User Journey

```
[ User Input ]
      |
      v
[ Is Query Ambiguous? ]
      |
      +---> NO  ---> [ Schema-Grounded AI Generation ] ---> [ AST Security Guard ] ---> [ Execution & Charts ]
      |
      +---> YES ---> [ Clarification Modal Triggered ]
                            |
                     [ User Selects Metric: "Net Profit" ]
                            |
                            v
                     [ Intent Synthesized ] ---> [ Verified SQL Execution ]
```

1. **Ask in Plain Language**: The user types questions like *"Compare top AI model architectures by benchmark performance"* or *"Which companies raised the most capital in 2024?"*.
2. **Interactive Disambiguation**: When terms like *"top"* or *"most"* could mean revenue vs. benchmark score vs. funding, Querify highlights the ambiguity with interactive chips and modals.
3. **Transparent Execution**: The user sees the generated SQL, a plain-English explanation of why each `JOIN`, `WHERE`, and `GROUP BY` clause was chosen, and execution latency.
4. **Instant Visual Insights**: Results are automatically visualized via responsive Recharts (Bar, Line, or Pie) alongside a paginated, downloadable data table.
5. **Interactive Schema Discovery**: The Database Explorer lets non-technical users browse domains, inspect entity relationships, and test sample data queries.

---

## 4. Target Personas & Use Cases

| Persona | Pain Point | Querify Solution |
| :--- | :--- | :--- |
| **Product Managers** | Waiting days for data analysts to answer simple feature adoption questions. | Self-service natural language queries with guaranteed metric accuracy. |
| **Executive Leadership** | Making critical decisions on hallucinated or misunderstood LLM queries. | Guaranteed clarity through explicit clarification dialogs and AST validation. |
| **Data Engineers** | Overwhelmed by repetitive ad-hoc `SELECT` queries from non-technical teams. | Querify acts as an autonomous first-line data concierge with built-in safety limits. |
| **Academic & Industry Viva** | Presenting AI systems that lack explainability, security, or error resiliency. | Transparent 8-stage pipeline with complete mathematical and architectural auditability. |

---

## 5. Long-Term Evolution & Horizon

- **Phase 1 (Achieved)**: Core Spring Boot + MySQL + React 18 architecture with multi-turn clarification, AST security, and zero-backend Vercel demo fallback.
- **Phase 2 (Current)**: Archify system diagram generation, comprehensive formal specifications, automated testing suites, and standardized agent guidelines.
- **Phase 3 (Next)**: Multi-dialect SQL compilation (PostgreSQL, Snowflake, BigQuery, ClickHouse), vector-indexed schema search for 1000+ table databases, and LLM fine-tuning on dialect-specific AST structures.
