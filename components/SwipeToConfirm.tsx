
import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import { colors } from '../styles/commonStyles';

interface Props {
  text?: string;
  trackColor?: string;
  thumbColor?: string;
  onConfirmed: () => void;
}

export default function SwipeToConfirm({ text = 'Swipe', trackColor = '#1e2a44', thumbColor = '#64B5F6', onConfirmed }: Props) {
  const width = 320;
  const padding = 6;
  const trackWidth = width - padding * 2;
  const thumbSize = 44;
  const maxX = trackWidth - thumbSize;
  const x = useSharedValue(0);
  const [confirmed, setConfirmed] = useState(false);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      x.value = Math.max(0, Math.min(maxX, e.translationX));
    })
    .onEnd(() => {
      if (x.value > maxX * 0.8) {
        x.value = withTiming(maxX, { duration: 150 }, () => {
          runOnJS(setConfirmed)(true);
          runOnJS(onConfirmed)();
        });
      } else {
        x.value = withTiming(0, { duration: 150 });
      }
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  return (
    <View style={{ width, alignItems: 'center', display: 'contents' as any }}>
      <View style={[styles.track, { backgroundColor: trackColor }]}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.thumb, { backgroundColor: thumbColor }, thumbStyle]}>
            <Text style={styles.label}>{confirmed ? '✓' : '›'}</Text>
          </Animated.View>
        </GestureDetector>
        <Text style={styles.centerText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.25)',
  },
  thumb: {
    position: 'absolute',
    left: 6,
    top: 6,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: 'white',
    fontSize: 24,
    fontWeight: '800',
  },
  centerText: {
    color: colors.text,
    fontSize: 14,
    position: 'absolute',
  },
});
