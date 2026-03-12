import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import {
  FiGlobe, FiTrendingUp, FiLayers, FiZap, FiCheckCircle, FiShield,
  FiSearch, FiPenTool, FiCode
} from 'react-icons/fi';

export default function Landing() {
  return (
    <div className="bg-white overflow-x-hidden mesh-gradient">
      <SEOHead
        title="SmoothWeb | Portfolio Website Design & Digital Marketing Agency India"
        description="SmoothWeb is the premier agency for portfolio website design, creative branding, and digital marketing in India. We build high-converting portfolios and ad funnels for visionaries."
        url="https://smoothweb.in/"
      />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 md:px-6 overflow-hidden pt-32 md:pt-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <span className="text-brand-primary font-bold tracking-[0.2em] md:tracking-[0.4em] uppercase text-[10px] mb-6 block drop-shadow-sm">
              Digital Excellence Redefined
            </span>

            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black leading-[0.9] tracking-tighter text-slate-900 mb-8">
              <span className="sr-only">SmoothWeb - Best Portfolio Website Design & Digital Marketing Agency India - </span>
              SMOOTH<span className="text-brand-primary text-glow">WEB</span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-500 max-w-2xl lg:mx-0 mx-auto font-light leading-relaxed mb-10">
              We engineer premium digital ecosystems for the modern visionary. From <span className="text-slate-900 font-medium">high-converting portfolios</span> to <span className="text-slate-900 font-medium">strategic growth</span>—we build your future.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-6">
              <Link to="/services" className="px-10 py-5 bg-brand-dark text-white rounded-full font-bold shadow-2xl hover:bg-brand-primary transition-all duration-500 w-full sm:w-auto text-sm md:text-base premium-shadow">
                Explore Our Solutions
              </Link>
              <Link to="/create" className="px-10 py-5 border-2 border-slate-200 rounded-full font-bold hover:bg-slate-50 transition-all w-full sm:w-auto text-sm md:text-base">
                Get Your Digital Identity
              </Link>
            </div>
          </motion.div>

          {/* Visual Hero Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-[100px] animate-pulse"></div>
              {/* Floating Card Mockup */}
              <motion.div
                animate={{ y: [0, -20, 0], rotateZ: [5, 7, 5] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute top-10 left-20 w-80 h-48 bg-slate-900 rounded-3xl p-6 shadow-2xl border border-white/10 glass-card rotate-[5deg]"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-10 h-10 bg-white/10 rounded-lg"></div>
                  <FiZap className="text-brand-primary text-2xl" />
                </div>
                <div className="h-4 w-3/4 bg-white/20 rounded-full mb-3"></div>
                <div className="h-4 w-1/2 bg-white/10 rounded-full"></div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0], rotateZ: [-5, -3, -5] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 right-0 w-80 h-48 bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 rotate-[-5deg]"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
                  <FiTrendingUp className="text-brand-primary text-2xl" />
                </div>
                <div className="h-4 w-3/4 bg-slate-100 rounded-full mb-3"></div>
                <div className="h-4 w-1/2 bg-slate-50 rounded-full"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SERVICES SHOWCASE --- */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-4 block">The Pillars of Success</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">What We Offer<span className="text-brand-primary">.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <ServiceCard
                icon={<FiGlobe />}
                title="Portfolio Architecture"
                features={["Custom React Builds", "High-Ticket Conversion", "SEO Core Framework"]}
                desc="Bespoke show-reels built to command authority and turn talent into a brand."
                color="bg-blue-50"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <ServiceCard
                icon={<FiLayers />}
                title="NFC Digital Cards"
                features={["Tap-to-Share Tech", "Dynamic Dashboard", "QR Cloud Sync"]}
                desc="The ultimate networking tool. Share your social links and portfolio in a single tap."
                color="bg-purple-50"
                isHot={true}
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <ServiceCard
                icon={<FiTrendingUp />}
                title="Ad Strategy & ROI"
                features={["Meta/Google Funnels", "High-Retention Content", "Weekly Analytics"]}
                desc="Strategic marketing engines that turn cold impressions into high-ticket leads."
                color="bg-slate-50"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- SPECIAL OFFER: THE BUNDLE --- */}
      <section className="py-24 md:py-32 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 text-center lg:text-left"
            >
              <span className="inline-block px-4 py-1 bg-brand-primary/20 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-brand-primary/30">Limited Offer</span>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">The Digital Identity <br /><span className="text-brand-primary italic">Power Bundle.</span></h2>
              <p className="text-slate-400 text-lg mb-10 font-light max-w-xl">Get a Premium Custom Portfolio + A Verified NFC Digital Card at 30% off. Secure your entire digital presence in one go.</p>
              <Link to="/book" className="inline-flex items-center gap-3 px-10 py-5 bg-brand-primary text-white rounded-full font-bold shadow-2xl hover:scale-105 transition-all">
                Claim Offer Now <FiZap />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 bg-white/5 backdrop-blur-md rounded-[3rem] p-10 border border-white/10"
            >
              <ul className="space-y-6">
                <BundleItem text="Custom Domain Integration" />
                <BundleItem text="5-Day Delivery Sprint" />
                <BundleItem text="NFC Hardware Included" />
                <BundleItem text="Life-time Dashboard Access" />
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- PROCESS SECTION --- */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">Our Blueprint<span className="text-brand-primary">.</span></h2>
            <p className="text-slate-500 font-light text-lg">Four steps from ideation to digital dominance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <ProcessStep num="01" icon={<FiSearch />} title="Discovery" desc="We analyze your brand, goals, and target audience." />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <ProcessStep num="02" icon={<FiPenTool />} title="Architecture" desc="We design the blueprint for your digital ecosystem." />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <ProcessStep num="03" icon={<FiCode />} title="Development" desc="Our engineers build your high-performance platform." />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <ProcessStep num="04" icon={<FiZap />} title="Launch" desc="Deploying your brand for maximum market impact." />
            </motion.div>
          </div>

        </div>
      </section>

      {/* --- TRUST SIGNALS --- */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <TrustItem icon={<FiZap />} title="50ms Performance" />
            <TrustItem icon={<FiShield />} title="Verified Security" />
            <TrustItem icon={<FiCheckCircle />} title="Fixed Pricing" />
            <TrustItem icon={<FiGlobe />} title="Global Reach" />
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 md:py-40 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 mb-8 md:mb-12 tracking-tight leading-tight">
            Ready to lead the <br className="hidden md:block" />
            <span className="italic font-light text-brand-primary">digital era?</span>
          </h2>
          <Link to="/contact" className="inline-block px-12 py-6 bg-brand-dark text-white rounded-full font-bold text-xl shadow-2xl hover:bg-brand-primary transition-all duration-500 w-full sm:w-auto premium-shadow">
            Start Your Project
          </Link>
        </motion.div>
      </section>

      <section className="sr-only">
        <h2>Premium Digital Solutions for Small Businesses and Creators</h2>
        <p>
          SmoothWeb is an industry-leading digital agency founded by Akash Mandal, dedicated to
          democratizing high-end technology for creators, freelancers, and small business owners.
          Our platform offers a suite of professional tools designed to help you scale your
          digital identity and professional presence in a competitive market.
        </p>
        <p>
          We specialize in Custom Portfolio Websites built with modern technologies like React
          and Tailwind CSS, ensuring lightning-fast performance and SEO optimization.
          Our Strategic Ad Growth services leverage Meta and Google Ads to create high-conversion
          funnels that turn impressions into high-ticket clients.
        </p>
        <p>
          Additionally, SmoothWeb provides a state-of-the-art Digital Identity system.
          Our professional business cards are NFC-ready and feature dynamic QR code integration,
          allowing you to share your social links, portfolio, and contact information with a single scan.
          Whether you are a content creator looking to grow your following or a professional
          seeking a top-notch digital resume, SmoothWeb provides the technical backbone
          required for digital dominance.
        </p>
        <p>
          Key services include: High-end web development, responsive UI/UX design,
          business consulting, social media growth strategies, and premium digital branding.
          Join the SmoothWeb ecosystem today and transform your professional identity.
        </p>
        <nav>
          <a href="/about">About SmoothWeb</a>
          <a href="/services">Our Solutions</a>
          <a href="/portfolio">Project Showcase</a>
          <a href="/contact">Connect with Akash Mandal</a>
          <a href="/create">Card Architect</a>
        </nav>
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, features, desc, color, isHot }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`${color} p-10 rounded-[3rem] border border-slate-100 transition-all group relative overflow-hidden`}
    >
      {isHot && <span className="absolute top-6 right-6 px-3 py-1 bg-rose-500 text-white text-[9px] font-black uppercase rounded-full tracking-widest animate-bounce">Top Choice</span>}
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl text-brand-primary mb-8 shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 text-slate-900">{title}</h3>
      <p className="text-slate-500 font-light mb-8 text-base">{desc}</p>
      <ul className="space-y-3">
        {features.map(f => (
          <li key={f} className="flex items-center gap-3 text-xs font-bold text-slate-400">
            <FiCheckCircle className="text-brand-primary" /> {f}
          </li>
        ))}
      </ul>
      <Link to="/services" className="mt-8 flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-widest hover:gap-4 transition-all">
        View Details <FiZap />
      </Link>
    </motion.div>
  );
}

function ProcessStep({ num, icon, title, desc }) {
  return (
    <div className="text-center md:text-left">
      <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-3xl text-brand-primary mb-8 mx-auto md:mx-0 shadow-lg border border-slate-50 relative">
        <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center border-4 border-white">{num}</span>
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-3 text-slate-900">{title}</h4>
      <p className="text-slate-500 font-light text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function BundleItem({ text }) {
  return (
    <li className="flex items-center gap-4 text-slate-200 font-medium">
      <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center">
        <FiCheckCircle className="text-brand-primary" />
      </div>
      {text}
    </li>
  );
}

function TrustItem({ icon, title }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="text-2xl text-slate-400">{icon}</div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</span>
    </div>
  );
}
