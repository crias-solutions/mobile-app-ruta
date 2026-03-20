
import * as FileSystem from 'expo-file-system/legacy';
import * as Network from 'expo-network';
import { Alert } from 'react-native';
import { insertRideUpload } from './supabaseRest';

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

  const { trimmedCsv: gpsCsvTrimmed, newCount: gpsCountTrimmed, newStartTime: gpsStartTime } = stripEndpointGpsPoints(gpsCsv);
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

type GpsTrimResult = {
  trimmedCsv: string;
  newCount: number;
  newStartTime: number;
};

function stripEndpointGpsPoints(gpsCsv: string): GpsTrimResult {
  const lines = gpsCsv.trim().split('\n');
  if (lines.length === 0) {
    return { trimmedCsv: gpsCsv, newCount: 0, newStartTime: 0 };
  }
  const header = lines[0];
  const dataLines = lines.slice(1);

  if (dataLines.length <= 2) {
    const newCount = dataLines.length;
    const newStartTime = dataLines.length > 0 ? Number(dataLines[0].split(',')[0]) || 0 : 0;
    return { trimmedCsv: gpsCsv, newCount, newStartTime };
  }

  const trimmed = dataLines.slice(1, -1);
  const newCount = trimmed.length;
  const newStartTime = trimmed.length > 0 ? Number(trimmed[0].split(',')[0]) || 0 : 0;
  const trimmedCsv = [header, ...trimmed].join('\n');

  return { trimmedCsv, newCount, newStartTime };
}
