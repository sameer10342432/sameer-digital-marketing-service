import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';

const TRACK_WIDTH = 64;
const TRACK_HEIGHT = 34;
const THUMB_SIZE = 26;
const THUMB_PADDING = 4;
const TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_PADDING * 2;

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  const progress = useSharedValue(isDark ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(isDark ? 1 : 0, {
      damping: 18,
      stiffness: 200,
    });
  }, [isDark]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['#E8EEFF', '#141928'],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      ['#C8D6FF', '#2A3456'],
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(progress.value * TRAVEL, {
          damping: 18,
          stiffness: 220,
        }),
      },
    ],
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['#FFFFFF', '#1C2540'],
    ),
    shadowOpacity: withTiming(progress.value === 0 ? 0.18 : 0.35, {
      duration: 300,
    }),
  }));

  const sunStyle = useAnimatedStyle(() => ({
    opacity: withTiming(1 - progress.value, { duration: 200 }),
    transform: [
      {
        rotate: withSpring(`${progress.value * 90}deg`, {
          damping: 15,
          stiffness: 180,
        }),
      },
      { scale: withTiming(1 - progress.value * 0.3, { duration: 250 }) },
    ],
  }));

  const moonStyle = useAnimatedStyle(() => ({
    opacity: withTiming(progress.value, { duration: 200 }),
    transform: [
      {
        rotate: withSpring(`${(1 - progress.value) * -90}deg`, {
          damping: 15,
          stiffness: 180,
        }),
      },
      { scale: withTiming(0.7 + progress.value * 0.3, { duration: 250 }) },
    ],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  return (
    <Pressable onPress={handlePress} hitSlop={8}>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]}>
          <View style={styles.iconContainer}>
            <Animated.View style={[StyleSheet.absoluteFill, styles.iconCenter, sunStyle]}>
              <Ionicons name="sunny" size={14} color="#F59E0B" />
            </Animated.View>
            <Animated.View style={[StyleSheet.absoluteFill, styles.iconCenter, moonStyle]}>
              <Ionicons name="moon" size={13} color="#7DB3FF" />
            </Animated.View>
          </View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    borderWidth: 1.5,
    justifyContent: 'center',
    paddingHorizontal: THUMB_PADDING,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
