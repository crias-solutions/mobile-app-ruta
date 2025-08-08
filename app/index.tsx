
import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import { useConsent } from '../hooks/useConsent';

export default function Main() {
  const { accepted, loading } = useConsent();

  useEffect(() => {
    if (loading) return;
    if (!accepted) {
      router.replace('/terms');
    } else {
      router.replace('/vehicle');
    }
  }, [accepted, loading]);

  return (
    <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator color={'#64B5F6'} />
    </View>
  );
}
