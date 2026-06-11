import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSend, FiPlus, FiEdit2, FiTrash2, FiCheck, FiAlertCircle, FiSearch, FiUsers } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Modal from '../components/Modal';
import MailBodyEditor from '../components/MailBodyEditor';
import MailColorPicker from '../components/MailColorPicker';
import { useAdminAuth } from '../context/AdminAuthContext';
import { callAdminApi } from '../api/client';
import { resolveMergeFields, DEFAULT_MAIL_COLORS } from '../utils/mailMerge';

const emptyTemplate = { name: '', subject: '', body: '', colors: { ...DEFAULT_MAIL_COLORS } };

const parseExtraEmails = (text) =>
  (text || '')
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

export default function Mail() {
  const { token } = useAdminAuth();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState('compose');

  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedClientIds, setSelectedClientIds] = useState([]);
  const [clientSearch, setClientSearch] = useState('');
  const [extraEmails, setExtraEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [colors, setColors] = useState({ ...DEFAULT_MAIL_COLORS });

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
    setClients((clientsData || []).filter((c) => c.Email));
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
    if (c) setSelectedClientIds((prev) => (prev.includes(c.ID) ? prev : [...prev, c.ID]));
  }, [searchParams, clients]);

  const toggleClient = (id) => {
    setSelectedClientIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const filteredClients = useMemo(() => {
    const q = clientSearch.toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => c.Name?.toLowerCase().includes(q) || c.Email?.toLowerCase().includes(q));
  }, [clients, clientSearch]);

  const selectAllFiltered = () => {
    setSelectedClientIds((prev) => {
      const ids = new Set(prev);
      filteredClients.forEach((c) => ids.add(c.ID));
      return Array.from(ids);
    });
  };

  const clearSelection = () => setSelectedClientIds([]);

  // Used for the live preview — the first selected client (if any) stands in
  // for {{client_name}}/{{client_email}}.
  const primaryClient = useMemo(
    () => clients.find((c) => c.ID === selectedClientIds[0]) || null,
    [clients, selectedClientIds]
  );

  const applyTemplate = (id) => {
    setSelectedTemplateId(id);
    if (!id) return;
    const t = templates.find((tpl) => tpl.ID === id);
    if (!t) return;
    const tColors = {
      primary: t.ColorPrimary || DEFAULT_MAIL_COLORS.primary,
      header: t.ColorHeader || DEFAULT_MAIL_COLORS.header,
      text: t.ColorText || DEFAULT_MAIL_COLORS.text,
    };
    setColors(tColors);
    setSubject(resolveMergeFields(t.Subject || '', { client: primaryClient, settings, colors: tColors }));
    setBody(resolveMergeFields(t.Body || '', { client: primaryClient, settings, colors: tColors }));
  };

  const previewHtml = useMemo(
    () => resolveMergeFields(body, { client: primaryClient, settings, colors }),
    [body, primaryClient, settings, colors]
  );

  const recipients = useMemo(() => {
    const list = selectedClientIds
      .map((id) => clients.find((c) => c.ID === id))
      .filter(Boolean)
      .map((c) => ({ to: c.Email, client: c }));

    const extra = parseExtraEmails(extraEmails);
    const seen = new Set(list.map((r) => r.to.toLowerCase()));
    extra.forEach((email) => {
      if (!seen.has(email.toLowerCase())) {
        list.push({ to: email, client: null });
        seen.add(email.toLowerCase());
      }
    });
    return list;
  }, [selectedClientIds, clients, extraEmails]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (recipients.length === 0) {
      setSendResult({ type: 'error', message: 'Select at least one client or enter an email address.' });
      return;
    }
    setSending(true);
    setSendResult(null);
    try {
      if (recipients.length === 1) {
        const r = recipients[0];
        await callAdminApi('sendMail', {
          to: r.to,
          subject: resolveMergeFields(subject, { client: r.client, settings, colors }),
          html: resolveMergeFields(body, { client: r.client, settings, colors }),
        }, token);
        setSendResult({ type: 'success', message: `Email sent to ${r.to}.` });
      } else {
        const messages = recipients.map((r) => ({
          to: r.to,
          subject: resolveMergeFields(subject, { client: r.client, settings, colors }),
          html: resolveMergeFields(body, { client: r.client, settings, colors }),
        }));
        const result = await callAdminApi('sendBulkMail', { messages }, token);
        const results = result?.data || [];
        const failed = results.filter((r) => !r.success);
        if (failed.length === 0) {
          setSendResult({ type: 'success', message: `Email sent to ${results.length} recipients.` });
        } else {
          setSendResult({ type: 'error', message: `Sent ${results.length - failed.length}/${results.length}. Failed: ${failed.map((f) => f.to).join(', ')}` });
        }
      }
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
    setTemplateForm({
      name: t.Name,
      subject: t.Subject,
      body: t.Body,
      colors: {
        primary: t.ColorPrimary || DEFAULT_MAIL_COLORS.primary,
        header: t.ColorHeader || DEFAULT_MAIL_COLORS.header,
        text: t.ColorText || DEFAULT_MAIL_COLORS.text,
      },
    });
    setTemplateModalOpen(true);
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    setSavingTemplate(true);
    try {
      await callAdminApi('saveMailTemplate', {
        id: editingTemplate?.ID,
        name: templateForm.name,
        subject: templateForm.subject,
        body: templateForm.body,
        colorPrimary: templateForm.colors.primary,
        colorHeader: templateForm.colors.header,
        colorText: templateForm.colors.text,
      }, token);
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
    () => resolveMergeFields(templateForm.body, { client: primaryClient, settings, colors: templateForm.colors }),
    [templateForm.body, templateForm.colors, primaryClient, settings]
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
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><FiUsers size={12} /> Recipients ({selectedClientIds.length})</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={selectAllFiltered} className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:underline">Select All</button>
                  <button type="button" onClick={clearSelection} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:underline">Clear</button>
                </div>
              </div>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                <input value={clientSearch} onChange={(e) => setClientSearch(e.target.value)} placeholder="Search clients…" className="w-full bg-slate-50 border border-slate-100 pl-8 pr-3 py-2.5 rounded-xl outline-none text-xs" />
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl max-h-44 overflow-y-auto divide-y divide-slate-100">
                {filteredClients.length === 0 ? (
                  <p className="text-xs text-slate-400 p-3">No clients with an email address.</p>
                ) : filteredClients.map((c) => (
                  <label key={c.ID} className="flex items-center gap-2.5 px-3 py-2 text-xs cursor-pointer hover:bg-white transition-colors">
                    <input type="checkbox" checked={selectedClientIds.includes(c.ID)} onChange={() => toggleClient(c.ID)} className="accent-brand-primary w-3.5 h-3.5" />
                    <span className="font-bold text-slate-700 truncate">{c.Name}</span>
                    <span className="text-slate-400 truncate">{c.Email}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Additional Email(s)</label>
              <textarea
                value={extraEmails}
                onChange={(e) => setExtraEmails(e.target.value)}
                placeholder="one@example.com, another@example.com&#10;(comma or newline separated)"
                rows={5}
                className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-xs font-mono"
              />
              <p className="text-[11px] text-slate-400">
                {recipients.length === 0 ? 'No recipients yet.' : `Sending to ${recipients.length} recipient${recipients.length === 1 ? '' : 's'}.`}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Use Template</label>
            <select value={selectedTemplateId} onChange={(e) => applyTemplate(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold">
              <option value="">— Start from scratch —</option>
              {templates.map((t) => <option key={t.ID} value={t.ID}>{t.Name}</option>)}
            </select>
          </div>

          <MailColorPicker colors={colors} onChange={setColors} />

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
            <FiSend /> {sending ? 'Sending…' : recipients.length > 1 ? `Send to ${recipients.length} Recipients` : 'Send Email'}
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
                  <div className="flex items-center gap-1.5 mb-2">
                    {[t.ColorHeader, t.ColorPrimary, t.ColorText].map((c, i) => (
                      <span key={i} className="w-3.5 h-3.5 rounded-full border border-slate-200" style={{ background: c || '#e2e8f0' }} />
                    ))}
                  </div>
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
            <MailColorPicker colors={templateForm.colors} onChange={(colors) => setTemplateForm({ ...templateForm, colors })} />
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
