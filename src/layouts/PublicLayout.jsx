import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import components
import ScrollToTop from '../components/ScrollToTop';
import ScrollUpButton from '../components/ScrollUpButton';
import SiteLoader from '../components/SiteLoader';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';

// Analytics
import useGaLoader from '../hooks/useGaLoader';
import usePageviewTracker from '../hooks/usePageviewTracker';

// Page Imports (Lazy Loaded for Performance)
const Landing = React.lazy(() => import('../pages/Landing'));
const About = React.lazy(() => import('../pages/About'));
const Services = React.lazy(() => import('../pages/Services'));
const Portfolio = React.lazy(() => import('../pages/Portfolio'));
const Contact = React.lazy(() => import('../pages/Contact'));
const Booking = React.lazy(() => import('../pages/Booking'));
const CardCreator = React.lazy(() => import('../components/CardCreator'));

function PublicLayout() {
  useGaLoader();
  usePageviewTracker();

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

export default PublicLayout;
