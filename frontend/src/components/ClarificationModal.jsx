import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, ArrowRight, AlertTriangle, X, Terminal } from 'lucide-react';

/**
 * Redesigned Clarification Decision Modal
 * Presents targeted multi-turn disambiguation options with electric mint highlights
 * and high-contrast developer tool aesthetics.
 */
export default function ClarificationModal({ clarification, onSubmit, onCancel, isLoading }) {
  if (!clarification) return null;

  const { questionId, prompt, context, options } = clarification;
  const [selectedId, setSelectedId] = useState(options?.[0]?.id || '');
  const [customInput, setCustomInput] = useState('');

  const handleConfirm = () => {
    if (!selectedId) return;
    onSubmit(selectedId, customInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0A0E17] border border-white/[0.12] rounded-2xl p-6 shadow-2xl shadow-black/80 overflow-hidden">
        {/* Subtle ambient light */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#00F5A0]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-white/[0.08]">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Ambiguity Detected
                </span>
                <span className="text-xs text-slate-400 font-mono">Clarification Engine Required</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1.5 font-sans leading-snug">
                {prompt}
              </h3>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Context Explanation */}
        {context && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#0F1523] border border-white/[0.08] text-xs text-slate-300 leading-relaxed flex items-start gap-2.5 font-sans">
            <HelpCircle className="w-4 h-4 text-[#00F5A0] shrink-0 mt-0.5" />
            <span>{context}</span>
          </div>
        )}

        {/* Disambiguation Options */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 mb-5">
          {options?.map((option) => {
            const isSelected = selectedId === option.id;
            return (
              <div
                key={option.id}
                onClick={() => setSelectedId(option.id)}
                className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-[#0F1523] border-[#00F5A0]/60 shadow-[0_0_20px_-5px_rgba(0,245,160,0.25)]'
                    : 'bg-[#0A0E17] border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.02]'
                }`}
              >
                <div className={`mt-0.5 rounded-full p-0.5 transition-colors ${
                  isSelected ? 'text-[#00F5A0]' : 'text-slate-600'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'fill-[#00F5A0]/20' : ''}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-xs sm:text-sm font-sans ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {option.label}
                    </span>
                    <span className="text-[10px] font-mono text-[#00F5A0] bg-white/[0.04] px-2 py-0.5 rounded border border-[#00F5A0]/20">
                      {option.value}
                    </span>
                  </div>
                  {option.description && (
                    <p className="text-xs text-slate-400 mt-1 leading-normal font-sans">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Custom Parameter */}
        <div className="mb-6">
          <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
            Additional custom constraint (optional):
          </label>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="e.g. Limit to companies founded after 2010 or specific fiscal year"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080D] border border-white/[0.1] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00F5A0]/50 transition-colors"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleConfirm}
            disabled={isLoading || !selectedId}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00F5A0] hover:bg-[#00DF89] text-[#06080D] font-bold text-xs tracking-wide shadow-[0_0_20px_-3px_rgba(0,245,160,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-[#06080D]/30 border-t-[#06080D] rounded-full animate-spin" />
                Synthesizing Disambiguated SQL...
              </span>
            ) : (
              <>
                <Terminal className="w-3.5 h-3.5" />
                <span>Confirm Intent & Synthesize SQL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
