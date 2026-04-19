import { View, Text, ScrollView, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { useLocalSearchParams, router } from 'expo-router';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { useEffect, useState } from 'react';
import { CRIASLogo } from './_layout';
import Button from '../components/Button';
import i18n from '../utils/i18n';
import { parseGpsCsv, computeTripSummary, formatDuration, TripSummary } from '../utils/tripSummary';

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <Text style={[commonStyles.text, { fontSize: 14, flex: 1 }]}>{label}</Text>
      <Text style={[commonStyles.text, { fontSize: 14, fontWeight: '600', textAlign: 'right' }]}>
        {value}
      </Text>
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Text style={[commonStyles.subtitle, { fontSize: 16, marginTop: 16, marginBottom: 4 }]}>
      {title}
    </Text>
  );
}

export default function FeedbackScreen() {
  const { rideId } = useLocalSearchParams<{ rideId?: string }>();
  const [tripSummary, setTripSummary] = useState<TripSummary | null>(null);
  const [hasGpsData, setHasGpsData] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('FeedbackScreen mounted with rideId:', rideId);
    if (!rideId) {
      console.log('No rideId provided, redirecting to vehicle screen');
      router.replace('/vehicle');
      return;
    }

    const loadStats = async () => {
      try {
        setLoading(true);
        console.log('Loading stats for rideId:', rideId);

        const sensorPath = `${FileSystem.documentDirectory}rides/${rideId}/sensor.csv`;
        const gpsPath = `${FileSystem.documentDirectory}rides/${rideId}/gps.csv`;

        const sensorExists = await FileSystem.getInfoAsync(sensorPath);
        const gpsExists = await FileSystem.getInfoAsync(gpsPath);

        console.log('Sensor file exists:', sensorExists.exists);
        console.log('GPS file exists:', gpsExists.exists);

        let summary: TripSummary | null = null;
        let hasGps = false;

        if (gpsExists.exists) {
          const gpsCsv = await FileSystem.readAsStringAsync(gpsPath);
          const gpsPoints = parseGpsCsv(gpsCsv);

          console.log('Parsed GPS points:', gpsPoints.length);

          if (gpsPoints.length > 0) {
            hasGps = true;
            summary = computeTripSummary(gpsPoints);
            console.log('Trip summary computed:', summary);
          }
        }

        setHasGpsData(hasGps);
        setTripSummary(summary);
      } catch (error) {
        console.log('Error loading stats:', error);
        setTripSummary(null);
        setHasGpsData(false);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [rideId]);

  const handleStartNewRide = () => {
    console.log('Start New Ride button pressed - navigating to vehicle screen');
    try {
      router.push('/vehicle');
    } catch (error) {
      console.log('Navigation error:', error);
      router.replace('/vehicle');
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[commonStyles.content, { padding: 20 }]}>
        <Text style={commonStyles.title}>{i18n.t('feedback.title')}</Text>
        <Text style={[commonStyles.text, { marginBottom: 20 }]}>
          {i18n.t('feedback.description')}
        </Text>

        <View style={commonStyles.card}>
          {loading ? (
            <Text style={[commonStyles.text, { textAlign: 'center', padding: 20 }]}>
              {i18n.t('feedback.loadingStats')}
            </Text>
          ) : tripSummary ? (
            <>
              <SectionTitle title="Trip Summary" />
              <StatRow
                label={i18n.t('feedback.stats.distance')}
                value={`${tripSummary.distance.toFixed(2)} km`}
              />
              <StatRow
                label={i18n.t('feedback.stats.duration')}
                value={formatDuration(tripSummary.duration)}
              />

              <SectionTitle title="Speed" />
              <StatRow
                label={i18n.t('feedback.stats.averageSpeed')}
                value={`${tripSummary.averageSpeed.toFixed(1)} km/h`}
              />
              <StatRow
                label={i18n.t('feedback.stats.maxSpeed')}
                value={`${tripSummary.maxSpeed.toFixed(1)} km/h`}
              />

              <SectionTitle title="Motion" />
              <StatRow
                label={i18n.t('feedback.stats.maxAcceleration')}
                value={`${tripSummary.maxAcceleration.toFixed(2)} m/s²`}
              />

              <SectionTitle title="Stops" />
              <StatRow
                label={i18n.t('feedback.stats.numStops')}
                value={String(tripSummary.stops)}
              />
              <StatRow
                label={i18n.t('feedback.stats.stoppedTime')}
                value={`${formatDuration(tripSummary.stoppedTime)} (${tripSummary.stoppedTimePercent.toFixed(1)}%)`}
              />
            </>
          ) : (
            <Text style={[commonStyles.text, { textAlign: 'center', padding: 20, opacity: 0.7 }]}>
              {i18n.t('feedback.noData')}
            </Text>
          )}
        </View>

        <Text style={[commonStyles.text, { marginTop: 10, fontSize: 13, opacity: 0.8 }]}>
          {i18n.t('feedback.disclaimer')}
        </Text>

        <View style={[commonStyles.buttonContainer, { marginTop: 20 }]}>
          <Button
            text={i18n.t('record.startNewRide')}
            onPress={handleStartNewRide}
            style={buttonStyles.instructionsButton}
          />
        </View>

        <View style={{ marginTop: 30 }}>
          <CRIASLogo />
        </View>
      </View>
    </ScrollView>
  );
}