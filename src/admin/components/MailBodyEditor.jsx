import React, { useRef } from 'react';
import { MAIL_SNIPPETS, MAIL_MERGE_FIELDS } from '../config';

/**
 * HTML source editor for mail templates/compose body, with a toolbar of
 * ready-made blocks (logo header, image, button, social links, signature)
 * and merge-field inserts, plus a sandboxed live preview.
 */
export default function MailBodyEditor({ value, onChange, previewHtml }) {
  const textareaRef = useRef(null);

  const insertAtCursor = (text) => {
    const el = textareaRef.current;
    if (!el) {
      onChange(`${value}\n${text}\n`);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = `${value.slice(0, start)}\n${text}\n${value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + text.length + 2;
      el.selectionStart = el.selectionEnd = pos;
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Insert Block</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {MAIL_SNIPPETS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => insertAtCursor(s.html)}
              className="text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-brand-primary hover:text-white transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Insert Merge Field</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {MAIL_MERGE_FIELDS.map((f) => (
            <button
              key={f.key}
              type="button"
              title={f.label}
              onClick={() => insertAtCursor(f.key)}
              className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-100 transition-colors font-mono"
            >
              {f.key}
            </button>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={16}
          spellCheck={false}
          className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-xs font-mono leading-relaxed"
          placeholder="Write your email HTML here, or use the buttons above to insert ready-made blocks..."
        />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Live Preview</p>
        <iframe
          title="Email preview"
          srcDoc={previewHtml}
          sandbox=""
          className="w-full h-[420px] bg-white border border-slate-100 rounded-xl"
        />
      </div>
    </div>
  );
}
