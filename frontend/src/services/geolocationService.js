import { Geolocation } from '@capacitor/geolocation';

/**
 * Mobile geolocation service
 * Useful for finding nearby nutritionists or health centers
 */

export const geolocationService = {
  /**
   * Get current device location
   */
  async getCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      return {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        accuracy: coordinates.coords.accuracy,
        timestamp: coordinates.timestamp,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  },

  /**
   * Watch device location (continuous updates)
   */
  watchLocation(callback, errorCallback) {
    let watchId = null;

    try {
      watchId = Geolocation.watchPosition({}, (position, err) => {
        if (err) {
          console.error('Location watch error:', err);
          if (errorCallback) errorCallback(err);
          return;
        }

        if (position) {
          callback({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        }
      });

      return watchId;
    } catch (error) {
      console.error('Error watching location:', error);
      if (errorCallback) errorCallback(error);
      return null;
    }
  },

  /**
   * Clear location watch
   */
  clearWatch(watchId) {
    if (watchId !== null && watchId !== undefined) {
      Geolocation.clearWatch({ id: watchId }).catch((error) => {
        console.error('Error clearing watch:', error);
      });
    }
  },

  /**
   * Calculate distance between two coordinates (in km)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },
};
