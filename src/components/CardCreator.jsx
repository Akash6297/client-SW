/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';

export default function CardCreator({ isLoggedIn }) {
  const cardRef = useRef(null);
  
  const [data, setData] = useState({
    name: 'Akash Mandal',
    role: 'Full Stack Developer',
    email: 'akashmandal6297@gmail.com',
    phone: '+91 6297321207',
    bio: 'Passionate Web Developer Creating Digital Experiences.'
  });

  const [theme, setTheme] = useState('tech-blue');

  const themes = {
    'tech-blue': {
      container: 'bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white',
      accent: 'text-blue-200',
      qrBg: 'bg-white',
      cardStyle: 'font-sans'
    },
    'beauty-pink': {
      container: 'bg-gradient-to-r from-pink-400 via-rose-300 to-slate-50 text-rose-950',
      accent: 'text-rose-700',
      qrBg: 'bg-white/50',
      cardStyle: 'font-serif'
    }
  };

  const downloadCard = () => {
    if (!isLoggedIn) {
      alert("🔒 Please login to SmoothWeb to download your card!");
      return;
    }
    // High quality download settings
    toPng(cardRef.current, { 
        cacheBust: true,
        canvasWidth: 1000, // Double the size for high-res
        canvasHeight: 560
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${data.name}-digital-card.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error('Oops, something went wrong!', err));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row pt-16 lg:pt-0">
      
      {/* LEFT/TOP: Editor Panel */}
      <div className="w-full lg:w-1/3 bg-white border-r border-slate-200 p-6 md:p-8 lg:h-screen lg:overflow-y-auto order-2 lg:order-1">
        <h2 className="text-xl md:text-2xl font-black mb-6 text-slate-900 tracking-tight">Customize Your Identity</h2>
        
        {/* Theme Picker */}
        <div className="mb-8 p-4 bg-slate-50 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Select Visual Theme</p>
          <div className="flex gap-4">
            <button 
              onClick={() => setTheme('tech-blue')}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 border-4 transition-all ${theme === 'tech-blue' ? 'border-brand-primary scale-110 shadow-lg' : 'border-white'}`}
            ></button>
            <button 
              onClick={() => setTheme('beauty-pink')}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-pink-300 border-4 transition-all ${theme === 'beauty-pink' ? 'border-brand-primary scale-110 shadow-lg' : 'border-white'}`}
            ></button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          <div className="group">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
            <input className="w-full p-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-brand-primary focus:ring-4 ring-brand-primary/10 transition-all outline-none" 
              value={data.name} onChange={(e) => setData({...data, name: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Role / Occupation</label>
            <input className="w-full p-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-brand-primary focus:ring-4 ring-brand-primary/10 transition-all outline-none" 
              value={data.role} onChange={(e) => setData({...data, role: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Tagline / Bio</label>
            <textarea className="w-full p-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-brand-primary focus:ring-4 ring-brand-primary/10 transition-all outline-none resize-none h-24" 
              value={data.bio} onChange={(e) => setData({...data, bio: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Email</label>
              <input className="w-full p-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-brand-primary focus:ring-4 ring-brand-primary/10 transition-all outline-none text-sm" 
                value={data.email} onChange={(e) => setData({...data, email: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Phone</label>
              <input className="w-full p-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-brand-primary focus:ring-4 ring-brand-primary/10 transition-all outline-none text-sm" 
                value={data.phone} onChange={(e) => setData({...data, phone: e.target.value})} />
            </div>
          </div>
        </div>

        <button 
          onClick={downloadCard}
          className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-brand-primary transition-all active:scale-95"
        >
          {isLoggedIn ? "Download High-Res Card" : "Login to Download"}
        </button>
      </div>

      {/* RIGHT/BOTTOM: Live Preview Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-10 bg-slate-100 order-1 lg:order-2 overflow-hidden">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-8 lg:mb-12">Live Rendering</p>
        
        {/* RESPONSIVE SCALING WRAPPER */}
        <div className="w-full flex justify-center items-center overflow-visible">
            <div className="relative transform scale-[0.6] sm:scale-[0.8] md:scale-100 transition-transform origin-center">
                <motion.div 
                    layout
                    ref={cardRef}
                    className={`w-[500px] h-[280px] rounded-[32px] p-10 relative shadow-2xl overflow-hidden flex flex-col justify-between ${themes[theme].container} ${themes[theme].cardStyle}`}
                >
                    <div className="flex justify-between items-start relative z-10">
                        <div className="max-w-[70%]">
                            <h1 className="text-3xl font-black tracking-tight leading-tight mb-1">{data.name}</h1>
                            <p className={`text-lg opacity-90 font-medium ${themes[theme].accent}`}>{data.role}</p>
                        </div>
                        <div className={`p-2.5 rounded-2xl shadow-inner ${themes[theme].qrBg}`}>
                            <QRCode value={`https://smoothweb.in/${data.name}`} size={60} />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-sm max-w-[85%] mb-6 italic opacity-80 leading-relaxed">{data.bio}</p>
                        <div className="flex flex-col text-[11px] space-y-1.5 font-mono opacity-90 tracking-tighter">
                            <p className="flex items-center gap-2"><span>✉</span> {data.email}</p>
                            <p className="flex items-center gap-2"><span>✆</span> {data.phone}</p>
                        </div>
                    </div>

                    {/* Brand Decorations */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-black/5 rounded-full blur-2xl"></div>
                </motion.div>
            </div>
        </div>

        <div className="mt-12 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Design by <span className="text-slate-900">SmoothWeb Studio</span>
            </p>
            <p className="text-[9px] font-medium text-slate-300 mt-1 uppercase tracking-tighter">Owner: Akash Mandal</p>
        </div>
      </div>
    </div>
  );
}