import React, { useEffect, useState } from 'react';
import { FiExternalLink, FiCheckCircle, FiAlertCircle, FiEye } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import MiniBarChart from '../components/MiniBarChart';
import { useAdminAuth } from '../context/AdminAuthContext';
import { callAdminApi } from '../api/client';

export default function Analytics() {
  const { token } = useAdminAuth();
  const [pageviews, setPageviews] = useState(null);
  const [gaId, setGaId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [pv, settings] = await Promise.all([
        callAdminApi('getPageviews', {}, token),
        callAdminApi('getSettings', {}, token),
      ]);
      if (cancelled) return;
      setPageviews(pv);
      setGaId(settings?.GA_MEASUREMENT_ID || '');
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [token]);

  const dailyData = (pageviews?.daily || []).map((d) => ({
    label: d.date.slice(5),
    value: d.count,
  }));

  return (
    <AdminLayout title="Analytics">
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <StatCard icon={<FiEye />} label="Total Pageviews (tracked)" value={loading ? '…' : (pageviews?.total ?? 0).toLocaleString('en-IN')} accent="text-brand-primary" />
        <div className="bg-white rounded-[1.75rem] border border-slate-100 p-6 shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${gaId ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'}`}>
            {gaId ? <FiCheckCircle /> : <FiAlertCircle />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Google Analytics 4</p>
            <p className="text-sm font-black text-slate-900 mt-1">
              {gaId ? `Connected — ${gaId}` : 'Not configured'}
            </p>
            {gaId ? (
              <a href="https://analytics.google.com/" target="_blank" rel="noreferrer" className="text-xs text-brand-primary font-bold flex items-center gap-1 mt-1">
                Open GA4 Dashboard <FiExternalLink size={12} />
              </a>
            ) : (
              <p className="text-xs text-slate-400 mt-1">Add your Measurement ID in Settings.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.75rem] border border-slate-100 p-6 shadow-sm mb-6">
        <h2 className="font-black uppercase tracking-widest text-xs text-slate-500 mb-6">Pageviews — Last 14 Days</h2>
        {loading ? (
          <div className="h-32 flex items-center justify-center text-slate-300 text-sm">Loading…</div>
        ) : (
          <MiniBarChart data={dailyData} barClassName="bg-brand-primary" />
        )}
      </div>

      <div className="bg-white rounded-[1.75rem] border border-slate-100 p-6 shadow-sm">
        <h2 className="font-black uppercase tracking-widest text-xs text-slate-500 mb-6">Top Pages</h2>
        {loading ? (
          <div className="h-20 flex items-center justify-center text-slate-300 text-sm">Loading…</div>
        ) : (pageviews?.topPages || []).length === 0 ? (
          <p className="text-sm text-slate-400">No pageview data yet.</p>
        ) : (
          <div className="space-y-3">
            {pageviews.topPages.map((p) => (
              <div key={p.path} className="flex items-center justify-between border-b border-slate-50 last:border-0 pb-3 last:pb-0">
                <span className="font-bold text-sm text-slate-700 font-mono">{p.path}</span>
                <span className="font-black text-slate-900 bg-slate-100 rounded-full px-3 py-1 text-xs">{p.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-4">
        "Pageviews (tracked)" is a lightweight built-in counter recorded by this site. For full
        visitor reports (sessions, sources, devices, conversions), use the GA4 dashboard linked above.
      </p>
    </AdminLayout>
  );
}
