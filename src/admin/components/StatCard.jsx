import React from 'react';

export default function StatCard({ icon, label, value, sub, accent = 'text-brand-primary' }) {
  return (
    <div className="bg-white rounded-[1.75rem] border border-slate-100 p-6 shadow-sm flex items-start gap-4">
      {icon && (
        <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl shrink-0 ${accent}`}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</p>
        <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1 truncate">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}
