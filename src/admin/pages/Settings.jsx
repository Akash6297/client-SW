import React, { useEffect, useState } from 'react';
import { FiSave, FiCheck, FiKey, FiBarChart2, FiBriefcase } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import { useAdminAuth } from '../context/AdminAuthContext';
import { callAdminApi } from '../api/client';

const emptyBranding = {
  BUSINESS_NAME: '', BUSINESS_EMAIL: '', BUSINESS_PHONE: '', BUSINESS_WEBSITE: '',
  BUSINESS_ADDRESS: '', LOGO_URL: '', SOCIAL_INSTAGRAM: '', SOCIAL_FACEBOOK: '',
  SOCIAL_LINKEDIN: '', SOCIAL_TWITTER: '', SOCIAL_YOUTUBE: '',
};

export default function Settings() {
  const { token } = useAdminAuth();
  const [gaId, setGaId] = useState('');
  const [siteName, setSiteName] = useState('');
  const [savingGa, setSavingGa] = useState(false);
  const [gaSaved, setGaSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [branding, setBranding] = useState(emptyBranding);
  const [savingBranding, setSavingBranding] = useState(false);
  const [brandingSaved, setBrandingSaved] = useState(false);

  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    callAdminApi('getSettings', {}, token).then((settings) => {
      setGaId(settings?.GA_MEASUREMENT_ID || '');
      setSiteName(settings?.SITE_NAME || 'SmoothWeb');
      setBranding({
        BUSINESS_NAME: settings?.BUSINESS_NAME || '',
        BUSINESS_EMAIL: settings?.BUSINESS_EMAIL || '',
        BUSINESS_PHONE: settings?.BUSINESS_PHONE || '',
        BUSINESS_WEBSITE: settings?.BUSINESS_WEBSITE || '',
        BUSINESS_ADDRESS: settings?.BUSINESS_ADDRESS || '',
        LOGO_URL: settings?.LOGO_URL || '',
        SOCIAL_INSTAGRAM: settings?.SOCIAL_INSTAGRAM || '',
        SOCIAL_FACEBOOK: settings?.SOCIAL_FACEBOOK || '',
        SOCIAL_LINKEDIN: settings?.SOCIAL_LINKEDIN || '',
        SOCIAL_TWITTER: settings?.SOCIAL_TWITTER || '',
        SOCIAL_YOUTUBE: settings?.SOCIAL_YOUTUBE || '',
      });
      setLoading(false);
    });
  }, [token]);

  const saveGa = async () => {
    setSavingGa(true);
    setGaSaved(false);
    try {
      await callAdminApi('saveSettings', { settings: { GA_MEASUREMENT_ID: gaId, SITE_NAME: siteName } }, token);
      setGaSaved(true);
      setTimeout(() => setGaSaved(false), 2000);
    } finally {
      setSavingGa(false);
    }
  };

  const saveBranding = async () => {
    setSavingBranding(true);
    setBrandingSaved(false);
    try {
      await callAdminApi('saveSettings', { settings: branding }, token);
      setBrandingSaved(true);
      setTimeout(() => setBrandingSaved(false), 2000);
    } finally {
      setSavingBranding(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwMessage('');
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwError('New passwords do not match.');
      return;
    }
    setPwSaving(true);
    try {
      await callAdminApi('changePassword', { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword }, token);
      setPwMessage('Password updated successfully.');
      setPwForm({ oldPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <AdminLayout title="Settings">
      <div className="space-y-8 max-w-2xl">
        <section className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FiBarChart2 className="text-brand-primary" />
            <h2 className="font-black uppercase tracking-widest text-xs text-slate-500">Site & Analytics</h2>
          </div>
          {loading ? (
            <div className="h-20 flex items-center justify-center text-slate-300 text-sm">Loading…</div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Site Name</label>
                <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Google Analytics 4 Measurement ID</label>
                <input value={gaId} onChange={(e) => setGaId(e.target.value)} placeholder="G-XXXXXXXXXX" className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-mono" />
                <p className="text-xs text-slate-400">Find this in Google Analytics under Admin &gt; Data Streams &gt; your stream.</p>
              </div>
              <button onClick={saveGa} disabled={savingGa} className="flex items-center gap-2 bg-brand-dark text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl hover:bg-brand-primary transition-all disabled:opacity-50">
                {gaSaved ? <FiCheck /> : <FiSave />} {savingGa ? 'Saving…' : gaSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          )}
        </section>

        <section className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FiBriefcase className="text-brand-primary" />
            <h2 className="font-black uppercase tracking-widest text-xs text-slate-500">Business & Email Branding</h2>
          </div>
          {loading ? (
            <div className="h-20 flex items-center justify-center text-slate-300 text-sm">Loading…</div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 -mt-2">
                Used to personalize emails sent from <span className="font-bold">Mail</span> — fills in merge fields like
                {' '}<code className="font-mono">{'{{business_name}}'}</code>, <code className="font-mono">{'{{logo_url}}'}</code>, and social links.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Business Name</label>
                  <input value={branding.BUSINESS_NAME} onChange={(e) => setBranding({ ...branding, BUSINESS_NAME: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Reply-To Email</label>
                  <input type="email" value={branding.BUSINESS_EMAIL} onChange={(e) => setBranding({ ...branding, BUSINESS_EMAIL: e.target.value })} placeholder="hello@yourdomain.com" className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Phone</label>
                  <input value={branding.BUSINESS_PHONE} onChange={(e) => setBranding({ ...branding, BUSINESS_PHONE: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Website</label>
                  <input value={branding.BUSINESS_WEBSITE} onChange={(e) => setBranding({ ...branding, BUSINESS_WEBSITE: e.target.value })} placeholder="https://smoothweb.in" className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Address</label>
                  <input value={branding.BUSINESS_ADDRESS} onChange={(e) => setBranding({ ...branding, BUSINESS_ADDRESS: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Logo Image URL</label>
                  <input value={branding.LOGO_URL} onChange={(e) => setBranding({ ...branding, LOGO_URL: e.target.value })} placeholder="https://smoothweb.in/logo512.png" className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-mono" />
                  <p className="text-xs text-slate-400">A publicly accessible image URL — used in the "Logo Header" email block.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Instagram URL</label>
                  <input value={branding.SOCIAL_INSTAGRAM} onChange={(e) => setBranding({ ...branding, SOCIAL_INSTAGRAM: e.target.value })} placeholder="https://instagram.com/yourhandle" className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Facebook URL</label>
                  <input value={branding.SOCIAL_FACEBOOK} onChange={(e) => setBranding({ ...branding, SOCIAL_FACEBOOK: e.target.value })} placeholder="https://facebook.com/yourpage" className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">LinkedIn URL</label>
                  <input value={branding.SOCIAL_LINKEDIN} onChange={(e) => setBranding({ ...branding, SOCIAL_LINKEDIN: e.target.value })} placeholder="https://linkedin.com/company/yourco" className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Twitter / X URL</label>
                  <input value={branding.SOCIAL_TWITTER} onChange={(e) => setBranding({ ...branding, SOCIAL_TWITTER: e.target.value })} placeholder="https://x.com/yourhandle" className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">YouTube URL</label>
                  <input value={branding.SOCIAL_YOUTUBE} onChange={(e) => setBranding({ ...branding, SOCIAL_YOUTUBE: e.target.value })} placeholder="https://youtube.com/@yourchannel" className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm" />
                </div>
              </div>
              <button onClick={saveBranding} disabled={savingBranding} className="flex items-center gap-2 bg-brand-dark text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl hover:bg-brand-primary transition-all disabled:opacity-50">
                {brandingSaved ? <FiCheck /> : <FiSave />} {savingBranding ? 'Saving…' : brandingSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          )}
        </section>

        <section className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FiKey className="text-brand-primary" />
            <h2 className="font-black uppercase tracking-widest text-xs text-slate-500">Change Admin Password</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
              <input type="password" required value={pwForm.oldPassword} onChange={(e) => setPwForm({ ...pwForm, oldPassword: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                <input type="password" required minLength={8} value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                <input type="password" required minLength={8} value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl outline-none text-sm font-bold" />
              </div>
            </div>
            {pwError && <div className="text-red-500 text-xs font-bold bg-red-50 rounded-xl px-4 py-3">{pwError}</div>}
            {pwMessage && <div className="text-green-600 text-xs font-bold bg-green-50 rounded-xl px-4 py-3">{pwMessage}</div>}
            <button type="submit" disabled={pwSaving} className="flex items-center gap-2 bg-brand-dark text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl hover:bg-brand-primary transition-all disabled:opacity-50">
              <FiSave /> {pwSaving ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </section>
      </div>
    </AdminLayout>
  );
}
