
import { useEffect, useMemo, useRef, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import * as Network from 'expo-network';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import { Platform, AppState, AppStateStatus } from 'react-native';
import { getFreeStorageMB } from '../utils/storage';

const BACKGROUND_LOCATION_TASK = 'background-location-task';
const GPS_STORAGE_KEY = 'gps_background_data';

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.log('Background location task error:', error);
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
        console.log('Error storing background GPS:', e);
      }
    }
  }
});

type SensorSample = {
  t: number; // timestamp ms
  type: 'accelerometer' | 'gyroscope' | 'magnetometer';
  x: number;
  y: number;
  z: number;
};

type GpsSample = {
  t: number;
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  altitude?: number | null;
  speed?: number | null;
};

type RecorderResult = {
  rideId: string;
  sensorCsvPath: string;
  gpsCsvPath: string;
  metadata: Record<string, any>;
};

export function useSensorRecorder(vehicle: string) {
  const [isRecording, setIsRecording] = useState(false);
  const [canRecord, setCanRecord] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rideIdRef = useRef<string | null>(null);
  const sensorDataRef = useRef<SensorSample[]>([]);
  const gpsDataRef = useRef<GpsSample[]>([]);
  const networkUnsubRef = useRef<(() => void) | null>(null);
  const locationSubRef = useRef<Location.LocationSubscription | null>(null);
  const sensorIntervalRef = useRef<NodeJS.Timer | null>(null);
  const sensorCsvPathRef = useRef<string>('');
  const gpsCsvPathRef = useRef<string>('');
  const flushTimerRef = useRef<NodeJS.Timer | null>(null);
  const appStateSubRef = useRef<(() => void) | null>(null);
  const isRecordingRef = useRef<boolean>(false);

  const startGps = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied, GPS will be skipped while recording.');
        return;
      }
      
      await AsyncStorage.removeItem(GPS_STORAGE_KEY);
      
      const bgStatus = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus.status !== 'granted') {
        console.log('Background location permission not granted, GPS will stop when app is backgrounded.');
      } else {
        try {
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
          console.log('Background location updates started');
        } catch (bgError) {
          console.log('Failed to start background location updates:', bgError);
        }
      }
      
      if (locationSubRef.current) return;
      locationSubRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 1000, distanceInterval: 1 },
        (loc) => {
          const c = loc.coords;
          gpsDataRef.current.push({
            t: Date.now(),
            latitude: c.latitude,
            longitude: c.longitude,
            accuracy: c.accuracy,
            altitude: c.altitude,
            speed: c.speed,
          });
        }
      );
    } catch (e) {
      console.log('startGps error', e);
    }
  };

  const stopGps = async () => {
    try {
      if (locationSubRef.current) {
        locationSubRef.current.remove();
        locationSubRef.current = null;
      }
      try {
        const isRunning = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
        if (isRunning) {
          await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
          console.log('Background location updates stopped');
        }
      } catch (e) {
        console.log('Error stopping background location:', e);
      }
    } catch (e) {
      console.log('stopGps error', e);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const mb = await getFreeStorageMB();
        if (mb < 20) {
          setError('Insufficient local storage. At least 20MB free is required.');
          setCanRecord(false);
          return;
        }
        // Permissions
        const { status: motionStatus } = await Location.getForegroundPermissionsAsync();
        // We'll request location on start conditionally; not here.
        // Sensors don't need explicit permission on iOS/Android in Expo.
        setCanRecord(true);
      } catch (e) {
        console.log('init check error', e);
        setCanRecord(false);
      }
    })();

    return () => {
      stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && isRecordingRef.current && !locationSubRef.current) {
        console.log('App came to foreground, resuming GPS tracking...');
        startGps();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    appStateSubRef.current = () => subscription.remove();

    return () => {
      subscription.remove();
    };
  }, []);

  const isOnline = async () => {
    try {
      const state = await Network.getNetworkStateAsync();
      return !!(state.isConnected && state.isInternetReachable !== false);
    } catch {
      return false;
    }
  };

  const ensureDirs = async (rideId: string) => {
    const ridesDir = FileSystem.documentDirectory + 'rides';
    const currentDir = `${ridesDir}/${rideId}`;
    const dirInfo = await FileSystem.getInfoAsync(ridesDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(ridesDir, { intermediates: true });
    }
    const currentDirInfo = await FileSystem.getInfoAsync(currentDir);
    if (!currentDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(currentDir, { intermediates: true });
    }
    return currentDir;
  };

  const writeCsvSnapshot = async () => {
    try {
      const sensors = sensorDataRef.current;
      const gps = gpsDataRef.current;

      const sensorsCsv = ['timestamp_ms,sensor,x,y,z', ...sensors.map(s => `${s.t},${s.type},${s.x},${s.y},${s.z}`)].join('\n');
      const gpsCsv = ['timestamp_ms,latitude,longitude,accuracy,altitude,speed', ...gps.map(g => `${g.t},${g.latitude},${g.longitude},${g.accuracy ?? ''},${g.altitude ?? ''},${g.speed ?? ''}`)].join('\n');

      await FileSystem.writeAsStringAsync(sensorCsvPathRef.current, sensorsCsv);
      await FileSystem.writeAsStringAsync(gpsCsvPathRef.current, gpsCsv);
    } catch (e) {
      console.log('writeCsvSnapshot error', e);
    }
  };

  const startRecording = async (): Promise<boolean> => {
    try {
      setError(null);
      const mb = await getFreeStorageMB();
      if (mb < 20) {
        setError('Insufficient local storage. At least 20MB free is required.');
        return false;
      }

      const id = `${Date.now()}_${vehicle}`;
      rideIdRef.current = id;
      const dir = await ensureDirs(id);
      sensorCsvPathRef.current = `${dir}/sensor.csv`;
      gpsCsvPathRef.current = `${dir}/gps.csv`;

      // Initialize buffers
      sensorDataRef.current = [];
      gpsDataRef.current = [];

      // Start sensors
      Accelerometer.setUpdateInterval(100);
      Gyroscope.setUpdateInterval(100);
      Magnetometer.setUpdateInterval(100);

      const accelSub = Accelerometer.addListener(({ x, y, z }) => {
        sensorDataRef.current.push({ t: Date.now(), type: 'accelerometer', x, y, z });
      });
      const gyroSub = Gyroscope.addListener(({ x, y, z }) => {
        sensorDataRef.current.push({ t: Date.now(), type: 'gyroscope', x, y, z });
      });
      const magSub = Magnetometer.addListener(({ x, y, z }) => {
        sensorDataRef.current.push({ t: Date.now(), type: 'magnetometer', x, y, z });
      });

      // Keep references by using closure to stop when needed
      (sensorIntervalRef as any).current = { accelSub, gyroSub, magSub };

      // Kick off initial GPS state:
      await startGps();

      // Initial CSV headers
      await FileSystem.writeAsStringAsync(sensorCsvPathRef.current, 'timestamp_ms,sensor,x,y,z');
      await FileSystem.writeAsStringAsync(gpsCsvPathRef.current, 'timestamp_ms,latitude,longitude,accuracy,altitude,speed');

      // Periodic snapshot flushing to persist progress
      flushTimerRef.current = setInterval(writeCsvSnapshot, 5000) as any;

      isRecordingRef.current = true;
      setIsRecording(true);
      return true;
    } catch (e: any) {
      console.log('startRecording error', e);
      setError(e?.message || 'Unknown error starting recording');
      return false;
    }
  };

  const stopAll = async () => {
    try {
      // Stop sensors
      const subs: any = (sensorIntervalRef as any).current;
      if (subs) {
        try {
          subs.accelSub && subs.accelSub.remove();
        } catch (e) {
          console.log('stopAll accelSub.remove error', e);
        }
        try {
          subs.gyroSub && subs.gyroSub.remove();
        } catch (e) {
          console.log('stopAll gyroSub.remove error', e);
        }
        try {
          subs.magSub && subs.magSub.remove();
        } catch (e) {
          console.log('stopAll magSub.remove error', e);
        }
        (sensorIntervalRef as any).current = null;
      }
      // Stop GPS
      if (locationSubRef.current) {
        try {
          locationSubRef.current.remove();
        } catch (e) {
          console.log('stopAll locationSub.remove error', e);
        }
        locationSubRef.current = null;
      }
      try {
        const isRunning = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
        if (isRunning) {
          await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
          console.log('Background location updates stopped in stopAll');
        }
      } catch (e) {
        console.log('stopAll background location error:', e);
      }
      // Stop network watcher
      if (networkUnsubRef.current) {
        try {
          networkUnsubRef.current();
        } catch (e) {
          console.log('stopAll networkUnsub error', e);
        }
        networkUnsubRef.current = null;
      }
      if (flushTimerRef.current) {
        clearInterval(flushTimerRef.current as any);
        flushTimerRef.current = null;
      }
      isRecordingRef.current = false;
    } catch (e) {
      console.log('stopAll error', e);
    }
  };

  const stopRecording = async (): Promise<RecorderResult | null> => {
    try {
      await stopAll();
      
      try {
        const bgGpsData = await AsyncStorage.getItem(GPS_STORAGE_KEY);
        if (bgGpsData) {
          const bgGps: GpsSample[] = JSON.parse(bgGpsData);
          const existingGps = gpsDataRef.current;
          const mergedGps = [...existingGps];
          for (const sample of bgGps) {
            const isDuplicate = existingGps.some(
              (existing) => 
                Math.abs(existing.latitude - sample.latitude) < 0.0001 && 
                Math.abs(existing.longitude - sample.longitude) < 0.0001
            );
            if (!isDuplicate) {
              mergedGps.push(sample);
            }
          }
          gpsDataRef.current = mergedGps;
          console.log(`Merged ${bgGps.length} background GPS points, ${mergedGps.length} total`);
        }
      } catch (e) {
        console.log('Error reading background GPS data:', e);
      }
      
      await writeCsvSnapshot();

      const rideId = rideIdRef.current!;
      setIsRecording(false);

      const metadata = {
        rideId,
        vehicle,
        platform: Platform.OS,
        startedAt: Number(rideId.split('_')[0]),
        sensorsCount: sensorDataRef.current.length,
        gpsCount: gpsDataRef.current.length,
        versions: {
          expo: (globalThis as any)?.Expo ? 'expo' : 'unknown',
        },
      };

      // Save metadata.json
      const dir = FileSystem.documentDirectory + 'rides/' + rideId;
      await FileSystem.writeAsStringAsync(dir + '/metadata.json', JSON.stringify(metadata, null, 2));

      return {
        rideId,
        sensorCsvPath: sensorCsvPathRef.current,
        gpsCsvPath: gpsCsvPathRef.current,
        metadata,
      };
    } catch (e) {
      console.log('stopRecording error', e);
      return null;
    }
  };

  const rideInfo = useMemo(() => ({ rideId: rideIdRef.current }), []);

  return {
    isRecording,
    canRecord,
    error,
    startRecording,
    stopRecording,
    rideInfo,
  };
}
