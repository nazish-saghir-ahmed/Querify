import React, { useState, useEffect } from 'react';
import { databaseApi } from '../services/api';
import {
  Database, Key, Link2, Table as TableIcon, RefreshCw, Eye,
  GitFork, Search, ArrowRight, CheckCircle2, ShieldCheck
} from 'lucide-react';
import ResultTable from '../components/ResultTable';

export default function ExplorerPage() {
  const [schemaList, setSchemaList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [selectedTable, setSelectedTable] = useState('companies');
  const [sampleData, setSampleData] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('cards'); // 'cards' or 'sample'
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedTable && activeSubTab === 'sample') {
      fetchSampleData(selectedTable);
    }
  }, [selectedTable, activeSubTab]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [schemas, tables] = await Promise.all([
        databaseApi.getSchema(),
        databaseApi.getTables(),
      ]);
      const safeSchemas = Array.isArray(schemas) ? schemas : [];
      const safeTables = Array.isArray(tables) ? tables : [];
      setSchemaList(safeSchemas);
      setTableList(safeTables);
      if (safeSchemas.length > 0) {
        setSelectedTable(safeSchemas[0].tableName);
      }
    } catch (err) {
      console.error('Failed to load database metadata:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSampleData = async (table) => {
    setIsLoading(true);
    try {
      const sample = await databaseApi.getTableSample(table);
      setSampleData(sample && sample.columns ? sample : null);
    } catch (err) {
      console.error('Failed to load table sample:', err);
      setSampleData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const safeSchemaList = Array.isArray(schemaList) ? schemaList : [];
  const safeTableList = Array.isArray(tableList) ? tableList : [];

  const getRowCount = (tableName) => {
    const found = safeTableList.find(
      (t) => t.name?.toLowerCase() === tableName?.toLowerCase()
    );
    return found ? found.rowCount : '—';
  };

  const filteredSchemas = safeSchemaList.filter((schema) => {
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    return (
      schema.tableName?.toLowerCase().includes(term) ||
      schema.description?.toLowerCase().includes(term) ||
      schema.columns?.some((col) => col.name?.toLowerCase().includes(term))
    );
  });

  return (
    <div className="w-full max-w-[1150px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#111827] border border-[#1F2E47]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white font-sans">
              Domain Database Catalog
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Inspect the 6 relational domain tables, primary/foreign keys, and data fixtures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-tab switcher */}
          <div className="flex items-center gap-1 bg-[#0B0F17] p-1 rounded-xl border border-[#1F2E47]">
            <button
              onClick={() => setActiveSubTab('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'cards'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Schema Cards
            </button>
            <button
              onClick={() => {
                setActiveSubTab('sample');
                fetchSampleData(selectedTable);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'sample'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sample Rows
            </button>
          </div>

          <button
            onClick={fetchInitialData}
            className="p-2 rounded-xl bg-[#0B0F17] hover:bg-[#162238] border border-[#1F2E47] text-slate-400 hover:text-white transition-colors"
            title="Refresh database schema"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search Input Filter */}
      {activeSubTab === 'cards' && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search tables or columns..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#111827] border border-[#1F2E47] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      )}

      {/* 1. SCHEMA CARDS GRID VIEW */}
      {activeSubTab === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchemas.map((schema) => {
            const rowCount = getRowCount(schema.tableName);
            return (
              <div
                key={schema.tableName}
                className="p-5 rounded-2xl bg-[#111827] border border-[#1F2E47] hover:border-blue-500/40 transition-colors flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Table Header */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#1F2E47]">
                    <div className="flex items-center gap-2">
                      <TableIcon className="w-4 h-4 text-blue-400 shrink-0" />
                      <h3 className="font-mono text-sm font-semibold text-white">
                        {schema.tableName}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 bg-[#0B0F17] px-2 py-0.5 rounded border border-[#1F2E47]">
                      {rowCount} rows
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                    {schema.description}
                  </p>

                  {/* Column List */}
                  <div className="mt-3.5 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {schema.columns?.map((col) => (
                      <div
                        key={col.name}
                        className="flex items-center justify-between text-xs py-1 px-2 rounded bg-[#0B0F17] border border-[#1F2E47]/50 font-mono"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {col.primaryKey && <Key className="w-3 h-3 text-amber-400 shrink-0" />}
                          {col.foreignKey && <Link2 className="w-3 h-3 text-blue-400 shrink-0" />}
                          <span className={col.primaryKey ? 'text-amber-300 font-semibold truncate' : 'text-slate-300 truncate'}>
                            {col.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                          {col.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inspect Sample Action */}
                <button
                  onClick={() => {
                    setSelectedTable(schema.tableName);
                    setActiveSubTab('sample');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#0B0F17] hover:bg-[#162238] border border-[#1F2E47] transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  <span>Inspect Sample Rows</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. SAMPLE ROWS VIEWER */}
      {activeSubTab === 'sample' && (
        <div className="space-y-4">
          {/* Table Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {safeSchemaList.map((schema) => (
              <button
                key={schema.tableName}
                onClick={() => setSelectedTable(schema.tableName)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                  selectedTable === schema.tableName
                    ? 'bg-blue-600 text-white font-semibold border-blue-500 shadow-sm'
                    : 'bg-[#111827] text-slate-400 hover:text-white border-[#1F2E47]'
                }`}
              >
                {schema.tableName}
              </button>
            ))}
          </div>

          {/* Result Table for Sample */}
          {isLoading ? (
            <div className="p-8 text-center bg-[#111827] border border-[#1F2E47] rounded-2xl text-slate-400">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-mono">Loading records for {selectedTable}...</p>
            </div>
          ) : sampleData ? (
            <ResultTable
              data={sampleData}
              title={`Sample Records: ${selectedTable}`}
            />
          ) : (
            <div className="p-8 text-center bg-[#111827] border border-[#1F2E47] rounded-2xl text-slate-400">
              <p className="text-xs font-mono">No sample records found for {selectedTable}.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
