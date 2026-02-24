/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiCheckCircle, FiShield, FiCreditCard, FiZap } from 'react-icons/fi';

export default function Booking() {
  const [selectedService, setSelectedService] = useState('General Consultation');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', date: '', time: '' });

  const services = [
    { title: "Portfolio Strategy", price: "₹10", desc: "Design & Hosting Roadmap" },
    { title: "Ad Growth Engine", price: "₹10", desc: "Scaling Meta & Google Ads" },
    { title: "Digital Identity", price: "₹10", desc: "Business Card Architecture" },
    { title: "General Consultation", price: "₹10", desc: "Ask me anything digital" }
  ];

  // --- RAZORPAY INTEGRATION LOGIC ---
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if(!formData.name || !formData.email || !formData.date) return alert("Please fill all details");

    setLoading(true);
    const res = await loadRazorpay();

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    const options = {
      key: "rzp_live_SC0sXa0djHiAbC", // PASTE YOUR KEY FROM SCREENSHOT HERE
      amount: 1000, // Amount in paise (1000 = ₹10)
      currency: "INR",
      name: "SmoothWeb",
      description: `Consultation for ${selectedService}`,
      image: "/favicon.png",
      handler: function (response) {
        // ON SUCCESS: Send data to your Google Sheet
        saveMeetingToGoogleSheet(response.razorpay_payment_id);
        alert("Payment Successful! Akash will contact you soon.");
      },
      prefill: {
        name: formData.name,
        email: formData.email,
      },
      theme: { color: "#3b82f6" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  const saveMeetingToGoogleSheet = async (payId) => {
     // Use the same SCRIPT_URL we set up for the contact form
     const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwnIHn5oGvhWs5cg5ChyvUbXzha-c13yzTzdoO5GG23QvSHVZ0KjBK1nKC4Sx8JIEGKsw/exec";
     const meetingData = {
        ...formData,
        subject: `PAID CONSULTATION: ${selectedService}`,
        message: `Payment ID: ${payId} | Scheduled for: ${formData.date} at ${formData.time}`
     };
     await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify(meetingData) });
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.span initial={{opacity:0}} animate={{opacity:1}} className="text-brand-primary font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Secure Your Growth</motion.span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">Expert Consultation<span className="text-brand-primary">.</span></h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
            Book a 1-on-1 strategy session with the SmoothWeb team. We help you navigate the digital landscape with precision.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: SERVICE SELECTION (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">1. Select Focus Area</h3>
             <div className="grid md:grid-cols-2 gap-4">
                {services.map((s) => (
                    <button 
                        key={s.title}
                        onClick={() => setSelectedService(s.title)}
                        className={`p-6 rounded-3xl border-2 text-left transition-all duration-500 group ${selectedService === s.title ? 'border-brand-primary bg-blue-50/30' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className={`p-2 rounded-xl transition-colors ${selectedService === s.title ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-400 group-hover:text-brand-primary'}`}><FiZap /></span>
                            <span className="text-lg font-black text-brand-primary">{s.price}</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">{s.title}</h4>
                        <p className="text-sm text-slate-500 font-light mt-1">{s.desc}</p>
                    </button>
                ))}
             </div>

             <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-primary text-2xl"><FiShield /></div>
                <div>
                    <h4 className="font-bold text-slate-900 text-lg">Commitment Protection</h4>
                    <p className="text-slate-500 text-sm font-light">The ₹10 fee ensures we dedicate quality time to your business. 100% professional outcome guaranteed.</p>
                </div>
             </div>
          </div>

          {/* RIGHT: BOOKING FORM (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 blur-3xl rounded-full"></div>
             
             <h3 className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-8">2. Schedule Details</h3>
             
             <form onSubmit={handlePayment} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Your Full Name</label>
                    <input required type="text" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:bg-white/10 outline-none transition-all" placeholder="Akash Mandal" onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
                    <input required type="email" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:bg-white/10 outline-none transition-all" placeholder="akash@company.com" onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Preferred Date</label>
                        <input required type="date" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:bg-white/10 outline-none transition-all text-xs" onChange={e => setFormData({...formData, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Time Slot</label>
                        <select required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:bg-white/10 outline-none transition-all text-xs" onChange={e => setFormData({...formData, time: e.target.value})}>
                            <option className="text-black">10:00 AM</option>
                            <option className="text-black">02:00 PM</option>
                            <option className="text-black">06:00 PM</option>
                        </select>
                    </div>
                </div>

                <div className="pt-6">
                    <button 
                        disabled={loading}
                        className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-white hover:text-brand-primary transition-all duration-500 flex items-center justify-center gap-3"
                    >
                        {loading ? <FiRefreshCw className="animate-spin" /> : <FiCreditCard className="text-lg" />}
                        {loading ? "Initializing..." : `Confirm & Pay ${services.find(s=>s.title===selectedService).price}`}
                    </button>
                    <p className="text-[9px] text-slate-500 text-center mt-4 uppercase tracking-widest">Secure Checkout via Razorpay</p>
                </div>
             </form>
          </div>

        </div>

      </div>
    </div>
  );
}