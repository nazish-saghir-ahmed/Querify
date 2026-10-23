import React, { useState, useEffect } from 'react';
import { databaseApi } from '../services/api';
import { Database, Key, Link2, Table as TableIcon, RefreshCw, Eye, GitFork } from 'lucide-react';
import ResultTable from '../components/ResultTable';

export default function ExplorerPage() {
  const [schemaList, setSchemaList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [selectedTable, setSelectedTable] = useState('companies');
  const [sampleData, setSampleData] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('schema'); // 'schema', 'sample', or 'er'
  const [isLoading, setIsLoading] = useState(false);

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
      setSchemaList(schemas || []);
      setTableList(tables || []);
      if (schemas && schemas.length > 0) {
        setSelectedTable(schemas[0].tableName);
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
      setSampleData(sample);
    } catch (err) {
      console.error('Failed to load table sample:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSchema = schemaList.find((s) => s.tableName === selectedTable) || schemaList[0];

  return (
    <div className="min-h-screen bg-[#080B14] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#1E293B]">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-cyan-400" />
            Database Explorer
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Explore live MySQL 8 schema, column data types, foreign keys, and actual records.
          </p>
        </div>

        <button
          onClick={fetchInitialData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#151E30] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E293B] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Refresh Metadata</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Tables Navigation */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Database Tables ({schemaList.length})
          </h3>
          <div className="space-y-1.5">
            {schemaList.map((t) => {
              const isSelected = selectedTable === t.tableName;
              const countItem = tableList.find((item) => item.name === t.tableName);
              return (
                <button
                  key={t.tableName}
                  onClick={() => setSelectedTable(t.tableName)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500/60 shadow-neon-violet text-white'
                      : 'bg-[#101827] border-[#1E293B] hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <TableIcon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="font-mono text-xs font-semibold">{t.tableName}</span>
                  </div>
                  {countItem && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#151E30] border border-[#1E293B] text-slate-300">
                      {countItem.rowCount} rows
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick ER Diagram Pill */}
          <div className="pt-2">
            <button
              onClick={() => setActiveSubTab('er')}
              className={`w-full p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                activeSubTab === 'er'
                  ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-300 shadow-neon-cyan'
                  : 'bg-[#101827] border-[#1E293B] text-slate-400 hover:text-white'
              }`}
            >
              <GitFork className="w-4 h-4 text-cyan-400" />
              <span>View Entity Relationships (ERD)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Schema, Sample Rows, or ERD */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sub-tab Navigation */}
          <div className="flex items-center justify-between bg-[#101827] p-2 rounded-2xl border border-[#1E293B]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white px-2">
                {selectedTable}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveSubTab('schema')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  activeSubTab === 'schema'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-[#151E30]'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Columns & Types</span>
              </button>
              <button
                onClick={() => setActiveSubTab('sample')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  activeSubTab === 'sample'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-[#151E30]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Sample Records</span>
              </button>
            </div>
          </div>

          {/* 1. Columns & Schema View */}
          {activeSubTab === 'schema' && currentSchema && (
            <div className="rounded-2xl bg-[#101827] border border-[#1E293B] overflow-hidden shadow-card-dark p-5 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Table Description</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {currentSchema.description}
                </p>
              </div>

              {/* Columns Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#151E30] text-slate-400 font-semibold border-b border-[#1E293B]">
                      <th className="py-2.5 px-3.5">Column Name</th>
                      <th className="py-2.5 px-3.5">Data Type</th>
                      <th className="py-2.5 px-3.5">Key Status</th>
                      <th className="py-2.5 px-3.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]/60 font-mono">
                    {currentSchema.columns?.map((c) => {
                      const colName = c.name || c.columnName;
                      const colType = c.type || c.dataType;
                      const isPk = c.primaryKey || c.columnKey === 'PRI';
                      const isFk = c.foreignKey || c.columnKey === 'MUL';
                      const colComment = c.comment || c.description || '-';
                      return (
                        <tr key={colName} className="hover:bg-[#151E30]/40 transition-colors">
                          <td className="py-2 px-3.5 font-bold text-cyan-300">
                            {colName}
                          </td>
                          <td className="py-2 px-3.5 text-purple-300">
                            {colType}
                          </td>
                          <td className="py-2 px-3.5">
                            {isPk && (
                              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                <Key className="w-2.5 h-2.5" /> PRIMARY KEY
                              </span>
                            )}
                            {isFk && (
                              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                <Link2 className="w-2.5 h-2.5" /> FOREIGN KEY
                              </span>
                            )}
                            {!isPk && !isFk && (
                              <span className="text-slate-500 font-sans text-[11px]">-</span>
                            )}
                          </td>
                          <td className="py-2 px-3.5 font-sans text-slate-300 text-xs">
                            {colComment}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Foreign Keys info */}
              {currentSchema.foreignKeys && currentSchema.foreignKeys.length > 0 && (
                <div className="pt-2 border-t border-[#1E293B] text-xs text-slate-400 space-y-1">
                  <span className="font-semibold text-slate-300">Foreign Key Constraints:</span>
                  {currentSchema.foreignKeys.map((fk, idx) => (
                    <p key={idx} className="font-mono text-[11px] text-cyan-400 bg-[#080B14] p-2 rounded-lg border border-[#1E293B]">
                      {fk}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Live Sample Records View */}
          {activeSubTab === 'sample' && (
            isLoading ? (
              <div className="p-12 text-center bg-[#101827] border border-[#1E293B] rounded-2xl text-slate-400">
                <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mx-auto mb-2" />
                <span className="text-xs">Loading sample records for '{selectedTable}'...</span>
              </div>
            ) : sampleData ? (
              <ResultTable data={sampleData} title={`Sample 10 Rows from '${selectedTable}'`} />
            ) : (
              <div className="p-8 text-center bg-[#101827] border border-[#1E293B] rounded-2xl text-slate-400">
                No sample records available for '{selectedTable}'.
              </div>
            )
          )}

          {/* 3. Entity-Relationship Diagram (ERD) View */}
          {activeSubTab === 'er' && (
            <div className="rounded-2xl bg-[#101827] border border-[#1E293B] p-6 shadow-card-dark space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-cyan-400" />
                  Entity Relationship Architecture
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  The primary central entity is <code className="text-cyan-300">companies</code>. Five analytical child tables maintain 1-to-many relationships via <code className="text-purple-300">company_id</code>.
                </p>
              </div>

              {/* Visual Architecture Tree */}
              <div className="p-6 rounded-xl bg-[#080B14] border border-[#1E293B] flex flex-col items-center">
                {/* Parent Node */}
                <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/60 shadow-neon-violet text-center w-64 mb-6">
                  <span className="text-xs uppercase tracking-wider font-bold text-purple-300 block">
                    Central Entity (1)
                  </span>
                  <span className="font-mono text-base font-bold text-white block mt-1">
                    companies
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    PK: company_id
                  </span>
                </div>

                {/* Connecting Arrow */}
                <div className="w-0.5 h-8 bg-gradient-to-b from-purple-500 to-cyan-400" />

                {/* Children Nodes (Many) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full mt-4">
                  <div className="p-3 rounded-lg bg-[#151E30] border border-[#1E293B] text-center">
                    <span className="font-mono text-xs font-bold text-cyan-300 block">ai_models</span>
                    <span className="text-[10px] text-slate-400 block mt-1">FK: company_id</span>
                    <span className="text-[10px] text-slate-500">Models & Benchmarks</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#151E30] border border-[#1E293B] text-center">
                    <span className="font-mono text-xs font-bold text-cyan-300 block">financial_performance</span>
                    <span className="text-[10px] text-slate-400 block mt-1">FK: company_id</span>
                    <span className="text-[10px] text-slate-500">Revenue, Profit, Growth</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#151E30] border border-[#1E293B] text-center">
                    <span className="font-mono text-xs font-bold text-cyan-300 block">ai_investments</span>
                    <span className="text-[10px] text-slate-400 block mt-1">FK: company_id</span>
                    <span className="text-[10px] text-slate-500">Capital & ROI</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#151E30] border border-[#1E293B] text-center">
                    <span className="font-mono text-xs font-bold text-cyan-300 block">research_projects</span>
                    <span className="text-[10px] text-slate-400 block mt-1">FK: company_id</span>
                    <span className="text-[10px] text-slate-500">Budgets & Status</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#151E30] border border-[#1E293B] text-center">
                    <span className="font-mono text-xs font-bold text-cyan-300 block">market_performance</span>
                    <span className="text-[10px] text-slate-400 block mt-1">FK: company_id</span>
                    <span className="text-[10px] text-slate-500">Market Share & Index</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
