import React, { useState, useMemo } from 'react';
import { Download, Search, ChevronUp, ChevronDown, Clock, Hash, Check } from 'lucide-react';

export default function ResultTable({ data, title = 'Query Results' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCol, setSortCol] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [exportSuccess, setExportSuccess] = useState(false);
  const pageSize = 10;

  if (!data || !data.columns || data.columns.length === 0) {
    return (
      <div className="p-8 text-center bg-[#0D1B2A]/70 border border-[#3A506B]/40 rounded-2xl text-slate-300 backdrop-blur-xl">
        <p className="font-mono text-sm text-slate-300">No records returned for this query.</p>
        <p className="text-xs text-slate-400 mt-1">Try refining your question or broadening search filters.</p>
      </div>
    );
  }

  const { columns, rows = [], executionTimeMs, rowCount } = data;

  // Safe accessor to resolve field names with case insensitivity and common aliases
  const getRowValue = (row, col) => {
    if (!row) return null;
    if (row[col] !== undefined && row[col] !== null) return row[col];
    const lowerCol = col.toLowerCase();
    if (row[lowerCol] !== undefined && row[lowerCol] !== null) return row[lowerCol];
    
    // Fallbacks for entity labels
    if (lowerCol.includes('company') || lowerCol === 'name') {
      return row.company_name ?? row.companyName ?? row.company ?? row.name ?? null;
    }
    if (lowerCol.includes('model')) {
      return row.model_name ?? row.modelName ?? null;
    }
    if (lowerCol.includes('project')) {
      return row.project_name ?? row.projectName ?? null;
    }
    return null;
  };

  // Filter rows based on search term
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter((row) =>
      columns.some((col) => {
        const val = getRowValue(row, col);
        return String(val ?? '').toLowerCase().includes(term);
      })
    );
  }, [rows, columns, searchTerm]);

  // Sort filtered rows
  const sortedRows = useMemo(() => {
    if (!sortCol) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const valA = getRowValue(a, sortCol);
      const valB = getRowValue(b, sortCol);
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
      columns.map((col) => {
        const val = getRowValue(row, col);
        let strVal = val === null || val === undefined ? '' : String(val);
        // Formula injection protection: prevent Excel/Sheets formula execution
        if (/^[=+\-@]/.test(strVal)) {
          strVal = "'" + strVal;
        }
        return `"${strVal.replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csvContent = [headers, ...csvRows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `query-results-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2500);
  };

  const formatCellValue = (val, colName) => {
    if (val === null || val === undefined) {
      return <span className="text-slate-500 italic font-mono text-[11px]">null</span>;
    }
    if (typeof val === 'number') {
      const lower = colName.toLowerCase();
      // CRITICAL: Evaluate percentage / growth metrics FIRST so revenue_growth_percent is formatted as %
      if (lower.includes('percent') || lower.includes('growth') || lower.includes('share') || lower.includes('roi') || lower.includes('rate')) {
        return <span className="font-mono text-[#D4AF37] font-semibold">{val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}%</span>;
      }
      // Currency values (revenue, profit, cost, budget, amount)
      if (lower.includes('revenue') || lower.includes('profit') || lower.includes('cost') || lower.includes('budget') || lower.includes('amount')) {
        return <span className="font-mono text-[#F7F3E9]">${val.toLocaleString()} M</span>;
      }
      return <span className="font-mono text-[#F7F3E9]">{val.toLocaleString()}</span>;
    }
    return String(val);
  };

  return (
    <div className="w-full rounded-2xl bg-[#0D1B2A]/70 border border-[#3A506B]/40 overflow-hidden shadow-2xl backdrop-blur-2xl">
      {/* Table Toolbar */}
      <div className="p-4 bg-[#1B263B]/60 border-b border-[#3A506B]/35 flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {title && <span className="font-semibold text-xs sm:text-sm text-[#F7F3E9] font-mono">{title}</span>}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#0D1B2A]/80 text-slate-300 border border-[#3A506B]/40 font-mono">
              <Hash className="w-3 h-3 text-[#7FA1C3]" />
              <span>{rowCount ?? rows.length} rows</span>
            </span>
            {executionTimeMs !== undefined && (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#0D1B2A]/80 text-[#D4AF37] border border-[#D4AF37]/35 font-mono">
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
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#0D1B2A]/80 border border-[#3A506B]/40 text-[#F7F3E9] placeholder-slate-400 focus:outline-none focus:border-[#7FA1C3] transition-colors"
            />
          </div>

          {/* Export to CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1D3557]/80 hover:bg-[#1D3557] text-[#F7F3E9] border border-[#3A506B]/60 transition-colors shrink-0 shadow-sm"
            title="Download verified query results as CSV"
          >
            {exportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[#D4AF37]">Exported!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-[#7FA1C3]" />
                <span className="hidden sm:inline">Export CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#1B263B]/50 border-b border-[#3A506B]/35 text-slate-300 uppercase tracking-wider font-mono text-[11px]">
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
                        sortAsc ? <ChevronUp className="w-3.5 h-3.5 text-[#7FA1C3]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#7FA1C3]" />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3A506B]/25">
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
                    className="hover:bg-[#1B263B]/40 transition-colors group font-sans"
                  >
                    <td className="py-2.5 px-4 font-mono text-[11px] text-[#415A77] group-hover:text-slate-400">
                      {rowNum}
                    </td>
                    {columns.map((col) => (
                      <td key={col} className="py-2.5 px-4 text-[#F7F3E9]">
                        {formatCellValue(getRowValue(row, col), col)}
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
        <div className="p-3 bg-[#1B263B]/60 border-t border-[#3A506B]/35 flex items-center justify-between text-xs text-slate-300 font-mono backdrop-blur-md">
          <span>
            {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, sortedRows.length)} of {sortedRows.length} results
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded bg-[#0D1B2A]/80 hover:bg-[#1B263B] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-[#3A506B]/40"
            >
              Previous
            </button>
            <span className="px-2 text-[#7FA1C3] font-bold">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1 rounded bg-[#0D1B2A]/80 hover:bg-[#1B263B] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-[#3A506B]/40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
