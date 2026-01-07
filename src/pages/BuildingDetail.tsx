import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import mapboxgl from 'mapbox-gl';
import { buildings } from '../data/buildings';
import { Building } from '../types';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Contact from '../components/Contact';
import { calculateCarbonImpact, type CarbonAnalysis } from '@/utils/co2-calculator';
import 'mapbox-gl/dist/mapbox-gl.css';

const BuildingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [building, setBuilding] = useState<Building | null>(null);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const foundBuilding = buildings.find(b => b.id === id);
    if (foundBuilding) {
      setBuilding(foundBuilding);
      // Reset image indices when building changes
      setSelectedPlanIndex(0);
      setSelectedImageIndex(0);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  // Initialize Mapbox map
  useEffect(() => {
    if (!building || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoidmNuY2NsZCIsImEiOiJjbWpoanVhZTExNHlqM2VxejNzZHQ1Y3k4In0.D57YgoihTpRwIh2YcC4dMw';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: building.coordinates,
      zoom: 15,
    });

    // Add marker
    new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat(building.coordinates)
      .addTo(map.current);

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add isochrone layer when map loads
    map.current.on('load', () => {
      if (!map.current || !building.isochroneGeoJSON) return;
      
      // Add the GeoJSON source
      if (!map.current.getSource('walkability-area')) {
        map.current.addSource('walkability-area', {
          type: 'geojson',
          data: building.isochroneGeoJSON,
        });

        // Add the semi-transparent fill layer
        map.current.addLayer({
          id: 'walkability-fill',
          type: 'fill',
          source: 'walkability-area',
          paint: {
            'fill-color': '#22c55e', // Green color
            'fill-opacity': 0.2, // 20% opacity
          },
        });

        // Add the contour line layer
        map.current.addLayer({
          id: 'walkability-line',
          type: 'line',
          source: 'walkability-area',
          paint: {
            'line-color': '#15803d',
            'line-width': 2,
          },
        });
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [building]);

  if (!building) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  // Placeholder data
  const reusePotential = 72;
  const legalStatus = 'Available for purchase';
  const condition = 'Good condition, requires renovation';
  const utilityConnections = ['Electricity', 'Water', 'Sewage', 'Heating'];
  const zoning = 'C-2 (Commercial)';
  
  /**
   * Extracts building area from size property for CO2 calculation.
   * Priority: floorArea > commercialArea > builtArea > groundArea
   * Returns 0 if no valid area is found.
   */
  const getBuildingArea = (): number => {
    // Type-safe check: ensure building.size exists
    if (!building?.size) {
      return 0;
    }

    const { size } = building;
    
    // Type-safe extraction with fallback chain
    const areaStr: string | undefined = 
      size.floorArea ?? 
      size.commercialArea ?? 
      size.builtArea ?? 
      size.groundArea;
    
    // Return 0 if no area string is found
    if (!areaStr || typeof areaStr !== 'string' || areaStr.trim() === '') {
      return 0;
    }

    // Remove all non-numeric characters except dots and commas
    const cleaned = areaStr.replace(/[^0-9.,]/g, '');
    
    if (!cleaned) {
      return 0;
    }
    
    // Danish logic: if it's "6.785", it's usually 6785 sqm. 
    // If it's "6,785", it's also usually 6785 or 6.785 depending on context.
    // Standardizing: remove the dot if it acts as a thousands separator.
    const normalized = cleaned.includes('.') && cleaned.length > 4 
      ? cleaned.replace(/\./g, '') 
      : cleaned.replace(/,/g, '.');

    const parsed = parseFloat(normalized);
    
    // Return 0 for invalid, NaN, or negative values
    return (isFinite(parsed) && parsed > 0) ? parsed : 0;
  };

  /**
   * Extracts year from building.year string.
   * Handles formats like "1978", "Ejendommen er fra 1914.", etc.
   */
  const getBuildingYear = (): number => {
    if (!building?.year) {
      return 2000; // Default fallback
    }

    // Extract first 4-digit year from the string
    const yearMatch = building.year.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      const parsed = parseInt(yearMatch[0], 10);
      return (parsed >= 1800 && parsed <= new Date().getFullYear()) ? parsed : 2000;
    }

    return 2000; // Default fallback if no valid year found
  };

  /**
   * Gets material category for CO2 calculations.
   * Uses materialCategory if available, otherwise falls back to parsing material string.
   */
  const getMaterialType = (): string => {
    // Use materialCategory if explicitly set
    if (building?.materialCategory) {
      return building.materialCategory;
    }

    // Fallback: parse from material string
    if (!building?.material) {
      return 'Default';
    }

    const materialLower = building.material.toLowerCase();
    
    // Check for material keywords
    if (materialLower.includes('beton') || materialLower.includes('concrete')) {
      return 'Betonkonstruktion';
    }
    if (materialLower.includes('sten') || materialLower.includes('brick') || materialLower.includes('mursten')) {
      return 'mursten';
    }
    if (materialLower.includes('træ') || materialLower.includes('wood') || materialLower.includes('bindingsværk')) {
      return 'Trækonstruktion';
    }
    if (materialLower.includes('stål') || materialLower.includes('steel')) {
      return 'Steel';
    }

    return 'Default';
  };

  /**
   * Generates AI Strategy Insight based on carbon analysis, material, and year.
   * Returns an object with summary text and recommendations.
   */
  const generateAIStrategyInsight = (
    analysis: CarbonAnalysis,
    material: string,
    year: number
  ): { summary: string; greenFinanceTip: string } => {
    const values = [analysis.conservation, analysis.renovation, analysis.demolition];
    const maxValue = Math.max(...values);
    const highestScenario = 
      maxValue === analysis.demolition ? 'demolition' :
      maxValue === analysis.renovation ? 'renovation' :
      'conservation';

    let summary = '';
    
    if (highestScenario === 'demolition') {
      const materialImpact = material === 'Beton' || material === 'Betonkonstruktion' ? 'høj-kulstof betonkonstruktion' : 
                            material === 'Steel' ? 'stål' :
                            material === 'Brick' || material === 'mursten' ? 'mursten' :
                            material === 'Wood' || material === 'Trækonstruktion' ? 'trækonstruktion' : 'bygningsmaterialerne';
      const ageNote = year < 1975 
        ? ` Additionally, buildings constructed before 1975 (this building is from ${year}) face a 15% age penalty due to potential hazardous materials requiring specialized disposal.`
        : '';
      
      summary = `Demolition and new construction represents the highest carbon impact (${analysis.demolition.toFixed(1)} kg CO₂e/m²/y) among all scenarios. This is primarily due to the embodied carbon in ${materialImpact} materials, which requires significant energy to produce and transport.${ageNote} The upfront carbon cost of new construction outweighs the operational efficiency gains, making renovation or conservation more environmentally responsible options.`;
    } else if (highestScenario === 'renovation') {
      summary = `Renovation offers a balanced approach (${analysis.renovation.toFixed(1)} kg CO₂e/m²/y), combining moderate upfront carbon investment with improved operational efficiency. This scenario modernizes the building while preserving existing materials, reducing waste and embodied carbon compared to demolition.`;
    } else {
      summary = `Conservation maintains the lowest carbon footprint (${analysis.conservation.toFixed(1)} kg CO₂e/m²/y) by avoiding new construction emissions. While operational emissions remain higher, the zero embodied carbon makes this the most sustainable short-term option, especially for buildings with good structural integrity.`;
    }

    const greenFinanceTip = 'This project qualifies for sustainable building grants due to its high reuse potential.';

    return { summary, greenFinanceTip };
  };

  /**
   * Calculates CO2 impact for the three scenarios.
   * Returns a default CarbonAnalysis object if area is invalid or 0.
   */
  const buildingArea = getBuildingArea();
  const buildingYear = getBuildingYear();
  const materialType = getMaterialType();
  
  // Default values when area is 0 or invalid
  const defaultCarbonAnalysis: CarbonAnalysis = {
    conservation: 0,
    renovation: 0,
    demolition: 0,
  };

  // Calculate CO2 impact only if we have a valid area > 0
  // Use try-catch for additional safety, though getBuildingArea should prevent invalid values
  let carbonAnalysis: CarbonAnalysis;
  try {
    carbonAnalysis = buildingArea > 0 
      ? calculateCarbonImpact(buildingArea, materialType, buildingYear) 
      : defaultCarbonAnalysis;
  } catch (error) {
    // Fallback to default if calculation fails (shouldn't happen with our validation)
    console.warn('Failed to calculate carbon impact:', error);
    carbonAnalysis = defaultCarbonAnalysis;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-text-muted hover:text-primary mb-4 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Map
            </button>
            <h1 className="text-4xl font-bold text-text-dark mb-2">{building.name}</h1>
            <p className="text-text-muted text-lg">{building.address}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Photo Gallery */}
          {building.galleryImages && building.galleryImages.length > 0 && (
            <div className="mb-8">
              <div className="bg-white rounded-card p-6 shadow-md">
                <h2 className="text-2xl font-bold text-text-dark mb-4">Photo Gallery</h2>
                
                {/* Main Image Display */}
                <div className="mb-3">
                  <div className="bg-gray-200 rounded-lg aspect-video overflow-hidden">
                    <img
                      src={building.galleryImages[selectedImageIndex]}
                      alt={`${building.name} - Image ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23e5e7eb" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="18" fill="%239ca3af"%3EImage not available%3C/text%3E%3C/svg%3E';
                        target.className = 'w-full h-full object-contain';
                      }}
                    />
                  </div>
                </div>
                
                {/* Small Thumbnail Strip Below Main Photo */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {building.galleryImages.map((imagePath, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden transition-all cursor-pointer ${
                        selectedImageIndex === index
                          ? 'ring-2 ring-primary ring-offset-1 scale-105'
                          : 'hover:opacity-80 border-2 border-transparent hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={imagePath}
                        alt={`${building.name} - Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23e5e7eb" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="10" fill="%239ca3af"%3EN/A%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Property Summary & Technical Specifications - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Property Summary & Quick Facts */}
            <div className="bg-white rounded-card p-6 shadow-md">
              <h2 className="text-2xl font-bold text-text-dark mb-6">Property Summary & Quick Facts</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Price</p>
                    <p className="text-xl font-bold text-primary">{building.price}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Location</p>
                    <p className="text-lg font-semibold text-text-dark">{building.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Property Type</p>
                    <p className="text-lg font-semibold text-text-dark">{building.type}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Size</p>
                    <p className="text-lg font-semibold text-text-dark">
                      {building.size.floorArea || building.size.commercialArea || building.size.builtArea || 'N/A'}
                      {building.size.groundArea && ` / ${building.size.groundArea}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Build Year</p>
                    <p className="text-lg font-semibold text-text-dark">{building.year}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Legal Status</p>
                    <p className="text-lg font-semibold text-text-dark">{legalStatus}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Condition</p>
                    <p className="text-lg font-semibold text-text-dark">{condition}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Material</p>
                    <p className="text-lg font-semibold text-text-dark">{building.material}</p>
                    {building.materialCategory && (
                      <p className="text-sm text-text-muted mt-1">
                        Category: <span className="font-semibold text-primary">{building.materialCategory}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Reuse Potential</p>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-accent h-full transition-all duration-500"
                          style={{ width: `${reusePotential}%` }}
                        />
                      </div>
                      <span className="text-xl font-bold text-accent">{reusePotential}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Specifications & Description */}
            <div className="bg-white rounded-card p-6 shadow-md">
              <h2 className="text-2xl font-bold text-text-dark mb-6">Technical Specifications</h2>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-semibold text-text-dark">Floors: </span>
                    <span className="text-text-muted">{building.floors}</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-semibold text-text-dark">Construction Material: </span>
                    <span className="text-text-muted">{building.material}</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-semibold text-text-dark">Utility Connections: </span>
                    <span className="text-text-muted">{utilityConnections.join(', ')}</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-semibold text-text-dark">Zoning Classification: </span>
                    <span className="text-text-muted">{zoning}</span>
                  </div>
                </li>
              </ul>
              
              {/* Description */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-text-dark mb-3">Description</h3>
                <p className="text-text-muted leading-relaxed">{building.description}</p>
                <p className="text-xs text-gray-400 mt-3">Information provided by Freja Ejendomme</p>
              </div>
            </div>
          </div>

          {/* Plan Drawings and STL 3D Model - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Plan Drawings */}
            <div className="bg-white rounded-card p-6 shadow-md">
              <h2 className="text-2xl font-bold text-text-dark mb-4">Plan Drawings</h2>
              {building.planImages && building.planImages.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Plan Image */}
                  <div className="bg-white rounded-lg aspect-[4/3] overflow-hidden">
                    <img
                      src={building.planImages[selectedPlanIndex]}
                      alt={`${building.name} - Plan Drawing ${selectedPlanIndex + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Show placeholder instead of hiding
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23ffffff" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="18" fill="%236b7280"%3EPlan drawing not available%3C/text%3E%3C/svg%3E';
                        target.className = 'w-full h-full object-contain';
                      }}
                    />
                  </div>
                  {/* Additional Plan Images Thumbnails */}
                  {building.planImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {building.planImages.map((planPath, index) => (
                        <div
                          key={index}
                          className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-white cursor-pointer transition-opacity ${
                            selectedPlanIndex === index
                              ? 'opacity-100 ring-2 ring-primary ring-offset-1'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                          onClick={() => setSelectedPlanIndex(index)}
                        >
                          <img
                            src={planPath}
                            alt={`${building.name} - Plan ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              // Show placeholder instead of hiding
                              target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="10" fill="%239ca3af"%3EN/A%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg aspect-[4/3] flex items-center justify-center">
                  <svg 
                    className="w-full h-full" 
                    viewBox="0 0 800 600" 
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <rect x="50" y="50" width="300" height="200" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
                    <rect x="400" y="50" width="300" height="200" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
                    <rect x="50" y="300" width="650" height="250" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
                    <rect x="350" y="45" width="50" height="10" fill="#6b7280" />
                    <rect x="60" y="45" width="80" height="10" fill="#93c5fd" />
                    <rect x="410" y="45" width="80" height="10" fill="#93c5fd" />
                    <rect x="60" y="545" width="100" height="10" fill="#93c5fd" />
                    <text x="200" y="160" textAnchor="middle" fill="#6b7280" fontSize="20" fontFamily="Arial">Room 1</text>
                    <text x="550" y="160" textAnchor="middle" fill="#6b7280" fontSize="20" fontFamily="Arial">Room 2</text>
                    <text x="375" y="425" textAnchor="middle" fill="#6b7280" fontSize="20" fontFamily="Arial">Main Hall</text>
                    <line x1="650" y1="550" x2="750" y2="550" stroke="#6b7280" strokeWidth="2" />
                    <text x="700" y="540" textAnchor="middle" fill="#6b7280" fontSize="12" fontFamily="Arial">10m</text>
                  </svg>
                </div>
              )}
            </div>

            {/* STL 3D Model */}
            <div className="bg-white rounded-card p-6 shadow-md">
              <h2 className="text-2xl font-bold text-text-dark mb-4">3D Model</h2>
              <p className="text-sm text-text-muted mb-4">Drag to rotate • Scroll to zoom</p>
              <div className="bg-gray-900 rounded-lg aspect-[4/3] relative overflow-hidden">
                <Canvas
                  camera={{ position: [5, 5, 5], fov: 50 }}
                >
                  <PerspectiveCamera makeDefault position={[5, 5, 5]} />
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <pointLight position={[-10, -10, -5]} intensity={0.5} />
                  <mesh rotation={[0, 0, 0]}>
                    <boxGeometry args={[3, 2, 2]} />
                    <meshStandardMaterial color="#307ae1" />
                  </mesh>
                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
                    <planeGeometry args={[10, 10]} />
                    <meshStandardMaterial color="#6b7280" />
                  </mesh>
                  <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={3}
                    maxDistance={15}
                  />
                </Canvas>
              </div>
              <p className="text-sm text-text-muted mt-4 text-center">
                STL 3D model placeholder - Full 3D building model will be displayed here
              </p>
            </div>
          </div>

          {/* Mapbox Map - Full Width */}
          <div className="mt-8">
            <div className="bg-white rounded-card p-6 shadow-md">
              <h2 className="text-2xl font-bold text-text-dark mb-4">Location</h2>
              <div className="relative">
                <div 
                  ref={mapContainer} 
                  className="w-full h-[400px] rounded-lg overflow-hidden"
                />
                {/* Isochrone Legend */}
                {building.isochroneGeoJSON && (
                  <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-4 h-4 rounded-full border-2 border-[#15803d]" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}></div>
                      <span className="text-sm font-semibold text-text-dark">10-min Walking Area</span>
                    </div>
                    <p className="text-xs text-text-muted">Green area shows walkable distance</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location Intelligence - GIS Data */}
          {building.gisData && (
            <div className="mt-8">
              <div className="bg-white rounded-card p-6 shadow-md">
                <h2 className="text-2xl font-bold text-text-dark mb-2">Location Intelligence</h2>
                <p className="text-sm text-text-muted mb-6">
                  Comprehensive GIS data for land-use optimization and context analysis. The map above shows a 10-minute walking isochrone (green area) indicating accessible areas on foot.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Accessibility Scores */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-dark">Accessibility</h3>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-text-muted">Public Transport</span>
                        <span className="text-sm font-semibold text-text-dark">{building.gisData.publicTransportScore}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${building.gisData.publicTransportScore}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-text-muted">Walkability</span>
                        <span className="text-sm font-semibold text-text-dark">{building.gisData.walkabilityScore}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-accent h-2 rounded-full transition-all"
                          style={{ width: `${building.gisData.walkabilityScore}%` }}
                        />
                      </div>
                    </div>
                    <div className="pt-2 space-y-2">
                      <div className="flex items-center text-sm text-text-muted">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                        Bus: {building.gisData.nearestBusStop}
                      </div>
                      <div className="flex items-center text-sm text-text-muted">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Train: {building.gisData.nearestTrainStation}
                      </div>
                    </div>
                  </div>

                  {/* Urban Context */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-dark">Urban Context</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wide">Land Use Zone</span>
                        <p className="text-sm font-semibold text-text-dark mt-1">{building.gisData.landUseZone}</p>
                      </div>
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wide">Flood Risk</span>
                        <p className="text-sm font-semibold text-text-dark mt-1">{building.gisData.floodRiskZone}</p>
                      </div>
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wide">Noise Level</span>
                        <p className="text-sm font-semibold text-text-dark mt-1">{building.gisData.noiseLevel}</p>
                      </div>
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wide">Population Density</span>
                        <p className="text-sm font-semibold text-text-dark mt-1">{building.gisData.populationDensity}</p>
                      </div>
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wide">Income Area</span>
                        <p className="text-sm font-semibold text-text-dark mt-1">{building.gisData.avgIncomeArea}</p>
                      </div>
                    </div>
                  </div>

                  {/* Nearby Amenities */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-dark">Nearby Amenities</h3>
                    <ul className="space-y-2">
                      {building.gisData.nearbyAmenities.map((amenity, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-text-dark">{amenity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sustainability Profile - CO₂ & ESG Data */}
          {building.esgData && (
            <div className="mt-8">
              <div className="bg-white rounded-card p-6 shadow-md">
                <h2 className="text-2xl font-bold text-text-dark mb-6">Sustainability Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Current State */}
                  <div>
                    <h3 className="text-lg font-semibold text-text-dark mb-4">Current State</h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wide">CO₂ Footprint</span>
                        <p className="text-xl font-bold text-text-dark mt-1">{building.esgData.estimatedCO2Footprint}</p>
                      </div>
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wide">Energy Class</span>
                        <div className="flex items-center mt-2">
                          <div className="text-4xl font-bold text-primary">{building.esgData.energyClass}</div>
                          <div className="ml-4 text-sm text-text-muted">
                            <p>Danish Energy Label</p>
                            <p className="text-xs">A (best) → G (worst)</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wide">Heating Type</span>
                        <p className="text-sm font-semibold text-text-dark mt-1">{building.esgData.heatingType}</p>
                      </div>
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wide">Insulation Status</span>
                        <p className="text-sm font-semibold text-text-dark mt-1">{building.esgData.insulationStatus}</p>
                      </div>
                    </div>
                  </div>

                  {/* Renovation Impact */}
                  <div>
                    <h3 className="text-lg font-semibold text-text-dark mb-4">Renovation Impact</h3>
                    <div className="space-y-4">
                      <div className="bg-accent/10 rounded-lg p-4">
                        <span className="text-xs text-text-muted uppercase tracking-wide">Potential CO₂ Reduction</span>
                        <p className="text-xl font-bold text-accent mt-1">{building.esgData.potentialCO2Reduction}</p>
                      </div>
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wide">Renovation to Energy Class B</span>
                        <p className="text-lg font-semibold text-text-dark mt-1">{building.esgData.renovationToEnergyClassB}</p>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <span className="text-xs text-text-muted uppercase tracking-wide mb-2 block">Circular Economy</span>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-text-muted">Demolition Waste</span>
                            <span className="font-semibold text-text-dark">{building.esgData.demolitionWasteEstimate}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-text-muted">Reusable Materials Value</span>
                            <span className="font-semibold text-accent">{building.esgData.reusableMaterialsValue}</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs text-text-muted uppercase tracking-wide mb-2">Material Breakdown</p>
                          <div className="space-y-1 text-sm">
                            <div>• {building.esgData.materialBreakdown.brick}</div>
                            <div>• {building.esgData.materialBreakdown.concrete}</div>
                            <div>• {building.esgData.materialBreakdown.wood}</div>
                            <div>• {building.esgData.materialBreakdown.other}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CO₂ Impact Scenarios - Conservation, Renovation, Demolition */}
          {buildingArea > 0 && (
            <div className="mt-8">
              <div className="bg-white rounded-card p-6 shadow-md">
                <h2 className="text-2xl font-bold text-text-dark mb-6">CO₂ Impact Scenarios</h2>
                <p className="text-text-muted mb-6">
                  Carbon footprint analysis based on Danish Building Regulation (BR18) & LCAbyg standards, calculated over a 50-year period.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Conservation Card */}
                  <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50/50">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-text-dark">Conservation</h3>
                    </div>
                    <p className="text-sm text-text-muted mb-4">
                      Maintain existing building with current operational emissions
                    </p>
                    <div className="pt-4 border-t border-green-200">
                      <span className="text-xs text-text-muted uppercase tracking-wide">CO₂ Impact</span>
                      <p className="text-2xl font-bold text-green-600 mt-2">
                        {carbonAnalysis.conservation.toFixed(1)} kg CO₂e/m²/y
                      </p>
                    </div>
                  </div>

                  {/* Renovation Card */}
                  <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50/50">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-text-dark">Renovation</h3>
                    </div>
                    <p className="text-sm text-text-muted mb-4">
                      Modernize building with energy-efficient upgrades
                    </p>
                    <div className="pt-4 border-t border-blue-200">
                      <span className="text-xs text-text-muted uppercase tracking-wide">CO₂ Impact</span>
                      <p className="text-2xl font-bold text-blue-600 mt-2">
                        {carbonAnalysis.renovation.toFixed(1)} kg CO₂e/m²/y
                      </p>
                    </div>
                  </div>

                  {/* Demolition Card */}
                  <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50/50">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-text-dark">Demolition</h3>
                    </div>
                    <p className="text-sm text-text-muted mb-4">
                      Demolish and rebuild to new building standards
                    </p>
                    <div className="pt-4 border-t border-red-200">
                      <span className="text-xs text-text-muted uppercase tracking-wide">CO₂ Impact</span>
                      <p className="text-2xl font-bold text-red-600 mt-2">
                        {carbonAnalysis.demolition.toFixed(1)} kg CO₂e/m²/y
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Strategy Insight */}
          {buildingArea > 0 && (
            <div className="mt-8">
              <div className="bg-blue-50/30 border border-blue-200/50 rounded-card p-6 shadow-sm">
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-text-dark mb-2 flex items-center">
                      AI Strategy Insight
                      <span className="ml-2 text-sm font-normal text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        AI-Powered
                      </span>
                    </h2>
                    <div className="mt-4 space-y-4">
                      {(() => {
                        const insight = generateAIStrategyInsight(carbonAnalysis, materialType, buildingYear);
                        return (
                          <>
                            <p className="text-text-dark leading-relaxed">
                              {insight.summary}
                            </p>
                            <div className="bg-white/60 border border-blue-200/50 rounded-lg p-4 mt-4">
                              <div className="flex items-start">
                                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                  <p className="text-sm font-semibold text-text-dark mb-1">Green Finance Tip</p>
                                  <p className="text-sm text-text-muted">
                                    {insight.greenFinanceTip}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Analysis */}
          {building.financialData && (
            <div className="mt-8">
              <div className="bg-white rounded-card p-6 shadow-md">
                <h2 className="text-2xl font-bold text-text-dark mb-6">Financial Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Current Value */}
                  <div>
                    <h3 className="text-lg font-semibold text-text-dark mb-4">Current Value</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wide">Market Value</span>
                        <p className="text-xl font-bold text-primary mt-1">{building.financialData.estimatedMarketValue}</p>
                      </div>
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wide">Land Value</span>
                        <p className="text-lg font-semibold text-text-dark mt-1">{building.financialData.landValue}</p>
                      </div>
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wide">Price per m²</span>
                        <p className="text-lg font-semibold text-text-dark mt-1">{building.financialData.pricePerSqm}</p>
                      </div>
                    </div>
                  </div>

                  {/* Costs */}
                  <div>
                    <h3 className="text-lg font-semibold text-text-dark mb-4">Costs</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wide">Renovation Cost</span>
                        <p className="text-lg font-semibold text-text-dark mt-1">{building.financialData.estimatedRenovationCost}</p>
                      </div>
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wide">Annual Maintenance</span>
                        <p className="text-lg font-semibold text-text-dark mt-1">{building.financialData.annualMaintenanceCost}</p>
                      </div>
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wide">Property Tax</span>
                        <p className="text-lg font-semibold text-text-dark mt-1">{building.financialData.propertyTax}</p>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Potential & ROI */}
                  <div>
                    <h3 className="text-lg font-semibold text-text-dark mb-4">Revenue & ROI</h3>
                    <div className="space-y-3">
                      {building.financialData.rentalPotentialResidential !== 'N/A' && (
                        <div>
                          <span className="text-xs text-text-muted uppercase tracking-wide">Residential Rental</span>
                          <p className="text-lg font-semibold text-text-dark mt-1">{building.financialData.rentalPotentialResidential}</p>
                        </div>
                      )}
                      {building.financialData.rentalPotentialCommercial !== 'N/A' && (
                        <div>
                          <span className="text-xs text-text-muted uppercase tracking-wide">Commercial Rental</span>
                          <p className="text-lg font-semibold text-text-dark mt-1">{building.financialData.rentalPotentialCommercial}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wide">Sale After Renovation</span>
                        <p className="text-lg font-semibold text-accent mt-1">{building.financialData.saleAfterRenovation}</p>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <span className="text-xs text-text-muted uppercase tracking-wide">Payback Period</span>
                        <p className="text-lg font-semibold text-text-dark mt-1">{building.financialData.paybackPeriod}</p>
                      </div>
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wide">Expected ROI</span>
                        <p className="text-xl font-bold text-accent mt-1">{building.financialData.expectedROI}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Risk Assessment */}
          {building.aiScenarios && (
            <div className="mt-8">
              <div className="bg-white rounded-card p-6 shadow-md">
                <h2 className="text-2xl font-bold text-text-dark mb-6">Risk Assessment</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {building.aiScenarios.map((scenario, index) => {
                    const riskColors: { [key: string]: string } = {
                      'Low': 'bg-green-100 text-green-800',
                      'Low-Medium': 'bg-blue-100 text-blue-800',
                      'Medium': 'bg-yellow-100 text-yellow-800',
                      'Medium-High': 'bg-orange-100 text-orange-800',
                      'High': 'bg-red-100 text-red-800',
                    };
                    const riskColor = riskColors[scenario.riskLevel] || 'bg-gray-100 text-gray-800';
                    
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-text-dark">{scenario.name}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${riskColor}`}>
                            {scenario.riskLevel}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-text-muted">Feasibility: </span>
                            <div className="flex items-center mt-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${scenario.feasibilityScore}%` }}
                                />
                              </div>
                              <span className="font-semibold text-text-dark">{scenario.feasibilityScore}%</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-text-muted">Investment: </span>
                            <span className="font-semibold text-text-dark">{scenario.investmentRequired}</span>
                          </div>
                          <div>
                            <span className="text-text-muted">ROI: </span>
                            <span className="font-semibold text-accent">{scenario.expectedROI}</span>
                          </div>
                          <div>
                            <span className="text-text-muted">CO₂ Impact: </span>
                            <span className="font-semibold text-text-dark">{scenario.co2Impact}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* AI Scenarios */}
          {building.aiScenarios && (
            <div className="mt-8">
              <div className="bg-white rounded-card p-6 shadow-md">
                <h2 className="text-2xl font-bold text-text-dark mb-6">AI-Powered Investment Scenarios</h2>
                <p className="text-text-muted mb-6">
                  Our AI platform analyzes multiple reuse scenarios to help you make data-driven investment decisions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {building.aiScenarios.map((scenario, index) => (
                    <div key={index} className="bg-background rounded-card p-6 border-2 border-gray-200 hover:border-primary transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-text-dark">{scenario.name}</h3>
                        <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                          {scenario.feasibilityScore}% Feasible
                        </span>
                      </div>
                      <p className="text-text-muted text-sm mb-4">{scenario.description}</p>
                      <div className="space-y-3 pt-4 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-muted">Investment Required</span>
                          <span className="font-semibold text-text-dark">{scenario.investmentRequired}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-muted">Expected ROI</span>
                          <span className="font-semibold text-accent">{scenario.expectedROI}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-muted">Timeframe</span>
                          <span className="font-semibold text-text-dark">{scenario.timeframe}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-muted">Risk Level</span>
                          <span className="font-semibold text-text-dark">{scenario.riskLevel}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-muted">CO₂ Impact</span>
                          <span className={`font-semibold ${scenario.co2Impact.startsWith('-') ? 'text-accent' : 'text-red-600'}`}>
                            {scenario.co2Impact}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-text-muted mb-4">
                    These scenarios are generated using AI analysis of building data, market conditions, and regulatory requirements.
                  </p>
                  <button
                    onClick={() => {
                      console.log('Request detailed scenario analysis for', building.name);
                      alert('Detailed scenario analysis will be available in the full AI-powered reports');
                    }}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Request Detailed Scenario Analysis
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Contact building={building} carbonAnalysis={buildingArea > 0 ? carbonAnalysis : null} />
      <Footer />
    </div>
  );
};

export default BuildingDetail;
