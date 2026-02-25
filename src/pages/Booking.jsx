/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiZap, FiCheckCircle, FiPhone, FiArrowRight, FiRefreshCw, FiCreditCard, FiAlertCircle, FiMail 
} from 'react-icons/fi';

// PASTE YOUR NEW DEPLOYED URL HERE
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz4qfaB1bXSf7aql0JB0JTVqxzNxNaWAwTXFt6lYXgzMuK_zsLSm6GpMAoeGHtL-QTf/exec";

export default function Booking() {
  const [selectedService, setSelectedService] = useState('Full Strategy Session');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); 
  const [busyKeys, setBusyKeys] = useState([]); 
  const [finalBookingInfo, setFinalBookingInfo] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', date: '', time: '' });

  const services = [
    { title: "Full Strategy Session", price: "49", desc: "Complete 1-on-1 brand Roadmap" },
    { title: "Portfolio Audit", price: "49", desc: "UX & Performance Analysis" },
    { title: "Ad Funnel Setup", price: "49", desc: "Meta/Google Strategy Consult" },
    { title: "Custom Card Build", price: "49", desc: "NFC & Brand Identity sync" }
  ];

  const fetchBookings = useCallback(async () => {
    try {
      // Force cache-busting by adding a timestamp
      const res = await fetch(`${SCRIPT_URL}?t=${Date.now()}`);
      const data = await res.json();
      setBusyKeys(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [formData.date, fetchBookings]); // Refresh keys whenever date changes

  const getAvailableTimeGrid = () => {
    if (!formData.date) return [];
    const day = new Date(formData.date).getDay();
    const isWeekend = (day === 6 || day === 0);
    
    const masterSchedule = isWeekend 
      ? ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]
      : ["08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM", "10:00 PM"];

    return masterSchedule.map(time => {
      // Strict matching: date|TIME (trimmed and uppercased)
      const currentKey = `${formData.date}|${time.trim().toUpperCase()}`;
      const isBooked = busyKeys.includes(currentKey);
      return { time, isBooked };
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if(!formData.time) return alert("Please select a slot");

    setLoading(true);

    // Final real-time check before payment
    const verifyRes = await fetch(`${SCRIPT_URL}?t=${Date.now()}`);
    const latestKeys = await verifyRes.json();
    if(latestKeys.includes(`${formData.date}|${formData.time.toUpperCase()}`)) {
        alert("This slot was just taken. Please select another time.");
        setBusyKeys(latestKeys);
        setLoading(false);
        return;
    }

    const options = {
      key: "rzp_live_SC0sXa0djHiAbC", 
      amount: 4900, 
      currency: "INR",
      name: "SmoothWeb",
      description: `Strategy: ${selectedService}`,
      image: "/favicon.png",
      handler: async function (response) {
        setLoading(true);
        const meetingData = {
            ...formData,
            subject: `PAID SESSION: ${selectedService}`,
            payId: response.razorpay_payment_id 
        };
        
        try {
            await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(meetingData) });
            setFinalBookingInfo(meetingData);
            setLoading(false);
            setShowSuccess(true);
        } catch (error) {
            setLoading(false);
            alert("Payment successful but storage failed. Contact Akash: 6297321207");
        }
      },
      prefill: { name: formData.name, email: formData.email, contact: formData.phone },
      theme: { color: "#2563eb" },
      modal: { ondismiss: () => setLoading(false) }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span initial={{opacity:0}} animate={{opacity:1}} className="text-brand-primary font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block underline">Verified Bookings Only</motion.span>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6 leading-none">Secure Growth<span className="text-brand-primary">.</span></h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
             <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-brand-primary text-white flex items-center justify-center text-2xl shadow-lg shrink-0"><FiZap /></div>
                <div>
                    <h4 className="font-black text-slate-900 text-lg uppercase">Professional Automation</h4>
                    <p className="text-slate-600 text-sm mt-1">Once booked, you will receive an automated email with your Google Meet link instantly.</p>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-4">
                {services.map((s) => (
                    <button key={s.title} onClick={() => setSelectedService(s.title)} className={`p-6 rounded-[2rem] border-2 text-left transition-all ${selectedService === s.title ? 'border-brand-primary bg-white shadow-xl scale-[1.02]' : 'border-slate-100 opacity-60'}`}>
                        <h4 className="font-bold text-slate-900">{s.title}</h4>
                        <p className="font-black text-brand-primary mt-2">₹{s.price}</p>
                    </button>
                ))}
             </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative border border-white/5 overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-3xl rounded-full"></div>
             <form onSubmit={handlePayment} className="space-y-5 relative z-10">
                <InputGroup label="Full Name" type="text" placeholder="Your Name" onChange={v => setFormData({...formData, name: v})} />
                <InputGroup label="Email Address" type="email" placeholder="you@example.com" onChange={v => setFormData({...formData, email: v})} />
                
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative text-slate-900">
                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input required type="tel" placeholder="+91" onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl focus:bg-white/10 outline-none text-white transition-all text-sm font-bold" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Select Date</label>
                    <input required type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:bg-white/10 outline-none text-xs text-white" onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>

                <AnimatePresence>
                  {formData.date && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-primary uppercase tracking-widest ml-1">Available Times</label>
                        <div className="grid grid-cols-2 gap-2">
                            {getAvailableTimeGrid().map((slot, i) => (
                                <button 
                                    type="button" 
                                    disabled={slot.isBooked}
                                    key={i} 
                                    onClick={() => setFormData({...formData, time: slot.time})} 
                                    className={`py-3 rounded-xl text-[10px] font-bold border transition-all relative overflow-hidden
                                        ${slot.isBooked ? 'bg-slate-800 border-transparent text-slate-600 cursor-not-allowed' : 
                                          formData.time === slot.time ? 'bg-brand-primary border-brand-primary shadow-lg' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                                >
                                    {slot.time}
                                    {slot.isBooked && <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-[8px] font-black tracking-widest">LOCKED</span>}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button disabled={loading || !formData.time} className="w-full py-5 mt-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-30">
                    {loading ? <FiRefreshCw className="animate-spin" /> : <FiCreditCard />}
                    {loading ? "Verifying..." : "Book Session"}
                </button>
             </form>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && finalBookingInfo && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[2000] bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-xl w-full">
                    <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                        <FiCheckCircle className="text-5xl text-green-500" />
                    </motion.div>
                    <h2 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter uppercase leading-none">Session Secured!</h2>
                    <p className="text-slate-500 font-medium mb-10">Check your email for the Google Meet link.</p>
                    <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 mb-10 text-left">
                        <p className="text-slate-700 text-lg mb-2 capitalize"><strong>Client:</strong> {finalBookingInfo.name}</p>
                        <p className="text-slate-700 text-lg mb-2"><strong>Schedule:</strong> {finalBookingInfo.time} | {finalBookingInfo.date}</p>
                    </div>
                    <button onClick={() => window.location.reload()} className="px-12 py-5 bg-brand-dark text-white rounded-full font-bold text-lg hover:bg-brand-primary transition-all">Finish</button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputGroup({ label, type, placeholder, onChange }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
            <input required type={type} placeholder={placeholder} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:bg-white/10 outline-none transition-all text-sm text-white font-medium" />
        </div>
    );
}