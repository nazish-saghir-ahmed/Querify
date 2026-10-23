import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon } from 'lucide-react';

const PALETTE = [
  '#00F5A0', '#00DF89', '#38BDF8', '#60A5FA', '#94A3B8',
  '#F59E0B', '#34D399', '#A7F3D0', '#E2E8F0', '#64748B'
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
        <div className="bg-[#0A0E17] border border-white/[0.12] p-3 rounded-xl shadow-2xl text-xs font-sans">
          <p className="font-semibold text-white mb-1">{label || dataItem.name}</p>
          <p className="text-[#00F5A0] font-mono">
            {yKey.replace(/_/g, ' ')}: <span className="font-bold">{dataItem.value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full rounded-2xl bg-[#0A0E17]/95 border border-white/[0.08] p-5 shadow-2xl backdrop-blur-xl">
      {/* Chart Header & Type Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-white font-mono">
            {suggestion?.title || `${yKey.replace(/_/g, ' ')} by ${xKey.replace(/_/g, ' ')}`}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Automatic visual projection deduced from {rows.length} verified records
          </p>
        </div>

        {/* Switcher Buttons */}
        <div className="flex items-center gap-1 bg-[#0F1523] p-1 rounded-lg border border-white/[0.08]">
          <button
            onClick={() => setChartType('bar')}
            className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 transition-all ${
              chartType === 'bar' ? 'bg-[#00F5A0] text-[#06080D] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Bar Chart"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bar</span>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 transition-all ${
              chartType === 'line' ? 'bg-[#00F5A0] text-[#06080D] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Line Chart"
          >
            <LineIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Line</span>
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 transition-all ${
              chartType === 'pie' ? 'bg-[#00F5A0] text-[#06080D] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
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
              <CartesianGrid strokeDasharray="3 3" stroke="#1C2638" vertical={false} />
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
              <Bar dataKey="value" fill="#00F5A0" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}

          {chartType === 'line' && (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C2638" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#00F5A0"
                strokeWidth={2.5}
                dot={{ fill: '#06080D', r: 4, strokeWidth: 2, stroke: '#00F5A0' }}
                activeDot={{ r: 6, fill: '#00F5A0' }}
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
                  <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
