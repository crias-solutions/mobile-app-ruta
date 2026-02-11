
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import i18n, { changeLanguageAndNotify as changeLanguage, getCurrentLanguage } from '../utils/i18n';
import { useState, useEffect } from 'react';

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<string>('es');

  useEffect(() => {
    // Initialize with current language
    try {
      const lang = getCurrentLanguage();
      console.log('LanguageSwitcher initialized with language:', lang);
      setCurrentLang(lang);
    } catch (error) {
      console.error('Error initializing LanguageSwitcher:', error);
      setCurrentLang('es');
    }
  }, []);

  const switchLanguage = (lang: string) => {
    console.log('LanguageSwitcher: Attempting to switch to:', lang);
    
    if (!lang || typeof lang !== 'string') {
      console.error('LanguageSwitcher: Invalid language provided:', lang);
      return;
    }
    
    if (lang !== 'en' && lang !== 'es') {
      console.error('LanguageSwitcher: Unsupported language:', lang);
      return;
    }
    
    try {
      changeLanguage(lang);
      // notify listeners and update local state — Root layout subscribes and will re-render
      setCurrentLang(lang);
      console.log('LanguageSwitcher: Language switched successfully to:', lang);
    } catch (error) {
      console.error('LanguageSwitcher: Error switching language:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, currentLang === 'es' && styles.activeButton]}
        onPress={() => switchLanguage('es')}
      >
        <Text style={[styles.buttonText, currentLang === 'es' && styles.activeButtonText]}>
          ES
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, currentLang === 'en' && styles.activeButton]}
        onPress={() => switchLanguage('en')}
      >
        <Text style={[styles.buttonText, currentLang === 'en' && styles.activeButtonText]}>
          EN
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.backgroundAlt,
  },
  activeButton: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  buttonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  activeButtonText: {
    opacity: 1,
    color: '#FFFFFF',
  },
});
