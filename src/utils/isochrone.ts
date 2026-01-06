/**
 * Generate a sample isochrone polygon around a coordinate point
 * This simulates a 10-minute walking isochrone (approximately 600-800m radius)
 * In production, this would be fetched from OpenRouteService API
 */
export function generateSampleIsochrone(
  center: [number, number], // [lng, lat]
  radiusKm: number = 0.7 // ~10 minutes walking at 4 km/h
): GeoJSON.FeatureCollection {
  const [lng, lat] = center;
  const points = 64; // Number of points in the circle
  const coordinates: [number, number][] = [];

  // Generate a circular polygon
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    // Approximate km to degrees (1 degree ≈ 111 km)
    const deltaLng = (radiusKm / 111) * Math.cos(angle) / Math.cos(lat * Math.PI / 180);
    const deltaLat = radiusKm / 111 * Math.sin(angle);
    coordinates.push([lng + deltaLng, lat + deltaLat]);
  }

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          value: 600, // 10 minutes in seconds
          area: Math.PI * radiusKm * radiusKm, // Approximate area in km²
        },
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates],
        },
      },
    ],
  };
}

/**
 * Fetch isochrone from OpenRouteService API
 * Requires an API key from https://openrouteservice.org/
 */
export async function fetchIsochrone(
  coordinates: [number, number], // [lng, lat]
  rangeSeconds: number = 600, // 10 minutes
  profile: 'foot-walking' | 'cycling-regular' | 'driving-car' = 'foot-walking',
  apiKey?: string
): Promise<GeoJSON.FeatureCollection | null> {
  if (!apiKey) {
    console.warn('OpenRouteService API key not provided. Using sample isochrone.');
    return generateSampleIsochrone(coordinates);
  }

  try {
    const response = await fetch('https://api.openrouteservice.org/v2/isochrones/' + profile, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locations: [coordinates],
        range: [rangeSeconds],
        attributes: ['total_pop'], // Required by API format
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouteService API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data as GeoJSON.FeatureCollection;
  } catch (error) {
    console.error('Error fetching isochrone:', error);
    // Fallback to sample data
    return generateSampleIsochrone(coordinates);
  }
}

