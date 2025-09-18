
import React from 'react';
import { View, Image, StyleSheet, Platform } from 'react-native';

interface RUTALogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  style?: any;
}

const RUTALogo: React.FC<RUTALogoProps> = ({ size = 'medium', style }) => {
  console.log('RUTALogo rendering with size:', size, 'Platform:', Platform.OS);
  
  const getLogoSource = () => {
    // Use different resolution logos based on size
    // All 5 logos are available with different resolutions
    switch (size) {
      case 'small':
        return require('../assets/images/26fb2f8c-55c0-48c6-98fd-3d740e74f3f4.png'); // Smallest resolution
      case 'medium':
        return require('../assets/images/cd71a84d-7eeb-453b-9ef2-ba38ad16759b.png'); // Medium resolution
      case 'large':
        return require('../assets/images/e1b7fb25-1490-407c-84a0-9d592d1d7078.png'); // Large resolution
      case 'xlarge':
        return require('../assets/images/03c3eb6d-4b62-45d1-8c7d-df8b589efe1e.png'); // Largest resolution
      default:
        return require('../assets/images/6f799448-25a2-43b0-b365-09640a4b90d2.png'); // Default medium-large
    }
  };

  const getLogoSize = () => {
    switch (size) {
      case 'small':
        return { width: 32, height: 32 };
      case 'medium':
        return { width: 48, height: 48 };
      case 'large':
        return { width: 80, height: 80 };
      case 'xlarge':
        return { width: 120, height: 120 };
      default:
        return { width: 48, height: 48 };
    }
  };

  // Only show RUTA logo on Android
  if (Platform.OS !== 'android') {
    console.log('Not Android, returning null');
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        source={getLogoSource()}
        style={[styles.logo, getLogoSize()]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    borderRadius: 8,
  },
});

export default RUTALogo;
