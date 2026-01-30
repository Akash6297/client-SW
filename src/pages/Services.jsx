/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { FiGlobe, FiTrendingUp, FiLayers, FiZap, FiCheckCircle } from 'react-icons/fi';
import { HiOutlineLightBulb, HiOutlineDeviceMobile, HiOutlineChartBar } from 'react-icons/hi';

export default function Services() {
  const allServices = [
    {
      title: "Custom Portfolio Websites",
      category: "Creative Strategy",
      icon: <FiGlobe />,
      desc: "We design and develop high-performance, SEO-optimized portfolio websites that serve as your 24/7 digital salesperson. Built with modern tech like React and Tailwind for lightning speed.",
      features: ["UI/UX Prototype", "Responsive Build", "SEO Optimization", "Domain Integration"],
      visual: <PortfolioVisual />
    },
    {
      title: "Ad Growth & Strategy",
      category: "Marketing Engine",
      icon: <FiTrendingUp />,
      desc: "Stop wasting budget on clicks. We build high-conversion ad funnels across Meta and Google to ensure your brand reaches the right audience at the right time.",
      features: ["Campaign Management", "A/B Testing", "Lead Generation", "Monthly Reporting"],
      visual: <AdsVisual />
    },
    {
      title: "Digital Identity Systems",
      category: "Connectivity",
      icon: <FiLayers />,
      desc: "Our professional digital cards are just the entry point. We create unified identity systems that allow you to share your social links, projects, and contact info instantly.",
      features: ["QR Integration", "Instant Updates", "NFC Readiness", "Social Linking"],
      visual: <IdentityVisual />
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-24 text-center lg:text-left">
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6">
                Solutions<span className="text-brand-primary">.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl font-light leading-relaxed">
                We provide the technical and strategic backbone for visionaries who refuse to be average. 
                Explore our three pillars of digital dominance.
            </p>
          </motion.div>
        </header>

        {/* SERVICE GRID */}
        <div className="space-y-32 lg:space-y-48">
          {allServices.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 lg:gap-24 items-center`}
            >
              {/* Content Side */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-brand-primary text-xl">
                        {service.icon}
                    </div>
                    <span className="text-brand-primary font-bold uppercase tracking-[0.2em] text-[10px]">{service.category}</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">{service.title}</h2>
                <p className="text-lg text-slate-500 leading-relaxed mb-10 font-light">{service.desc}</p>
                
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  {service.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-400 group">
                      <FiCheckCircle className="text-brand-primary group-hover:scale-110 transition-transform" /> {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Side */}
              <div className="flex-1 w-full aspect-square md:aspect-video lg:aspect-square relative flex items-center justify-center">
                 {service.visual}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- CUSTOM GRAPHIC COMPONENTS FOR EACH SERVICE --- */

function PortfolioVisual() {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Background Blob */}
            <div className="absolute w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl animate-pulse"></div>
            {/* Floating Website Mockup */}
            <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="relative z-10 w-4/5 h-3/5 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
            >
                <div className="h-6 bg-slate-50 border-b flex gap-1.5 px-4 items-center">
                    <div className="w-2 h-2 rounded-full bg-red-300"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-300"></div>
                    <div className="w-2 h-2 rounded-full bg-green-300"></div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="w-2/3 h-4 bg-slate-100 rounded-full"></div>
                    <div className="w-full h-32 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
                        <FiZap className="text-brand-primary text-3xl opacity-20" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="h-8 bg-blue-50 rounded-lg"></div>
                        <div className="h-8 bg-blue-50 rounded-lg"></div>
                        <div className="h-8 bg-blue-50 rounded-lg"></div>
                    </div>
                </div>
            </motion.div>
            {/* Mobile Mockup Overlay */}
            <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
                className="absolute right-4 bottom-4 w-24 h-44 bg-slate-900 rounded-[2rem] border-[4px] border-white shadow-2xl z-20 flex flex-col items-center p-3"
            >
                <div className="w-8 h-1 bg-slate-800 rounded-full mb-4"></div>
                <div className="w-full h-full bg-slate-800/50 rounded-xl"></div>
            </motion.div>
        </div>
    )
}

function AdsVisual() {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
             <div className="absolute w-72 h-72 bg-blue-500/5 rounded-full blur-[100px]"></div>
             <div className="relative z-10 grid grid-cols-2 gap-4">
                {[1,2,3,4].map(i => (
                    <motion.div 
                        key={i}
                        whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                        className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl shadow-xl border border-slate-50 p-6 flex flex-col justify-between group cursor-default"
                    >
                        <HiOutlineChartBar className={`text-3xl ${i === 3 ? 'text-brand-primary' : 'text-slate-200'}`} />
                        <div className="space-y-2">
                            <div className={`h-2 rounded-full ${i === 3 ? 'w-full bg-brand-primary/20' : 'w-2/3 bg-slate-100'}`}></div>
                            <div className="h-2 w-1/2 bg-slate-100 rounded-full"></div>
                        </div>
                    </motion.div>
                ))}
             </div>
             {/* Floating Target Arrow */}
             <motion.div 
                animate={{ x: [-10, 10, -10], y: [10, -10, 10] }}
                transition={{ repeat: Infinity, duration: 5 }}
                className="absolute top-10 right-10 bg-brand-primary text-white p-4 rounded-2xl shadow-lg z-20"
             >
                <FiTrendingUp className="text-2xl" />
             </motion.div>
        </div>
    )
}

function IdentityVisual() {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-brand-primary/5 rounded-[4rem] rotate-6 scale-90"></div>
            {/* The "Main" Digital Card */}
            <motion.div 
                whileHover={{ rotateY: 15 }}
                className="relative z-10 w-72 h-44 md:w-80 md:h-48 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden"
            >
                <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-white/10 rounded-lg backdrop-blur-md"></div>
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-slate-900 rounded-md"></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-1/2 bg-white/20 rounded-full"></div>
                    <div className="h-3 w-1/3 bg-white/10 rounded-full"></div>
                </div>
                {/* Decoration */}
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-brand-primary opacity-20 blur-2xl rounded-full"></div>
            </motion.div>
            
            {/* Floating Connection Points */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-brand-primary rounded-full animate-ping"></div>
                <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-brand-primary rounded-full animate-ping delay-700"></div>
                <div className="absolute top-1/2 right-10 w-2 h-2 bg-brand-primary rounded-full animate-ping delay-300"></div>
            </div>
        </div>
    )
}