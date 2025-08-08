
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/commonStyles';

interface VehicleCardProps {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  category: 'public' | 'private';
  enabled?: boolean;
  editable?: boolean;
  onPress?: () => void;
}

export default function VehicleCard({
  id,
  label,
  icon,
  category,
  enabled = true,
  editable = false,
  onPress,
}: VehicleCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { opacity: pressed ? 0.8 : 1, borderColor: enabled ? colors.grey : '#556' }]}>
      <Ionicons name={icon} size={34} color={enabled ? 'white' : '#8b8b8b'} />
      <Text style={[styles.label, { color: enabled ? colors.text : '#9e9e9e' }]}>{label}</Text>
      <Text style={styles.category}>{category === 'public' ? 'Public' : 'Private'}</Text>
      {editable && (
        <View style={[styles.badge, { backgroundColor: enabled ? '#2e7d32' : '#b71c1c' }]}>
          <Text style={{ color: 'white', fontSize: 12 }}>{enabled ? 'Shown' : 'Hidden'}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 120,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    boxShadow: '0px 6px 16px rgba(0,0,0,0.25)',
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
  },
  category: {
    fontSize: 12,
    color: '#9fb3d8',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
