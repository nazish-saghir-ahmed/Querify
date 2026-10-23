import React, { useState } from 'react';
import { Copy, Check, Play, ShieldCheck, Terminal, ChevronDown, ChevronUp } from 'lucide-react';

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

  // Simple, deterministic SQL syntax token highlighter
  const renderHighlightedSql = (rawSql) => {
    const keywords = /\b(SELECT|FROM|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|ON|WHERE|AND|OR|ORDER BY|GROUP BY|HAVING|DESC|ASC|LIMIT|AS|WITH|UNION|COUNT|SUM|AVG|MAX|MIN|IS|NOT|NULL)\b/gi;
    
    // Split into lines
    const lines = rawSql.split('\n');
    return lines.map((line, lIdx) => {
      // Highlight keywords
      const parts = line.split(keywords);
      return (
        <div key={lIdx} className="leading-relaxed">
          {parts.map((part, pIdx) => {
            if (keywords.test(part)) {
              return <span key={pIdx} className="text-blue-400 font-semibold">{part}</span>;
            }
            // Check for strings
            if (/^'[^']*'$/.test(part.trim())) {
              return <span key={pIdx} className="text-emerald-400">{part}</span>;
            }
            // Check for numbers
            if (/^\d+(\.\d+)?$/.test(part.trim())) {
              return <span key={pIdx} className="text-amber-400">{part}</span>;
            }
            return <span key={pIdx} className="text-slate-200">{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="w-full rounded-2xl bg-[#111827] border border-[#1F2E47] overflow-hidden shadow-card">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2.5 bg-[#162238] border-b border-[#1F2E47] gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300">
            Synthesized SQL
          </span>

          {/* Small Read-Only Verified Security Badge */}
          <button
            onClick={() => setShowSecurityDetails(!showSecurityDetails)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-medium transition-colors"
            title="Inspect AST Security Controls"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Read-only verified</span>
            {showSecurityDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#111827] hover:bg-[#1A2438] text-slate-300 hover:text-white border border-[#1F2E47] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          {onRun && (
            <button
              onClick={() => onRun(sql)}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-current text-white" />
              <span>{isExecuting ? 'Running...' : 'Run Query'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable AST Security Specification Details */}
      {showSecurityDetails && (
        <div className="px-4 py-3 bg-[#0B0F17] border-b border-[#1F2E47] text-[11px] font-mono text-slate-300 space-y-1.5 animate-fade-in">
          <div className="font-semibold text-emerald-400 uppercase tracking-wider text-[10px]">
            JSqlParser AST Security Analysis:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Root Statement: <code className="text-blue-400">Select.class</code> only</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Mutation Prevention: DROP, DELETE, UPDATE, INSERT prohibited</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Whitelist: 6 domain tables approved</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Limit Bounds: Safe auto-injected LIMIT 100</span>
            </div>
          </div>
        </div>
      )}

      {/* Code Display Body */}
      <div className="p-4 bg-[#0B0F17] overflow-x-auto font-mono text-xs sm:text-sm">
        {renderHighlightedSql(sql)}
      </div>

      {/* Semantic Intent Explanation */}
      {explanation && (
        <div className="px-4 py-2.5 bg-[#111827] border-t border-[#1F2E47] text-xs text-slate-400 font-sans flex items-start gap-2">
          <span className="font-medium text-slate-300">Logic:</span>
          <span>{explanation}</span>
        </div>
      )}
    </div>
  );
}
