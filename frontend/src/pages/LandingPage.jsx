import React, { useState, useEffect } from 'react';
import {
  Terminal, ArrowRight, CheckCircle2, Code2, Layers, Cpu, Database
} from 'lucide-react';

export default function LandingPage({ setActiveTab, onSelectQuestion }) {
  // Looping interactive step state for clarification preview
  const [activeStep, setActiveStep] = useState(0);

  const previewSteps = [
    {
      id: 'ask',
      title: '1. Human Question',
      badge: 'Natural English Input',
      badgeColor: 'bg-blue-600/20 text-blue-200 border-blue-500/40',
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
      badgeColor: 'bg-blue-600/20 text-blue-200 border-blue-500/40',
      content: {
        type: 'options',
        prompt: 'Which metric should evaluate company performance?',
        selected: 'Highest Gross Revenue (2024 USD Millions)',
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
      badgeColor: 'bg-blue-600/20 text-white border-blue-500/40',
      content: {
        type: 'sql',
        query: `SELECT c.company_name, f.revenue_millions, f.profit_millions\nFROM companies c\nJOIN financial_performance f ON c.company_id = f.company_id\nWHERE f.fiscal_year = 2024\nORDER BY f.revenue_millions DESC\nLIMIT 10;`,
      },
    },
    {
      id: 'chart',
      title: '4. Visual Insight',
      badge: 'Auto-Deduced Bar Projection',
      badgeColor: 'bg-blue-600/20 text-blue-200 border-blue-500/40',
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/40 border border-blue-600/30 backdrop-blur-md shadow-midnight mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs font-mono font-medium tracking-wide text-blue-100">
            Querify Clarification Engine v1.3
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white font-semibold">
            AST Guarded
          </span>
        </div>

        {/* Hero Headline with Stylish Typography */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
          Ask in English. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-white">
            Get the right SQL.
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-base sm:text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed font-sans font-normal">
          Most text-to-SQL bots blindly guess when questions are ambiguous. Querify asks structured clarifying questions instead of guessing, then generates safe, read-only SQL.
        </p>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActiveTab('workspace')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm tracking-wide shadow-midnight transition-all transform hover:-translate-y-0.5"
          >
            <Terminal className="w-4 h-4" />
            <span>Try the demo</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>

          <a
            href="https://github.com/nazish-saghir-ahmed/Querify"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/40 text-white border border-blue-600/30 backdrop-blur-md font-medium text-sm transition-all"
          >
            <Code2 className="w-4 h-4 text-blue-300" />
            <span>View on GitHub</span>
          </a>
        </div>

        {/* 2. TRANSPARENT CLARIFICATION FLOW PREVIEW (NO 3 DOTS) */}
        <div className="mt-14 max-w-3xl mx-auto text-left">
          <div className="rounded-2xl bg-transparent border border-blue-600/30 backdrop-blur-xl overflow-hidden shadow-2xl">
            {/* Window Topbar (Transparent, No Three Dots) */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-blue-950/30 border-b border-blue-900/40">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-blue-300">
                  querify-pipeline // clarification-loop.preview
                </span>
              </div>

              {/* Step indicator pills */}
              <div className="flex items-center gap-1.5">
                {previewSteps.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(idx)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors ${
                      activeStep === idx
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : 'text-blue-300 hover:text-white bg-blue-950/40'
                    }`}
                  >
                    Step {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Step Body (Transparent Glass) */}
            <div className="p-6 min-h-[220px] flex flex-col justify-center bg-blue-950/15">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  {previewSteps[activeStep].title}
                </span>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${previewSteps[activeStep].badgeColor}`}>
                  {previewSteps[activeStep].badge}
                </span>
              </div>

              {/* Dynamic Step Content */}
              {previewSteps[activeStep].content.type === 'prompt' && (
                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-mono font-bold">&gt;_</span>
                    <span className="text-sm font-sans font-medium text-white">
                      "{previewSteps[activeStep].content.text}"
                    </span>
                  </div>
                  <p className="text-xs font-mono text-blue-300 pl-4">
                    ℹ️ {previewSteps[activeStep].content.sub}
                  </p>
                </div>
              )}

              {previewSteps[activeStep].content.type === 'options' && (
                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 space-y-3">
                  <p className="text-xs font-medium text-white">
                    {previewSteps[activeStep].content.prompt}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {previewSteps[activeStep].content.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`px-3 py-2 rounded-lg text-xs font-mono border transition-all ${
                          oIdx === 0
                            ? 'bg-blue-600 text-white font-semibold flex items-center justify-between border-blue-500 shadow-sm'
                            : 'bg-blue-950/40 border-blue-900/50 text-blue-200'
                        }`}
                      >
                        <span className="truncate">{opt}</span>
                        {oIdx === 0 && <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewSteps[activeStep].content.type === 'sql' && (
                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 font-mono text-xs text-white leading-relaxed overflow-x-auto">
                  <pre className="text-xs text-blue-100">{previewSteps[activeStep].content.query}</pre>
                </div>
              )}

              {previewSteps[activeStep].content.type === 'chart' && (
                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 space-y-3">
                  {previewSteps[activeStep].content.items.map((it, iIdx) => (
                    <div key={iIdx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-white font-medium">{it.name}</span>
                        <span className="text-blue-300 font-bold">{it.val}</span>
                      </div>
                      <div className="h-2 w-full bg-blue-950/60 rounded-full overflow-hidden border border-blue-900/50">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                          style={{ width: it.w }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Window Footer */}
            <div className="flex items-center justify-between px-5 py-3 bg-blue-950/30 border-t border-blue-900/40 text-xs font-mono text-blue-300">
              <span>Automatically advancing every 4 seconds</span>
              <button
                onClick={() => handleLaunchWithPrompt('Show me the best performing AI companies')}
                className="text-white hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Run this question</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 3-STEP "HOW IT WORKS" SECTION (Strict Midnight Blue & White) */}
      <section className="py-16 px-4 sm:px-6 max-w-[1150px] mx-auto border-t border-blue-900/30">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-blue-400">
            Execution Flow
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white mt-2">
            How Querify Works
          </h2>
          <p className="text-sm text-blue-200/80 mt-2 font-sans">
            Three deterministic steps from human inquiry to relational precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-blue-950/20 border border-blue-800/40 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-white font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-display font-bold text-white">
              1. Ask in English
            </h3>
            <p className="text-xs text-blue-100/70 leading-relaxed font-sans">
              Type your analytical inquiry naturally. Querify parses semantic intent and grounds tokens against the database schema catalog.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-blue-950/20 border border-blue-800/40 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-white font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-display font-bold text-white">
              2. Clarify Ambiguity
            </h3>
            <p className="text-xs text-blue-100/70 leading-relaxed font-sans">
              If multiple valid interpretations exist, execution halts. Choose between targeted business metrics via card options or arrow keys.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-blue-950/20 border border-blue-800/40 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-white font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-display font-bold text-white">
              3. Get Verified SQL
            </h3>
            <p className="text-xs text-blue-100/70 leading-relaxed font-sans">
              Receive AST-validated SELECT SQL, inspect formatted data rows with sticky headers, and visualize distributions in Recharts.
            </p>
          </div>
        </div>
      </section>

      {/* 4. TECH STACK ROW WITH ICONS (Strict Midnight Blue & White) */}
      <section className="py-12 px-4 sm:px-6 max-w-[1150px] mx-auto border-t border-blue-900/30">
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-medium tracking-wide text-blue-300">
            Powered by modern enterprise engineering
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-mono text-white">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-950/40 border border-blue-800/40 backdrop-blur-md">
            <Code2 className="w-4 h-4 text-blue-400" />
            <span>React 18 & Vite 5</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-950/40 border border-blue-800/40 backdrop-blur-md">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Tailwind CSS</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-950/40 border border-blue-800/40 backdrop-blur-md">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>Spring Boot 3</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-950/40 border border-blue-800/40 backdrop-blur-md">
            <Database className="w-4 h-4 text-blue-400" />
            <span>MySQL 8 & H2</span>
          </div>
        </div>
      </section>
    </div>
  );
}
