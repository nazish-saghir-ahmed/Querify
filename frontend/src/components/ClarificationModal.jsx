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
        if (document.activeElement?.tagName === 'INPUT' && document.activeElement?.type === 'text') {
          // let normal input happen
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clarification-title"
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-xl bg-[#080D1A] border border-blue-600/30 rounded-2xl p-6 sm:p-7 shadow-2xl overflow-hidden backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-blue-900/30">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-white mt-0.5 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-600/30 text-white border border-blue-400/40">
                  Ambiguity Detected
                </span>
                <span className="text-xs text-blue-200/70 font-mono">Disambiguation Required</span>
              </div>
              <h3 id="clarification-title" className="text-lg sm:text-xl font-display font-extrabold text-white mt-1.5 leading-snug">
                {prompt}
              </h3>
            </div>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="p-1 rounded-lg text-blue-300 hover:text-white hover:bg-blue-900/30 transition-colors"
              title="Close modal (Esc)"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Context explanation */}
        {context && (
          <div className="my-4 p-3.5 rounded-xl bg-blue-950/20 border border-blue-800/40 text-xs text-blue-100/80 leading-relaxed flex items-start gap-2.5 font-sans">
            <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>{context}</span>
          </div>
        )}

        {/* Card-Style Options in Midnight Blue & Crisp White */}
        <div className="space-y-2.5 my-4 max-h-72 overflow-y-auto pr-1">
          {options.map((option, idx) => {
            const isSelected = selectedId === option.id;
            const IconComponent = getOptionIcon(option);

            return (
              <div
                key={option.id}
                onClick={() => setSelectedId(option.id)}
                className={`cursor-pointer p-4 rounded-xl border transition-all duration-150 flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 shadow-midnight'
                    : 'bg-blue-950/20 border-blue-900/40 hover:border-blue-600/40 hover:bg-blue-900/20'
                }`}
              >
                <div className={`p-2 rounded-lg mt-0.5 ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-blue-950/60 text-blue-300'
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-display font-bold text-sm ${isSelected ? 'text-white' : 'text-blue-100'}`}>
                      {option.label}
                    </span>
                    <span className="text-[10px] font-mono text-blue-200 bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-800/40">
                      Option {idx + 1}
                    </span>
                  </div>
                  {option.description && (
                    <p className="text-xs text-blue-200/70 mt-1 leading-relaxed font-sans">
                      {option.description}
                    </p>
                  )}
                </div>

                <div className={`mt-1 rounded-full p-0.5 ${
                  isSelected ? 'text-white' : 'text-blue-900'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-700'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Keyboard hints & Confirm CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-blue-900/30">
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-blue-300/70">
            <span>Use <kbd className="px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800 text-white">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800 text-white">↓</kbd> to select</span>
            <span>•</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800 text-white">Enter</kbd> to confirm</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-blue-200 hover:text-white bg-blue-950/40 hover:bg-blue-900/40 border border-blue-800/40 transition-colors"
              >
                Dismiss
              </button>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading || !selectedId}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold tracking-wide shadow-midnight transition-all"
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
