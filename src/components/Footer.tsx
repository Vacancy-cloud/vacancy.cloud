import { smoothScrollTo } from '../utils/smoothScroll';

const Footer = () => {
  const navLinks = [
    { id: 'how-it-works', label: 'How it works' },
    { id: 'demo', label: 'Demo' },
    { id: 'renovation-value-chain', label: "Who it's for" },
    { id: 'team', label: 'About' },
  ];

  return (
    <footer className="bg-text-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-10">
          <div className="max-w-sm">
            <button
              onClick={() => smoothScrollTo('hero')}
              className="text-xl font-bold text-gray-200 hover:opacity-80 transition-opacity mb-3"
              aria-label="Go to top"
            >
              Vacancy.Cloud
            </button>
            <p className="text-gray-400 text-sm leading-relaxed">
              Decision intelligence for upgrading existing buildings.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => smoothScrollTo(link.id)}
                    className="text-sm text-gray-400 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-gray-500 text-sm">Copenhagen, Denmark</p>
          <p className="text-gray-500 text-sm">© 2026 Vacancy.Cloud</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
