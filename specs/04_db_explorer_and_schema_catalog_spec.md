# SPEC-04: Database Explorer & Schema Catalog Specification

> **Multi-Domain Schema Catalogs, Table Introspection, and Sample Data Fixtures**

---

## 1. Explorer Purpose & User Experience

The **Database Explorer** (`ExplorerPage.jsx`) enables users to explore relational schemas without writing SQL. It serves three core purposes:
1. **Domain Contextualization**: Users can inspect table structures, column definitions, data types, and primary/foreign keys to formulate better questions.
2. **Multi-Industry Demonstration**: Showcases Querify's adaptability across 4 enterprise business verticals.
3. **Data Verification**: Enables 1-click inspection of sample rows to understand real data formats, numerical ranges, and categorical codes.

---

## 2. Multi-Domain Schema Registry

Querify maintains 4 standardized enterprise schema domains:

```
+-----------------------------------------------------------------------------------+
|                         ENTERPRISE SCHEMA REGISTRY (4 DOMAINS)                    |
+-----------------------------------------------------------------------------------+
| 1. E-COMMERCE RETAIL (`ecommerce`)                                                |
|    - products (product_id, name, category, price, stock_quantity, rating)         |
|    - customers (customer_id, full_name, email, country, loyalty_tier)             |
|    - orders (order_id, customer_id, order_date, total_amount, status)             |
|    - order_items (item_id, order_id, product_id, quantity, unit_price)            |
|    - reviews (review_id, product_id, customer_id, rating, comment)                |
+-----------------------------------------------------------------------------------+
| 2. SAAS ANALYTICS (`saas_analytics`)                                              |
|    - tenants (tenant_id, company_name, tier, mrr, seat_count, created_at)         |
|    - subscriptions (sub_id, tenant_id, plan_name, renewal_date, status)           |
|    - feature_usage (usage_id, tenant_id, feature_key, event_count, logged_date)   |
|    - invoices (invoice_id, tenant_id, amount_usd, due_date, payment_status)       |
+-----------------------------------------------------------------------------------+
| 3. HR & PAYROLL (`hr_payroll`)                                                    |
|    - departments (dept_id, dept_name, budget_millions, head_count, manager_id)    |
|    - employees (emp_id, full_name, dept_id, job_title, hire_date, email)          |
|    - salaries (salary_id, emp_id, base_salary, bonus, effective_year)             |
|    - performance_reviews (review_id, emp_id, rating_score, review_date)           |
+-----------------------------------------------------------------------------------+
| 4. FINTECH & LEDGER (`fintech_ledger`)                                            |
|    - accounts (account_id, user_id, account_type, balance_usd, status)            |
|    - transactions (txn_id, sender_account, receiver_account, amount, txn_type)    |
|    - cards (card_id, account_id, card_brand, exp_date, daily_limit)               |
|    - compliance_audits (audit_id, txn_id, risk_score, flagged_reason, status)     |
+-----------------------------------------------------------------------------------+
```

---

## 3. Metadata DTO Specifications

### 3.1 Column Schema (`ColumnSchemaDto`)
```json
{
  "columnName": "net_profit_margin",
  "dataType": "DECIMAL(5,2)",
  "isPrimaryKey": false,
  "isForeignKey": false,
  "isNullable": true,
  "description": "Net profit margin expressed as a percentage"
}
```

### 3.2 Table Schema (`TableSchemaDto`)
```json
{
  "tableName": "financial_performance",
  "rowCount": 35,
  "description": "Annual financial statements including revenue and profit",
  "columns": [
    { "columnName": "financial_id", "dataType": "INT", "isPrimaryKey": true, "isForeignKey": false },
    { "columnName": "company_id", "dataType": "INT", "isPrimaryKey": false, "isForeignKey": true },
    { "columnName": "fiscal_year", "dataType": "INT", "isPrimaryKey": false, "isForeignKey": false },
    { "columnName": "annual_revenue_millions", "dataType": "DECIMAL(10,2)", "isPrimaryKey": false, "isForeignKey": false },
    { "columnName": "net_profit_margin", "dataType": "DECIMAL(5,2)", "isPrimaryKey": false, "isForeignKey": false }
  ]
}
```

---

## 4. Frontend Component Safeguards

To prevent runtime errors when loading schema catalogs:
1. **Defensive Guard**:
   ```javascript
   const safeSchemaList = Array.isArray(schemas) ? schemas : [];
   const safeTableList = Array.isArray(selectedSchema?.tables) ? selectedSchema.tables : [];
   ```
2. **Active Schema Selector**: Tabbed pill UI switching between domains with zero page reload.
3. **Interactive Search**: Real-time filtering of tables and columns matching search keywords.
4. **Sample Data Drawer**: Clicking a table loads the first 5 sample rows with column header badges indicating Primary Key (`PK`) or Foreign Key (`FK`).

---

## 5. Verified Database Tier Architecture

Querify operates with transparent runtime database mode detection across three verified execution tiers:

```
+-----------------------------------------------------------------------------------+
|                        RUNTIME DATABASE EXECUTION TIERS                           |
+-----------------------------------------------------------------------------------+
| Tier 1: Live MySQL 8.0                                                            |
| - Production / Local database connected via HikariCP on port 3306.                |
| - 6 AI domain tables + query_history audit log.                                    |
| - Full ACID transactions and relational foreign key constraints.                  |
+-----------------------------------------------------------------------------------+
| Tier 2: Fail-Safe Embedded In-Memory Database (H2 Engine)                         |
| - Automatically activated in Spring Boot when MySQL 8 is unreachable.             |
| - Configured in MySQL compatibility mode (`MODE=MySQL`).                         |
| - Populated at startup from `schema.sql` and `seed.sql` with 20 AI companies.    |
| - Guarantees full Spring Boot REST API functionality without manual DB setup.     |
+-----------------------------------------------------------------------------------+
| Tier 3: Edge Standalone Client Fallback                                           |
| - Static frontend deployment on Vercel or when backend is offline.               |
| - Powered by `clientFallbackData.js` with full query clarification, schema        |
|   inspection, and execution simulations.                                          |
+-----------------------------------------------------------------------------------+
```

### Transparent Runtime Mode Indicator
In [`Navbar.jsx`](file:///D:/Querify/frontend/src/components/Navbar.jsx), the application queries `/api/health` and displays an authentic indicator pill:
- **Live MySQL 8.0**: Green status badge with live TCP connection count.
- **Embedded In-Memory (H2)**: Emerald status badge indicating fail-safe in-memory database.
- **Edge Standalone (Mock Fixture)**: Amber status badge indicating edge client fallback mode.
