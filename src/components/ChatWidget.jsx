/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/static-components */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageSquare, FiX, FiSend, FiUser, FiMail, 
  FiPhone, FiChevronRight, FiShield, FiStar, FiZap, FiTarget, FiSmartphone, FiClock, FiHelpCircle, FiArrowLeft
} from 'react-icons/fi';

// BROADER KNOWLEDGE ENGINE (More Keywords = More "AI" feel)
const KNOWLEDGE_BASE = [
  { 
    id: "services", 
    label: "Our Services", 
    keywords: ["service", "offer", "do", "provide", "work", "portfolio", "ads", "card"],
    icon: <FiZap />,
    response: "We specialize in 3 areas: \n• High-end React Portfolios \n• Strategic Meta/Google Ad Funnels \n• Premium Digital Identity Cards (NFC Compatible)."
  },
  { 
    id: "pricing", 
    label: "Pricing & Plans", 
    keywords: ["price", "cost", "how much", "rate", "₹", "charge", "pay", "buy", "standard", "premium"],
    icon: <FiStar />,
    response: "Digital Cards: ₹25 (Standard) / ₹40 (Premium). \nConsultation: ₹10 commitment fee. \nCustom Web Projects: Pricing varies based on complexity. Contact us for a quote!"
  },
  { 
    id: "usage", 
    label: "How to use?", 
    keywords: ["use", "share", "how", "nfc", "qr", "work", "scanner", "iphone", "android"],
    icon: <FiSmartphone />,
    response: "Simply scan the QR code on your card to instantly open your links. Our digital cards are also optimized for NFC-enabled devices and work on both iOS and Android."
  },
  { 
    id: "timeline", 
    label: "Delivery Time", 
    keywords: ["time", "fast", "delivery", "when", "days", "long", "ready"],
    icon: <FiClock />,
    response: "Digital Cards are ready instantly! \nCustom Portfolios typically take 7-10 business days. \nAd Campaigns are launched within 48 hours of strategy approval."
  },
  { 
    id: "trust", 
    label: "Security & Refund", 
    keywords: ["trust", "safe", "secure", "legit", "fake", "razorpay", "refund", "money back", "cancel"],
    icon: <FiShield />,
    response: "SmoothWeb is 100% secure. We use Razorpay for all transactions. If your digital card fails to download after payment, contact us for an instant refund or manual delivery."
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
  useEffect(() => { if(isOpen) scrollToBottom(); }, [messages, isTyping, isOpen]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (userData.name && userData.email) {
      setStep('chat');
      setMessages([...messages, { sender: 'bot', text: `Identity Verified. Hello ${userData.name.split(' ')[0]}, I am your digital strategist. How can we scale your vision today?` }]);
    }
  };

  const sendToSheet = async (updatedMessages) => {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyto3jENkXTcAW3FiMxOe4FOKhFKZKcTK2j5ywbFtxdj9Er5UP1gYGe947y0h7TPctf/exec";
    const transcript = updatedMessages.map(m => `${m.sender === 'bot' ? '🤖' : '👤'}: ${m.text}`).join('  |  ');

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userData.name, email: userData.email, phone: userData.phone, convId, transcript })
      });
    } catch (e) { console.error("Sheet Error", e); }
  };

  const processInput = (text) => {
    const lowerText = text.toLowerCase();
    const match = KNOWLEDGE_BASE.find(item => 
      item.keywords.some(keyword => lowerText.includes(keyword))
    );

    if (match) {
      return match.response;
    } else {
      return "I've flagged your specific inquiry for Akash's team. They will analyze your requirement and reach out personally. Would you like to check our predefined solutions instead?";
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
    }, 1000);

    setInputText('');
  };

  return (
    <div className="fixed bottom-24 right-4 sm:bottom-28 sm:right-10 z-[500] font-sans">
      {/* TRIGGER BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border border-white/10 relative group"
      >
        {isOpen ? <FiX size={24} /> : <FiMessageSquare size={26} className="group-hover:rotate-12 transition-transform" />}
        {!isOpen && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-primary rounded-full border-2 border-white animate-bounce"></span>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="absolute bottom-18 right-0 sm:bottom-24 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[85vh] bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-100 flex flex-col"
          >
            {/* PREMIEM HEADER */}
            <div className="bg-slate-900 p-6 sm:p-8 text-white relative shrink-0">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-3xl rounded-full"></div>
               <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"><span className="text-white font-black italic text-lg">S</span></div>
                    <div>
                        <h4 className="font-black tracking-tight text-base leading-none">SmoothWeb AI</h4>
                        <div className="flex items-center gap-1.5 mt-2">
                           <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                           <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Encrypted Session</p>
                        </div>
                    </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors sm:hidden">
                    <FiArrowLeft size={20} />
                  </button>
               </div>
            </div>

            <div className="flex-grow flex flex-col bg-slate-50/30 overflow-hidden h-[400px] sm:h-[480px]">
              {step === 'register' ? (
                <form onSubmit={handleRegister} className="p-8 sm:p-10 space-y-4 flex-grow flex flex-col justify-center">
                   <div className="text-center mb-4">
                      <h5 className="font-bold text-slate-900">Secure Handshake</h5>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Identify yourself to continue</p>
                   </div>
                   <InputBox icon={<FiUser />} placeholder="Full Name" onChange={val => setUserData({...userData, name: val})} />
                   <InputBox icon={<FiMail />} type="email" placeholder="Business Email" onChange={val => setUserData({...userData, email: val})} />
                   <InputBox icon={<FiPhone />} placeholder="Phone (WhatsApp preferred)" onChange={val => setUserData({...userData, phone: val})} />
                   <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-brand-primary transition-all active:scale-95">Enter Strategy Hub</button>
                </form>
              ) : (
                <>
                  <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3.5 sm:p-4 text-sm leading-relaxed shadow-sm ${m.sender === 'user' ? 'bg-brand-primary text-white rounded-t-2xl rounded-bl-2xl font-medium' : 'bg-white text-slate-700 rounded-t-2xl rounded-br-2xl border border-slate-100'}`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && <TypingIndicator />}

                    {!isTyping && messages[messages.length - 1].sender === 'bot' && (
                      <div className="grid grid-cols-1 gap-2 pt-2 pb-4">
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] ml-2 mb-1">Knowledge Paths</p>
                        {KNOWLEDGE_BASE.map(k => (
                          <button 
                            key={k.id} onClick={() => handleUserMessage(k.label, true)}
                            className="flex items-center justify-between w-full p-4 bg-white border border-slate-100 rounded-2xl hover:border-brand-primary group transition-all text-left shadow-sm hover:shadow-md"
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

                  <div className="p-4 sm:p-6 bg-white border-t border-slate-100 flex gap-2 sm:gap-3 shrink-0">
                    <input 
                      value={inputText} onChange={e => setInputText(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && inputText && handleUserMessage(inputText)}
                      placeholder="Ask about price, NFC, etc..." 
                      className="flex-grow p-3 sm:p-4 bg-slate-50 rounded-2xl outline-none text-[13px] font-bold focus:bg-white border border-transparent focus:border-slate-200 transition-all text-slate-900" 
                    />
                    <button onClick={() => inputText && handleUserMessage(inputText)} className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-brand-primary shadow-lg transition-all active:scale-90 shrink-0"><FiSend /></button>
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

// MOBILE-OPTIMIZED INPUT
function InputBox({ icon, placeholder, type="text", onChange }) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</span>
      <input 
        required type={type} placeholder={placeholder} 
        onChange={e => onChange(e.target.value)} 
        className="w-full pl-11 p-3.5 bg-white rounded-xl border border-slate-100 outline-none text-sm focus:ring-4 ring-brand-primary/5 transition-all text-slate-900 placeholder:text-slate-300" 
      />
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