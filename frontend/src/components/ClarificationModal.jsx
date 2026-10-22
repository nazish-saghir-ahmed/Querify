import React, { useState } from 'react';
import { HelpCircle, Sparkles, CheckCircle2, ArrowRight, AlertTriangle, X } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#101827] border border-purple-500/40 rounded-2xl p-6 shadow-2xl shadow-purple-950/60 overflow-hidden">
        {/* Neon Glow Highlights */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Ambiguity Detected
                </span>
                <span className="text-xs text-slate-400">Clarification Engine Active</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                {prompt}
              </h3>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Context Explanation */}
        {context && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#151E30] border border-[#1E293B] text-sm text-slate-300 leading-relaxed flex items-start gap-2.5">
            <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <span>{context}</span>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 mb-5">
          {options?.map((option) => {
            const isSelected = selectedId === option.id;
            return (
              <div
                key={option.id}
                onClick={() => setSelectedId(option.id)}
                className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500/70 shadow-sm shadow-purple-900/50'
                    : 'bg-[#151E30]/70 border-[#1E293B] hover:border-slate-700 hover:bg-[#151E30]'
                }`}
              >
                <div className={`mt-0.5 rounded-full p-0.5 transition-colors ${
                  isSelected ? 'text-cyan-400' : 'text-slate-500'
                }`}>
                  <CheckCircle2 className={`w-5 h-5 ${isSelected ? 'fill-cyan-400/20' : ''}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {option.label}
                    </span>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                      {option.value}
                    </span>
                  </div>
                  {option.description && (
                    <p className="text-xs text-slate-400 mt-1 leading-normal">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Custom Input */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Additional custom instruction (optional):
          </label>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="e.g. Limit to companies founded after 2010"
            className="w-full px-3.5 py-2 rounded-lg bg-[#080B14] border border-[#1E293B] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E293B]">
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleConfirm}
            disabled={isLoading || !selectedId}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-neon-violet hover:shadow-neon-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Generating SQL...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Confirm & Generate SQL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
