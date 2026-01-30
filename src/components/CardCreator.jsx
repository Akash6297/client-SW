/* eslint-disable react-hooks/static-components */
/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';
import { FiCamera, FiRefreshCw, FiMail, FiPhone, FiDownload, FiSettings, FiBriefcase, FiLayers } from 'react-icons/fi';
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaGithub, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';

export default function CardCreator({ isLoggedIn }) {
  // We use two refs now: one for UI display, one for perfect Download
  const downloadRef = useRef(null);
  
  const [activeSide, setActiveSide] = useState('front'); 
  const [profileImage, setProfileImage] = useState(null);
  const [businessLogo, setBusinessLogo] = useState(null);
  const [useLogoOnFront, setUseLogoOnFront] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [color1, setColor1] = useState('#2563eb'); 
  const [color2, setColor2] = useState('#a855f7'); 
  const [selectedPattern, setSelectedPattern] = useState('network');

  const [socialSlots, setSocialSlots] = useState({
    slot1: 'instagram',
    slot2: 'linkedin'
  });
  
  const [data, setData] = useState({
    name: 'Akash Mandal',
    role: 'Full Stack Developer',
    email: 'akashmandal6297@gmail.com',
    phone: '+91 6297321207',
    bio: 'Passionate Web Developer Creating Digital Experiences.',
    frontQrLink: 'https://smoothweb.in',
    instagram: 'https://instagram.com/akashmandal',
    facebook: 'https://facebook.com/akashmandal',
    linkedin: 'https://linkedin.com/in/akashmandal',
    github: 'https://github.com/akashmandal',
    twitter: 'https://twitter.com/akashmandal',
    whatsapp: 'https://wa.me/916297321207'
  });

  const patterns = {
    network: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 L90 90 M90 10 L10 90 M50 0 L50 100 M0 50 L100 50' stroke='white' stroke-width='1' fill='none' /%3E%3C/svg%3E")`,
    dots: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='white'/%3E%3C/svg%3E")`,
    diagonal: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' stroke='white' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
    clean: 'none'
  };

  const platforms = {
    instagram: { icon: <FaInstagram />, label: 'Instagram' },
    facebook: { icon: <FaFacebookF />, label: 'Facebook' },
    linkedin: { icon: <FaLinkedinIn />, label: 'LinkedIn' },
    github: { icon: <FaGithub />, label: 'GitHub' },
    twitter: { icon: <FaXTwitter />, label: 'X / Twitter' },
    whatsapp: { icon: <FaWhatsapp />, label: 'WhatsApp' }
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') setProfileImage(reader.result);
        else setBusinessLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadCard = async () => {
    if (!isLoggedIn) return alert("🔒 Please login to SmoothWeb to download!");
    setIsDownloading(true);
    
    // We capture the HIDDEN downloadRef instead of the scaled UI ref
    setTimeout(() => {
        toPng(downloadRef.current, { cacheBust: true, pixelRatio: 3, skipFonts: true })
          .then((url) => {
            const link = document.createElement('a');
            link.download = `SmoothWeb-${data.name}-${activeSide}.png`;
            link.href = url;
            link.click();
            setIsDownloading(false);
          }).catch(() => setIsDownloading(false));
    }, 500);
  };

  // Reusable Component for the Card Content to ensure consistency between UI and Download
  const CardContent = () => (
    <div 
        className="w-[500px] h-[300px] rounded-[15px] p-8 relative shadow-2xl overflow-hidden flex flex-col justify-between text-white"
        style={{ background: `linear-gradient(to right, ${color1}, ${color2})` }}
    >
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: patterns[selectedPattern], backgroundSize: selectedPattern === 'dots' ? '20px' : '100px' }}></div>

        {activeSide === 'front' ? (
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/40 bg-white/10 shadow-xl">
                            {profileImage && <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />}
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight leading-none">{data.name}</h1>
                            <p className="text-[11px] font-bold opacity-75 uppercase tracking-[0.2em] mt-2">{data.role}</p>
                        </div>
                    </div>
                    <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center border border-white overflow-hidden">
                        {useLogoOnFront && businessLogo ? <img src={businessLogo} className="w-full h-full object-contain p-2" alt="Logo" /> : <QRCode value={data.frontQrLink} size={50} />}
                    </div>
                </div>
                <div className="text-center px-4">
                    <p className="text-sm font-black italic opacity-95">"{data.bio}"</p>
                </div>
                <div className="flex justify-center items-center gap-8 text-[11px] font-black uppercase tracking-tighter">
                    <div className="flex items-center gap-2"><FiMail /> {data.email}</div>
                    <div className="flex items-center gap-2"><FiPhone /> {data.phone}</div>
                </div>
            </div>
        ) : (
            /* IMPROVED BACK SIDE: Balanced Flex Layout */
            <div className="relative z-10 flex h-full items-center justify-around">
                {/* Left Section: Balanced with more space */}
                <div className="flex flex-col items-center justify-center space-y-6 w-1/2">
                    <div className="text-center font-black tracking-tighter text-3xl leading-none uppercase">
                        <p className="mb-2 text-white/40 text-xs tracking-widest">Connect</p>
                        <p className="text-brand-primary brightness-200">With Me</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="p-3 border-2 border-white/20 rounded-full transition-colors">{platforms[socialSlots.slot1].icon}</div>
                        <div className="p-3 border-2 border-white/20 rounded-full transition-colors">{platforms[socialSlots.slot2].icon}</div>
                    </div>
                </div>

                {/* Right Section: Balanced QR Codes */}
                <div className="flex flex-col items-center justify-center space-y-5 w-1/2">
                    <div className="flex items-center gap-4">
                        <span className="opacity-40 text-xl">{platforms[socialSlots.slot1].icon}</span>
                        <div className="p-2 bg-white rounded-xl shadow-2xl border border-white"><QRCode value={data[socialSlots.slot1]} size={65} /></div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="opacity-40 text-xl">{platforms[socialSlots.slot2].icon}</span>
                        <div className="p-2 bg-white rounded-xl shadow-2xl border border-white"><QRCode value={data[socialSlots.slot2]} size={65} /></div>
                    </div>
                </div>

                <div className="absolute bottom-4 right-6 text-[8px] font-black uppercase tracking-[0.3em] opacity-30">
                    Powered by SMOOTHWEB
                </div>
            </div>
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row pt-20 lg:pt-0">
      
      {/* HIDDEN DOWNLOAD RENDERER: This ensures perfect 1:1 scale download */}
      <div className="absolute -left-[9999px] top-0 pointer-events-none overflow-hidden">
        <div ref={downloadRef}>
          <CardContent />
        </div>
      </div>

      {/* EDITOR PANEL */}
      <div className="w-full lg:w-1/3 bg-white border-r border-slate-200 p-6 md:p-8 lg:h-screen lg:overflow-y-auto order-2 lg:order-1 custom-scrollbar">
        <h2 className="text-2xl font-black mb-2 text-slate-900 flex items-center gap-2">
            <FiSettings className="text-brand-primary" /> Card Architect
        </h2>
        <p className="text-slate-400 text-xs mb-8 font-medium uppercase tracking-widest italic">Design with Precision</p>
        
        {/* UI Controls (Rest of your existing code remains same) */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
            <button onClick={() => setActiveSide('front')} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeSide === 'front' ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-400'}`}>Front View</button>
            <button onClick={() => setActiveSide('back')} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeSide === 'back' ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-400'}`}>Back View</button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Profile Photo</p>
                <label className="relative w-16 h-16 mx-auto rounded-full bg-white border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-brand-primary overflow-hidden">
                    {profileImage ? <img src={profileImage} className="w-full h-full object-cover" /> : <FiCamera className="text-slate-300 text-xl" />}
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'profile')} accept="image/*" />
                </label>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Biz Logo</p>
                <label className="relative w-16 h-16 mx-auto rounded-xl bg-white border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-brand-primary overflow-hidden">
                    {businessLogo ? <img src={businessLogo} className="w-full h-full object-contain p-2" /> : <FiBriefcase className="text-slate-300 text-xl" />}
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} accept="image/*" />
                </label>
            </div>
        </div>

        <div className="mb-8">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Texture Pattern</label>
            <div className="grid grid-cols-4 gap-2">
                {Object.keys(patterns).map(p => (
                    <button key={p} onClick={() => setSelectedPattern(p)} className={`py-2 text-[8px] font-bold rounded-lg border uppercase transition-all ${selectedPattern === p ? 'bg-brand-dark text-white' : 'bg-white text-slate-400'}`}>{p}</button>
                ))}
            </div>
        </div>

        {activeSide === 'back' && (
            <div className="mb-8 p-4 bg-slate-900 rounded-2xl text-white">
                <p className="text-[9px] font-bold text-brand-primary uppercase tracking-[0.3em] mb-4 text-center">Back QR Slots</p>
                <div className="grid grid-cols-2 gap-4">
                    <select value={socialSlots.slot1} onChange={(e) => setSocialSlots({...socialSlots, slot1: e.target.value})} className="bg-slate-800 text-[10px] p-2 rounded-lg w-full border border-slate-700">
                        {Object.keys(platforms).map(k => <option key={k} value={k}>{platforms[k].label}</option>)}
                    </select>
                    <select value={socialSlots.slot2} onChange={(e) => setSocialSlots({...socialSlots, slot2: e.target.value})} className="bg-slate-800 text-[10px] p-2 rounded-lg w-full border border-slate-700">
                        {Object.keys(platforms).map(k => <option key={k} value={k}>{platforms[k].label}</option>)}
                    </select>
                </div>
            </div>
        )}

        <div className="space-y-4">
            <InputGroup label="Name" value={data.name} onChange={(val) => setData({...data, name: val})} />
            <InputGroup label="Expertise" value={data.role} onChange={(val) => setData({...data, role: val})} />
            <InputGroup label="Email" value={data.email} onChange={(val) => setData({...data, email: val})} />
            <InputGroup label="Phone" value={data.phone} onChange={(val) => setData({...data, phone: val})} />
            <InputGroup label="Tagline" value={data.bio} onChange={(val) => setData({...data, bio: val})} />
            <div className="pt-4 flex gap-4">
                <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-full h-8 rounded-lg cursor-pointer border-none" />
                <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-full h-8 rounded-lg cursor-pointer border-none" />
            </div>
        </div>

        <button 
          onClick={downloadCard}
          className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-primary transition-all flex items-center justify-center gap-3"
        >
          {isDownloading ? <FiRefreshCw className="animate-spin" /> : <FiDownload />}
          {isDownloading ? "Synthesizing Image..." : `Export ${activeSide} Canvas`}
        </button>
      </div>

      {/* UI PREVIEW PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-200 order-1 lg:order-2 overflow-hidden">
        <div className="flex items-center gap-2 text-slate-400 mb-8 uppercase tracking-[0.4em] text-[10px] font-bold">
            <FiLayers className="animate-bounce" /> Live Preview Engine
        </div>
        
        <div className="relative transform scale-[0.55] sm:scale-[0.8] md:scale-100 transition-all origin-center">
            <motion.div 
                key={activeSide + selectedPattern}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                className="shadow-2xl rounded-[15px] overflow-hidden"
            >
                <CardContent />
            </motion.div>
        </div>

        <button onClick={() => setActiveSide(activeSide === 'front' ? 'back' : 'front')} className="mt-12 flex items-center gap-3 px-10 py-4 bg-white rounded-full shadow-2xl text-[10px] font-bold uppercase tracking-widest hover:text-brand-primary transition-all group border border-slate-100">
            <FiRefreshCw className="group-hover:rotate-180 transition-transform duration-700" /> Rotate Identity
        </button>
      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange }) {
    return (
        <div className="group">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">{label}</label>
            <input className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:ring-4 ring-brand-primary/10 transition-all text-xs text-slate-900 font-bold" value={value} onChange={(e) => onChange(e.target.value)} />
        </div>
    );
}