import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Services from './pages/Services';
import About from './pages/About';
import CardCreator from './components/CardCreator';
import Contact from './pages/Contact';

function App() {
  const isLoggedIn = true; // Temporary for testing

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        
        {/* Main content expands to push footer down */}
        <main className="flex-grow pt-20"> 
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/create" element={<CardCreator isLoggedIn={isLoggedIn} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;