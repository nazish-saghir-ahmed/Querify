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
      <div className="p-8 text-center bg-[#111827] border border-[#1F2E47] rounded-2xl text-slate-400">
        <p className="font-mono text-sm text-slate-300">No records returned for this query.</p>
        <p className="text-xs text-slate-500 mt-1">Try refining your question or selecting another sample.</p>
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

  // Format cell values based on column type
  const formatCellValue = (val, col) => {
    if (val === null || val === undefined) return <span className="text-slate-600">—</span>;

    const lower = col.toLowerCase();
    const num = typeof val === 'number' ? val : parseFloat(val);

    // Percentage values
    if (/percent|growth|rate|roi|share/i.test(lower) && !isNaN(num)) {
      const isPositive = num > 0;
      return (
        <span className={`font-mono text-xs font-medium ${isPositive ? 'text-emerald-400' : num < 0 ? 'text-rose-400' : 'text-slate-300'}`}>
          {isPositive ? `+${num.toFixed(1)}%` : `${num.toFixed(1)}%`}
        </span>
      );
    }

    // Currency values in Millions USD
    if (/revenue|profit|cost|budget|amount|investment/i.test(lower) && !isNaN(num)) {
      const formatted = Math.abs(num).toLocaleString(undefined, { maximumFractionDigits: 1 });
      return (
        <span className={`font-mono text-xs font-medium ${num < 0 ? 'text-rose-400' : 'text-slate-200'}`}>
          {num < 0 ? `-$${formatted}M` : `$${formatted}M`}
        </span>
      );
    }

    // Benchmark evaluation score or parameters
    if (/score|performance_index|parameter/i.test(lower) && !isNaN(num)) {
      return (
        <span className="font-mono text-xs font-semibold text-blue-400">
          {num.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        </span>
      );
    }

    // Numbers in general
    if (typeof val === 'number') {
      return <span className="font-mono text-xs text-slate-300">{val.toLocaleString()}</span>;
    }

    return <span className="text-xs text-slate-300 font-sans">{String(val)}</span>;
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

  // Pagination
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
        if (/^[=+\-@]/.test(strVal)) {
          strVal = "'" + strVal;
        }
        return `"${strVal.replace(/"/g, '""')}"`;
      }).join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...csvRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `querify_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl bg-[#111827] border border-[#1F2E47] overflow-hidden shadow-card">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-[#162238] border-b border-[#1F2E47]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-white font-sans">{title}</span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-[#0B0F17] px-2 py-0.5 rounded border border-[#1F2E47]">
              <Hash className="w-3 h-3 text-slate-500" />
              <span>{rowCount ?? rows.length} rows</span>
            </span>
          </div>

          {executionTimeMs !== undefined && (
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-[#0B0F17] px-2 py-0.5 rounded border border-[#1F2E47]">
              <Clock className="w-3 h-3 text-blue-400" />
              <span>{executionTimeMs} ms</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Filter Search */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              placeholder="Search results..."
              className="w-full pl-8 pr-3 py-1 bg-[#0B0F17] border border-[#1F2E47] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#0B0F17] hover:bg-[#1A2438] border border-[#1F2E47] transition-colors"
            title="Export filtered records to CSV"
          >
            {exportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Exported</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Responsive Horizontal Scroll Wrapper */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          {/* Sticky Header */}
          <thead className="sticky top-0 z-10 bg-[#162238] border-b border-[#1F2E47]">
            <tr>
              {columns.map((col) => {
                const isSorted = sortCol === col;
                return (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="px-4 py-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300 cursor-pointer select-none hover:text-white hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.replace(/_/g, ' ')}</span>
                      <span className="text-slate-500">
                        {isSorted ? (
                          sortAsc ? <ChevronUp className="w-3.5 h-3.5 text-blue-400" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
                        ) : (
                          <span className="opacity-0 hover:opacity-50">•</span>
                        )}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Zebra Striped Rows */}
          <tbody className="divide-y divide-[#1F2E47]">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-xs text-slate-500 font-mono">
                  No records match your search filter.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, rIdx) => {
                return (
                  <tr
                    key={rIdx}
                    className="transition-colors hover:bg-white/[0.03] odd:bg-[#111827] even:bg-[#0E1523]"
                  >
                    {columns.map((col) => {
                      const val = getRowValue(row, col);
                      return (
                        <td key={col} className="px-4 py-3 whitespace-nowrap">
                          {formatCellValue(val, col)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#162238] border-t border-[#1F2E47] text-xs font-mono text-slate-400">
          <span>
            Page {page} of {totalPages} ({sortedRows.length} total)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded bg-[#0B0F17] border border-[#1F2E47] disabled:opacity-40 hover:text-white"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-2.5 py-1 rounded bg-[#0B0F17] border border-[#1F2E47] disabled:opacity-40 hover:text-white"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
