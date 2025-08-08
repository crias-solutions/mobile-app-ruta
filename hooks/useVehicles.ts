
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_VEHICLES, VehicleId, VehicleItem } from '../data/vehicles';

const ENABLED_KEY = 'vehicles_enabled_map_v1';
const LAST_SELECTED_KEY = 'vehicles_last_selected_v1';

export function useVehicles() {
  const [availableVehicles, setAvailableVehicles] = useState<VehicleItem[]>(DEFAULT_VEHICLES);
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>({});
  const [lastSelected, setLastSelectedState] = useState<VehicleId | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const mRaw = await AsyncStorage.getItem(ENABLED_KEY);
        if (mRaw) {
          setEnabledMap(JSON.parse(mRaw));
        } else {
          const defaultMap: Record<string, boolean> = {};
          for (const v of DEFAULT_VEHICLES) defaultMap[v.id] = true;
          setEnabledMap(defaultMap);
        }
        const last = await AsyncStorage.getItem(LAST_SELECTED_KEY);
        if (last) setLastSelectedState(last as VehicleId);
      } catch (e) {
        console.log('useVehicles load error', e);
      }
    })();
  }, []);

  const toggleEnabled = async (id: string) => {
    const next = { ...enabledMap, [id]: !enabledMap[id] };
    setEnabledMap(next);
    try {
      await AsyncStorage.setItem(ENABLED_KEY, JSON.stringify(next));
    } catch (e) {
      console.log('save enabledMap error', e);
    }
  };

  const setLastSelected = async (id: VehicleId) => {
    setLastSelectedState(id);
    try {
      await AsyncStorage.setItem(LAST_SELECTED_KEY, id);
    } catch (e) {
      console.log('save lastSelected error', e);
    }
  };

  return { availableVehicles, enabledMap, toggleEnabled, lastSelected, setLastSelected };
}
