# Querify — Text-to-SQL Clarification Engine

> **Tagline:** Ask in English. Understand your data.  
> **Project Type:** University Capstone & Full-Stack AI Software Project  
> **Technology Stack:** Java 17/21 LTS (Spring Boot 3), MySQL 8, React 18, Vite, Tailwind CSS, Recharts, JSqlParser

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnazish-saghir-ahmed%2FQuerify&root-directory=frontend)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Querify-blue?logo=github)](https://github.com/nazish-saghir-ahmed/Querify)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌐 Live Vercel Deployment & Links

- **GitHub Repository:** [https://github.com/nazish-saghir-ahmed/Querify](https://github.com/nazish-saghir-ahmed/Querify)
- **1-Click Deploy on Vercel:** [Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnazish-saghir-ahmed%2FQuerify&root-directory=frontend) &mdash; Click to instantly build and deploy your live URL.
- **Vercel Project Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard) &mdash; View your deployed live domain.
- **Full Cloud Deployment Guide:** See [docs/deployment-guide.md](docs/deployment-guide.md) for step-by-step instructions.

---

## 📚 Project Governance, Architecture & Engineering Specs

| Document | Purpose |
| :--- | :--- |
| **[VISION.md](VISION.md)** | Overarching philosophy, problem statement, and 3 core architectural pillars. |
| **[GOALS.md](GOALS.md)** | Strategic OKRs, performance targets, and milestone roadmap (Phases 1–4). |
| **[DECISIONS.md](DECISIONS.md)** | Official Architectural Decision Records (ADR-001 through ADR-010). |
| **[AGENT.md](AGENT.md)** | Comprehensive developer & AI agent playbook, rules, directory map, and troubleshooting. |
| **[Engineering Specs Suite](specs/README.md)** | Formal specifications for Architecture, Clarification, AST Security, DB Explorer, APIs, and UI/UX. |

---

## 1. Project Overview

**Querify** is an AI-powered Text-to-SQL Clarification Engine that allows non-technical users to query relational databases using ordinary English.

Most conventional text-to-SQL chatbots naively guess when faced with ambiguous requests. If a user asks *"Show me the best performing AI companies"*, a basic bot randomly picks a metric without asking. 

**Querify introduces an autonomous Clarification Engine** that detects semantic ambiguity, pauses execution, prompts the user with structured clarification options (Revenue vs Profit vs Investment ROI vs Growth Rate), and then synthesizes a verified, safe SQL query executed against real MySQL 8 records.

### Key Highlights
- **Intelligent Clarification Engine:** Multi-turn session management resolving metric and entity ambiguity before SQL generation.
- **AST Security Guard & Semicolon Normalizer:** `JSqlParser` parses the Abstract Syntax Tree (AST) to strictly enforce read-only `SELECT` queries, whitelisting 6 domain tables and blocking all mutation commands (`DROP`, `DELETE`, `INSERT`, `UPDATE`, `ALTER`). A syntax-aware lexical scanner normalizes single trailing semicolons while strictly blocking statement chaining.
- **Real MySQL 8 Database:** A complete domain featuring 20 AI companies, multi-year financial performance (2022–2024), AI models, capital investments, and research projects.
- **Dynamic Data Visualization:** Recharts-powered Bar, Line, and Pie charts deduced directly from executed SQL columns and data patterns.
- **Zero-Downtime Offline Demo Mode:** Works 100% offline with zero API keys required, while supporting live Google Gemini API connectivity when configured.
- **Production-Grade Architecture:** Spring Boot REST APIs, clean packaging (`com.querify`), 28 automated tests (100% passing), and a Dark Navy Blue UI.

---

## 2. System Architecture

```
+-----------------------------------------------------------------------------------+
|                              REACT 18 VITE FRONTEND                               |
|                                                                                   |
|  [ Natural Language Input ] ----> [ Clarification Dialog ] ----> [ Recharts / Table ]|
+-----------------------------------------------------------------------------------+
                                         |
                                         | HTTP JSON REST (/api/query/analyze, clarify)
                                         v
+-----------------------------------------------------------------------------------+
|                            SPRING BOOT JAVA 17/21 BACKEND                         |
|                                                                                   |
|  1. Intent Extraction & Ambiguity Analyzer (ClarificationEngine)                   |
|  2. Multi-Turn Session State Manager (ClarificationSession)                       |
|  3. Swappable AI Engine (Google Gemini 1.5/2.0 REST or Offline DemoMode Engine)    |
|  4. Abstract Syntax Tree (AST) Security Guard (JSqlParser AST Verification)        |
|  5. Query Execution & Metadata Extractor (JdbcTemplate with Query Timeout)        |
+-----------------------------------------------------------------------------------+
                                         |
                                         | Controlled TCP Connection (HikariCP)
                                         v
+-----------------------------------------------------------------------------------+
|                                 MYSQL 8 DATABASE                                  |
|                                                                                   |
|  Schema: querify_db (companies, ai_models, financial_performance, ai_investments,  |
|                      research_projects, market_performance, query_history)        |
+-----------------------------------------------------------------------------------+
```

---

## 3. Repository Directory Structure

```text
Querify/
├── backend/
│   ├── pom.xml                               # Maven project definition (Spring Boot 3.3.4)
│   ├── mvnw.cmd                              # Windows Maven wrapper with SSL truststore
│   ├── mvnw                                  # Unix/macOS Maven wrapper
│   ├── README.md                             # Backend documentation
│   └── src/
│       ├── main/
│       │   ├── java/com/querify/
│       │   │   ├── QuerifyApplication.java   # Spring Boot entry point
│       │   │   ├── ai/                       # AI provider abstraction & Gemini client
│       │   │   ├── clarification/            # Ambiguity rules & multi-turn session store
│       │   │   ├── config/                   # CORS and application properties
│       │   │   ├── controller/               # Query, Database, History, Health APIs
│       │   │   ├── dto/                      # Type-safe request/response transfer objects
│       │   │   ├── exception/                # Global exception handling (@RestControllerAdvice)
│       │   │   ├── model/                    # JPA Entities for the 6 domain tables
│       │   │   ├── repository/               # QueryHistoryRepository
│       │   │   └── sql/                      # JSqlParser AST validator & JdbcTemplate runner
│       │   └── resources/
│       │       └── application.properties    # Environment-based backend configuration
│       └── test/
│           ├── java/com/querify/             # 28 Unit & Integration tests (100% passing)
│           └── resources/                    # H2 MySQL-mode test schema and data
├── frontend/
│   ├── package.json                          # React 18, Vite 5, Tailwind CSS, Recharts
│   ├── vite.config.js                        # Vite config with reverse-proxy to :8080
│   ├── tailwind.config.js                    # Custom neon-accented futuristic palette
│   ├── postcss.config.js                     # PostCSS config
│   ├── index.html                            # HTML entry point with Inter & JetBrains Mono
│   ├── README.md                             # Frontend documentation
│   └── src/
│       ├── components/                       # ClarificationModal, SqlViewer, ResultTable, ResultChart
│       ├── pages/                            # LandingPage, WorkspacePage, ExplorerPage, HistoryPage, AboutPage
│       ├── services/                         # api.js REST client
│       ├── App.jsx                           # Main application container
│       ├── index.css                         # Tailwind directives & glow utilities
│       └── main.jsx                          # React mount entry
├── database/
│   ├── schema.sql                            # Complete MySQL 8 table DDL definitions
│   ├── seed.sql                              # 20 AI companies & multi-year financial data
│   └── reset.sql                             # Safe teardown script
├── docs/
│   ├── architecture.md                       # Comprehensive architecture specification
│   ├── api-guide.md                          # REST API endpoint reference
│   ├── database-design.md                    # Database ER documentation & data integrity notice
│   ├── demo-guide.md                         # 5-minute live demonstration script & Gemini guide
│   └── viva-preparation.md                   # 20+ university teacher viva questions & answers
├── .env.example                              # Environment configuration template
├── .gitignore                                # Comprehensive gitignore for secrets & builds
├── LICENSE                                   # MIT Open Source License
└── README.md                                 # Primary repository manual
```

---

## 4. Step-by-Step Installation & Setup (Windows & VS Code)

### Prerequisites

| Software | Minimum Version | Download Link | Verification Command |
| :--- | :--- | :--- | :--- |
| **Java JDK** | Java 17, 21, or 27 | [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) | `java -version` |
| **Node.js** | v18.0.0+ | [Node.js Official](https://nodejs.org/) | `node -v` |
| **npm** | v9.0.0+ | (Bundled with Node.js) | `npm -v` |
| **MySQL Server** | MySQL 8.0+ | [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) | Check Windows Services (`MySQL80`) |
| **Git** | 2.30+ | [Git for Windows](https://git-scm.com/) | `git --version` |
| **VS Code** | Latest | [Visual Studio Code](https://code.visualstudio.com/) | `code --version` |

---

### Step 1: Database Setup (MySQL 8)

1. Open **MySQL Workbench** (or your preferred MySQL client) and connect as `root`.
2. Open the file `D:\Querify\database\schema.sql` and execute the entire script. This creates `querify_db` and the 6 domain tables plus `query_history`.
3. Open `D:\Querify\database\seed.sql` and execute the script. This populates 20 companies, AI models, 3 years of financial records, investments, and projects.
4. Verify by running:
   ```sql
   USE querify_db;
   SELECT COUNT(*) FROM companies; -- Returns 20
   SELECT COUNT(*) FROM financial_performance; -- Returns 56 records
   ```

*(Optional) Create a read-only MySQL user for production security:*
```sql
CREATE USER IF NOT EXISTS 'querify_readonly'@'localhost' IDENTIFIED BY 'ReadOnlyPass123!';
GRANT SELECT ON querify_db.* TO 'querify_readonly'@'localhost';
FLUSH PRIVILEGES;
```

---

### Step 2: Backend Setup (Spring Boot)

1. Open PowerShell in `D:\Querify\backend`:
   ```powershell
   cd D:\Querify\backend
   ```
2. Verify your database password in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```
3. Run the automated tests to ensure everything is verified:
   ```powershell
   .\mvnw.cmd test
   ```
   *(Expected: `Tests run: 23, Failures: 0, Errors: 0, BUILD SUCCESS`)*
4. Start the Spring Boot application:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
5. Verify the backend health endpoint by opening `http://localhost:8080/api/health` in your browser. It will return:
   ```json
   { "status": "UP", "databaseConnected": true, "aiMode": "demo" }
   ```

---

### Step 3: Frontend Setup (React + Vite)

1. Open a new PowerShell window in `D:\Querify\frontend`:
   ```powershell
   cd D:\Querify\frontend
   ```
2. Install npm dependencies:
   ```powershell
   npm install
   ```
3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```
5. You will see the **Querify Landing Page** with live connectivity to your local Spring Boot backend!

---

## 5. Free AI API Setup (Google Gemini)

Querify runs **out-of-the-box in Demo Mode** with zero API keys required. To connect live Google Gemini:

1. Obtain a free API key at [Google AI Studio](https://aistudio.google.com/) (Click **"Get API key"** -> **"Create API key"**). No credit card required.
2. In `backend/src/main/resources/application.properties`, configure:
   ```properties
   ai.mode=live
   ai.provider=gemini
   ai.model=gemini-1.5-flash
   ai.apiKey=AIzaSyYourKeyHere
   ```
3. Restart the backend. The Navbar will now display **"Live Gemini"**.
4. If the key expires, internet drops, or quota limits are exceeded, **Querify automatically falls back to Demo Mode** so your demonstration never fails!

---

## 6. Sample Questions for Demonstration

### Ambiguous Questions (Triggers the Clarification Engine)
- *"Show me the best performing AI companies"* (Prompts for Revenue vs Profit vs Growth vs ROI)
- *"Which AI company made the most money?"* (Prompts for Revenue vs Net Profit vs Investment Capital)
- *"Show the top AI models"* (Prompts for Benchmark Score vs Parameter Size vs Category)
- *"Which companies are growing fast?"* (Prompts for Revenue Growth vs Customer Growth)
- *"Show recent investments"* (Prompts for Capital Amount vs Projected ROI)
- *"Compare company performance"* (Prompts for Financials vs Market Share)

### Direct Questions (Directly Generates & Executes SQL)
- *"Which AI companies have the highest revenue in 2024?"*
- *"Show the five most profitable companies."*
- *"Compare revenue across companies in 2024."*
- *"Which AI models have the highest performance scores?"*
- *"Show companies with revenue above 500 million dollars."*
- *"Which companies increased their revenue between 2023 and 2024?"*
- *"What is the average AI investment by company?"*
- *"Which research projects have the largest budgets?"*
- *"Show revenue trends over the available years."*
- *"List all AI companies founded after 2015"*

---

## 7. Troubleshooting Common Problems

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **`Access denied for user 'root'@'localhost'`** | Incorrect MySQL root password | Edit `spring.datasource.password` in `backend/src/main/resources/application.properties` to match your local password. |
| **`Communications link failure`** | MySQL Server is not running | Open Windows Services (`services.msc`), find `MySQL80`, and click **Start**. |
| **`PKIX path building failed` in Maven** | Windows corporate proxy/SSL certificate inspection | Run `.\mvnw.cmd` (it is pre-configured with `-Djavax.net.ssl.trustStoreType=WINDOWS-ROOT`). |
| **`CORS policy: No 'Access-Control-Allow-Origin'`** | Frontend port mismatch | Access the frontend via `http://localhost:5173`. `CorsConfig.java` permits ports `5173` and `3000`. |
| **`429 Rate Limit Exceeded` from Gemini** | API quota exceeded | The backend automatically falls back to Demo Mode with zero interruption. |
| **`npm ERR! code ENOENT`** | Command run in wrong folder | Ensure your terminal is in `D:\Querify\frontend` before running `npm install` or `npm run dev`. |

---

## 8. GitHub Upload Instructions

To upload Querify to your GitHub account:

1. Open PowerShell in `D:\Querify`:
   ```powershell
   cd D:\Querify
   ```
2. Initialize Git and add files:
   ```powershell
   git init
   git add .
   git commit -m "feat: complete Querify Text-to-SQL Clarification Engine project"
   ```
3. Create a new repository on [GitHub](https://github.com/new) named `Querify`.
4. Link and push your repository:
   ```powershell
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/Querify.git
   git push -u origin main
   ```

---

## 9. Academic Evaluation & Viva Voce Guide

Refer to [docs/viva-preparation.md](docs/viva-preparation.md) for 20+ comprehensive questions and answers covering:
- Text-to-SQL vs Clarification Engine differences.
- AST SQL security validation with JSqlParser.
- Relational schema design and 1-to-many relationships.
- Multi-turn state management and session timeouts.
- Educational synthetic dataset integrity rationale.

---

## 10. License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
