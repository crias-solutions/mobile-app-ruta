import { useEffect, useRef } from 'react';
import { sendInactivityReminder } from '../utils/reminderService';

const INACTIVITY_SPEED_THRESHOLD = 0.1;
const FIRST_REMINDER_AFTER_SEC = 10 * 60;
const BASE_INTERVAL = 300;
const MIN_INTERVAL = 60;
const CHECK_INTERVAL_MS = 10000;

export function useInactivityDetector(
  isRecording: boolean,
  latestSpeedRef: React.MutableRefObject<number>
) {
  const continuousStoppedTimeRef = useRef(0);
  const lastCheckRef = useRef(Date.now());
  const lastReminderLevelRef = useRef(0);
  const nextReminderAtRef = useRef(FIRST_REMINDER_AFTER_SEC);

  useEffect(() => {
    if (!isRecording) {
      continuousStoppedTimeRef.current = 0;
      lastReminderLevelRef.current = 0;
      lastCheckRef.current = Date.now();
      nextReminderAtRef.current = FIRST_REMINDER_AFTER_SEC;
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastCheckRef.current) / 1000;
      lastCheckRef.current = now;

      const speed = latestSpeedRef.current;

      if (speed < INACTIVITY_SPEED_THRESHOLD) {
        continuousStoppedTimeRef.current += delta;
      } else {
        continuousStoppedTimeRef.current = 0;
        lastReminderLevelRef.current = 0;
        nextReminderAtRef.current = FIRST_REMINDER_AFTER_SEC;
      }

      const stoppedSec = continuousStoppedTimeRef.current;

      if (stoppedSec >= nextReminderAtRef.current) {
        const level = lastReminderLevelRef.current + 1;
        lastReminderLevelRef.current = level;
        sendInactivityReminder(level);

        const nextInterval = Math.max(
          BASE_INTERVAL / Math.log(level + Math.E),
          MIN_INTERVAL
        );
        nextReminderAtRef.current = stoppedSec + nextInterval;
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isRecording, latestSpeedRef]);
}
