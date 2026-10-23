import React, { useState, useMemo } from 'react';
import { Download, Search, ChevronUp, ChevronDown, Clock, Hash } from 'lucide-react';

export default function ResultTable({ data, title = 'Query Results' }) {
  if (!data || !data.columns || data.columns.length === 0) {
    return (
      <div className="p-8 text-center bg-[#0D1B2A]/60 border border-[#415A77]/35 rounded-2xl text-slate-400 backdrop-blur-xl">
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
    if (val === null || val === undefined) return <span className="text-slate-500 italic font-mono">null</span>;
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
    <div className="w-full rounded-2xl bg-[#0D1B2A]/60 border border-[#415A77]/35 overflow-hidden shadow-2xl backdrop-blur-2xl">
      {/* Table Toolbar */}
      <div className="p-4 bg-[#1B263B]/50 border-b border-[#415A77]/30 flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {title && <span className="font-semibold text-xs sm:text-sm text-[#F7F3E9] font-mono">{title}</span>}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#0D1B2A]/60 text-slate-300 border border-[#415A77]/35 font-mono">
              <Hash className="w-3 h-3 text-blue-400" />
              <span>{rowCount ?? rows.length} rows</span>
            </span>
            {executionTimeMs !== undefined && (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#0D1B2A]/60 text-[#D4AF37] border border-[#D4AF37]/30 font-mono">
                <Clock className="w-3 h-3 text-[#D4AF37]" />
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
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#0D1B2A]/60 border border-[#415A77]/35 text-[#F7F3E9] placeholder-slate-400 focus:outline-none focus:border-blue-500/60 transition-colors"
            />
          </div>

          {/* Export to CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1B263B]/60 hover:bg-[#1B263B] text-slate-300 hover:text-white border border-[#415A77]/35 transition-colors shrink-0"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#1B263B]/40 border-b border-[#415A77]/30 text-slate-300 uppercase tracking-wider font-mono text-[11px]">
              <th className="py-3 px-4 w-12 text-[#415A77]">#</th>
              {columns.map((col) => {
                const isSorted = sortCol === col;
                return (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="py-3 px-4 cursor-pointer select-none hover:text-[#F7F3E9] transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.replace(/_/g, ' ')}</span>
                      {isSorted && (
                        sortAsc ? <ChevronUp className="w-3.5 h-3.5 text-blue-400" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#415A77]/20">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-8 text-center text-slate-400">
                  No matching records found.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, idx) => {
                const rowNum = (page - 1) * pageSize + idx + 1;
                return (
                  <tr
                    key={idx}
                    className="hover:bg-[#1B263B]/35 transition-colors group font-sans"
                  >
                    <td className="py-2.5 px-4 font-mono text-[11px] text-[#415A77] group-hover:text-slate-400">
                      {rowNum}
                    </td>
                    {columns.map((col) => (
                      <td key={col} className="py-2.5 px-4 text-[#F7F3E9]">
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
        <div className="p-3 bg-[#1B263B]/50 border-t border-[#415A77]/30 flex items-center justify-between text-xs text-slate-300 font-mono backdrop-blur-md">
          <span>
            {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, sortedRows.length)} of {sortedRows.length} results
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded bg-[#0D1B2A]/60 hover:bg-[#1B263B] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-[#415A77]/35"
            >
              Previous
            </button>
            <span className="px-2 text-blue-400 font-bold">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1 rounded bg-[#0D1B2A]/60 hover:bg-[#1B263B] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-[#415A77]/35"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
