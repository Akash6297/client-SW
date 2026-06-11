import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiSearch, FiDollarSign, FiUsers, FiTrello, FiBarChart2,
  FiSettings, FiLogOut, FiMenu, FiX, FiExternalLink, FiMail,
} from 'react-icons/fi';
import { useAdminAuth } from '../context/AdminAuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: <FiGrid />, end: true },
  { to: '/admin/seo', label: 'SEO Manager', icon: <FiSearch /> },
  { to: '/admin/finance', label: 'Finance', icon: <FiDollarSign /> },
  { to: '/admin/clients', label: 'Clients', icon: <FiUsers /> },
  { to: '/admin/projects', label: 'Pipeline', icon: <FiTrello /> },
  { to: '/admin/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
  { to: '/admin/mail', label: 'Mail', icon: <FiMail /> },
  { to: '/admin/settings', label: 'Settings', icon: <FiSettings /> },
];

export default function AdminLayout({ title, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-colors ${
      isActive ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-slate-950 px-4 py-6 gap-1">
        <div className="flex items-center gap-2 px-3 mb-8">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs italic">S</span>
          </div>
          <span className="text-lg font-black tracking-tighter text-white uppercase">
            Admin<span className="text-brand-primary">Panel</span>
          </span>
        </div>

        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-white/5">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
            <FiExternalLink /> View Site
          </a>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-colors">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-slate-950 px-4 py-6 flex flex-col gap-1">
            <div className="flex items-center justify-between px-3 mb-8">
              <span className="text-lg font-black tracking-tighter text-white uppercase">
                Admin<span className="text-brand-primary">Panel</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="text-white p-1"><FiX size={20} /></button>
            </div>
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMobileOpen(false)} className={navLinkClass}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
            <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-white/5">
              <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
                <FiExternalLink /> View Site
              </a>
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-colors">
                <FiLogOut /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-slate-900 p-1">
            <FiMenu size={22} />
          </button>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">{title}</h1>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
