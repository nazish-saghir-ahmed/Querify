# SPEC-05: API Contracts & Client Fallback Specification

> **REST API Endpoints, Vercel SPA Rewrite Immunity, and Client-Side Fallback Protocol**

---

## 1. REST API Endpoint Contracts

### 1.1 Analyze Query
- **Path**: `POST /api/query/analyze`
- **Request Body**:
  ```json
  {
    "query": "Show top performing AI companies in 2024"
  }
  ```
- **Response (Status 200 - Clarification Needed)**:
  ```json
  {
    "status": "CLARIFICATION_NEEDED",
    "sessionId": "b6a8276f-4091-4d39-a864-dcbfa907480a",
    "clarificationQuestion": {
      "question": "What metric should define 'top performing'?",
      "options": [
        { "id": "opt_profit", "label": "Net Profit Margin (%)", "description": "Rank by net profit margin" },
        { "id": "opt_revenue", "label": "Annual Revenue ($M)", "description": "Rank by total annual revenue" },
        { "id": "opt_market_cap", "label": "Market Capitalization ($B)", "description": "Rank by market valuation" }
      ]
    }
  }
  ```
- **Response (Status 200 - Direct Execution)**:
  ```json
  {
    "status": "EXECUTED",
    "result": {
      "sql": "SELECT c.company_name, fp.annual_revenue_millions FROM companies c JOIN financial_performance fp ON c.company_id = fp.company_id WHERE fp.fiscal_year = 2024 ORDER BY fp.annual_revenue_millions DESC LIMIT 5",
      "explanation": "Joins companies and financial_performance filtering by fiscal_year 2024 and sorting by revenue descending.",
      "columns": ["company_name", "annual_revenue_millions"],
      "rows": [
        { "company_name": "Microsoft", "annual_revenue_millions": 245120.00 },
        { "company_name": "Google", "annual_revenue_millions": 307394.00 }
      ],
      "executionTimeMs": 42,
      "chartSuggestion": {
        "type": "BAR",
        "xAxisKey": "company_name",
        "dataKeys": ["annual_revenue_millions"],
        "title": "Top Companies by Revenue in 2024"
      }
    }
  }
  ```

---

### 1.2 Clarify Query Selection
- **Path**: `POST /api/query/clarify`
- **Request Body**:
  ```json
  {
    "sessionId": "b6a8276f-4091-4d39-a864-dcbfa907480a",
    "selectedOptionId": "opt_profit"
  }
  ```
- **Response (Status 200)**: Same structure as Direct Execution `QueryResultDto`.

---

### 1.3 Database Explorer Schema
- **Path**: `GET /api/database/schema`
- **Query Params**: `?domain=ecommerce` (optional)
- **Response (Status 200)**: Array of `TableSchemaDto` objects.

---

### 1.4 Query Execution History
- **Path**: `GET /api/history`
- **Response (Status 200)**:
  ```json
  [
    {
      "historyId": 1,
      "userQuery": "Show top 5 AI companies by revenue in 2024",
      "generatedSql": "SELECT ... LIMIT 5",
      "executionDurationMs": 38,
      "rowCount": 5,
      "status": "SUCCESS",
      "executedAt": "2026-10-23T06:45:00Z"
    }
  ]
  ```

---

### 1.5 System Health
- **Path**: `GET /api/health`
- **Response (Status 200)**:
  ```json
  {
    "status": "UP",
    "aiProvider": "GeminiAiProvider",
    "database": "MySQL 8.0.36",
    "activeConnections": 1,
    "version": "1.2.0"
  }
  ```

---

## 2. Vercel SPA Wildcard Rewrites & Content-Type Sniffing

### The Failure Mode
On Vercel, static frontends are deployed with single-page-app routing rules:
```json
{
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```
When the Java Spring Boot backend is not hosted on the same domain, any request to `/api/*` is rewritten to `/index.html` and returned with:
- **HTTP Status**: `200 OK`
- **Content-Type**: `text/html; charset=utf-8`
- **Body**: `<!doctype html>...`

In naive API clients, `res.ok` evaluates to `true`. Calling `res.json()` triggers a syntax error (`Unexpected token '<'`), which defaults to `{}`. When UI components call `.map()` on `{}`, an uncaught `TypeError` unmounts the React DOM, causing a dark blank screen.

### The Content-Type Defense Protocol
In [`frontend/src/services/api.js`](file:///D:/Querify/frontend/src/services/api.js):
```javascript
async function safeFetch(url, options) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    
    // Strict verification: Status must be OK AND Content-Type must be JSON
    if (res.ok && contentType.toLowerCase().includes('application/json')) {
      return await res.json();
    }
    
    // HTML rewrite detected (e.g., Vercel /index.html fallback)
    console.warn(`[Querify API] Backend unavailable or HTML rewrite received for ${url}. Activating client fallback engine.`);
    return null;
  } catch (err) {
    console.warn(`[Querify API] Network error for ${url}. Activating client fallback engine.`, err);
    return null;
  }
}
```

---

## 3. Client-Side Fallback Engine (`clientFallbackData.js`)

When `safeFetch()` returns `null`, the API wrapper routes the call to `clientFallbackData`:

| API Call | Fallback Method | Provided Data |
| :--- | :--- | :--- |
| `POST /api/query/analyze` | `clientFallbackData.analyzeQuery(prompt)` | Detects polysemy, triggers clarification modal, or returns mock SQL with Recharts bar/line/pie datasets. |
| `POST /api/query/clarify` | `clientFallbackData.clarifyQuery(session, id)` | Disambiguates selection and returns verified SQL with rows and chart payload. |
| `GET /api/database/schema` | `clientFallbackData.getSchema(domain)` | Returns complete schemas for `ecommerce`, `saas_analytics`, `hr_payroll`, and `fintech_ledger`. |
| `GET /api/database/sample/:table` | `clientFallbackData.getTableSample(table)` | Returns 5 realistic sample rows with column types and primary keys. |
| `GET /api/history` | `clientFallbackData.getHistory()` | Returns execution audit logs with realistic durations, timestamps, and row counts. |

This architecture ensures **100% demo availability** across all environments without relying on external cloud infrastructure.
