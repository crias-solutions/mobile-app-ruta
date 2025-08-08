
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
        <Text style={commonStyles.title}>Citizen Science Data Collection</Text>
        <Text style={commonStyles.text}>
          Thank you for participating in this open-source, open-data, open-science Citizen Science project.
          This app collects anonymized motion and trajectory data to support research on traffic dynamics and mobility.
        </Text>

        <Text style={[commonStyles.subtitle, { marginTop: 16 }]}>What we collect</Text>
        <Text style={commonStyles.text}>
          - Gyroscope, accelerometer, magnetometer readings with timestamps (continuous).
          - GPS positions and metadata (only when device is online).
          - Selected vehicle type for this ride.
        </Text>

        <Text style={[commonStyles.subtitle, { marginTop: 16 }]}>How your data is used</Text>
        <Text style={commonStyles.text}>
          - Data is stored locally as CSV files during your ride.
          - After you end a ride, you will be asked whether to upload your data to a backend/cloud service.
          - Data is anonymous: no accounts, no personal identifiers, and no traceability to individuals.
          - Data is intended to be shared following FAIR principles by the backend in the future.
        </Text>

        <Text style={[commonStyles.subtitle, { marginTop: 16 }]}>Open-source and license</Text>
        <Text style={commonStyles.text}>
          This application and its source code are released under the Mozilla Public License 2.0 (MPL 2.0).
        </Text>

        <Text style={[commonStyles.subtitle, { marginTop: 16 }]}>Consent</Text>
        <Text style={commonStyles.text}>
          By tapping "I Consent", you confirm that:
          - You understand the purpose of the data collection.
          - You understand the participatory sensing nature of the project.
          - You agree to the anonymous, open-science use of your data.
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
