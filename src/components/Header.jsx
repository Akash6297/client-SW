/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Mission', path: '/about' },
    { name: 'Solutions', path: '/services' },
    { name: 'Consulting', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 w-full z-[100] px-6 py-4">
      <nav className="max-w-6xl mx-auto bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-full px-8 h-16 flex justify-between items-center">
        
        {/* BRAND LOGO */}
        <Link to="/" className="group flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center group-hover:bg-brand-primary transition-colors duration-500">
            <span className="text-white font-black text-xs italic">S</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
            Smooth<span className="text-brand-primary">Web</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <NavLink 
              key={link.name} 
              to={link.path} 
              className={({isActive}) => `text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:text-brand-primary ${isActive ? 'text-brand-primary' : 'text-slate-400'}`}
            >
              {link.name}
            </NavLink>
          ))}
          <Link 
            to="/create" 
            className="bg-brand-dark text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-brand-primary transition-all duration-500 shadow-lg shadow-slate-200 hover:shadow-brand-primary/20"
          >
            Get Identity
          </Link>
        </div>

        {/* MOBILE TRIGGER */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-900 p-2">
           <div className="w-6 flex flex-col gap-1.5">
              <span className={`h-0.5 w-full bg-current transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`h-0.5 w-full bg-current transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`h-0.5 w-full bg-current transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
           </div>
        </button>
      </nav>

      {/* MOBILE FULL-SCREEN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-[-1] flex flex-col items-center justify-center p-10"
          >
            <div className="flex flex-col gap-8 text-center">
              {links.map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="text-4xl font-black text-slate-900 hover:text-brand-primary transition-colors">
                  {link.name}
                </Link>
              ))}
              <Link to="/create" onClick={() => setIsOpen(false)} className="mt-4 text-brand-primary font-bold border-b-2 border-brand-primary text-xl">
                Start My Project
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}