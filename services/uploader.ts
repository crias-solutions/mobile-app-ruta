
import * as FileSystem from 'expo-file-system/legacy';
import * as Network from 'expo-network';
import { Alert } from 'react-native';
import { insertRideUpload } from './supabaseRest';
import i18n from '../utils/i18n';

interface GpsPoint {
  t: number;
  latitude: number;
  longitude: number;
  speed: number | null;
}

type UploadArgs = {
  sensorCsvPath: string;
  gpsCsvPath: string;
  metadata: Record<string, any>;
};

export async function uploadRide({ sensorCsvPath, gpsCsvPath, metadata }: UploadArgs) {
  console.log('uploadRide called', { sensorCsvPath, gpsCsvPath });

  try {
    const state = await Network.getNetworkStateAsync();
    const online = !!(state.isConnected && state.isInternetReachable !== false);
    if (!online) {
      Alert.alert('Offline', 'You appear to be offline. Please connect to the internet and try again.');
      return;
    }
  } catch (e) {
    console.log('Network state error', e);
  }

  let sensorCsv = '';
  try {
    sensorCsv = await FileSystem.readAsStringAsync(sensorCsvPath);
  } catch (e) {
    console.log('Failed to read sensor CSV', e);
    Alert.alert('Read error', 'Could not read the sensor CSV file from local storage.');
    return;
  }
  let gpsCsv = '';
  try {
    gpsCsv = await FileSystem.readAsStringAsync(gpsCsvPath);
  } catch (e) {
    console.log('Failed to read GPS CSV', e);
    Alert.alert('Read error', 'Could not read the GPS CSV file from local storage.');
    return;
  }

  const { trimmedCsv: gpsCsvTrimmed, newCount: gpsCountTrimmed, newStartTime: gpsStartTime, shouldUpload } = stripEndpointGpsPoints(gpsCsv);

  if (!shouldUpload) {
    console.log('GPS points overlap too close (< 400m between start/end), skipping upload');
    Alert.alert(
      i18n.t('feedback.uploadSkipped'),
      i18n.t('feedback.uploadSkippedMessage')
    );
    return;
  }

  const metadataUpdated: Record<string, any> = { ...metadata };
  metadataUpdated.gpsCount = gpsCountTrimmed;
  metadataUpdated.startedAt = gpsStartTime;

  const rideId: string = metadataUpdated?.rideId || extractRideIdFromPath(sensorCsvPath) || `${Date.now()}`;
  const row = {
    ride_id: rideId,
    vehicle: metadataUpdated?.vehicle || null,
    platform: metadataUpdated?.platform || null,
    started_at: gpsStartTime ? new Date(gpsStartTime).toISOString() : null,
    sensors_count: Number.isFinite(metadataUpdated?.sensorsCount) ? Number(metadataUpdated.sensorsCount) : null,
    gps_count: gpsCountTrimmed,
    metadata: metadataUpdated || null,
    sensor_csv: sensorCsv,
    gps_csv: gpsCsvTrimmed,
  };

  try {
    const inserted = await insertRideUpload(row);
    console.log('Ride uploaded to Supabase', inserted);
    Alert.alert('Upload complete', 'Your ride CSV data has been synced to Supabase successfully.');
    return inserted;
  } catch (e: any) {
    console.log('Supabase upload failed', e);
    Alert.alert('Upload failed', e?.message || 'Unknown error uploading to Supabase.');
    return;
  }
}

function extractRideIdFromPath(p: string): string | null {
  try {
    const idx = p.lastIndexOf('/rides/');
    if (idx === -1) return null;
    const rest = p.slice(idx + '/rides/'.length);
    const parts = rest.split('/');
    if (parts.length >= 2) return parts[0];
    return null;
  } catch {
    return null;
  }
}

const RADIUS_KM = 0.2;
const OVERLAP_THRESHOLD_KM = 0.4;

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function stripEndpointGpsPoints(gpsCsv: string): GpsTrimResult {
  const lines = gpsCsv.trim().split('\n');
  if (lines.length === 0) {
    return { trimmedCsv: '', newCount: 0, newStartTime: 0, shouldUpload: false };
  }

  const header = lines[0];
  const dataLines = lines.slice(1);

  if (dataLines.length <= 2) {
    const newStartTime = dataLines.length > 0 ? Number(dataLines[0].split(',')[0]) || 0 : 0;
    return { trimmedCsv: '', newCount: 0, newStartTime, shouldUpload: false };
  }

  const points: GpsPoint[] = [];
  for (const line of dataLines) {
    const parts = line.trim().split(',');
    if (parts.length < 6) continue;
    const t = Number(parts[0]);
    const lat = Number(parts[1]);
    const lon = Number(parts[2]);
    const speed = parts[5] ? Number(parts[5]) : null;
    if (isNaN(t) || isNaN(lat) || isNaN(lon)) continue;
    points.push({ t, latitude: lat, longitude: lon, speed: isNaN(speed as number) ? null : speed });
  }

  if (points.length < 3) {
    const newStartTime = points.length > 0 ? points[0].t : 0;
    return { trimmedCsv: '', newCount: 0, newStartTime, shouldUpload: false };
  }

  const first = points[0];
  const last = points[points.length - 1];

  const distanceFirstToLast = haversineDistanceKm(
    first.latitude, first.longitude,
    last.latitude, last.longitude
  );

  if (distanceFirstToLast <= OVERLAP_THRESHOLD_KM) {
    return {
      trimmedCsv: '',
      newCount: 0,
      newStartTime: first.t,
      shouldUpload: false,
    };
  }

  const filtered: GpsPoint[] = [];
  for (const p of points) {
    const distFromFirst = haversineDistanceKm(
      first.latitude, first.longitude,
      p.latitude, p.longitude
    );
    const distFromLast = haversineDistanceKm(
      last.latitude, last.longitude,
      p.latitude, p.longitude
    );
    if (distFromFirst > RADIUS_KM && distFromLast > RADIUS_KM) {
      filtered.push(p);
    }
  }

  if (filtered.length === 0) {
    return {
      trimmedCsv: '',
      newCount: 0,
      newStartTime: first.t,
      shouldUpload: false,
    };
  }

  const trimmedLines = filtered.map(p =>
    `${p.t},${p.latitude},${p.longitude},,,,${p.speed ?? ''}`
  );
  const trimmedCsv = [header, ...trimmedLines].join('\n');
  const newCount = filtered.length;
  const newStartTime = filtered[0].t;

  return { trimmedCsv, newCount, newStartTime, shouldUpload: true };
}

type GpsTrimResult = {
  trimmedCsv: string;
  newCount: number;
  newStartTime: number;
  shouldUpload: boolean;
};
