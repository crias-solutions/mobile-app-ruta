import { useEffect, useRef } from 'react';
import { sendInactivityReminder } from '../utils/reminderService';

const INACTIVITY_SPEED_THRESHOLD = 0.1;
const FIRST_REMINDER_AFTER_SEC = 10 * 60;
const REMINDER_INTERVAL_SEC = 5 * 60;
const CHECK_INTERVAL_MS = 10000;

export function useInactivityDetector(
  isRecording: boolean,
  latestSpeedRef: React.MutableRefObject<number>
) {
  const continuousStoppedTimeRef = useRef(0);
  const lastCheckRef = useRef(Date.now());
  const lastReminderLevelRef = useRef(0);

  useEffect(() => {
    if (!isRecording) {
      continuousStoppedTimeRef.current = 0;
      lastReminderLevelRef.current = 0;
      lastCheckRef.current = Date.now();
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
      }

      const stoppedSec = continuousStoppedTimeRef.current;

      if (stoppedSec >= FIRST_REMINDER_AFTER_SEC) {
        const level =
          1 +
          Math.floor(
            (stoppedSec - FIRST_REMINDER_AFTER_SEC) / REMINDER_INTERVAL_SEC
          );

        if (level > lastReminderLevelRef.current) {
          lastReminderLevelRef.current = level;
          sendInactivityReminder(level);
        }
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isRecording, latestSpeedRef]);
}
