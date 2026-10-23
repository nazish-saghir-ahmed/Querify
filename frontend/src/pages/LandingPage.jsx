import React from 'react';
import { Terminal, ShieldCheck, Database, BarChart3, HelpCircle, ArrowRight, CheckCircle2, Zap, Sparkles, Layers, Cpu } from 'lucide-react';

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
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A0E17]/90 border border-white/[0.08] shadow-sm mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-pulse" />
          <span className="text-xs font-mono font-medium text-slate-300 tracking-wide">
            Clarification Engine • v1.2 Enterprise
          </span>
          <span className="text-[10px] font-mono bg-[#00F5A0]/10 text-[#00F5A0] border border-[#00F5A0]/25 px-1.5 py-0.5 rounded">
            AST Guard
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-sans text-white max-w-4xl mx-auto leading-[1.1] sm:leading-[1.08]">
          Where English Meets <br />
          <span className="gradient-text-brand">Relational Precision.</span>
        </h1>

        <p className="mt-6 text-sm sm:text-base lg:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans">
          Translate analytical human questions into deterministic, AST-verified SQL queries. 
          Querify halts execution when ambiguity is detected, aligning intent before querying your database.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActiveTab('workspace')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-[#00F5A0] hover:bg-[#00DF89] text-[#06080D] font-bold text-sm tracking-wide shadow-[0_0_25px_-3px_rgba(0,245,160,0.4)] transition-all transform hover:-translate-y-0.5"
          >
            <Terminal className="w-4 h-4" />
            <span>Launch Query Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0A0E17]/90 hover:bg-[#0F1523] text-slate-300 hover:text-white border border-white/[0.1] font-medium text-sm transition-all"
          >
            <Database className="w-4 h-4 text-[#00F5A0]" />
            <span>Inspect Schema Catalog</span>
          </button>
        </div>

        {/* Interactive Product Preview Console Window */}
        <div className="mt-16 max-w-4xl mx-auto rounded-2xl p-1 bg-gradient-to-b from-white/[0.15] via-white/[0.04] to-transparent shadow-2xl">
          <div className="rounded-[15px] bg-[#0A0E17]/95 border border-white/[0.08] overflow-hidden text-left shadow-2xl">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0F1523] border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                <div className="w-3 h-3 rounded-full bg-[#00F5A0]/70" />
                <span className="ml-2 text-xs font-mono text-slate-400">querify-console // runtime.sql</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-[#00F5A0]" />
                <span>MySQL 8: querify_db</span>
              </div>
            </div>

            {/* Window Content */}
            <div className="p-6 space-y-4">
              {/* Natural Query Step */}
              <div className="p-3.5 rounded-xl bg-[#06080D] border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs text-[#00F5A0] font-bold">&gt;_</span>
                  <span className="text-white text-xs sm:text-sm font-sans">
                    "Show me the top performing AI companies in 2024"
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-400 border border-white/[0.08]">
                  Ambiguity Flagged
                </span>
              </div>

              {/* Clarification Step */}
              <div className="p-4 rounded-xl bg-[#0F1523] border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider font-mono">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    Clarification Engine Active
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Select definition:</span>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  "Which metric should define company performance?"
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-[#00F5A0]/15 border border-[#00F5A0]/40 text-[#00F5A0] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    Annual Revenue
                  </div>
                  <div className="p-2 rounded-lg bg-[#06080D] border border-white/[0.08] text-slate-400">
                    Net Profit
                  </div>
                  <div className="p-2 rounded-lg bg-[#06080D] border border-white/[0.08] text-slate-400">
                    Revenue Growth
                  </div>
                  <div className="p-2 rounded-lg bg-[#06080D] border border-white/[0.08] text-slate-400">
                    Investment ROI
                  </div>
                </div>
              </div>

              {/* Output SQL */}
              <div className="p-3.5 rounded-xl bg-[#06080D] border border-white/[0.08] font-mono text-xs text-[#00F5A0] leading-relaxed">
                <span className="text-white font-bold">SELECT</span> c.company_name, f.revenue_millions, f.profit_millions <br />
                <span className="text-white font-bold">FROM</span> companies c <span className="text-white font-bold">JOIN</span> financial_performance f <span className="text-white font-bold">ON</span> c.company_id = f.company_id <br />
                <span className="text-white font-bold">WHERE</span> f.fiscal_year = 2024 <span className="text-white font-bold">ORDER BY</span> f.revenue_millions <span className="text-white font-bold">DESC LIMIT 10;</span>
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
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-200 hover:border-amber-400 hover:bg-amber-950/40'
                  : 'bg-[#0A0E17]/90 border-white/[0.08] text-slate-300 hover:text-white hover:border-[#00F5A0]/40'
              }`}
            >
              {p.isAmbiguous ? (
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-[#00F5A0]" />
              )}
              <span className="font-mono text-[11px]">{p.text}</span>
              {p.isAmbiguous && (
                <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25 ml-1">
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
          <div className="p-5 rounded-2xl bg-[#0A0E17]/90 border border-white/[0.08] hover:border-[#00F5A0]/30 transition-all group space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#00F5A0]/10 border border-[#00F5A0]/25 flex items-center justify-center text-[#00F5A0]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-sans">
              Clarification Engine
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Detects polysemic terms like "best" or "top" and pauses execution to prompt with targeted multi-turn options.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0A0E17]/90 border border-white/[0.08] hover:border-[#00F5A0]/30 transition-all group space-y-3">
            <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-slate-200">
              <ShieldCheck className="w-4 h-4 text-[#00F5A0]" />
            </div>
            <h3 className="text-sm font-bold text-white font-sans">
              AST Security Guard
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              JSqlParser validates the Abstract Syntax Tree, strictly enforcing read-only SELECT queries and automatic LIMIT 100 bounds.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0A0E17]/90 border border-white/[0.08] hover:border-[#00F5A0]/30 transition-all group space-y-3">
            <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-slate-200">
              <BarChart3 className="w-4 h-4 text-[#00F5A0]" />
            </div>
            <h3 className="text-sm font-bold text-white font-sans">
              Dynamic Visual Insights
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Automatic Recharts bar, line, and pie charts deduced directly from executed SQL columns and data cardinality.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0A0E17]/90 border border-white/[0.08] hover:border-[#00F5A0]/30 transition-all group space-y-3">
            <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-slate-200">
              <Zap className="w-4 h-4 text-[#00F5A0]" />
            </div>
            <h3 className="text-sm font-bold text-white font-sans">
              Edge Portability & Parity
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Features 100% zero-backend demo parity on Vercel with Content-Type sniffing and global React 18 error boundaries.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
