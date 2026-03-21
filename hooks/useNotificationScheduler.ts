
import { useEffect, useState, useCallback } from 'react';
import {
  NotificationSchedule,
  requestNotificationPermissions,
  getNotificationEnabled,
  setNotificationEnabled,
  getNotificationSchedules,
  saveNotificationSchedules,
  scheduleNotification,
  cancelAllScheduledNotifications,
} from '../utils/notificationService';

export function useNotificationScheduler() {
  const [enabled, setEnabledState] = useState(false);
  const [schedules, setSchedulesState] = useState<NotificationSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const perms = await requestNotificationPermissions();
        setPermissionGranted(perms);

        const notifEnabled = await getNotificationEnabled();
        setEnabledState(notifEnabled);

        const savedSchedules = await getNotificationSchedules();
        setSchedulesState(savedSchedules);
      } catch (e) {
        console.log('useNotificationScheduler init error', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const syncSchedules = useCallback(async (newSchedules: NotificationSchedule[]) => {
    await cancelAllScheduledNotifications();

    if (enabled && permissionGranted) {
      for (const schedule of newSchedules) {
        if (schedule.days.some(d => d)) {
          await scheduleNotification(schedule);
        }
      }
    }
  }, [enabled, permissionGranted]);

  const setEnabled = useCallback(async (value: boolean) => {
    setEnabledState(value);
    await setNotificationEnabled(value);

    if (!value) {
      await cancelAllScheduledNotifications();
      setSchedulesState([]);
    }
  }, []);

  const addSchedule = useCallback(async (schedule: NotificationSchedule) => {
    const newSchedules = [...schedules, schedule];
    setSchedulesState(newSchedules);
    await saveNotificationSchedules(newSchedules);
    await syncSchedules(newSchedules);
  }, [schedules, syncSchedules]);

  const removeSchedule = useCallback(async (id: string) => {
    const newSchedules = schedules.filter(s => s.id !== id);
    setSchedulesState(newSchedules);
    await saveNotificationSchedules(newSchedules);
    await syncSchedules(newSchedules);
  }, [schedules, syncSchedules]);

  const updateSchedule = useCallback(async (id: string, updates: Partial<NotificationSchedule>) => {
    const newSchedules = schedules.map(s =>
      s.id === id ? { ...s, ...updates } : s
    );
    setSchedulesState(newSchedules);
    await saveNotificationSchedules(newSchedules);
    await syncSchedules(newSchedules);
  }, [schedules, syncSchedules]);

  const clearAllSchedules = useCallback(async () => {
    setSchedulesState([]);
    await saveNotificationSchedules([]);
    await cancelAllScheduledNotifications();
  }, []);

  return {
    enabled,
    schedules,
    loading,
    permissionGranted,
    setEnabled,
    addSchedule,
    removeSchedule,
    updateSchedule,
    clearAllSchedules,
  };
}
