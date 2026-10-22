# Querify Database Design & Schema Specification

**Database Name:** `querify_db`  
**Database Engine:** MySQL 8.0 (InnoDB)  
**Character Encoding:** `utf8mb4`  
**Collation:** `utf8mb4_unicode_ci`

---

## 1. Domain & Academic Rationale

The selected analytical domain integrates **Artificial Intelligence Laboratories & Enterprise Tech Corporations, Business Finance, Capital Investments, Research Initiatives, and Market Dominance**.

This domain was specifically chosen because it provides rich analytical questions:
- Multi-table relational joins (`companies` joined with `financial_performance` and `ai_models`).
- Multi-year financial metrics (fiscal years 2022, 2023, 2024).
- Aggregations (`SUM`, `AVG`, `COUNT`), filtering (`WHERE`, `HAVING`), ranking (`ORDER BY DESC LIMIT`).
- Complex ambiguity scenarios where "best" or "most money" can mean revenue vs net profit vs investment ROI.

---

## 2. Table Specifications

### Table 1: `companies` (Central Parent Entity)
Stores primary corporate entities and research laboratories.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `company_id` | `INT` | `AUTO_INCREMENT, PRIMARY KEY` | Unique company identifier |
| `company_name` | `VARCHAR(100)` | `NOT NULL, UNIQUE` | Official entity name |
| `industry` | `VARCHAR(100)` | `NOT NULL` | Technology or market sector |
| `country` | `VARCHAR(50)` | `NOT NULL` | Country of headquarters |
| `founded_year` | `INT` | `NOT NULL` | Inception year |
| `company_type` | `VARCHAR(50)` | `NOT NULL` | Public, Private AI Lab, Enterprise Tech |
| `headquarters_city` | `VARCHAR(100)` | `NOT NULL` | Primary operational city |

---

### Table 2: `ai_models`
Catalogs prominent foundation models and standardized benchmark scores.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `model_id` | `INT` | `AUTO_INCREMENT, PRIMARY KEY` | Unique model identifier |
| `company_id` | `INT` | `NOT NULL, FK -> companies` | Owning developer company |
| `model_name` | `VARCHAR(100)` | `NOT NULL` | Model name (e.g. GPT-4o, Claude 3.5 Sonnet) |
| `model_category` | `VARCHAR(50)` | `NOT NULL` | LLM, Multimodal, Vision, Reasoning |
| `release_year` | `INT` | `NOT NULL` | Public release year (2022-2024) |
| `parameter_count_billions`| `DECIMAL(10,2)`| `NULLABLE` | Scale in billions of parameters |
| `performance_score` | `DECIMAL(5,2)` | `NOT NULL` | Standardized benchmark score (0-100) |

---

### Table 3: `financial_performance`
Multi-year financial filings. All monetary units in **Millions USD**.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `performance_id` | `INT` | `AUTO_INCREMENT, PRIMARY KEY` | Unique performance record ID |
| `company_id` | `INT` | `NOT NULL, FK -> companies` | Company evaluated |
| `fiscal_year` | `INT` | `NOT NULL` | Fiscal year (2022, 2023, 2024) |
| `revenue_millions` | `DECIMAL(12,2)`| `NOT NULL` | Top-line gross sales ($ Millions USD) |
| `profit_millions` | `DECIMAL(12,2)`| `NOT NULL` | Bottom-line net profit ($ Millions USD) |
| `operating_cost_millions`| `DECIMAL(12,2)`| `NOT NULL` | Operational costs & compute ($ Millions) |
| `revenue_growth_percent`| `DECIMAL(6,2)` | `NOT NULL` | YoY revenue growth percentage (%) |

*Constraint:* `UNIQUE KEY uq_company_year (company_id, fiscal_year)`

---

### Table 4: `ai_investments`
Tracks strategic capital allocations to AI clusters, silicon, and research.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `investment_id` | `INT` | `AUTO_INCREMENT, PRIMARY KEY` | Unique investment ID |
| `company_id` | `INT` | `NOT NULL, FK -> companies` | Investing company |
| `investment_year` | `INT` | `NOT NULL` | Year capital deployed |
| `investment_amount_millions`| `DECIMAL(12,2)`| `NOT NULL` | Capital amount ($ Millions USD) |
| `investment_category`| `VARCHAR(100)`| `NOT NULL` | Compute Infrastructure, AI Chips, etc. |
| `estimated_return_percent`| `DECIMAL(6,2)` | `NOT NULL` | Projected Return on Investment (%) |

---

### Table 5: `research_projects`
Frontier R&D initiatives, robotics, and scientific explorations.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `project_id` | `INT` | `AUTO_INCREMENT, PRIMARY KEY` | Unique research project ID |
| `company_id` | `INT` | `NOT NULL, FK -> companies` | Lead sponsoring company |
| `project_name` | `VARCHAR(150)`| `NOT NULL` | Project or code name |
| `research_area` | `VARCHAR(100)`| `NOT NULL` | Robotics, Reasoning, Drug Discovery |
| `budget_millions` | `DECIMAL(10,2)`| `NOT NULL` | R&D budget allocation ($ Millions USD) |
| `project_status` | `VARCHAR(50)` | `NOT NULL` | Active, Completed, Testing |
| `start_date` | `DATE` | `NOT NULL` | Project launch date |

---

### Table 6: `market_performance`
Market dominance, adoption velocity, and composite health indexes.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `market_id` | `INT` | `AUTO_INCREMENT, PRIMARY KEY` | Unique market record ID |
| `company_id` | `INT` | `NOT NULL, FK -> companies` | Company evaluated |
| `fiscal_year` | `INT` | `NOT NULL` | Evaluated fiscal year |
| `market_share_percent`| `DECIMAL(5,2)`| `NOT NULL` | Sector/global market share (%) |
| `customer_growth_percent`| `DECIMAL(6,2)`| `NOT NULL` | Customer / active user growth (%) |
| `performance_index`| `DECIMAL(5,2)`| `NOT NULL` | Composite health index (0-100) |

---

### Table 7: `query_history` (Backend Audit Store)
Stores every executed query, natural language prompt, duration, and status.

| Column | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `INT AUTO_INCREMENT PK` | History record ID |
| `natural_query` | `TEXT NOT NULL` | User's original prompt |
| `generated_sql` | `TEXT NOT NULL` | Executed SQL query |
| `status` | `VARCHAR(30)` | SUCCESS, FAILED, CLARIFIED |
| `explanation` | `TEXT` | Plain-English summary |
| `rows_returned` | `INT` | Number of returned records |
| `execution_time_ms`| `BIGINT` | Execution latency in milliseconds |
| `created_at` | `TIMESTAMP` | Execution timestamp |

---

## 3. Data Integrity & Educational Origin Notice

> **Academic Integrity Notice:** The dataset provided in `seed.sql` contains **realistic synthetic educational data**. Public tech figures (like NVIDIA revenue or Microsoft market valuations) reflect approximate historical scale, whereas private lab expenditures (such as OpenAI operating expenses or Anthropic compute budgets) represent carefully modeled educational approximations. This guarantees consistent, reproducible demonstration of analytical SQL operations across all university grading environments.
