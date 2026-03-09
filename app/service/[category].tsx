import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { SERVICES } from '@/constants/services';

export default function ServiceDetailScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const service = SERVICES.find((s) => s.id === category);
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const bottomPadding = Platform.OS === 'web' ? 34 : insets.bottom;

  if (!service) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.textMuted }}>Service not found.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[service.bgColor, colors.bg]}
          style={styles.heroBg}
        >
          <View style={[styles.heroIcon, { backgroundColor: service.color + '22' }]}>
            <Ionicons name={service.iconName as any} size={40} color={service.color} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>{service.title}</Text>
          <Text style={[styles.heroDesc, { color: colors.textSecondary }]}>
            {service.description}
          </Text>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>What's Included</Text>
          <View
            style={[
              styles.itemsCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {service.subItems.map((item, idx) => (
              <View key={item}>
                <View style={styles.serviceItem}>
                  <View style={[styles.itemCheck, { backgroundColor: service.bgColor }]}>
                    <Ionicons name="checkmark" size={14} color={service.color} />
                  </View>
                  <Text style={[styles.itemText, { color: colors.text }]}>{item}</Text>
                </View>
                {idx < service.subItems.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View
            style={[
              styles.whyCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={[styles.whyIcon, { backgroundColor: service.bgColor }]}>
              <Ionicons name="star" size={18} color={service.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.whyTitle, { color: colors.text }]}>
                Why choose this service?
              </Text>
              <Text style={[styles.whyText, { color: colors.textSecondary }]}>
                Get professional results with a tailored approach. I work closely with you to
                understand your goals and deliver solutions that drive real growth.
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          style={styles.ctaBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/(tabs)/contact');
          }}
        >
          <LinearGradient
            colors={[service.color, service.color + 'AA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>Request This Service</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { gap: 0 },
  heroBg: {
    padding: 28,
    paddingTop: 20,
    alignItems: 'center',
    gap: 12,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    textAlign: 'center',
  },
  heroDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 23,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 14,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
  },
  itemsCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemCheck: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
  },
  divider: {
    height: 1,
    marginLeft: 58,
  },
  whyCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  whyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  whyTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    marginBottom: 8,
  },
  whyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
  },
  ctaBtn: {
    marginHorizontal: 16,
    marginTop: 28,
    borderRadius: 14,
    overflow: 'hidden',
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  ctaText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#fff',
  },
});
