/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AkashPhoto from '../assets/Akash.png';
export default function Footer() {
  // Animation settings for the moving text
  const marqueeVariants = {
    animate: {
      x: [0, -1035], // Adjust based on text length
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  return (
    <footer className="bg-white pt-32 pb-10 overflow-hidden border-t border-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* UPPER FOOTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-20">
          {/* Brand Statement */}
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-black text-slate-900 mb-6 leading-tight">
              Crafting the next era of <br />
              <span className="text-brand-primary">digital excellence.</span>
            </h2>
            <p className="text-slate-500 text-sm font-light leading-relaxed">
              SmoothWeb is a multi-disciplinary studio dedicated to elevating creators and businesses through custom portfolios, strategic ads, and professional digital identity.
            </p>
          </div>

          {/* Capabilities Column */}
          <div className="lg:ml-auto">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-8">Capabilities</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-900">
              <li><Link to="/services" className="hover:text-brand-primary transition">Portfolio Design</Link></li>
              <li><Link to="/create" className="hover:text-brand-primary transition">Digital Identity</Link></li>
              <li><Link to="/contact" className="hover:text-brand-primary transition">Ad Strategy</Link></li>
            </ul>
          </div>

          {/* Studio Column */}
          <div className="lg:ml-auto">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-8">Studio</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-900">
              <li><Link to="/about" className="hover:text-brand-primary transition">Our Mission</Link></li>
              <li><Link to="/contact" className="hover:text-brand-primary transition">Consultation</Link></li>
              <li><Link to="/portfolio" className="hover:text-brand-primary transition">Portfolio</Link></li>
              <li><Link to="/book" className="hover:text-brand-primary transition">Book Session</Link></li>
            </ul>
          </div>

          {/* Follow/Social Column */}
          <div className="lg:ml-auto">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-8">Follow</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-900">
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-brand-primary transition">Instagram</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-brand-primary transition">LinkedIn</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-brand-primary transition">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-brand-primary transition">Twitter / X</a></li>
            </ul>
          </div>
        </div>

        {/* MIDDLE FOOTER: THE MOVING WORDMARK */}
        <div className="relative py-10 border-y border-slate-100 flex items-center overflow-hidden whitespace-nowrap select-none pointer-events-none">
          <motion.div 
            className="flex"
            variants={marqueeVariants}
            animate="animate"
          >
            <h1 className="text-[10vw] font-black text-slate-50 leading-none mr-20">
              SMOOTHWEB SMOOTHWEB SMOOTHWEB SMOOTHWEB
            </h1>
            <h1 className="text-[10vw] font-black text-slate-50 leading-none mr-20">
              SMOOTHWEB SMOOTHWEB SMOOTHWEB SMOOTHWEB
            </h1>
          </motion.div>
        </div>

        {/* BOTTOM FOOTER: CREDITS */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10">
          <div className="flex items-center gap-4 mb-6 md:mb-0">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden border border-slate-200">
               {/* Small version of your photo */}
               <img src={AkashPhoto} alt="Akash" className="w-full h-full object-cover scale-150" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Owned & Curated by <span className="text-slate-900">Akash Mandal</span>
            </p>
          </div>

          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © {new Date().getFullYear()} SmoothWeb Studio — India
          </div>
        </div>

      </div>
    </footer>
  );
}