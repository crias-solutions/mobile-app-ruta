
import { ScrollView, View, Text, Alert } from 'react-native';
import Button from '../components/Button';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { useConsent } from '../hooks/useConsent';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function TermsScreen() {
  const { accepted, setAccepted, loading } = useConsent();

  useEffect(() => {
    if (!loading && accepted) {
      router.replace('/vehicle');
    }
  }, [accepted, loading]);

  if (loading) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={commonStyles.text}>Loading…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[commonStyles.content, { padding: 20, alignItems: 'flex-start' }]}>
        <Text style={commonStyles.title}>Red Urbana de Tráfico Avanzada (RUTA)</Text>
        <Text style={commonStyles.text}>
          Thank you for participating in this open-source, open-data, open-science data collection project.
          This app collects anonymized motion and trajectory data to support research on traffic dynamics and mobility.
        </Text>

        <Text style={[commonStyles.subtitle, { marginTop: 16 }]}>What we collect</Text>
        <Text style={commonStyles.text}>
          - Gyroscope, accelerometer, magnetometer readings with timestamps (continuous).{'\n'}
          - GPS positions and metadata (only when the device is online).{'\n'}
          - Selected vehicle type for this ride.
        </Text>

        <Text style={[commonStyles.subtitle, { marginTop: 16 }]}>How your data is used</Text>
        <Text style={commonStyles.text}>
          - Data is stored locally as CSV files during your ride.{'\n'}
          - After you end a ride, you will be asked whether to upload your data to the database.{'\n'}
          - Data is anonymous: no accounts, no personal identifiers, and no traceability to individuals.{'\n'}
          - Data is intended to be shared following FAIR principles.
        </Text>

        <Text style={[commonStyles.subtitle, { marginTop: 16 }]}>Consent</Text>
        <Text style={commonStyles.text}>
          By tapping "I Consent", you confirm that you understand:{'\n'}
          - the purpose of the data collection.{'\n'}
          - the participatory sensing nature of the project.{'\n'}
          - That you agree to the anonymous, open-science use of your data.
        </Text>

        <View style={{ width: '100%', marginTop: 20 }}>
          <Button
            text="I Consent"
            onPress={() => {
              setAccepted(true);
              router.replace('/vehicle');
            }}
            style={buttonStyles.instructionsButton}
          />
          <Button
            text="Decline"
            onPress={() => {
              Alert.alert(
                'Consent Required',
                'You need to accept the terms to proceed. You can close the app now.',
                [{ text: 'OK' }]
              );
            }}
            style={[buttonStyles.backButton, { marginTop: 10 }]}
          />
        </View>
      </View>
    </ScrollView>
  );
}
