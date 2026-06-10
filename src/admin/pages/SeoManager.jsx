import React, { useEffect, useState } from 'react';
import { FiSave, FiCopy, FiCheck, FiChevronDown } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import { useAdminAuth } from '../context/AdminAuthContext';
import { callAdminApi } from '../api/client';
import { SEO_PAGES } from '../config';

const SITE_URL = 'https://smoothweb.in';

function buildSitemap() {
  const priorities = { home: '1.0', portfolio: '0.9', about: '0.8', services: '0.8', contact: '0.7', book: '0.7' };
  const freq = { home: 'weekly', portfolio: 'weekly', about: 'monthly', services: 'monthly', contact: 'monthly', book: 'monthly' };
  const urls = SEO_PAGES.map((p) => `  <url>\n    <loc>${SITE_URL}${p.path}</loc>\n    <changefreq>${freq[p.key] || 'monthly'}</changefreq>\n    <priority>${priorities[p.key] || '0.7'}</priority>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full px-3 py-1.5 transition-colors"
    >
      {copied ? <FiCheck className="text-green-500" /> : <FiCopy />} {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function PageSeoCard({ page, override, token, onSaved }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: override?.Title || '',
    description: override?.Description || '',
    keywords: override?.Keywords || '',
    ogImage: override?.OGImage || '',
    canonical: override?.Canonical || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await callAdminApi('saveSeo', { page: page.key, ...form }, token);
      setSaved(true);
      onSaved?.();
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const hasOverride = !!(override?.Title || override?.Description);

  return (
    <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
        <div>
          <p className="font-black text-slate-900">{page.label}</p>
          <p className="text-xs text-slate-400">{page.path}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${hasOverride ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
            {hasOverride ? 'Customized' : 'Default'}
          </span>
          <FiChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-50 pt-5">
          <Field label="Title Tag" value={form.title} placeholder={page.defaultTitle} onChange={(v) => setForm({ ...form, title: v })} />
          <Field label="Meta Description" textarea value={form.description} placeholder={page.defaultDescription} onChange={(v) => setForm({ ...form, description: v })} />
          <Field label="Keywords (comma separated)" value={form.keywords} placeholder="e.g. portfolio website, seo agency india" onChange={(v) => setForm({ ...form, keywords: v })} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="OG Image URL" value={form.ogImage} placeholder="https://smoothweb.in/og-image.png" onChange={(v) => setForm({ ...form, ogImage: v })} />
            <Field label="Canonical URL" value={form.canonical} placeholder={`${SITE_URL}${page.path}`} onChange={(v) => setForm({ ...form, canonical: v })} />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-brand-dark text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl hover:bg-brand-primary transition-all disabled:opacity-50"
          >
            {saved ? <FiCheck /> : <FiSave />} {saving ? 'Saving…' : saved ? 'Saved' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, placeholder, onChange, textarea }) {
  const Comp = textarea ? 'textarea' : 'input';
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <Comp
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={textarea ? 3 : undefined}
        className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl outline-none text-sm font-medium text-slate-900 focus:border-brand-primary/50 transition-all placeholder:text-slate-300"
      />
    </div>
  );
}

export default function SeoManager() {
  const { token } = useAdminAuth();
  const [overrides, setOverrides] = useState({});
  const [robots, setRobots] = useState('');
  const [robotsSaving, setRobotsSaving] = useState(false);
  const [robotsSaved, setRobotsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [seoData, settings] = await Promise.all([
      callAdminApi('getSeo', {}, token),
      callAdminApi('getSettings', {}, token),
    ]);
    const map = {};
    (seoData || []).forEach((row) => { map[row.PageKey] = row; });
    setOverrides(map);
    setRobots(settings?.ROBOTS_TXT || '');
    setLoading(false);
  };

  useEffect(() => { load(); }, [token]);

  const saveRobots = async () => {
    setRobotsSaving(true);
    setRobotsSaved(false);
    try {
      await callAdminApi('saveSettings', { settings: { ROBOTS_TXT: robots } }, token);
      setRobotsSaved(true);
      setTimeout(() => setRobotsSaved(false), 2000);
    } finally {
      setRobotsSaving(false);
    }
  };

  return (
    <AdminLayout title="SEO Manager">
      {loading ? (
        <div className="h-40 flex items-center justify-center text-slate-300">Loading…</div>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="font-black uppercase tracking-widest text-xs text-slate-500 mb-4">Page Meta Tags</h2>
            <div className="space-y-3">
              {SEO_PAGES.map((page) => (
                <PageSeoCard key={page.key} page={page} override={overrides[page.key]} token={token} onSaved={load} />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Changes apply live on the public site (title, description, keywords, Open Graph image, canonical URL). Leave a field blank to keep the site's default.
            </p>
          </section>

          <section>
            <h2 className="font-black uppercase tracking-widest text-xs text-slate-500 mb-4">Robots.txt</h2>
            <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-5 space-y-3">
              <textarea
                value={robots}
                onChange={(e) => setRobots(e.target.value)}
                rows={5}
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none text-sm font-mono text-slate-900 focus:border-brand-primary/50 transition-all"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={saveRobots}
                  disabled={robotsSaving}
                  className="flex items-center gap-2 bg-brand-dark text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl hover:bg-brand-primary transition-all disabled:opacity-50"
                >
                  {robotsSaved ? <FiCheck /> : <FiSave />} {robotsSaving ? 'Saving…' : robotsSaved ? 'Saved' : 'Save'}
                </button>
                <CopyButton text={robots} />
              </div>
              <p className="text-xs text-slate-400">
                This is saved for your records. Crawlers read the static <code>public/robots.txt</code> file —
                copy this content into that file and redeploy to apply it.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-black uppercase tracking-widest text-xs text-slate-500 mb-4">Sitemap.xml</h2>
            <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-5 space-y-3">
              <pre className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl overflow-x-auto text-xs font-mono text-slate-700 whitespace-pre-wrap">{buildSitemap()}</pre>
              <div className="flex items-center gap-3">
                <CopyButton text={buildSitemap()} />
              </div>
              <p className="text-xs text-slate-400">
                Generated from the pages above. Copy into <code>public/sitemap.xml</code> and redeploy whenever you add or remove pages.
              </p>
            </div>
          </section>
        </div>
      )}
    </AdminLayout>
  );
}
