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
  Terminal, Table as TableIcon, BarChart3, AlertCircle, AlertTriangle, RotateCcw,
  ShieldCheck, Database, CornerDownLeft, Sparkles, HelpCircle, Layers,
  ChevronRight, ArrowRight, X, Cpu, Search, CheckCircle2
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
  const [warning, setWarning] = useState(null);

  // Grouped example questions
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
    setLoadingStep('Evaluating semantic intent and checking ambiguity...');
    setError(null);
    setWarning(null);
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
      } else if (response.status === 'NO_DATA_AVAILABLE' || (!response.generatedSql && response.explanation)) {
        setGeneratedSql('');
        setResultData(null);
        setWarning(response.explanation || 'No relevant data available for this query in the database.');
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
    setWarning(null);
  };

  return (
    <div className="w-full max-w-[1150px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* 1. QUERY CONSOLE COMMAND BAR */}
      <section className="relative p-6 sm:p-7 rounded-2xl bg-[#0B132B]/85 border border-blue-500/20 shadow-2xl backdrop-blur-xl space-y-5 transition-all">
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <span>Natural Language Console</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              </h2>
              <p className="text-[11px] text-slate-400 font-sans">
                Type natural queries — ambiguity triggers proactive disambiguation before execution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-white bg-blue-950/80 px-3 py-1.5 rounded-full border border-blue-500/30 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>AST Guard Active</span>
            </span>

            {(generatedSql || resultData || question) && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-blue-950/40 border border-blue-800/40 hover:bg-blue-900/40 transition-colors cursor-pointer"
                title="Clear current session and reset fields"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Input Form with Command Bar Design */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyze();
          }}
          className="relative"
        >
          <div className="relative flex items-center group rounded-xl bg-[#080D1A]/90 border border-blue-600/30 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/25 transition-all shadow-inner">
            <div className="pl-4 text-blue-400 shrink-0 select-none">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Which AI companies have the highest revenue in 2024?"
              disabled={isLoading}
              className="w-full pl-3 pr-32 py-3.5 bg-transparent text-sm sm:text-base text-white placeholder-slate-500 font-sans focus:outline-none transition-colors disabled:opacity-50"
            />

            {question && !isLoading && (
              <button
                type="button"
                onClick={() => setQuestion('')}
                className="p-1.5 mr-2 rounded-lg text-slate-400 hover:text-white hover:bg-blue-900/40 transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="absolute right-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:hover:bg-blue-600 shadow-midnight cursor-pointer"
            >
              <span>{isLoading ? 'Processing' : 'Run Query'}</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* CLICKABLE EXAMPLE QUESTION CHIPS (SPLIT INTO AMBIGUOUS VS DIRECT) */}
        <div className="pt-3 border-t border-blue-900/30 space-y-3.5">
          {/* Ambiguous Prompts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-200">
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Ambiguous Questions (Triggers Clarification Dialogue):</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                Halts execution & prompts options
              </span>
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
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Direct Analytical Questions:</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                Executes directly without clarification
              </span>
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

      {/* 2. PROGRESSIVE PIPELINE LOADING STATE */}
      {isLoading && (
        <section className="p-6 rounded-2xl bg-[#0B132B]/80 border border-blue-500/30 backdrop-blur-xl space-y-4 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between border-b border-blue-900/40 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
              <span className="text-xs font-mono font-bold text-white">
                {loadingStep || 'Evaluating semantic AST rules and querying catalog...'}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600/30 text-white border border-blue-400/40">
              Live Pipeline Active
            </span>
          </div>

          {/* Stepper Status Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-center gap-2 text-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
              <span className="truncate">1. Intent Parsing</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-center gap-2 text-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
              <span className="truncate">2. Ambiguity Check</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-center gap-2 text-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
              <span className="truncate">3. AST Security Guard</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-center gap-2 text-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
              <span className="truncate">4. SQL Synthesis</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="h-3.5 bg-blue-950/70 rounded-md w-3/4 animate-pulse" />
            <div className="h-3.5 bg-blue-950/70 rounded-md w-1/2 animate-pulse" />
          </div>
        </section>
      )}

      {/* 3. ERROR BANNER */}
      {error && (
        <section className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-white text-xs sm:text-sm flex items-start gap-3 backdrop-blur-xl animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-red-200">Execution Rejected or Security Policy Triggered</p>
            <p className="font-mono text-xs text-red-300/90">{error}</p>
          </div>
        </section>
      )}

      {/* 3.1 LIGHT WARNING: NO DATA AVAILABLE IN DATABASE */}
      {warning && (
        <section className="p-5 rounded-2xl bg-amber-950/25 border border-amber-500/40 text-white flex items-start gap-3.5 backdrop-blur-xl animate-fade-in shadow-xl">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-amber-200 text-sm font-display tracking-wide">
                No Data Available in Database Catalog
              </p>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Outside Schema Scope
              </span>
            </div>
            <p className="text-xs text-amber-100/90 leading-relaxed font-sans">
              {warning}
            </p>
            <div className="pt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
              <span className="text-slate-400">Available database tables:</span>
              {['companies', 'ai_models', 'financial_performance', 'ai_investments', 'research_projects', 'market_performance'].map((tbl) => (
                <span key={tbl} className="px-2 py-0.5 rounded-md bg-blue-950/70 border border-blue-700/50 text-blue-300">
                  {tbl}
                </span>
              ))}
            </div>
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

      {/* 6. OPENROUTER VECTOR INSPECTOR (Fixed Props) */}
      {embeddingData && !isLoading && !warning && (
        <EmbeddingInspector
          embeddingData={embeddingData}
          queryText={question}
          tableRelevance={tableRelevance}
        />
      )}

      {/* 7. RESULT TABS & VISUALIZATION */}
      {resultData && !isLoading && (
        <section className="space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-900/40 pb-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-blue-950/60 border border-blue-800/40">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white shadow-midnight'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table View</span>
              </button>

              <button
                onClick={() => setViewMode('chart')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'chart'
                    ? 'bg-blue-600 text-white shadow-midnight'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Chart Projection</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1 text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{resultData.rowCount ?? resultData.rows?.length ?? 0} verified records</span>
              </span>
              {resultData.executionTimeMs !== undefined && (
                <span className="px-2 py-0.5 rounded bg-blue-950/70 border border-blue-800/40 text-blue-300">
                  {resultData.executionTimeMs}ms
                </span>
              )}
            </div>
          </div>

          {viewMode === 'table' ? (
            <ResultTable data={resultData} title="Query Execution Results" />
          ) : (
            <ResultChart data={resultData} suggestion={resultData.chartSuggestion} />
          )}
        </section>
      )}

      {/* 8. PROFESSIONAL EMPTY STATE (WHEN NO QUERY IS RUN YET) */}
      {!isLoading && !generatedSql && !resultData && !error && (
        <section className="py-14 px-6 rounded-2xl bg-[#0B132B]/60 border border-blue-900/40 text-center space-y-4 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto shadow-inner">
            <Database className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 max-w-lg mx-auto">
            <h3 className="text-base font-bold text-white font-display">
              Ready to Translate Analytical Inquiries
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              Click one of the prompt chips above or type your own question. If ambiguity is detected, Querify halts execution and guides you to the exact business metric.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              SELECT-only Guarantee
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              OpenRouter 2048-dim Embeddings
            </span>
          </div>
        </section>
      )}
    </div>
  );
}
