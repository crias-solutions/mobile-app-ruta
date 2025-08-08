
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const KEY = 'terms_consent_v1';

export function useConsent() {
  const [accepted, setAcceptedState] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(KEY);
        setAcceptedState(v === 'true');
      } catch (e) {
        console.log('useConsent load error', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setAccepted = async (value: boolean) => {
    setAcceptedState(value);
    try {
      await AsyncStorage.setItem(KEY, value ? 'true' : 'false');
    } catch (e) {
      console.log('useConsent save error', e);
    }
  };

  return { accepted, setAccepted, loading };
}
