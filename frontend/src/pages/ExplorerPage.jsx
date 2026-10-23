import React, { useState, useEffect } from 'react';
import { databaseApi } from '../services/api';
import { Database, Key, Link2, Table as TableIcon, RefreshCw, Eye, GitFork, Search } from 'lucide-react';
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

  // Filter tables by search query
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#3A506B]/35">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#1D3557]/80 border border-[#3A506B]/60 text-[#7FA1C3]">
              <Database className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F3E9]">
              Database Explorer
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1B263B]/60 text-[#D4AF37] border border-[#D4AF37]/35">
              Domain Relational Schema
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Inspect live table structures, primary/foreign keys, and data fixtures.
          </p>
        </div>

        <button
          onClick={fetchInitialData}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1B263B]/60 hover:bg-[#1B263B] text-slate-300 hover:text-white border border-[#3A506B]/40 transition-colors backdrop-blur-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#7FA1C3] ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Metadata</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Tables Navigation with Search Bar (Dark Navy Frosted Glass) */}
        <div className="lg:col-span-1 space-y-3">
          {/* Custom Search Filter Bar */}
          <div className="relative">
            <div className="flex items-center px-3 py-2 rounded-xl bg-[#0D1B2A]/70 border border-[#3A506B]/40 focus-within:border-[#7FA1C3] transition-all backdrop-blur-md">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter tables or columns..."
                className="w-full bg-transparent text-xs text-[#F7F3E9] placeholder-slate-400 focus:outline-none"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  className="text-slate-400 hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] font-mono text-[#D4AF37] uppercase tracking-wider">
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
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between backdrop-blur-md ${
                    isSelected
                      ? 'bg-[#1D3557] border-[#3A506B] shadow-[0_0_15px_-4px_rgba(29,53,87,0.5)] text-[#F7F3E9]'
                      : 'bg-[#0D1B2A]/60 border-[#3A506B]/30 hover:border-[#7FA1C3]/50 text-slate-300 hover:text-white hover:bg-[#1B263B]/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <TableIcon className={`w-4 h-4 ${isSelected ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
                    <span className="font-mono text-xs font-semibold">{t.tableName}</span>
                  </div>
                  {countItem && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0D1B2A]/80 border border-[#3A506B]/30 text-slate-300">
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
              className={`w-full p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all backdrop-blur-md ${
                activeSubTab === 'er'
                  ? 'bg-[#1D3557] text-[#F7F3E9] border-[#3A506B] shadow-sm'
                  : 'bg-[#0D1B2A]/60 border-[#3A506B]/30 text-slate-300 hover:text-white hover:border-[#3A506B] hover:bg-[#1B263B]/40'
              }`}
            >
              <GitFork className="w-4 h-4 text-[#7FA1C3]" />
              <span>Entity Relationship Map</span>
            </button>
          </div>
        </div>

        {/* Right Column: Schema, Sample Rows, or ERD */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sub-tab Navigation */}
          <div className="flex items-center justify-between bg-[#0D1B2A]/70 backdrop-blur-xl p-2 rounded-xl border border-[#3A506B]/40">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#F7F3E9] px-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7FA1C3] animate-pulse" />
                {activeSubTab === 'er' ? 'Full Relational Topology' : selectedTable}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#1B263B]/60 p-1 rounded-lg border border-[#3A506B]/35">
              <button
                onClick={() => setActiveSubTab('schema')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeSubTab === 'schema'
                    ? 'bg-[#1D3557] text-[#F7F3E9] font-semibold border border-[#3A506B]/70 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-[#7FA1C3]" />
                <span>Columns & Types</span>
              </button>
              <button
                onClick={() => setActiveSubTab('sample')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeSubTab === 'sample'
                    ? 'bg-[#1D3557] text-[#F7F3E9] font-semibold border border-[#3A506B]/70 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-[#7FA1C3]" />
                <span>Live Sample Records</span>
              </button>
              <button
                onClick={() => setActiveSubTab('er')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeSubTab === 'er'
                    ? 'bg-[#1D3557] text-[#F7F3E9] font-semibold border border-[#3A506B]/70 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GitFork className="w-3.5 h-3.5 text-[#7FA1C3]" />
                <span>ERD</span>
              </button>
            </div>
          </div>

          {/* SubTab 1: Columns & Types */}
          {activeSubTab === 'schema' && currentSchema && (
            <div className="rounded-2xl bg-[#0D1B2A]/70 backdrop-blur-2xl border border-[#3A506B]/40 overflow-hidden p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#F7F3E9] flex items-center gap-2 font-mono">
                  <span>Table Description</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {currentSchema.description || 'Database entity representation with structured attributes.'}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#3A506B]/35 text-slate-300 font-mono text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-3">Column Name</th>
                      <th className="py-3 px-3">Data Type</th>
                      <th className="py-3 px-3">Key Status</th>
                      <th className="py-3 px-3">Description / Metadata</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3A506B]/25">
                    {(currentSchema.columns || []).map((col, idx) => {
                      const name = col.name || col.columnName;
                      const type = col.type || col.dataType;
                      const isPK = col.primaryKey || col.isPrimaryKey;
                      const isFK = col.foreignKey || col.isForeignKey;
                      return (
                        <tr key={idx} className="hover:bg-[#1B263B]/40 transition-colors">
                          <td className="py-3 px-3 font-mono font-semibold text-[#7FA1C3]">
                            {name}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-300">
                            <span className="px-2 py-0.5 rounded bg-[#1B263B]/60 border border-[#3A506B]/35">
                              {type}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {isPK ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/35 text-[#D4AF37] font-mono text-[10px] font-bold">
                                <Key className="w-3 h-3" />
                                PRIMARY KEY
                              </span>
                            ) : isFK ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1D3557]/60 border border-[#3A506B]/60 text-[#7FA1C3] font-mono text-[10px] font-bold">
                                <Link2 className="w-3 h-3" />
                                FOREIGN KEY
                              </span>
                            ) : (
                              <span className="text-[#3A506B] font-mono">-</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-300">
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
            <div className="rounded-2xl bg-[#0D1B2A]/70 backdrop-blur-2xl border border-[#3A506B]/40 overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#F7F3E9] font-mono">
                    Sample Records: {selectedTable}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Live verified row fixtures for verification and prompt formulation.
                  </p>
                </div>
                {sampleData && (
                  <span className="text-xs font-mono text-slate-300">
                    <span className="text-[#D4AF37] font-semibold">{sampleData.rowCount || (sampleData.rows && sampleData.rows.length)}</span> records
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="py-12 text-center text-xs text-slate-300 space-y-2">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-[#D4AF37] rounded-full animate-spin mx-auto" />
                  <p>Fetching table sample records...</p>
                </div>
              ) : sampleData && sampleData.rows ? (
                <ResultTable data={sampleData} title="" />
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No sample records available for {selectedTable}.
                </div>
              )}
            </div>
          )}

          {/* SubTab 3: Entity Relationship Map (ERD) */}
          {activeSubTab === 'er' && (
            <div className="rounded-2xl bg-[#0D1B2A]/70 backdrop-blur-2xl border border-[#3A506B]/40 p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[#F7F3E9] font-mono flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-[#7FA1C3]" />
                  <span>Relational Schema Topology (querify_db)</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Foreign key relationships centered on the primary <code className="text-[#7FA1C3]">companies</code> entity table.
                </p>
              </div>

              {/* Visual ER Map Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                {/* Central Company Node */}
                <div className="md:col-span-3 p-4 rounded-xl bg-[#1B263B]/60 border-2 border-[#D4AF37]/50 shadow-[0_0_25px_-5px_rgba(212,175,55,0.25)] flex items-center justify-between backdrop-blur-md">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-[10px]">
                        ROOT ENTITY
                      </span>
                      <span className="font-bold text-[#F7F3E9] text-sm">companies</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans">
                      Primary Key: <code className="text-[#D4AF37]">company_id</code> (INT)
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-300">
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
                  <div key={idx} className="p-3.5 rounded-xl bg-[#1B263B]/50 border border-[#3A506B]/35 hover:border-[#7FA1C3]/60 hover:bg-[#1B263B]/70 transition-all space-y-2 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#F7F3E9]">{rel.name}</span>
                      <span className="text-[10px] text-[#7FA1C3] px-1.5 py-0.5 rounded bg-[#0D1B2A]/80 border border-[#3A506B]/40">
                        FK: {rel.fk}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
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
