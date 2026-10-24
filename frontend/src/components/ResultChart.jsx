import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon } from 'lucide-react';

// Strict Midnight Blue & Pure White / Light Sky monochromatic palette
const CHART_COLORS = [
  '#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD',
  '#BFDBFE', '#1E40AF', '#1E3A8A', '#38BDF8', '#DBEAFE'
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
        <div className="bg-[#080D1A] border border-blue-600/40 p-3 rounded-xl shadow-2xl text-xs font-sans">
          <p className="font-bold text-white mb-1 font-mono">{label || dataItem.name}</p>
          <p className="text-blue-200/80 font-mono">
            {yKey.replace(/_/g, ' ')}: <span className="font-bold text-white">{formattedVal}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full rounded-2xl bg-[#0B132B]/85 border border-blue-500/25 p-5 shadow-2xl backdrop-blur-xl">
      {/* Chart Header & Type Switcher (Bar / Line / Pie) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h4 className="text-sm font-display font-bold text-white tracking-wide">
            {suggestion?.title || `${yKey.replace(/_/g, ' ')} by ${xKey.replace(/_/g, ' ')}`}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Visual distribution generated from {rows.length} verified records
          </p>
        </div>

        {/* Bar / Line / Pie Toggle Controls */}
        <div className="flex items-center gap-1 bg-blue-950/60 p-1 rounded-xl border border-blue-800/50">
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              chartType === 'bar'
                ? 'bg-blue-600 text-white shadow-midnight'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Bar</span>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              chartType === 'line'
                ? 'bg-blue-600 text-white shadow-midnight'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LineIcon className="w-3.5 h-3.5" />
            <span>Line</span>
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              chartType === 'pie'
                ? 'bg-blue-600 text-white shadow-midnight'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Pie</span>
          </button>
        </div>
      </div>

      {/* Responsive Visual Canvas */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#16294D" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#93C5FD"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#1B2C55' }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={45}
              />
              <YAxis
                stroke="#93C5FD"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#1B2C55' }}
                tickFormatter={(v) =>
                  isPercentage
                    ? `${v}%`
                    : isCurrency
                    ? `$${v >= 1000 ? `${(v / 1000).toFixed(0)}B` : `${v}M`}`
                    : v
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#16294D" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#93C5FD"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#1B2C55' }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={45}
              />
              <YAxis
                stroke="#93C5FD"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#1B2C55' }}
                tickFormatter={(v) =>
                  isPercentage
                    ? `${v}%`
                    : isCurrency
                    ? `$${v >= 1000 ? `${(v / 1000).toFixed(0)}B` : `${v}M`}`
                    : v
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#2563EB', stroke: '#FFFFFF', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#FFFFFF' }}
              />
            </LineChart>
          ) : (
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(val) => <span className="text-xs text-white font-sans">{val}</span>}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={45}
                paddingAngle={3}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`pie-cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                    stroke="#080D1A"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
