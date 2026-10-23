import React, { useState } from 'react';
import { Copy, Check, Play, ShieldCheck, Terminal, Info } from 'lucide-react';

/**
 * Royal SQL Viewer with AST security verification badges,
 * transparent frosted glass background, and Royal Blue execution actions.
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
    <div className="w-full rounded-2xl bg-[#0D1B2A]/60 border border-[#415A77]/35 overflow-hidden shadow-2xl backdrop-blur-2xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1B263B]/50 backdrop-blur-md border-b border-[#415A77]/30">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-200">
            Synthesized SQL Query
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-600/15 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-medium">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            <span>AST Security Verified (SELECT Only)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#0D1B2A]/60 hover:bg-[#1B263B] text-slate-300 hover:text-white border border-[#415A77]/35 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[#D4AF37]">Copied</span>
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
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)] border border-blue-400/40 transition-all disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isExecuting ? 'Executing...' : 'Run Query'}</span>
            </button>
          )}
        </div>
      </div>

      {/* SQL Code Box (Transparent Glass) */}
      <div className="p-4 bg-[#0D1B2A]/40 backdrop-blur-md font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-blue-300 border-b border-[#415A77]/25">
        <code>{sql}</code>
      </div>

      {/* Plain English Explanation */}
      {explanation && (
        <div className="px-4 py-3 bg-[#1B263B]/35 backdrop-blur-sm flex items-start gap-2.5 text-xs text-slate-300 leading-normal font-sans">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#D4AF37] font-mono">Query Logic: </span>
            <span className="text-slate-300">{explanation}</span>
          </div>
        </div>
      )}
    </div>
  );
}
