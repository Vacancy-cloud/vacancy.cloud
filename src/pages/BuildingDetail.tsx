import { useEffect, useState, useRef, Suspense } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import { Canvas, useThree } from '@react-three/fiber';
import { Center, OrbitControls } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';
import { buildings } from '../data/buildings';
import { Building } from '../types';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Rotate3d } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// Auto-fit camera to model bounds
const CameraFit = ({ target }: { target: THREE.Object3D | null }) => {
  const { camera } = useThree();
  const fittedRef = useRef(false);

  useEffect(() => {
    if (!fittedRef.current && target) {
      const box = new THREE.Box3().setFromObject(target);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      
      const maxDim = Math.max(size.x, size.y, size.z);
      const distance = maxDim * 2.5; // Distance to fit ~80% of viewer
      
      // Position camera
      camera.position.set(center.x + distance * 0.7, center.y + distance * 0.7, center.z + distance * 0.7);
      camera.lookAt(center);
      camera.updateProjectionMatrix();
      
      fittedRef.current = true;
    }
  }, [target, camera]);

  return null;
};

// STL Model Component with auto-fit
const STLModel = ({ url }: { url: string }) => {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const loader = new STLLoader();
    loader.load(
      url,
      (loadedGeometry) => {
        // Center the geometry
        loadedGeometry.center();
        // Compute bounding box
        loadedGeometry.computeBoundingBox();
        setGeometry(loadedGeometry);
      },
      undefined,
      (error) => {
        console.error('Error loading STL:', error);
      }
    );
  }, [url]);

  if (!geometry) {
    return null;
  }

  return (
    <Center>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial color="#8b9dc3" metalness={0.3} roughness={0.7} />
      </mesh>
      {meshRef.current && <CameraFit target={meshRef.current} />}
    </Center>
  );
};

const BuildingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [building, setBuilding] = useState<Building | null>(null);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab: 'overview' | 'location' =
    searchParams.get('tab') === 'location' ? 'location' : 'overview';
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const setActiveTab = (tab: 'overview' | 'location') => {
    setSearchParams({ tab }, { replace: true });
  };

  useEffect(() => {
    const foundBuilding = buildings.find(b => b.id === id);
    if (foundBuilding) {
      setBuilding(foundBuilding);
      // Reset image indices when building changes
      setSelectedPlanIndex(0);
      setSelectedImageIndex(0);
      setHasInteracted(false);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  // Initialize Mapbox map when Location tab is active
  useEffect(() => {
    if (!building || activeTab !== 'location') return;

    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      if (cancelled || !mapContainer.current || map.current) return;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: building.coordinates,
        zoom: 15,
      });

      new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(building.coordinates)
        .addTo(map.current);

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        if (!map.current || !building.isochroneGeoJSON) return;

        if (!map.current.getSource('walkability-area')) {
          map.current.addSource('walkability-area', {
            type: 'geojson',
            data: building.isochroneGeoJSON,
          });

          map.current.addLayer({
            id: 'walkability-fill',
            type: 'fill',
            source: 'walkability-area',
            paint: {
              'fill-color': '#22c55e',
              'fill-opacity': 0.2,
            },
          });

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

        map.current.resize();
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [building, activeTab]);


  if (!building) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  const displayOrUnavailable = (value?: string | null) => {
    if (!value || !String(value).trim()) return 'Not available';
    return value;
  };

  const floorAreaDisplay =
    building.size.floorArea ||
    building.size.commercialArea ||
    building.size.builtArea ||
    null;

  type DataStatus = 'Known' | 'Derived' | 'Predicted' | 'Unknown';

  const statusPillClass = (status: DataStatus) => {
    switch (status) {
      case 'Known':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Derived':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Predicted':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Unknown':
      default:
        return 'bg-gray-100 text-text-muted border-gray-200';
    }
  };

  const StatusPill = ({ status }: { status: DataStatus }) => (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusPillClass(status)}`}
    >
      {status}
    </span>
  );

  const OverviewRow = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
        <p className="mt-1 text-base font-semibold text-text-dark">{value}</p>
      </div>
    </div>
  );

  const ConfidenceRow = ({
    label,
    value,
    status,
  }: {
    label: string;
    value: string;
    status: DataStatus;
  }) => (
    <div className="flex items-start justify-between gap-3 border-b border-gray-100 py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-dark">{label}</p>
        <p className="mt-0.5 text-sm text-text-muted">{value}</p>
      </div>
      <StatusPill status={status} />
    </div>
  );
 
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

            <div className="mt-6 flex gap-1 border-b border-gray-200" role="tablist" aria-label="Building detail views">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-text-muted hover:text-primary'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'location'}
                onClick={() => setActiveTab('location')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'location'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-text-muted hover:text-primary'
                }`}
              >
                Location
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {activeTab === 'overview' && (
          <>
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

          {/* Plan Drawings and STL 3D Model - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
                              ? 'opacity-100'
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

            {/* 3D Model Viewer */}
            <div className="p-6 flex flex-col rounded-xl bg-white shadow-md" style={{ minHeight: '500px' }}>
              <h2 className="text-2xl font-bold text-text-dark mb-2">3D Model</h2>
              {(building.id === '1' || building.id === '2') && (
                <p className="text-sm text-text-muted mb-4">Interactive Digital Twin Placeholder</p>
              )}
              {/* Content section - takes all available vertical space */}
              <div className="flex-1 flex items-center justify-center relative">
                {building.id === '3' ? (
                  // Building 3: KiriEngine iframe - fills container and centered
                  <iframe
                    title={building.name}
                    src={building.model3dUrl}
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; fullscreen;"
                    className="w-full h-full rounded-lg bg-transparent"
                    style={{
                      borderRadius: '0.5rem',
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      background: 'transparent',
                      backgroundColor: 'transparent'
                    }}
                    {...({
                      'mozallowfullscreen': true,
                      'webkitallowfullscreen': true,
                      'execution-while-out-of-viewport': '',
                      'execution-while-not-rendered': ''
                    } as any)}
                  />
                ) : building.id === '1' || building.id === '2' ? (
                  // Buildings 1 and 2: Axonometric images - perfectly centered, not cropped
                  <img
                    src={building.id === '1' ? '/images/Toldbodvej 4/axo_Toldbodvej 4.png' : '/images/Tolbyen/axo_Tolbyen.png'}
                    alt={`${building.name} - Axonometric view`}
                    className="rounded-lg"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      borderRadius: '0.5rem'
                    }}
                  />
                ) : building.model3dUrl && building.model3dUrl.endsWith('.stl') ? (
                  // STL Model Viewer with auto-fit
                  <div 
                    className="w-full h-full rounded-lg overflow-hidden relative"
                    onMouseDown={() => setHasInteracted(true)}
                    onTouchStart={() => setHasInteracted(true)}
                  >
                    <Canvas
                      camera={{ position: [3, 3, 3], fov: 50 }}
                      gl={{ alpha: true, antialias: true }}
                      style={{ background: 'transparent' }}
                    >
                      <ambientLight intensity={0.6} />
                      <directionalLight position={[10, 10, 5]} intensity={0.8} />
                      <Suspense fallback={null}>
                        <STLModel url={building.model3dUrl} />
                      </Suspense>
                      <OrbitControls
                        makeDefault
                        enableZoom={true}
                        enablePan={false}
                        enableRotate={true}
                        autoRotate={false}
                        minDistance={1}
                        maxDistance={20}
                        onChange={() => setHasInteracted(true)}
                      />
                    </Canvas>
                    {/* Interaction hint icon */}
                    <div 
                      className={`absolute top-4 right-4 z-10 transition-opacity duration-500 ${hasInteracted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                      style={{ pointerEvents: 'none' }}
                    >
                      <div className="group relative">
                        <div className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
                          <Rotate3d className="w-5 h-5 text-gray-700" />
                        </div>
                        {/* Tooltip */}
                        <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">
                            Drag to rotate
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
              {/* Caption section - anchored to bottom of white container */}
              <p className="mt-auto pt-4 text-center text-sm text-gray-600">
                This STL model was automatically generated from a photograph using a 3D reconstruction app. Geometry will be refined through professional scanning in later stages.
              </p>
            </div>
          </div>


          {/* Building Overview & Building Data & Confidence */}
          <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Building Overview — documented facts only */}
            <div className="rounded-card bg-white p-6 shadow-md">
              <h2 className="mb-6 text-2xl font-bold text-text-dark">Building Overview</h2>
              <div>
                <OverviewRow label="Address" value={displayOrUnavailable(building.address)} />
                <OverviewRow
                  label="Building type / use"
                  value={displayOrUnavailable(building.type)}
                />
                <OverviewRow
                  label="Year of construction"
                  value={displayOrUnavailable(building.year)}
                />
                <OverviewRow
                  label="Floor area"
                  value={displayOrUnavailable(floorAreaDisplay)}
                />
                <OverviewRow
                  label="Number of floors"
                  value={displayOrUnavailable(building.floors)}
                />
                <OverviewRow
                  label="Current energy class"
                  value={displayOrUnavailable(building.esgData?.energyClass)}
                />
                <OverviewRow
                  label="Main construction material"
                  value={displayOrUnavailable(building.material)}
                />
                <OverviewRow
                  label="Data source"
                  value="Freja Ejendomme (demo dataset)"
                />
                <OverviewRow label="Last updated" value="Not available" />
              </div>
            </div>

            {/* Building Data & Confidence */}
            <div className="rounded-card bg-white p-6 shadow-md">
              <h2 className="mb-2 text-2xl font-bold text-text-dark">Building Data &amp; Confidence</h2>
              <p className="mb-2 text-sm font-medium text-text-dark">
                Data status: Known · Derived · Predicted · Unknown
              </p>
              <p className="mb-5 text-sm text-text-muted">
                Each parameter is labelled according to how the information was obtained.
              </p>

              <div>
                <ConfidenceRow
                  label="Energy class"
                  value={displayOrUnavailable(building.esgData?.energyClass)}
                  status={building.esgData?.energyClass ? 'Known' : 'Unknown'}
                />
                <ConfidenceRow
                  label="Building use"
                  value={displayOrUnavailable(building.type)}
                  status={building.type ? 'Known' : 'Unknown'}
                />
                <ConfidenceRow
                  label="Main construction material"
                  value={displayOrUnavailable(building.material)}
                  status={building.material ? 'Known' : 'Unknown'}
                />
                <ConfidenceRow
                  label="Material category"
                  value={displayOrUnavailable(
                    building.materialCategory
                      ? ({
                          mursten: 'Masonry',
                          Betonkonstruktion: 'Concrete',
                          Trækonstruktion: 'Timber',
                          Steel: 'Steel',
                        }[building.materialCategory] ?? building.materialCategory)
                      : null
                  )}
                  status={building.materialCategory ? 'Derived' : 'Unknown'}
                />
                <ConfidenceRow
                  label="Heating type"
                  value={displayOrUnavailable(building.esgData?.heatingType)}
                  status={building.esgData?.heatingType ? 'Known' : 'Unknown'}
                />
                <ConfidenceRow label="Wall build-up" value="Not available" status="Unknown" />
                <ConfidenceRow
                  label="Insulation / thermal envelope data"
                  value="Not available"
                  status="Unknown"
                />
                <ConfidenceRow
                  label="Structural condition"
                  value="Not available"
                  status="Unknown"
                />
              </div>
            </div>
          </div>

          {/* Energy Performance Assessment: Current → Target → Gap */}
          <div className="mb-8 rounded-card bg-white p-6 shadow-md sm:p-8">
            <h2 className="mb-2 text-2xl font-bold text-text-dark">Energy Performance Assessment</h2>
            <p className="mb-8 max-w-3xl text-sm text-text-muted sm:text-base">
              Compare the building’s current performance with the applicable target to identify where
              improvement is needed.
            </p>

            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:gap-4">
              {/* A. Current Building Profile */}
              <div className="min-w-0">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  A · Current Building Profile
                </p>
                <h3 className="mb-4 text-lg font-bold text-text-dark">Current state</h3>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2">
                    <div>
                      <p className="text-xs text-text-muted">Current energy class</p>
                      <p className="text-sm font-semibold text-text-dark">
                        {displayOrUnavailable(building.esgData?.energyClass)}
                      </p>
                    </div>
                    <StatusPill status={building.esgData?.energyClass ? 'Known' : 'Unknown'} />
                  </div>
                  <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2">
                    <div>
                      <p className="text-xs text-text-muted">Heating system</p>
                      <p className="text-sm font-semibold text-text-dark">
                        {displayOrUnavailable(building.esgData?.heatingType)}
                      </p>
                    </div>
                    <StatusPill status={building.esgData?.heatingType ? 'Known' : 'Unknown'} />
                  </div>
                  <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2">
                    <div>
                      <p className="text-xs text-text-muted">Building use</p>
                      <p className="text-sm font-semibold text-text-dark">
                        {displayOrUnavailable(building.type)}
                      </p>
                    </div>
                    <StatusPill status={building.type ? 'Known' : 'Unknown'} />
                  </div>
                  <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2">
                    <div>
                      <p className="text-xs text-text-muted">Main construction / envelope</p>
                      <p className="text-sm font-semibold text-text-dark">
                        {displayOrUnavailable(building.material)}
                      </p>
                    </div>
                    <StatusPill status={building.material ? 'Known' : 'Unknown'} />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-text-muted">Component-level energy data</p>
                      <p className="text-sm font-semibold text-text-dark">Unknown</p>
                    </div>
                    <StatusPill status="Unknown" />
                  </div>
                </div>
              </div>

              <div
                className="hidden items-center justify-center text-text-muted/50 lg:flex"
                aria-hidden="true"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* B. Applicable Target */}
              <div className="min-w-0 border-t border-gray-100 pt-6 lg:border-t-0 lg:pt-0">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  B · Applicable Target
                </p>
                <h3 className="mb-4 text-lg font-bold text-text-dark">Target layer</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-text-muted">Applicable energy-performance target</p>
                    <p className="mt-1 text-sm font-semibold text-text-dark">
                      Target determination requires regulatory rule matching
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Regulatory / performance requirement</p>
                    <p className="mt-1 text-sm text-text-muted">Not available</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Component targets</p>
                    <p className="mt-1 text-sm text-text-muted">Not available</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Target energy class / threshold</p>
                    <p className="mt-1 text-sm text-text-muted">Not available</p>
                  </div>
                </div>
                <p className="mt-4 text-[11px] leading-relaxed text-text-muted">
                  Targets are determined from building-specific regulatory context, not from
                  predicted current-state data.
                </p>
              </div>

              <div
                className="hidden items-center justify-center text-text-muted/50 lg:flex"
                aria-hidden="true"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* C. Performance Gap */}
              <div className="min-w-0 border-t border-gray-100 pt-6 lg:border-t-0 lg:pt-0">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  C · Performance Gap
                </p>
                <h3 className="mb-4 text-lg font-bold text-text-dark">Where improvement is needed</h3>
                <ul className="space-y-2.5">
                  {[
                    'Roof / top floor',
                    'Exterior walls',
                    'Windows / doors',
                    'Floor / basement',
                    'Heating',
                    'Ventilation',
                  ].map((component) => (
                    <li
                      key={component}
                      className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2 last:border-b-0"
                    >
                      <span className="text-sm text-text-dark">{component}</span>
                      <span className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                        Insufficient data
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[11px] leading-relaxed text-text-muted">
                  Gaps are shown only when comparable current and target values exist. Missing
                  component data is not treated as a gap.
                </p>
              </div>
            </div>
          </div>

          {/* Targeted Verification */}
          <div className="mb-8 rounded-card bg-white p-6 shadow-md sm:p-8">
            <h2 className="mb-2 text-2xl font-bold text-text-dark">Targeted Verification</h2>
            <p className="mb-6 max-w-3xl text-sm text-text-muted sm:text-base">
              Vacancy.Cloud identifies the specific missing inputs that need verification before the
              renovation pathway can be refined.
            </p>

            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_minmax(0,1.5fr)_auto] gap-3 border-b border-gray-200 pb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                  <span>Parameter</span>
                  <span>What needs to be verified</span>
                  <span>Why it matters</span>
                  <span className="text-right">Status</span>
                </div>

                {[
                  {
                    parameter: 'Roof / top floor',
                    verify:
                      'Verify insulation build-up or available thermal-performance data',
                    why: 'Needed to compare current roof performance with the applicable target',
                  },
                  {
                    parameter: 'Exterior walls',
                    verify: 'Verify wall build-up and insulation information',
                    why: 'Needed to determine the envelope performance gap',
                  },
                  {
                    parameter: 'Windows / doors',
                    verify: 'Verify glazing type and thermal-performance information',
                    why: 'Needed to establish current window performance',
                  },
                  {
                    parameter: 'Floor / basement',
                    verify: 'Verify insulation information for floor / basement construction',
                    why: 'Needed to determine the relevant component gap',
                  },
                  {
                    parameter: 'Ventilation',
                    verify: 'Confirm ventilation system type and available performance data',
                    why: 'Needed to assess ventilation requirements',
                  },
                  {
                    parameter: 'Applicable target',
                    verify: 'Complete building-specific regulatory rule matching',
                    why: 'Needed before component-level gaps can be confirmed',
                  },
                ].map((row) => (
                  <div
                    key={row.parameter}
                    className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_minmax(0,1.5fr)_auto] items-start gap-3 border-b border-gray-100 py-3 last:border-b-0"
                  >
                    <p className="text-sm font-semibold text-text-dark">{row.parameter}</p>
                    <p className="text-sm text-text-muted">{row.verify}</p>
                    <p className="text-sm text-text-muted">{row.why}</p>
                    <span className="justify-self-end whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                      Verification required
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-5 text-sm text-text-muted">
              Only decision-critical missing parameters are flagged for additional verification.
            </p>
          </div>

          {/* Required Improvement Areas */}
          <div className="mb-8 rounded-card bg-white p-6 shadow-md sm:p-8">
            <h2 className="mb-2 text-2xl font-bold text-text-dark">Required Improvement Areas</h2>
            <p className="mb-6 max-w-3xl text-sm text-text-muted sm:text-base">
              Based on confirmed performance gaps, Vacancy.Cloud identifies the building components
              that may require intervention.
            </p>

            <div className="overflow-x-auto">
              <div className="min-w-[720px]">
                <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,0.9fr)] gap-3 border-b border-gray-200 pb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                  <span>Building component</span>
                  <span>Current status</span>
                  <span>Improvement area</span>
                  <span>Confidence</span>
                </div>

                {[
                  'Roof / top floor',
                  'Exterior walls',
                  'Windows / doors',
                  'Floor / basement',
                  'Heating',
                  'Ventilation',
                ].map((component) => (
                  <div
                    key={component}
                    className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,0.9fr)] items-start gap-3 border-b border-gray-100 py-3 last:border-b-0"
                  >
                    <p className="text-sm font-semibold text-text-dark">{component}</p>
                    <div>
                      <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                        Pending verification
                      </span>
                    </div>
                    <p className="text-sm text-text-muted">
                      To be determined after verification
                    </p>
                    <p className="text-sm text-text-muted">Not yet assessed</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-5 text-sm text-text-muted">
              Intervention areas indicate where further renovation planning should focus; detailed
              design remains subject to professional assessment.
            </p>
          </div>

          {/* Feasibility & Risk Screening */}
          <div className="mb-8 rounded-card bg-white p-6 shadow-md sm:p-8">
            <h2 className="mb-2 text-2xl font-bold text-text-dark">Feasibility &amp; Risk Screening</h2>
            <p className="mb-6 max-w-3xl text-sm text-text-muted sm:text-base">
              Vacancy.Cloud flags early-stage risks and retention opportunities that may affect the
              renovation pathway.
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-5">
              <div className="border-t border-gray-100 pt-4 md:border-t-0 md:border-l-0 md:pt-0 md:pr-4 lg:border-r lg:border-gray-100">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-text-dark">Hazardous materials</h3>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                    Verification required
                  </span>
                </div>
                <p className="mb-3 text-sm font-semibold text-text-dark">
                  Potential risk — verification required
                </p>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                  Available evidence
                </p>
                <p className="mb-3 text-sm text-text-muted">
                  Building age and available construction information may indicate a need for PCB /
                  asbestos screening.
                </p>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                  Verification
                </p>
                <p className="text-sm text-text-muted">
                  Confirm through documentation review and/or targeted professional testing where
                  relevant.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4 md:border-t-0 md:pt-0 md:px-2 lg:border-r lg:border-gray-100 lg:pr-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-text-dark">Structural retention</h3>
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                    Not yet confirmed
                  </span>
                </div>
                <p className="mb-3 text-sm font-semibold text-text-dark">
                  Retention potential — not yet confirmed
                </p>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                  Available evidence
                </p>
                <p className="mb-3 text-sm text-text-muted">
                  Existing building form and primary construction material support preliminary
                  retention screening.
                </p>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                  Verification
                </p>
                <p className="text-sm text-text-muted">
                  Structural condition and capacity require professional verification before
                  retention decisions.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4 md:border-t-0 md:pt-0 md:pl-2">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-text-dark">Material reuse</h3>
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-800">
                    Preliminary
                  </span>
                </div>
                <p className="mb-3 text-sm font-semibold text-text-dark">
                  Preliminary reuse potential
                </p>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                  Available evidence
                </p>
                <p className="mb-3 text-sm text-text-muted">
                  Known material categories can indicate where reuse or recovery may be worth
                  investigating.
                </p>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                  Verification
                </p>
                <p className="text-sm text-text-muted">
                  Material quantities, condition and recoverability require additional documentation
                  or survey.
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm text-text-muted">
              These indicators support early-stage prioritisation and do not replace specialist
              assessment.
            </p>
          </div>

          {/* Renovation Pathway */}
          <div className="mb-8 rounded-card bg-white p-6 shadow-md sm:p-8">
            <h2 className="mb-2 text-2xl font-bold text-text-dark">Renovation Pathway</h2>
            <p className="mb-8 max-w-3xl text-sm text-text-muted sm:text-base">
              Vacancy.Cloud brings the assessment findings together into a prioritised sequence of
              next actions.
            </p>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-4">
              {/* 1 */}
              <div className="relative min-w-0 border-t border-gray-100 pt-4 lg:border-t-0 lg:border-r lg:border-gray-100 lg:pt-0 lg:pr-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    01
                  </span>
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    Next action
                  </span>
                </div>
                <h3 className="mb-2 text-base font-bold text-text-dark">
                  Verify critical unknowns
                </h3>
                <p className="mb-3 text-sm text-text-muted">
                  Confirm decision-critical missing inputs before refining the pathway.
                </p>
                <ul className="space-y-1.5 text-sm text-text-muted">
                  <li>Roof / top floor thermal data</li>
                  <li>Wall build-up and insulation</li>
                  <li>Window performance</li>
                  <li>Floor / basement insulation</li>
                  <li>Ventilation system data</li>
                  <li>Applicable regulatory target</li>
                </ul>
              </div>

              {/* 2 */}
              <div className="relative min-w-0 border-t border-gray-100 pt-4 lg:border-t-0 lg:border-r lg:border-gray-100 lg:pt-0 lg:px-3">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    02
                  </span>
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                    Depends on verification
                  </span>
                </div>
                <h3 className="mb-2 text-base font-bold text-text-dark">
                  Confirm performance gaps
                </h3>
                <p className="mb-3 text-sm text-text-muted">
                  Compare verified current-state data with the applicable target at component level.
                </p>
                <ul className="space-y-1.5 text-sm text-text-muted">
                  <li>Gap confirmed</li>
                  <li>No gap identified</li>
                  <li>Further data required</li>
                </ul>
                <p className="mt-3 text-[11px] text-text-muted">
                  Outcomes are shown only after comparable current and target values exist.
                </p>
              </div>

              {/* 3 */}
              <div className="relative min-w-0 border-t border-gray-100 pt-4 lg:border-t-0 lg:border-r lg:border-gray-100 lg:pt-0 lg:px-3">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    03
                  </span>
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                    Follows confirmed gaps
                  </span>
                </div>
                <h3 className="mb-2 text-base font-bold text-text-dark">
                  Define improvement areas
                </h3>
                <p className="mb-3 text-sm text-text-muted">
                  Identify which building components require intervention and prioritise them
                  according to relevance and dependencies.
                </p>
                <ul className="mb-3 space-y-1.5 text-sm text-text-muted">
                  <li>Improve envelope performance</li>
                  <li>Upgrade windows / doors where required</li>
                  <li>Review heating requirements after demand reduction</li>
                  <li>Review ventilation requirements</li>
                </ul>
                <p className="text-[11px] font-medium text-text-dark">
                  Envelope demand reduction
                  <span className="mx-1.5 text-text-muted" aria-hidden="true">
                    →
                  </span>
                  Heating / system review
                </p>
              </div>

              {/* 4 */}
              <div className="relative min-w-0 border-t border-gray-100 pt-4 lg:border-t-0 lg:pt-0 lg:pl-3">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    04
                  </span>
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                    Later stage
                  </span>
                </div>
                <h3 className="mb-2 text-base font-bold text-text-dark">
                  Proceed to professional planning
                </h3>
                <p className="mb-3 text-sm text-text-muted">
                  Use the screened pathway as a focused basis for detailed professional due diligence
                  and renovation planning.
                </p>
                <ul className="space-y-1.5 text-sm text-text-muted">
                  <li>Energy consultant</li>
                  <li>Structural engineer</li>
                  <li>HazMat specialist</li>
                  <li>Architect / renovation team</li>
                </ul>
              </div>
            </div>

            <p className="mt-6 text-sm text-text-muted">
              The pathway is refined as verified building data becomes available.
            </p>
          </div>

          <p className="mt-8 mb-2 max-w-3xl text-sm text-text-muted">
            Vacancy.Cloud provides early-stage decision support. Detailed technical, regulatory and
            renovation decisions remain subject to professional verification.
          </p>
          </>
          )}

          {activeTab === 'location' && (
            <>
          {/* Mapbox Map - Full Width */}
          <div className="mt-0">
            <div className="bg-white rounded-card p-6 shadow-md">
              <h2 className="text-2xl font-bold text-text-dark mb-4">Location</h2>
              <div className="relative">
                <div 
                  ref={mapContainer} 
                  className="w-full h-[min(70vh,720px)] rounded-lg overflow-hidden"
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

            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BuildingDetail;
