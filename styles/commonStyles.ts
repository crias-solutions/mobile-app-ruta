
import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#162456',
  secondary: '#5E60CE',
  accent: '#64B5F6',
  background: '#101824',
  backgroundAlt: '#162133',
  text: '#e3e3e3',
  grey: '#90CAF9',
  card: '#193cb8',
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 10,
    paddingVertical: 14,
    boxShadow: '0px 4px 14px rgba(0,0,0,0.25)',
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 10,
    paddingVertical: 14,
    boxShadow: '0px 4px 14px rgba(0,0,0,0.25)',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxWidth: 900,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'left',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'left',
    color: colors.text,
    marginBottom: 6,
    fontFamily: 'Inter_600SemiBold',
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22,
    textAlign: 'left',
    fontFamily: 'Inter_400Regular',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: 'white',
  },
});
