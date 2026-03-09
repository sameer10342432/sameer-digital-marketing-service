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
import Colors from '@/constants/colors';
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

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          multiline && styles.inputWrapperMultiline,
        ]}
      >
        <Ionicons
          name={icon as any}
          size={18}
          color={focused ? Colors.accent : Colors.textMuted}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          textAlignVertical={multiline ? 'top' : 'center'}
          cursorColor={Colors.accent}
          selectionColor={Colors.accent + '60'}
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

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Service Interested In</Text>
      <Pressable
        style={[styles.inputWrapper, open && styles.inputWrapperFocused]}
        onPress={() => setOpen((o) => !o)}
      >
        <Ionicons
          name="briefcase-outline"
          size={18}
          color={open ? Colors.accent : Colors.textMuted}
          style={styles.inputIcon}
        />
        <Text style={[styles.pickerText, !selected && { color: Colors.textMuted }]}>
          {selected || 'Select a service'}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={Colors.textMuted}
        />
      </Pressable>

      {open && (
        <View style={styles.pickerDropdown}>
          {SERVICE_OPTIONS.map((opt) => (
            <Pressable
              key={opt}
              style={[styles.pickerOption, selected === opt && styles.pickerOptionSelected]}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
                Haptics.selectionAsync();
              }}
            >
              <Text
                style={[
                  styles.pickerOptionText,
                  selected === opt && styles.pickerOptionTextSelected,
                ]}
              >
                {opt}
              </Text>
              {selected === opt && (
                <Ionicons name="checkmark" size={16} color={Colors.accent} />
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
    } catch (e) {
      Alert.alert('Error', 'Failed to send inquiry. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <View style={[styles.successContainer, { paddingTop: topPadding }]}>
          <View style={styles.successIcon}>
            <LinearGradient colors={[Colors.accent, Colors.cyan]} style={styles.successGradient}>
              <Ionicons name="checkmark" size={36} color="#fff" />
            </LinearGradient>
          </View>
          <Text style={styles.successTitle}>Inquiry Sent!</Text>
          <Text style={styles.successSubtitle}>
            Thank you, {form.name.split(' ')[0]}! I'll get back to you as soon as possible.
          </Text>
          <Pressable
            style={styles.newInquiryBtn}
            onPress={() => {
              setSubmitted(false);
              setForm({ name: '', email: '', phone: '', service: '', message: '' });
            }}
          >
            <Text style={styles.newInquiryText}>Send Another Inquiry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPadding + 16, paddingBottom: bottomPadding + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.headerTitle}>Contact</Text>
        <Text style={styles.headerSubtitle}>
          Fill out the form and I'll reach out shortly.
        </Text>

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
            style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!isValid || submitting}
          >
            <LinearGradient
              colors={isValid ? [Colors.accent, Colors.cyan] : [Colors.border, Colors.border]}
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
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 0,
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: Colors.text,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  inputWrapperFocused: {
    borderColor: Colors.accent,
    backgroundColor: Colors.surface2,
  },
  inputWrapperMultiline: {
    alignItems: 'flex-start',
    paddingTop: 14,
    paddingBottom: 14,
    minHeight: 120,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.text,
  },
  inputMultiline: {
    height: 90,
  },
  pickerText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.text,
  },
  pickerDropdown: {
    backgroundColor: Colors.surface2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
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
    borderBottomColor: Colors.border,
  },
  pickerOptionSelected: {
    backgroundColor: Colors.accentGlow,
  },
  pickerOptionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.text,
  },
  pickerOptionTextSelected: {
    fontFamily: 'Inter_600SemiBold',
    color: Colors.accent,
  },
  submitBtnWrap: {
    marginTop: 28,
  },
  submitBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  submitBtnDisabled: {
    opacity: 0.5,
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
    color: Colors.text,
  },
  successSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
  },
  newInquiryBtn: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  newInquiryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.accent,
  },
});
