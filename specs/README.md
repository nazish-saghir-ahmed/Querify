# Querify Formal Engineering Specifications (Specs)

> **Official Index of Technical Specifications for the Querify Text-to-SQL Clarification Engine**

---

## Specification Catalog

This directory contains formal, exhaustive specifications covering every subsystem, interface, and security boundary in the Querify project. All ongoing feature development and agent modifications must comply with these specifications.

| Spec ID | Document Title | Primary Focus | Status |
| :--- | :--- | :--- | :---: |
| **SPEC-01** | [`01_system_architecture_spec.md`](./01_system_architecture_spec.md) | End-to-end multi-tier architecture, network boundaries, and runtime topologies. | **Approved** |
| **SPEC-02** | [`02_clarification_engine_spec.md`](./02_clarification_engine_spec.md) | Ambiguity detection algorithms, polysemy classification, and session management. | **Approved** |
| **SPEC-03** | [`03_sql_generation_and_security_spec.md`](./03_sql_generation_and_security_spec.md) | Schema-grounded prompting, JSqlParser AST validation, and injection prevention. | **Approved** |
| **SPEC-04** | [`04_db_explorer_and_schema_catalog_spec.md`](./04_db_explorer_and_schema_catalog_spec.md) | Dynamic schema introspection, multi-domain catalogs, and sample data fixtures. | **Approved** |
| **SPEC-05** | [`05_api_and_client_fallback_spec.md`](./05_api_and_client_fallback_spec.md) | REST API contracts, Content-Type sniffing, and edge client fallback engine. | **Approved** |
| **SPEC-06** | [`06_frontend_ui_ux_spec.md`](./06_frontend_ui_ux_spec.md) | React 18 component tree, Tailwind design system, Recharts, and ErrorBoundary. | **Approved** |

---

## 🗺️ Interactive System Architecture Map

- **Standalone Interactive Diagram:** [`docs/querify-architecture.html`](../docs/querify-architecture.html)
- **Verifiable Architecture Source:** [`docs/querify-architecture.architecture.json`](../docs/querify-architecture.architecture.json)
- *Rendered using Archify 3.2.0 (100% SVG showcase quality, path tracing, and dark/light mode).*

---

## Architectural Principles

1. **Zero Hallucination via Disambiguation**: Polysemic natural language input must trigger targeted clarification before touching the database or generating SQL.
2. **Deterministic AST Security**: All SQL must be validated at the Abstract Syntax Tree level (`JSqlParser`), enforcing read-only `SELECT` queries, strict table whitelisting, and mandatory `LIMIT 100` clauses.
3. **Dual-Engine High Availability**: The frontend must provide 100% feature parity (query execution, clarification dialogs, schema exploration, audit history) whether connected to the live Spring Boot backend or running in edge client fallback mode.
4. **Resilient Failure Boundaries**: No uncaught exception may unmount the React DOM tree. All network interactions must inspect response content types, and all collections must be guarded against non-array payloads.
