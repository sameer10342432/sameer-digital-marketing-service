import React, { useEffect, useRef } from 'react';
import { Linking, Platform, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const WHATSAPP_NUMBER = '923081800344';

export function FloatingWhatsApp() {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);
  const pulse = useSharedValue(1);
  const mounted = useSharedValue(0);

  useEffect(() => {
    mounted.value = withSpring(1, { damping: 10, stiffness: 120 });

    pulse.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * mounted.value },
    ],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: (2 - pulse.value) * 0.45,
  }));

  const bottomOffset = Platform.OS === 'web'
    ? 34 + 84 + 16
    : insets.bottom + 80 + 16;

  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withSpring(0.85, { damping: 8 }),
      withSpring(1, { damping: 8 })
    );
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}`);
  }

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.wrapper, { bottom: bottomOffset, right: 18 }, btnStyle]}
    >
      <Animated.View style={[styles.ring, ringStyle]} />
      <Pressable
        onPress={handlePress}
        style={styles.btn}
        testID="floating-whatsapp"
      >
        <Ionicons name="logo-whatsapp" size={28} color="#fff" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#25D366',
  },
  btn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
});
