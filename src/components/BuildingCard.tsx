import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building } from '../types';

interface BuildingCardProps {
  building: Building | null;
}

const BuildingCard = ({ building }: BuildingCardProps) => {
  const [activeTab, setActiveTab] = useState<'info' | 'analytics'>('info');
  const navigate = useNavigate();

  if (!building) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-white rounded-card shadow-md">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-text-muted mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="text-text-muted text-lg">Select a Building</p>
          <p className="text-text-muted text-sm mt-2">Click a marker to review renovation and retention insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-card shadow-md overflow-hidden">
      {/* Header with View Details Button */}
      {building && (
        <div className="p-4 border-b border-gray-200 bg-primary/5">
          <button
            onClick={() => navigate(`/building/${building.id}`)}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center"
          >
            <span>View Full Details</span>
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          id="building-info-tab"
          onClick={() => setActiveTab('info')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'info'
              ? 'text-primary border-b-2 border-primary bg-primary/5'
              : 'text-text-muted hover:text-primary hover:bg-gray-50'
          }`}
          aria-selected={activeTab === 'info'}
          aria-controls="building-info-panel"
          role="tab"
        >
          Building Info
        </button>
        <button
          id="ai-analytics-tab"
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'analytics'
              ? 'text-primary border-b-2 border-primary bg-primary/5'
              : 'text-text-muted hover:text-primary hover:bg-gray-50'
          }`}
          aria-selected={activeTab === 'analytics'}
          aria-controls="ai-analytics-panel"
          role="tab"
        >
          AI Analytics
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'info' ? (
          <div id="building-info-panel" role="tabpanel" aria-labelledby="building-info-tab" className="space-y-6">
            {/* Building Name */}
            <h2 className="text-2xl font-bold text-text-dark">{building.name}</h2>

            {/* Address */}
            <div className="flex items-start text-text-muted">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{building.address}</span>
            </div>

            {/* Image placeholder and Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div 
                className="bg-gray-200 rounded-lg aspect-square overflow-hidden flex items-center justify-center"
                role="img"
                aria-label={`Building image for ${building.name}`}
              >
                {building.image ? (
                  <img
                    src={building.image}
                    alt={building.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Show placeholder SVG on error
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        `;
                      }
                    }}
                  />
                ) : (
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide">Type</p>
                  <p className="text-sm font-medium text-text-dark">{building.type}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide">Indicative value</p>
                  <p className="text-sm font-medium text-text-dark">{building.price}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide">Size</p>
                  <p className="text-sm font-medium text-text-dark">
                    {building.size.floorArea || building.size.commercialArea || building.size.builtArea || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Floors</p>
                <p className="text-sm text-text-dark">{building.floors}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Material</p>
                <p className="text-sm text-text-dark">{building.material}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Owner</p>
                <p className="text-sm text-text-dark">{building.owner}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Year</p>
                <p className="text-sm text-text-dark">{building.year}</p>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-text-muted leading-relaxed">{building.description}</p>
            </div>

            {/* Click to view details hint */}
            <div className="pt-4 border-t border-gray-200 mt-4">
              <button
                onClick={() => navigate(`/building/${building.id}`)}
                className="w-full text-sm text-primary hover:text-primary/80 font-medium flex items-center justify-center transition-colors"
              >
                <span>View full building details</span>
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div id="ai-analytics-panel" role="tabpanel" aria-labelledby="ai-analytics-tab" className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-text-dark mb-2">AI-powered Analytics</h3>
              <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                Coming soon
              </span>
            </div>

            <ul className="space-y-3">
              {[
                'Upgrade ROI forecasting',
                'Renovation & retention scenarios',
                'Photogrammetry-based condition assessment',
                'GIS context for renovation decisions',
                'Circular material reuse estimates',
                'Operational & embodied CO₂ modeling',
                'Green financing readiness signals',
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-text-dark">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildingCard;

