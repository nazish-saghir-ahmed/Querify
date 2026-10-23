import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

export default function QuestionChip({ text, isAmbiguous = false, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(text)}
      className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all duration-150 border text-left backdrop-blur-md ${
        isAmbiguous
          ? 'bg-blue-950/40 border-blue-500/40 text-white hover:border-blue-400 hover:bg-blue-900/30 shadow-sm'
          : 'bg-blue-950/20 border-blue-900/40 text-blue-200/90 hover:text-white hover:border-blue-500/50 hover:bg-blue-900/20'
      }`}
    >
      {isAmbiguous ? (
        <HelpCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
      )}
      <span className="font-mono text-[11px] truncate font-medium">{text}</span>
      {isAmbiguous && (
        <span className="text-[9px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-600/30 text-white border border-blue-400/30 ml-auto">
          Ambiguous
        </span>
      )}
    </button>
  );
}
