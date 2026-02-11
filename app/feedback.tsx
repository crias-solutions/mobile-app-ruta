
import { View, Text, ScrollView, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { useLocalSearchParams, router } from 'expo-router';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { useEffect, useMemo, useState } from 'react';
import { CRIASLogo } from './_layout';
import Button from '../components/Button';
import i18n from '../utils/i18n';

interface Stat {
  label: string;
  value: number;
  unit?: string;
}

function parseAccelMagnitude(csv: string): number[] {
  const lines = csv.split('\n').slice(1); // Skip header
  return lines
    .filter(line => line.trim())
    .map(line => {
      const parts = line.split(',');
      // Expected: timestamp_ms,sensor,x,y,z
      const sensorType = parts[1];
      if (sensorType !== 'accelerometer') return NaN;
      const ax = Number(parts[2]);
      const ay = Number(parts[3]);
      const az = Number(parts[4]);
      return Math.sqrt(ax * ax + ay * ay + az * az);
    })
    .filter(n => !Number.isNaN(n));
}

function StatBar({ label, value, max, unit }: { label: string; value: number; max?: number; unit?: string }) {
  const percentage = max ? Math.min((value / max) * 100, 100) : 0;
  
  return (
    <View style={{ marginVertical: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={[commonStyles.text, { fontSize: 14 }]}>{label}</Text>
        <Text style={[commonStyles.text, { fontSize: 14, fontWeight: '600' }]}>
          {value.toFixed(1)}{unit || ''}
        </Text>
      </View>
      <View style={{ 
        height: 8, 
        backgroundColor: colors.backgroundAlt, 
        borderRadius: 4,
        overflow: 'hidden'
      }}>
        <View style={{ 
          height: '100%', 
          width: `${percentage}%`, 
          backgroundColor: colors.accent,
          borderRadius: 4
        }} />
      </View>
    </View>
  );
}

export default function FeedbackScreen() {
  const { rideId } = useLocalSearchParams<{ rideId?: string }>();
  const [stats, setStats] = useState<Stat[]>([]);
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
        const sensorExists = await FileSystem.getInfoAsync(sensorPath);
        
        console.log('Sensor file exists:', sensorExists.exists, 'at path:', sensorPath);
        
        if (sensorExists.exists) {
          const csv = await FileSystem.readAsStringAsync(sensorPath);
          const magnitudes = parseAccelMagnitude(csv);
          
          console.log('Parsed magnitudes count:', magnitudes.length);
          
          if (magnitudes.length > 0) {
            const maxMag = Math.max(...magnitudes);
            const avgMag = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
            const duration = magnitudes.length / 10; // Assuming 10Hz sampling
            
            const newStats = [
              { 
                label: i18n.t('feedback.stats.duration'), 
                value: duration, 
                unit: i18n.t('feedback.units.seconds') 
              },
              { 
                label: i18n.t('feedback.stats.dataPoints'), 
                value: magnitudes.length 
              },
              { 
                label: i18n.t('feedback.stats.avgAcceleration'), 
                value: avgMag, 
                unit: i18n.t('feedback.units.metersPerSecondSquared') 
              },
              { 
                label: i18n.t('feedback.stats.maxAcceleration'), 
                value: maxMag, 
                unit: i18n.t('feedback.units.metersPerSecondSquared') 
              },
            ];
            
            console.log('Setting stats:', newStats);
            setStats(newStats);
          } else {
            console.log('No valid magnitude data found');
            setStats([]);
          }
        } else {
          console.log('Sensor file does not exist');
          setStats([]);
        }
      } catch (error) {
        console.log('Error loading stats:', error);
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [rideId]);

  const maxValues = useMemo(() => {
    return {
      duration: 3600, // 1 hour max for visualization
      dataPoints: 36000, // 1 hour at 10Hz
      avgAccel: 20, // reasonable max for avg
      maxAccel: 50, // reasonable max for peak
    };
  }, []);

  const handleStartNewRide = () => {
    console.log('Start New Ride button pressed - navigating to vehicle screen');
    try {
      router.push('/vehicle');
    } catch (error) {
      console.log('Navigation error:', error);
      // Fallback navigation
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
          <Text style={commonStyles.subtitle}>{i18n.t('feedback.statisticsTitle')}</Text>
          {loading ? (
            <Text style={[commonStyles.text, { textAlign: 'center', padding: 20 }]}>
              {i18n.t('feedback.loadingStats')}
            </Text>
          ) : stats.length > 0 ? (
            stats.map((stat, index) => (
              <StatBar
                key={index}
                label={stat.label}
                value={stat.value}
                unit={stat.unit}
                max={
                  stat.label.includes(i18n.t('feedback.stats.duration').split(' ')[0]) ? maxValues.duration :
                  stat.label.includes(i18n.t('feedback.stats.dataPoints').split(' ')[0]) ? maxValues.dataPoints :
                  stat.label.includes('Avg') || stat.label.includes('Promedio') ? maxValues.avgAccel :
                  stat.label.includes('Max') || stat.label.includes('Máxima') ? maxValues.maxAccel :
                  undefined
                }
              />
            ))
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

        {/* CRIAS Solutions Logo at bottom of page content */}
        <View style={{ marginTop: 30 }}>
          <CRIASLogo />
        </View>
      </View>
    </ScrollView>
  );
}
