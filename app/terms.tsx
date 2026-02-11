
import { router } from 'expo-router';
import { ScrollView, View, Text, Alert, Platform } from 'react-native';
import { useEffect } from 'react';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { useConsent } from '../hooks/useConsent';
import { CRIASLogo } from './_layout';
import Button from '../components/Button';
import RUTALogo from '../components/RUTALogo';
import LanguageSwitcher from '../components/LanguageSwitcher';
import i18n, { useLocale } from '../utils/i18n';

export default function TermsScreen() {
  const { accepted, loading, acceptConsent } = useConsent();

  // Subscribe to locale changes so this screen re-renders when language changes
  useLocale();

  useEffect(() => {
    if (accepted && !loading) {
      router.replace('/vehicle');
    }
  }, [accepted, loading]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[commonStyles.content, { padding: 20 }]}>
        {/* Language Switcher at the top */}
        <LanguageSwitcher />
        
        {/* Show RUTA logo only on the terms screen as the main app introduction */}
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <RUTALogo size="large" />
          <Text style={[commonStyles.title, { marginTop: 10, textAlign: 'center' }]}>
            {i18n.t('terms.appTitle')}
          </Text>
          <Text style={[commonStyles.text, { textAlign: 'center', opacity: 0.8 }]}>
            {i18n.t('terms.appSubtitle')}
          </Text>
        </View>
        
        <Text style={[commonStyles.title, { marginTop: 20 }]}>
          {i18n.t('terms.title')}
        </Text>
        
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>
            {i18n.t('terms.citizenScience.title')}
          </Text>
          <Text style={commonStyles.text}>
            {i18n.t('terms.citizenScience.description')}
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>
            {i18n.t('terms.dataCollection.title')}
          </Text>
          <Text style={commonStyles.text}>
            {i18n.t('terms.dataCollection.description')}
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>
            {i18n.t('terms.privacy.title')}
          </Text>
          <Text style={commonStyles.text}>
            {i18n.t('terms.privacy.description')}
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>
            {i18n.t('terms.openData.title')}
          </Text>
          <Text style={commonStyles.text}>
            {i18n.t('terms.openData.description')}
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>
            {i18n.t('terms.rights.title')}
          </Text>
          <Text style={commonStyles.text}>
            {i18n.t('terms.rights.description')}
          </Text>
        </View>

        <Button
          text={i18n.t('terms.acceptButton')}
          onPress={acceptConsent}
          style={[buttonStyles.instructionsButton, { marginTop: 20 }]}
        />

        {/* CRIAS Solutions Logo at bottom of page content */}
        <CRIASLogo />
      </View>
    </ScrollView>
  );
}
