import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_LOCATION_TASK = 'background-location-task';
const GPS_STORAGE_KEY = 'gps_background_data';

export type GpsSample = {
  t: number;
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  altitude?: number | null;
  speed?: number | null;
};

class BackgroundGPSManager {
  private isInitialized = false;
  private isTaskDefined = false;

  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return this.isTaskDefined;
    }

    try {
      const isAvailable = await TaskManager.isAvailableAsync();
      if (!isAvailable) {
        console.log('[BackgroundGPS] TaskManager not available on this platform');
        this.isInitialized = true;
        return false;
      }

      if (this.isTaskDefined) {
        this.isInitialized = true;
        return true;
      }

      TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
        if (error) {
          console.log('[BackgroundGPS] Task error:', error);
          return;
        }
        if (data) {
          const { locations } = data as { locations: Location.LocationObject[] };
          if (locations && locations.length > 0) {
            try {
              const existingData = await AsyncStorage.getItem(GPS_STORAGE_KEY);
              const existingGps: GpsSample[] = existingData ? JSON.parse(existingData) : [];
              const newGps: GpsSample[] = locations.map((loc) => ({
                t: loc.timestamp,
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                accuracy: loc.coords.accuracy,
                altitude: loc.coords.altitude,
                speed: loc.coords.speed,
              }));
              await AsyncStorage.setItem(GPS_STORAGE_KEY, JSON.stringify([...existingGps, ...newGps]));
            } catch (e) {
              console.log('[BackgroundGPS] Error storing GPS:', e);
            }
          }
        }
      });

      this.isTaskDefined = true;
      console.log('[BackgroundGPS] Task defined successfully');
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.log('[BackgroundGPS] Failed to initialize:', error);
      this.isInitialized = true;
      return false;
    }
  }

  async startBackgroundTracking(): Promise<{ success: boolean; backgroundGps: GpsSample[] }> {
    try {
      await AsyncStorage.removeItem(GPS_STORAGE_KEY);

      const bgStatus = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus.status !== 'granted') {
        console.log('[BackgroundGPS] Background permission not granted');
        return { success: false, backgroundGps: [] };
      }

      if (!this.isTaskDefined) {
        const initialized = await this.initialize();
        if (!initialized) {
          console.log('[BackgroundGPS] Failed to initialize task manager');
          return { success: false, backgroundGps: [] };
        }
      }

      await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 1000,
        distanceInterval: 1,
        foregroundService: {
          notificationTitle: 'RUTA Recording',
          notificationBody: 'Recording your trip in the background',
          notificationColor: '#1A1A2E',
        },
        pausesUpdatesAutomatically: false,
        showsBackgroundLocationIndicator: true,
      });

      console.log('[BackgroundGPS] Background tracking started');
      return { success: true, backgroundGps: [] };
    } catch (error) {
      console.log('[BackgroundGPS] Failed to start background tracking:', error);
      return { success: false, backgroundGps: [] };
    }
  }

  async stopBackgroundTracking(): Promise<GpsSample[]> {
    try {
      const isRunning = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
      if (isRunning) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
        console.log('[BackgroundGPS] Background tracking stopped');
      }
    } catch (error) {
      console.log('[BackgroundGPS] Error stopping background tracking:', error);
    }

    try {
      const bgGpsData = await AsyncStorage.getItem(GPS_STORAGE_KEY);
      if (bgGpsData) {
        const bgGps: GpsSample[] = JSON.parse(bgGpsData);
        console.log(`[BackgroundGPS] Retrieved ${bgGps.length} background GPS points`);
        await AsyncStorage.removeItem(GPS_STORAGE_KEY);
        return bgGps;
      }
    } catch (error) {
      console.log('[BackgroundGPS] Error reading background GPS data:', error);
    }

    return [];
  }

  async isBackgroundTrackingRunning(): Promise<boolean> {
    try {
      return await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
    } catch {
      return false;
    }
  }
}

export const backgroundGpsManager = new BackgroundGPSManager();
