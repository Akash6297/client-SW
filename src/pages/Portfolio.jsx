/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiStar, FiArrowRight, FiZap, FiShield, FiCode, FiSmartphone } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import sayandipImg from '../assets/sayandip.png';
import udelineImg from '../assets/Udline.png';
export default function Portfolio() {
  const projects = [
    {
      title: "Sayandip Dutta Official",
      category: "Premium Personal Branding",
      image: sayandipImg, // Replace with a screenshot of sayandipdutta.online
      desc: "A high-performance personal portfolio designed for a digital creator. Focused on immersive storytelling and rapid load times.",
      link: "https://sayandipdutta.online/",
      tags: ["React", "Custom UI", "SEO Pro"]
    },
    {
      title: "Udeline Digital Hub",
      category: "Business Ecosystem",
      image: udelineImg, // Replace with a screenshot of udeline.com
      desc: "A scalable business platform built to convert visitors into long-term clients. Features high-converting layouts and minimalist aesthetics.",
      link: "https://udeline.com/",
      tags: ["Scale", "Brand Identity", "UX"]
    }
  ];

  const standards = [
    { icon: <FiZap />, title: "Zero Latency", desc: "We use Vite and React 19 for lightning-fast performance. A site that loads in 0.5s converts 3x better." },
    { icon: <FiCode />, title: "Clean Architecture", desc: "No bloated code. We build with modern Tailwind CSS v4 for pixel-perfect, scalable designs." },
    { icon: <FiSmartphone />, title: "Mobile First", desc: "90% of your clients are on mobile. Our sites are engineered to be 'Thumb-Friendly' and responsive." },
    { icon: <FiShield />, title: "Trust Signals", desc: "We integrate secure gateways and professional SEO meta-tags to ensure your brand is verified by Google." }
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HERO HEADER --- */}
        <header className="mb-24 text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-brand-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Case Studies</span>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
              Built for <br />
              <span className="text-brand-primary">Growth.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl font-light leading-relaxed">
              We don't just build websites; we design digital sales engines. Explore our featured collaborations with industry visionaries.
            </p>
          </motion.div>
        </header>

        {/* --- FEATURED PROJECTS GRID --- */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-40">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-[3rem] bg-slate-100 aspect-video shadow-xl border border-slate-50">
                <img 
                  src={project.image} 
                  alt={`${project.title} - SmoothWeb Project`} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
                   <a href={project.link} target="_blank" rel="noreferrer" className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold flex items-center gap-2 hover:bg-brand-primary hover:text-white transition-all scale-90 group-hover:scale-100">
                      Visit Site <FiExternalLink />
                   </a>
                </div>
              </div>
              <div className="mt-8 px-2">
                 <div className="flex gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-brand-primary px-3 py-1 bg-blue-50 rounded-full">{tag}</span>
                    ))}
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 mb-2">{project.title}</h3>
                 <p className="text-slate-500 font-light leading-relaxed mb-4">{project.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- THE SMOOTHWEB STANDARD (QUALITY SECTION) --- */}
        <section className="py-32 bg-slate-900 rounded-[4rem] px-8 md:px-20 mb-40 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full"></div>
           <div className="relative z-10">
              <div className="max-w-2xl mb-20">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6">The Standard of <span className="text-brand-primary">Excellence.</span></h2>
                <p className="text-slate-400 text-lg font-light">Every project we deploy follows a rigorous quality framework to ensure maximum ROI for our clients.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                 {standards.map((item, i) => (
                    <div key={i} className="space-y-4 group">
                       <div className="text-4xl text-brand-primary group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
                       <h4 className="text-white font-bold text-xl">{item.title}</h4>
                       <p className="text-slate-500 text-sm font-light leading-relaxed">{item.desc}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* --- CALL TO ACTION --- */}
        <section className="text-center py-20">
            <h2 className="text-4xl md:text-7xl font-black text-slate-900 mb-10 tracking-tight">Ready for your <br /> <span className="italic font-light">Digital Flagship?</span></h2>
            <Link to="/book" className="inline-flex items-center gap-3 px-12 py-6 bg-brand-dark text-white rounded-full font-bold text-lg hover:bg-brand-primary transition-all duration-500 shadow-2xl">
                Start My Project <FiArrowRight />
            </Link>
        </section>

        {/* --- HIDDEN SEO BLOCK --- */}
        <section className="sr-only">
           <h2>SmoothWeb Portfolio - High-End React and Tailwind Projects</h2>
           <p>
              Explore flagship projects by Akash Mandal at SmoothWeb, including sayandipdutta.online and udeline.com. 
              We provide professional portfolio design for creators and business hub development for scaling brands. 
              Our tech stack includes React 19, Vite, Tailwind CSS, and SEO-driven architecture. 
              SmoothWeb is dedicated to digital excellence, providing small business owners and freelancers 
              with premium tools like NFC digital business cards and high-conversion ad strategy consulting.
           </p>
        </section>

      </div>
    </div>
  );
}