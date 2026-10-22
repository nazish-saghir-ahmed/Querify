import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon, Layers } from 'lucide-react';

const NEON_COLORS = [
  '#8B5CF6', '#22D3EE', '#EC4899', '#10B981', '#F59E0B',
  '#6366F1', '#14B8A6', '#F43F5E', '#84CC16', '#A855F7'
];

export default function ResultChart({ data, suggestion }) {
  if (!data || !data.rows || data.rows.length === 0) return null;

  const { rows, columns } = data;

  // Determine initial chart type from suggestion or default to "bar"
  const defaultType = suggestion?.type || 'bar';
  const [chartType, setChartType] = useState(defaultType);

  // Identify X and Y keys
  const xKey = suggestion?.xAxis || columns[0];
  const yKey = suggestion?.yAxis || columns.find((c) => c !== xKey) || columns[1];

  // Prepare normalized numeric data for charts
  const chartData = rows.map((r) => {
    const rawVal = r[yKey];
    let num = typeof rawVal === 'number' ? rawVal : parseFloat(rawVal);
    if (isNaN(num)) num = 0;
    return {
      name: String(r[xKey] ?? ''),
      value: num,
      ...r,
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0];
      return (
        <div className="bg-[#101827] border border-purple-500/40 p-3 rounded-xl shadow-xl shadow-black/80 text-xs">
          <p className="font-semibold text-white mb-1">{label || dataItem.name}</p>
          <p className="text-cyan-400 font-mono">
            {yKey.replace(/_/g, ' ')}: <span className="font-bold">{dataItem.value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full rounded-2xl bg-[#101827] border border-[#1E293B] p-5 shadow-card-dark">
      {/* Chart Header & Type Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h4 className="text-sm font-semibold text-white">
            {suggestion?.title || `${yKey.replace(/_/g, ' ')} by ${xKey.replace(/_/g, ' ')}`}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualization derived from {rows.length} live records
          </p>
        </div>

        {/* Switcher Buttons */}
        <div className="flex items-center gap-1 bg-[#151E30] p-1 rounded-xl border border-[#1E293B]">
          <button
            onClick={() => setChartType('bar')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              chartType === 'bar' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
            title="Bar Chart"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bar</span>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              chartType === 'line' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
            title="Line Chart"
          >
            <LineIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Line</span>
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              chartType === 'pie' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
            title="Pie Chart"
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pie</span>
          </button>
        </div>
      </div>

      {/* Render Chart */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' && (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
              />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.6} />
                </linearGradient>
              </defs>
            </BarChart>
          )}

          {chartType === 'line' && (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22D3EE"
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', r: 5, strokeWidth: 2, stroke: '#101827' }}
                activeDot={{ r: 7, fill: '#22D3EE' }}
              />
            </LineChart>
          )}

          {chartType === 'pie' && (
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={95}
                innerRadius={50}
                paddingAngle={4}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={NEON_COLORS[index % NEON_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
