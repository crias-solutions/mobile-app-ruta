
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, SafeAreaView, Text, View, Image, StyleSheet } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { useEffect, useState } from 'react';
import { setupErrorLogging } from '../utils/errorLogger';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import RUTALogo from '../components/RUTALogo';

const STORAGE_KEY = 'emulated_device';

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    opacity: 0.8,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.6,
    marginTop: 8,
    fontFamily: 'Inter_400Regular',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    marginLeft: 10,
  },
});

function RootLayoutInner() {
  const actualInsets = useSafeAreaInsets();
  const { emulate } = useGlobalSearchParams<{ emulate?: string }>();
  const [storedEmulate, setStoredEmulate] = useState<string | null>(null);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    setupErrorLogging();

    if (Platform.OS === 'web') {
      if (emulate) {
        localStorage.setItem(STORAGE_KEY, emulate);
        setStoredEmulate(emulate);
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setStoredEmulate(stored);
        }
      }
    }
  }, [emulate]);

  let insetsToUse = actualInsets;

  if (Platform.OS === 'web') {
    const simulatedInsets = {
      ios: { top: 47, bottom: 20, left: 0, right: 0 },
      android: { top: 40, bottom: 0, left: 0, right: 0 },
    } as const;

    const deviceToEmulate = storedEmulate || emulate;
    insetsToUse = deviceToEmulate
      ? (simulatedInsets as any)[deviceToEmulate] || actualInsets
      : actualInsets;
  }

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={[commonStyles.wrapper, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Loading…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        commonStyles.wrapper,
        {
          paddingTop: insetsToUse.top,
          paddingBottom: insetsToUse.bottom,
          paddingLeft: insetsToUse.left,
          paddingRight: insetsToUse.right,
        },
      ]}
    >
      <StatusBar style="dark" />
      {Platform.OS === 'android' && (
        <View style={styles.headerContainer}>
          <RUTALogo size="small" />
          <Text style={styles.headerTitle}>RUTA Mobile</Text>
        </View>
      )}
      <Stack screenOptions={{ headerShown: false, animation: 'default' }} />
    </SafeAreaView>
  );
}

// Logo component that can be imported and used in individual screens
export function CRIASLogo() {
  return (
    <View style={styles.logoContainer}>
      <Image 
        source={require('../assets/images/9f64f69f-0483-49b4-9307-b50b0fa3edac.png')} 
        style={styles.logo}
      />
      <Text style={styles.logoText}>Powered by CRIAS Solutions</Text>
    </View>
  );
}

// RUTA Logo component for Android only
export function RUTAAppLogo({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  if (Platform.OS !== 'android') {
    return null;
  }

  return (
    <View style={[styles.logoContainer, { paddingVertical: 10 }]}>
      <RUTALogo size={size} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <RootLayoutInner />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
