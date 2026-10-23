import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, ArrowRight, AlertTriangle, X, Terminal } from 'lucide-react';

/**
 * Royal Disambiguation Decision Modal
 * Transparent frosted glass styling with Royal Gold ambiguity accents
 * and Royal Blue selected option indicators.
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0D1B2A]/85 border border-[#415A77]/45 rounded-2xl p-6 shadow-2xl backdrop-blur-2xl overflow-hidden">
        {/* Subtle ambient light */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-[#415A77]/30">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] mt-0.5">
              <AlertTriangle className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/35">
                  Ambiguity Detected
                </span>
                <span className="text-xs text-slate-300 font-mono">Clarification Engine Required</span>
              </div>
              <h3 className="text-lg font-bold text-[#F7F3E9] mt-1.5 font-sans leading-snug">
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
          <div className="mb-5 p-3.5 rounded-xl bg-[#1B263B]/50 border border-[#415A77]/35 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5 font-sans backdrop-blur-sm">
            <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>{context}</span>
          </div>
        )}

        {/* Disambiguation Options (Transparent Frosted Glass Items) */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 mb-5">
          {options?.map((option) => {
            const isSelected = selectedId === option.id;
            return (
              <div
                key={option.id}
                onClick={() => setSelectedId(option.id)}
                className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 backdrop-blur-sm ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500/70 shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)]'
                    : 'bg-[#1B263B]/30 border-[#415A77]/30 hover:border-blue-400/50 hover:bg-[#1B263B]/50'
                }`}
              >
                <div className={`mt-0.5 rounded-full p-0.5 transition-colors ${
                  isSelected ? 'text-blue-400' : 'text-slate-500'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'fill-blue-500/20' : ''}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-xs sm:text-sm font-sans ${isSelected ? 'text-[#F7F3E9]' : 'text-slate-300'}`}>
                      {option.label}
                    </span>
                    <span className="text-[10px] font-mono text-blue-300 bg-[#0D1B2A]/60 px-2 py-0.5 rounded border border-blue-500/30">
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
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1B2A]/60 border border-[#415A77]/35 text-xs sm:text-sm text-[#F7F3E9] placeholder-slate-400 focus:outline-none focus:border-blue-500/60 transition-colors"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#415A77]/30">
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#1B263B]/50 hover:bg-[#1B263B] border border-[#415A77]/35 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleConfirm}
            disabled={isLoading || !selectedId}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-xs tracking-wide shadow-[0_0_20px_-3px_rgba(37,99,235,0.5)] border border-blue-400/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Synthesizing Disambiguated SQL...
              </span>
            ) : (
              <>
                <Terminal className="w-3.5 h-3.5" />
                <span>Confirm Intent & Synthesize</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
