import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

export default function QuestionChip({ text, isAmbiguous = false, onClick }) {
  return (
    <button
      onClick={() => onClick(text)}
      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-200 border text-left ${
        isAmbiguous
          ? 'bg-amber-950/30 border-amber-600/40 text-amber-200 hover:bg-amber-900/50 hover:border-amber-500'
          : 'bg-[#151E30] border-[#1E293B] text-slate-300 hover:text-white hover:border-purple-500/50 hover:bg-[#1B263D]'
      }`}
    >
      {isAmbiguous ? (
        <HelpCircle className="w-3 h-3 text-amber-400 shrink-0" />
      ) : (
        <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
      )}
      <span className="truncate max-w-[280px] sm:max-w-none">{text}</span>
      {isAmbiguous && (
        <span className="text-[9px] uppercase px-1 rounded bg-amber-500/20 text-amber-300 font-bold ml-1">
          Triggers Clarification
        </span>
      )}
    </button>
  );
}
