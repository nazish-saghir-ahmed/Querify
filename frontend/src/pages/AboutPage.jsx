import React from 'react';
import {
  BookOpen, Layers, Cpu, Sparkles, ShieldCheck, Database,
  HelpCircle, BarChart3, Zap, CheckCircle2, ShieldAlert
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full max-w-[1150px] mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* 1. PROJECT VISION */}
      <section className="p-7 sm:p-9 rounded-2xl bg-blue-950/20 border border-blue-800/40 backdrop-blur-xl space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Project Vision & Philosophy
          </h1>
        </div>
        <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed font-sans">
          In business analytics, ambiguity is the primary failure mode of text-to-SQL systems. 
          When a stakeholder asks a deceptively simple question like <em>"Who is our top client?"</em>, standard AI chatbots blindly assume a single metric (revenue, transaction count, retention, or profitability) and produce convincing but misleading numbers.
        </p>
        <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed font-sans">
          <strong>Querify</strong> solves this by introducing a <strong>Clarification Engine</strong> paired with a <strong>JSqlParser AST Security Guard</strong>. Execution halts when ambiguity is flagged, engaging the user in a rapid, structured clarification dialogue before generating mathematically sound, read-only SQL.
        </p>
      </section>

      {/* 2. SYSTEM ARCHITECTURE (5-LAYER ENTERPRISE FLOW) */}
      <section className="p-7 sm:p-9 rounded-2xl bg-blue-950/20 border border-blue-800/40 backdrop-blur-xl space-y-6 shadow-xl">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400 font-semibold">
            System Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white mt-1">
            End-to-End Enterprise Data Flow
          </h2>
        </div>

        {/* 5 Layer Cards in Strict Midnight Blue & White */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {/* Layer 1: React UI */}
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/60 space-y-2">
            <div className="flex items-center gap-2 text-white text-xs font-mono font-bold">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>1. React 18 UI</span>
            </div>
            <p className="text-xs text-blue-200/70 leading-relaxed font-sans">
              Vite 5, Tailwind CSS, Recharts. Dispatches REST requests & renders sticky tables.
            </p>
          </div>

          {/* Layer 2: Spring Boot API */}
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/60 space-y-2">
            <div className="flex items-center gap-2 text-white text-xs font-mono font-bold">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>2. Spring Boot 3</span>
            </div>
            <p className="text-xs text-blue-200/70 leading-relaxed font-sans">
              Java 17/21 REST Gateway. Handles session UUIDs, turns, and exception mapping.
            </p>
          </div>

          {/* Layer 3: Clarification & AI */}
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/60 space-y-2">
            <div className="flex items-center gap-2 text-white text-xs font-mono font-bold">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>3. AI Engine</span>
            </div>
            <p className="text-xs text-blue-200/70 leading-relaxed font-sans">
              Ambiguity detector, Gemini / Nemotron vector projections, and metric option synthesizer.
            </p>
          </div>

          {/* Layer 4: JSqlParser AST */}
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/60 space-y-2">
            <div className="flex items-center gap-2 text-white text-xs font-mono font-bold">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>4. AST Guard</span>
            </div>
            <p className="text-xs text-blue-200/70 leading-relaxed font-sans">
              Parses SQL tree. Strictly blocks DROP, DELETE, UPDATE, and statement chaining.
            </p>
          </div>

          {/* Layer 5: MySQL 8 */}
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/60 space-y-2">
            <div className="flex items-center gap-2 text-white text-xs font-mono font-bold">
              <Database className="w-4 h-4 text-blue-400" />
              <span>5. MySQL 8 Store</span>
            </div>
            <p className="text-xs text-blue-200/70 leading-relaxed font-sans">
              HikariCP pool, 6 relational domain tables, and in-memory H2 test fallback.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CORE ARCHITECTURE: ENGINEERED FOR PRECISION & SECURITY (Moved from Landing Page) */}
      <section className="p-7 sm:p-9 rounded-2xl bg-blue-950/20 border border-blue-800/40 backdrop-blur-xl space-y-6 shadow-xl">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400 font-semibold">
            Core Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white mt-1">
            Engineered for Precision & Security
          </h2>
          <p className="text-sm text-blue-200/80 mt-1 font-sans">
            Architectural guarantees designed to eliminate AI hallucination and database vulnerabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-900/60 hover:border-blue-600/60 transition-colors space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-white">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-display font-bold text-white">
              Clarification Engine
            </h3>
            <p className="text-xs text-blue-100/70 leading-relaxed font-sans">
              Multi-turn disambiguation algorithm that flags semantic gaps and guarantees user intent before query synthesis.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-900/60 hover:border-blue-600/60 transition-colors space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-display font-bold text-white">
              AST Security Guard
            </h3>
            <p className="text-xs text-blue-100/70 leading-relaxed font-sans">
              JSqlParser verifies queries into Abstract Syntax Trees, enforcing read-only SELECT limits and blocking injection attempts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-900/60 hover:border-blue-600/60 transition-colors space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-white">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-display font-bold text-white">
              Auto-Generated Charts
            </h3>
            <p className="text-xs text-blue-100/70 leading-relaxed font-sans">
              Automatic Recharts bar, line, and pie charts deduced directly from executed SQL column types and cardinality.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-900/60 hover:border-blue-600/60 transition-colors space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-white">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-display font-bold text-white">
              Zero-Setup Demo Mode
            </h3>
            <p className="text-xs text-blue-100/70 leading-relaxed font-sans">
              Instant standalone in-browser fallback. Visitors can test clarification, SQL, and charts without needing external API keys.
            </p>
          </div>
        </div>
      </section>

      {/* 4. ARCHITECTURAL DIFFERENTIATION: GUESSING BOT VS. QUERIFY (Moved from Landing Page) */}
      <section className="p-7 sm:p-9 rounded-2xl bg-blue-950/20 border border-blue-800/40 backdrop-blur-xl space-y-6 shadow-xl">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400 font-semibold">
            Architectural Differentiation
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white mt-1">
            Guessing Bot vs. Querify
          </h2>
          <p className="text-sm text-blue-200/80 mt-1 font-sans">
            Benchmark scenario: <span className="font-mono text-white">"Show me the best performing AI companies"</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Naive Chatbot Card (Midnight Blue & White Styling) */}
          <div className="p-6 rounded-2xl bg-blue-950/40 border border-blue-900/60 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-blue-900/40">
              <ShieldAlert className="w-5 h-5 text-blue-300" />
              <h3 className="font-display font-bold text-white text-base">
                Standard Text-to-SQL Chatbot
              </h3>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-blue-100/80 font-sans">
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-blue-400 font-bold">✕</span>
                <span><strong className="text-white">Blind Assumptions:</strong> Arbitrarily picks a column (e.g., parameter count or random score) without asking what you mean.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-blue-400 font-bold">✕</span>
                <span><strong className="text-white">Hallucinated Schemas:</strong> Invents non-existent column names or joins when unsure of relationships.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-blue-400 font-bold">✕</span>
                <span><strong className="text-white">Vulnerable Execution:</strong> Directly sends raw generated text to the database driver with zero AST verification.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-blue-400 font-bold">✕</span>
                <span><strong className="text-white">Misleading Visuals:</strong> Produces charts based on incorrect metrics, misguiding stakeholder decisions.</span>
              </li>
            </ul>
          </div>

          {/* Querify Card (Midnight Blue & Crisp White) */}
          <div className="p-6 rounded-2xl bg-blue-900/30 border border-blue-500/50 space-y-4 shadow-midnight">
            <div className="flex items-center gap-2.5 pb-3 border-b border-blue-900/40">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <h3 className="font-display font-bold text-white text-base">
                Querify Clarification Engine
              </h3>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-blue-100/90 font-sans">
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-white font-bold">✓</span>
                <span><strong className="text-white">Proactive Ambiguity Detection:</strong> Recognizes that "best performing" can mean revenue, net profit, growth rate, or ROI.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-white font-bold">✓</span>
                <span><strong className="text-white">Structured Disambiguation:</strong> Presents clear, keyboard-accessible choice cards to align human intent.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-white font-bold">✓</span>
                <span><strong className="text-white">JSqlParser AST Guard:</strong> Strictly verifies the Abstract Syntax Tree ensures only read-only <code className="text-blue-300">SELECT</code> queries run.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-white font-bold">✓</span>
                <span><strong className="text-white">Deterministic Visualizations:</strong> Accurately formats currencies, percentages, and outputs interactive Bar/Line/Pie charts.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
