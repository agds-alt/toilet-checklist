// lib/utils/reverse-geocoding.ts

interface ReverseGeocodeResult {
    address: string;
    city: string;
    country: string;
    formatted: string;
}

/**
 * Get address from GPS coordinates menggunakan Nominatim (OpenStreetMap)
 * FREE API - no key required!
 */
export async function reverseGeocode(
    latitude: number,
    longitude: number
): Promise<ReverseGeocodeResult> {
    try {
        // Nominatim API (gratis, no API key needed)
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'ProserviceToiletChecklist/1.0', // Required by Nominatim
            },
        });

        if (!response.ok) {
            throw new Error('Gagal mendapatkan alamat');
        }

        const data = await response.json();

        // Parse address components
        const address = data.address || {};

        // Build formatted address
        const parts = [
            address.road || address.suburb,
            address.city || address.town || address.village,
            address.state,
            address.country,
        ].filter(Boolean);

        return {
            address: address.road || address.suburb || 'Unknown',
            city: address.city || address.town || address.village || 'Unknown',
            country: address.country || 'Unknown',
            formatted: parts.join(', '),
        };
    } catch (error) {
        console.error('Reverse geocoding error:', error);

        // Fallback to coordinates string
        return {
            address: 'GPS Location',
            city: 'Unknown',
            country: 'Unknown',
            formatted: `${latitude.toFixed(6)}°, ${longitude.toFixed(6)}°`,
        };
    }
}

/**
 * Calculate distance between two GPS points (Haversine formula)
 * Returns distance in meters
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

/**
 * Validate if GPS location is within acceptable range of expected location
 * Useful for fraud prevention
 */
export function validateLocation(
    actualLat: number,
    actualLon: number,
    expectedLat: number,
    expectedLon: number,
    maxDistanceMeters: number = 100 // Default 100m radius
): {
    valid: boolean;
    distance: number;
    message: string;
} {
    const distance = calculateDistance(actualLat, actualLon, expectedLat, expectedLon);

    return {
        valid: distance <= maxDistanceMeters,
        distance: Math.round(distance),
        message:
            distance <= maxDistanceMeters
                ? `Lokasi valid (${Math.round(distance)}m dari target)`
                : `⚠️ Lokasi terlalu jauh (${Math.round(distance)}m dari target). Harap foto di lokasi yang benar.`,
    };
}