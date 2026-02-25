/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, FiClock, FiShield, FiCreditCard, FiZap, 
  FiAlertCircle, FiCheckCircle, FiX, FiPhone, FiArrowRight, FiRefreshCw 
} from 'react-icons/fi';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwkHLp24O865MWegdTOOZO9hds_E-de2kQCRbJFi5pItFzRR2RWjkFXsWWNpWdrucwYQw/exec";

export default function Booking() {
  const [selectedService, setSelectedService] = useState('Full Strategy Session');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); 
  const [busySlots, setBusySlots] = useState([]);
  const [finalBookingInfo, setFinalBookingInfo] = useState(null); // To store info for success modal
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', date: '', time: '' });

  const services = [
    { title: "Full Strategy Session", price: "49", desc: "Complete 1-on-1 brand Roadmap" },
    { title: "Portfolio Audit", price: "49", desc: "UX & Performance Analysis" },
    { title: "Ad Funnel Setup", price: "49", desc: "Meta/Google Strategy Consult" },
    { title: "Custom Card Build", price: "49", desc: "NFC & Brand Identity sync" }
  ];

  const fetchBusySlots = async () => {
    try {
      const res = await fetch(SCRIPT_URL);
      const data = await res.json();
      setBusySlots(data);
    } catch (err) {
      console.error("Error fetching slots:", err);
    }
  };

  useEffect(() => {
    fetchBusySlots();
  }, []);

  const getTimeSlots = () => {
    if (!formData.date) return [];
    const day = new Date(formData.date).getDay();
    const isWeekend = (day === 6 || day === 0);
    let times = isWeekend 
      ? ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]
      : ["08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM", "10:00 PM"];
    
    return times.filter(t => !busySlots.some(busy => busy.date === formData.date && busy.time === t));
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if(!formData.time) return alert("Please select an available time slot");

    setLoading(true);

    // 1. RE-VERIFY AVAILABILITY IMMEDIATELY
    const verifyRes = await fetch(SCRIPT_URL);
    const latestSlots = await verifyRes.json();
    const isStillAvailable = !latestSlots.some(busy => busy.date === formData.date && busy.time === formData.time);

    if(!isStillAvailable) {
        alert("Sorry! This slot was just booked by someone else. Please choose another time.");
        setBusySlots(latestSlots);
        setLoading(false);
        return;
    }

    const res = await loadRazorpay();
    if (!res) {
        setLoading(false);
        return alert("Razorpay failed to load.");
    }

    const options = {
      key: "rzp_live_SC0sXa0djHiAbC", 
      amount: 100, // ₹49
      currency: "INR",
      name: "SmoothWeb",
      description: `Consultation: ${selectedService}`,
      image: "/favicon.png",
      handler: async function (response) {
        setLoading(true);
        const meetingData = {
            ...formData,
            subject: `PAID SESSION: ${selectedService}`,
            payId: response.razorpay_payment_id 
        };
        
        try {
            // Use no-cors but ensure JSON string is clean
            await fetch(SCRIPT_URL, { 
                method: 'POST', 
                mode: 'no-cors', 
                body: JSON.stringify(meetingData) 
            });
            
            // Set info for success modal then show it
            setFinalBookingInfo(meetingData);
            setLoading(false);
            setShowSuccess(true);
        } catch (error) {
            setLoading(false);
            alert("Error saving booking. Please contact support with Payment ID: " + response.razorpay_payment_id);
        }
      },
      prefill: { 
        name: formData.name, 
        email: formData.email,
        contact: formData.phone 
      },
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
          <motion.span initial={{y:10, opacity:0}} animate={{y:0, opacity:1}} className="text-brand-primary font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Secure Scheduling</motion.span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-none">Book Your Growth<span className="text-brand-primary">.</span></h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
             <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                <div className="w-20 h-20 rounded-3xl bg-brand-primary text-white flex items-center justify-center text-3xl shadow-xl shrink-0"><FiZap /></div>
                <div>
                    <h4 className="font-black text-slate-900 text-xl tracking-tight uppercase">Anti-Conflict System</h4>
                    <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                        Our system verifies slot availability in real-time. Once paid, your slot is instantly removed from the calendar to prevent double-bookings.
                    </p>
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

          <div className="lg:col-span-5 bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative border border-white/5">
             <form onSubmit={handlePayment} className="space-y-5 relative z-10">
                <InputGroup label="Full Name" type="text" placeholder="Enter Name" onChange={v => setFormData({...formData, name: v})} />
                <InputGroup label="Email" type="email" placeholder="email@example.com" onChange={v => setFormData({...formData, email: v})} />
                
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative text-slate-900">
                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input required type="tel" placeholder="+91" onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl focus:bg-white/10 outline-none text-white transition-all text-sm" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Select Date</label>
                    <input required type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:bg-white/10 outline-none text-xs text-white" onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>

                <AnimatePresence>
                  {formData.date && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-primary uppercase tracking-widest ml-1">Available Slots</label>
                        <div className="grid grid-cols-2 gap-2">
                            {getTimeSlots().length > 0 ? getTimeSlots().map(slot => (
                                <button type="button" key={slot} onClick={() => setFormData({...formData, time: slot})} className={`py-3 rounded-xl text-[10px] font-bold border transition-all ${formData.time === slot ? 'bg-brand-primary border-brand-primary shadow-lg' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                                    {slot}
                                </button>
                            )) : <p className="col-span-2 text-[10px] text-rose-400 font-bold bg-rose-400/10 p-3 rounded-xl">Fully Booked</p>}
                        </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button disabled={loading || !formData.time} className="w-full py-5 mt-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-30">
                    {loading ? <FiRefreshCw className="animate-spin" /> : <FiCreditCard />}
                    {loading ? "Confirming Slot..." : "Pay ₹49 & Secure Slot"}
                </button>
             </form>
          </div>
        </div>
      </div>

      {/* --- PROFESSIONAL SUCCESS MODAL --- */}
      <AnimatePresence>
        {showSuccess && finalBookingInfo && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-white flex items-center justify-center p-6 text-center">
                <div className="max-w-xl w-full">
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 100 }} className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10">
                        <FiCheckCircle className="text-5xl text-green-500" />
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Session Secured!</h2>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 mb-10 text-left">
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">Confirmed Appointment Details</p>
                        <p className="text-slate-700 mb-2"><strong>Client:</strong> {finalBookingInfo.name}</p>
                        <p className="text-slate-700 mb-2"><strong>Appointment:</strong> {finalBookingInfo.time} on {finalBookingInfo.date}</p>
                        <p className="text-slate-700 mb-2"><strong>Service:</strong> {selectedService}</p>
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Payment ID:</p>
                          <p className="text-brand-primary font-mono text-xs break-all">{finalBookingInfo.payId}</p>
                        </div>
                    </div>
                    <button onClick={() => window.location.href = "/"} className="w-full sm:w-auto px-12 py-5 bg-brand-dark text-white rounded-full font-bold text-lg hover:bg-brand-primary transition-all shadow-2xl">Return to SmoothWeb</button>
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
            <input required type={type} placeholder={placeholder} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:bg-white/10 outline-none transition-all text-sm text-white placeholder:text-slate-600" />
        </div>
    );
}