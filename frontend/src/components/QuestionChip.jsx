import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

export default function QuestionChip({ text, isAmbiguous = false, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(text)}
      className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all duration-150 border text-left ${
        isAmbiguous
          ? 'bg-[#111827] border-amber-500/30 text-amber-200 hover:border-amber-500/60 hover:bg-amber-500/5'
          : 'bg-[#111827] border-[#1F2E47] text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/5'
      }`}
    >
      {isAmbiguous ? (
        <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
      )}
      <span className="font-mono text-[11px] truncate">{text}</span>
      {isAmbiguous && (
        <span className="text-[9px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 ml-auto">
          Ambiguous
        </span>
      )}
    </button>
  );
}
