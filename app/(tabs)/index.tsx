import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { SERVICES } from '@/constants/services';

const { width } = Dimensions.get('window');

const STATS = [
  { label: 'Projects', value: '50+' },
  { label: 'Clients', value: '30+' },
  { label: 'Years Exp', value: '3+' },
  { label: 'Services', value: '7' },
];

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ServiceChip({ service, onPress }: { service: typeof SERVICES[0]; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSequence(withSpring(0.93), withSpring(1));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View style={animStyle}>
      <Pressable onPress={handlePress} style={[styles.serviceChip, { backgroundColor: service.bgColor }]}>
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
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => ({
    opacity: withTiming(scrollY.value > 50 ? 1 : 0, { duration: 200 }),
  }));

  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 : 0;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.floatingHeader, { top: topPadding }, headerStyle]}>
        <Text style={styles.floatingTitle}>Sameer Digital</Text>
      </Animated.View>

      <Pressable
        style={[styles.adminButton, { top: topPadding + 12 }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/admin');
        }}
      >
        <Ionicons name="settings-outline" size={20} color={Colors.textMuted} />
      </Pressable>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPadding + 20, paddingBottom: bottomPadding + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#0D1535', Colors.bg]}
          style={styles.heroBg}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroBadge}>
            <View style={styles.heroBadgeDot} />
            <Text style={styles.heroBadgeText}>Available for projects</Text>
          </View>

          <Text style={styles.heroName}>Muhammad Sameer</Text>
          <Text style={styles.heroTitle}>Digital Services</Text>

          <Text style={styles.heroSubtitle}>
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
                colors={[Colors.accent, Colors.cyan]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaPrimaryText}>Get in Touch</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </LinearGradient>
            </Pressable>

            <Pressable
              style={styles.ctaSecondary}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(tabs)/services');
              }}
            >
              <Text style={styles.ctaSecondaryText}>View Services</Text>
            </Pressable>
          </View>
        </LinearGradient>

        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Services</Text>
            <Pressable onPress={() => router.push('/(tabs)/services')}>
              <Text style={styles.sectionLink}>See all</Text>
            </Pressable>
          </View>

          {SERVICES.map((service) => (
            <ServiceChip
              key={service.id}
              service={service}
              onPress={() => router.push({ pathname: '/service/[category]', params: { category: service.id } })}
            />
          ))}
        </View>

        <Pressable
          style={styles.contactBanner}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/(tabs)/contact');
          }}
        >
          <LinearGradient
            colors={['#1a2550', '#0D1535']}
            style={styles.contactBannerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.contactBannerLeft}>
              <Text style={styles.contactBannerTitle}>Ready to start?</Text>
              <Text style={styles.contactBannerSub}>Send me your project details</Text>
            </View>
            <View style={styles.contactBannerIcon}>
              <Ionicons name="mail" size={22} color={Colors.accent} />
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  floatingHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.bg + 'EE',
  },
  floatingTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
  },
  adminButton: {
    position: 'absolute',
    right: 16,
    zIndex: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    gap: 0,
  },
  heroBg: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    marginBottom: 0,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(79, 142, 255, 0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(79, 142, 255, 0.25)',
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
    color: Colors.accentLight,
  },
  heroName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: Colors.text,
    lineHeight: 38,
  },
  heroTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: Colors.accent,
    lineHeight: 38,
    marginBottom: 14,
  },
  heroSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textSecondary,
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
    borderColor: Colors.border,
  },
  ctaSecondaryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 20,
    backgroundColor: Colors.surface,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.surface2,
    borderRadius: 12,
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.text,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
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
    color: Colors.text,
  },
  sectionLink: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.accent,
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
    borderColor: Colors.border,
  },
  contactBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  contactBannerLeft: {
    gap: 4,
  },
  contactBannerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    color: Colors.text,
  },
  contactBannerSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  contactBannerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.accentGlow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
});
