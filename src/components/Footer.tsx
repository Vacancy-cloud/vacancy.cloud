import { useState } from 'react';
import { smoothScrollTo } from '../utils/smoothScroll';

const Footer = () => {
  const [logoError, setLogoError] = useState(false);
  return (
    <footer className="bg-text-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo */}
          <div>
            <button
              onClick={() => smoothScrollTo('hero')}
              className="mb-4 flex items-center space-x-3 hover:opacity-80 transition-opacity"
              aria-label="Go to top"
            >
              {!logoError && (
                <img
                  src="/images/logo/logo.png"
                  alt="Vacancy.Cloud Logo"
                  className="h-8 w-auto"
                  onError={() => setLogoError(true)}
                />
              )}
              <span className="text-2xl font-bold text-gray-300">Vacancy.Cloud</span>
            </button>
            <p className="text-gray-400 text-sm">
              AI-Platform for managing Vacant and Underutilized Buildings in Denmark
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    // Placeholder - would navigate to privacy policy page
                    console.log('Privacy Policy clicked');
                  }}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-accent transition-colors text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    // Placeholder - would navigate to terms page
                    console.log('Terms of Service clicked');
                  }}
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <button
              onClick={() => smoothScrollTo('contact')}
              className="text-gray-400 hover:text-accent transition-colors text-sm"
            >
              Get in Touch
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Vacancy.Cloud. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

