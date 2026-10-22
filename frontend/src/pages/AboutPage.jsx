import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Cpu, Database, ShieldCheck, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const vivaQuestions = [
    {
      q: 'What is Text-to-SQL?',
      a: 'Text-to-SQL is a natural language processing technology that translates questions written in human language (like English) into structured, executable SQL database queries without requiring the user to know SQL syntax, table schemas, or relational algebra.'
    },
    {
      q: 'What is a Clarification Engine, and how is Querify different from a standard chatbot?',
      a: 'A standard text-to-SQL chatbot naively guesses what a user means when faced with ambiguous requests. For instance, if you ask "Which company is best?", a basic bot randomly picks revenue, profit, or market share. Querify is a Clarification Engine: it actively detects semantic ambiguity, pauses query execution, and asks targeted, structured follow-up questions to resolve the user\'s exact intent before generating and executing SQL.'
    },
    {
      q: 'Why did you use Java and Spring Boot for the backend?',
      a: 'Java is an industry-standard, strongly typed, enterprise-grade language. Spring Boot provides robust REST APIs, built-in dependency injection, connection pooling via HikariCP, controlled execution via JdbcTemplate, and seamless integration with SQL AST parsers like JSqlParser for strict security enforcement.'
    },
    {
      q: 'Why did you choose MySQL 8 as the database?',
      a: 'MySQL 8 is the world\'s most popular open-source relational database management system. It provides full ACID compliance, indexed foreign keys, strong data types, and enterprise reliability for analytical financial and business metrics.'
    },
    {
      q: 'How does the AI understand the database tables and columns?',
      a: 'The system uses Schema Grounding. When formatting system prompts for the AI, the backend injects the exact database schema: table names, column data types, foreign key relationships, and monetary units (USD Millions). This grounds the model and prevents hallucinated table or column names.'
    },
    {
      q: 'How do you prevent destructive or dangerous SQL (SQL Injection, DROP TABLE, etc.)?',
      a: 'We implement defense-in-depth: (1) JSqlParser parses the generated SQL into an Abstract Syntax Tree (AST), strictly verifying that the root statement is a SELECT. (2) Any INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, or multi-statement query is blocked with an HTTP 403 Forbidden. (3) Table names are checked against a strict whitelist of 6 approved domain tables. (4) System schemas like information_schema are barred. (5) Queries are executed with a timeout and safe row limits.'
    },
    {
      q: 'What happens if the external AI API is down or unavailable?',
      a: 'Querify has an integrated offline Demo Mode. It uses a deterministic local rule engine that matches canonical analytical patterns, handles multi-turn clarification, and generates valid SQL without requiring an internet connection or external API key.'
    },
    {
      q: 'Why is there a separate Java backend instead of calling the AI and database directly from React?',
      a: 'Security and architectural separation of concerns. The browser must never hold database credentials (root passwords) or secret AI API keys. The backend acts as a secure controller that authenticates requests, validates SQL syntax, and isolates the database behind a firewall.'
    },
    {
      q: 'How does the frontend communicate with the Java backend?',
      a: 'The React frontend uses HTTP REST requests (fetch API) exchanging JSON payloads over endpoints like POST /api/query/analyze and POST /api/query/clarify. In development, Vite reverse-proxies /api to http://localhost:8080.'
    },
    {
      q: 'How does the multi-turn clarification state management work?',
      a: 'When an ambiguous question is submitted, the backend creates a ClarificationSession with a unique UUID. It stores the original question, pending options, and turn count. When the user selects an option in the modal, the frontend sends the sessionId and optionId back to POST /api/query/clarify. The backend merges the selection into the query context and resumes execution.'
    },
    {
      q: 'What database tables did you design for the AI finance domain?',
      a: 'We designed 6 interrelated tables: companies (central entity), ai_models (parameters and benchmark scores), financial_performance (multi-year revenue, profit, costs), ai_investments (capital and estimated ROI), research_projects (budgets and status), and market_performance (market share and performance indexes).'
    },
    {
      q: 'How does the system automatically decide whether to render a table, bar chart, or line chart?',
      a: 'The SqlExecutionService analyzes the returned result metadata. If columns include temporal data (like fiscal_year or start_date), it recommends a Line Chart. If it has categorical names (like company_name) and numeric values (like revenue_millions), it recommends a Bar Chart. If it has percentages or market share with <= 8 rows, it suggests a Pie Chart.'
    },
    {
      q: 'What is an Abstract Syntax Tree (AST) in SQL validation?',
      a: 'An AST is a hierarchical tree representation of the syntactic structure of source code. By converting raw SQL strings into an AST using JSqlParser, we inspect the actual semantic nodes rather than relying on weak regex pattern matching, guaranteeing no hidden mutation keywords exist inside subqueries or comments.'
    },
    {
      q: 'Why did you use synthetic data for financial numbers?',
      a: 'To guarantee data integrity and academic honesty. Real proprietary AI lab financials (like OpenAI or Anthropic operating costs) are private or unverified. Clearly labeling data as realistic synthetic educational data ensures transparent evaluation while fully demonstrating complex SQL aggregation and ranking.'
    },
    {
      q: 'Can the clarification engine handle multi-year comparisons?',
      a: 'Yes! The database includes data for fiscal years 2022, 2023, and 2024. For questions like "Which companies increased revenue between 2023 and 2024?", the engine generates a self-join query comparing financial_performance rows across both years.'
    },
    {
      q: 'How are empty query results handled?',
      a: 'If a query executes successfully but matches zero rows (for example, companies founded after 2030), the backend returns an empty row list with valid column metadata. The frontend renders a clean empty state rather than crashing.'
    },
    {
      q: 'What is CORS and why is it needed?',
      a: 'Cross-Origin Resource Sharing (CORS) is a browser security mechanism that restricts HTTP requests initiated from scripts outside the origin domain. We configured CorsConfig in Spring Boot to permit requests from the Vite frontend (http://localhost:5173).'
    },
    {
      q: 'How are query history and audit trails stored?',
      a: 'Successful and failed queries are persisted to the query_history table in MySQL using Spring Data JPA. This records the natural query, generated SQL, execution duration in milliseconds, rows returned, and timestamps.'
    },
    {
      q: 'What are the main limitations of the current system?',
      a: 'Current limitations: it operates on a single relational database schema; it currently supports read-only analytical queries rather than database modifications; and it limits results to 100 rows for performance safety.'
    },
    {
      q: 'What future enhancements could be added?',
      a: 'Future enhancements could include multi-database connection switching, vector embedding search for domain terminology, voice-to-text input, and automated PDF report generation.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#080B14] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="pb-4 border-b border-[#1E293B]">
        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
          Documentation & Viva Preparation
        </span>
        <h2 className="text-3xl font-extrabold text-white mt-1">
          System Architecture & Viva Guide
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          Comprehensive university evaluation guide covering the problem statement, system architecture,
          database design, AST security verification, clarification algorithm, and 20+ teacher questions.
        </p>
      </div>

      {/* Problem & Solution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#101827] border border-[#1E293B] shadow-card-dark space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Problem Statement</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Relational databases power global business, but retrieving actionable insights requires proficiency in SQL, table schemas, join keys, and aggregation functions. Non-technical executives, researchers, and students struggle to extract data directly. Furthermore, traditional text-to-SQL chatbots naively guess user intentions when queries contain semantic ambiguity, returning inaccurate or misleading data without warning.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#101827] border border-[#1E293B] shadow-card-dark space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Proposed Solution: Querify</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Querify bridges natural human language and relational databases with a dedicated <strong className="text-white">Clarification Engine</strong>. When a user asks an ambiguous question ("best performing companies"), Querify detects the ambiguity, pauses execution, and presents targeted multi-turn clarification choices (revenue vs profit vs ROI) before executing safe, AST-validated SQL against MySQL.
          </p>
        </div>
      </div>

      {/* System Architecture Diagram */}
      <div className="p-6 rounded-2xl bg-[#101827] border border-[#1E293B] shadow-card-dark space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            End-to-End System Pipeline
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Data flows sequentially through 8 controlled stages to guarantee safety, precision, and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-[#080B14] border border-[#1E293B] space-y-1">
            <span className="text-purple-400 font-bold">STAGE 1: INPUT</span>
            <p className="font-sans text-slate-300 font-semibold">Natural Language Query</p>
            <p className="font-sans text-[11px] text-slate-500">React frontend sends English question to Spring Boot REST endpoint.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#080B14] border border-amber-500/40 space-y-1">
            <span className="text-amber-400 font-bold">STAGE 2 & 3: ENGINE</span>
            <p className="font-sans text-slate-300 font-semibold">Ambiguity Detection</p>
            <p className="font-sans text-[11px] text-slate-500">Clarification engine inspects intent. Multi-turn session pauses if metric is ambiguous.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#080B14] border border-cyan-500/40 space-y-1">
            <span className="text-cyan-400 font-bold">STAGE 4 & 5: AI GEN</span>
            <p className="font-sans text-slate-300 font-semibold">Schema-Grounded SQL</p>
            <p className="font-sans text-[11px] text-slate-500">AI service generates SQL strictly grounded in the 6 domain tables.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#080B14] border border-emerald-500/40 space-y-1">
            <span className="text-emerald-400 font-bold">STAGE 6 & 7: EXECUTE</span>
            <p className="font-sans text-slate-300 font-semibold">AST Guard & MySQL</p>
            <p className="font-sans text-[11px] text-slate-500">JSqlParser verifies SELECT-only; JdbcTemplate queries MySQL 8 and visualizes results.</p>
          </div>
        </div>
      </div>

      {/* 20+ Viva Preparation Questions */}
      <div className="p-6 rounded-2xl bg-[#101827] border border-[#1E293B] shadow-card-dark space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            University Viva Voce Preparation (20+ Questions & Answers)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Click on any question below to study concise, professional answers designed for professors and examiners.
          </p>
        </div>

        <div className="space-y-3">
          {vivaQuestions.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#1E293B] bg-[#151E30]/70 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4 hover:bg-[#1B263D] transition-colors"
                >
                  <span className="font-semibold text-sm text-white">
                    {idx + 1}. {item.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-[#1E293B]/40 bg-[#080B14]/40 font-sans">
                    <p className="mt-2.5">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
