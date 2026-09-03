import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import InteractiveDemo from './components/InteractiveDemo';
import Footer from './components/Footer';
import BuildingDetail from './pages/BuildingDetail';
import TeamPage from './pages/TeamPage';
import ContactPage from './pages/ContactPage';
import { smoothScrollTo } from './utils/smoothScroll';

const HomePage = () => {
  useEffect(() => {
    // Handle hash navigation when homepage loads
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        smoothScrollTo(hash);
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <HowItWorks />
        <InteractiveDemo />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/building/:id" element={<BuildingDetail />} />
      </Routes>
    </Router>
  );
}

export default App;


