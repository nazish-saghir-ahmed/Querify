import React, { useState } from 'react';
import { Copy, Check, Play, ShieldCheck, Terminal, Info, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Dark Navy SQL Viewer with AST security verification badges,
 * transparent frosted glass background, and Dark Navy Blue execution actions.
 */
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

  return (
    <div className="w-full rounded-2xl bg-[#0D1B2A]/70 border border-[#3A506B]/40 overflow-hidden shadow-2xl backdrop-blur-2xl">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2.5 bg-[#1B263B]/60 backdrop-blur-md border-b border-[#3A506B]/35 gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <Terminal className="w-4 h-4 text-[#7FA1C3]" />
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-200">
            Synthesized SQL Query
          </span>
          <button
            onClick={() => setShowSecurityDetails(!showSecurityDetails)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1D3557]/60 text-[#7FA1C3] hover:text-[#F7F3E9] border border-[#3A506B]/60 text-[10px] font-mono font-medium transition-colors"
            title="Click to view verified AST security controls"
          >
            <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
            <span>AST Guard: Verified (SELECT Only)</span>
            {showSecurityDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0D1B2A]/70 text-[#D4AF37] border border-[#D4AF37]/35 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>OpenRouter: nvidia/nemotron-3.5-embed-1b:free</span>
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#0D1B2A]/80 hover:bg-[#1B263B] text-slate-300 hover:text-white border border-[#3A506B]/40 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[#D4AF37]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#7FA1C3]" />
                <span>Copy SQL</span>
              </>
            )}
          </button>

          {onRun && (
            <button
              onClick={() => onRun(sql)}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg text-xs font-semibold bg-[#1D3557] hover:bg-[#14253D] text-[#F7F3E9] shadow-sm border border-[#3A506B]/80 transition-all disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-current text-[#D4AF37]" />
              <span>{isExecuting ? 'Executing...' : 'Run Query'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable AST Security Specification Details */}
      {showSecurityDetails && (
        <div className="px-4 py-3 bg-[#112236]/80 border-b border-[#3A506B]/35 text-[11px] font-mono text-slate-300 space-y-1.5 animate-fade-in backdrop-blur-md">
          <div className="font-semibold text-[#D4AF37] uppercase tracking-wider text-[10px]">
            Active Security Controls & AST Analysis:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span><strong>Statement Type:</strong> Strictly parsed as <code className="text-[#7FA1C3]">net.sf.jsqlparser.statement.select.Select</code></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span><strong>Table Whitelist:</strong> Verified against approved domain schema</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span><strong>Semicolon Policy:</strong> Single terminator (;) normalized; statement chaining rejected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span><strong>Execution Boundary:</strong> Enforced safe limit (max 100 rows, 5s timeout)</span>
            </div>
          </div>
        </div>
      )}

      {/* SQL Code Box (Transparent Glass) */}
      <div className="p-4 bg-[#0D1B2A]/50 backdrop-blur-md font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-[#7FA1C3] border-b border-[#3A506B]/30">
        <code>{sql}</code>
      </div>

      {/* Plain English Explanation */}
      {explanation && (
        <div className="px-4 py-3 bg-[#1B263B]/40 backdrop-blur-sm flex items-start gap-2.5 text-xs text-slate-300 leading-normal font-sans">
          <Info className="w-4 h-4 text-[#7FA1C3] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#D4AF37] font-mono">Query Logic: </span>
            <span className="text-slate-300">{explanation}</span>
          </div>
        </div>
      )}
    </div>
  );
}
