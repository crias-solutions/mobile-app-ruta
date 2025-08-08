
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Button from '../components/Button';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import * as FileSystem from 'expo-file-system';

interface Stat {
  label: string;
  value: number;
  unit?: string;
}

function StatBar({ label, value, max = 100, unit }: { label: string; value: number; max?: number; unit?: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <View style={{ width: '100%', marginBottom: 12 }}>
      <Text style={[commonStyles.text, { marginBottom: 6 }]}>{label}: {value.toFixed(2)}{unit || ''}</Text>
      <View style={{ width: '100%', height: 10, backgroundColor: '#1e2a44', borderRadius: 6 }}>
        <View style={{ width: `${pct}%`, height: 10, backgroundColor: colors.accent, borderRadius: 6 }} />
      </View>
    </View>
  );
}

function parseAccelMagnitude(csv: string): number[] {
  const lines = csv.split('\n');
  const arr: number[] = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].trim();
    if (!row) continue;
    const parts = row.split(',');
    if (parts[1] !== 'accelerometer') continue;
    const x = parseFloat(parts[2]);
    const y = parseFloat(parts[3]);
    const z = parseFloat(parts[4]);
    if (isFinite(x) && isFinite(y) && isFinite(z)) {
      const mag = Math.sqrt(x * x + y * y + z * z);
      arr.push(mag);
    }
  }
  return arr;
}

export default function FeedbackScreen() {
  const { rideId } = useLocalSearchParams<{ rideId?: string }>();
  const [stats, setStats] = useState<Stat[] | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!rideId) return;
      try {
        const dir = FileSystem.documentDirectory + 'rides/' + rideId;
        const sensorCsvPath = dir + '/sensor.csv';
        const content = await FileSystem.readAsStringAsync(sensorCsvPath);
        const mags = parseAccelMagnitude(content);
        if (!mags.length) {
          setStats([
            { label: 'Samples', value: 0 },
          ]);
          return;
        }
        const avg = mags.reduce((a, b) => a + b, 0) / mags.length;
        let variance = 0;
        for (const m of mags) {
          variance += (m - avg) * (m - avg);
        }
        variance /= mags.length;
        const smoothness = 1 / (1 + variance); // simple inverse-variance heuristic [0..1]
        setStats([
          { label: 'Samples', value: mags.length },
          { label: 'Avg accel magnitude', value: avg, unit: ' m/s²' },
          { label: 'Variance', value: variance },
          { label: 'Smoothness (higher is smoother)', value: smoothness * 100, unit: '%' },
        ]);
      } catch (e) {
        console.log('feedback parse error', e);
        setStats([{ label: 'Error reading data', value: 0 }]);
      }
    };
    load();
  }, [rideId]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[commonStyles.content, { padding: 20, alignItems: 'stretch' }]}>
        <Text style={commonStyles.title}>Ride feedback</Text>
        <Text style={commonStyles.text}>Below is a simple, on-device, visual-only summary from your data.</Text>
        <View style={[commonStyles.card, { marginTop: 16 }]}>
          {stats ? (
            <>
              {stats.map((s, idx) => (
                <StatBar key={idx} label={s.label} value={s.value} max={s.label.includes('Smoothness') ? 100 : s.value || 100} unit={s.unit} />
              ))}
            </>
          ) : (
            <Text style={commonStyles.text}>Processing…</Text>
          )}
        </View>

        <View style={{ width: '100%', marginTop: 20 }}>
          <Button text="Done" onPress={() => router.replace('/vehicle')} style={buttonStyles.instructionsButton} />
        </View>
      </View>
    </ScrollView>
  );
}
