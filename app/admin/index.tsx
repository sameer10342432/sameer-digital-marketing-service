import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { apiRequest } from '@/lib/query-client';

export default function AdminLoginScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 : insets.bottom;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: formX.value }],
  }));

  const shake = () => {
    formX.value = withSequence(
      withTiming(-12, { duration: 60 }),
      withTiming(12, { duration: 60 }),
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(0, { duration: 60 }),
    );
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shake();
      return;
    }
    setLoading(true);
    try {
      const res = await apiRequest('POST', '/api/admin/login', {
        username: username.trim(),
        password,
      });
      const data = await res.json();
      await AsyncStorage.setItem('admin_token', data.token);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/admin/dashboard');
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shake();
      Alert.alert('Login Failed', 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg, paddingTop: topPadding, paddingBottom: bottomPadding },
      ]}
    >
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
      </Pressable>

      <View style={styles.content}>
        <View style={styles.logoArea}>
          <LinearGradient
            colors={[colors.accent, colors.cyan]}
            style={styles.logoGradient}
          >
            <Ionicons name="shield-checkmark" size={28} color="#fff" />
          </LinearGradient>
          <Text style={[styles.title, { color: colors.text }]}>Admin Panel</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Sign in to manage inquiries
          </Text>
        </View>

        <Animated.View style={[styles.form, shakeStyle]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Username</Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={18}
                color={colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter username"
                placeholderTextColor={colors.textMuted}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                cursorColor={colors.accent}
                selectionColor={colors.accent + '60'}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter password"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                cursorColor={colors.accent}
                selectionColor={colors.accent + '60'}
              />
              <Pressable onPress={() => setShowPassword((s) => !s)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.textMuted}
                />
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
            <LinearGradient
              colors={[colors.accent, colors.cyan]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginGradient}
            >
              <Text style={styles.loginText}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
            </LinearGradient>
          </Pressable>

          <Text style={[styles.hint, { color: colors.textMuted }]}>
            Default: admin / admin
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 40,
  },
  logoArea: {
    alignItems: 'center',
    gap: 12,
  },
  logoGradient: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  form: { gap: 18 },
  inputGroup: { gap: 8 },
  inputLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
  },
  loginBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
  },
  loginGradient: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loginText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#fff',
  },
  hint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    textAlign: 'center',
  },
});
