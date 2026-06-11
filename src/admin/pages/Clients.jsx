import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiMail, FiPhone, FiSend } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Modal from '../components/Modal';
import { useAdminAuth } from '../context/AdminAuthContext';
import { callAdminApi } from '../api/client';
import { LEAD_STATUSES } from '../config';

const emptyForm = { name: '', email: '', phone: '', status: 'New', source: '', notes: '' };

const STATUS_COLORS = {
  New: 'bg-blue-50 text-blue-600',
  Contacted: 'bg-amber-50 text-amber-600',
  Negotiating: 'bg-purple-50 text-purple-600',
  Converted: 'bg-green-50 text-green-600',
  Lost: 'bg-slate-100 text-slate-400',
};

export default function Clients() {
  const { token } = useAdminAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await callAdminApi('getClients', {}, token);
    setClients((data || []).sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt)));
    setLoading(false);
  };

  useEffect(() => { load(); }, [token]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (client) => {
    setEditing(client);
    setForm({
      name: client.Name, email: client.Email, phone: client.Phone,
      status: client.Status, source: client.Source, notes: client.Notes,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await callAdminApi('updateClient', { id: editing.ID, ...form }, token);
      } else {
        await callAdminApi('addClient', form, token);
      }
      setModalOpen(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this client?')) return;
    await callAdminApi('deleteClient', { id }, token);
    await load();
  };

  const filtered = clients.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.Status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch = !q || c.Name?.toLowerCase().includes(q) || c.Email?.toLowerCase().includes(q) || c.Phone?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout title="Clients & Leads">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setStatusFilter('all')} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-colors ${statusFilter === 'all' ? 'bg-brand-dark text-white' : 'bg-slate-100 text-slate-500'}`}>All</button>
          {LEAD_STATUSES.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-colors ${statusFilter === s ? 'bg-brand-dark text-white' : 'bg-slate-100 text-slate-500'}`}>{s}</button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="bg-slate-100 rounded-full pl-9 pr-4 py-2.5 text-xs font-medium outline-none focus:bg-slate-50 focus:ring-2 focus:ring-brand-primary/20 transition-all" />
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl hover:brightness-110 transition-all whitespace-nowrap">
            <FiPlus /> Add Client
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center text-slate-300">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm py-16 text-center text-slate-300">No clients found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.ID} className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <p className="font-black text-slate-900 truncate">{c.Name}</p>
                  {c.Source && <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">via {c.Source}</p>}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0 ${STATUS_COLORS[c.Status] || 'bg-slate-100 text-slate-400'}`}>{c.Status}</span>
              </div>
              <div className="space-y-1.5 mb-4">
                {c.Email && <p className="flex items-center gap-2 text-xs text-slate-500"><FiMail size={12} /> {c.Email}</p>}
                {c.Phone && <p className="flex items-center gap-2 text-xs text-slate-500"><FiPhone size={12} /> {c.Phone}</p>}
              </div>
              {c.Notes && <p className="text-xs text-slate-400 mb-4 line-clamp-2">{c.Notes}</p>}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
                <button onClick={() => openEdit(c)} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-primary"><FiEdit2 size={12} /> Edit</button>
                {c.Email && (
                  <Link to={`/admin/mail?client=${c.ID}`} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-primary"><FiSend size={12} /> Email</Link>
                )}
                <button onClick={() => handleDelete(c.ID)} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-500 ml-auto"><FiTrash2 size={12} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Client' : 'Add Client'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold">
                  {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Source</label>
                <input value={form.source} placeholder="e.g. Instagram, Referral" onChange={(e) => setForm({ ...form, source: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Notes</label>
              <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
            </div>
            <button type="submit" disabled={saving} className="w-full py-4 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-brand-primary transition-all disabled:opacity-50">
              {saving ? 'Saving…' : editing ? 'Update Client' : 'Add Client'}
            </button>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
