import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import the new components
import ScrollToTop from './components/ScrollToTop';
import ScrollUpButton from './components/ScrollUpButton';
import SiteLoader from './components/SiteLoader';
import Header from './components/Header';
import Footer from './components/Footer';

// Page Imports
import Landing from './pages/Landing';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import CardCreator from './components/CardCreator';

function App() {
  useEffect(() => {
    // Restrict Right-Click
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <Router>
      <SiteLoader />
      
      {/* 1. Reset scroll on every navigation */}
      <ScrollToTop /> 

      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/create" element={<CardCreator isLoggedIn={true} />} />
          </Routes>
        </main>

        <Footer />

        {/* 2. Floating button always available */}
        <ScrollUpButton />
      </div>
    </Router>
  );
}

export default App;