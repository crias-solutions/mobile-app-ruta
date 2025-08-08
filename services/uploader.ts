
import * as FileSystem from 'expo-file-system';
import * as Network from 'expo-network';
import { Alert } from 'react-native';
import { insertRideUpload } from './supabaseRest';

type UploadArgs = {
  sensorCsvPath: string;
  gpsCsvPath: string;
  metadata: Record<string, any>;
};

/**
 * Uploads the ride CSVs and metadata to Supabase Postgres (ride_uploads).
 * Falls back with clear errors if offline or upload fails.
 */
export async function uploadRide({ sensorCsvPath, gpsCsvPath, metadata }: UploadArgs) {
  console.log('uploadRide called', { sensorCsvPath, gpsCsvPath });

  // Ensure network available
  try {
    const state = await Network.getNetworkStateAsync();
    const online = !!(state.isConnected && state.isInternetReachable !== false);
    if (!online) {
      Alert.alert('Offline', 'You appear to be offline. Please connect to the internet and try again.');
      return;
    }
  } catch (e) {
    console.log('Network state error', e);
    // Continue; fetch may still work
  }

  // Read CSV content
  let sensorCsv = '';
  let gpsCsv = '';
  try {
    sensorCsv = await FileSystem.readAsStringAsync(sensorCsvPath);
  } catch (e) {
    console.log('Failed to read sensor CSV', e);
    Alert.alert('Read error', 'Could not read the sensor CSV file from local storage.');
    return;
  }
  try {
    gpsCsv = await FileSystem.readAsStringAsync(gpsCsvPath);
  } catch (e) {
    console.log('Failed to read GPS CSV', e);
    Alert.alert('Read error', 'Could not read the GPS CSV file from local storage.');
    return;
  }

  // Prepare row
  const rideId: string = metadata?.rideId || extractRideIdFromPath(sensorCsvPath) || `${Date.now()}`;
  const startedAt: number | undefined = metadata?.startedAt;
  const row = {
    ride_id: rideId,
    vehicle: metadata?.vehicle || null,
    platform: metadata?.platform || null,
    started_at: startedAt ? new Date(startedAt).toISOString() : null,
    sensors_count: Number.isFinite(metadata?.sensorsCount) ? Number(metadata.sensorsCount) : null,
    gps_count: Number.isFinite(metadata?.gpsCount) ? Number(metadata.gpsCount) : null,
    metadata: metadata || null,
    sensor_csv: sensorCsv,
    gps_csv: gpsCsv,
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
    // /.../documentDirectory/rides/<rideId>/sensor.csv
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
