import React from 'react';

/**
 * Lightweight CSS bar chart — no charting dependency.
 * data: [{ label: string, value: number }]
 */
export default function MiniBarChart({ data, formatValue = (v) => v, barClassName = 'bg-brand-primary' }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="flex items-end gap-1.5 h-32 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
          <div
            className={`w-full rounded-t-md ${barClassName} transition-all`}
            style={{ height: `${Math.max(2, (d.value / max) * 100)}%` }}
            title={`${d.label}: ${formatValue(d.value)}`}
          />
          <span className="text-[8px] font-bold text-slate-400 mt-1.5 truncate w-full text-center uppercase tracking-wide">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}
