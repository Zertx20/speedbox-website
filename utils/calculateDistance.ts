import { wilayaLocations } from '@/data/wilayas'; // Import Wilaya coordinates
import { haversineDistance } from '@/lib/distance'; // Import the distance calculation function

/**
 * Calculate the distance between two wilayas by name
 * @param {string} wilaya1 - Name of the first wilaya
 * @param {string} wilaya2 - Name of the second wilaya
 * @returns {number} - The distance between the two wilayas in kilometers
 */
export function calculateDistanceBetweenWilayas(wilaya1: string, wilaya2: string): number {
  // Look up the coordinates for both wilayas
  const { lat: lat1, lon: lon1 } = wilayaLocations[wilaya1]; // Get lat/lon for wilaya1
  const { lat: lat2, lon: lon2 } = wilayaLocations[wilaya2]; // Get lat/lon for wilaya2

  // Calculate the distance using the haversine formula and apply a 1.3 multiplier to account for real road distances
  return haversineDistance(lat1, lon1, lat2, lon2) * 1.2; // Return the result
}
