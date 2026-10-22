import React from 'react';
import { Sparkles, Terminal, ShieldCheck, Database, BarChart3, HelpCircle, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

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
    <div className="relative min-h-screen bg-[#080B14] overflow-hidden">
      {/* Background Neon Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-purple-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-96 left-1/4 w-72 h-72 bg-purple-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[600px] right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101827] border border-purple-500/30 shadow-glow-subtle mb-8">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-200 tracking-wide">
            Next-Gen Text-to-SQL Clarification Engine
          </span>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-1.5 py-0.5 rounded">
            v1.0
          </span>
        </div>

        {/* Hero Headings */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-sans text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Your Data. Your Questions. <br />
          <span className="gradient-text-ai">Instant Answers.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Turn everyday language into accurate, validated SQL queries. Powered by an intelligent{' '}
          <span className="text-cyan-300 font-medium">Clarification Engine</span> that identifies ambiguity before executing against your live database.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActiveTab('workspace')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-base shadow-neon-violet hover:shadow-neon-cyan transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5" />
            <span>Launch Querify</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#101827] hover:bg-[#151E30] text-slate-300 hover:text-white border border-[#1E293B] font-semibold text-base transition-all"
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Explore Database Schema</span>
          </button>
        </div>

        {/* Interactive Product Preview Mockup */}
        <div className="mt-16 max-w-5xl mx-auto rounded-2xl p-1 bg-gradient-to-b from-[#1E293B] via-[#101827] to-[#080B14] shadow-2xl shadow-purple-950/40">
          <div className="rounded-[15px] bg-[#0D1322] border border-[#1E293B] overflow-hidden">
            {/* Window Top Controls */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#080B14]/80 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-500">querify-workspace.ai</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>MySQL Connected: querify_db</span>
              </div>
            </div>

            {/* Mockup Preview Content */}
            <div className="p-6 text-left space-y-4">
              {/* Natural Query Input Mock */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#151E30] border border-purple-500/30">
                <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
                <span className="text-white text-sm font-medium">
                  "Show me the best performing AI companies"
                </span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                  Enter
                </span>
              </div>

              {/* Clarification Step Mock */}
              <div className="p-4 rounded-xl bg-[#101827] border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Clarification Engine Activated</span>
                </div>
                <p className="text-xs text-slate-300">
                  "What would you like to use to measure performance?"
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/40 text-[11px] text-cyan-300 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    Highest revenue
                  </div>
                  <div className="p-2 rounded-lg bg-[#151E30] border border-[#1E293B] text-[11px] text-slate-400">
                    Highest net profit
                  </div>
                  <div className="p-2 rounded-lg bg-[#151E30] border border-[#1E293B] text-[11px] text-slate-400">
                    Highest AI returns (ROI)
                  </div>
                  <div className="p-2 rounded-lg bg-[#151E30] border border-[#1E293B] text-[11px] text-slate-400">
                    Highest revenue growth
                  </div>
                </div>
              </div>

              {/* Generated SQL Mock */}
              <div className="p-3.5 rounded-xl bg-[#080B14] border border-[#1E293B] font-mono text-xs text-cyan-300">
                <span className="text-purple-400">SELECT</span> c.company_name, f.revenue_millions, f.profit_millions <br />
                <span className="text-purple-400">FROM</span> companies c <span className="text-purple-400">JOIN</span> financial_performance f <span className="text-purple-400">ON</span> c.company_id = f.company_id <br />
                <span className="text-purple-400">WHERE</span> f.fiscal_year = 2024 <span className="text-purple-400">ORDER BY</span> f.revenue_millions <span className="text-purple-400">DESC LIMIT 10;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Questions Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-white">
            Try Sample Natural Language Questions
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Click any question below to test direct query execution or trigger the clarification engine.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleLaunchWithPrompt(p.text)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                p.isAmbiguous
                  ? 'bg-amber-950/20 border-amber-600/40 text-amber-300 hover:bg-amber-900/40'
                  : 'bg-[#101827] border-[#1E293B] text-slate-300 hover:text-white hover:border-purple-500/50'
              }`}
            >
              {p.isAmbiguous ? (
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <span>{p.text}</span>
              {p.isAmbiguous && (
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  Ambiguous
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* 4 Feature Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-[#101827] border border-[#1E293B] hover:border-purple-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              Clarification Engine
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects ambiguous requests like "best performing" or "made the most money" and asks targeted multi-turn follow-ups before generating SQL.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-[#101827] border border-[#1E293B] hover:border-cyan-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              AST Security Guard
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              JSqlParser structural validation strictly enforces read-only SELECT queries, table whitelisting, and blocks injection or destructive operations.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-[#101827] border border-[#1E293B] hover:border-purple-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              Visual Data Insights
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatic Recharts bar, line, and pie charts deduced directly from executed SQL columns and data patterns, alongside interactive CSV exports.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-[#101827] border border-[#1E293B] hover:border-cyan-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              Offline Demo Mode
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Includes a 100% deterministic local NLP engine supporting 30+ analytical questions without requiring an external API key or internet access.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Pipeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-t border-[#1E293B]/50">
        <h3 className="text-2xl font-bold text-white mb-3">
          How Querify Works
        </h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto mb-12">
          From English question to verified database records in 4 seamless stages.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
          <div className="p-5 rounded-xl bg-[#101827] border border-[#1E293B] relative">
            <span className="text-xs font-mono text-purple-400 font-bold mb-2 block">01 / INPUT</span>
            <h5 className="text-sm font-bold text-white mb-1">User Question</h5>
            <p className="text-xs text-slate-400">
              User asks in ordinary English. No knowledge of SQL, tables, or joins required.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#101827] border border-[#1E293B] relative">
            <span className="text-xs font-mono text-cyan-400 font-bold mb-2 block">02 / AMBIGUITY CHECK</span>
            <h5 className="text-sm font-bold text-white mb-1">Clarification Engine</h5>
            <p className="text-xs text-slate-400">
              Evaluates metric ambiguity. Asks targeted follow-up question with structured choices if needed.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#101827] border border-[#1E293B] relative">
            <span className="text-xs font-mono text-purple-400 font-bold mb-2 block">03 / VALIDATION</span>
            <h5 className="text-sm font-bold text-white mb-1">AST Security Gate</h5>
            <p className="text-xs text-slate-400">
              Parses the SQL abstract syntax tree to verify strict SELECT-only access on allowed tables.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#101827] border border-[#1E293B] relative">
            <span className="text-xs font-mono text-cyan-400 font-bold mb-2 block">04 / EXECUTION</span>
            <h5 className="text-sm font-bold text-white mb-1">MySQL Results & Charts</h5>
            <p className="text-xs text-slate-400">
              Executes via Spring Boot JdbcTemplate and renders interactive tables and dynamic charts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
