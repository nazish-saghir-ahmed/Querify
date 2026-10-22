import React, { useState, useEffect } from 'react';
import { queryApi } from '../services/api';
import ClarificationModal from '../components/ClarificationModal';
import SqlViewer from '../components/SqlViewer';
import ResultTable from '../components/ResultTable';
import ResultChart from '../components/ResultChart';
import QuestionChip from '../components/QuestionChip';
import { Sparkles, Terminal, Table as TableIcon, BarChart3, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

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

  // Suggested questions
  const sampleQuestions = [
    { text: 'Show me the best performing AI companies', isAmbiguous: true },
    { text: 'Which AI company made the most money?', isAmbiguous: true },
    { text: 'Show the top AI models', isAmbiguous: true },
    { text: 'Which companies are growing fast?', isAmbiguous: true },
    { text: 'Which AI companies have the highest revenue in 2024?', isAmbiguous: false },
    { text: 'Show the five most profitable companies.', isAmbiguous: false },
    { text: 'Compare revenue across companies in 2024.', isAmbiguous: false },
    { text: 'Which research projects have the largest budgets?', isAmbiguous: false },
    { text: 'What is the average AI investment by company?', isAmbiguous: false },
    { text: 'Show revenue trends over the available years.', isAmbiguous: false },
  ];

  // Auto-run if question was passed from landing page
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
    <div className="min-h-screen bg-[#080B14] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#1E293B]">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Terminal className="w-6 h-6 text-purple-400" />
            Query Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ask analytical questions about AI companies, models, financials, and investments.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#151E30] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E293B] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Query</span>
        </button>
      </div>

      {/* Main Query Input Box */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#101827] border border-purple-500/30 shadow-card-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400" />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyze();
          }}
          className="space-y-4"
        >
          <div className="relative flex items-center">
            <Sparkles className="w-5 h-5 text-purple-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Which AI companies had highest revenue in 2024? or Show me the best performing AI companies"
              className="w-full pl-12 pr-28 py-3.5 rounded-xl bg-[#080B14] border border-[#1E293B] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="absolute right-2 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-neon-violet transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-500 font-medium">Examples:</span>
            {sampleQuestions.slice(0, 6).map((q, idx) => (
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
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-red-300">Execution Error:</span>
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
        <SqlViewer
          sql={generatedSql}
          explanation={explanation}
          onRun={handleDirectExecute}
          isExecuting={isExecuting}
        />
      )}

      {/* Result Display Section (Table or Chart) */}
      {resultData && resultData.rows && (
        <div className="space-y-4">
          {/* View Mode Toggle Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Output View:
              </span>
              <div className="flex items-center bg-[#101827] p-1 rounded-xl border border-[#1E293B]">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    viewMode === 'table' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Data Table</span>
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    viewMode === 'chart' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Visual Chart</span>
                </button>
              </div>
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
