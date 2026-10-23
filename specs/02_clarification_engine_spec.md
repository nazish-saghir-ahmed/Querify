# SPEC-02: Clarification Engine Specification

> **Ambiguity Detection Taxonomy, Session State Machine, and Multi-Turn Disambiguation Protocols**

---

## 1. Ambiguity Detection Taxonomy

Natural language queries directed at relational databases frequently contain ambiguities that naive Text-to-SQL models either guess incorrectly or fail to resolve. Querify classifies ambiguity into four distinct categories:

### 1.1 Polysemic Metric Ambiguity (Metric Overload)
- **Definition**: A superlative or qualitative adjective maps to multiple valid mathematical metrics in the database.
- **Examples**:
  - *"best performing"* -> Net Profit, Revenue Growth, Benchmark Accuracy, or Stock Price.
  - *"biggest"* -> Market Cap, Total Headcount, Revenue, or Number of Active Models.
  - *"most successful"* -> Total Funding Raised vs. Annual Net Income.

### 1.2 Entity & Domain Ambiguity
- **Definition**: A query references an entity that exists in multiple distinct relational tables.
- **Examples**:
  - *"Show Apple"* -> Organization in `companies` table vs. Vendor in `ai_investments` vs. Hardware Provider.

### 1.3 Temporal Granularity Ambiguity
- **Definition**: The time horizon is underspecified.
- **Examples**:
  - *"recent revenue"* -> Fiscal Year 2024, Q4 2024, or Trailing Twelve Months (TTM).

### 1.4 Structural & Aggregation Ambiguity
- **Definition**: The requested aggregation level (e.g., individual records vs. grouped averages) is unspecified.
- **Examples**:
  - *"model performance across companies"* -> Average benchmark per company vs. raw model benchmark records.

---

## 2. Detection Algorithm & Confidence Scoring

The `ClarificationEngine` parses the input query through a 3-tier heuristic filter:

```
[ Natural Language Query ]
            |
            v
+-------------------------------+
| Tier 1: Explicit Metric Check | ---> Explicit Metric Detected? ---> Bypass Clarification
+-------------------------------+      (e.g., "annual revenue", "parameter count")
            | (No explicit metric)
            v
+-------------------------------+
| Tier 2: Polysemic Regex Match | ---> Polysemic Trigger Found?  ---> Flag Ambiguity (100%)
+-------------------------------+      ("top", "best", "performing", "growth")
            | (No polysemic words)
            v
+-------------------------------+
| Tier 3: Entity Count Check    | ---> Multiple Tables Match?    ---> Flag Ambiguity (80%)
+-------------------------------+
            |
            v
[ Confidence Calibrated: Pass to SQL Generation or Halt for Clarification ]
```

### Heuristic Match Rules

```java
// Polysemic Superlative Patterns
private static final Pattern POLYSEMIC_PERFORMANCE_PATTERN = 
    Pattern.compile("\\b(best|top|greatest|leading|most successful)\\s+(performing|ai|companies|models)?\\b", Pattern.CASE_INSENSITIVE);

private static final Pattern POLYSEMIC_FINANCE_PATTERN = 
    Pattern.compile("\\b(made the most money|highest earner|most profitable|most valuable)\\b", Pattern.CASE_INSENSITIVE);

private static final Pattern POLYSEMIC_GROWTH_PATTERN = 
    Pattern.compile("\\b(fastest growing|highest growth|expanding rapidly)\\b", Pattern.CASE_INSENSITIVE);
```

If any polysemic pattern matches, the engine calculates ambiguity confidence $C_{\text{amb}} \ge 0.85$, halting direct SQL generation and generating a `ClarificationSession`.

---

## 3. Session State Machine & Lifecycle

```
       +--------------------+
       |      CREATED       |
       +--------------------+
                 |
                 v  (Return HTTP 200 with status: CLARIFICATION_NEEDED)
       +--------------------+
       | AWAITING_SELECTION | <----+ (User views ClarificationModal)
       +--------------------+      |
                 |                 | (Timeout > 15 mins -> EXPIRED)
                 v                 |
       [ User Selects Option ]     |
                 |                 |
                 v                 v
       +--------------------+   +--------------------+
       |      RESOLVED      |   |      EXPIRED       |
       +--------------------+   +--------------------+
                 |
                 v
       [ Disambiguated Prompt Synthesized ]
                 |
                 v
       [ Executed via Pipeline A ]
```

### Session State Attributes (`ClarificationSession.java`)
- `sessionId`: `UUID.randomUUID().toString()`
- `originalQuery`: The raw user query.
- `detectedAmbiguityType`: e.g., `METRIC_POLYSEMY`.
- `question`: The clarifying question presented to the user.
- `options`: List of `ClarificationOption` DTOs:
  - `id`: e.g., `"opt_profit"`, `"opt_revenue"`, `"opt_market_cap"`.
  - `label`: Human-readable label (e.g., *"Net Profit Margin (%)"*).
  - `description`: Explanatory business definition.
  - `targetColumn`: Resolved database column (e.g., `financial_performance.net_profit_margin`).
- `createdAt`: Timestamp (milliseconds).
- `expiresAt`: `createdAt + 900,000` (15-minute TTL).

---

## 4. Prompt Augmentation & Context Synthesis

When the user selects an option via `POST /api/query/clarify`, the backend does not simply re-run the question with a simple string replace. It performs **Semantic Synthesis**:

1. **Original Context Preservation**: Extracted temporal entities (e.g., *"in 2024"*), ordering constraints (e.g., *"top 5"*), and domain filters (e.g., *"US-based"*) are retained.
2. **Metric Injection**: The ambiguous term (e.g., *"best performing"*) is substituted with the verified column and formula:
   $$\text{Original: } \text{"Show me the top 5 performing AI companies in 2024"}$$
   $$\text{Option Selected: } \text{"Net Profit Margin"}$$
   $$\text{Synthesized Prompt: } \text{"Show the top 5 AI companies ranked by net_profit_margin in fiscal year 2024"}$$
3. **Audit Tracking**: The chosen clarification is logged into `query_history` alongside the raw query to track user disambiguation preferences over time.

---

## 5. Client-Side Fallback Engine Simulation

To guarantee zero dependency on backend availability during standalone Vercel hosting, [`clientFallbackData.js`](file:///D:/Querify/frontend/src/services/clientFallbackData.js) replicates this exact state machine:
- Detects the identical polysemic triggers via client-side regex.
- Generates ephemeral session IDs (`demo_session_<timestamp>`).
- Returns standardized `QueryAnalyzeResponse` payloads with options.
- Resolves clarification selections immediately in-memory with pre-compiled AST-safe SQL queries and Recharts datasets.
