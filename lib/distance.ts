// Haversine formula to calculate the distance between two points (lat/lon)
export function haversineDistance(
    lat1: number, // Latitude of the first point
    lon1: number, // Longitude of the first point
    lat2: number, // Latitude of the second point
    lon2: number  // Longitude of the second point
  ): number {
    // Helper function to convert degrees to radians
    const toRad = (value: number) => (value * Math.PI) / 180;
  
    // Radius of the Earth in kilometers (you can change this for miles, etc.)
    const R = 6371;
  
    // Calculate the differences in latitude and longitude
    const dLat = toRad(lat2 - lat1); // Difference in latitude
    const dLon = toRad(lon2 - lon1); // Difference in longitude
  
    // Haversine formula
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    // The central angle (the "great-circle distance")
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    // Distance between the two points in kilometers
    return R * c; // The result is in kilometers
  }
  