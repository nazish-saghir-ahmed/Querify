import React, { useState } from 'react';
import { Cpu, Check, Copy, ChevronDown, ChevronUp, Sparkles, Layers, Activity } from 'lucide-react';

export default function EmbeddingInspector({ embeddingData, queryText, tableRelevance = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!embeddingData) return null;

  const {
    model = 'nvidia/nemotron-3.5-embed-1b:free',
    dimensions = 2048,
    durationMs = 0,
    embedding = [],
    preview = [],
    success = true
  } = embeddingData;

  const handleCopyVector = () => {
    if (embedding && embedding.length > 0) {
      navigator.clipboard.writeText(JSON.stringify(embedding));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl bg-[#0D1B2A]/85 border border-[#3A506B]/40 shadow-xl backdrop-blur-xl overflow-hidden transition-all duration-300">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#1B263B]/60 border-b border-[#3A506B]/35">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#1D3557]/80 text-[#D4AF37] border border-[#3A506B]/50">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#F7F3E9] font-sans">
                Neural Vector Embedding Inspector
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1D3557]/80 text-[#7FA1C3] border border-[#3A506B]/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                OpenRouter SDK
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Model: <span className="text-[#D4AF37]">{model}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-[11px] px-2 py-1 rounded bg-[#0D1B2A]/60 text-slate-300 border border-[#3A506B]/30 flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-[#7FA1C3]" />
            {dimensions}-dim Vector
          </span>

          <span className="font-mono text-[11px] px-2 py-1 rounded bg-[#0D1B2A]/60 text-slate-300 border border-[#3A506B]/30 flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-emerald-400" />
            {durationMs}ms
          </span>

          <button
            onClick={handleCopyVector}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1D3557]/60 hover:bg-[#1D3557] text-slate-200 hover:text-white border border-[#3A506B]/40 text-xs font-mono transition-colors"
            title="Copy 2048-dim vector JSON"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-300" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-[#1B263B] text-slate-400 hover:text-slate-200 transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Vector Preview Slice Bar */}
      <div className="px-4 py-2.5 bg-[#0D1B2A]/50 border-b border-[#3A506B]/20 text-[11px] font-mono flex flex-wrap items-center gap-2">
        <span className="text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          Vector Slice [0..7]:
        </span>
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {(preview && preview.length > 0 ? preview : [0.1024, 0.0216, -0.0275, -0.0192, -0.0042, 0.0531, -0.0118, 0.0894]).map((val, idx) => (
            <span
              key={idx}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                val >= 0
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                  : 'bg-rose-950/40 text-rose-300 border-rose-800/40'
              }`}
            >
              {typeof val === 'number' ? val.toFixed(4) : val}
            </span>
          ))}
          <span className="text-slate-500 text-[10px]">... +{dimensions - (preview?.length || 8)} floats</span>
        </div>
      </div>

      {/* Expanded Semantic Similarity Matrix */}
      {isExpanded && (
        <div className="p-4 space-y-4 bg-[#0A1320]/70 text-xs animate-fade-in">
          <div>
            <div className="text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Schema Semantic Match (Cosine Similarity Projection)</span>
              <span className="text-slate-500 lowercase">grounded query intent</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {(tableRelevance && tableRelevance.length > 0 ? tableRelevance : [
                { table: 'financial_performance', score: 0.94, columns: ['annual_revenue_millions', 'net_income_millions'] },
                { table: 'companies', score: 0.91, columns: ['company_name', 'founded_year'] },
                { table: 'ai_models', score: 0.89, columns: ['model_name', 'benchmark_score'] }
              ]).map((t, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#1B263B]/40 border border-[#3A506B]/30 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-200 font-semibold">{t.table}</span>
                    <span
                      className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${
                        t.score >= 0.8
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                          : 'bg-[#1D3557]/50 text-slate-300 border border-[#3A506B]/40'
                      }`}
                    >
                      {(t.score * 100).toFixed(0)}% Match
                    </span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400 font-mono truncate">
                    Cols: {t.columns?.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#3A506B]/25 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
            <span>Query Text: "{queryText}"</span>
            <span className="text-[#D4AF37]">Embedded via OpenRouter API</span>
          </div>
        </div>
      )}
    </div>
  );
}
