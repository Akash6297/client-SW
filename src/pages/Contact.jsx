/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInstagram, FaLinkedinIn, FaFacebookF } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; // Latest X logo

export default function Contact() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // PASTE YOUR GOOGLE SCRIPT URL HERE
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwnIHn5oGvhWs5cg5ChyvUbXzha-c13yzTzdoO5GG23QvSHVZ0KjBK1nKC4Sx8JIEGKsw/exec";

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setStatus("success");
      setFormData({ fullName: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 5000);
    }
  };

  const faqs = [
    {
      q: "How long does a custom portfolio take?",
      a: "Typically, we deliver a fully optimized, premium portfolio within 7–14 business days, depending on the complexity of your projects."
    },
    {
      q: "Do you handle the domain and hosting?",
      a: "Yes. We consult on the best hosting solutions (like Vercel or Render) and help you connect your custom domain so you pay $0 in monthly fees."
    },
    {
      q: "Can I update my digital card after it's made?",
      a: "Absolutely. Once you have an account, you can log in and update your details (phone, role, bio) instantly."
    },
    {
      q: "What is included in an Ad Strategy consultation?",
      a: "We analyze your audience, set up high-conversion funnels on Meta or Google, and provide a roadmap for scaling your brand."
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HERO HEADER --- */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center lg:text-left"
        >
          <span className="text-brand-primary font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">
            Start the Conversation
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
            Let’s Build Your <br />
            <span className="text-brand-primary">Digital Future.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl font-light">
            Whether you need a high-end portfolio, a strategic ad campaign, or a professional identity—we are ready to help you scale.
          </p>
        </motion.header>

        {/* --- MAIN CONTACT SECTION --- */}
        <div className="grid lg:grid-cols-2 gap-20 items-start mb-32">
          
          {/* LEFT: Contact Details & Numbers */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-12"
          >
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-8">Direct Channels</h3>
              <div className="space-y-8">
                <ContactDetail 
                  title="Official Email" 
                  value="hello@smoothweb.in" 
                  sub="Response time: Under 12 hours"
                />
                <ContactDetail 
                  title="Important Number" 
                  value="+91 6297 321 207" 
                  sub="WhatsApp Available (Business Hours)"
                />
                <ContactDetail 
                  title="Founder Direct" 
                  value="akash@smoothweb.in" 
                  sub="For high-ticket partnerships & consulting"
                />
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-6">Social Reach</h3>
            <div className="flex gap-4">
                <SocialLink 
                href="https://instagram.com" 
                icon={<FaInstagram className="text-xl" />} 
                />
                <SocialLink 
                href="https://linkedin.com" 
                icon={<FaLinkedinIn className="text-xl" />} 
                />
                <SocialLink 
                href="https://facebook.com" 
                icon={<FaFacebookF className="text-xl" />} 
                />
                <SocialLink 
                href="https://twitter.com" 
                icon={<FaXTwitter className="text-xl" />} 
                />
            </div>
            </div>
          </motion.div>

          {/* RIGHT: High-End Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-50 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm"
          >
             <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <input required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} type="text" className="w-full p-4 bg-white rounded-2xl border-none focus:ring-4 ring-brand-primary/10 outline-none text-slate-900" />
        </div>
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="email" className="w-full p-4 bg-white rounded-2xl border-none focus:ring-4 ring-brand-primary/10 outline-none text-slate-900" />
        </div>
      </div>
      
      <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Subject</label>
          <input required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} type="text" className="w-full p-4 bg-white rounded-2xl border-none focus:ring-4 ring-brand-primary/10 outline-none text-slate-900" />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
        <textarea required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows="5" className="w-full p-4 bg-white rounded-2xl border-none focus:ring-4 ring-brand-primary/10 outline-none transition-all resize-none"></textarea>
      </div>

      <button disabled={loading} className="w-full py-5 bg-brand-dark text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-brand-primary transition-all disabled:bg-slate-400">
        {loading ? "Sending Strategy..." : status === "success" ? "Message Received!" : "Send Message"}
      </button>
      
      {status === "error" && <p className="text-rose-500 text-[10px] font-bold text-center uppercase">Error sending. Please try again.</p>}
    </form>
          </motion.div>
        </div>

        {/* --- FAQ SECTION --- */}
        <section className="pt-20 border-t border-slate-100">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Common Questions</h2>
            <p className="text-slate-500 font-light">Everything you need to know before we get started.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-slate-100">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full py-6 flex justify-between items-center text-left group"
                >
                  <span className={`text-lg font-bold transition-colors ${activeFaq === i ? 'text-brand-primary' : 'text-slate-700'}`}>
                    {faq.q}
                  </span>
                  <span className={`text-2xl transition-transform duration-300 ${activeFaq === i ? 'rotate-45 text-brand-primary' : 'text-slate-300'}`}>+</span>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 text-slate-500 leading-relaxed font-light">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// Components for Clean Code
function ContactDetail({ title, value, sub }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{value}</p>
      <p className="text-sm text-slate-400 font-medium mt-1">{sub}</p>
    </div>
  );
}

function FormInput({ label, type, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder}
        className="w-full p-4 bg-white rounded-2xl border-none focus:ring-4 ring-brand-primary/10 outline-none transition-all text-slate-900"
      />
    </div>
  );
}

function SocialLink({ href, icon }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer"
      className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-400 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-blue-100 active:scale-90"
    >
      {icon}
    </a>
  );
}