
import { useEffect, useMemo, useRef, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import * as Network from 'expo-network';
import * as Location from 'expo-location';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import { Platform } from 'react-native';
import { getFreeStorageMB } from '../utils/storage';
import { backgroundGpsManager, GpsSample } from '../utils/backgroundGps';

type SensorSample = {
  t: number; // timestamp ms
  type: 'accelerometer' | 'gyroscope' | 'magnetometer';
  x: number;
  y: number;
  z: number;
};

type RecorderResult = {
  rideId: string;
  sensorCsvPath: string;
  gpsCsvPath: string;
  metadata: Record<string, any>;
};

export function useSensorRecorder(vehicle: string, enableBackgroundGps: boolean = false) {
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
  const backgroundGpsEnabledRef = useRef<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const mb = await getFreeStorageMB();
        if (mb < 20) {
          setError('Insufficient local storage. At least 20MB free is required.');
          setCanRecord(false);
          return;
        }
        const { status: motionStatus } = await Location.getForegroundPermissionsAsync();
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

      sensorDataRef.current = [];
      gpsDataRef.current = [];
      backgroundGpsEnabledRef.current = enableBackgroundGps;

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

      (sensorIntervalRef as any).current = { accelSub, gyroSub, magSub };

      const startGps = async () => {
        try {
          const online = await isOnline();
          if (!online) {
            await stopGps();
            return;
          }
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log('Location permission denied, GPS will be skipped while recording.');
            return;
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

          if (enableBackgroundGps) {
            console.log('[useSensorRecorder] Starting background GPS tracking...');
            const bgResult = await backgroundGpsManager.startBackgroundTracking();
            if (bgResult.success) {
              console.log('[useSensorRecorder] Background GPS started successfully');
            } else {
              console.log('[useSensorRecorder] Background GPS failed to start, continuing with foreground only');
            }
          }
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
        } catch (e) {
          console.log('stopGps error', e);
        }
      };

      const sub = Network.addNetworkStateListener(async (state) => {
        const online = !!(state.isConnected && state.isInternetReachable !== false);
        if (online) {
          await startGps();
        } else {
          await stopGps();
        }
      });
      networkUnsubRef.current = () => sub.remove();

      await startGps();

      await FileSystem.writeAsStringAsync(sensorCsvPathRef.current, 'timestamp_ms,sensor,x,y,z');
      await FileSystem.writeAsStringAsync(gpsCsvPathRef.current, 'timestamp_ms,latitude,longitude,accuracy,altitude,speed');

      flushTimerRef.current = setInterval(writeCsvSnapshot, 5000) as any;

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

      if (locationSubRef.current) {
        try {
          locationSubRef.current.remove();
        } catch (e) {
          console.log('stopAll locationSub.remove error', e);
        }
        locationSubRef.current = null;
      }

      if (backgroundGpsEnabledRef.current) {
        console.log('[useSensorRecorder] Stopping background GPS tracking...');
        const backgroundGpsData = await backgroundGpsManager.stopBackgroundTracking();
        if (backgroundGpsData.length > 0) {
          const existingGps = gpsDataRef.current;
          const mergedGps = [...existingGps];
          for (const sample of backgroundGpsData) {
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
          console.log(`[useSensorRecorder] Merged ${backgroundGpsData.length} background GPS points, ${mergedGps.length} total`);
        }
      }

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
    } catch (e) {
      console.log('stopAll error', e);
    }
  };

  const stopRecording = async (): Promise<RecorderResult | null> => {
    try {
      await stopAll();
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
        backgroundGpsEnabled: backgroundGpsEnabledRef.current,
        versions: {
          expo: (globalThis as any)?.Expo ? 'expo' : 'unknown',
        },
      };

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
