
import { router } from 'expo-router';
import { ScrollView, View, Text, Alert } from 'react-native';
import { useEffect } from 'react';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { useConsent } from '../hooks/useConsent';
import { CRIASLogo } from './_layout';
import Button from '../components/Button';

export default function TermsScreen() {
  const { accepted, loading, acceptConsent } = useConsent();

  useEffect(() => {
    if (accepted && !loading) {
      router.replace('/vehicle');
    }
  }, [accepted, loading]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[commonStyles.content, { padding: 20 }]}>
        <Text style={commonStyles.title}>Terms and Conditions</Text>
        
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Citizen Science Project</Text>
          <Text style={commonStyles.text}>
            This app is part of an open-source, open-data, open-science Citizen Science participatory sensing project 
            for collecting anonymized traffic trajectory data.
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Data Collection</Text>
          <Text style={commonStyles.text}>
            We collect sensor data (accelerometer, gyroscope, magnetometer) continuously and GPS data when online. 
            All data is stored locally on your device and only uploaded with your explicit consent.
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Privacy & Anonymity</Text>
          <Text style={commonStyles.text}>
            No personal identifiers are collected. All data is completely anonymous and cannot be traced back to you. 
            No authentication or login is required.
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Open Data Philosophy</Text>
          <Text style={commonStyles.text}>
            Collected data will be made available following FAIR (Findable, Accessible, Interoperable, Reusable) 
            principles for scientific research and public benefit.
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Your Rights</Text>
          <Text style={commonStyles.text}>
            You can stop data collection at any time. You choose whether to upload your data after each ride. 
            You can delete local data from your device at any time.
          </Text>
        </View>

        <Button
          text="I Accept and Continue"
          onPress={acceptConsent}
          style={[buttonStyles.instructionsButton, { marginTop: 20 }]}
        />

        {/* CRIAS Solutions Logo at bottom of page content */}
        <CRIASLogo />
      </View>
    </ScrollView>
  );
}
