import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import MiniBarChart from '../components/MiniBarChart';
import Modal from '../components/Modal';
import { useAdminAuth } from '../context/AdminAuthContext';
import { callAdminApi } from '../api/client';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../config';

const formatINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
const todayStr = () => new Date().toISOString().slice(0, 10);

const emptyForm = { date: todayStr(), type: 'income', category: INCOME_CATEGORIES[0], description: '', client: '', amount: '' };

function lastNMonths(n) {
  const months = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleString('default', { month: 'short' }) });
  }
  return months;
}

export default function Finance() {
  const { token } = useAdminAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filterType, setFilterType] = useState('all');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await callAdminApi('getFinance', {}, token);
    setEntries((data || []).sort((a, b) => new Date(b.Date) - new Date(a.Date)));
    setLoading(false);
  };

  useEffect(() => { load(); }, [token]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (entry) => {
    setEditing(entry);
    setForm({
      date: entry.Date,
      type: entry.Type,
      category: entry.Category,
      description: entry.Description,
      client: entry.Client,
      amount: entry.Amount,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await callAdminApi('updateFinance', { id: editing.ID, ...form }, token);
      } else {
        await callAdminApi('addFinance', form, token);
      }
      setModalOpen(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    await callAdminApi('deleteFinance', { id }, token);
    await load();
  };

  const totalIncome = entries.filter((e) => e.Type === 'income').reduce((s, e) => s + Number(e.Amount), 0);
  const totalExpense = entries.filter((e) => e.Type === 'expense').reduce((s, e) => s + Number(e.Amount), 0);
  const net = totalIncome - totalExpense;

  const months = lastNMonths(6);
  const trend = months.map((m) => ({
    label: m.label,
    income: entries.filter((e) => e.Type === 'income' && String(e.Date).startsWith(m.key)).reduce((s, e) => s + Number(e.Amount), 0),
    expense: entries.filter((e) => e.Type === 'expense' && String(e.Date).startsWith(m.key)).reduce((s, e) => s + Number(e.Amount), 0),
  }));

  const filtered = filterType === 'all' ? entries : entries.filter((e) => e.Type === filterType);
  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <AdminLayout title="Finance">
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={<FiTrendingUp />} label="Total Income" value={loading ? '…' : formatINR(totalIncome)} accent="text-green-500" />
        <StatCard icon={<FiTrendingDown />} label="Total Expenses" value={loading ? '…' : formatINR(totalExpense)} accent="text-red-500" />
        <StatCard icon={<FiDollarSign />} label="Net Profit" value={loading ? '…' : formatINR(net)} accent="text-brand-primary" />
      </div>

      <div className="bg-white rounded-[1.75rem] border border-slate-100 p-6 shadow-sm mb-6">
        <h2 className="font-black uppercase tracking-widest text-xs text-slate-500 mb-6">Income vs Expenses — Last 6 Months</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-green-500 mb-2">Income</p>
            <MiniBarChart data={trend.map((t) => ({ label: t.label, value: t.income }))} formatValue={formatINR} barClassName="bg-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-2">Expenses</p>
            <MiniBarChart data={trend.map((t) => ({ label: t.label, value: t.expense }))} formatValue={formatINR} barClassName="bg-red-400" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-2">
          {['all', 'income', 'expense'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-colors ${filterType === t ? 'bg-brand-dark text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl hover:brightness-110 transition-all">
          <FiPlus /> Add Entry
        </button>
      </div>

      <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Description</th>
                <th className="px-5 py-4">Client</th>
                <th className="px-5 py-4 text-right">Amount</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-10 text-slate-300">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-slate-300">No entries yet.</td></tr>
              ) : filtered.map((e) => (
                <tr key={e.ID} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-5 py-4 text-slate-500">{e.Date}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${e.Type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {e.Type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-700 font-medium">{e.Category}</td>
                  <td className="px-5 py-4 text-slate-500 max-w-[200px] truncate">{e.Description}</td>
                  <td className="px-5 py-4 text-slate-500">{e.Client}</td>
                  <td className={`px-5 py-4 text-right font-black ${e.Type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                    {e.Type === 'income' ? '+' : '-'}{formatINR(e.Amount)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(e)} className="text-slate-400 hover:text-brand-primary p-1"><FiEdit2 size={14} /></button>
                      <button onClick={() => handleDelete(e.ID)} className="text-slate-400 hover:text-red-500 p-1"><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Entry' : 'Add Entry'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value, category: e.target.value === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0] })}
                  className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Date</label>
                <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Client (optional)</label>
                <input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Amount (₹)</label>
                <input type="number" required min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold" />
              </div>
            </div>

            <button type="submit" disabled={saving} className="w-full py-4 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-brand-primary transition-all disabled:opacity-50">
              {saving ? 'Saving…' : editing ? 'Update Entry' : 'Add Entry'}
            </button>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
