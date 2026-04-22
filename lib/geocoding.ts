/**
 * Utility to convert a string address into { lat, lng } using Google Maps Geocoder.
 * Expects window.google to be available (loaded via APIProvider).
 */
export const getCoordinates = async (address: string): Promise<{ latitude: number; longitude: number } | null> => {
  // 1. Safety check: Ensure Google Maps is loaded and address isn't empty
  if (typeof window === "undefined" || !window.google || !address) {
    return null;
  }

  const geocoder = new window.google.maps.Geocoder();

  return new Promise((resolve) => {
    geocoder.geocode({ address }, (results, status) => {
      // 2. Check if the API returned a valid result
      if (status === "OK" && results && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        
        resolve({
          latitude: lat(),
          longitude: lng(),
        });
      } else {
        // 3. Handle cases where address isn't found or API fails
        console.warn(`Geocoding failed for address: ${address}. Status: ${status}`);
        resolve(null);
      }
    });
  });
};