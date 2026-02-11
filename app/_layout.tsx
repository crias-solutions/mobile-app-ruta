
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, SafeAreaView, Text, View, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { useEffect, useState } from 'react';
import { setupErrorLogging } from '../utils/errorLogger';
import { getCurrentLanguage, onLocaleChange } from '../utils/i18n';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import i18n from '../utils/i18n';

const STORAGE_KEY = 'emulated_device';
const CRIAS_WEBSITE_URL = 'https://crias.solutions/';

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

  const [, setLocaleState] = useState(getCurrentLanguage());

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

  // Subscribe to locale changes so the whole root rerenders and i18n.t() calls update
  useEffect(() => {
    const unsubscribe = onLocaleChange(() => setLocaleState(getCurrentLanguage()));
    return unsubscribe;
  }, []);

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
        <Text style={{ color: colors.text }}>{i18n.t('common.loading')}</Text>
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
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'default' }} />
    </SafeAreaView>
  );
}

// Logo component that can be imported and used in individual screens
export function CRIASLogo() {
  const handleLogoPress = async () => {
    try {
      console.log('CRIAS logo pressed, opening website:', CRIAS_WEBSITE_URL);
      const supported = await Linking.canOpenURL(CRIAS_WEBSITE_URL);
      if (supported) {
        await Linking.openURL(CRIAS_WEBSITE_URL);
      } else {
        console.error('Cannot open URL:', CRIAS_WEBSITE_URL);
      }
    } catch (error) {
      console.error('Error opening CRIAS website:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.logoContainer} onPress={handleLogoPress} activeOpacity={0.7}>
      <Image 
        source={require('../assets/images/9f64f69f-0483-49b4-9307-b50b0fa3edac.png')} 
        style={styles.logo}
      />
      <Text style={styles.logoText}>{i18n.t('common.poweredBy')}</Text>
    </TouchableOpacity>
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
