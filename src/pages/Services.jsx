/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

export default function Services() {
  const allServices = [
    {
      title: "Custom Portfolio Websites",
      category: "Creative Strategy",
      desc: "We design and develop high-performance, SEO-optimized portfolio websites that serve as your 24/7 digital salesperson. Built with modern tech like React and Tailwind for lightning speed.",
      features: ["UI/UX Prototype", "Responsive Build", "SEO Optimization", "Domain Integration"]
    },
    {
      title: "Ad Growth & Strategy",
      category: "Marketing Engine",
      desc: "Stop wasting budget on clicks. We build high-conversion ad funnels across Meta and Google to ensure your brand reaches the right audience at the right time.",
      features: ["Campaign Management", "A/B Testing", "Lead Generation", "Monthly Reporting"]
    },
    {
      title: "Digital Identity Systems",
      category: "Connectivity",
      desc: "Our professional digital cards are just the entry point. We create unified identity systems that allow you to share your social links, projects, and contact info instantly.",
      features: ["QR Integration", "Instant Updates", "NFC Readiness", "Social Linking"]
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-24 text-center lg:text-left">
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6">Solutions.</h1>
          <p className="text-xl text-slate-500 max-w-2xl font-light">
            We provide the technical and strategic backbone for creators, freelancers, and businesses who refuse to be average.
          </p>
        </header>

        {/* SERVICE GRID */}
        <div className="space-y-32">
          {allServices.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-20 items-center`}
            >
              <div className="flex-1">
                <span className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-4 block">{service.category}</span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">{service.title}</h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">{service.desc}</p>
                <ul className="grid grid-cols-2 gap-4">
                  {service.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm font-bold text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full aspect-video bg-slate-50 rounded-[3rem] border border-slate-100 flex items-center justify-center shadow-inner group overflow-hidden">
                <div className="text-8xl grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110">
                   {index === 0 ? "🌐" : index === 1 ? "📈" : "📇"}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}