
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import i18n from './i18n';

const NOTIFICATION_ENABLED_KEY = 'notification_enabled';
const NOTIFICATION_SCHEDULES_KEY = 'notification_schedules';
const PERSISTENT_NOTIF_KEY = 'persistent_notif_enabled';

export interface NotificationSchedule {
  id: string;
  hour: number;
  minute: number;
  days: boolean[];
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.log('Notifications not supported on simulator/web');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permission not granted');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: i18n.t('notifications.channelReminders'),
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4A5A7A',
    });
  }

  return true;
}

export async function scheduleNotification(schedule: NotificationSchedule): Promise<string[] | null> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return null;

  const enabledDayIndices = schedule.days
    .map((enabled, index) => (enabled ? index : -1))
    .filter((index) => index !== -1);

  if (enabledDayIndices.length === 0) return null;

  const notificationIds: string[] = [];

  try {
    for (const dayIndex of enabledDayIndices) {
      const trigger: Notifications.NotificationTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        hour: schedule.hour,
        minute: schedule.minute,
        weekday: dayIndex + 1,
      };

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t('notifications.reminderTitle'),
          body: i18n.t('notifications.reminderBody'),
          sound: true,
          data: { scheduleId: schedule.id, dayIndex },
        },
        trigger,
      });

      notificationIds.push(notificationId);
      console.log('Scheduled notification for day', dayIndex, ':', notificationId);
    }

    return notificationIds;
  } catch (e) {
    console.log('scheduleNotification error', e);
    return null;
  }
}

export async function cancelAllScheduledNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Cancelled all scheduled notifications');
  } catch (e) {
    console.log('cancelAllScheduledNotifications error', e);
  }
}

export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (e) {
    console.log('getScheduledNotifications error', e);
    return [];
  }
}

export async function setNotificationEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, JSON.stringify(enabled));
    if (!enabled) {
      await cancelAllScheduledNotifications();
    }
  } catch (e) {
    console.log('setNotificationEnabled error', e);
  }
}

export async function getNotificationEnabled(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(NOTIFICATION_ENABLED_KEY);
    return value ? JSON.parse(value) : false;
  } catch (e) {
    console.log('getNotificationEnabled error', e);
    return false;
  }
}

export async function saveNotificationSchedules(schedules: NotificationSchedule[]): Promise<void> {
  try {
    await AsyncStorage.setItem(NOTIFICATION_SCHEDULES_KEY, JSON.stringify(schedules));
  } catch (e) {
    console.log('saveNotificationSchedules error', e);
  }
}

export async function getNotificationSchedules(): Promise<NotificationSchedule[]> {
  try {
    const value = await AsyncStorage.getItem(NOTIFICATION_SCHEDULES_KEY);
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.log('getNotificationSchedules error', e);
    return [];
  }
}

export async function setPersistentNotificationEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(PERSISTENT_NOTIF_KEY, JSON.stringify(enabled));
  } catch (e) {
    console.log('setPersistentNotificationEnabled error', e);
  }
}

export async function getPersistentNotificationEnabled(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(PERSISTENT_NOTIF_KEY);
    return value ? JSON.parse(value) : true;
  } catch (e) {
    console.log('getPersistentNotificationEnabled error', e);
    return true;
  }
}

export function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
