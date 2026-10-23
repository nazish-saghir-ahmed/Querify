import React from 'react';
import { Terminal, ShieldCheck, Database, BarChart3, HelpCircle, ArrowRight, CheckCircle2, Zap, Sparkles } from 'lucide-react';

export default function LandingPage({ setActiveTab, onSelectQuestion }) {
  const samplePrompts = [
    { text: 'Show me the best performing AI companies', isAmbiguous: true },
    { text: 'Which AI company made the most money?', isAmbiguous: true },
    { text: 'Show the top AI models', isAmbiguous: true },
    { text: 'Which AI companies have the highest revenue in 2024?', isAmbiguous: false },
    { text: 'Show the five most profitable companies.', isAmbiguous: false },
    { text: 'Which research projects have the largest budgets?', isAmbiguous: false },
  ];

  const handleLaunchWithPrompt = (promptText) => {
    if (onSelectQuestion) {
      onSelectQuestion(promptText);
    }
    setActiveTab('workspace');
  };

  return (
    <div className="relative z-10 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B263B]/70 border border-[#3A506B]/40 shadow-sm mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#7FA1C3] animate-pulse" />
          <span className="text-xs font-mono font-medium text-[#F7F3E9] tracking-wide">
            Clarification Engine • v1.2 Enterprise
          </span>
          <span className="text-[10px] font-mono bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/35 px-1.5 py-0.5 rounded">
            AST Guard
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-sans text-white max-w-4xl mx-auto leading-[1.1] sm:leading-[1.08]">
          Where English Meets <br />
          <span className="gradient-text-royal">Relational Precision.</span>
        </h1>

        <p className="mt-6 text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
          Translate analytical human questions into deterministic, AST-verified SQL queries. 
          Querify halts execution when ambiguity is detected, aligning intent before querying your database.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActiveTab('workspace')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-[#1D3557] hover:bg-[#14253D] text-[#F7F3E9] font-bold text-sm tracking-wide shadow-sm border border-[#3A506B]/80 transition-all transform hover:-translate-y-0.5"
          >
            <Terminal className="w-4 h-4 text-[#7FA1C3]" />
            <span>Launch Query Console</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1B263B]/60 hover:bg-[#1B263B] text-[#F7F3E9] border border-[#3A506B]/40 font-medium text-sm backdrop-blur-md transition-all"
          >
            <Database className="w-4 h-4 text-[#7FA1C3]" />
            <span>Inspect Schema Catalog</span>
          </button>
        </div>

        {/* Interactive Product Preview Console Window (Dark Navy Frosted Glass) */}
        <div className="mt-16 max-w-4xl mx-auto rounded-2xl p-1 bg-gradient-to-b from-[#D4AF37]/35 via-[#3A506B]/25 to-transparent shadow-2xl">
          <div className="rounded-[15px] bg-[#0D1B2A]/70 backdrop-blur-2xl border border-[#3A506B]/40 overflow-hidden text-left shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#1B263B]/50 backdrop-blur-md border-b border-[#3A506B]/35">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-[#D4AF37]/80" />
                <div className="w-3 h-3 rounded-full bg-[#7FA1C3]/80" />
                <span className="ml-2 text-xs font-mono text-slate-300">querify-console // runtime.sql</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Dialect: MySQL 8 (Read-Only)</span>
              </div>
            </div>

            {/* Window Content */}
            <div className="p-6 space-y-4">
              {/* Natural Query Step */}
              <div className="p-3.5 rounded-xl bg-[#0D1B2A]/60 backdrop-blur-md border border-[#3A506B]/35 flex items-center justify-between hover:border-[#7FA1C3]/50 transition-all">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs text-[#7FA1C3] font-bold">&gt;_</span>
                  <span className="text-[#F7F3E9] text-xs sm:text-sm font-sans">
                    "Show me the top performing AI companies in 2024"
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                  Ambiguity Flagged
                </span>
              </div>

              {/* Clarification Step */}
              <div className="p-4 rounded-xl bg-[#1B263B]/40 backdrop-blur-md border border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.08)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider font-mono">
                    <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Clarification Engine Active
                  </span>
                  <span className="text-[10px] font-mono text-slate-300">Select metric:</span>
                </div>
                <p className="text-xs text-[#F7F3E9] font-sans">
                  "Which metric should define company performance?"
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-[#1D3557] border border-[#3A506B] text-[#F7F3E9] font-semibold flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#D4AF37]" />
                    Annual Revenue
                  </div>
                  <div className="p-2 rounded-lg bg-[#0D1B2A]/60 backdrop-blur-sm border border-[#3A506B]/30 text-slate-300 hover:border-[#7FA1C3]/40 hover:text-white transition-all">
                    Net Profit
                  </div>
                  <div className="p-2 rounded-lg bg-[#0D1B2A]/60 backdrop-blur-sm border border-[#3A506B]/30 text-slate-300 hover:border-[#7FA1C3]/40 hover:text-white transition-all">
                    Revenue Growth
                  </div>
                  <div className="p-2 rounded-lg bg-[#0D1B2A]/60 backdrop-blur-sm border border-[#3A506B]/30 text-slate-300 hover:border-[#7FA1C3]/40 hover:text-white transition-all">
                    Investment ROI
                  </div>
                </div>
              </div>

              {/* Output SQL */}
              <div className="p-3.5 rounded-xl bg-[#0D1B2A]/60 backdrop-blur-md border border-[#3A506B]/35 font-mono text-xs text-[#7FA1C3] leading-relaxed">
                <span className="text-[#D4AF37] font-bold">SELECT</span> c.company_name, f.revenue_millions, f.profit_millions <br />
                <span className="text-[#D4AF37] font-bold">FROM</span> companies c <span className="text-[#D4AF37] font-bold">JOIN</span> financial_performance f <span className="text-[#D4AF37] font-bold">ON</span> c.company_id = f.company_id <br />
                <span className="text-[#D4AF37] font-bold">WHERE</span> f.fiscal_year = 2024 <span className="text-[#D4AF37] font-bold">ORDER BY</span> f.revenue_millions <span className="text-[#D4AF37] font-bold">DESC LIMIT 10;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Prompts Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-white font-sans">
            Explore Pre-calibrated Benchmark Queries
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Click any query to execute directly or test multi-turn disambiguation in the console.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleLaunchWithPrompt(p.text)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                p.isAmbiguous
                  ? 'bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/25'
                  : 'bg-[#1B263B]/50 backdrop-blur-md border-[#3A506B]/35 text-slate-300 hover:text-[#F7F3E9] hover:border-[#7FA1C3]/50 hover:bg-[#1B263B]/70'
              }`}
            >
              {p.isAmbiguous ? (
                <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-[#7FA1C3]" />
              )}
              <span className="font-mono text-[11px]">{p.text}</span>
              {p.isAmbiguous && (
                <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/35 ml-1">
                  Ambiguous
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* 4 Feature Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-[#0D1B2A]/70 backdrop-blur-xl border border-[#3A506B]/40 hover:border-[#7FA1C3]/50 transition-all group space-y-3 shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-sans">
              Clarification Engine
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Detects polysemic terms like "best" or "top" and pauses execution to prompt with targeted multi-turn options.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1B2A]/70 backdrop-blur-xl border border-[#3A506B]/40 hover:border-[#7FA1C3]/50 transition-all group space-y-3 shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-[#1D3557]/80 border border-[#3A506B]/60 flex items-center justify-center text-[#7FA1C3]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-sans">
              AST Security Guard
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              JSqlParser AST analysis strictly enforces read-only SELECT queries, table whitelisting, and automatic LIMIT 100 bounds.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1B2A]/70 backdrop-blur-xl border border-[#3A506B]/40 hover:border-[#7FA1C3]/50 transition-all group space-y-3 shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-[#1D3557]/80 border border-[#3A506B]/60 flex items-center justify-center text-[#7FA1C3]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-sans">
              Dynamic Visual Insights
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Automatic Recharts bar, line, and pie charts deduced directly from executed SQL columns and data cardinality.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1B2A]/70 backdrop-blur-xl border border-[#3A506B]/40 hover:border-[#7FA1C3]/50 transition-all group space-y-3 shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-sans">
              Enterprise Cloud & API Integration
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Real-time REST API integration with AST-guarded SQL generation, OpenRouter AI engine, and MySQL 8 relational schema catalog.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
