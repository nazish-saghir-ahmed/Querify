import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

/**
 * Redesigned prompt suggestion chip with refined borders and status pills.
 */
export default function QuestionChip({ text, isAmbiguous = false, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(text)}
      className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 border text-left ${
        isAmbiguous
          ? 'bg-amber-950/20 border-amber-500/30 text-amber-200 hover:border-amber-400 hover:bg-amber-950/40'
          : 'bg-[#0F1523] border-white/[0.08] text-slate-300 hover:text-white hover:border-[#00F5A0]/40 hover:bg-[#131B2A]'
      }`}
    >
      {isAmbiguous ? (
        <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-[#00F5A0] shrink-0" />
      )}
      <span className="truncate max-w-[260px] sm:max-w-none text-[11px] font-mono">{text}</span>
      {isAmbiguous && (
        <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25 ml-1">
          Ambiguous
        </span>
      )}
    </button>
  );
}
