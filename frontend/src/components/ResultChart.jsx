import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon } from 'lucide-react';

const DARK_NAVY_PALETTE = [
  '#1D3557', '#2B4C7E', '#D4AF37', '#3A506B', '#7FA1C3',
  '#E5C158', '#415A77', '#9BB8D3', '#14253D', '#C5A028'
];

export default function ResultChart({ data, suggestion }) {
  if (!data || !data.rows || data.rows.length === 0) return null;

  const { rows, columns } = data;

  const defaultType = suggestion?.type || 'bar';
  const [chartType, setChartType] = useState(defaultType);

  // Safe resolver for X and Y dimension keys
  const xKey = suggestion?.xAxis || suggestion?.xaxis || columns.find((c) => /name|company|model|project|category|area/i.test(c)) || columns[0];
  const yKey = suggestion?.yAxis || suggestion?.yaxis || columns.find((c) => c !== xKey && /revenue|profit|growth|percent|score|amount|budget|count/i.test(c)) || columns[1];

  const isPercentage = /percent|growth|share|roi|rate/i.test(yKey);
  const isCurrency = /revenue|profit|cost|budget|amount/i.test(yKey);

  const chartData = rows.map((r) => {
    let nameVal = r[xKey] ?? r[xKey?.toLowerCase()];
    if (!nameVal && (xKey.toLowerCase().includes('company') || xKey.toLowerCase().includes('name'))) {
      nameVal = r.company_name ?? r.companyName ?? r.company ?? r.name ?? (r.company_id ? `Company #${r.company_id}` : '');
    }
    if (!nameVal && xKey.toLowerCase().includes('model')) {
      nameVal = r.model_name ?? r.modelName ?? '';
    }
    if (!nameVal && xKey.toLowerCase().includes('project')) {
      nameVal = r.project_name ?? r.projectName ?? '';
    }

    const rawVal = r[yKey] ?? r[yKey?.toLowerCase()];
    let num = typeof rawVal === 'number' ? rawVal : parseFloat(rawVal);
    if (isNaN(num)) num = 0;

    return {
      name: String(nameVal || r[columns[0]] || 'Record'),
      value: num,
      ...r,
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0];
      const formattedVal = isPercentage
        ? `${dataItem.value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}%`
        : isCurrency
        ? `$${dataItem.value.toLocaleString()} M`
        : dataItem.value.toLocaleString();

      return (
        <div className="bg-[#0D1B2A]/95 border border-[#3A506B]/60 p-3 rounded-xl shadow-2xl text-xs font-sans backdrop-blur-md">
          <p className="font-semibold text-[#F7F3E9] mb-1 font-mono">{label || dataItem.name}</p>
          <p className="text-[#7FA1C3] font-mono">
            {yKey.replace(/_/g, ' ')}: <span className="font-bold text-[#D4AF37]">{formattedVal}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full rounded-2xl bg-[#0D1B2A]/70 border border-[#3A506B]/40 p-5 shadow-2xl backdrop-blur-2xl">
      {/* Chart Header & Type Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-[#F7F3E9] font-mono">
            {suggestion?.title || `${yKey.replace(/_/g, ' ')} by ${xKey.replace(/_/g, ' ')}`}
          </h4>
          <p className="text-xs text-slate-300 mt-0.5 font-sans">
            Automatic visual projection deduced from {rows.length} verified records
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#1B263B]/60 p-1 rounded-xl border border-[#3A506B]/40 backdrop-blur-md">
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              chartType === 'bar'
                ? 'bg-[#1D3557] text-[#F7F3E9] font-semibold border border-[#3A506B]/60 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#7FA1C3]" />
            <span>Bar</span>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              chartType === 'line'
                ? 'bg-[#1D3557] text-[#F7F3E9] font-semibold border border-[#3A506B]/60 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LineIcon className="w-3.5 h-3.5 text-[#7FA1C3]" />
            <span>Line</span>
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              chartType === 'pie'
                ? 'bg-[#1D3557] text-[#F7F3E9] font-semibold border border-[#3A506B]/60 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5 text-[#7FA1C3]" />
            <span>Pie</span>
          </button>
        </div>
      </div>

      {/* Responsive Recharts Container */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 35 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A506B" opacity={0.25} />
              <XAxis
                dataKey="name"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
              />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#1D3557" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={DARK_NAVY_PALETTE[index % DARK_NAVY_PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 35 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A506B" opacity={0.25} />
              <XAxis
                dataKey="name"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                angle={-20}
                textAnchor="end"
              />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2B4C7E"
                strokeWidth={3}
                dot={{ fill: '#D4AF37', r: 4, strokeWidth: 2, stroke: '#0D1B2A' }}
                activeDot={{ r: 6, fill: '#7FA1C3' }}
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
                  <Cell key={`cell-${index}`} fill={DARK_NAVY_PALETTE[index % DARK_NAVY_PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
