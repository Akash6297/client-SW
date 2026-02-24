/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiLayers, FiStar, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Portfolio() {
  const projects = [
    {
      title: "Luxe Estate Branding",
      category: "Portfolio Website",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
      desc: "A high-end real estate portfolio with immersive animations and 0.5s load time.",
      tags: ["React", "Tailwind", "GSAP"]
    },
    {
      title: "Social Growth Engine",
      category: "Ad Strategy",
      image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=2340&auto=format&fit=crop",
      desc: "Meta ad funnel that generated 400% ROI for a lifestyle fashion startup.",
      tags: ["Marketing", "Analytics", "Copywriting"]
    },
    {
      title: "Identity Pro",
      category: "Digital Identity",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2274&auto=format&fit=crop",
      desc: "The core digital infrastructure for SmoothWeb's internal card generation system.",
      tags: ["Product Design", "UX Architecture"]
    },
    {
      title: "Creator Hub v2",
      category: "Full Stack Build",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2344&auto=format&fit=crop",
      desc: "A bespoke project management tool for independent freelance consultants.",
      tags: ["Node.js", "MongoDB", "Auth"]
    }
  ];

  const reviews = [
    {
      name: "Saurav Sharma",
      role: "E-commerce Founder",
      content: "Akash and the SmoothWeb team transformed our brand. The portfolio they built for us is world-class and has doubled our client inquiries.",
      rating: 5
    },
    {
      name: "Priya Das",
      role: "UI/UX Designer",
      content: "The digital identity tools are seamless. I share my SmoothWeb card at every networking event—it's a conversation starter.",
      rating: 5
    },
    {
      name: "Rahul Mehra",
      role: "Marketing Consultant",
      content: "Rare to find someone who understands both tech and marketing. Their ad strategy consulting is pure gold for small businesses.",
      rating: 5
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HERO HEADER --- */}
        <header className="mb-24 text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-brand-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Selected Works</span>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
              Showcasing <br />
              <span className="text-brand-primary">Digital Mastery.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl font-light leading-relaxed">
              We turn ambitious ideas into digital reality. Explore our legacy of high-performance websites and strategic growth campaigns.
            </p>
          </motion.div>
        </header>

        {/* --- PROJECTS GRID (STAGGERED) --- */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 mb-40">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative ${index % 2 !== 0 ? 'md:mt-20' : ''}`}
            >
              <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-100 aspect-[4/5] shadow-sm hover:shadow-2xl transition-all duration-700">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-500 flex flex-col justify-end p-10">
                  <div className="flex gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full border border-white/20 text-[9px] font-bold text-white uppercase tracking-widest">{tag}</span>
                    ))}
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2">{project.title}</h3>
                  <p className="text-slate-300 text-sm font-light mb-6">{project.desc}</p>
                  <a href="#" className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
                    View Project <FiExternalLink />
                  </a>
                </div>
              </div>
              <div className="mt-6 md:hidden lg:block px-4">
                 <p className="text-brand-primary font-bold text-[10px] uppercase tracking-widest mb-1">{project.category}</p>
                 <h4 className="text-xl font-bold text-slate-900">{project.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- TESTIMONIALS SECTION --- */}
        <section className="py-24 border-t border-slate-100">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">Client <span className="text-brand-primary">Voices.</span></h2>
                <p className="text-lg text-slate-500 font-light">Trusted by founders and creators worldwide to deliver excellence.</p>
            </div>
            <div className="flex gap-2">
                {[1,2,3,4,5].map(s => <FiStar key={s} className="text-brand-primary text-xl fill-brand-primary" />)}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 relative group transition-all"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand-primary text-xl border border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  "
                </div>
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => <FiStar key={i} className="text-brand-primary text-sm fill-brand-primary" />)}
                </div>
                <p className="text-slate-600 leading-relaxed mb-8 font-light italic">
                  "{review.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200" /> {/* Placeholder for avatar */}
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">{review.name}</h5>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- CALL TO ACTION --- */}
        <section className="mt-32 p-10 md:p-20 bg-slate-900 rounded-[4rem] text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-primary/5 blur-[100px] rounded-full translate-y-1/2"></div>
            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Have a vision for your next project?</h2>
                <Link to="/book" className="inline-flex items-center gap-3 px-12 py-6 bg-brand-primary text-white rounded-full font-bold text-lg hover:bg-white hover:text-brand-primary transition-all duration-500 shadow-2xl">
                    Let's Build It <FiArrowRight />
                </Link>
            </div>
        </section>

      </div>
    </div>
  );
}