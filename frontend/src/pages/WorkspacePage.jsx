import React, { useState, useEffect } from 'react';
import { queryApi } from '../services/api';
import ClarificationModal from '../components/ClarificationModal';
import SqlViewer from '../components/SqlViewer';
import ResultTable from '../components/ResultTable';
import ResultChart from '../components/ResultChart';
import QuestionChip from '../components/QuestionChip';
import { Terminal, Table as TableIcon, BarChart3, AlertCircle, RotateCcw, ShieldCheck, Database, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';

export default function WorkspacePage({ initialQuestion = '', onClearInitialQuestion }) {
  const [question, setQuestion] = useState(initialQuestion);
  const [sessionId, setSessionId] = useState(null);
  const [clarification, setClarification] = useState(null);
  const [generatedSql, setGeneratedSql] = useState('');
  const [explanation, setExplanation] = useState('');
  const [resultData, setResultData] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'chart'

  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState(null);

  // Suggested sample queries
  const sampleQuestions = [
    { text: 'Show me the best performing AI companies', isAmbiguous: true },
    { text: 'Which AI company made the most money?', isAmbiguous: true },
    { text: 'Show the top AI models', isAmbiguous: true },
    { text: 'Which companies are growing fast?', isAmbiguous: true },
    { text: 'Which AI companies have the highest revenue in 2024?', isAmbiguous: false },
    { text: 'Show the five most profitable companies.', isAmbiguous: false },
    { text: 'Compare revenue across companies in 2024.', isAmbiguous: false },
    { text: 'Which research projects have the largest budgets?', isAmbiguous: false },
  ];

  // Auto-run if question was passed from landing or history
  useEffect(() => {
    if (initialQuestion) {
      setQuestion(initialQuestion);
      handleAnalyze(initialQuestion);
      if (onClearInitialQuestion) onClearInitialQuestion();
    }
  }, [initialQuestion]);

  const handleAnalyze = async (queryText = question) => {
    const q = queryText.trim();
    if (!q) return;

    setIsLoading(true);
    setError(null);
    setClarification(null);

    try {
      const response = await queryApi.analyze(q, sessionId);
      setSessionId(response.sessionId);

      if (response.status === 'CLARIFICATION_NEEDED') {
        setClarification(response.clarification);
      } else if (response.status === 'SQL_GENERATED') {
        setGeneratedSql(response.generatedSql);
        setExplanation(response.explanation);
        setResultData(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to process natural language question');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClarifySubmit = async (selectedOptionId, customInput) => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await queryApi.clarify(sessionId, selectedOptionId, customInput);
      setClarification(null);
      setGeneratedSql(response.generatedSql);
      setExplanation(response.explanation);
      setResultData(response.data);
    } catch (err) {
      setError(err.message || 'Clarification resolution failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectExecute = async (sqlToRun) => {
    if (!sqlToRun) return;

    setIsExecuting(true);
    setError(null);

    try {
      const result = await queryApi.execute(sqlToRun, question, explanation);
      setResultData(result);
    } catch (err) {
      setError(err.message || 'Direct SQL execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleChipClick = (chipText) => {
    setQuestion(chipText);
    handleAnalyze(chipText);
  };

  const handleReset = () => {
    setQuestion('');
    setSessionId(null);
    setClarification(null);
    setGeneratedSql('');
    setExplanation('');
    setResultData(null);
    setError(null);
  };

  return (
    <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Workspace Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#415A77]/30">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F3E9] flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400">
                <Terminal className="w-5 h-5" />
              </span>
              Query Workspace
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1B263B]/60 text-[#D4AF37] border border-[#D4AF37]/30">
              v1.2 Console
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 font-sans">
            Natural language to AST-verified SQL translation with multi-turn ambiguity resolution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-300 px-3 py-1.5 rounded-lg bg-[#1B263B]/50 backdrop-blur-md border border-[#415A77]/35">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>AST Guard: Active</span>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1B263B]/50 hover:bg-[#1B263B] text-slate-300 hover:text-white border border-[#415A77]/35 transition-colors backdrop-blur-md"
            title="Reset workspace and state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Session</span>
          </button>
        </div>
      </div>

      {/* Redesigned Query Composer / Command Console (Transparent Frosted Glass) */}
      <div className="relative rounded-2xl bg-[#0D1B2A]/60 border border-[#415A77]/35 shadow-2xl backdrop-blur-2xl overflow-hidden focus-within:border-blue-500/70 focus-within:shadow-[0_0_35px_-5px_rgba(37,99,235,0.35)] transition-all duration-300">
        {/* Top Console Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1B263B]/50 backdrop-blur-md border-b border-[#415A77]/30 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-blue-400">
              <Database className="w-3.5 h-3.5" />
              <span>querify_db</span>
            </span>
            <span className="text-[#415A77]">•</span>
            <span className="text-slate-300 font-mono text-[11px]">Dialect: MySQL 8</span>
            <span className="text-[#415A77]">•</span>
            <span className="text-slate-300 font-mono text-[11px]">Mode: Read-Only (SELECT)</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#0D1B2A]/60 border border-[#415A77]/35 text-[#F7F3E9] text-[10px]">
              Enter ↵
            </kbd>
            <span>to analyze</span>
          </div>
        </div>

        {/* Input Chamber */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyze();
          }}
          className="p-4 sm:p-5 space-y-4"
        >
          <div className="flex items-start gap-3">
            <span className="font-mono text-sm text-blue-400 font-bold select-none pt-2.5">
              &gt;_
            </span>
            <div className="flex-1 relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask in natural language... e.g. Which AI companies had highest revenue in 2024?"
                className="w-full bg-transparent text-[#F7F3E9] placeholder-slate-400 font-sans text-sm sm:text-base focus:outline-none py-2 pr-10 tracking-wide"
                autoFocus
              />
              {question && (
                <button
                  type="button"
                  onClick={() => setQuestion('')}
                  className="absolute right-0 top-2.5 text-slate-400 hover:text-white transition-colors text-xs p-1"
                  title="Clear input"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Synthesize Action Button */}
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-xs tracking-wide shadow-[0_0_20px_-3px_rgba(37,99,235,0.5)] border border-blue-400/40 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <span>Synthesize SQL</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Prompt Suggestion Chips */}
          <div className="pt-2 border-t border-[#415A77]/25 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-wider mr-1">
              Sample Prompts:
            </span>
            {sampleQuestions.slice(0, 5).map((q, idx) => (
              <QuestionChip
                key={idx}
                text={q.text}
                isAmbiguous={q.isAmbiguous}
                onClick={handleChipClick}
              />
            ))}
          </div>
        </form>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-red-200 text-xs flex items-start gap-3 animate-fade-in backdrop-blur-md">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-red-300 font-mono">Execution Notice:</span>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Clarification Modal Popup */}
      {clarification && (
        <ClarificationModal
          clarification={clarification}
          onSubmit={handleClarifySubmit}
          onCancel={() => setClarification(null)}
          isLoading={isLoading}
        />
      )}

      {/* Generated SQL Viewer */}
      {generatedSql && (
        <div className="animate-fade-in">
          <SqlViewer
            sql={generatedSql}
            explanation={explanation}
            onRun={handleDirectExecute}
            isExecuting={isExecuting}
          />
        </div>
      )}

      {/* Result Display Section (Table or Chart) */}
      {resultData && resultData.rows && (
        <div className="space-y-4 animate-fade-in">
          {/* View Mode Toggle Bar (Frosted Glass) */}
          <div className="flex items-center justify-between bg-[#0D1B2A]/60 backdrop-blur-xl p-2 rounded-xl border border-[#415A77]/35">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider pl-2">
                Visualization Mode:
              </span>
              <div className="flex items-center bg-[#1B263B]/60 p-1 rounded-lg border border-[#415A77]/30">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    viewMode === 'table'
                      ? 'bg-blue-600 text-white font-semibold shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Data Table</span>
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    viewMode === 'chart'
                      ? 'bg-blue-600 text-white font-semibold shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Visual Chart</span>
                </button>
              </div>
            </div>

            <div className="text-xs font-mono text-slate-300 pr-2">
              <span className="text-[#D4AF37] font-semibold">{resultData.rowCount || resultData.rows.length}</span> rows returned
            </div>
          </div>

          {/* Conditional View */}
          {viewMode === 'table' ? (
            <ResultTable data={resultData} title="Query Results" />
          ) : (
            <ResultChart data={resultData} suggestion={resultData.chartSuggestion} />
          )}
        </div>
      )}
    </div>
  );
}
