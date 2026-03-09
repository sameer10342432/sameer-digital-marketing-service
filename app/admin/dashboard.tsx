import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetch } from 'expo/fetch';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { getApiUrl } from '@/lib/query-client';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

async function adminRequest(
  method: string,
  path: string,
  token: string,
  body?: unknown,
): Promise<Response> {
  const url = new URL(path, getApiUrl()).toString();
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });
  return res;
}

function InquiryCard({
  inquiry,
  onDelete,
  onMarkRead,
}: {
  inquiry: Inquiry;
  onDelete: () => void;
  onMarkRead: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { colors } = useTheme();
  const date = new Date(inquiry.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Pressable
      style={[
        styles.inquiryCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
        !inquiry.isRead && {
          borderColor: colors.accent + '50',
          backgroundColor: colors.accentGlow,
        },
      ]}
      onPress={() => {
        setExpanded((e) => !e);
        if (!inquiry.isRead) onMarkRead();
      }}
    >
      <View style={styles.inquiryHeader}>
        <View style={styles.inquiryLeft}>
          {!inquiry.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />}
          <View style={styles.inquiryInfo}>
            <Text style={[styles.inquiryName, { color: colors.text }]}>{inquiry.name}</Text>
            <Text style={[styles.inquiryService, { color: colors.textMuted }]}>
              {inquiry.service}
            </Text>
          </View>
        </View>
        <View style={styles.inquiryRight}>
          <Text style={[styles.inquiryDate, { color: colors.textMuted }]}>{date}</Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.textMuted}
          />
        </View>
      </View>

      {expanded && (
        <View style={styles.inquiryExpanded}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.detailRow}>
            <Ionicons name="mail-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {inquiry.email}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="call-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {inquiry.phone}
            </Text>
          </View>
          <View style={[styles.messageBox, { backgroundColor: colors.surface2 }]}>
            <Text style={[styles.messageText, { color: colors.textSecondary }]}>
              {inquiry.message}
            </Text>
          </View>
          <Pressable
            style={styles.deleteBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Alert.alert('Delete Inquiry', 'Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: onDelete },
              ]);
            }}
          >
            <Ionicons name="trash-outline" size={15} color={colors.error} />
            <Text style={[styles.deleteBtnText, { color: colors.error }]}>Delete</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

function SettingsModal({
  visible,
  onClose,
  token,
  onCredentialsUpdated,
}: {
  visible: boolean;
  onClose: () => void;
  token: string;
  onCredentialsUpdated: (newToken: string) => void;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const { colors } = useTheme();

  if (!visible) return null;

  const handleSave = async () => {
    if (username.trim().length < 3 || password.length < 4) {
      Alert.alert('Error', 'Username min 3 chars, password min 4 chars.');
      return;
    }
    setSaving(true);
    try {
      const res = await adminRequest('PUT', '/api/admin/credentials', token, {
        username: username.trim(),
        password,
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      await AsyncStorage.setItem('admin_token', data.token);
      onCredentialsUpdated(data.token);
      onClose();
      Alert.alert('Success', 'Credentials updated!');
    } catch {
      Alert.alert('Error', 'Failed to update credentials.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={[styles.modal, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Change Credentials</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={22} color={colors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.modalBody}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>New Username</Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: colors.surface2, borderColor: colors.border },
              ]}
            >
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="New username"
                placeholderTextColor={colors.textMuted}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                cursorColor={colors.accent}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>New Password</Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: colors.surface2, borderColor: colors.border },
              ]}
            >
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="New password"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                cursorColor={colors.accent}
              />
            </View>
          </View>

          <Pressable style={styles.saveBtn} onPress={handleSave} disabled={saving}>
            <LinearGradient
              colors={[colors.accent, colors.cyan]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveGradient}
            >
              <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function AdminDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 : insets.bottom;

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const fetchInquiries = useCallback(
    async (tok: string) => {
      const res = await adminRequest('GET', '/api/admin/inquiries', tok);
      if (res.status === 401) {
        await AsyncStorage.removeItem('admin_token');
        router.replace('/admin');
        return;
      }
      const data = await res.json();
      setInquiries(data);
    },
    [],
  );

  useEffect(() => {
    (async () => {
      const tok = await AsyncStorage.getItem('admin_token');
      if (!tok) {
        router.replace('/admin');
        return;
      }
      setToken(tok);
      try {
        await fetchInquiries(tok);
      } catch {
        Alert.alert('Error', 'Could not load data.');
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchInquiries]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchInquiries(token);
    } catch {}
    setRefreshing(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await adminRequest('DELETE', `/api/admin/inquiries/${id}`, token);
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert('Error', 'Failed to delete.');
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await adminRequest('PATCH', `/api/admin/inquiries/${id}/read`, token);
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, isRead: true } : i)),
      );
    } catch {}
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('admin_token');
    router.replace('/admin');
  };

  const unreadCount = inquiries.filter((i) => !i.isRead).length;

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', paddingTop: topPadding },
        ]}
      >
        <Text style={{ color: colors.textMuted, fontFamily: 'Inter_400Regular' }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: topPadding }]}>
      <View style={[styles.dashHeader, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.dashTitle, { color: colors.text }]}>Inquiries</Text>
          {unreadCount > 0 && (
            <Text style={[styles.unreadCount, { color: colors.accent }]}>
              {unreadCount} unread
            </Text>
          )}
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={[styles.headerBtn, { backgroundColor: colors.surface }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowSettings(true);
            }}
          >
            <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
          </Pressable>
          <Pressable
            style={[styles.headerBtn, { backgroundColor: colors.surface }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
          </Pressable>
        </View>
      </View>

      {inquiries.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="mail-open-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Inquiries Yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
            Contact form submissions will appear here.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding + 20 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.accent}
            />
          }
        >
          {inquiries.map((inquiry) => (
            <InquiryCard
              key={inquiry.id}
              inquiry={inquiry}
              onDelete={() => handleDelete(inquiry.id)}
              onMarkRead={() => handleMarkRead(inquiry.id)}
            />
          ))}
        </ScrollView>
      )}

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        token={token}
        onCredentialsUpdated={(t) => setToken(t)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  dashHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  dashTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
  },
  unreadCount: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  inquiryCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  inquiryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  inquiryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  inquiryInfo: { flex: 1 },
  inquiryName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  inquiryService: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 2,
  },
  inquiryRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  inquiryDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  inquiryExpanded: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 10,
  },
  divider: { height: 1 },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  messageBox: {
    borderRadius: 10,
    padding: 12,
  },
  messageText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 20,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  deleteBtnText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
  },
  emptySubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 100,
  },
  modal: {
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
  },
  modalBody: {
    padding: 20,
    gap: 16,
  },
  inputGroup: { gap: 8 },
  inputLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  inputWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 50,
    justifyContent: 'center',
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
  },
  saveBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 4,
  },
  saveGradient: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  saveText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: '#fff',
  },
});
