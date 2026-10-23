import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Cpu, Database, ShieldCheck, Sparkles, BookOpen, Layers, Terminal, ArrowRight } from 'lucide-react';

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
      q: 'What database engine modes are supported and verified?',
      a: 'Querify supports three verified execution tiers: (1) Production Live MySQL 8.0 instance via JDBC and HikariCP connection pool; (2) Intelligent Fail-Safe In-Memory H2 Database in MySQL mode, automatically auto-seeded with 20 companies, models, financials, and investments if MySQL is offline; and (3) Serverless Cloud API Integration with OpenRouter AI embedding projections and AST security safeguards.'
    },
    {
      q: 'How does the AI understand the database tables and columns?',
      a: 'The system uses Schema Grounding. When formatting system prompts for the AI, the backend injects the exact database schema: table names, column data types, foreign key relationships, and monetary units (USD Millions). This grounds the model and prevents hallucinated table or column names.'
    },
    {
      q: 'How do you prevent destructive or dangerous SQL (SQL Injection, DROP TABLE, etc.)?',
      a: 'We implement layered defense-in-depth: (1) JSqlParser parses the generated SQL into an Abstract Syntax Tree (AST), strictly verifying that the root statement is an instance of net.sf.jsqlparser.statement.select.Select. (2) Semicolon Policy: A single trailing semicolon (;) is permitted and normalized as standard SQL statement termination, while multiple statements (statement chaining) are blocked via a syntax-aware lexical scanner that respects quotes and comments. (3) Table Whitelist: Extracted tables must strictly match the 6 approved domain tables. (4) System schemas like information_schema and time-based sleep/benchmark functions are prohibited. (5) Bounded Execution: Automatic LIMIT 100 is injected and queries are executed with a 5000ms timeout guard.'
    },
    {
      q: 'How is NVIDIA Nemotron 3.5 Embed integrated via OpenRouter SDK?',
      a: 'Querify integrates @openrouter/sdk to query NVIDIA’s frontier nvidia/nemotron-3.5-embed-1b:free model on OpenRouter. For every query submitted, it computes a 2048-dimensional dense float vector embedding, inspects the vector slices, and projects semantic cosine similarity against relational schema tables in real-time.'
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
      a: 'The React frontend uses HTTP REST requests (fetch API) exchanging JSON payloads over endpoints like POST /api/query/analyze and POST /api/query/clarify. In development, Vite reverse-proxies /api to http://localhost:8080. If the server returns a 403 or 400 error, the client transparently parses and displays the real rejection details.'
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
      q: 'How are company names prevented from appearing as null in results?',
      a: 'The JDBC ResultSetMetaData can return qualified column names like "c.company_name" or uppercase identifiers like "COMPANY_NAME". The SqlExecutionService strips table qualifier prefixes, maps normalized column labels, and populates row maps with case-insensitive keys. In the frontend, ResultTable and ResultChart use resilient fallback resolvers to ensure company labels always bind accurately.'
    },
    {
      q: 'How is revenue growth formatted in tables, charts, and exports?',
      a: 'Revenue growth represents a percentage rate (e.g., 100.25%). The ResultTable, ResultChart, and CSV exporter evaluate percentage and growth keywords prior to general currency keywords, ensuring that values like revenue_growth_percent are accurately displayed with percentage formatting (100.25%) rather than currency ($100.25 M).'
    },
    {
      q: 'How are query history and audit trails stored?',
      a: 'Successful and failed queries are persisted to the query_history table in MySQL/H2 using Spring Data JPA. This records the natural query, generated SQL, execution duration in milliseconds, rows returned, and timestamps across user sessions.'
    },
    {
      q: 'How is CSV export protected against formula injection?',
      a: 'When exporting query results to CSV, untrusted cell values beginning with formula characters (=, +, -, @) are sanitized by prefixing a single quote (\'), preventing spreadsheet applications like Microsoft Excel or Google Sheets from executing arbitrary formulas.'
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
    <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="pb-4 border-b border-[#3A506B]/35">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#D4AF37] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/35">
            Documentation & Defense Guide
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F7F3E9] mt-2 font-sans tracking-tight">
          System Architecture & Viva Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Comprehensive university evaluation guide covering the problem statement, system architecture,
          database design, AST security verification, clarification algorithm, and 20+ teacher questions.
        </p>
      </div>

      {/* Problem & Solution Cards (Dark Navy Frosted Glass) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#0D1B2A]/70 backdrop-blur-xl border border-[#3A506B]/40 space-y-3 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-[#1D3557]/80 border border-[#3A506B]/60 flex items-center justify-center text-[#7FA1C3]">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-[#F7F3E9] font-sans">Problem Statement</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Relational databases power global business, but retrieving actionable insights requires proficiency in SQL, table schemas, join keys, and aggregation functions. Non-technical executives and researchers struggle to extract data directly. Furthermore, traditional text-to-SQL chatbots naively guess user intentions when queries contain semantic ambiguity, returning inaccurate or misleading data without warning.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0D1B2A]/70 backdrop-blur-xl border border-[#3A506B]/40 space-y-3 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-[#F7F3E9] font-sans">Proposed Solution: Querify</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Querify bridges natural human language and relational databases with a dedicated <strong className="text-white">Clarification Engine</strong>. When a user asks an ambiguous question ("best performing companies"), Querify detects the ambiguity, pauses execution, and presents targeted multi-turn clarification choices (revenue vs profit vs ROI) before executing safe, AST-validated SQL against MySQL.
          </p>
        </div>
      </div>

      {/* System Architecture Diagram (Dark Navy Frosted Box) */}
      <div className="p-6 rounded-2xl bg-[#0D1B2A]/70 backdrop-blur-xl border border-[#3A506B]/40 space-y-6 shadow-lg">
        <div>
          <h3 className="text-base font-bold text-[#F7F3E9] flex items-center gap-2 font-mono">
            <Layers className="w-4 h-4 text-[#7FA1C3]" />
            <span>End-to-End System Pipeline</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1 font-sans">
            Data flows sequentially through 8 controlled stages to guarantee safety, precision, and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-[#1B263B]/50 border border-[#3A506B]/35 space-y-1 backdrop-blur-md">
            <span className="text-[#7FA1C3] font-bold">STAGE 1: INPUT</span>
            <p className="font-sans text-[#F7F3E9] font-semibold">Natural Language Query</p>
            <p className="font-sans text-[11px] text-slate-300">React frontend sends English question to Spring Boot REST endpoint.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#1B263B]/50 border border-[#D4AF37]/40 space-y-1 backdrop-blur-md">
            <span className="text-[#D4AF37] font-bold">STAGE 2 & 3: ENGINE</span>
            <p className="font-sans text-[#F7F3E9] font-semibold">Ambiguity Detection</p>
            <p className="font-sans text-[11px] text-slate-300">Clarification engine inspects intent. Multi-turn session pauses if metric is ambiguous.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#1B263B]/50 border border-[#3A506B]/35 space-y-1 backdrop-blur-md">
            <span className="text-[#7FA1C3] font-bold">STAGE 4 & 5: AI GEN</span>
            <p className="font-sans text-[#F7F3E9] font-semibold">Schema-Grounded SQL</p>
            <p className="font-sans text-[11px] text-slate-300">AI service generates SQL strictly grounded in the 6 domain tables.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#1B263B]/50 border border-emerald-500/35 space-y-1 backdrop-blur-md">
            <span className="text-emerald-400 font-bold">STAGE 6 & 7: EXECUTE</span>
            <p className="font-sans text-[#F7F3E9] font-semibold">AST Guard & Database</p>
            <p className="font-sans text-[11px] text-slate-300">JSqlParser verifies SELECT-only; JdbcTemplate queries MySQL 8/H2 and visualizes results.</p>
          </div>
        </div>
      </div>

      {/* 20+ Viva Preparation Questions */}
      <div className="p-6 rounded-2xl bg-[#0D1B2A]/70 backdrop-blur-xl border border-[#3A506B]/40 space-y-6 shadow-lg">
        <div>
          <h3 className="text-lg font-bold text-[#F7F3E9] flex items-center gap-2 font-sans">
            <HelpCircle className="w-5 h-5 text-[#7FA1C3]" />
            <span>University Viva Voce Preparation (20+ Questions & Answers)</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1 font-sans">
            Click on any question below to study concise, professional answers designed for professors and examiners.
          </p>
        </div>

        <div className="space-y-2.5">
          {vivaQuestions.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#3A506B]/35 bg-[#1B263B]/40 overflow-hidden transition-all backdrop-blur-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors"
                >
                  <span className="font-semibold text-xs sm:text-sm text-[#F7F3E9] font-sans">
                    {idx + 1}. {item.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#7FA1C3] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-[#3A506B]/25 bg-[#0D1B2A]/60 font-sans">
                    <p className="mt-3 leading-relaxed">{item.a}</p>
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
