
import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Alert, Platform, ActivityIndicator, ScrollView, Switch } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Button from '../components/Button';
import SwipeToConfirm from '../components/SwipeToConfirm';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { useSensorRecorder } from '../hooks/useSensorRecorder';
import { usePersistentNotification } from '../hooks/usePersistentNotification';
import { CRIASLogo } from './_layout';
import * as Haptics from 'expo-haptics';
import i18n from '../utils/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_GPS_KEY = 'background_gps_enabled';

export default function RecordScreen() {
  const { vehicle } = useLocalSearchParams<{ vehicle?: string }>();
  const [started, setStarted] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [showFeedbackOptions, setShowFeedbackOptions] = useState(false);
  const [completedRideId, setCompletedRideId] = useState<string | null>(null);
  const [backgroundGpsEnabled, setBackgroundGpsEnabled] = useState(false);
  const [loadingBackgroundGps, setLoadingBackgroundGps] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(BACKGROUND_GPS_KEY);
        if (saved !== null) {
          setBackgroundGpsEnabled(saved === 'true');
        }
      } catch (e) {
        console.log('Error loading background GPS setting:', e);
      } finally {
        setLoadingBackgroundGps(false);
      }
    })();
  }, []);

  const handleBackgroundGpsChange = async (value: boolean) => {
    setBackgroundGpsEnabled(value);
    try {
      await AsyncStorage.setItem(BACKGROUND_GPS_KEY, value ? 'true' : 'false');
    } catch (e) {
      console.log('Error saving background GPS setting:', e);
    }
  };

  const {
    isRecording,
    canRecord,
    error,
    startRecording,
    stopRecording,
    rideInfo,
  } = useSensorRecorder(vehicle || 'unknown', backgroundGpsEnabled);

  usePersistentNotification(isRecording);

  useEffect(() => {
    if (!vehicle) {
      Alert.alert(
        i18n.t('record.vehicleMissing'), 
        i18n.t('record.vehicleMissingMessage'), 
        [{ text: i18n.t('common.ok'), onPress: () => router.replace('/vehicle') }]
      );
    }
  }, [vehicle]);

  useEffect(() => {
    if (error) {
      Alert.alert(i18n.t('record.cannotStart'), error, [{ text: i18n.t('common.ok') }]);
    }
  }, [error]);

  const getVehicleLabel = (vehicleId: string) => {
    return i18n.t(`vehicle.vehicles.${vehicleId}`);
  };

  const handleStart = async () => {
    if (!canRecord) {
      Alert.alert(
        i18n.t('record.notReady'), 
        i18n.t('record.notReady'), 
        [{ text: i18n.t('common.ok') }]
      );
      return;
    }
    console.log('Starting recording…');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const ok = await startRecording();
    if (ok) {
      setStarted(true);
    } else {
      Alert.alert(
        i18n.t('record.failedToStart'), 
        i18n.t('record.failedToStartMessage')
      );
    }
  };

  const confirmStop = () => {
    Alert.alert(
      i18n.t('record.stopConfirmTitle'),
      i18n.t('record.stopConfirmMessage'),
      [
        { text: i18n.t('common.cancel'), style: 'cancel' },
        {
          text: i18n.t('common.stop'),
          style: 'destructive',
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            setFinishing(true);
            const result = await stopRecording();
            setFinishing(false);

            if (result) {
              const { sensorCsvPath, gpsCsvPath } = result;
              setCompletedRideId(result.rideId);
              setShowFeedbackOptions(true);
              Alert.alert(
                i18n.t('record.uploadTitle'),
                i18n.t('record.uploadMessage'),
                [
                  {
                    text: i18n.t('record.later'),
                    onPress: () => {
                      // Don't ask feedback here, let user choose with buttons
                    },
                  },
                  {
                    text: i18n.t('record.upload'),
                    onPress: async () => {
                      try {
                        const { uploadRide } = await import('../services/uploader');
                        await uploadRide({ sensorCsvPath, gpsCsvPath, metadata: result.metadata });
                        // Don't ask feedback here, let user choose with buttons
                      } catch (e: any) {
                        Alert.alert(i18n.t('record.uploadFailed'), e?.message || 'Unknown error');
                      }
                    },
                  },
                ]
              );
            } else {
              Alert.alert(
                i18n.t('record.stopFailed'), 
                i18n.t('record.stopFailedMessage')
              );
            }
          },
        },
      ]
    );
  };

  const askFeedback = (rideId: string) => {
    console.log('Asking for feedback with rideId:', rideId);
    Alert.alert(
      i18n.t('feedback.localFeedbackTitle'),
      i18n.t('feedback.localFeedbackMessage'),
      [
        { 
          text: i18n.t('common.no'), 
          style: 'cancel',
          onPress: () => {
            console.log('User declined feedback, navigating to vehicle');
            router.replace('/vehicle');
          }
        },
        { 
          text: i18n.t('common.yes'), 
          style: 'default',
          onPress: () => {
            console.log('User accepted feedback, navigating to feedback screen');
            router.replace({ pathname: '/feedback', params: { rideId } });
          }
        },
      ],
      { cancelable: false }
    );
  };

  if (!started) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={[commonStyles.content, { padding: 20 }]}>
          <Text style={commonStyles.title}>{i18n.t('record.readyTitle')}</Text>
          <Text style={commonStyles.text}>
            {i18n.t('record.vehicle', { vehicle: vehicle ? getVehicleLabel(vehicle) : 'unknown' })}
          </Text>
          <Text style={[commonStyles.text, { marginTop: 10 }]}>
            {i18n.t('record.description')}
          </Text>

          {!loadingBackgroundGps && (
            <View style={[commonStyles.card, { marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={commonStyles.subtitle}>{i18n.t('record.backgroundGps')}</Text>
                <Text style={[commonStyles.text, { fontSize: 13 }]}>{i18n.t('record.backgroundGpsDescription')}</Text>
              </View>
              <Switch
                value={backgroundGpsEnabled}
                onValueChange={handleBackgroundGpsChange}
                trackColor={{ false: '#3A3A5A', true: '#64B5F6' }}
                thumbColor={backgroundGpsEnabled ? '#FFFFFF' : '#B0B0B0'}
              />
            </View>
          )}

          <Button 
            text={i18n.t('common.start')} 
            onPress={handleStart} 
            style={[buttonStyles.instructionsButton, { marginTop: 20 }]} 
          />
          <Button 
            text={i18n.t('common.back')} 
            onPress={() => router.back()} 
            style={[buttonStyles.backButton, { marginTop: 10 }]} 
          />
          
          {/* CRIAS Solutions Logo at bottom of page content */}
          <CRIASLogo />
        </View>
      </ScrollView>
    );
  }

  if (showFeedbackOptions && completedRideId) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={[commonStyles.content, { padding: 20 }]}>
          <Text style={commonStyles.title}>{i18n.t('record.rideCompleteTitle')}</Text>
          <Text style={[commonStyles.text, { marginBottom: 20 }]}>
            {i18n.t('record.rideCompleteMessage')}
          </Text>
          
          <Button
            text={i18n.t('record.viewStatistics')}
            onPress={() => {
              console.log('Navigating to feedback with rideId:', completedRideId);
              router.replace({ pathname: '/feedback', params: { rideId: completedRideId } });
            }}
            style={[buttonStyles.instructionsButton, { marginBottom: 10 }]}
          />
          
          <Button
            text={i18n.t('record.startNewRide')}
            onPress={() => router.replace('/vehicle')}
            style={[buttonStyles.backButton]}
          />
          
          {/* CRIAS Solutions Logo at bottom of page content */}
          <CRIASLogo />
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={[commonStyles.container, { padding: 20 }]}>
      <View style={{ width: '100%', maxWidth: 800, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Text style={commonStyles.title}>{i18n.t('record.recordingTitle')}</Text>
        <Text style={commonStyles.text}>{i18n.t('record.recordingDescription')}</Text>
        <ActivityIndicator style={{ marginVertical: 20 }} color={colors.accent} />
        <SwipeToConfirm
          text={i18n.t('record.swipeToStop')}
          trackColor="#1e2a44"
          thumbColor="#64B5F6"
          onConfirmed={confirmStop}
        />
        {finishing && (
          <Text style={[commonStyles.text, { marginTop: 10 }]}>
            {i18n.t('record.finalizingFiles')}
          </Text>
        )}
      </View>
    </View>
  );
}
