import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

/**
 * Royal Developer prompt suggestion chip with transparent frosted styling
 * and Royal Blue / Royal Gold status accents.
 */
export default function QuestionChip({ text, isAmbiguous = false, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(text)}
      className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 border text-left backdrop-blur-md ${
        isAmbiguous
          ? 'bg-[#D4AF37]/15 border-[#D4AF37]/35 text-[#D4AF37] hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/25 shadow-sm'
          : 'bg-[#1B263B]/50 border-[#3A506B]/35 text-slate-300 hover:text-[#F7F3E9] hover:border-[#7FA1C3]/60 hover:bg-[#1B263B]/80 shadow-sm'
      }`}
    >
      {isAmbiguous ? (
        <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-[#7FA1C3] shrink-0" />
      )}
      <span className="truncate max-w-[260px] sm:max-w-none text-[11px] font-mono">{text}</span>
      {isAmbiguous && (
        <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 ml-1">
          Ambiguous
        </span>
      )}
    </button>
  );
}
