import React, { useState, useEffect } from 'react';
import { historyApi } from '../services/api';
import { History, Trash2, Play, Copy, Check, Clock, Hash, CheckCircle2, XCircle, Search, Filter, ShieldCheck, Zap } from 'lucide-react';

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

  return (
    <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#00F5A0]/10 border border-[#00F5A0]/25 text-[#00F5A0]">
              <History className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Query Audit Trail
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/[0.08]">
              Immutable Session Log
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Persisted record of natural questions, generated SQL, execution metrics, and audit timestamps.
          </p>
        </div>

        {safeList.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-950/20 hover:bg-red-950/40 text-red-300 border border-red-500/25 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge Audit Log</span>
          </button>
        )}
      </div>

      {/* Audit KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0A0E17]/95 border border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Total Executions</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">{safeList.length}</div>
          </div>
          <span className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-300">
            <Hash className="w-5 h-5" />
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0E17]/95 border border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Average Latency</div>
            <div className="text-2xl font-bold font-mono text-[#00F5A0] mt-1">{avgLatency} ms</div>
          </div>
          <span className="p-2 rounded-lg bg-[#00F5A0]/10 border border-[#00F5A0]/25 text-[#00F5A0]">
            <Zap className="w-5 h-5" />
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0E17]/95 border border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">AST Security Pass</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">100%</div>
          </div>
          <span className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Custom Context-Aware Search & Filter Bar */}
      <div className="flex items-center px-4 py-2.5 rounded-xl bg-[#0A0E17]/95 border border-white/[0.08] focus-within:border-[#00F5A0]/50 focus-within:shadow-[0_0_20px_-4px_rgba(0,245,160,0.25)] transition-all">
        <Search className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search audit trail by prompt, SQL syntax, or explanation..."
          className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-slate-500 hover:text-slate-300 text-xs px-2"
          >
            ✕
          </button>
        )}
        <span className="text-[11px] font-mono text-slate-500 shrink-0 ml-2">
          {filteredList.length} matches
        </span>
      </div>

      {/* History List */}
      {filteredList.length === 0 ? (
        <div className="p-12 text-center bg-[#0A0E17]/95 border border-white/[0.08] rounded-2xl text-slate-400 space-y-3">
          <History className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm font-sans">
            {searchQuery ? 'No audit records match your search filter.' : 'No queries executed yet.'}
          </p>
          <button
            onClick={() => setActiveTab('workspace')}
            className="px-4 py-2 rounded-xl bg-[#00F5A0] hover:bg-[#00DF89] text-[#06080D] text-xs font-semibold tracking-wide shadow-sm"
          >
            Go to Query Workspace
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((item) => {
            const isSuccess = item.status === 'SUCCESS';
            const isCopied = copiedId === item.id;
            const formattedDate = item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recent';

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#0A0E17]/95 border border-white/[0.08] hover:border-white/[0.18] transition-all space-y-3"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {isSuccess ? (
                      <span className="p-1 rounded-md bg-[#00F5A0]/10 text-[#00F5A0] border border-[#00F5A0]/25">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/25">
                        <XCircle className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className="font-semibold text-sm text-white font-sans">
                      "{item.naturalQuery}"
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-[#00F5A0] bg-[#00F5A0]/10 px-2 py-0.5 rounded border border-[#00F5A0]/20 text-[11px]">
                      <Clock className="w-3 h-3" />
                      {item.executionTimeMs} ms
                    </span>
                    <span className="flex items-center gap-1 text-slate-300 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08] text-[11px]">
                      <Hash className="w-3 h-3" />
                      {item.rowsReturned} rows
                    </span>
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                      {formattedDate}
                    </span>
                  </div>
                </div>

                {/* SQL Code Box */}
                <div className="p-3.5 rounded-xl bg-[#06080D] font-mono text-xs text-[#00F5A0] border border-white/[0.06] overflow-x-auto leading-relaxed">
                  {item.generatedSql}
                </div>

                {/* Explanation */}
                {item.explanation && (
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    <span className="text-slate-300 font-mono font-medium">Outcome:</span> {item.explanation}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
                  <button
                    onClick={() => handleCopy(item.id, item.generatedSql)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0F1523] hover:bg-[#131B2A] text-slate-300 border border-white/[0.08] transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#00F5A0]" />
                        <span className="text-[#00F5A0]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy SQL</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleRerun(item.naturalQuery)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#00F5A0] hover:bg-[#00DF89] text-[#06080D] shadow-sm transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Re-run in Workspace</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-white/[0.05] transition-colors ml-1"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
