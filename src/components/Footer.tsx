import { Link } from 'react-router-dom';
import { smoothScrollTo } from '../utils/smoothScroll';

const Footer = () => {
  return (
    <footer className="bg-text-dark py-12 text-white">
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="mb-10 flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <button
              type="button"
              onClick={() => smoothScrollTo('hero')}
              className="mb-3 text-xl font-bold text-gray-200 transition-opacity hover:opacity-80"
              aria-label="Go to top"
            >
              Vacancy.Cloud
            </button>
            <p className="text-sm leading-relaxed text-gray-400">
              Early-stage decision support for upgrading existing buildings.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-col flex-wrap gap-3 sm:flex-row sm:gap-6">
              <li>
                <button
                  type="button"
                  onClick={() => smoothScrollTo('how-it-works')}
                  className="text-sm text-gray-400 transition-colors hover:text-accent"
                >
                  How it works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => smoothScrollTo('demo')}
                  className="text-sm text-gray-400 transition-colors hover:text-accent"
                >
                  Demo
                </button>
              </li>
              <li>
                <Link
                  to="/team"
                  className="text-sm text-gray-400 transition-colors hover:text-accent"
                >
                  Team
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-700 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">Copenhagen, Denmark</p>
          <p className="text-sm text-gray-500">© 2026 Vacancy.Cloud</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
