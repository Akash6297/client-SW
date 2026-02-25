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
      title: "Sayandip Dutta | Premium Editor",
      category: "Creative Media Portfolio",
      image: sayandipImg, 
      desc: "Built for Sayandip Dutta to showcase his 'Ideas into Gold' philosophy. We engineered a high-retention platform to feature cinematic reels and visual alchemy, helping him manage a portfolio with 500K+ views and 100+ projects cut.",
      link: "https://sayandipdutta.online/",
      tags: ["Turbo Retention", "Visual Alchemy", "Brand Growth"]
    },
    {
      title: "Udeline Ventures India",
      category: "Industrial Corporate Hub",
      image: udelineImg, 
      desc: "A heavy-duty ecosystem for Udeline Ventures. We designed a professional presence highlighting their expertise in heavy fabrication, mining solutions, and material movement, meeting the precision standards of partners like Indico Motors.",
      link: "https://udeline.com/",
      tags: ["Heavy Fabrication", "Mining Solutions", "Supply Chain"]
    }
  ];

  const standards = [
    { icon: <FiZap />, title: "Turbo Retention", desc: "Just like our clients' videos, our code is paced for speed. We ensure your visitors stay engaged with lightning-fast load times and smooth transitions." },
    { icon: <FiCode />, title: "Precision Engineering", desc: "Whether it's a creative portfolio or a heavy industrial site, we use clean architecture (React 19/Tailwind v4) to ensure long-term scalability." },
    { icon: <FiSmartphone />, title: "Elite Accessibility", desc: "We build for every screen. From a creator's iPhone to a logistics manager's tablet, your identity remains consistent and powerful." },
    { icon: <FiShield />, title: "Verified Authority", desc: "We integrate trust signals and professional SEO frameworks so that your brand is recognized as a leader in your industry by Google." }
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HERO HEADER --- */}
        <header className="mb-24 text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-brand-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Our Impact</span>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
              Turning Ideas <br />
              <span className="text-brand-primary">Into Reality.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl font-light leading-relaxed">
              From cinematic portfolios for global creators to heavy-duty hubs for industrial giants. We craft the digital architecture of modern success.
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
                      View Live Project <FiExternalLink />
                   </a>
                </div>
              </div>
              <div className="mt-8 px-2">
                 <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-brand-primary px-3 py-1 bg-blue-50 rounded-full border border-blue-100/50">{tag}</span>
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
           <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
           <div className="relative z-10">
              <div className="max-w-2xl mb-20">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">The SmoothWeb <br/><span className="text-brand-primary">Standard.</span></h2>
                <p className="text-slate-400 text-lg font-light">Whether it's 'Turning Ideas into Gold' or 'Sustainable Mining Solutions,' we deliver high-performance digital environments for leaders.</p>
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
            <h2 className="text-4xl md:text-7xl font-black text-slate-900 mb-10 tracking-tight leading-tight">Ready to build your <br /> <span className="italic font-light text-brand-primary">Digital Identity?</span></h2>
            <Link to="/book" className="inline-flex items-center gap-3 px-12 py-6 bg-brand-dark text-white rounded-full font-bold text-lg hover:bg-brand-primary transition-all duration-500 shadow-2xl">
                Book a Consultation <FiArrowRight />
            </Link>
        </section>

        {/* --- ENHANCED SEO BLOCK --- */}
        <section className="sr-only">
           <h2>Flagship Projects by SmoothWeb and Akash Mandal</h2>
           <p>
              We developed sayandipdutta.online, a premium video editing portfolio for Sayandip Dutta featuring high-retention reels and brand growth metrics. 
              We also developed udeline.com, a heavy industrial corporate website for Udeline Ventures India Pvt. Ltd., 
              specializing in heavy fabrication, mining, trailers, and material movement. 
              SmoothWeb uses React 19, Tailwind CSS, and Indico Motors standards of precision for web development. 
              Our services help creators turn ideas into gold and help industrial businesses scale their digital logistics.
           </p>
        </section>

      </div>
    </div>
  );
}