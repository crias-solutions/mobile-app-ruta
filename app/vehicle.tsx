
import { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import VehicleCard from '../components/VehicleCard';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { useVehicles } from '../hooks/useVehicles';
import { getFreeStorageMB } from '../utils/storage';
import { CRIASLogo } from './_layout';

export default function VehicleScreen() {
  const { availableVehicles, enabledMap, toggleEnabled, lastSelected, setLastSelected } = useVehicles();
  const [manageMode, setManageMode] = useState(false);
  const [freeMB, setFreeMB] = useState<number | null>(null);

  useEffect(() => {
    getFreeStorageMB().then(setFreeMB).catch((e) => console.log('getFreeStorageMB error', e));
  }, []);

  const enabledVehicles = useMemo(() => {
    return availableVehicles.filter(v => enabledMap[v.id]);
  }, [availableVehicles, enabledMap]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[commonStyles.content, { padding: 20 }]}>
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={commonStyles.title}>Select your vehicle</Text>
          <Ionicons name="settings-outline" size={22} color={colors.text} onPress={() => setManageMode(m => !m)} />
        </View>
        
        {typeof freeMB === 'number' && freeMB < 50 && (
          <View style={[commonStyles.card, { borderColor: '#ffb74d' }]}>
            <Text style={[commonStyles.text, { color: '#ffcc80' }]}>
              Low storage: {freeMB.toFixed(1)} MB available. Recording may stop if storage runs out.
            </Text>
          </View>
        )}

        {!manageMode && (
          <>
            <Text style={[commonStyles.text, { marginBottom: 10 }]}>
              Choose a mode of transport below. You can edit the list by tapping the settings icon.
            </Text>
            <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              {enabledVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  id={vehicle.id}
                  label={vehicle.label}
                  icon={vehicle.icon}
                  category={vehicle.category}
                  onPress={() => {
                    setLastSelected(vehicle.id);
                    router.push({ pathname: '/record', params: { vehicle: vehicle.id } });
                  }}
                />
              ))}
            </View>
            {lastSelected && (
              <View style={{ width: '100%', marginTop: 20 }}>
                <Button
                  text={`Quick start with ${lastSelected}`}
                  onPress={() => router.push({ pathname: '/record', params: { vehicle: lastSelected } })}
                  style={buttonStyles.instructionsButton}
                />
              </View>
            )}
            <View style={{ width: '100%', marginTop: 10 }}>
              <Button 
                text="Back" 
                onPress={() => router.back()} 
                style={buttonStyles.backButton} 
              />
            </View>
          </>
        )}

        {manageMode && (
          <>
            <Text style={[commonStyles.subtitle, { marginTop: 10 }]}>Manage vehicle list</Text>
            <Text style={[commonStyles.text, { marginBottom: 10 }]}>
              Toggle which vehicle types are visible on the selection screen.
            </Text>
            <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              {availableVehicles.map((vehicle) => {
                const enabled = !!enabledMap[vehicle.id];
                return (
                  <VehicleCard
                    key={vehicle.id}
                    id={vehicle.id}
                    label={vehicle.label}
                    icon={vehicle.icon}
                    category={vehicle.category}
                    enabled={enabled}
                    editable
                    onPress={() => toggleEnabled(vehicle.id)}
                  />
                );
              })}
            </View>
            <View style={{ width: '100%', marginTop: 20 }}>
              <Button text="Done" onPress={() => setManageMode(false)} style={buttonStyles.instructionsButton} />
            </View>
          </>
        )}

        {/* CRIAS Solutions Logo at bottom of page content */}
        <CRIASLogo />
      </View>
    </ScrollView>
  );
}
