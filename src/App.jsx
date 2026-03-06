import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // Remove BrowserRouter from here

// Import components
import ScrollToTop from './components/ScrollToTop';
import ScrollUpButton from './components/ScrollUpButton';
import SiteLoader from './components/SiteLoader';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget'; 

// Page Imports (Lazy Loaded for Performance)
const Landing = React.lazy(() => import('./pages/Landing'));
const About = React.lazy(() => import('./pages/About'));
const Services = React.lazy(() => import('./pages/Services'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Booking = React.lazy(() => import('./pages/Booking'));
const CardCreator = React.lazy(() => import('./components/CardCreator'));

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
          <React.Suspense fallback={<SiteLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/book" element={<Booking />} />
              <Route path="/create" element={<CardCreator isLoggedIn={true} />} />
            </Routes>
          </React.Suspense>
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