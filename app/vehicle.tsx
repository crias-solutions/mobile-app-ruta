
import { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import VehicleCard from '../components/VehicleCard';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { useVehicles } from '../hooks/useVehicles';
import { getFreeStorageMB } from '../utils/storage';
import { useConsent } from '../hooks/useConsent';
import { CRIASLogo } from './_layout';
import i18n from '../utils/i18n';

export default function VehicleScreen() {
  const { availableVehicles, enabledMap, toggleEnabled, lastSelected, setLastSelected } = useVehicles();
  const { setAccepted } = useConsent();
  const [manageMode, setManageMode] = useState(false);
  const [freeMB, setFreeMB] = useState<number | null>(null);

  useEffect(() => {
    getFreeStorageMB().then(setFreeMB).catch((e) => console.log('getFreeStorageMB error', e));
  }, []);

  const enabledVehicles = useMemo(() => {
    return availableVehicles.filter(v => enabledMap[v.id]);
  }, [availableVehicles, enabledMap]);

  const getVehicleLabel = (vehicleId: string) => {
    return i18n.t(`vehicle.vehicles.${vehicleId}`);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[commonStyles.content, { padding: 20 }]}>
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={commonStyles.title}>{i18n.t('vehicle.title')}</Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Ionicons name="notifications-outline" size={22} color={colors.text} onPress={() => router.push('/settings' as any)} />
            <Ionicons name="settings-outline" size={22} color={colors.text} onPress={() => setManageMode(m => !m)} />
          </View>
        </View>

        <View style={{ width: '100%', marginTop: 12 }}>
          <Button
            text={i18n.t('settings.navTitle')}
            onPress={() => router.push('/settings' as any)}
            style={buttonStyles.backButton}
          />
        </View>
        
        {typeof freeMB === 'number' && freeMB < 50 && (
          <View style={[commonStyles.card, { borderColor: '#ffb74d' }]}>
            <Text style={[commonStyles.text, { color: '#ffcc80' }]}>
              {i18n.t('vehicle.lowStorage', { freeMB: freeMB.toFixed(1) })}
            </Text>
          </View>
        )}

        {!manageMode && (
          <>
            <Text style={[commonStyles.text, { marginBottom: 10 }]}>
              {i18n.t('vehicle.description')}
            </Text>
            <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              {enabledVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  id={vehicle.id}
                  label={getVehicleLabel(vehicle.id)}
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
                  text={i18n.t('vehicle.quickStart', { vehicle: getVehicleLabel(lastSelected) })}
                  onPress={() => router.push({ pathname: '/record', params: { vehicle: lastSelected } })}
                  style={buttonStyles.instructionsButton}
                />
              </View>
            )}
            <View style={{ width: '100%', marginTop: 10 }}>
              <Button 
                text={i18n.t('common.back')}
                onPress={async () => {
                  console.log('Back button pressed - clearing consent and returning to terms');
                  await setAccepted(false);
                  router.replace('/terms');
                }} 
                style={buttonStyles.backButton} 
              />
            </View>
          </>
        )}

        {manageMode && (
          <>
            <Text style={[commonStyles.subtitle, { marginTop: 10 }]}>
              {i18n.t('vehicle.manageTitle')}
            </Text>
            <Text style={[commonStyles.text, { marginBottom: 10 }]}>
              {i18n.t('vehicle.manageDescription')}
            </Text>
            <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              {availableVehicles.map((vehicle) => {
                const enabled = !!enabledMap[vehicle.id];
                return (
                  <VehicleCard
                    key={vehicle.id}
                    id={vehicle.id}
                    label={getVehicleLabel(vehicle.id)}
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
              <Button 
                text={i18n.t('common.done')} 
                onPress={() => setManageMode(false)} 
                style={buttonStyles.instructionsButton} 
              />
            </View>
          </>
        )}

        {/* CRIAS Solutions Logo at bottom of page content */}
        <CRIASLogo />
      </View>
    </ScrollView>
  );
}
