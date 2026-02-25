/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/static-components */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageSquare, FiX, FiSend, FiUser, FiMail, 
  FiPhone, FiChevronRight, FiShield, FiStar, FiZap, FiTarget, FiSearch 
} from 'react-icons/fi';

// ADVANCED KNOWLEDGE ENGINE WITH KEYWORDS
const KNOWLEDGE_BASE = [
  { 
    id: "services", 
    label: "Our Services", 
    keywords: ["service", "offer", "do", "provide", "work"],
    icon: <FiZap />,
    response: "SmoothWeb provides 3 premium pillars: \n• Custom React Portfolios \n• Meta/Google Ad Strategy \n• High-end Digital Identity Cards."
  },
  { 
    id: "pricing", 
    label: "Pricing & Plans", 
    keywords: ["price", "cost", "how much", "rate", "₹", "charge", "pay"],
    icon: <FiStar />,
    response: "Digital Cards: ₹25 (Standard) / ₹40 (Premium). \nFor Custom Portfolios or Ad Strategy, we recommend booking a ₹10 strategy session on our 'Consulting' page."
  },
  { 
    id: "agenda", 
    label: "Why SmoothWeb?", 
    keywords: ["agenda", "mission", "why", "purpose", "goal", "about"],
    icon: <FiTarget />,
    response: "Our agenda is 'Radical Accessibility.' We bridge the gap between high-end digital identity and creators who refuse to be average."
  },
  { 
    id: "trust", 
    label: "Security & Trust", 
    keywords: ["trust", "safe", "secure", "legit", "fake", "razorpay"],
    icon: <FiShield />,
    response: "We are 100% authentic. Transactions are secured by Razorpay. Every project is personally curated by Akash Mandal to ensure top-notch quality."
  }
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('register'); 
  const [convId] = useState(`SW-${Math.floor(Date.now() / 1000)}`);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Welcome to SmoothWeb Intelligence. Please provide your business details to initiate a secure session.' }]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (userData.name && userData.email) {
      setStep('chat');
      setMessages([...messages, { sender: 'bot', text: `Identity Verified. Hello ${userData.name.split(' ')[0]}, I am your digital strategist. How can we scale your vision today?` }]);
    }
  };

  const sendToSheet = async (updatedMessages) => {
    // PASTE YOUR UPDATED WEB APP URL HERE
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyto3jENkXTcAW3FiMxOe4FOKhFKZKcTK2j5ywbFtxdj9Er5UP1gYGe947y0h7TPctf/exec";
    
    // Creates a compact log: 🤖 Hello | 👤 Price? | 🤖 ₹25
    const transcript = updatedMessages.map(m => 
      `${m.sender === 'bot' ? '🤖' : '👤'}: ${m.text}`
    ).join('  |  ');

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Keeps it free and simple
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          convId: convId, 
          transcript: transcript 
        })
      });
    } catch (e) {
      console.error("Sheet Sync Error", e);
    }
  };

  const processInput = (text) => {
    const lowerText = text.toLowerCase();
    
    // Search for matching keywords in Knowledge Base
    const match = KNOWLEDGE_BASE.find(item => 
      item.keywords.some(keyword => lowerText.includes(keyword))
    );

    if (match) {
      return match.response;
    } else {
      return "I've logged your specific query. Akash's team will analyze this and reach out to you personally. In the meantime, would you like to explore these areas?";
    }
  };

  const handleUserMessage = (text, isAuto = false) => {
    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botText = isAuto 
        ? KNOWLEDGE_BASE.find(k => k.label === text).response 
        : processInput(text);

      const newHistory = [...messages, userMsg, { sender: 'bot', text: botText }];
      setMessages(newHistory);
      setIsTyping(false);
      sendToSheet(newHistory);
    }, 1200);

    setInputText('');
  };

  return (
    <div className="fixed bottom-28 right-6 md:right-10 z-[500] font-sans">
      {/* TRIGGER BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border border-white/10 relative group"
      >
        {isOpen ? <FiX size={28} /> : <FiMessageSquare size={28} className="group-hover:rotate-12 transition-transform" />}
        {!isOpen && <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary rounded-full border-4 border-slate-50 animate-bounce"></span>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-24 right-0 w-[340px] sm:w-[420px] bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden border border-slate-100"
          >
            {/* PREMIEM HEADER */}
            <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-3xl rounded-full"></div>
               <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg"><span className="text-white font-black italic text-xl">S</span></div>
                  <div>
                    <h4 className="font-black tracking-tight text-lg leading-none">SmoothWeb AI</h4>
                    <p className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-bold mt-2 flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Virtual Assistant
                    </p>
                  </div>
               </div>
            </div>

            <div className="h-[480px] flex flex-col bg-slate-50/40">
              {step === 'register' ? (
                <form onSubmit={handleRegister} className="p-10 space-y-4 flex-grow flex flex-col justify-center">
                   <div className="text-center mb-4">
                      <h5 className="font-bold text-slate-900">Get Started</h5>
                      <p className="text-xs text-slate-400 mt-1">Unlock tailored digital solutions.</p>
                   </div>
                   <InputBox icon={<FiUser />} placeholder="Full Name" onChange={val => setUserData({...userData, name: val})} />
                   <InputBox icon={<FiMail />} type="email" placeholder="Business Email" onChange={val => setUserData({...userData, email: val})} />
                   <InputBox icon={<FiPhone />} placeholder="Phone Number" onChange={val => setUserData({...userData, phone: val})} />
                   <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-brand-primary transition-all">Begin Interaction</button>
                </form>
              ) : (
                <>
                  {/* CHAT THREAD */}
                  <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 text-sm leading-relaxed shadow-sm ${m.sender === 'user' ? 'bg-brand-primary text-white rounded-t-2xl rounded-bl-2xl font-medium' : 'bg-white text-slate-700 rounded-t-2xl rounded-br-2xl border border-slate-100'}`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && <TypingIndicator />}

                    {/* SUGGESTION PILLS (Shows when Bot just spoke) */}
                    {!isTyping && messages[messages.length - 1].sender === 'bot' && (
                      <div className="grid grid-cols-1 gap-2 pt-2">
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest ml-2 mb-1">Recommended Topics</p>
                        {KNOWLEDGE_BASE.map(k => (
                          <button 
                            key={k.id} onClick={() => handleUserMessage(k.label, true)}
                            className="flex items-center justify-between w-full p-4 bg-white border border-slate-100 rounded-2xl hover:border-brand-primary group transition-all"
                          >
                            <div className="flex items-center gap-3">
                               <span className="text-brand-primary group-hover:scale-110 transition-transform">{k.icon}</span>
                               <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{k.label}</span>
                            </div>
                            <FiChevronRight className="text-slate-300 group-hover:text-brand-primary transition-all" />
                          </button>
                        ))}
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* MESSAGE INPUT */}
                  <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
                    <input 
                      value={inputText} onChange={e => setInputText(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && inputText && handleUserMessage(inputText)}
                      placeholder="Type a query (e.g. Price?)..." 
                      className="flex-grow p-4 bg-slate-50 rounded-2xl outline-none text-xs font-bold focus:bg-white border border-transparent focus:border-slate-200 transition-all text-slate-900" 
                    />
                    <button onClick={() => inputText && handleUserMessage(inputText)} className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-brand-primary shadow-lg transition-all active:scale-90"><FiSend /></button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// SUB-COMPONENTS
function InputBox({ icon, placeholder, type="text", onChange }) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</span>
      <input required type={type} placeholder={placeholder} onChange={e => onChange(e.target.value)} className="w-full pl-12 p-4 bg-white rounded-2xl border border-slate-100 outline-none text-sm focus:ring-4 ring-brand-primary/5 transition-all text-slate-900" />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-1.5 p-3 bg-white border border-slate-100 rounded-2xl w-14">
      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce"></div>
      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
    </div>
  );
}