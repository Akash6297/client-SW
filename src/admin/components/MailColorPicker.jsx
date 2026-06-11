import React from 'react';

const FIELDS = [
  { key: 'primary', label: 'Primary / Buttons' },
  { key: 'header', label: 'Header Background' },
  { key: 'text', label: 'Body Text' },
];

// Lets the admin pick the accent/header/text colors used by {{color_primary}},
// {{color_header}} and {{color_text}} merge fields inside a mail template.
export default function MailColorPicker({ colors, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Theme Colors</label>
      <div className="grid grid-cols-3 gap-3">
        {FIELDS.map((f) => (
          <div key={f.key} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl p-2">
            <input
              type="color"
              value={colors[f.key]}
              onChange={(e) => onChange({ ...colors, [f.key]: e.target.value })}
              className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer shrink-0"
              aria-label={f.label}
            />
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 truncate">{f.label}</p>
              <p className="text-[11px] font-mono text-slate-600 truncate">{colors[f.key]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
