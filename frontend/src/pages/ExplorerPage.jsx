import React, { useState, useEffect } from 'react';
import { databaseApi } from '../services/api';
import { Database, Key, Link2, Table as TableIcon, RefreshCw, Eye, GitFork, Search, ArrowRight, Layers, Hash } from 'lucide-react';
import ResultTable from '../components/ResultTable';

export default function ExplorerPage() {
  const [schemaList, setSchemaList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [selectedTable, setSelectedTable] = useState('companies');
  const [sampleData, setSampleData] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('schema'); // 'schema', 'sample', or 'er'
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

  // Filter tables by search query (checks table name and column names)
  const filteredTables = safeSchemaList.filter((table) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    const matchesTableName = table.tableName.toLowerCase().includes(q);
    const matchesColumn = (table.columns || []).some((col) => {
      const colName = col.name || col.columnName || '';
      return colName.toLowerCase().includes(q);
    });
    return matchesTableName || matchesColumn;
  });

  const currentSchema = safeSchemaList.find((s) => s.tableName === selectedTable) || safeSchemaList[0];

  return (
    <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#00F5A0]/10 border border-[#00F5A0]/25 text-[#00F5A0]">
              <Database className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Database Explorer
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/[0.08]">
              MySQL 8 Relational Schema
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Inspect live table structures, primary/foreign keys, and data fixtures.
          </p>
        </div>

        <button
          onClick={fetchInitialData}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0F1523] hover:bg-[#131B2A] text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#00F5A0] ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Metadata</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Tables Navigation with Search Bar */}
        <div className="lg:col-span-1 space-y-3">
          {/* Custom Search Filter Bar */}
          <div className="relative">
            <div className="flex items-center px-3 py-2 rounded-xl bg-[#0F1523] border border-white/[0.08] focus-within:border-[#00F5A0]/40 focus-within:shadow-[0_0_15px_-4px_rgba(0,245,160,0.25)] transition-all">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter tables or columns..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  className="text-slate-500 hover:text-slate-300 text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            <span>Domain Tables</span>
            <span>{filteredTables.length} of {safeSchemaList.length}</span>
          </div>

          <div className="space-y-1.5">
            {filteredTables.map((t) => {
              const isSelected = selectedTable === t.tableName;
              const countItem = safeTableList.find((item) => item.name === t.tableName);
              return (
                <button
                  key={t.tableName}
                  onClick={() => {
                    setSelectedTable(t.tableName);
                    if (activeSubTab === 'er') setActiveSubTab('schema');
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#131B2A] border-[#00F5A0]/50 shadow-[0_0_20px_-5px_rgba(0,245,160,0.25)] text-white'
                      : 'bg-[#0A0E17]/90 border-white/[0.07] hover:border-white/[0.15] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <TableIcon className={`w-4 h-4 ${isSelected ? 'text-[#00F5A0]' : 'text-slate-500'}`} />
                    <span className="font-mono text-xs font-semibold">{t.tableName}</span>
                  </div>
                  {countItem && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0F1523] border border-white/[0.08] text-slate-300">
                      {countItem.rowCount} rows
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick ER Diagram Action */}
          <div className="pt-2">
            <button
              onClick={() => setActiveSubTab('er')}
              className={`w-full p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                activeSubTab === 'er'
                  ? 'bg-[#00F5A0] text-[#06080D] border-[#00F5A0] shadow-[0_0_20px_-4px_rgba(0,245,160,0.4)]'
                  : 'bg-[#0A0E17]/90 border-white/[0.08] text-slate-300 hover:text-white hover:border-[#00F5A0]/30'
              }`}
            >
              <GitFork className="w-4 h-4" />
              <span>Entity Relationship Map</span>
            </button>
          </div>
        </div>

        {/* Right Column: Schema, Sample Rows, or ERD */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sub-tab Navigation */}
          <div className="flex items-center justify-between bg-[#0A0E17]/90 p-2 rounded-xl border border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-white px-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00F5A0]" />
                {activeSubTab === 'er' ? 'Full Relational Topology' : selectedTable}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#0F1523] p-1 rounded-lg border border-white/[0.08]">
              <button
                onClick={() => setActiveSubTab('schema')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeSubTab === 'schema'
                    ? 'bg-[#00F5A0] text-[#06080D] font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Columns & Types</span>
              </button>
              <button
                onClick={() => setActiveSubTab('sample')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeSubTab === 'sample'
                    ? 'bg-[#00F5A0] text-[#06080D] font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Sample Records</span>
              </button>
              <button
                onClick={() => setActiveSubTab('er')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeSubTab === 'er'
                    ? 'bg-[#00F5A0] text-[#06080D] font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>ERD</span>
              </button>
            </div>
          </div>

          {/* SubTab 1: Columns & Types */}
          {activeSubTab === 'schema' && currentSchema && (
            <div className="rounded-2xl bg-[#0A0E17]/95 border border-white/[0.08] overflow-hidden p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 font-mono">
                  <span>Table Description</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {currentSchema.description || 'Database entity representation with structured attributes.'}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-3">Column Name</th>
                      <th className="py-3 px-3">Data Type</th>
                      <th className="py-3 px-3">Key Status</th>
                      <th className="py-3 px-3">Description / Metadata</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {(currentSchema.columns || []).map((col, idx) => {
                      const name = col.name || col.columnName;
                      const type = col.type || col.dataType;
                      const isPK = col.primaryKey || col.isPrimaryKey;
                      const isFK = col.foreignKey || col.isForeignKey;
                      return (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-3 font-mono font-semibold text-[#00F5A0]">
                            {name}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-300">
                            <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                              {type}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {isPK ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                                <Key className="w-3 h-3" />
                                PRIMARY KEY
                              </span>
                            ) : isFK ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono text-[10px] font-bold">
                                <Link2 className="w-3 h-3" />
                                FOREIGN KEY
                              </span>
                            ) : (
                              <span className="text-slate-600 font-mono">-</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-400">
                            {col.comment || col.description || 'Standard relational attribute'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SubTab 2: Live Sample Records */}
          {activeSubTab === 'sample' && (
            <div className="rounded-2xl bg-[#0A0E17]/95 border border-white/[0.08] overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white font-mono">
                    Sample Records: {selectedTable}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live verified row fixtures for verification and prompt formulation.
                  </p>
                </div>
                {sampleData && (
                  <span className="text-xs font-mono text-slate-400">
                    <span className="text-[#00F5A0] font-semibold">{sampleData.rowCount || (sampleData.rows && sampleData.rows.length)}</span> records
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-[#00F5A0] rounded-full animate-spin mx-auto" />
                  <p>Fetching table sample records...</p>
                </div>
              ) : sampleData && sampleData.rows ? (
                <ResultTable data={sampleData} title="" />
              ) : (
                <div className="py-8 text-center text-xs text-slate-500">
                  No sample records available for {selectedTable}.
                </div>
              )}
            </div>
          )}

          {/* SubTab 3: Entity Relationship Map (ERD) */}
          {activeSubTab === 'er' && (
            <div className="rounded-2xl bg-[#0A0E17]/95 border border-white/[0.08] p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-[#00F5A0]" />
                  <span>Relational Schema Topology (querify_db)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Foreign key relationships centered on the primary <code className="text-[#00F5A0]">companies</code> entity table.
                </p>
              </div>

              {/* Visual ER Map Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                {/* Central Company Node */}
                <div className="md:col-span-3 p-4 rounded-xl bg-[#0F1523] border-2 border-[#00F5A0]/40 shadow-[0_0_25px_-5px_rgba(0,245,160,0.2)] flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#00F5A0]/20 text-[#00F5A0] font-bold text-[10px]">
                        ROOT ENTITY
                      </span>
                      <span className="font-bold text-white text-sm">companies</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Primary Key: <code className="text-amber-300">company_id</code> (INT)
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    20 AI Enterprises • 1-to-Many Relationships
                  </div>
                </div>

                {/* Satellite Tables */}
                {[
                  { name: 'ai_models', fk: 'company_id', desc: 'Foundation models, parameters, release dates, benchmark scores' },
                  { name: 'financial_performance', fk: 'company_id', desc: 'Annual revenue ($M), profit ($M), YoY growth (%) 2022-2024' },
                  { name: 'ai_investments', fk: 'company_id', desc: 'Capital rounds, valuations, lead investors, expected ROI' },
                  { name: 'research_projects', fk: 'company_id', desc: 'R&D labs, project budgets, publication counts' },
                  { name: 'market_performance', fk: 'company_id', desc: 'Market cap ($B), P/E ratios, stock prices, health index' },
                  { name: 'query_history', fk: 'None (Audit Log)', desc: 'Asynchronous audit logs with execution durations and row metrics' }
                ].map((rel, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#0F1523] border border-white/[0.08] hover:border-[#00F5A0]/30 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{rel.name}</span>
                      <span className="text-[10px] text-sky-300 px-1.5 py-0.5 rounded bg-sky-950/40 border border-sky-800/40">
                        FK: {rel.fk}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      {rel.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
