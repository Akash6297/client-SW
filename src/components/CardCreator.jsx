/* eslint-disable react-hooks/static-components */
/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';
import { FiCamera, FiRefreshCw, FiMail, FiPhone, FiDownload, FiSettings, FiBriefcase, FiLayers, FiLink, FiType, FiShield, FiZap, FiCopy } from 'react-icons/fi';
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaGithub, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';

export default function CardCreator({ isLoggedIn }) {
  // TWO SEPARATE REFS FOR PERFECT SIMULTANEOUS DOWNLOAD
  const frontDownloadRef = useRef(null);
  const backDownloadRef = useRef(null);
  
  const [activeSide, setActiveSide] = useState('front'); 
  const [profileImage, setProfileImage] = useState(null);
  const [businessLogo, setBusinessLogo] = useState(null);
  const [useLogoOnFront, setUseLogoOnFront] = useState(false); 
  const [isDownloading, setIsDownloading] = useState(false);
  
  // PRICING STATE
  const [pricingTier, setPricingTier] = useState('single'); // 'single' (₹25) or 'dual' (₹40)

  const [color1, setColor1] = useState('#2563eb'); 
  const [color2, setColor2] = useState('#a855f7'); 
  const [selectedPattern, setSelectedPattern] = useState('network');
  const [selectedFont, setSelectedFont] = useState('Modern');

  const [socialSlots, setSocialSlots] = useState({ slot1: 'instagram', slot2: 'linkedin' });
  
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

  const fontFamilies = {
    Modern: 'Inter, system-ui, sans-serif',
    Elegant: 'Georgia, serif',
    Tech: 'ui-monospace, SFMono-Regular, monospace',
    Bold: '"Arial Black", sans-serif',
    Luxury: '"Trebuchet MS", sans-serif'
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

  // --- CORE DUAL-DOWNLOAD LOGIC ---
  const executeDownload = async (ref, fileName) => {
    const url = await toPng(ref.current, { cacheBust: true, pixelRatio: 3, skipFonts: true });
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();
  };

  const startPaymentFlow = async () => {
    if (!isLoggedIn) return alert("🔒 Please login to SmoothWeb!");

    const finalAmount = pricingTier === 'single' ? 2500 : 4000; // in paise

    const options = {
      key: "rzp_live_SC0sXa0djHiAbC", 
      amount: finalAmount, 
      currency: "INR",
      name: "SmoothWeb Digital",
      description: pricingTier === 'single' ? "Standard Front-Side Card" : "Full Dual-Side Premium Card",
      image: "/favicon.png",
      handler: async function (response) {
        setIsDownloading(true);
        try {
            // ALWAYS DOWNLOAD FRONT
            await executeDownload(frontDownloadRef, `SmoothWeb-${data.name}-Front.png`);
            
            // DOWNLOAD BACK IF DUAL PACKAGE BOUGHT
            if (pricingTier === 'dual') {
                setTimeout(async () => {
                    await executeDownload(backDownloadRef, `SmoothWeb-${data.name}-Back.png`);
                }, 800);
            }
        } finally {
            setIsDownloading(false);
        }
      },
      prefill: { name: data.name, email: data.email, contact: data.phone },
      theme: { color: "#2563eb" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // COMPONENT FOR THE ACTUAL CARD DESIGN
  const CardDesign = ({ side, innerRef }) => (
    <div ref={innerRef}
        className="w-[500px] h-[300px] rounded-[15px] p-8 relative shadow-2xl overflow-hidden flex flex-col justify-between text-white"
        style={{ 
            background: `linear-gradient(to right, ${color1}, ${color2})`,
            fontFamily: fontFamilies[selectedFont]
        }}
    >
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: patterns[selectedPattern], backgroundSize: selectedPattern === 'dots' ? '20px' : '100px' }}></div>

        {side === 'front' ? (
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/40 bg-white/10">
                            {profileImage && <img src={profileImage} className="w-full h-full object-cover" alt="P" />}
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">{data.name}</h1>
                            <p className="text-[11px] font-bold opacity-75 uppercase tracking-[0.2em] mt-1">{data.role}</p>
                        </div>
                    </div>
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-white overflow-hidden text-black">
                        {useLogoOnFront && businessLogo ? <img src={businessLogo} className="w-full h-full object-contain p-1" alt="L" /> : <QRCode value={data.frontQrLink} size={50} />}
                    </div>
                </div>
                <div className="text-center px-4"><p className="text-sm font-black italic opacity-95">"{data.bio}"</p></div>
                <div className="flex justify-center items-center gap-8 text-[11px] font-black uppercase tracking-tighter">
                    <div className="flex items-center gap-2"><FiMail /> {data.email}</div>
                    <div className="flex items-center gap-2"><FiPhone /> {data.phone}</div>
                </div>
            </div>
        ) : (
            <div className="relative z-10 flex h-full items-center justify-around">
                <div className="flex flex-col items-center justify-center space-y-6 w-1/2 text-center">
                    <div className="font-black text-3xl leading-none uppercase">
                        <p className="text-white/30 text-[10px] tracking-widest mb-2">Connect</p>
                        <p className="text-brand-primary brightness-200">With Me</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="p-2.5 border-2 border-white/20 rounded-full">{platforms[socialSlots.slot1].icon}</div>
                        <div className="p-2.5 border-2 border-white/20 rounded-full">{platforms[socialSlots.slot2].icon}</div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center space-y-5 w-1/2">
                    <div className="flex items-center gap-4">
                        <span className="opacity-40 text-xl">{platforms[socialSlots.slot1].icon}</span>
                        <div className="p-2 bg-white rounded-xl shadow-2xl border border-white text-black"><QRCode value={data[socialSlots.slot1]} size={65} /></div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="opacity-40 text-xl">{platforms[socialSlots.slot2].icon}</span>
                        <div className="p-2 bg-white rounded-xl shadow-2xl border border-white text-black"><QRCode value={data[socialSlots.slot2]} size={65} /></div>
                    </div>
                </div>
                <div className="absolute bottom-4 right-6 text-[8px] font-black uppercase tracking-[0.3em] opacity-30">Powered by SMOOTHWEB</div>
            </div>
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row pt-20 lg:pt-0">
      
      {/* SHADOW RENDERERS (HIDDEN) */}
      <div className="absolute -left-[9999px] top-0 pointer-events-none">
          <CardDesign side="front" innerRef={frontDownloadRef} />
          <CardDesign side="back" innerRef={backDownloadRef} />
      </div>

      {/* EDITOR PANEL */}
      <div className="w-full lg:w-1/3 bg-white border-r border-slate-200 p-6 md:p-8 lg:h-screen lg:overflow-y-auto order-2 lg:order-1 custom-scrollbar">
        <h2 className="text-2xl font-black mb-2 text-slate-900">Card Architect</h2>
        <p className="text-slate-400 text-xs mb-8 font-medium uppercase tracking-widest">Master Identity Control</p>
        
        {/* PACKAGE SELECTOR */}
        <div className="mb-10 p-5 bg-slate-900 rounded-[2rem] text-white shadow-xl border border-brand-primary/20">
            <p className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.4em] mb-5 text-center">Choose Export Package</p>
            <div className="flex gap-4">
                <button onClick={() => setPricingTier('single')} className={`flex-1 p-4 rounded-2xl border-2 transition-all text-center group ${pricingTier === 'single' ? 'border-brand-primary bg-brand-primary/10' : 'border-white/10'}`}>
                    <FiLayers className={`mx-auto mb-2 text-xl ${pricingTier === 'single' ? 'text-brand-primary' : 'text-slate-500'}`} />
                    <p className="text-xs font-black uppercase">Standard</p>
                    <p className="text-[10px] opacity-40">Front Only</p>
                    <p className="text-lg font-black mt-2 text-brand-primary">₹25</p>
                </button>
                <button onClick={() => setPricingTier('dual')} className={`flex-1 p-4 rounded-2xl border-2 transition-all text-center group relative overflow-hidden ${pricingTier === 'dual' ? 'border-brand-primary bg-brand-primary/10' : 'border-white/10'}`}>
                    <FiCopy className={`mx-auto mb-2 text-xl ${pricingTier === 'dual' ? 'text-brand-primary' : 'text-slate-500'}`} />
                    <p className="text-xs font-black uppercase">Premium</p>
                    <p className="text-[10px] opacity-40">Front + Back</p>
                    <p className="text-lg font-black mt-2 text-brand-primary">₹40</p>
                    <span className="absolute top-2 right-2 text-[6px] bg-brand-primary px-1.5 py-0.5 rounded-full font-bold">BEST</span>
                </button>
            </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
            <button onClick={() => setActiveSide('front')} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all ${activeSide === 'front' ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-400'}`}>Preview Front</button>
            <button onClick={() => setActiveSide('back')} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all ${activeSide === 'back' ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-400'}`}>Preview Back</button>
        </div>

        {/* IMAGE UPLOADS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Profile</p>
                <label className="relative w-16 h-16 mx-auto rounded-full bg-white border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-brand-primary overflow-hidden">
                    {profileImage ? <img src={profileImage} className="w-full h-full object-cover" /> : <FiCamera className="text-slate-300" />}
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'profile')} accept="image/*" />
                </label>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Biz Logo</p>
                <label className="relative w-16 h-16 mx-auto rounded-xl bg-white border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-brand-primary overflow-hidden">
                    {businessLogo ? <img src={businessLogo} className="w-full h-full object-contain p-2" /> : <FiBriefcase className="text-slate-300" />}
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} accept="image/*" />
                </label>
            </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
           <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Front: Show Logo instead of QR?</span>
           <button onClick={() => setUseLogoOnFront(!useLogoOnFront)} className={`w-10 h-5 rounded-full transition-all flex items-center px-1 ${useLogoOnFront ? 'bg-brand-primary' : 'bg-slate-300'}`}>
                <div className={`w-3 h-3 bg-white rounded-full transition-all ${useLogoOnFront ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
        </div>

        {activeSide === 'back' && (
            <div className="mb-8 p-4 bg-slate-100 rounded-2xl border border-slate-200">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">Back QR Slot Mapping</p>
                <div className="grid grid-cols-2 gap-4">
                    <select value={socialSlots.slot1} onChange={(e) => setSocialSlots({...socialSlots, slot1: e.target.value})} className="bg-white text-[10px] p-2 rounded-lg w-full border border-slate-200 outline-none">
                        {Object.keys(platforms).map(k => <option key={k} value={k}>{platforms[k].label}</option>)}
                    </select>
                    <select value={socialSlots.slot2} onChange={(e) => setSocialSlots({...socialSlots, slot2: e.target.value})} className="bg-white text-[10px] p-2 rounded-lg w-full border border-slate-200 outline-none">
                        {Object.keys(platforms).map(k => <option key={k} value={k}>{platforms[k].label}</option>)}
                    </select>
                </div>
            </div>
        )}

        <div className="space-y-4 pb-10">
            <InputGroup label="Identity Name" value={data.name} onChange={(val) => setData({...data, name: val})} />
            <InputGroup label="Current Role" value={data.role} onChange={(val) => setData({...data, role: val})} />
            <InputGroup label="Email Contact" value={data.email} onChange={(val) => setData({...data, email: val})} />
            <InputGroup label="Phone / WhatsApp" value={data.phone} onChange={(val) => setData({...data, phone: val})} />
            {activeSide === 'front' ? (
                <>
                    <InputGroup label="Card Bio" value={data.bio} onChange={(val) => setData({...data, bio: val})} />
                    {!useLogoOnFront && <InputGroup label="Front QR Link" value={data.frontQrLink} onChange={(val) => setData({...data, frontQrLink: val})} />}
                </>
            ) : (
                <>
                    <InputGroup label={`${platforms[socialSlots.slot1].label} Link`} value={data[socialSlots.slot1]} onChange={(val) => setData({...data, [socialSlots.slot1]: val})} />
                    <InputGroup label={`${platforms[socialSlots.slot2].label} Link`} value={data[socialSlots.slot2]} onChange={(val) => setData({...data, [socialSlots.slot2]: val})} />
                </>
            )}
        </div>

        <button 
          onClick={startPaymentFlow}
          disabled={isDownloading}
          className="w-full mt-2 py-5 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-900 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-200"
        >
          {isDownloading ? <FiRefreshCw className="animate-spin" /> : <FiZap className="text-lg animate-pulse" />}
          {isDownloading ? "Synthesizing..." : `Unlock & Download (₹${pricingTier === 'single' ? '25' : '40'})`}
        </button>
      </div>

      {/* PREVIEW SIDE */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-200 order-1 lg:order-2 overflow-hidden">
        
        <div className="flex flex-col md:flex-row gap-6 mb-8 w-full max-w-3xl">
            {/* COLOR DOCK */}
            <div className="flex-1 p-4 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Palette</p>
               <div className="flex gap-6">
                  <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-10 h-10 rounded-full cursor-pointer border-4 border-slate-50 p-0" />
                  <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-10 h-10 rounded-full cursor-pointer border-4 border-slate-50 p-0" />
               </div>
            </div>

            {/* PATTERN DOCK */}
            <div className="flex-1 p-4 bg-white rounded-[2rem] shadow-sm border border-slate-100">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Surface</p>
               <div className="grid grid-cols-4 gap-2">
                  {Object.keys(patterns).map(p => (
                      <button key={p} onClick={() => setSelectedPattern(p)} className={`group relative w-full aspect-square rounded-xl border-2 overflow-hidden transition-all ${selectedPattern === p ? 'border-brand-primary scale-110' : 'border-slate-50'}`}>
                         <div className="absolute inset-0 bg-slate-900" style={{ backgroundImage: patterns[p], backgroundSize: p === 'dots' ? '8px' : '30px' }}></div>
                      </button>
                  ))}
               </div>
            </div>

            {/* TYPOGRAPHY DOCK */}
            <div className="flex-1 p-4 bg-white rounded-[2rem] shadow-sm border border-slate-100">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Typeface</p>
               <select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)} className="w-full bg-slate-50 text-[10px] font-bold p-3 rounded-xl border border-slate-100 outline-none">
                  {Object.keys(fontFamilies).map(f => <option key={f} value={f}>{f}</option>)}
               </select>
            </div>
        </div>
        
        <div className="relative transform scale-[0.55] sm:scale-[0.8] md:scale-100 transition-all origin-center">
            <motion.div key={activeSide + selectedPattern + selectedFont} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} className="shadow-2xl rounded-[15px] overflow-hidden">
                <CardDesign side={activeSide} />
            </motion.div>
        </div>

        <button onClick={() => setActiveSide(activeSide === 'front' ? 'back' : 'front')} className="mt-12 flex items-center gap-3 px-12 py-5 bg-white rounded-full shadow-2xl text-[10px] font-bold uppercase tracking-widest hover:text-brand-primary transition-all group border border-slate-100">
            <FiRefreshCw className="group-hover:rotate-180 transition-transform duration-700 text-lg" /> Flip Perspective
        </button>
      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange }) {
    return (
        <div className="group">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">{label}</label>
            <input className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:ring-4 ring-brand-primary/10 transition-all text-xs text-slate-900 font-bold outline-none" value={value} onChange={(e) => onChange(e.target.value)} />
        </div>
    );
}