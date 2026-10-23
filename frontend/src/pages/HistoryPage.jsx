import React, { useState, useEffect } from 'react';
import { historyApi } from '../services/api';
import {
  History, Trash2, Play, Copy, Check, Clock, Hash,
  Search, ShieldCheck, ShieldAlert, AlertTriangle, ArrowRight
} from 'lucide-react';

export default function HistoryPage({ onSelectQuestion, setActiveTab }) {
  const [historyList, setHistoryList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await historyApi.getAll();
      setHistoryList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load history:', err);
      setHistoryList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await historyApi.deleteById(id);
      setHistoryList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all query audit records?')) return;
    try {
      await historyApi.clearAll();
      setHistoryList([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const handleCopy = (id, sql) => {
    if (!sql) return;
    navigator.clipboard.writeText(sql);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRerun = (naturalQuery) => {
    if (onSelectQuestion) {
      onSelectQuestion(naturalQuery);
    }
    setActiveTab('workspace');
  };

  const safeList = Array.isArray(historyList) ? historyList : [];
  const filteredList = safeList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.naturalQuery?.toLowerCase().includes(q) ||
      item.generatedSql?.toLowerCase().includes(q) ||
      item.status?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-[1150px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#111827] border border-[#1F2E47]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white font-sans">
              Query Audit Trail
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Immutable log of natural language questions, synthesized SQL, execution times, and security events.
          </p>
        </div>

        {safeList.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-200 hover:text-white bg-blue-950/40 border border-blue-800/40 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-blue-300 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by question, SQL keywords, or execution status..."
          className="w-full pl-9 pr-4 py-2.5 bg-blue-950/20 border border-blue-900/40 rounded-xl text-xs sm:text-sm text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-500 backdrop-blur-md"
        />
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-8 text-center bg-blue-950/20 border border-blue-900/40 rounded-2xl text-blue-200">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-mono">Loading query logs...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-8 text-center bg-blue-950/20 border border-blue-900/40 rounded-2xl text-blue-200 space-y-2">
            <History className="w-8 h-8 text-blue-400/60 mx-auto" />
            <p className="text-sm font-bold text-white">No Query Records Found</p>
            <p className="text-xs text-blue-300/70">
              {searchQuery ? 'No queries match your search query.' : 'Run your first natural language query from the console.'}
            </p>
          </div>
        ) : (
          filteredList.map((item) => {
            const isBlocked = item.status === 'SECURITY_BLOCKED';
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-blue-950/20 border border-blue-900/40 hover:border-blue-600/50 transition-colors space-y-3 backdrop-blur-md"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold flex items-center gap-1 ${
                      isBlocked
                        ? 'bg-blue-950 text-blue-200 border-blue-500'
                        : 'bg-blue-600/30 text-white border-blue-400/40'
                    }`}>
                      {isBlocked ? <ShieldAlert className="w-3 h-3 text-white" /> : <ShieldCheck className="w-3 h-3 text-white" />}
                      <span>{item.status || 'SUCCESS'}</span>
                    </span>

                    {item.executionTimeMs !== undefined && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-blue-200 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                        <Clock className="w-3 h-3 text-blue-400" />
                        <span>{item.executionTimeMs} ms</span>
                      </span>
                    )}

                    {item.rowCount !== undefined && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-blue-200 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                        <Hash className="w-3 h-3 text-blue-400" />
                        <span>{item.rowCount} rows</span>
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-blue-300/70">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recent'}
                  </span>
                </div>

                {/* Question */}
                <div className="text-sm font-bold text-white font-sans">
                  "{item.naturalQuery}"
                </div>

                {/* Generated SQL snippet */}
                {item.generatedSql && (
                  <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/50 font-mono text-xs text-white overflow-x-auto">
                    <code>{item.generatedSql}</code>
                  </div>
                )}

                {/* Error message if blocked */}
                {item.errorMessage && (
                  <p className="text-xs text-white font-mono bg-blue-950/50 p-2 rounded-lg border border-blue-800/40">
                    {item.errorMessage}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-blue-900/30">
                  <div className="flex items-center gap-2">
                    {item.generatedSql && (
                      <button
                        onClick={() => handleCopy(item.id, item.generatedSql)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-blue-200 hover:text-white bg-blue-950/50 hover:bg-blue-900/40 border border-blue-800/40 transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span className="text-white">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-blue-300" />
                            <span>Copy SQL</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => handleRerun(item.naturalQuery)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-midnight"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Re-run</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-blue-300 hover:text-white hover:bg-blue-900/40 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
