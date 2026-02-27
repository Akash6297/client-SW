/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import profileImg from '../assets/Akash.jpeg'; 

// Clean Social Icon Component
const SocialIcon = ({ href, path }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-brand-primary hover:scale-110 transition-all duration-300"
  >
    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
      <path d={path} />
    </svg>
  </a>
);

export default function About() {
  return (
    <div className="bg-white min-h-screen pt-20 overflow-x-hidden">
      
      {/* --- SECTION 1: MISSION & PURPOSE --- */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="order-2 lg:order-1"
        >
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 border border-blue-100">
            <span className="text-brand-primary font-bold tracking-widest uppercase text-[10px]">
              Our Mission
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight mb-6 md:mb-8">
            The Future of <br />
            <span className="text-brand-primary">Digital Connection.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-8 font-light max-w-xl">
            At SmoothWeb, we believe that professional growth shouldn't be limited by technical complexity. We are here to empower the next generation of creators.
          </p>
          <div className="space-y-6 text-base md:text-lg text-slate-600 border-l-2 border-brand-primary pl-6 md:pl-8">
            <p>
              We created this platform to bridge the gap between talent and representation. Our purpose is to provide every freelancer and small business owner with a "Digital Identity" that commands respect instantly.
            </p>
            <p className="font-medium text-slate-900 italic">
              "We don't just build cards; we build the first impression that changes your career."
            </p>
          </div>
        </motion.div>

        {/* --- SECTION 2: THE FOUNDER (AKASH MANDAL) --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="relative group order-1 lg:order-2"
        >
          {/* Main Visual Card */}
          <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] bg-slate-900 border-8 md:border-[12px] border-white">
            <img 
              src={profileImg} 
              alt="Akash Mandal" 
              className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
            />
            
            {/* NAME & SOCIAL OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-10">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl md:text-4xl font-black text-white mb-1 md:mb-2">Akash Mandal</h2>
                <p className="text-brand-primary font-bold tracking-widest uppercase text-[10px] md:text-xs mb-4 md:mb-6">Founder of SmoothWeb</p>
                
                {/* Social Links */}
                <div className="flex gap-2 md:gap-3">
                  <SocialIcon href="#" path="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  <SocialIcon href="#" path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441c.795 0 1.439-.645 1.439-1.441s-.644-1.44-1.439-1.44z" />
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Subtle Background Art - Hidden on small screens to prevent overflow issues */}
          <div className="hidden md:block absolute -top-12 -left-12 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        </motion.div>
      </section>

      {/* --- SECTION 3: THE PHILOSOPHY --- */}
      <section className="bg-slate-900 py-16 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-brand-primary font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-xs mb-4">Core Values</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white">The Philosophy of SmoothWeb</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <PhilosophyCard 
              num="01"
              title="Identity over Data"
              desc="A standard link is just information. A SmoothWeb card is an identity. We prioritize aesthetics that command trust and authority."
            />
            <PhilosophyCard 
              num="02"
              title="Speed of Connection"
              desc="In a fast-paced world, the faster you connect, the faster you grow. Our tools are optimized for instant sharing and NFC readiness."
            />
            <PhilosophyCard 
              num="03"
              title="Radical Accessibility"
              desc="We remove technical barriers so that high-end design isn't just for the 1%, but for every creator with a dream."
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <footer className="py-16 md:py-24 text-center bg-white relative overflow-hidden px-6">
        <div className="relative z-10">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-6">Ready to lead?</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-brand-dark mb-8 md:mb-10 leading-tight">Join the SmoothWeb ecosystem.</h2>
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/create" 
            className="inline-block px-8 md:px-12 py-4 md:py-6 bg-brand-dark text-white rounded-full font-bold shadow-2xl hover:bg-brand-primary transition-all text-base md:text-lg"
          >
            Create Your Identity
          </motion.a>
        </div>
        {/* Responsive Large faint background text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
          <h1 className="text-[10rem] md:text-[15rem] lg:text-[20rem] font-black">SMOOTH</h1>
        </div>
      </footer>
    </div>
  );
}

// Re-designed Philosophy Card Component
function PhilosophyCard({ num, title, desc }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-slate-800/50 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-700/50 hover:border-brand-primary/50 transition-all group"
    >
      <span className="text-5xl md:text-6xl font-black text-brand-primary/10 group-hover:text-brand-primary/30 transition-colors block mb-4">{num}</span>
      <h4 className="text-xl md:text-2xl font-bold text-white mb-4">{title}</h4>
      <p className="text-slate-400 leading-relaxed font-light text-sm md:text-base">{desc}</p>
    </motion.div>
  );
}