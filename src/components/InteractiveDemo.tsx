import { useState } from 'react';
import MapboxMap from './MapboxMap';
import BuildingCard from './BuildingCard';
import ReportModal from './ReportModal';
import { buildings } from '../data/buildings';
import { Building } from '../types';

const InteractiveDemo = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="demo" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-text-dark mb-4">
          Interactive Demo
        </h2>
        <p className="text-center text-text-muted text-lg mb-12 max-w-2xl mx-auto">
          Explore vacant buildings across Denmark. Click on markers to view detailed information.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-6 mb-6">
          {/* Map */}
          <div className="h-[600px] lg:h-[700px]">
            <MapboxMap
              buildings={buildings}
              selectedBuilding={selectedBuilding}
              onBuildingSelect={setSelectedBuilding}
            />
          </div>

          {/* Info Panel */}
          <div className="h-[600px] lg:h-[700px]">
            <BuildingCard building={selectedBuilding} />
          </div>
        </div>

        {/* Request Full Analysis Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-accent text-white rounded-lg font-semibold text-lg hover:bg-accent/90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={!selectedBuilding}
          >
            Request Full Analysis (PDF)
          </button>
        </div>

        {/* Report Modal */}
        {isModalOpen && (
          <ReportModal
            building={selectedBuilding}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </section>
  );
};

export default InteractiveDemo;


