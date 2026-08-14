import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { smoothScrollTo } from '../utils/smoothScroll';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // Only track scroll on homepage
    if (!isHomePage) return;

    const handleScroll = () => {
      const sections = ['hero', 'how-it-works', 'demo', 'technology', 'team', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleNavClick = (sectionId: string) => {
    setIsMenuOpen(false);
    
    if (isHomePage) {
      // On homepage, just scroll to section
      smoothScrollTo(sectionId);
    } else {
      // On BuildingDetail page, navigate to homepage with hash, then scroll
      navigate(`/#${sectionId}`, { replace: false });
      // Use setTimeout to ensure navigation completes before scrolling
      setTimeout(() => {
        smoothScrollTo(sectionId);
      }, 100);
    }
  };

  const navLinks = [
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'demo', label: 'Demo' },
    { id: 'technology', label: 'Technology' },
    { id: 'team', label: 'Team' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <button
              onClick={() => {
                if (isHomePage) {
                  handleNavClick('hero');
                } else {
                  navigate('/');
                }
              }}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              aria-label="Go to homepage"
            >
              {!logoError && (
                <img
                  src="/images/logo/logo.png"
                  alt="Vacancy.Cloud Logo"
                  className="h-10 w-auto"
                  onError={() => setLogoError(true)}
                />
              )}
              <span className="text-2xl font-bold text-primary">Vacancy.Cloud</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-text-muted hover:text-primary'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-muted hover:text-primary hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`block px-3 py-2 text-base font-medium w-full text-left transition-colors ${
                  activeSection === link.id
                    ? 'text-primary bg-primary/10'
                    : 'text-text-muted hover:text-primary hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

