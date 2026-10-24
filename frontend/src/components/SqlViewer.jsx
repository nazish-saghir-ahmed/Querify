import React, { useState } from 'react';
import { Copy, Check, Play, ShieldCheck, Terminal, ChevronDown, ChevronUp, CheckCircle2, Lock } from 'lucide-react';

export default function SqlViewer({ sql, explanation, onRun, isExecuting }) {
  const [copied, setCopied] = useState(false);
  const [showSecurityDetails, setShowSecurityDetails] = useState(false);

  const handleCopy = () => {
    if (!sql) return;
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!sql) return null;

  // Rich deterministic SQL syntax token highlighter with line numbers
  const renderHighlightedSql = (rawSql) => {
    const keywords = /\b(SELECT|FROM|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN|CROSS JOIN|ON|WHERE|AND|OR|ORDER BY|GROUP BY|HAVING|DESC|ASC|LIMIT|OFFSET|AS|WITH|UNION|ALL|DISTINCT|COUNT|SUM|AVG|MAX|MIN|IS|NOT|NULL|IN|BETWEEN|LIKE|CASE|WHEN|THEN|ELSE|END)\b/gi;
    
    const lines = rawSql.split('\n');
    return lines.map((line, lIdx) => {
      const parts = line.split(keywords);
      return (
        <div key={lIdx} className="flex items-start gap-4 hover:bg-blue-600/5 px-2 py-0.5 rounded transition-colors group">
          {/* Line number gutter */}
          <span className="text-[11px] font-mono text-slate-500 select-none w-6 text-right shrink-0 pt-0.5 group-hover:text-blue-400 transition-colors">
            {lIdx + 1}
          </span>

          {/* Line content */}
          <div className="flex-1 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
            {parts.map((part, pIdx) => {
              if (keywords.test(part)) {
                return <span key={pIdx} className="text-blue-400 font-bold">{part}</span>;
              }
              if (/^'[^']*'$/.test(part.trim())) {
                return <span key={pIdx} className="text-emerald-300 font-medium">{part}</span>;
              }
              if (/^\d+(\.\d+)?$/.test(part.trim())) {
                return <span key={pIdx} className="text-sky-300 font-medium">{part}</span>;
              }
              if (part.startsWith('--') || part.startsWith('/*')) {
                return <span key={pIdx} className="text-slate-500 italic">{part}</span>;
              }
              return <span key={pIdx} className="text-slate-100">{part}</span>;
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="w-full rounded-2xl bg-[#0B132B]/85 border border-blue-500/25 backdrop-blur-xl overflow-hidden shadow-2xl transition-all">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 bg-blue-950/40 border-b border-blue-900/40 gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Synthesized SQL Query
          </span>

          {/* AST Read-Only Security Badge Toggle */}
          <button
            type="button"
            onClick={() => setShowSecurityDetails(!showSecurityDetails)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 hover:bg-blue-900/50 text-blue-200 hover:text-white border border-blue-500/30 text-[10px] font-mono font-semibold transition-all cursor-pointer shadow-sm"
            title="Inspect AST Security Controls"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Read-only Verified</span>
            {showSecurityDetails ? <ChevronUp className="w-3 h-3 text-blue-400" /> : <ChevronDown className="w-3 h-3 text-blue-400" />}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-950/60 hover:bg-blue-900/40 text-slate-300 hover:text-white border border-blue-800/50 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-white">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-blue-400" />
                <span>Copy SQL</span>
              </>
            )}
          </button>

          {onRun && (
            <button
              type="button"
              onClick={() => onRun(sql)}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-midnight transition-all disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current text-white" />
              <span>{isExecuting ? 'Executing...' : 'Run Query'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable AST Security Specification Details */}
      {showSecurityDetails && (
        <div className="px-5 py-4 bg-[#080D1A]/95 border-b border-blue-900/40 text-xs font-mono space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              JSqlParser AST Security Guard Analysis
            </span>
            <span className="text-[10px] text-slate-400">Strict Select Enforced</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Select.class</span>
              </div>
              <p className="text-[11px] text-slate-300">Root statement verified read-only.</p>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Mutation</span>
              </div>
              <p className="text-[11px] text-slate-300">DROP, DELETE, UPDATE, ALTER blocked.</p>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Table Whitelist</span>
              </div>
              <p className="text-[11px] text-slate-300">Constrained to 6 approved schema tables.</p>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Safety Limit</span>
              </div>
              <p className="text-[11px] text-slate-300">Strict LIMIT 100 injected if unspecified.</p>
            </div>
          </div>
        </div>
      )}

      {/* Code Display Body with Line Numbers */}
      <div className="p-4 sm:p-5 bg-[#070B14]/90 overflow-x-auto">
        {renderHighlightedSql(sql)}
      </div>

      {/* Semantic Intent Explanation */}
      {explanation && (
        <div className="px-5 py-3 bg-blue-950/40 border-t border-blue-900/40 text-xs text-slate-300 font-sans flex items-start gap-2.5">
          <span className="font-bold text-blue-400 font-mono shrink-0 uppercase tracking-wider text-[11px] mt-0.5">
            Query Logic:
          </span>
          <span className="leading-relaxed">{explanation}</span>
        </div>
      )}
    </div>
  );
}
