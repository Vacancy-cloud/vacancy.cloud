import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { smoothScrollTo } from '../utils/smoothScroll';

type NavItem =
  | { kind: 'section'; id: string; label: string }
  | { kind: 'route'; path: string; label: string };

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const isTeamPage = location.pathname === '/team';
  const isContactPage = location.pathname === '/contact';

  useEffect(() => {
    // Only track scroll on homepage
    if (!isHomePage) return;

    const handleScroll = () => {
      const sections = ['hero', 'how-it-works', 'demo'];
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

  const handleSectionClick = (sectionId: string) => {
    setIsMenuOpen(false);

    if (isHomePage) {
      smoothScrollTo(sectionId);
    } else {
      navigate(`/#${sectionId}`, { replace: false });
      setTimeout(() => {
        smoothScrollTo(sectionId);
      }, 100);
    }
  };

  const navLinks: NavItem[] = [
    { kind: 'section', id: 'how-it-works', label: 'How It Works' },
    { kind: 'section', id: 'demo', label: 'Demo' },
    { kind: 'route', path: '/team', label: 'Team' },
    { kind: 'route', path: '/contact', label: 'Contact' },
  ];

  const isRouteActive = (path: string) =>
    path === '/team' ? isTeamPage : path === '/contact' ? isContactPage : false;

  const linkClass = (active: boolean, mobile = false) =>
    mobile
      ? `block w-full px-3 py-2 text-left text-base font-medium transition-colors ${
          active
            ? 'bg-primary/10 text-primary'
            : 'text-text-muted hover:bg-gray-50 hover:text-primary'
        }`
      : `px-3 py-2 text-sm font-medium transition-colors ${
          active
            ? 'border-b-2 border-primary text-primary'
            : 'text-text-muted hover:text-primary'
        }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                if (isHomePage) {
                  handleSectionClick('hero');
                } else {
                  navigate('/');
                }
              }}
              className="flex items-center space-x-3 transition-opacity hover:opacity-80"
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

          <div className="hidden md:flex md:space-x-8">
            {navLinks.map((link) =>
              link.kind === 'route' ? (
                <Link
                  key={link.path}
                  to={link.path}
                  className={linkClass(isRouteActive(link.path))}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleSectionClick(link.id)}
                  className={linkClass(activeSection === link.id)}
                >
                  {link.label}
                </button>
              )
            )}
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-text-muted hover:bg-gray-100 hover:text-primary focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 border-t bg-white px-2 pb-3 pt-2">
            {navLinks.map((link) =>
              link.kind === 'route' ? (
                <Link
                  key={link.path}
                  to={link.path}
                  className={linkClass(isRouteActive(link.path), true)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleSectionClick(link.id)}
                  className={linkClass(activeSection === link.id, true)}
                >
                  {link.label}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
