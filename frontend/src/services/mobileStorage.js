import { Preferences } from '@capacitor/preferences';
import { App } from '@capacitor/app';

/**
 * Mobile storage service using Capacitor Preferences
 * Provides consistent storage API for both web and mobile
 */

export const mobileStorage = {
  /**
   * Get a value from storage
   */
  async get(key) {
    try {
      const { value } = await Preferences.get({ key });
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn(`Error retrieving ${key}:`, error);
      return null;
    }
  },

  /**
   * Set a value in storage
   */
  async set(key, value) {
    try {
      await Preferences.set({
        key,
        value: JSON.stringify(value),
      });
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  },

  /**
   * Remove a value from storage
   */
  async remove(key) {
    try {
      await Preferences.remove({ key });
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },

  /**
   * Clear all storage
   */
  async clear() {
    try {
      await Preferences.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  /**
   * Get all keys
   */
  async keys() {
    try {
      const { keys } = await Preferences.keys();
      return keys;
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  },
};

/**
 * Initialize mobile app features
 */
export const initializeMobileApp = async () => {
  try {
    // Handle back button on Android
    App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp();
      } else {
        window.history.back();
      }
    });

    // Handle app pause/resume if needed
    App.addListener('pause', () => {
      console.log('App paused');
    });

    App.addListener('resume', () => {
      console.log('App resumed');
    });
  } catch (error) {
    console.warn('Mobile initialization warning:', error);
  }
};

/**
 * Check if running on mobile platform
 */
export const isMobileApp = () => {
  return (
    window.capacitor !== undefined ||
    window.ionic !== undefined ||
    /android|iphone|ipad|ipod|blackberry|windows phone/.test(
      navigator.userAgent.toLowerCase()
    )
  );
};

/**
 * Get device info
 */
export const getDeviceInfo = async () => {
  try {
    const { Device } = await import('@capacitor/device');
    return await Device.getInfo();
  } catch (error) {
    console.warn('Could not get device info:', error);
    return null;
  }
};
