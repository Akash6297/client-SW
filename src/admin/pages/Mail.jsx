import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSend, FiPlus, FiEdit2, FiTrash2, FiCheck, FiAlertCircle } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Modal from '../components/Modal';
import MailBodyEditor from '../components/MailBodyEditor';
import { useAdminAuth } from '../context/AdminAuthContext';
import { callAdminApi } from '../api/client';
import { resolveMergeFields } from '../utils/mailMerge';

const emptyTemplate = { name: '', subject: '', body: '' };

export default function Mail() {
  const { token } = useAdminAuth();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState('compose');

  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedClientId, setSelectedClientId] = useState('');
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState(emptyTemplate);
  const [savingTemplate, setSavingTemplate] = useState(false);

  const load = async () => {
    setLoading(true);
    const [clientsData, templatesData, settingsData] = await Promise.all([
      callAdminApi('getClients', {}, token),
      callAdminApi('getMailTemplates', {}, token),
      callAdminApi('getSettings', {}, token),
    ]);
    setClients(clientsData || []);
    setTemplates(templatesData || []);
    setSettings(settingsData || {});
    setLoading(false);
  };

  useEffect(() => { load(); }, [token]);

  // Preselect a client when arriving from /admin/clients via "Email" action.
  useEffect(() => {
    const clientId = searchParams.get('client');
    if (!clientId || !clients.length) return;
    const c = clients.find((cl) => cl.ID === clientId);
    if (c) {
      setSelectedClientId(c.ID);
      setTo(c.Email || '');
    }
  }, [searchParams, clients]);

  const selectedClient = clients.find((c) => c.ID === selectedClientId) || null;

  const handleClientChange = (id) => {
    setSelectedClientId(id);
    const c = clients.find((cl) => cl.ID === id);
    setTo(c?.Email || '');
  };

  const applyTemplate = (id) => {
    setSelectedTemplateId(id);
    if (!id) return;
    const t = templates.find((tpl) => tpl.ID === id);
    if (!t) return;
    setSubject(resolveMergeFields(t.Subject || '', { client: selectedClient, settings }));
    setBody(resolveMergeFields(t.Body || '', { client: selectedClient, settings }));
  };

  const previewSubject = useMemo(
    () => resolveMergeFields(subject, { client: selectedClient, settings }),
    [subject, selectedClient, settings]
  );
  const previewHtml = useMemo(
    () => resolveMergeFields(body, { client: selectedClient, settings }),
    [body, selectedClient, settings]
  );

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setSendResult(null);
    try {
      await callAdminApi('sendMail', { to, subject: previewSubject, html: previewHtml }, token);
      setSendResult({ type: 'success', message: `Email sent to ${to}.` });
    } catch (err) {
      setSendResult({ type: 'error', message: err.message });
    } finally {
      setSending(false);
    }
  };

  // ---- Templates tab ----

  const openAddTemplate = () => {
    setEditingTemplate(null);
    setTemplateForm(emptyTemplate);
    setTemplateModalOpen(true);
  };

  const openEditTemplate = (t) => {
    setEditingTemplate(t);
    setTemplateForm({ name: t.Name, subject: t.Subject, body: t.Body });
    setTemplateModalOpen(true);
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    setSavingTemplate(true);
    try {
      await callAdminApi('saveMailTemplate', { id: editingTemplate?.ID, ...templateForm }, token);
      setTemplateModalOpen(false);
      await load();
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!confirm('Delete this template?')) return;
    await callAdminApi('deleteMailTemplate', { id }, token);
    await load();
  };

  const templatePreviewHtml = useMemo(
    () => resolveMergeFields(templateForm.body, { client: selectedClient, settings }),
    [templateForm.body, selectedClient, settings]
  );

  return (
    <AdminLayout title="Mail">
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('compose')} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-colors ${tab === 'compose' ? 'bg-brand-dark text-white' : 'bg-slate-100 text-slate-500'}`}>Compose & Send</button>
        <button onClick={() => setTab('templates')} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-colors ${tab === 'templates' ? 'bg-brand-dark text-white' : 'bg-slate-100 text-slate-500'}`}>Templates</button>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center text-slate-300">Loading…</div>
      ) : tab === 'compose' ? (
        <form onSubmit={handleSend} className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Choose Client (optional)</label>
              <select value={selectedClientId} onChange={(e) => handleClientChange(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold">
                <option value="">— Select a client —</option>
                {clients.map((c) => <option key={c.ID} value={c.ID}>{c.Name}{c.Email ? ` (${c.Email})` : ''}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">To (Email)</label>
              <input type="email" required value={to} onChange={(e) => setTo(e.target.value)} placeholder="client@example.com" className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Use Template</label>
            <select value={selectedTemplateId} onChange={(e) => applyTemplate(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold">
              <option value="">— Start from scratch —</option>
              {templates.map((t) => <option key={t.ID} value={t.ID}>{t.Name}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Subject</label>
            <input required value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Message</label>
            <MailBodyEditor value={body} onChange={setBody} previewHtml={previewHtml} />
          </div>

          {sendResult && (
            <div className={`flex items-center gap-2 text-xs font-bold rounded-xl px-4 py-3 ${sendResult.type === 'success' ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
              {sendResult.type === 'success' ? <FiCheck /> : <FiAlertCircle />} {sendResult.message}
            </div>
          )}

          <button type="submit" disabled={sending} className="flex items-center gap-2 bg-brand-dark text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl hover:bg-brand-primary transition-all disabled:opacity-50">
            <FiSend /> {sending ? 'Sending…' : 'Send Email'}
          </button>
        </form>
      ) : (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={openAddTemplate} className="flex items-center gap-2 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl hover:brightness-110 transition-all">
              <FiPlus /> New Template
            </button>
          </div>
          {templates.length === 0 ? (
            <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm py-16 text-center text-slate-300">No templates yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((t) => (
                <div key={t.ID} className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-5">
                  <p className="font-black text-slate-900 truncate mb-1">{t.Name}</p>
                  <p className="text-xs text-slate-400 truncate mb-4">{t.Subject}</p>
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
                    <button onClick={() => openEditTemplate(t)} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-primary"><FiEdit2 size={12} /> Edit</button>
                    <button onClick={() => handleDeleteTemplate(t.ID)} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-500 ml-auto"><FiTrash2 size={12} /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {templateModalOpen && (
        <Modal title={editingTemplate ? 'Edit Template' : 'New Template'} onClose={() => setTemplateModalOpen(false)} wide>
          <form onSubmit={handleSaveTemplate} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Template Name</label>
                <input required value={templateForm.name} onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                <input required value={templateForm.subject} onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Body (HTML)</label>
              <MailBodyEditor value={templateForm.body} onChange={(v) => setTemplateForm({ ...templateForm, body: v })} previewHtml={templatePreviewHtml} />
            </div>
            <button type="submit" disabled={savingTemplate} className="w-full py-4 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-brand-primary transition-all disabled:opacity-50">
              {savingTemplate ? 'Saving…' : editingTemplate ? 'Update Template' : 'Save Template'}
            </button>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
