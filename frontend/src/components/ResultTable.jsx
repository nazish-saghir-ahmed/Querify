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
      <div className="p-8 text-center bg-blue-950/20 border border-blue-900/40 rounded-2xl text-blue-200/70">
        <p className="font-mono text-sm text-white">No records returned for this query.</p>
        <p className="text-xs text-blue-300/60 mt-1">Try refining your question or selecting another sample.</p>
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

  // Format cell values based on column type (Midnight Blue & White Only)
  const formatCellValue = (val, col) => {
    if (val === null || val === undefined) return <span className="text-blue-900 font-mono">—</span>;

    const lower = col.toLowerCase();
    const num = typeof val === 'number' ? val : parseFloat(val);

    // Percentage values
    if (/percent|growth|rate|roi|share/i.test(lower) && !isNaN(num)) {
      const isPositive = num > 0;
      return (
        <span className="font-mono text-xs font-bold text-white px-2 py-0.5 rounded bg-blue-600/20 border border-blue-500/30">
          {isPositive ? `+${num.toFixed(1)}%` : `${num.toFixed(1)}%`}
        </span>
      );
    }

    // Currency values in Millions USD
    if (/revenue|profit|cost|budget|amount|investment/i.test(lower) && !isNaN(num)) {
      const formatted = Math.abs(num).toLocaleString(undefined, { maximumFractionDigits: 1 });
      return (
        <span className="font-mono text-xs font-bold text-white">
          {num < 0 ? `-$${formatted}M` : `$${formatted}M`}
        </span>
      );
    }

    // Benchmark evaluation score or parameters
    if (/score|performance_index|parameter/i.test(lower) && !isNaN(num)) {
      return (
        <span className="font-mono text-xs font-bold text-blue-300">
          {num.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        </span>
      );
    }

    // Numbers in general
    if (typeof val === 'number') {
      return <span className="font-mono text-xs text-white">{val.toLocaleString()}</span>;
    }

    return <span className="text-xs text-blue-100 font-sans font-medium">{String(val)}</span>;
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
    <div className="w-full rounded-2xl bg-[#0B132B]/85 border border-blue-500/25 backdrop-blur-xl overflow-hidden shadow-2xl transition-all">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-blue-950/40 border-b border-blue-900/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm text-white">{title}</span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-500/30">
              <Hash className="w-3 h-3 text-blue-400" />
              <span>{rowCount ?? rows.length} rows</span>
            </span>
          </div>

          {executionTimeMs !== undefined && (
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-500/30">
              <Clock className="w-3 h-3 text-blue-400" />
              <span>{executionTimeMs} ms</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Filter Search */}
          <div className="relative flex-1 sm:w-52">
            <Search className="w-3.5 h-3.5 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              placeholder="Search in records..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#080D1A]/90 border border-blue-800/50 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-950/60 hover:bg-blue-900/50 border border-blue-800/50 transition-colors cursor-pointer"
            title="Export filtered records to CSV"
          >
            {exportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-white">Exported</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-blue-400" />
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
          <thead className="sticky top-0 z-10 bg-[#0A1224]/95 backdrop-blur-md border-b border-blue-900/50">
            <tr>
              {columns.map((col) => {
                const isSorted = sortCol === col;
                return (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="px-4 py-3.5 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 cursor-pointer select-none hover:text-white hover:bg-blue-900/30 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.replace(/_/g, ' ')}</span>
                      <span className="text-blue-400">
                        {isSorted ? (
                          sortAsc ? <ChevronUp className="w-3.5 h-3.5 text-white" /> : <ChevronDown className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <span className="opacity-0 group-hover:opacity-40">•</span>
                        )}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Zebra Striped Rows */}
          <tbody className="divide-y divide-blue-900/30">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-xs text-slate-400 font-mono">
                  No records match your search filter.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, rIdx) => {
                return (
                  <tr
                    key={rIdx}
                    className="transition-colors hover:bg-blue-600/10 odd:bg-transparent even:bg-blue-950/20"
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
        <div className="flex items-center justify-between px-4 py-3 bg-blue-950/40 border-t border-blue-900/40 text-xs font-mono text-slate-300">
          <span>
            Page <span className="font-bold text-white">{page}</span> of <span className="font-bold text-white">{totalPages}</span> ({sortedRows.length} filtered rows)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-lg bg-blue-950/80 border border-blue-800/60 disabled:opacity-40 text-white hover:bg-blue-900/60 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-lg bg-blue-950/80 border border-blue-800/60 disabled:opacity-40 text-white hover:bg-blue-900/60 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
