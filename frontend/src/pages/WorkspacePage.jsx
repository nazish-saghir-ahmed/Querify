import React, { useState, useEffect } from 'react';
import { queryApi } from '../services/api';
import ClarificationModal from '../components/ClarificationModal';
import SqlViewer from '../components/SqlViewer';
import ResultTable from '../components/ResultTable';
import ResultChart from '../components/ResultChart';
import QuestionChip from '../components/QuestionChip';
import EmbeddingInspector from '../components/EmbeddingInspector';
import { generateQueryEmbedding, computeTableRelevance } from '../services/openrouterService';
import {
  Terminal, Table as TableIcon, BarChart3, AlertCircle, RotateCcw,
  ShieldCheck, Database, CornerDownLeft, Sparkles, HelpCircle, Layers,
  ChevronRight, ArrowRight
} from 'lucide-react';

export default function WorkspacePage({ initialQuestion = '', onClearInitialQuestion }) {
  const [question, setQuestion] = useState(initialQuestion);
  const [sessionId, setSessionId] = useState(null);
  const [clarification, setClarification] = useState(null);
  const [generatedSql, setGeneratedSql] = useState('');
  const [explanation, setExplanation] = useState('');
  const [resultData, setResultData] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'chart'
  const [embeddingData, setEmbeddingData] = useState(null);
  const [tableRelevance, setTableRelevance] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState(null);

  // Grouped example questions as explicitly requested
  const ambiguousQuestions = [
    { text: 'Show me the best performing AI companies', isAmbiguous: true },
    { text: 'Which AI company made the most money?', isAmbiguous: true },
  ];

  const directQuestions = [
    { text: 'Show the five most profitable companies', isAmbiguous: false },
    { text: 'Compare revenue across companies in 2024', isAmbiguous: false },
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
    setLoadingStep('Analyzing semantic intent and inspecting ambiguity...');
    setError(null);
    setClarification(null);

    // Concurrently trigger vector embedding generation via OpenRouter SDK
    generateQueryEmbedding(q)
      .then((emb) => {
        setEmbeddingData(emb);
        setTableRelevance(computeTableRelevance(q));
      })
      .catch((err) => {
        console.warn('[OpenRouter] Embedding generation warning:', err);
      });

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
      setLoadingStep('');
    }
  };

  const handleClarifySubmit = async (selectedOptionId, customInput) => {
    if (!sessionId) return;

    setIsLoading(true);
    setLoadingStep('Synthesizing verified SQL for chosen metric...');
    setError(null);

    try {
      const response = await queryApi.clarify(sessionId, selectedOptionId, customInput);
      setClarification(null);
      setGeneratedSql(response.generatedSql);
      setExplanation(response.explanation);
      setResultData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to resolve clarification session');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleExecuteCustomSql = async (sqlToRun) => {
    setIsExecuting(true);
    setError(null);

    try {
      const response = await queryApi.execute(sqlToRun, question, explanation);
      setResultData(response);
    } catch (err) {
      setError(err.message || 'SQL execution failed AST security or database checks');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReset = () => {
    setQuestion('');
    setSessionId(null);
    setClarification(null);
    setGeneratedSql('');
    setExplanation('');
    setResultData(null);
    setEmbeddingData(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-[1150px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* 1. QUERY CONSOLE INPUT CARD */}
      <section className="p-6 rounded-2xl bg-[#111827] border border-[#1F2E47] shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
              Natural Language Console
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AST Guard Active</span>
            </span>
            {(generatedSql || resultData || question) && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-white/[0.05] transition-colors"
                title="Clear current session"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyze();
          }}
          className="relative"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Which AI companies have the highest revenue in 2024?"
              disabled={isLoading}
              className="w-full px-4 py-3.5 bg-[#0B0F17] border border-[#1F2E47] rounded-xl text-sm sm:text-base text-white placeholder-slate-500 font-sans focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 pr-28"
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="absolute right-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:hover:bg-blue-600 shadow-sm"
            >
              <span>{isLoading ? 'Thinking...' : 'Query'}</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* CLICKABLE EXAMPLE QUESTION CHIPS (SPLIT INTO AMBIGUOUS VS DIRECT) */}
        <div className="pt-2 border-t border-[#1F2E47]/70 space-y-3">
          {/* Ambiguous Prompts */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-amber-400 mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ambiguous Questions (Triggers Clarification):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ambiguousQuestions.map((q, idx) => (
                <QuestionChip
                  key={idx}
                  text={q.text}
                  isAmbiguous={q.isAmbiguous}
                  onClick={(val) => {
                    setQuestion(val);
                    handleAnalyze(val);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Direct Prompts */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Direct Analytical Questions:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {directQuestions.map((q, idx) => (
                <QuestionChip
                  key={idx}
                  text={q.text}
                  isAmbiguous={q.isAmbiguous}
                  onClick={(val) => {
                    setQuestion(val);
                    handleAnalyze(val);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. LOADING SKELETON */}
      {isLoading && (
        <section className="p-6 rounded-2xl bg-[#111827] border border-[#1F2E47] space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            <span className="text-xs font-mono text-slate-300">
              {loadingStep || 'Evaluating semantic AST rules and querying catalog...'}
            </span>
          </div>

          <div className="space-y-2.5 pt-2">
            <div className="h-4 bg-[#162238] rounded-md w-3/4 animate-pulse" />
            <div className="h-4 bg-[#162238] rounded-md w-1/2 animate-pulse" />
            <div className="h-24 bg-[#0B0F17] rounded-xl border border-[#1F2E47] animate-pulse" />
          </div>
        </section>
      )}

      {/* 3. ERROR BANNER */}
      {error && (
        <section className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-rose-200">Execution Rejected</p>
            <p className="font-mono text-xs">{error}</p>
          </div>
        </section>
      )}

      {/* 4. CLARIFICATION MODAL */}
      {clarification && (
        <ClarificationModal
          clarification={clarification}
          onSubmit={handleClarifySubmit}
          onCancel={() => setClarification(null)}
          isLoading={isLoading}
        />
      )}

      {/* 5. SQL VIEWER & AST CONTROLS */}
      {generatedSql && !isLoading && (
        <SqlViewer
          sql={generatedSql}
          explanation={explanation}
          onRun={handleExecuteCustomSql}
          isExecuting={isExecuting}
        />
      )}

      {/* 6. OPENROUTER VECTOR INSPECTOR (COLLAPSIBLE / OPTIONAL) */}
      {embeddingData && !isLoading && (
        <EmbeddingInspector
          embedding={embeddingData.embedding}
          model={embeddingData.model}
          tableRelevance={tableRelevance}
        />
      )}

      {/* 7. RESULT TABS & VISUALIZATION */}
      {resultData && !isLoading && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1F2E47] pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white bg-[#111827] border border-[#1F2E47]'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table View</span>
              </button>

              <button
                onClick={() => setViewMode('chart')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'chart'
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white bg-[#111827] border border-[#1F2E47]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Chart Projection</span>
              </button>
            </div>

            <span className="text-xs font-mono text-slate-400">
              Query returned {resultData.rowCount ?? resultData.rows?.length ?? 0} verified records
            </span>
          </div>

          {viewMode === 'table' ? (
            <ResultTable data={resultData} title="Query Execution Results" />
          ) : (
            <ResultChart data={resultData} suggestion={resultData.chartSuggestion} />
          )}
        </section>
      )}

      {/* 8. FRIENDLY EMPTY STATE (WHEN NO QUERY IS RUN YET) */}
      {!isLoading && !generatedSql && !resultData && !error && (
        <section className="py-12 px-6 rounded-2xl bg-[#111827] border border-[#1F2E47] text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-white font-sans">
            Ready to Translate Analytical Inquiries
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Click one of the sample prompt chips above or type a natural language inquiry. If your question contains ambiguity, Querify will ask for clarification before querying the database.
          </p>
        </section>
      )}
    </div>
  );
}
