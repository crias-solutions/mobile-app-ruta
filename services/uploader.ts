
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

type UploadArgs = {
  sensorCsvPath: string;
  gpsCsvPath: string;
  metadata: Record<string, any>;
};

export async function uploadRide({ sensorCsvPath, gpsCsvPath, metadata }: UploadArgs) {
  console.log('uploadRide called', { sensorCsvPath, gpsCsvPath });
  // Modular backend adapter point:
  // Replace this function with your backend integration.
  // For now, we allow the user to share the files using the system share sheet.
  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    Alert.alert('Sharing not available', 'Your platform does not support sharing. Files remain saved locally.');
    return;
  }

  // Create a simple zip-like temp folder path? Sharing supports single file sharing typically.
  // We'll share the sensor CSV first and then the GPS CSV.
  await Sharing.shareAsync(sensorCsvPath, { dialogTitle: 'Share sensor CSV' });
  await Sharing.shareAsync(gpsCsvPath, { dialogTitle: 'Share GPS CSV' });

  // Also allow sharing metadata
  const dir = sensorCsvPath.split('/sensor.csv')[0];
  const metadataPath = dir + '/metadata.json';
  await FileSystem.writeAsStringAsync(metadataPath, JSON.stringify(metadata, null, 2));
  await Sharing.shareAsync(metadataPath, { dialogTitle: 'Share metadata JSON' });
}
