import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Modal from '../components/Modal';
import { useAdminAuth } from '../context/AdminAuthContext';
import { callAdminApi } from '../api/client';
import { PIPELINE_STAGES } from '../config';

const formatINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
const emptyForm = { title: '', client: '', stage: PIPELINE_STAGES[0], value: '', dueDate: '', notes: '' };

const STAGE_COLORS = {
  'Inquiry': 'border-t-slate-300',
  'Proposal Sent': 'border-t-amber-400',
  'Booked': 'border-t-blue-400',
  'In Progress': 'border-t-brand-primary',
  'Delivered': 'border-t-purple-400',
  'Paid': 'border-t-green-400',
};

export default function Projects() {
  const { token } = useAdminAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await callAdminApi('getProjects', {}, token);
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [token]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({
      title: project.Title, client: project.Client, stage: project.Stage,
      value: project.Value, dueDate: project.DueDate, notes: project.Notes,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await callAdminApi('updateProject', { id: editing.ID, ...form }, token);
      } else {
        await callAdminApi('addProject', form, token);
      }
      setModalOpen(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await callAdminApi('deleteProject', { id }, token);
    await load();
  };

  const handleStageChange = async (project, stage) => {
    setProjects((prev) => prev.map((p) => (p.ID === project.ID ? { ...p, Stage: stage } : p)));
    await callAdminApi('updateProject', {
      id: project.ID, title: project.Title, client: project.Client, stage,
      value: project.Value, dueDate: project.DueDate, notes: project.Notes,
    }, token);
  };

  return (
    <AdminLayout title="Pipeline">
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-slate-400">Track every project/order from first inquiry to payment.</p>
        <button onClick={openAdd} className="flex items-center gap-2 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl hover:brightness-110 transition-all whitespace-nowrap">
          <FiPlus /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center text-slate-300">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
          {PIPELINE_STAGES.map((stage) => {
            const items = projects.filter((p) => p.Stage === stage);
            const stageValue = items.reduce((s, p) => s + Number(p.Value), 0);
            return (
              <div key={stage} className={`bg-white rounded-[1.5rem] border border-slate-100 border-t-4 ${STAGE_COLORS[stage]} shadow-sm p-4 flex flex-col gap-3 min-h-[200px]`}>
                <div>
                  <p className="font-black text-xs uppercase tracking-widest text-slate-700">{stage}</p>
                  <p className="text-[10px] font-bold text-slate-400">{items.length} · {formatINR(stageValue)}</p>
                </div>
                {items.map((p) => (
                  <div key={p.ID} className="bg-slate-50 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-sm text-slate-900 leading-tight">{p.Title}</p>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => openEdit(p)} className="text-slate-400 hover:text-brand-primary p-1"><FiEdit2 size={12} /></button>
                        <button onClick={() => handleDelete(p.ID)} className="text-slate-400 hover:text-red-500 p-1"><FiTrash2 size={12} /></button>
                      </div>
                    </div>
                    {p.Client && <p className="text-xs text-slate-500">{p.Client}</p>}
                    <div className="flex items-center justify-between">
                      <span className="font-black text-brand-primary text-sm">{formatINR(p.Value)}</span>
                      {p.DueDate && <span className="flex items-center gap-1 text-[10px] text-slate-400"><FiCalendar size={10} /> {p.DueDate}</span>}
                    </div>
                    <select
                      value={p.Stage}
                      onChange={(e) => handleStageChange(p, e.target.value)}
                      className="w-full text-[10px] font-black uppercase tracking-widest bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none"
                    >
                      {PIPELINE_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                ))}
                {items.length === 0 && <p className="text-xs text-slate-300 italic">No projects</p>}
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Project' : 'Add Project'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Project Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Client</label>
              <input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Stage</label>
                <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold">
                  {PIPELINE_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Value (₹)</label>
                <input type="number" min="0" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Due Date</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Notes</label>
              <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
            </div>
            <button type="submit" disabled={saving} className="w-full py-4 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-brand-primary transition-all disabled:opacity-50">
              {saving ? 'Saving…' : editing ? 'Update Project' : 'Add Project'}
            </button>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
