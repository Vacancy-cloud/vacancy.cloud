import { useState, useEffect } from 'react';
import { Building } from '../types';

interface ReportModalProps {
  building: Building | null;
  onClose: () => void;
}

const ReportModal = ({ building, onClose }: ReportModalProps) => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    // In a real app, this would send to a backend
    alert('Thank you! We\'ll notify you when early-stage assessment reports are available.');
    setEmail('');
    onClose();
  };

  const reportSections = [
    'Executive Summary',
    'Risk Assessment',
    'Renovation Scenarios',
    'ROI Projections',
    'ESG Impact',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-card shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-text-dark">
              {building ? `${building.name} - Assessment Report` : 'Assessment Report'}
            </h2>
            <span className="inline-block mt-2 px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
              Demo Preview - Early-stage assessment report coming soon
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-dark transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Report Sections Preview */}
          <div className="space-y-4">
            {reportSections.map((section, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 hover:border-primary/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-text-dark mb-2 flex items-center">
                  <span className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </span>
                  {section}
                </h3>
                <p className="text-text-muted text-sm ml-11">
                  {section === 'Executive Summary' && 'Overview of upgrade potential, energy performance pathway, and key decision metrics.'}
                  {section === 'Risk Assessment' && 'Structural, environmental, and regulatory risks affecting renovation and retention options.'}
                  {section === 'Renovation Scenarios' && 'Compare renovation, retention, selective dismantling, and reuse pathways with cost and carbon estimates.'}
                  {section === 'ROI Projections' && 'Financial outcomes including upgrade returns, payback periods, and green financing readiness.'}
                  {section === 'ESG Impact' && 'Operational and embodied carbon impact with sustainability metrics for owners and financiers.'}
                </p>
              </div>
            ))}
          </div>

          {/* Email Capture */}
          <div className="border-t border-gray-200 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <label htmlFor="email" className="block text-sm font-medium text-text-dark">
                Get notified when available
              </label>
              <div className="flex gap-3">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                >
                  Notify Me
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;


