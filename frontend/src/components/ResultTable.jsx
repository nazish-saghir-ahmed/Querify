import React, { useState, useMemo } from 'react';
import { Download, Search, ChevronUp, ChevronDown, Clock, Hash } from 'lucide-react';

export default function ResultTable({ data, title = 'Query Results' }) {
  if (!data || !data.columns || data.columns.length === 0) {
    return (
      <div className="p-8 text-center bg-[#101827] border border-[#1E293B] rounded-2xl text-slate-400">
        No records returned for this query.
      </div>
    );
  }

  const { columns, rows = [], executionTimeMs, rowCount } = data;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCol, setSortCol] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filter rows based on search term
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val ?? '').toLowerCase().includes(term)
      )
    );
  }, [rows, searchTerm]);

  // Sort filtered rows
  const sortedRows = useMemo(() => {
    if (!sortCol) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const valA = a[sortCol];
      const valB = b[sortCol];
      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredRows, sortCol, sortAsc]);

  // Paginated slice
  const totalPages = Math.ceil(sortedRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, page, pageSize]);

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    if (!rows.length) return;
    const headers = columns.join(',');
    const csvRows = sortedRows.map((row) =>
      columns.map((col) => `"${String(row[col] ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = [headers, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `querify_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCellValue = (val, colName) => {
    if (val === null || val === undefined) return <span className="text-slate-600 italic">null</span>;
    if (typeof val === 'number') {
      const lower = colName.toLowerCase();
      if (lower.includes('revenue') || lower.includes('profit') || lower.includes('cost') || lower.includes('budget') || lower.includes('amount')) {
        return `$${val.toLocaleString()} M`;
      }
      if (lower.includes('percent') || lower.includes('growth') || lower.includes('share') || lower.includes('roi')) {
        return `${val.toLocaleString()}%`;
      }
      return val.toLocaleString();
    }
    return String(val);
  };

  return (
    <div className="w-full rounded-2xl bg-[#101827] border border-[#1E293B] overflow-hidden shadow-card-dark">
      {/* Table Toolbar */}
      <div className="p-4 bg-[#0D1322] border-b border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="font-semibold text-sm text-white">{title}</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#151E30] text-slate-300 border border-[#1E293B]">
              <Hash className="w-3 h-3 text-cyan-400" />
              <span>{rowCount ?? rows.length} rows</span>
            </span>
            {executionTimeMs !== undefined && (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#151E30] text-slate-300 border border-[#1E293B]">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>{executionTimeMs} ms</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Filter results..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#151E30] border border-[#1E293B] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Export to CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#151E30] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E293B] transition-colors shrink-0"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#151E30]/70 border-b border-[#1E293B] text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-3 px-4 w-12 text-slate-600">#</th>
              {columns.map((col) => {
                const isSorted = sortCol === col;
                return (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="py-3 px-4 cursor-pointer select-none hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.replace(/_/g, ' ')}</span>
                      {isSorted && (
                        sortAsc ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/40">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-8 text-center text-slate-500">
                  No matching records found.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, idx) => {
                const rowNum = (page - 1) * pageSize + idx + 1;
                return (
                  <tr
                    key={idx}
                    className="hover:bg-[#151E30]/50 transition-colors group"
                  >
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-600 group-hover:text-slate-400">
                      {rowNum}
                    </td>
                    {columns.map((col) => (
                      <td key={col} className="py-2.5 px-4 text-slate-200">
                        {formatCellValue(row[col], col)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-3 bg-[#0D1322] border-t border-[#1E293B] flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, sortedRows.length)} of {sortedRows.length} results
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded bg-[#151E30] hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-[#1E293B]"
            >
              Previous
            </button>
            <span className="px-2 font-mono text-cyan-400">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1 rounded bg-[#151E30] hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-[#1E293B]"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
