import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers, FiTrello, FiArrowRight } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import MiniBarChart from '../components/MiniBarChart';
import { useAdminAuth } from '../context/AdminAuthContext';
import { callAdminApi } from '../api/client';
import { PIPELINE_STAGES } from '../config';

function lastNMonths(n) {
  const months = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleString('default', { month: 'short' }) });
  }
  return months;
}

export default function Dashboard() {
  const { token } = useAdminAuth();
  const [finance, setFinance] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [financeData, clientsData, projectsData] = await Promise.all([
          callAdminApi('getFinance', {}, token),
          callAdminApi('getClients', {}, token),
          callAdminApi('getProjects', {}, token),
        ]);
        if (cancelled) return;
        setFinance(financeData || []);
        setClients(clientsData || []);
        setProjects(projectsData || []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const totalIncome = finance.filter((f) => f.Type === 'income').reduce((sum, f) => sum + Number(f.Amount), 0);
  const totalExpense = finance.filter((f) => f.Type === 'expense').reduce((sum, f) => sum + Number(f.Amount), 0);
  const netProfit = totalIncome - totalExpense;
  const pipelineValue = projects
    .filter((p) => p.Stage !== 'Paid')
    .reduce((sum, p) => sum + Number(p.Value), 0);

  const months = lastNMonths(6);
  const monthlyIncome = months.map((m) => ({
    label: m.label,
    value: finance
      .filter((f) => f.Type === 'income' && String(f.Date).startsWith(m.key))
      .reduce((sum, f) => sum + Number(f.Amount), 0),
  }));

  const stageCounts = PIPELINE_STAGES.map((stage) => ({
    stage,
    count: projects.filter((p) => p.Stage === stage).length,
  }));

  const recentLeads = [...clients]
    .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt))
    .slice(0, 5);

  const formatINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

  return (
    <AdminLayout title="Dashboard">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl px-5 py-4">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FiTrendingUp />} label="Total Income" value={loading ? '…' : formatINR(totalIncome)} accent="text-green-500" />
        <StatCard icon={<FiTrendingDown />} label="Total Expenses" value={loading ? '…' : formatINR(totalExpense)} accent="text-red-500" />
        <StatCard icon={<FiDollarSign />} label="Net Profit" value={loading ? '…' : formatINR(netProfit)} accent="text-brand-primary" />
        <StatCard icon={<FiUsers />} label="Total Leads" value={loading ? '…' : clients.length} accent="text-brand-accent" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[1.75rem] border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black uppercase tracking-widest text-xs text-slate-500">Income — Last 6 Months</h2>
            <Link to="/admin/finance" className="text-brand-primary text-xs font-bold flex items-center gap-1">View Finance <FiArrowRight /></Link>
          </div>
          {loading ? (
            <div className="h-32 flex items-center justify-center text-slate-300 text-sm">Loading…</div>
          ) : (
            <MiniBarChart data={monthlyIncome} formatValue={formatINR} barClassName="bg-green-400" />
          )}
        </div>

        <div className="bg-white rounded-[1.75rem] border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black uppercase tracking-widest text-xs text-slate-500">Pipeline</h2>
            <Link to="/admin/projects" className="text-brand-primary text-xs font-bold flex items-center gap-1"><FiTrello /></Link>
          </div>
          <p className="text-2xl font-black text-slate-900 mb-1">{formatINR(pipelineValue)}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Active pipeline value</p>
          <div className="space-y-2">
            {stageCounts.map((s) => (
              <div key={s.stage} className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600">{s.stage}</span>
                <span className="font-black text-slate-900 bg-slate-100 rounded-full px-2.5 py-0.5">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-[1.75rem] border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black uppercase tracking-widest text-xs text-slate-500">Recent Leads</h2>
          <Link to="/admin/clients" className="text-brand-primary text-xs font-bold flex items-center gap-1">View Clients <FiArrowRight /></Link>
        </div>
        {loading ? (
          <div className="h-20 flex items-center justify-center text-slate-300 text-sm">Loading…</div>
        ) : recentLeads.length === 0 ? (
          <p className="text-sm text-slate-400">No leads yet.</p>
        ) : (
          <div className="space-y-3">
            {recentLeads.map((c) => (
              <div key={c.ID} className="flex items-center justify-between border-b border-slate-50 last:border-0 pb-3 last:pb-0">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{c.Name}</p>
                  <p className="text-xs text-slate-400">{c.Email || c.Phone}</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 rounded-full px-3 py-1">{c.Status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
