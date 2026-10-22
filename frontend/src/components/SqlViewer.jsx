import React, { useState } from 'react';
import { Copy, Check, Play, ShieldCheck, Terminal, Info } from 'lucide-react';

export default function SqlViewer({ sql, explanation, onRun, isExecuting }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!sql) return;
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!sql) return null;

  return (
    <div className="w-full rounded-2xl bg-[#101827] border border-[#1E293B] overflow-hidden shadow-card-dark">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0D1322] border-b border-[#1E293B]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Generated SQL Query
          </span>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-800/50 text-[10px] font-medium">
            <ShieldCheck className="w-3 h-3" />
            <span>AST Security Verified (SELECT Only)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#151E30] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E293B] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL</span>
              </>
            )}
          </button>

          {onRun && (
            <button
              onClick={() => onRun(sql)}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-neon-violet transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isExecuting ? 'Running...' : 'Run Query'}</span>
            </button>
          )}
        </div>
      </div>

      {/* SQL Code Box */}
      <div className="p-4 bg-[#080B14]/90 font-mono text-sm leading-relaxed overflow-x-auto text-cyan-300 border-b border-[#1E293B]/60">
        <code>{sql}</code>
      </div>

      {/* Plain English Explanation */}
      {explanation && (
        <div className="px-4 py-3 bg-[#151E30]/70 flex items-start gap-2.5 text-xs text-slate-300 leading-normal">
          <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-purple-300">Explanation: </span>
            <span>{explanation}</span>
          </div>
        </div>
      )}
    </div>
  );
}
