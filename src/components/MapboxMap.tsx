import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Building } from '../types';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
  buildings: Building[];
  selectedBuilding: Building | null;
  onBuildingSelect: (building: Building) => void;
}

const MapboxMap = ({ buildings, selectedBuilding, onBuildingSelect }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [10.2, 56.0], // Adjusted center for 3 buildings
      zoom: 7.5,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Wait for map to load
    map.current.on('load', () => {
      setIsMapLoaded(true);
      
      // Fit bounds to show all 3 buildings
      const bounds = new mapboxgl.LngLatBounds();
      buildings.forEach(building => {
        bounds.extend(building.coordinates);
      });
      
      map.current?.fitBounds(bounds, {
        padding: { top: 60, bottom: 60, left: 60, right: 60 },
        maxZoom: 10,
        duration: 1000
      });
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Create markers when map is loaded
  useEffect(() => {
    if (!isMapLoaded || !map.current || !buildings.length) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Create new markers for each building
    buildings.forEach((building) => {
      const [lng, lat] = building.coordinates;
      
      // ============================================
      // MARKER ROOT (owned by Mapbox - NO transforms)
      // ============================================
      const markerRoot = document.createElement('div');
      markerRoot.className = 'marker-root';
      markerRoot.style.position = 'relative';
      markerRoot.style.width = '0';
      markerRoot.style.height = '0';
      // NO transform, NO animation, NO scale on this element!

      // ============================================
      // MARKER INNER (all visual effects go here)
      // ============================================
      const markerInner = document.createElement('div');
      markerInner.className = 'marker-inner';
      markerInner.style.width = '22px';
      markerInner.style.height = '22px';
      markerInner.style.borderRadius = '50%';
      markerInner.style.backgroundColor = '#ef4444';
      markerInner.style.border = '3px solid white';
      markerInner.style.cursor = 'pointer';
      markerInner.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      markerInner.style.transition = 'transform 0.2s, background-color 0.2s';
      markerInner.style.position = 'absolute';
      markerInner.style.left = '-11px'; // Center the 22px circle
      markerInner.style.top = '-11px';
      markerInner.style.transform = 'translate(0, 0)'; // Initial transform (can be modified)
      markerInner.setAttribute('data-building-id', building.id);

      // Add pointer triangle (improves anchoring)
      const pointer = document.createElement('div');
      pointer.style.position = 'absolute';
      pointer.style.top = '100%';
      pointer.style.left = '50%';
      pointer.style.transform = 'translateX(-50%)';
      pointer.style.width = '0';
      pointer.style.height = '0';
      pointer.style.borderLeft = '5px solid transparent';
      pointer.style.borderRight = '5px solid transparent';
      pointer.style.borderTop = '8px solid #ef4444';
      pointer.style.filter = 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))';
      markerInner.appendChild(pointer);

      // Append inner to root
      markerRoot.appendChild(markerInner);

      // Hover effects (apply to markerInner, NOT markerRoot)
      markerInner.addEventListener('mouseenter', () => {
        if (selectedBuilding?.id !== building.id) {
          markerInner.style.transform = 'scale(1.3) translateY(-2px)';
        }
      });

      markerInner.addEventListener('mouseleave', () => {
        if (selectedBuilding?.id !== building.id) {
          markerInner.style.transform = 'scale(1) translateY(0)';
        }
      });

      // Create marker with BOTTOM anchor (Mapbox controls markerRoot positioning)
      const marker = new mapboxgl.Marker({ 
        element: markerRoot, // Use root element (no transforms)
        anchor: 'bottom'
      })
        .setLngLat([lng, lat])
        .addTo(map.current!);

      // Click handler (on markerInner)
      markerInner.addEventListener('click', () => {
        // Bounce animation (on markerInner, NOT markerRoot)
        markerInner.style.animation = 'bounce 0.6s ease';
        setTimeout(() => {
          markerInner.style.animation = '';
        }, 600);

        // Zoom to building
        map.current?.flyTo({
          center: [lng, lat],
          zoom: 13,
          duration: 1200,
          essential: true
        });

        onBuildingSelect(building);
      });

      markersRef.current.push(marker);
    });
  }, [isMapLoaded, buildings, onBuildingSelect, selectedBuilding]);

  // Update marker appearance when selection changes
  useEffect(() => {
    if (!map.current) return;

    const markerInners = mapContainer.current?.querySelectorAll('.marker-inner');
    markerInners?.forEach((markerInnerEl) => {
      const markerInner = markerInnerEl as HTMLElement;
      const buildingId = markerInner.getAttribute('data-building-id');
      const building = buildings.find(b => b.id === buildingId);

      if (!building) return;

      if (selectedBuilding?.id === building.id) {
        // Apply transforms to markerInner, NOT markerRoot
        markerInner.style.transform = 'scale(1.4) translateY(-3px)';
        markerInner.style.backgroundColor = '#dc2626';
        markerInner.style.zIndex = '1000';
        // Update pointer color
        const pointer = markerInner.querySelector('div');
        if (pointer) pointer.style.borderTopColor = '#dc2626';
      } else {
        markerInner.style.transform = 'scale(1) translateY(0)';
        markerInner.style.backgroundColor = '#ef4444';
        markerInner.style.zIndex = '1';
        const pointer = markerInner.querySelector('div');
        if (pointer) pointer.style.borderTopColor = '#ef4444';
      }
    });
  }, [selectedBuilding, buildings]);

  return (
    <div className="w-full h-full rounded-card overflow-hidden shadow-md" role="application" aria-label="Interactive map of sample aging buildings for renovation decision support">
      <div ref={mapContainer} className="w-full h-full" aria-label="Map container" />
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.2); }
        }
        
        /* Animation applies to marker-inner, NOT marker-root */
        .marker-inner {
          will-change: transform;
        }
        
        /* Marker root should never have transforms */
        .marker-root {
          /* Mapbox controls this element's transform - leave it alone! */
        }
      `}</style>
    </div>
  );
};

export default MapboxMap;
