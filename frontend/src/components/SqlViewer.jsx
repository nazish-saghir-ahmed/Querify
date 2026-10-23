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

  // Simple, deterministic SQL syntax token highlighter (Midnight Blue & White)
  const renderHighlightedSql = (rawSql) => {
    const keywords = /\b(SELECT|FROM|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|ON|WHERE|AND|OR|ORDER BY|GROUP BY|HAVING|DESC|ASC|LIMIT|AS|WITH|UNION|COUNT|SUM|AVG|MAX|MIN|IS|NOT|NULL)\b/gi;
    
    const lines = rawSql.split('\n');
    return lines.map((line, lIdx) => {
      const parts = line.split(keywords);
      return (
        <div key={lIdx} className="leading-relaxed">
          {parts.map((part, pIdx) => {
            if (keywords.test(part)) {
              return <span key={pIdx} className="text-blue-400 font-bold">{part}</span>;
            }
            if (/^'[^']*'$/.test(part.trim())) {
              return <span key={pIdx} className="text-white font-medium">{part}</span>;
            }
            if (/^\d+(\.\d+)?$/.test(part.trim())) {
              return <span key={pIdx} className="text-blue-200 font-medium">{part}</span>;
            }
            return <span key={pIdx} className="text-blue-100/90">{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="w-full rounded-2xl bg-blue-950/20 border border-blue-800/40 backdrop-blur-xl overflow-hidden shadow-midnight">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-blue-950/40 border-b border-blue-900/40 gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">
            Synthesized SQL
          </span>

          {/* Small Read-Only Verified Security Badge in Midnight Blue & White */}
          <button
            onClick={() => setShowSecurityDetails(!showSecurityDetails)}
            className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-600/30 text-white hover:bg-blue-600/50 border border-blue-400/40 text-[10px] font-mono font-semibold transition-colors"
            title="Inspect AST Security Controls"
          >
            <ShieldCheck className="w-3 h-3 text-white" />
            <span>Read-only verified</span>
            {showSecurityDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-950/60 hover:bg-blue-900/40 text-blue-200 hover:text-white border border-blue-800/50 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span className="text-white">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-blue-300" />
                <span>Copy</span>
              </>
            )}
          </button>

          {onRun && (
            <button
              onClick={() => onRun(sql)}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-midnight transition-all disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-current text-white" />
              <span>{isExecuting ? 'Running...' : 'Run Query'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable AST Security Specification Details */}
      {showSecurityDetails && (
        <div className="px-4 py-3 bg-blue-950/50 border-b border-blue-900/40 text-[11px] font-mono text-white space-y-1.5 animate-fade-in">
          <div className="font-bold text-blue-300 uppercase tracking-wider text-[10px]">
            JSqlParser AST Security Analysis:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-100">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">✓</span>
              <span>Root Statement: <code className="text-white font-bold">Select.class</code> only</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">✓</span>
              <span>Mutation Prevention: DROP, DELETE, UPDATE, INSERT prohibited</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">✓</span>
              <span>Whitelist: 6 domain tables approved</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">✓</span>
              <span>Limit Bounds: Safe auto-injected LIMIT 100</span>
            </div>
          </div>
        </div>
      )}

      {/* Code Display Body */}
      <div className="p-4 bg-blue-950/30 overflow-x-auto font-mono text-xs sm:text-sm">
        {renderHighlightedSql(sql)}
      </div>

      {/* Semantic Intent Explanation */}
      {explanation && (
        <div className="px-4 py-2.5 bg-blue-950/40 border-t border-blue-900/40 text-xs text-blue-200/80 font-sans flex items-start gap-2">
          <span className="font-bold text-white">Logic:</span>
          <span>{explanation}</span>
        </div>
      )}
    </div>
  );
}
