import React, { useState, useEffect } from 'react';
import {
  Terminal, ShieldCheck, Database, BarChart3, HelpCircle, ArrowRight,
  CheckCircle2, XCircle, Sparkles, Cpu, Layers, ExternalLink, Code2, Zap
} from 'lucide-react';

export default function LandingPage({ setActiveTab, onSelectQuestion }) {
  // Looping interactive step state for clarification preview
  const [activeStep, setActiveStep] = useState(0);

  const previewSteps = [
    {
      id: 'ask',
      title: '1. Human Question',
      badge: 'Natural English Input',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      content: {
        type: 'prompt',
        text: 'Show me the best performing AI companies in 2024',
        sub: 'Flagged: "best performing" is semantically ambiguous',
      },
    },
    {
      id: 'clarify',
      title: '2. Clarification Engine',
      badge: 'Multi-Turn Disambiguation',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      content: {
        type: 'options',
        prompt: 'Which metric should evaluate company performance?',
        selected: 'Highest Revenue (2024 USD Millions)',
        options: [
          'Highest Gross Revenue (2024 USD Millions)',
          'Net Profitability (After Operating Costs)',
          'YoY Revenue Growth Rate (%)',
          'AI Investment Return (ROI)',
        ],
      },
    },
    {
      id: 'sql',
      title: '3. Synthesized & AST Guarded SQL',
      badge: 'Read-Only Verified',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      content: {
        type: 'sql',
        query: `SELECT c.company_name, f.revenue_millions, f.profit_millions\nFROM companies c\nJOIN financial_performance f ON c.company_id = f.company_id\nWHERE f.fiscal_year = 2024\nORDER BY f.revenue_millions DESC\nLIMIT 10;`,
      },
    },
    {
      id: 'chart',
      title: '4. Visual Insight',
      badge: 'Auto-Deduced Bar Projection',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      content: {
        type: 'chart',
        items: [
          { name: 'NVIDIA', val: '$122,000M', w: '95%' },
          { name: 'Microsoft AI', val: '$38,500M', w: '55%' },
          { name: 'Amazon AWS AI', val: '$31,000M', w: '46%' },
          { name: 'Meta AI', val: '$24,500M', w: '38%' },
        ],
      },
    },
  ];

  // Auto-advance preview steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % previewSteps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [previewSteps.length]);

  const handleLaunchWithPrompt = (promptText) => {
    if (onSelectQuestion) {
      onSelectQuestion(promptText);
    }
    setActiveTab('workspace');
  };

  return (
    <div className="relative z-10 w-full overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="pt-20 pb-16 px-4 sm:px-6 max-w-[1150px] mx-auto text-center">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827] border border-[#1F2E47] shadow-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-mono font-medium text-slate-300">
            Querify Clarification Engine v1.3
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            AST Guarded
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-sans max-w-3xl mx-auto leading-[1.12]">
          Ask in English. <br className="hidden sm:inline" />
          <span className="text-blue-500">Get the right SQL.</span>
        </h1>

        {/* Subheading */}
        <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans">
          Most text-to-SQL bots blindly guess when questions are ambiguous. Querify asks structured clarifying questions instead of guessing, then generates safe, read-only SQL.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={() => setActiveTab('workspace')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm tracking-wide shadow-sm transition-all transform hover:-translate-y-0.5"
          >
            <Terminal className="w-4 h-4" />
            <span>Try the demo</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>

          <a
            href="https://github.com/nazish-saghir-ahmed/Querify"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#111827] hover:bg-[#162238] text-slate-300 hover:text-white border border-[#1F2E47] font-medium text-sm transition-all"
          >
            <Code2 className="w-4 h-4 text-slate-400" />
            <span>View on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </div>

        {/* 2. LOOPING ANIMATED CLARIFICATION FLOW PREVIEW */}
        <div className="mt-14 max-w-3xl mx-auto text-left">
          <div className="rounded-2xl bg-[#111827] border border-[#1F2E47] overflow-hidden shadow-card">
            {/* Window Topbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#162238] border-b border-[#1F2E47]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">
                  querify-pipeline // clarification-loop.preview
                </span>
              </div>

              {/* Step indicator pills */}
              <div className="flex items-center gap-1.5">
                {previewSteps.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(idx)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      activeStep === idx
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-500 hover:text-slate-300 bg-[#0B0F17]'
                    }`}
                  >
                    Step {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Step Body */}
            <div className="p-6 min-h-[220px] flex flex-col justify-center">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                  {previewSteps[activeStep].title}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${previewSteps[activeStep].badgeColor}`}>
                  {previewSteps[activeStep].badge}
                </span>
              </div>

              {/* Dynamic Step Content */}
              {previewSteps[activeStep].content.type === 'prompt' && (
                <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1F2E47] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-mono font-bold">&gt;_</span>
                    <span className="text-sm font-sans font-medium text-white">
                      "{previewSteps[activeStep].content.text}"
                    </span>
                  </div>
                  <p className="text-xs font-mono text-amber-400 pl-4">
                    ⚠️ {previewSteps[activeStep].content.sub}
                  </p>
                </div>
              )}

              {previewSteps[activeStep].content.type === 'options' && (
                <div className="p-4 rounded-xl bg-[#0B0F17] border border-amber-500/30 space-y-3">
                  <p className="text-xs font-medium text-slate-200">
                    {previewSteps[activeStep].content.prompt}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {previewSteps[activeStep].content.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`px-3 py-2 rounded-lg text-xs font-mono border transition-all ${
                          oIdx === 0
                            ? 'bg-blue-600/15 border-blue-500 text-white font-semibold flex items-center justify-between'
                            : 'bg-[#111827] border-[#1F2E47] text-slate-400'
                        }`}
                      >
                        <span className="truncate">{opt}</span>
                        {oIdx === 0 && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 ml-1" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewSteps[activeStep].content.type === 'sql' && (
                <div className="p-4 rounded-xl bg-[#0B0F17] border border-emerald-500/30 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto">
                  <pre className="text-xs">{previewSteps[activeStep].content.query}</pre>
                </div>
              )}

              {previewSteps[activeStep].content.type === 'chart' && (
                <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1F2E47] space-y-2.5">
                  {previewSteps[activeStep].content.items.map((it, iIdx) => (
                    <div key={iIdx} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300">{it.name}</span>
                        <span className="text-blue-400 font-semibold">{it.val}</span>
                      </div>
                      <div className="w-full bg-[#111827] h-2 rounded-full overflow-hidden border border-[#1F2E47]">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-all duration-500"
                          style={{ width: it.w }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Progress Bar */}
            <div className="flex justify-between items-center px-4 py-2 bg-[#162238] border-t border-[#1F2E47] text-[11px] font-mono text-slate-400">
              <span>Automatically advancing every 4 seconds</span>
              <button
                onClick={() => handleLaunchWithPrompt('Show me the best performing AI companies')}
                className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <span>Run this question</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "GUESSING BOT VS QUERIFY" COMPARISON */}
      <section className="py-16 px-4 sm:px-6 max-w-[1150px] mx-auto border-t border-[#1F2E47]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-400">
            Architectural Differentiation
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans mt-2">
            Guessing Bot vs. Querify
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Example: <span className="font-mono text-slate-200">"Show me the best performing AI companies"</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Naive Chatbot Card */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-rose-500/20 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#1F2E47]">
              <XCircle className="w-5 h-5 text-rose-400" />
              <h3 className="font-semibold text-white text-base font-sans">
                Standard Text-to-SQL Chatbot
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Blind Assumptions:</strong> Arbitrarily picks a column (e.g., parameter count or random score) without asking what you mean.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Hallucinated Schemas:</strong> Invents non-existent column names or joins when unsure of relationships.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Vulnerable Execution:</strong> Directly sends raw generated text to the database driver with zero AST verification.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Misleading Visuals:</strong> Produces charts based on incorrect metrics, misguiding stakeholder decisions.</span>
              </li>
            </ul>
          </div>

          {/* Querify Card */}
          <div className="p-6 rounded-2xl bg-[#162238] border border-blue-500/40 space-y-4 shadow-card">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#1F2E47]">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white text-base font-sans">
                Querify Clarification Engine
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Proactive Ambiguity Detection:</strong> Recognizes that "best performing" can mean revenue, net profit, growth rate, or ROI.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Structured Multi-Turn Disambiguation:</strong> Presents clear, keyboard-accessible choice cards to align human intent.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>JSqlParser AST Security Guard:</strong> Strictly verifies the Abstract Syntax Tree ensures only read-only <code className="text-blue-400">SELECT</code> queries run.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Deterministic Visualizations:</strong> Accurately formats currencies, percentages, and outputs interactive Bar/Line/Pie charts.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. 3-STEP "HOW IT WORKS" SECTION */}
      <section className="py-16 px-4 sm:px-6 max-w-[1150px] mx-auto border-t border-[#1F2E47]">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-400">
            Execution Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans mt-2">
            How Querify Works
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Three deterministic steps from human inquiry to relational precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2E47] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-semibold text-white font-sans">
              1. Ask in English
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Type your analytical inquiry naturally. Querify parses semantic intent and grounds tokens against the database schema catalog.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2E47] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-semibold text-white font-sans">
              2. Clarify Ambiguity
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              If multiple valid interpretations exist, execution halts. Choose between targeted business metrics via card options or arrow keys.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2E47] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-semibold text-white font-sans">
              3. Get Verified SQL
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Receive AST-validated SELECT SQL, inspect formatted data rows with sticky headers, and visualize distributions in Recharts.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FEATURE GRID (4 PILLARS) */}
      <section className="py-16 px-4 sm:px-6 max-w-[1150px] mx-auto border-t border-[#1F2E47]">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-400">
            Core Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans mt-2">
            Engineered for Precision & Security
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2E47] hover:border-blue-500/40 transition-colors space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white font-sans">
              Clarification Engine
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Multi-turn disambiguation algorithm that flags semantic gaps and guarantees user intent before query synthesis.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2E47] hover:border-blue-500/40 transition-colors space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white font-sans">
              AST Security Guard
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              JSqlParser verifies queries into Abstract Syntax Trees, enforcing read-only SELECT limits and blocking injection attempts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2E47] hover:border-blue-500/40 transition-colors space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white font-sans">
              Auto-Generated Charts
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Automatic Recharts bar, line, and pie charts deduced directly from executed SQL column types and cardinality.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1F2E47] hover:border-blue-500/40 transition-colors space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white font-sans">
              Zero-Setup Demo Mode
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Instant standalone in-browser fallback. Visitors can test clarification, SQL, and charts without needing external API keys.
            </p>
          </div>
        </div>
      </section>

      {/* 6. TECH STACK ROW WITH ICONS */}
      <section className="py-12 px-4 sm:px-6 max-w-[1150px] mx-auto border-t border-[#1F2E47]">
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-medium text-slate-400">
            Powered by modern enterprise engineering
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111827] border border-[#1F2E47]">
            <Code2 className="w-4 h-4 text-blue-400" />
            <span>React 18 & Vite 5</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111827] border border-[#1F2E47]">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Tailwind CSS</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111827] border border-[#1F2E47]">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Spring Boot 3 (Java 17/21)</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111827] border border-[#1F2E47]">
            <Database className="w-4 h-4 text-blue-400" />
            <span>MySQL 8.0</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111827] border border-[#1F2E47]">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>JSqlParser AST</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111827] border border-[#1F2E47]">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Google Gemini / Nemotron 3.5</span>
          </div>
        </div>
      </section>
    </div>
  );
}
