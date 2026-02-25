import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // Remove BrowserRouter from here

// Import components
import ScrollToTop from './components/ScrollToTop';
import ScrollUpButton from './components/ScrollUpButton';
import SiteLoader from './components/SiteLoader';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget'; 

// Page Imports
import Landing from './pages/Landing';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import CardCreator from './components/CardCreator';

function App() {
  const location = useLocation();

  // 1. Dynamic SEO Titles
  useEffect(() => {
    const routeTitles = {
      "/": "SmoothWeb | Premium Portfolios & Digital Identity",
      "/about": "About SmoothWeb | Mission & Purpose",
      "/services": "Our Solutions | Portfolio & Ad Strategy",
      "/portfolio": "Selected Works | SmoothWeb Portfolio",
      "/contact": "Connect | SmoothWeb Digital Agency",
      "/create": "Card Architect | Design Your Identity",
      "/book": "Secure Consultation | Book Your Session"
    };

    document.title = routeTitles[location.pathname] || "SmoothWeb | Digital Excellence";
  }, [location]);

  // 2. Security & UI Logic
  useEffect(() => {
    // Restrict Right-Click
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <>
      <SiteLoader />
      <ScrollToTop /> 

      <div className="flex flex-col min-h-screen relative">
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

        {/* Floating Global Components */}
        <ChatWidget /> 
        <ScrollUpButton />
      </div>
    </>
  );
}

export default App;