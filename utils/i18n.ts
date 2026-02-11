
import { I18n } from 'i18n-js';
import { useEffect, useState } from 'react';
import * as Localization from 'expo-localization';
import es from '../locales/es.json';
import en from '../locales/en.json';

// Create i18n instance
const i18n = new I18n({
  es,
  en,
});

// Get the device locale safely with fallback
const getDeviceLocale = (): string => {
  try {
    const deviceLocale = (Localization as any).locale || (Localization as any).locales?.[0]?.languageTag;
    console.log('Device locale detected:', deviceLocale);
    
    if (!deviceLocale || typeof deviceLocale !== 'string') {
      console.log('Invalid locale, falling back to Spanish');
      return 'es';
    }
    
    // Extract language code (e.g., 'es-ES' -> 'es', 'en-US' -> 'en')
    const languageCode = deviceLocale.split('-')[0].toLowerCase();
    
    // Check if we support this language
    if (languageCode === 'en' || languageCode === 'es') {
      return languageCode;
    }
    
    // Default to Spanish if unsupported language
    console.log('Unsupported language, falling back to Spanish');
    return 'es';
  } catch (error) {
    console.error('Error getting device locale:', error);
    return 'es';
  }
};

// Set the locale once at the beginning of your app
i18n.locale = getDeviceLocale();

// Set default locale to Spanish
i18n.defaultLocale = 'es';

// When a value is missing from a language it'll fall back to another language with the key present
i18n.enableFallback = true;

// Function to change language
export const changeLanguage = (locale: string) => {
  console.log('Changing language to:', locale);
  
  if (!locale || typeof locale !== 'string') {
    console.error('Invalid locale provided to changeLanguage:', locale);
    return;
  }
  
  // Validate locale is supported
  if (locale !== 'en' && locale !== 'es') {
    console.error('Unsupported locale:', locale);
    return;
  }
  
  i18n.locale = locale;
  console.log('Language changed successfully to:', i18n.locale);
};

// Simple subscription to locale changes so the app can re-render when language changes
const _localeListeners = new Set<() => void>();
export const onLocaleChange = (cb: () => void) => {
  _localeListeners.add(cb);
  return () => {
    _localeListeners.delete(cb);
  };
};

// Wrap changeLanguage to notify listeners
export const changeLanguageAndNotify = (locale: string) => {
  changeLanguage(locale);
  const count = _localeListeners.size;
  console.log(`changeLanguageAndNotify: notifying ${count} listeners for locale=${locale}`);
  _localeListeners.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      // ignore listener errors
      console.error('onLocaleChange listener error', e);
    }
  });
};

// Function to get current language
export const getCurrentLanguage = (): string => {
  try {
    const currentLocale = i18n.locale;
    
    if (!currentLocale || typeof currentLocale !== 'string') {
      console.log('Invalid current locale, returning default');
      return 'es';
    }
    
    // Returns 'es' or 'en'
    return currentLocale.split('-')[0].toLowerCase();
  } catch (error) {
    console.error('Error getting current language:', error);
    return 'es';
  }
};

// React hook to subscribe to locale changes and trigger component re-renders
export const useLocale = (): string => {
  const [locale, setLocale] = useState(getCurrentLanguage());
  useEffect(() => {
    const unsub = onLocaleChange(() => setLocale(getCurrentLanguage()));
    return unsub;
  }, []);
  return locale;
};

export default i18n;
