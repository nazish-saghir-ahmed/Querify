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

  // Summary Metrics
  const totalQueries = safeList.length;
  const blockedCount = safeList.filter((item) => item.status === 'SECURITY_BLOCKED').length;
  const successCount = safeList.filter((item) => item.status !== 'SECURITY_BLOCKED').length;
  const avgLatency = totalQueries > 0
    ? Math.round(safeList.reduce((acc, curr) => acc + (curr.executionTimeMs || 0), 0) / totalQueries)
    : 0;

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B132B]/85 border border-blue-500/25 shadow-2xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-display">
                Query Audit Trail
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-sans">
                Immutable audit log of natural language questions, synthesized SQL, execution times, and security events.
              </p>
            </div>
          </div>
        </div>

        {safeList.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-blue-950/60 hover:bg-red-950/40 border border-blue-800/40 hover:border-red-500/40 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-[#0B132B]/80 border border-blue-500/20 backdrop-blur-md">
          <span className="text-[11px] font-mono uppercase text-slate-400 font-medium">Total Inquiries</span>
          <p className="text-2xl font-bold font-display text-white mt-1">{totalQueries}</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0B132B]/80 border border-blue-500/20 backdrop-blur-md">
          <span className="text-[11px] font-mono uppercase text-slate-400 font-medium">Valid SELECTs</span>
          <p className="text-2xl font-bold font-display text-blue-400 mt-1">{successCount}</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0B132B]/80 border border-blue-500/20 backdrop-blur-md">
          <span className="text-[11px] font-mono uppercase text-slate-400 font-medium">Security Interventions</span>
          <p className="text-2xl font-bold font-display text-slate-300 mt-1">{blockedCount}</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0B132B]/80 border border-blue-500/20 backdrop-blur-md">
          <span className="text-[11px] font-mono uppercase text-slate-400 font-medium">Avg Execution</span>
          <p className="text-2xl font-bold font-display text-white mt-1">{avgLatency}ms</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by question, SQL keywords, or execution status..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#0B132B]/80 border border-blue-500/25 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors backdrop-blur-md"
        />
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-8 text-center bg-[#0B132B]/80 border border-blue-500/25 rounded-2xl text-slate-300">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-mono">Loading query logs...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-8 text-center bg-[#0B132B]/80 border border-blue-500/25 rounded-2xl text-slate-300 space-y-2">
            <History className="w-8 h-8 text-blue-400/60 mx-auto" />
            <p className="text-sm font-bold text-white">No Query Records Found</p>
            <p className="text-xs text-slate-400">
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
                className="p-5 rounded-2xl bg-[#0B132B]/80 border border-blue-500/20 hover:border-blue-500/40 transition-all space-y-3 backdrop-blur-md shadow-lg"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold flex items-center gap-1 ${
                      isBlocked
                        ? 'bg-red-950/60 text-red-200 border-red-500/50'
                        : 'bg-blue-600/30 text-white border-blue-400/40'
                    }`}>
                      {isBlocked ? <ShieldAlert className="w-3 h-3 text-red-400" /> : <ShieldCheck className="w-3 h-3 text-blue-400" />}
                      <span>{item.status || 'SUCCESS'}</span>
                    </span>

                    {item.executionTimeMs !== undefined && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                        <Clock className="w-3 h-3 text-blue-400" />
                        <span>{item.executionTimeMs} ms</span>
                      </span>
                    )}

                    {item.rowCount !== undefined && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                        <Hash className="w-3 h-3 text-blue-400" />
                        <span>{item.rowCount} rows</span>
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recent'}
                  </span>
                </div>

                {/* Question */}
                <div className="text-sm font-bold text-white font-sans">
                  "{item.naturalQuery}"
                </div>

                {/* Generated SQL snippet */}
                {item.generatedSql && (
                  <div className="p-3 rounded-xl bg-[#080D1A]/90 border border-blue-900/40 font-mono text-xs text-blue-200 overflow-x-auto">
                    <code>{item.generatedSql}</code>
                  </div>
                )}

                {/* Error message if blocked */}
                {item.errorMessage && (
                  <p className="text-xs text-red-300 font-mono bg-red-950/40 p-2.5 rounded-lg border border-red-500/30">
                    {item.errorMessage}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-blue-900/30">
                  <div className="flex items-center gap-2">
                    {item.generatedSql && (
                      <button
                        onClick={() => handleCopy(item.id, item.generatedSql)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-blue-950/60 hover:bg-blue-900/50 border border-blue-800/50 transition-colors cursor-pointer"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-white">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-blue-400" />
                            <span>Copy SQL</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => handleRerun(item.naturalQuery)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-midnight cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Re-run in Console</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-blue-900/40 transition-colors cursor-pointer"
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
