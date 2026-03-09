import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { SERVICES } from '@/constants/services';
import { apiRequest } from '@/lib/query-client';

const SERVICE_OPTIONS = SERVICES.map((s) => s.title);

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  multiline,
  keyboardType,
  icon,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  multiline?: boolean;
  keyboardType?: any;
  icon: string;
}) {
  const [focused, setFocused] = useState(false);
  const { colors } = useTheme();

  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: colors.surface, borderColor: colors.border },
          focused && { borderColor: colors.accent, backgroundColor: colors.surface2 },
          multiline && styles.inputWrapperMultiline,
        ]}
      >
        <Ionicons
          name={icon as any}
          size={18}
          color={focused ? colors.accent : colors.textMuted}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, { color: colors.text }, multiline && styles.inputMultiline]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          textAlignVertical={multiline ? 'top' : 'center'}
          cursorColor={colors.accent}
          selectionColor={colors.accent + '60'}
        />
      </View>
    </View>
  );
}

function ServicePicker({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (s: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();

  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
        Service Interested In
      </Text>
      <Pressable
        style={[
          styles.inputWrapper,
          { backgroundColor: colors.surface, borderColor: colors.border },
          open && { borderColor: colors.accent, backgroundColor: colors.surface2 },
        ]}
        onPress={() => setOpen((o) => !o)}
      >
        <Ionicons
          name="briefcase-outline"
          size={18}
          color={open ? colors.accent : colors.textMuted}
          style={styles.inputIcon}
        />
        <Text
          style={[
            styles.pickerText,
            { color: selected ? colors.text : colors.textMuted },
          ]}
        >
          {selected || 'Select a service'}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textMuted}
        />
      </Pressable>

      {open && (
        <View
          style={[
            styles.pickerDropdown,
            { backgroundColor: colors.surface2, borderColor: colors.border },
          ]}
        >
          {SERVICE_OPTIONS.map((opt) => (
            <Pressable
              key={opt}
              style={[
                styles.pickerOption,
                { borderBottomColor: colors.border },
                selected === opt && { backgroundColor: colors.accentGlow },
              ]}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
                Haptics.selectionAsync();
              }}
            >
              <Text
                style={[
                  styles.pickerOptionText,
                  { color: colors.text },
                  selected === opt && { color: colors.accent, fontFamily: 'Inter_600SemiBold' },
                ]}
              >
                {opt}
              </Text>
              {selected === opt && (
                <Ionicons name="checkmark" size={16} color={colors.accent} />
              )}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 : 0;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  const update = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const isValid =
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.service &&
    form.message.trim();

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    btnScale.value = withSpring(0.96, {}, () => {
      btnScale.value = withSpring(1);
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSubmitting(true);
    try {
      await apiRequest('POST', '/api/inquiries', form);
      setSubmitted(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert('Error', 'Failed to send inquiry. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={[styles.successContainer, { paddingTop: topPadding }]}>
          <View style={styles.successIcon}>
            <LinearGradient
              colors={[colors.accent, colors.cyan]}
              style={styles.successGradient}
            >
              <Ionicons name="checkmark" size={36} color="#fff" />
            </LinearGradient>
          </View>
          <Text style={[styles.successTitle, { color: colors.text }]}>Inquiry Sent!</Text>
          <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
            Thank you, {form.name.split(' ')[0]}! I'll get back to you as soon as possible.
          </Text>
          <Pressable
            style={[styles.newInquiryBtn, { borderColor: colors.accent }]}
            onPress={() => {
              setSubmitted(false);
              setForm({ name: '', email: '', phone: '', service: '', message: '' });
            }}
          >
            <Text style={[styles.newInquiryText, { color: colors.accent }]}>
              Send Another Inquiry
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding + 16, paddingBottom: bottomPadding + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>Contact</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
          Fill out the form or reach out directly on WhatsApp.
        </Text>

        <Pressable
          style={[styles.whatsappBtn, { backgroundColor: 'rgba(37, 211, 102, 0.12)', borderColor: 'rgba(37, 211, 102, 0.3)' }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Linking.openURL('https://wa.me/923081800344');
          }}
        >
          <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={[styles.whatsappLabel, { color: '#25D366' }]}>Chat on WhatsApp</Text>
            <Text style={[styles.whatsappNumber, { color: colors.textMuted }]}>+92 308 1800344</Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color="#25D366" />
        </Pressable>

        <View style={styles.orRow}>
          <View style={[styles.orLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.orText, { color: colors.textMuted }]}>or send a message</Text>
          <View style={[styles.orLine, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.form}>
          <InputField
            label="Full Name"
            placeholder="Your name"
            value={form.name}
            onChangeText={update('name')}
            icon="person-outline"
          />
          <InputField
            label="Email Address"
            placeholder="your@email.com"
            value={form.email}
            onChangeText={update('email')}
            keyboardType="email-address"
            icon="mail-outline"
          />
          <InputField
            label="Phone Number"
            placeholder="+92 300 0000000"
            value={form.phone}
            onChangeText={update('phone')}
            keyboardType="phone-pad"
            icon="call-outline"
          />
          <ServicePicker selected={form.service} onSelect={update('service')} />
          <InputField
            label="Message"
            placeholder="Tell me about your project or requirements..."
            value={form.message}
            onChangeText={update('message')}
            multiline
            icon="chatbubble-outline"
          />
        </View>

        <Animated.View style={[btnStyle, styles.submitBtnWrap]}>
          <Pressable
            style={[styles.submitBtn, !isValid && { opacity: 0.5 }]}
            onPress={handleSubmit}
            disabled={!isValid || submitting}
          >
            <LinearGradient
              colors={
                isValid ? [colors.accent, colors.cyan] : [colors.border, colors.border]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitGradient}
            >
              {submitting ? (
                <Text style={styles.submitText}>Sending...</Text>
              ) : (
                <>
                  <Text style={styles.submitText}>Send Inquiry</Text>
                  <Ionicons name="send" size={16} color="#fff" />
                </>
              )}
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginBottom: 16,
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  whatsappLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  whatsappNumber: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 1,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
  },
  orText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  form: { gap: 16 },
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
    minHeight: 52,
  },
  inputWrapperMultiline: {
    alignItems: 'flex-start',
    paddingTop: 14,
    paddingBottom: 14,
    minHeight: 120,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
  },
  inputMultiline: { height: 90 },
  pickerText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
  },
  pickerDropdown: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 4,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  pickerOptionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  submitBtnWrap: { marginTop: 28 },
  submitBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  submitText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#fff',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  successIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    marginBottom: 8,
  },
  successGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
  },
  successSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 23,
  },
  newInquiryBtn: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  newInquiryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
});
