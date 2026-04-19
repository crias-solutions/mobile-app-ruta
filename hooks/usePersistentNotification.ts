
import { useEffect, useCallback, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { getPersistentNotificationEnabled } from '../utils/notificationService';
import i18n from '../utils/i18n';

const RECORDING_CHANNEL_ID = 'recording-status';

export function usePersistentNotification(isRecording: boolean) {
  const activeNotificationIdRef = useRef<string | null>(null);

  const showNotification = useCallback(async () => {
    if (!Device.isDevice) return;

    const enabled = await getPersistentNotificationEnabled();
    if (!enabled) return;

    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(RECORDING_CHANNEL_ID, {
          name: i18n.t('notifications.recordingChannel'),
          importance: Notifications.AndroidImportance.LOW,
          vibrationPattern: [0],
          lightColor: '#000000',
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          bypassDnd: false,
        });
      }

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t('notifications.recordingTitle'),
          body: i18n.t('notifications.recordingBody'),
          categoryIdentifier: 'recording',
          data: { type: 'recording_active' },
          sticky: true,
        },
        trigger: null as any,
      });

      activeNotificationIdRef.current = id;
      console.log('Recording notification shown:', id);
    } catch (e) {
      console.log('showNotification error', e);
    }
  }, []);

  const hideNotification = useCallback(async () => {
    try {
      if (activeNotificationIdRef.current) {
        await Notifications.dismissNotificationAsync(activeNotificationIdRef.current);
        activeNotificationIdRef.current = null;
      }

      const notifications = await Notifications.getPresentedNotificationsAsync();
      for (const notif of notifications) {
        if (notif.request.content.data?.type === 'recording_active') {
          await Notifications.dismissNotificationAsync(notif.request.identifier);
        }
      }
    } catch (e) {
      console.log('hideNotification error', e);
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      showNotification();
    } else {
      hideNotification();
    }
  }, [isRecording, showNotification, hideNotification]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data?.type === 'recording_active') {
        console.log('User tapped recording notification');
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    return () => {
      hideNotification();
    };
  }, [hideNotification]);
}
