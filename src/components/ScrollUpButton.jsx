/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';

const ScrollUpButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 400) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          // Responsive Position: bottom-4 (mobile) / bottom-10 (desktop)
          className="fixed bottom-4 right-4 sm:bottom-10 sm:right-10 z-[400] w-12 h-12 sm:w-14 sm:h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl border border-white/10 backdrop-blur-md"
          aria-label="Scroll to top"
        >
          <FiArrowUp className="text-xl sm:text-2xl animate-bounce" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollUpButton;