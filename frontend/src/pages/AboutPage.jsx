import React, { useState } from 'react';
import {
  HelpCircle, ChevronDown, ChevronUp, Cpu, Database,
  ShieldCheck, Sparkles, BookOpen, Layers, Terminal, ArrowRight,
  ExternalLink, Github, Linkedin, CheckCircle2
} from 'lucide-react';

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const vivaQuestions = [
    {
      q: 'What is Text-to-SQL?',
      a: 'Text-to-SQL is a natural language processing technology that translates questions written in human language (like English) into structured, executable SQL queries without requiring the user to know SQL syntax, table schemas, or relational algebra.'
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
      a: 'We implement layered defense-in-depth: (1) JSqlParser parses the generated SQL into an Abstract Syntax Tree (AST), strictly verifying that the root statement is an instance of Select.class. (2) Semicolon Policy: A single trailing semicolon (;) is permitted and normalized as standard SQL statement termination, while multiple statements (statement chaining) are blocked via a lexical scanner. (3) Table Whitelist: Extracted tables must strictly match the 6 approved domain tables. (4) Bounded Execution: Automatic LIMIT 100 is injected and queries are executed with a timeout guard.'
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
      q: 'What database tables did you design for the AI finance domain?',
      a: 'We designed 6 interrelated tables: companies (central entity), ai_models (parameters and benchmark scores), financial_performance (multi-year revenue, profit, costs), ai_investments (capital and estimated ROI), research_projects (budgets and status), and market_performance (market share and performance indexes).'
    },
  ];

  return (
    <div className="w-full max-w-[1150px] mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* 1. PROJECT VISION */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[#111827] border border-[#1F2E47] space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-white font-sans">
            Project Vision & Core Philosophy
          </h1>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl font-sans">
          In business analytics, ambiguity is the primary failure mode of text-to-SQL systems. 
          When a stakeholder asks a deceptively simple question like <em>"Who is our top client?"</em>, standard AI chatbots blindly assume a metric (revenue, transaction count, retention, or profitability) and produce convincing but misleading numbers.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl font-sans">
          <strong>Querify</strong> solves this by introducing a <strong>Clarification Engine</strong> paired with a <strong>JSqlParser AST Security Guard</strong>. Execution halts when ambiguity is flagged, engaging the user in a rapid, structured clarification dialogue before generating mathematically sound, read-only SQL.
        </p>
      </section>

      {/* 2. ARCHITECTURE DIAGRAM */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[#111827] border border-[#1F2E47] space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
            System Architecture
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white font-sans mt-1">
            End-to-End Enterprise Data Flow
          </h2>
        </div>

        {/* Interactive Architecture Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Layer 1: React UI */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1F2E47] space-y-2">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-semibold">
              <Layers className="w-4 h-4" />
              <span>1. React 18 UI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vite 5, Tailwind CSS, Recharts. Dispatches REST requests & renders sticky tables.
            </p>
          </div>

          {/* Layer 2: Spring Boot API */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1F2E47] space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold">
              <Cpu className="w-4 h-4" />
              <span>2. Spring Boot 3</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Java 17/21 REST Gateway. Handles session UUIDs, turns, and exception mapping.
            </p>
          </div>

          {/* Layer 3: Clarification & AI */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1F2E47] space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>3. AI Engine</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ambiguity detector, Gemini / Nemotron vector projections, and metric option synthesizer.
            </p>
          </div>

          {/* Layer 4: JSqlParser AST */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1F2E47] space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>4. AST Guard</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Parses SQL tree. Strictly blocks DROP, DELETE, UPDATE, and statement chaining.
            </p>
          </div>

          {/* Layer 5: MySQL 8 */}
          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1F2E47] space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold">
              <Database className="w-4 h-4" />
              <span>5. MySQL 8 Store</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              HikariCP pool, 6 relational domain tables, and in-memory H2 test fallback.
            </p>
          </div>
        </div>
      </section>

      {/* 3. BUILT BY PORTFOLIO SECTION */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[#162238] border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-mono">
            <span>Portfolio Project</span>
          </div>
          <h2 className="text-xl font-bold text-white font-sans">
            Built by Nazish Saghir
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Full-stack software engineer specializing in developer tooling, resilient distributed architectures, AI agent integrations, and relational database systems.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <a
            href="https://github.com/nazish-saghir-ahmed/Querify"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B0F17] hover:bg-[#111827] text-white border border-[#1F2E47] text-xs font-medium transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-sm"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </div>
      </section>

      {/* 4. TECHNICAL VIVA VOCE ACCORDION */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-white font-sans">
            Technical Viva Voce Defense Guide
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Frequently asked questions, architectural defense points, and evaluation criteria.
          </p>
        </div>

        <div className="space-y-2.5">
          {vivaQuestions.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl bg-[#111827] border border-[#1F2E47] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="font-mono text-blue-400 text-xs font-bold">Q{index + 1}.</span>
                    <span>{item.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-400 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-[#1F2E47]/60 font-sans">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
