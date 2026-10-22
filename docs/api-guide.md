# Querify REST API Reference

All Querify backend APIs are exposed under the `/api` root path. The Spring Boot backend listens on port `8080`.

---

## 1. Query Lifecycle Endpoints

### `POST /api/query/analyze`
Submits a natural language question. The backend performs intent analysis and ambiguity detection.

- **Request Body:**
```json
{
  "question": "Show me the best performing AI companies",
  "sessionId": null
}
```

- **Response (Case A - Ambiguity Detected):**
```json
{
  "status": "CLARIFICATION_NEEDED",
  "sessionId": "4a7f23e1-88bc-4b92-b413-9a3d46f5e2a1",
  "originalQuestion": "Show me the best performing AI companies",
  "clarification": {
    "questionId": "clarify_best_performing",
    "prompt": "What would you like to use to measure company performance?",
    "context": "The term 'best performing' can refer to several different business and financial metrics in the database.",
    "options": [
      {
        "id": "opt_highest_rev",
        "label": "Highest Revenue",
        "description": "Rank companies by their 2024 annual revenue (USD Millions)",
        "value": "highest_revenue"
      },
      {
        "id": "opt_highest_profit",
        "label": "Highest Net Profit",
        "description": "Rank companies by their net profitability in fiscal 2024",
        "value": "highest_profit"
      },
      {
        "id": "opt_highest_growth",
        "label": "Highest Revenue Growth Rate",
        "description": "Rank companies by year-over-year revenue growth percentage",
        "value": "highest_revenue_growth"
      },
      {
        "id": "opt_highest_roi",
        "label": "Highest AI Investment Return",
        "description": "Rank companies by estimated ROI on their AI initiatives",
        "value": "highest_investment_roi"
      }
    ]
  },
  "generatedSql": null,
  "explanation": null,
  "data": null
}
```

- **Response (Case B - Unambiguous Question):**
```json
{
  "status": "SQL_GENERATED",
  "sessionId": "4a7f23e1-88bc-4b92-b413-9a3d46f5e2a1",
  "originalQuestion": "Which AI companies have the highest revenue in 2024?",
  "generatedSql": "SELECT c.company_name, f.revenue_millions, f.profit_millions FROM companies c JOIN financial_performance f ON c.company_id = f.company_id WHERE f.fiscal_year = 2024 ORDER BY f.revenue_millions DESC LIMIT 10;",
  "explanation": "Identifies AI companies with the highest revenue in fiscal year 2024.",
  "data": {
    "status": "SUCCESS",
    "columns": ["company_name", "revenue_millions", "profit_millions"],
    "rows": [
      { "company_name": "NVIDIA", "revenue_millions": 122000.00, "profit_millions": 68000.00 },
      { "company_name": "Microsoft AI", "revenue_millions": 38500.00, "profit_millions": 14200.00 }
    ],
    "rowCount": 2,
    "executionTimeMs": 18,
    "sql": "SELECT ...",
    "explanation": "Identifies AI companies...",
    "chartSuggestion": {
      "type": "bar",
      "xAxis": "company_name",
      "yAxis": "revenue_millions",
      "title": "Revenue Millions by Company Name"
    }
  }
}
```

---

### `POST /api/query/clarify`
Submits the user's chosen clarification option for an existing active session.

- **Request Body:**
```json
{
  "sessionId": "4a7f23e1-88bc-4b92-b413-9a3d46f5e2a1",
  "selectedOptionId": "opt_highest_rev",
  "customInput": "Limit to top 5"
}
```

- **Response:**
Returns `QueryAnalyzeResponse` with `status: "SQL_GENERATED"` and the executed `QueryResultDto`.

---

### `POST /api/query/execute`
Directly executes an approved SQL string with AST security verification.

- **Request Body:**
```json
{
  "sql": "SELECT company_name, industry FROM companies WHERE country = 'USA' LIMIT 5;",
  "naturalQuery": "Show US AI companies",
  "explanation": "Displays US companies"
}
```

- **Response:**
Returns `QueryResultDto`.

- **Security Rejection Response (HTTP 403 Forbidden):**
```json
{
  "status": "SECURITY_VIOLATION",
  "error": "Query Security Violation",
  "message": "Only read-only SELECT queries are permitted. Database modifications (INSERT, UPDATE, DELETE, DROP, ALTER) are blocked.",
  "timestamp": "2026-10-22T21:00:00"
}
```

---

## 2. Database Explorer Endpoints

### `GET /api/database/schema`
Returns full table definitions, column types, primary keys, and foreign keys for all 6 domain tables.

### `GET /api/database/tables`
Returns list of approved domain tables with live row counts.

### `GET /api/database/tables/{tableName}/sample`
Returns 10 sample records from the specified table.

---

## 3. Query History Endpoints

### `GET /api/history`
Returns the 50 most recent executed queries with duration and row counts.

### `DELETE /api/history/{id}`
Deletes an individual history audit record.

### `DELETE /api/history`
Clears the entire query audit history table.

---

## 4. Diagnostics & Health Endpoint

### `GET /api/health`
Checks MySQL connectivity and reports AI engine mode.

- **Response:**
```json
{
  "status": "UP",
  "databaseConnected": true,
  "databaseEngine": "MySQL 8.0.36",
  "aiProvider": "demo",
  "aiMode": "demo",
  "uptimeSeconds": 142
}
```
