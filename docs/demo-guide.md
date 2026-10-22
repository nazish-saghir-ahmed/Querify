# Querify Demonstration & AI API Guide

This guide is designed for presenting Querify during academic project evaluations, viva voce, and live demonstrations.

---

## 1. 5-Minute Live Viva Demonstration Script

Follow these steps to demonstrate every core feature of Querify to your teachers:

### Step 1: Open the Landing Page
- Point out the branding: **Querify: Ask in English. Understand your data.**
- Show the **System Status Indicator** in the Navbar (`MySQL Connected`, `Demo Engine` or `Live Gemini`).
- Show the 4 core pillars: **Clarification Engine**, **AST Security Guard**, **Visual Data Insights**, and **Offline Demo Mode**.
- Click the **"Launch Querify"** button to enter the Workspace.

### Step 2: Demonstrate the Clarification Engine (The Main Feature!)
- In the Query input box, enter or click:
  `"Show me the best performing AI companies"`
- Explain to the examiner: *"Notice that 'best performing' is ambiguous. A basic chatbot would guess, but Querify's Clarification Engine detects the ambiguity and prompts the user."*
- Show the **Clarification Modal**:
  - Point out the question: *"What would you like to use to measure company performance?"*
  - Review the candidate options:
    - **Highest Revenue** (ranks by 2024 revenue in millions USD)
    - **Highest Net Profit** (ranks by net income after operating costs)
    - **Highest Revenue Growth Rate** (ranks by YoY percentage growth)
    - **Highest AI Investment Return** (ranks by ROI %)
- Select **"Highest Revenue"** and click **"Confirm & Generate SQL"**.

### Step 3: Inspect the Generated SQL & Security Guard
- Show the **Generated SQL Panel**:
  ```sql
  SELECT c.company_name, f.revenue_millions, f.profit_millions, f.revenue_growth_percent 
  FROM companies c 
  JOIN financial_performance f ON c.company_id = f.company_id 
  WHERE f.fiscal_year = 2024 
  ORDER BY f.revenue_millions DESC LIMIT 10;
  ```
- Highlight the **"AST Security Verified (SELECT Only)"** badge.
- Explain: *"JSqlParser parsed the abstract syntax tree to verify this is strictly a read-only SELECT referencing only approved domain tables. It is executed via Spring Boot JdbcTemplate with a 5-second timeout."*
- Click **"Copy SQL"** to demonstrate clipboard integration.

### Step 4: Examine the Results Table & Charts
- Show the live results: NVIDIA, Microsoft AI, Amazon AWS AI, Meta AI, Apple AI, etc.
- Demonstrate table features:
  - Click **Column Header** to sort by `revenue_millions`.
  - Type `"NVIDIA"` into the **Quick Search** box to filter rows.
  - Click **"Export CSV"** to demonstrate instant CSV downloading.
- Switch to the **"Visual Chart"** view:
  - Show the dynamic **Bar Chart** automatically rendered by Recharts.
  - Hover over bars to show custom formatted neon tooltips (`$122,000 M`).
  - Toggle between **Bar**, **Line**, and **Pie** charts.

### Step 5: Test Unambiguous Direct Queries
- Enter: `"Which AI models have the highest performance scores?"`
- Explain: *"Because this question is already specific, the Clarification Engine recognizes there is no ambiguity and directly generates and executes the query!"*

### Step 6: Explore the Database Schema
- Click the **"DB Explorer"** tab in the Navbar.
- Show the 6 domain tables (`companies`, `ai_models`, `financial_performance`, etc.).
- Click **"Live Sample Records"** to show actual live data retrieved from MySQL.
- Click **"View Entity Relationships (ERD)"** to show the 1-to-many architecture connecting the central `companies` table to the child tables.

### Step 7: Inspect Audit History
- Click the **"History"** tab in the Navbar.
- Show the persistent record of all executed questions, generated SQL, execution durations in milliseconds, and row counts.
- Click **"Re-run in Workspace"** on any past query to demonstrate replayability.

---

## 2. Free AI API Configuration Guide (Google Gemini)

Querify includes an AI provider abstraction that allows seamless switching between **Offline Demo Mode** and **Live Google Gemini API**.

### How to Get a Free Gemini API Key (No Credit Card Required)
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with any personal Google account.
3. Click the **"Get API key"** button on the left sidebar.
4. Click **"Create API key in new project"**.
5. Copy the generated key (it starts with `AIzaSy...`).

> **Note on Free Tier Allowance:** Google Gemini offers a generous free tier allowance for models like `gemini-1.5-flash` with zero billing setup required.

### How to Configure the Key in Querify
In `backend/src/main/resources/application.properties` (or via environment variables):
```properties
ai.provider=gemini
ai.apiKey=AIzaSyYourGeneratedKeyHere
ai.model=gemini-1.5-flash
ai.mode=live
```

Or set in PowerShell before launching the backend:
```powershell
$env:AI_MODE="live"
$env:AI_API_KEY="AIzaSyYourGeneratedKeyHere"
```

### Automatic Fail-Safe Fallback
If your internet drops, the API quota is temporarily exceeded, or an invalid key is supplied, **Querify automatically detects the error and seamlessly falls back to the Demo Mode Engine**. Your demonstration will never fail in front of an examiner!
