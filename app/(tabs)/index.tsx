import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SERVICES } from '@/constants/services';

const { width } = Dimensions.get('window');

const STATS = [
  { label: 'Projects', value: '50+' },
  { label: 'Clients', value: '30+' },
  { label: 'Years Exp', value: '3+' },
  { label: 'Services', value: '7' },
];

function StatCard({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={[styles.statCard, { backgroundColor: colors.surface2 }]}>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

function ServiceChip({ service, onPress, colors }: { service: typeof SERVICES[0]; onPress: () => void; colors: any }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSequence(withSpring(0.93), withSpring(1));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={handlePress}
        style={[styles.serviceChip, { backgroundColor: service.bgColor }]}
      >
        <View style={[styles.serviceChipIcon, { backgroundColor: service.color + '25' }]}>
          <Ionicons name={service.iconName as any} size={20} color={service.color} />
        </View>
        <Text style={[styles.serviceChipTitle, { color: service.color }]}>{service.title}</Text>
        <Ionicons name="chevron-forward" size={14} color={service.color} />
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => ({
    opacity: withTiming(scrollY.value > 50 ? 1 : 0, { duration: 200 }),
  }));

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 : 0;

  const heroBgColors: [string, string] = colors.isDark
    ? ['#0D1535', colors.bg]
    : ['#DCEAFF', colors.bg];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Animated.View
        style={[
          styles.floatingHeader,
          { top: topPadding, backgroundColor: colors.bg + 'EE' },
          headerStyle,
        ]}
      >
        <Text style={[styles.floatingTitle, { color: colors.text }]}>Sameer Digital</Text>
      </Animated.View>

      <View style={[styles.topActions, { top: topPadding + 8 }]}>
        <ThemeToggle />
        <Pressable
          style={[styles.adminButton, { backgroundColor: colors.surface }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/admin');
          }}
        >
          <Ionicons name="settings-outline" size={18} color={colors.textMuted} />
        </Pressable>
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding + 20, paddingBottom: bottomPadding + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={heroBgColors}
          style={styles.heroBg}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View
            style={[
              styles.heroBadge,
              {
                backgroundColor: colors.accentGlow,
                borderColor: colors.accent + '30',
              },
            ]}
          >
            <View style={styles.heroBadgeDot} />
            <Text style={[styles.heroBadgeText, { color: colors.accentLight }]}>
              Available for projects
            </Text>
          </View>

          <Text style={[styles.heroName, { color: colors.text }]}>Muhammad Sameer</Text>
          <Text style={[styles.heroTitle, { color: colors.accent }]}>Digital Services</Text>

          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            Expert in marketing, development & AI solutions that grow your business online.
          </Text>

          <View style={styles.heroCtas}>
            <Pressable
              style={styles.ctaPrimary}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/(tabs)/contact');
              }}
            >
              <LinearGradient
                colors={[colors.accent, colors.cyan]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaPrimaryText}>Get in Touch</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </LinearGradient>
            </Pressable>

            <Pressable
              style={[styles.ctaSecondary, { borderColor: colors.border }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(tabs)/services');
              }}
            >
              <Text style={[styles.ctaSecondaryText, { color: colors.textSecondary }]}>
                View Services
              </Text>
            </Pressable>
          </View>
        </LinearGradient>

        <View style={[styles.statsRow, { backgroundColor: colors.surface }]}>
          {STATS.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} colors={colors} />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Services</Text>
            <Pressable onPress={() => router.push('/(tabs)/services')}>
              <Text style={[styles.sectionLink, { color: colors.accent }]}>See all</Text>
            </Pressable>
          </View>

          {SERVICES.map((service) => (
            <ServiceChip
              key={service.id}
              service={service}
              colors={colors}
              onPress={() =>
                router.push({
                  pathname: '/service/[category]',
                  params: { category: service.id },
                })
              }
            />
          ))}
        </View>

        <Pressable
          style={[styles.contactBanner, { borderColor: colors.border }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/(tabs)/contact');
          }}
        >
          <LinearGradient
            colors={colors.isDark ? ['#1a2550', '#0D1535'] : ['#DCEAFF', '#EAF0FF']}
            style={styles.contactBannerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.contactBannerLeft}>
              <Text style={[styles.contactBannerTitle, { color: colors.text }]}>
                Ready to start?
              </Text>
              <Text style={[styles.contactBannerSub, { color: colors.textSecondary }]}>
                Send me your project details
              </Text>
            </View>
            <View
              style={[
                styles.contactBannerIcon,
                { backgroundColor: colors.accentGlow, borderColor: colors.accent + '40' },
              ]}
            >
              <Ionicons name="mail" size={22} color={colors.accent} />
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  floatingHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  floatingTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    textAlign: 'center',
  },
  topActions: {
    position: 'absolute',
    right: 16,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adminButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: { gap: 0 },
  heroBg: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  heroBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  heroBadgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  heroName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    lineHeight: 38,
  },
  heroTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    lineHeight: 38,
    marginBottom: 14,
  },
  heroSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 28,
    maxWidth: width * 0.8,
  },
  heroCtas: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  ctaPrimary: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  ctaPrimaryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#fff',
  },
  ctaSecondary: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
  },
  ctaSecondaryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
  },
  sectionLink: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
  },
  serviceChipIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceChipTitle: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  contactBanner: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  contactBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  contactBannerLeft: { gap: 4 },
  contactBannerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
  },
  contactBannerSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  contactBannerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
