import React, { useState, useEffect, useRef } from 'react';
import {
  HelpCircle, CheckCircle2, AlertTriangle, X, TrendingUp,
  DollarSign, Percent, BarChart3, Award, ArrowRight
} from 'lucide-react';

export default function ClarificationModal({ clarification, onSubmit, onCancel, isLoading }) {
  if (!clarification) return null;

  const { questionId, prompt, context, options = [] } = clarification;
  const [selectedId, setSelectedId] = useState(options?.[0]?.id || '');
  const [customInput, setCustomInput] = useState('');
  const modalRef = useRef(null);

  // Keyboard navigation: ArrowUp, ArrowDown, Enter, Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (onCancel) onCancel();
        return;
      }

      if (options.length === 0) return;

      const currentIndex = options.findIndex((opt) => opt.id === selectedId);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % options.length;
        setSelectedId(options[nextIndex].id);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + options.length) % options.length;
        setSelectedId(options[prevIndex].id);
      } else if (e.key === 'Enter' && !isLoading) {
        // If user is focused on custom text input, don't preempt Enter unless Shift or intended
        if (document.activeElement?.tagName === 'INPUT' && document.activeElement?.type === 'text') {
          // let normal input happen or submit
        }
        e.preventDefault();
        if (selectedId) {
          onSubmit(selectedId, customInput);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, selectedId, isLoading, customInput, onCancel, onSubmit]);

  const handleConfirm = () => {
    if (!selectedId || isLoading) return;
    onSubmit(selectedId, customInput);
  };

  const getOptionIcon = (option) => {
    const text = `${option.id} ${option.label} ${option.value}`.toLowerCase();
    if (text.includes('rev') || text.includes('sales')) return DollarSign;
    if (text.includes('profit')) return TrendingUp;
    if (text.includes('growth') || text.includes('roi')) return Percent;
    if (text.includes('score') || text.includes('eval') || text.includes('rank')) return Award;
    return BarChart3;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clarification-title"
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-xl bg-[#111827] border border-[#1F2E47] rounded-2xl p-6 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#1F2E47]">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Ambiguity Detected
                </span>
                <span className="text-xs text-slate-400 font-mono">Disambiguation Required</span>
              </div>
              <h3 id="clarification-title" className="text-lg font-bold text-white mt-1.5 font-sans leading-snug">
                {prompt}
              </h3>
            </div>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              title="Close modal (Esc)"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Context explanation */}
        {context && (
          <div className="my-4 p-3 rounded-xl bg-[#0B0F17] border border-[#1F2E47] text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>{context}</span>
          </div>
        )}

        {/* Card-Style Options */}
        <div className="space-y-2.5 my-4 max-h-72 overflow-y-auto pr-1">
          {options.map((option, idx) => {
            const isSelected = selectedId === option.id;
            const IconComponent = getOptionIcon(option);

            return (
              <div
                key={option.id}
                onClick={() => setSelectedId(option.id)}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all duration-150 flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500 shadow-sm'
                    : 'bg-[#0B0F17] border-[#1F2E47] hover:border-slate-500 hover:bg-white/[0.02]'
                }`}
              >
                <div className={`p-2 rounded-lg mt-0.5 ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-[#162238] text-slate-400'
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-semibold text-sm font-sans ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {option.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-[#111827] px-2 py-0.5 rounded border border-[#1F2E47]">
                      Option {idx + 1}
                    </span>
                  </div>
                  {option.description && (
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-sans">
                      {option.description}
                    </p>
                  )}
                </div>

                <div className={`mt-1 rounded-full p-0.5 ${
                  isSelected ? 'text-blue-400' : 'text-slate-600'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'fill-blue-500/20 text-blue-400' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Keyboard hints & Confirm CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#1F2E47]">
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-500">
            <span>Use <kbd className="px-1.5 py-0.5 rounded bg-[#0B0F17] border border-[#1F2E47] text-slate-300">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-[#0B0F17] border border-[#1F2E47] text-slate-300">↓</kbd> to select</span>
            <span>•</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-[#0B0F17] border border-[#1F2E47] text-slate-300">Enter</kbd> to confirm</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#0B0F17] border border-[#1F2E47] hover:border-slate-500 transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedId || isLoading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all disabled:opacity-50"
            >
              <span>{isLoading ? 'Synthesizing...' : 'Generate Verified SQL'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
