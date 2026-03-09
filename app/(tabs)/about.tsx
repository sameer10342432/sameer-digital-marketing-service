import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { SERVICES } from '@/constants/services';

const SKILLS = [
  { label: 'Digital Marketing', pct: 95, color: '#FF6B9D' },
  { label: 'Web Development', pct: 88, color: '#4F8EFF' },
  { label: 'SEO & Analytics', pct: 92, color: '#22C55E' },
  { label: 'Google & Facebook Ads', pct: 90, color: '#F59E0B' },
  { label: 'App Development', pct: 82, color: '#A855F7' },
  { label: 'AI Integration', pct: 85, color: '#00C9E0' },
];

function SkillBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <View style={styles.skillRow}>
      <View style={styles.skillLabelRow}>
        <Text style={styles.skillLabel}>{label}</Text>
        <Text style={[styles.skillPct, { color }]}>{pct}%</Text>
      </View>
      <View style={styles.skillTrack}>
        <View style={[styles.skillFill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 : 0;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#0D1535', Colors.bg]}
          style={[styles.profileSection, { paddingTop: topPadding + 24 }]}
        >
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[Colors.accent, Colors.cyan]}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarInitials}>MS</Text>
            </LinearGradient>
            <View style={styles.availableBadge}>
              <View style={styles.availableDot} />
            </View>
          </View>

          <Text style={styles.profileName}>Muhammad Sameer</Text>
          <Text style={styles.profileRole}>Digital Marketing & Development Expert</Text>

          <View style={styles.profileTagsRow}>
            {['Marketing', 'Development', 'AI'].map((tag) => (
              <View key={tag} style={styles.profileTag}>
                <Text style={styles.profileTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.bioSection}>
          <View style={styles.bioCard}>
            <Text style={styles.bioText}>
              I'm a passionate digital services expert with 3+ years of experience helping businesses grow online. From startups to established companies, I provide end-to-end digital solutions — from building powerful websites and apps to running high-converting marketing campaigns.
            </Text>
            <Text style={[styles.bioText, { marginTop: 12 }]}>
              My mission is simple: deliver real results that grow your business. Whether you need a stunning website, targeted ads, or cutting-edge AI automation, I've got you covered.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills & Expertise</Text>
          <View style={styles.skillsCard}>
            {SKILLS.map((skill) => (
              <SkillBar key={skill.label} label={skill.label} pct={skill.pct} color={skill.color} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What I Offer</Text>
          <View style={styles.servicesGrid}>
            {SERVICES.map((service) => (
              <View key={service.id} style={[styles.serviceTag, { backgroundColor: service.bgColor }]}>
                <Ionicons name={service.iconName as any} size={15} color={service.color} />
                <Text style={[styles.serviceTagText, { color: service.color }]}>{service.title}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactRow}>
              <View style={[styles.contactIcon, { backgroundColor: Colors.accentGlow }]}>
                <Ionicons name="mail-outline" size={18} color={Colors.accent} />
              </View>
              <View>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>sameer@example.com</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.contactRow}>
              <View style={[styles.contactIcon, { backgroundColor: 'rgba(34, 197, 94, 0.12)' }]}>
                <Ionicons name="call-outline" size={18} color="#22C55E" />
              </View>
              <View>
                <Text style={styles.contactLabel}>Phone / WhatsApp</Text>
                <Text style={styles.contactValue}>Available on request</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.contactRow}>
              <View style={[styles.contactIcon, { backgroundColor: 'rgba(168, 85, 247, 0.12)' }]}>
                <Ionicons name="location-outline" size={18} color="#A855F7" />
              </View>
              <View>
                <Text style={styles.contactLabel}>Location</Text>
                <Text style={styles.contactValue}>Pakistan</Text>
              </View>
            </View>
          </View>
        </View>

        <Pressable
          style={styles.ctaButton}
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
            <Text style={styles.ctaText}>Start a Project</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </LinearGradient>
        </Pressable>
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
    gap: 0,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarGradient: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: '#fff',
  },
  availableBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#22C55E',
    borderWidth: 3,
    borderColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  profileName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 4,
  },
  profileRole: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  profileTagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  profileTag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.accentGlow,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
  },
  profileTagText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.accentLight,
  },
  bioSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
  },
  bioCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bioText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 14,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.text,
  },
  skillsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 16,
  },
  skillRow: {
    gap: 6,
  },
  skillLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skillLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.text,
  },
  skillPct: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  skillTrack: {
    height: 6,
    backgroundColor: Colors.surface2,
    borderRadius: 3,
    overflow: 'hidden',
  },
  skillFill: {
    height: '100%',
    borderRadius: 3,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  serviceTagText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  contactCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
  },
  contactValue: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  ctaButton: {
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
