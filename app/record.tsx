
import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Alert, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Button from '../components/Button';
import SwipeToConfirm from '../components/SwipeToConfirm';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { useSensorRecorder } from '../hooks/useSensorRecorder';
import { CRIASLogo } from './_layout';
import * as Haptics from 'expo-haptics';

export default function RecordScreen() {
  const { vehicle } = useLocalSearchParams<{ vehicle?: string }>();
  const [started, setStarted] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const {
    isRecording,
    canRecord,
    error,
    startRecording,
    stopRecording,
    rideInfo,
  } = useSensorRecorder(vehicle || 'unknown');

  useEffect(() => {
    if (!vehicle) {
      Alert.alert('Vehicle missing', 'Please select a vehicle first.', [
        { text: 'OK', onPress: () => router.replace('/vehicle') },
      ]);
    }
  }, [vehicle]);

  useEffect(() => {
    if (error) {
      Alert.alert('Cannot start', error, [{ text: 'OK' }]);
    }
  }, [error]);

  const handleStart = async () => {
    if (!canRecord) {
      Alert.alert('Not ready', 'Sensors or storage are not available. Please try again.', [{ text: 'OK' }]);
      return;
    }
    console.log('Starting recording…');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const ok = await startRecording();
    if (ok) {
      setStarted(true);
    } else {
      Alert.alert('Failed to start', 'An error occurred while starting recording.');
    }
  };

  const confirmStop = () => {
    Alert.alert(
      'Stop recording?',
      'Are you sure you want to stop?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Stop',
          style: 'destructive',
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            setFinishing(true);
            const result = await stopRecording();
            setFinishing(false);

            if (result) {
              const { sensorCsvPath, gpsCsvPath } = result;
              Alert.alert(
                'Upload your ride?',
                'Would you like to upload your CSV data now? You can also share or save it.',
                [
                  {
                    text: 'Later',
                    onPress: () => {
                      askFeedback(result.rideId);
                    },
                  },
                  {
                    text: 'Upload',
                    onPress: async () => {
                      try {
                        const { uploadRide } = await import('../services/uploader');
                        await uploadRide({ sensorCsvPath, gpsCsvPath, metadata: result.metadata });
                        askFeedback(result.rideId);
                      } catch (e: any) {
                        Alert.alert('Upload failed', e?.message || 'Unknown error');
                        askFeedback(result.rideId);
                      }
                    },
                  },
                ]
              );
            } else {
              Alert.alert('Stop failed', 'Could not finalize the ride.');
            }
          },
        },
      ]
    );
  };

  const askFeedback = (rideId: string) => {
    Alert.alert(
      'Local feedback',
      'Show a simple, visual-only summary from your collected data on-device?',
      [
        { text: 'No', onPress: () => router.replace('/vehicle') },
        { text: 'Yes', onPress: () => router.replace({ pathname: '/feedback', params: { rideId } }) },
      ]
    );
  };

  if (!started) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={[commonStyles.content, { padding: 20 }]}>
          <Text style={commonStyles.title}>Ready to ride</Text>
          <Text style={commonStyles.text}>
            Vehicle: {vehicle}
          </Text>
          <Text style={[commonStyles.text, { marginTop: 10 }]}>
            Recording includes accelerometer, gyroscope, magnetometer (continuous), and GPS only while online. Data is
            stored locally as CSV during the ride. You will choose to upload after stopping.
          </Text>
          <Button text="Start" onPress={handleStart} style={[buttonStyles.instructionsButton, { marginTop: 20 }]} />
          <Button text="Back" onPress={() => router.back()} style={[buttonStyles.backButton, { marginTop: 10 }]} />
          
          {/* CRIAS Solutions Logo at bottom of page content */}
          <CRIASLogo />
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={[commonStyles.container, { padding: 20 }]}>
      <View style={{ width: '100%', maxWidth: 800, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Text style={commonStyles.title}>Recording…</Text>
        <Text style={commonStyles.text}>The UI is minimized to reduce resource usage.</Text>
        <ActivityIndicator style={{ marginVertical: 20 }} color={colors.accent} />
        <Button text="Stop" onPress={confirmStop} style={[buttonStyles.instructionsButton, { backgroundColor: '#8e24aa' }]} />
        <View style={{ height: 24 }} />
        <SwipeToConfirm
          text="Swipe to Stop"
          trackColor="#1e2a44"
          thumbColor="#64B5F6"
          onConfirmed={confirmStop}
        />
        {finishing && <Text style={[commonStyles.text, { marginTop: 10 }]}>Finalizing files…</Text>}
      </View>
    </View>
  );
}
