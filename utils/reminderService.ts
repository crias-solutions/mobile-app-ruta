
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const INACTIVITY_MESSAGES = [
  'Your recording is still active. Have you finished your trip?',
  'Still recording — remember to stop and upload your data.',
  'Your recording has been active for a while with no movement detected.',
  'Don\'t forget to stop your recording and upload your ride data.',
];

export async function sendInactivityReminder(level: number): Promise<void> {
  if (!Device.isDevice) return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('inactivity', {
      name: 'Inactivity Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    });
  }

  const index = Math.min(level - 1, INACTIVITY_MESSAGES.length - 1);
  const body = INACTIVITY_MESSAGES[index];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Recording Still Active',
      body,
      sound: 'default',
      data: { type: 'inactivity_reminder', level },
    },
    trigger: null,
  });
}
