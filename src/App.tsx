import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import InteractiveDemo from './components/InteractiveDemo';
import Technology from './components/Technology';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BuildingDetail from './pages/BuildingDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen">
              <Navigation />
              <main>
                <Hero />
                <HowItWorks />
                <BeforeAfterSlider />
                <InteractiveDemo />
                <Technology />
                <Team />
                <Contact />
              </main>
              <Footer />
            </div>
          }
        />
        <Route path="/building/:id" element={<BuildingDetail />} />
      </Routes>
    </Router>
  );
}

export default App;


