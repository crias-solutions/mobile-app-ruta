
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
    // All 5 logos are available with different resolutions for both Android and iOS
    switch (size) {
      case 'small':
        return require('../assets/images/eb0dc417-c307-4234-bba7-5445f45f296b.png'); // Smallest resolution
      case 'medium':
        return require('../assets/images/bece3d82-8669-4205-a2de-f8e04ec1b98a.png'); // Medium resolution
      case 'large':
        return require('../assets/images/5eafd586-5369-46d4-8355-a213a11cba4e.png'); // Large resolution
      case 'xlarge':
        return require('../assets/images/4c90ad4b-09ad-4245-94d0-56b1fc84080e.png'); // Largest resolution
      default:
        return require('../assets/images/b8ffb960-e288-4fb3-90d4-37234491e70a.png'); // Default medium-large
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
