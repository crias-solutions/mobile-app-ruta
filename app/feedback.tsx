
import { View, Text, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams, router } from 'expo-router';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { useEffect, useMemo, useState } from 'react';
import { CRIASLogo } from './_layout';
import Button from '../components/Button';

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
      const [, , , ax, ay, az] = line.split(',').map(Number);
      return Math.sqrt(ax * ax + ay * ay + az * az);
    });
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

  useEffect(() => {
    if (!rideId) return;

    const loadStats = async () => {
      try {
        const sensorPath = `${FileSystem.documentDirectory}rides/${rideId}_sensors.csv`;
        const sensorExists = await FileSystem.getInfoAsync(sensorPath);
        
        if (sensorExists.exists) {
          const csv = await FileSystem.readAsStringAsync(sensorPath);
          const magnitudes = parseAccelMagnitude(csv);
          
          if (magnitudes.length > 0) {
            const maxMag = Math.max(...magnitudes);
            const avgMag = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
            const duration = magnitudes.length / 10; // Assuming 10Hz sampling
            
            setStats([
              { label: 'Ride Duration', value: duration, unit: ' sec' },
              { label: 'Data Points', value: magnitudes.length },
              { label: 'Avg Acceleration', value: avgMag, unit: ' m/s²' },
              { label: 'Max Acceleration', value: maxMag, unit: ' m/s²' },
            ]);
          }
        }
      } catch (error) {
        console.log('Error loading stats:', error);
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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[commonStyles.content, { padding: 20 }]}>
        <Text style={commonStyles.title}>Ride Summary</Text>
        <Text style={[commonStyles.text, { marginBottom: 20 }]}>
          Here&apos;s a simple analysis of your ride data processed locally on your device.
        </Text>

        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Statistics</Text>
          {stats.map((stat, index) => (
            <StatBar
              key={index}
              label={stat.label}
              value={stat.value}
              unit={stat.unit}
              max={
                stat.label.includes('Duration') ? maxValues.duration :
                stat.label.includes('Data Points') ? maxValues.dataPoints :
                stat.label.includes('Avg') ? maxValues.avgAccel :
                stat.label.includes('Max') ? maxValues.maxAccel :
                undefined
              }
            />
          ))}
        </View>

        <Text style={[commonStyles.text, { marginTop: 10, fontSize: 13, opacity: 0.8 }]}>
          This analysis is performed entirely on your device. No data is sent anywhere for this summary.
        </Text>

        <Button
          text="Start New Ride"
          onPress={() => router.replace('/vehicle')}
          style={[buttonStyles.instructionsButton, { marginTop: 20 }]}
        />

        {/* CRIAS Solutions Logo at bottom of page content */}
        <CRIASLogo />
      </View>
    </ScrollView>
  );
}
