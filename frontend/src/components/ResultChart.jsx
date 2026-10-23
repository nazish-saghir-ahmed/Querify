import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon } from 'lucide-react';

const ROYAL_PALETTE = [
  '#2563EB', '#3B82F6', '#D4AF37', '#E5C158', '#415A77',
  '#60A5FA', '#93C5FD', '#F7F3E9', '#1D4ED8', '#B45309'
];

export default function ResultChart({ data, suggestion }) {
  if (!data || !data.rows || data.rows.length === 0) return null;

  const { rows, columns } = data;

  const defaultType = suggestion?.type || 'bar';
  const [chartType, setChartType] = useState(defaultType);

  const xKey = suggestion?.xAxis || columns[0];
  const yKey = suggestion?.yAxis || columns.find((c) => c !== xKey) || columns[1];

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
        <div className="bg-[#0D1B2A]/90 border border-[#415A77]/50 p-3 rounded-xl shadow-2xl text-xs font-sans backdrop-blur-md">
          <p className="font-semibold text-[#F7F3E9] mb-1">{label || dataItem.name}</p>
          <p className="text-blue-400 font-mono">
            {yKey.replace(/_/g, ' ')}: <span className="font-bold text-[#D4AF37]">{dataItem.value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full rounded-2xl bg-[#0D1B2A]/60 border border-[#415A77]/35 p-5 shadow-2xl backdrop-blur-2xl">
      {/* Chart Header & Type Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-[#F7F3E9] font-mono">
            {suggestion?.title || `${yKey.replace(/_/g, ' ')} by ${xKey.replace(/_/g, ' ')}`}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Automatic visual projection deduced from {rows.length} verified records
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#1B263B]/60 p-1 rounded-xl border border-[#415A77]/30 backdrop-blur-md">
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              chartType === 'bar'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Bar</span>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              chartType === 'line'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LineIcon className="w-3.5 h-3.5" />
            <span>Line</span>
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              chartType === 'pie'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Pie</span>
          </button>
        </div>
      </div>

      {/* Responsive Recharts Container */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#415A77" opacity={0.25} />
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
              <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={ROYAL_PALETTE[index % ROYAL_PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#415A77" opacity={0.25} />
              <XAxis
                dataKey="name"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                angle={-20}
                textAnchor="end"
              />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#D4AF37', r: 4, strokeWidth: 2, stroke: '#0D1B2A' }}
                activeDot={{ r: 6, fill: '#3B82F6' }}
              />
            </LineChart>
          ) : (
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(val) => <span className="text-xs text-slate-300 font-sans">{val}</span>}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                outerRadius={105}
                innerRadius={45}
                paddingAngle={4}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={ROYAL_PALETTE[index % ROYAL_PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
