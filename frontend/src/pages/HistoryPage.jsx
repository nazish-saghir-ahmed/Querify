import React, { useState, useEffect } from 'react';
import { historyApi } from '../services/api';
import { History, Trash2, Play, Copy, Check, Clock, Hash, CheckCircle2, XCircle } from 'lucide-react';

export default function HistoryPage({ onSelectQuestion, setActiveTab }) {
  const [historyList, setHistoryList] = useState([]);
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
    if (!window.confirm('Are you sure you want to clear all query history?')) return;
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

  return (
    <div className="min-h-screen bg-[#080B14] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#1E293B]">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-purple-400" />
            Query Audit History
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Persisted record of recent questions, generated SQL, execution metrics, and audit timestamps.
          </p>
        </div>

        {historyList.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History List */}
      {historyList.length === 0 ? (
        <div className="p-12 text-center bg-[#101827] border border-[#1E293B] rounded-2xl text-slate-400 space-y-3">
          <History className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm">No queries executed yet.</p>
          <button
            onClick={() => setActiveTab('workspace')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-neon-violet"
          >
            Go to Query Workspace
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {historyList.map((item) => {
            const isSuccess = item.status === 'SUCCESS';
            const isCopied = copiedId === item.id;
            const formattedDate = item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recent';

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#101827] border border-[#1E293B] hover:border-slate-700 transition-all space-y-3 shadow-card-dark"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isSuccess ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="font-semibold text-sm text-white">
                      "{item.naturalQuery}"
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3 h-3 text-purple-400" />
                      {item.executionTimeMs} ms
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Hash className="w-3 h-3 text-cyan-400" />
                      {item.rowsReturned} rows
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {formattedDate}
                    </span>
                  </div>
                </div>

                {/* SQL Code Box */}
                <div className="p-3 rounded-xl bg-[#080B14] font-mono text-xs text-cyan-300 border border-[#1E293B]/80 overflow-x-auto">
                  {item.generatedSql}
                </div>

                {/* Explanation */}
                {item.explanation && (
                  <p className="text-xs text-slate-400">
                    <span className="text-purple-300 font-medium">Outcome:</span> {item.explanation}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#1E293B]/50">
                  <button
                    onClick={() => handleCopy(item.id, item.generatedSql)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-[#151E30] hover:bg-slate-800 text-slate-300 border border-[#1E293B] transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
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
                    className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-neon-violet transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Re-run in Workspace</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors ml-1"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
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
