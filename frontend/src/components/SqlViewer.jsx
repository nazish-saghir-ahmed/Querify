import React, { useState } from 'react';
import { Copy, Check, Play, ShieldCheck, Terminal, Info } from 'lucide-react';

/**
 * Redesigned SQL Viewer with AST security verification badges,
 * precision monospace typography, and one-click execution.
 */
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
    <div className="w-full rounded-2xl bg-[#0A0E17]/95 border border-white/[0.08] overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0F1523] border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-[#00F5A0]" />
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300">
            Synthesized SQL Query
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00F5A0]/10 text-[#00F5A0] border border-[#00F5A0]/25 text-[10px] font-mono font-medium">
            <ShieldCheck className="w-3 h-3" />
            <span>AST Security Verified (SELECT Only)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#131B2A] hover:bg-[#182338] text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#00F5A0]" />
                <span className="text-[#00F5A0]">Copied</span>
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
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg text-xs font-semibold bg-[#00F5A0] hover:bg-[#00DF89] text-[#06080D] shadow-sm transition-colors disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isExecuting ? 'Executing...' : 'Run Query'}</span>
            </button>
          )}
        </div>
      </div>

      {/* SQL Code Box */}
      <div className="p-4 bg-[#06080D] font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-[#00F5A0] border-b border-white/[0.06]">
        <code>{sql}</code>
      </div>

      {/* Plain English Explanation */}
      {explanation && (
        <div className="px-4 py-3 bg-[#0F1523]/80 flex items-start gap-2.5 text-xs text-slate-300 leading-normal font-sans">
          <Info className="w-4 h-4 text-[#00F5A0] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white font-mono">Query Logic: </span>
            <span className="text-slate-400">{explanation}</span>
          </div>
        </div>
      )}
    </div>
  );
}
