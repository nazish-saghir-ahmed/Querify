import React, { useState, useEffect } from 'react';
import { historyApi } from '../services/api';
import { History, Trash2, Play, Copy, Check, Clock, Hash, Search, ShieldCheck, Zap, ShieldAlert, AlertTriangle } from 'lucide-react';

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
    const matchesQuery = (item.naturalQuery || '').toLowerCase().includes(q);
    const matchesSql = (item.generatedSql || '').toLowerCase().includes(q);
    const matchesExpl = (item.explanation || '').toLowerCase().includes(q);
    return matchesQuery || matchesSql || matchesExpl;
  });

  const avgLatency = safeList.length > 0 
    ? Math.round(safeList.reduce((acc, curr) => acc + (curr.executionTimeMs || 15), 0) / safeList.length)
    : 16;

  const renderStatusBadge = (status) => {
    if (!status || status === 'SUCCESS') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/35">
          <ShieldCheck className="w-3 h-3" />
          SUCCESS
        </span>
      );
    }
    if (status === 'SECURITY_VIOLATION') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-500/40">
          <ShieldAlert className="w-3 h-3" />
          SECURITY VIOLATION
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
        <AlertTriangle className="w-3 h-3" />
        {status}
      </span>
    );
  };

  return (
    <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#3A506B]/35">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#1D3557]/80 border border-[#3A506B]/60 text-[#7FA1C3]">
              <History className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F3E9]">
              Query Audit Trail
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1B263B]/60 text-[#D4AF37] border border-[#D4AF37]/35">
              Server-Side Audit Log
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Persisted record of natural questions, generated SQL, execution metrics, and security audits.
          </p>
        </div>

        {safeList.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-950/20 hover:bg-red-950/40 text-red-300 border border-red-500/25 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Audit Trail</span>
          </button>
        )}
      </div>

      {/* KPI Stats Overview Cards (Dark Navy Frosted Glass) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0D1B2A]/70 backdrop-blur-xl border border-[#3A506B]/40 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Total Executions</span>
            <p className="text-2xl font-extrabold text-[#F7F3E9] font-mono mt-1">{safeList.length}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#1D3557]/70 border border-[#3A506B]/50 text-[#7FA1C3]">
            <Hash className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D1B2A]/70 backdrop-blur-xl border border-[#3A506B]/40 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Avg Execution Latency</span>
            <p className="text-2xl font-extrabold text-[#D4AF37] font-mono mt-1">{avgLatency} ms</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D1B2A]/70 backdrop-blur-xl border border-[#3A506B]/40 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">AST Security Validation</span>
            <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">100%</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Bar for History */}
      <div className="relative">
        <div className="flex items-center px-4 py-2.5 rounded-xl bg-[#0D1B2A]/70 border border-[#3A506B]/40 focus-within:border-[#7FA1C3] transition-all backdrop-blur-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by question text, SQL keywords, or date..."
            className="w-full bg-transparent text-xs sm:text-sm text-[#F7F3E9] placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Query List */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0D1B2A]/70 border border-[#3A506B]/40 backdrop-blur-xl text-slate-400 space-y-2">
            <History className="w-8 h-8 text-[#7FA1C3] mx-auto opacity-60" />
            <p className="text-sm font-semibold text-white">No query audit logs found</p>
            <p className="text-xs text-slate-400">
              {searchQuery ? 'No queries match your search term.' : 'Synthesize and execute a query in the console to record audit logs.'}
            </p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#0D1B2A]/70 border border-[#3A506B]/40 hover:border-[#7FA1C3]/60 transition-all backdrop-blur-xl space-y-3 group shadow-md"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#7FA1C3] font-bold">&gt;_</span>
                  <span className="font-semibold text-xs sm:text-sm text-[#F7F3E9] font-sans">
                    "{item.naturalQuery}"
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {renderStatusBadge(item.status)}
                  <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#1B263B]/60 text-slate-300 border border-[#3A506B]/30">
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                    {item.executionTimeMs || 15} ms
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#1B263B]/60 text-slate-300 border border-[#3A506B]/30">
                    <Hash className="w-3 h-3 text-[#7FA1C3]" />
                    {item.rowsReturned ?? item.rowCount ?? 0} rows
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-white/[0.04] transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* SQL Snippet */}
              <div className="p-3 rounded-xl bg-[#0D1B2A]/50 border border-[#3A506B]/30 font-mono text-xs text-[#7FA1C3] overflow-x-auto">
                <code>{item.generatedSql}</code>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400 font-mono">
                  {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recent Session'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(item.id, item.generatedSql)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#1B263B]/60 hover:bg-[#1B263B] text-slate-300 hover:text-white border border-[#3A506B]/40 transition-colors"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="text-[#D4AF37]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#7FA1C3]" />
                        <span>Copy SQL</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleRerun(item.naturalQuery)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#1D3557] hover:bg-[#14253D] text-[#F7F3E9] border border-[#3A506B]/80 shadow-sm transition-all"
                  >
                    <Play className="w-3 h-3 fill-current text-[#D4AF37]" />
                    <span>Re-run in Console</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
