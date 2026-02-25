/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="bg-white overflow-x-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center px-4 md:px-6 overflow-hidden pt-24 md:pt-20">
        <div className="max-w-6xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-primary font-bold tracking-[0.2em] md:tracking-[0.4em] uppercase text-[9px] md:text-[10px] mb-4 md:mb-6 block">
              Digital Excellence Redefined
            </span>
            
            {/* Optimized Responsive Heading */}
            <h1 className="text-[14vw] sm:text-7xl md:text-8xl lg:text-[9rem] font-black leading-[0.9] tracking-tighter text-slate-900 mb-6 md:mb-8">
              SMOOTH<span className="text-brand-primary">WEB</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-500 max-w-3xl mx-auto font-light leading-relaxed mb-10 md:mb-12 px-4">
              We engineer premium digital ecosystems for the modern visionary. From high-converting portfolios to strategic growth—we build your future.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-6 sm:px-0">
              <Link to="/services" className="px-8 md:px-10 py-4 md:py-5 bg-brand-dark text-white rounded-full font-bold shadow-2xl hover:bg-brand-primary transition-all duration-500 w-full sm:w-auto text-sm md:text-base">
                Explore Our Solutions
              </Link>
              <Link to="/about" className="px-8 md:px-10 py-4 md:py-5 border border-slate-200 rounded-full font-bold hover:bg-slate-50 transition-all w-full sm:w-auto text-sm md:text-base">
                Our Mission
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Decorative Elements - Optimized for Mobile */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 md:w-96 md:h-96 bg-brand-primary/5 rounded-full blur-[80px] md:blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 md:w-96 md:h-96 bg-brand-accent/5 rounded-full blur-[80px] md:blur-[120px] -z-10 animate-pulse"></div>
      </section>

      {/* --- CORE PILLARS SECTION --- */}
      <section className="py-20 md:py-32 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 md:mb-20 gap-6 md:gap-8">
            <h2 className="text-3xl md:text-6xl font-black max-w-2xl leading-tight">
              A multi-disciplinary approach to <span className="text-brand-primary">Growth.</span>
            </h2>
            <p className="text-slate-400 max-w-sm font-light italic text-sm md:text-base">
              "We don't just provide services; we craft the digital infrastructure that allows your business to scale."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-slate-800 border border-slate-800 rounded-2xl md:rounded-3xl overflow-hidden">
            <LandingPillar 
              title="Portfolio Architecture" 
              tag="Design"
              desc="Bespoke show-reels built to convert high-ticket clients."
            />
            <LandingPillar 
              title="Strategic Ad Growth" 
              tag="Marketing"
              desc="Targeted funnels that turn impressions into revenue."
            />
            <LandingPillar 
              title="Digital Identity" 
              tag="Identity"
              desc="Professional connectivity tools for the modern era."
            />
          </div>
        </div>
      </section>

      {/* --- MASSIVE CTA SECTION --- */}
      <section className="py-24 md:py-40 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 mb-8 md:mb-10 tracking-tight leading-tight">
            Ready to become <br className="hidden md:block" /> 
            <span className="italic font-light">digitally dominant?</span>
          </h2>
          <Link to="/contact" className="inline-block px-10 md:px-12 py-5 md:py-6 bg-brand-primary text-white rounded-full font-bold text-lg md:text-xl shadow-2xl hover:scale-105 transition-all w-full sm:w-auto">
            Book a Consultation
          </Link>
        </motion.div>
      </section>

      {/* It provides words for the crawler without affecting your beautiful design */}
      <section className="sr-only">
        <h2>Professional Digital Solutions by Akash Mandal</h2>
        <p>
          SmoothWeb is a premium digital agency specializing in high-performance React portfolios, 
          Meta and Google advertising strategies, and modern digital business cards. 
          Our mission is to provide small business owners, professionals, and content creators 
          with the technical tools needed for digital growth. Whether you need a custom website 
          or a digital identity system, SmoothWeb delivers top-notch quality and responsive design.
        </p>
      </section>
    </div>
  );
}

function LandingPillar({ title, tag, desc }) {
  return (
    <div className="bg-slate-900 p-8 md:p-12 hover:bg-slate-800 transition-all duration-500 group">
      <span className="text-[9px] md:text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] md:tracking-[0.3em] mb-3 md:mb-4 block">{tag}</span>
      <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{title}</h3>
      <p className="text-slate-400 font-light leading-relaxed text-sm md:text-base">{desc}</p>
    </div>
  );
}