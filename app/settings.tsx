
import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Button from '../components/Button';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { useNotificationScheduler } from '../hooks/useNotificationScheduler';
import { formatTime, generateId } from '../utils/notificationService';
import i18n from '../utils/i18n';
import { getPersistentNotificationEnabled, setPersistentNotificationEnabled } from '../utils/notificationService';

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export default function SettingsScreen() {
  const {
    enabled,
    schedules,
    loading,
    permissionGranted,
    setEnabled,
    addSchedule,
    removeSchedule,
  } = useNotificationScheduler();

  const [persistentEnabled, setPersistentEnabledState] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedDays, setSelectedDays] = useState<boolean[]>([false, false, false, false, false, false, false]);

  const loadPersistentSetting = useCallback(async () => {
    const value = await getPersistentNotificationEnabled();
    setPersistentEnabledState(value);
  }, []);

  loadPersistentSetting();

  const handlePersistentToggle = async (value: boolean) => {
    setPersistentEnabledState(value);
    await setPersistentNotificationEnabled(value);
  };

  const handleAddSchedule = async () => {
    if (!selectedDays.some(d => d)) {
      Alert.alert(i18n.t('settings.selectDaysError'), i18n.t('settings.selectDaysErrorMessage'));
      return;
    }

    await addSchedule({
      id: generateId(),
      hour: selectedHour,
      minute: selectedMinute,
      days: selectedDays,
    });

    setShowAddModal(false);
    setSelectedDays([false, false, false, false, false, false, false]);
    setSelectedHour(9);
    setSelectedMinute(0);
  };

  const handleDeleteSchedule = (id: string) => {
    Alert.alert(
      i18n.t('settings.deleteSchedule'),
      i18n.t('settings.deleteScheduleConfirm'),
      [
        { text: i18n.t('common.cancel'), style: 'cancel' },
        { text: i18n.t('common.delete'), style: 'destructive', onPress: () => removeSchedule(id) },
      ]
    );
  };

  const toggleDay = (index: number) => {
    const newDays = [...selectedDays];
    newDays[index] = !newDays[index];
    setSelectedDays(newDays);
  };

  const onTimeChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedDate) {
      setSelectedHour(selectedDate.getHours());
      setSelectedMinute(selectedDate.getMinutes());
    }
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center' }]}>
        <Text style={commonStyles.text}>{i18n.t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[commonStyles.content, { padding: 20 }]}>
        <Text style={commonStyles.title}>{i18n.t('settings.title')}</Text>

        {!permissionGranted && (
          <View style={[commonStyles.card, { borderColor: '#ffb74d', marginBottom: 16 }]}>
            <Text style={[commonStyles.text, { color: '#ffcc80' }]}>
              {i18n.t('settings.permissionRequired')}
            </Text>
          </View>
        )}

        <View style={[commonStyles.card, { marginBottom: 16 }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Text style={commonStyles.subtitle}>{i18n.t('settings.enableReminders')}</Text>
              <Text style={[commonStyles.text, { fontSize: 13, color: colors.grey }]}>
                {i18n.t('settings.enableRemindersDescription')}
              </Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={enabled ? '#FFFFFF' : '#B0B0B0'}
            />
          </View>
        </View>

        {enabled && permissionGranted && (
          <>
            <View style={[commonStyles.card, { marginBottom: 16 }]}>
              <View style={styles.settingRow}>
                <View style={styles.settingLabel}>
                  <Text style={commonStyles.subtitle}>{i18n.t('settings.persistentNotification')}</Text>
                  <Text style={[commonStyles.text, { fontSize: 13, color: colors.grey }]}>
                    {i18n.t('settings.persistentNotificationDescription')}
                  </Text>
                </View>
                <Switch
                  value={persistentEnabled}
                  onValueChange={handlePersistentToggle}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={persistentEnabled ? '#FFFFFF' : '#B0B0B0'}
                />
              </View>
            </View>

            <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
              {i18n.t('settings.scheduledReminders')}
            </Text>

            {schedules.length === 0 ? (
              <Text style={[commonStyles.text, { marginBottom: 16, color: colors.grey }]}>
                {i18n.t('settings.noSchedules')}
              </Text>
            ) : (
              schedules.map((schedule) => (
                <View key={schedule.id} style={[commonStyles.card, { marginBottom: 10 }]}>
                  <View style={styles.scheduleRow}>
                    <View style={styles.scheduleInfo}>
                      <Text style={commonStyles.subtitle}>
                        {formatTime(schedule.hour, schedule.minute)}
                      </Text>
                      <View style={styles.daysRow}>
                        {DAY_KEYS.map((day, index) => (
                          <View
                            key={day}
                            style={[
                              styles.dayBadge,
                              { backgroundColor: schedule.days[index] ? colors.accent : colors.border },
                            ]}
                          >
                            <Text style={styles.dayText}>
                              {i18n.t(`settings.days.${day}`)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteSchedule(schedule.id)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash-outline" size={20} color="#ef5350" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            <Button
              text={i18n.t('settings.addReminder')}
              onPress={() => setShowAddModal(true)}
              style={[buttonStyles.instructionsButton, { marginTop: 8 }]}
            />
          </>
        )}

        <View style={{ height: 20 }} />
        <Button
          text={i18n.t('common.back')}
          onPress={() => router.back()}
          style={buttonStyles.backButton}
        />
      </View>

      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[commonStyles.card, styles.modalContent]}>
            <Text style={commonStyles.title}>{i18n.t('settings.addReminder')}</Text>

            <TouchableOpacity
              style={[styles.timeButton, { backgroundColor: colors.backgroundAlt }]}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={24} color={colors.text} />
              <Text style={commonStyles.subtitle}>
                {formatTime(selectedHour, selectedMinute)}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={new Date(2024, 0, 1, selectedHour, selectedMinute)}
                mode="time"
                is24Hour={false}
                onChange={onTimeChange}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                themeVariant="dark"
              />
            )}

            <Text style={[commonStyles.subtitle, { marginTop: 16, marginBottom: 8 }]}>
              {i18n.t('settings.selectDays')}
            </Text>

            <View style={styles.daysRow}>
              {DAY_KEYS.map((day, index) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayBadge,
                    styles.dayBadgeTouchable,
                    { backgroundColor: selectedDays[index] ? colors.accent : colors.border },
                  ]}
                  onPress={() => toggleDay(index)}
                >
                  <Text style={styles.dayText}>
                    {i18n.t(`settings.days.${day}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <Button
                text={i18n.t('common.cancel')}
                onPress={() => setShowAddModal(false)}
                style={[buttonStyles.backButton, { flex: 1, marginRight: 8 }]}
              />
              <Button
                text={i18n.t('common.add')}
                onPress={handleAddSchedule}
                style={[buttonStyles.instructionsButton, { flex: 1, marginLeft: 8 }]}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = {
  settingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  settingLabel: {
    flex: 1,
    marginRight: 12,
  },
  scheduleRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  scheduleInfo: {
    flex: 1,
  },
  daysRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginTop: 8,
    gap: 6,
  },
  dayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 32,
    alignItems: 'center' as const,
  },
  dayBadgeTouchable: {
    cursor: 'pointer' as const,
  },
  dayText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600' as const,
  },
  deleteButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
  modalContent: {
    width: '100%' as const,
    maxWidth: 400,
    padding: 20,
  },
  timeButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 10,
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
  },
  modalButtons: {
    flexDirection: 'row' as const,
    marginTop: 24,
  },
};
