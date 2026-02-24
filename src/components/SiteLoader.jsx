/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SiteLoader = () => {
	const [loading, setLoading] = useState(true);
	const [showText, setShowText] = useState(false);

	useEffect(() => {
		// Tagline appears after 0.8s
		const textTimer = setTimeout(() => {
			setShowText(true);
		}, 800); 

		// Loader closes after 3s
		const loaderTimer = setTimeout(() => {
			setLoading(false);
			// Prevent loader from showing again in the same session
			window.sessionStorage.setItem("siteLoaded", "true");
		}, 3000);

		return () => {
			clearTimeout(textTimer);
			clearTimeout(loaderTimer);
		};
	}, []);

	// Create 10 vertical panels for a "curtain" effect
	const panelCount = 10;
	const panels = Array.from({ length: panelCount });

	return (
		<AnimatePresence>
			{loading && (
				<div className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden">
					
					{/* STAIRCASE PANELS */}
					<div className="absolute inset-0 flex">
						{panels.map((_, index) => (
							<motion.div
								key={index}
								initial={{ y: 0 }}
								exit={{ y: "-100%" }}
								transition={{
									duration: 0.8,
									delay: index * 0.05,
									ease: [0.77, 0, 0.175, 1],
								}}
								className="h-full bg-slate-900 border-r border-white/5"
								style={{ width: `${100 / panelCount}%` }}
							/>
						))}
					</div>

					{/* CONTENT LAYER (Logo & Tagline) */}
					<motion.div
						className="relative z-10 flex flex-col items-center"
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}
					>
						{/* BRAND LOGO */}
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
							className="flex items-center gap-3 mb-4"
						>
							<div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
								<span className="text-white font-black text-xl italic font-serif">S</span>
							</div>
							<h1 className="text-4xl font-black tracking-tighter text-white uppercase">
								Smooth<span className="text-brand-primary">Web</span>
							</h1>
						</motion.div>

						{/* TAGLINE REVEAL */}
						<div className="h-6 overflow-hidden">
							{showText && (
								<motion.p
									initial={{ y: "100%" }}
									animate={{ y: 0 }}
									transition={{ duration: 0.8, ease: "easeOut" }}
									className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.6em] ml-[0.6em]"
								>
									Digital Excellence Redefined
								</motion.p>
							)}
						</div>
					</motion.div>

					{/* PROGRESS LINE */}
					<motion.div 
						initial={{ width: 0 }}
						animate={{ width: "200px" }}
						transition={{ duration: 2.5, ease: "easeInOut" }}
						className="absolute bottom-20 h-[1px] bg-brand-primary/30"
					/>
				</div>
			)}
		</AnimatePresence>
	);
};

export default SiteLoader;