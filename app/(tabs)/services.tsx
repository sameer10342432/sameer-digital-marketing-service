import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
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
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { SERVICES } from '@/constants/services';

function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSequence(withSpring(0.97), withSpring(1));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded((e) => !e);
  };

  const handleDetail = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: '/service/[category]', params: { category: service.id } });
  };

  return (
    <Animated.View style={[animStyle, styles.card]}>
      <Pressable onPress={handlePress}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconBg, { backgroundColor: service.bgColor }]}>
            <Ionicons name={service.iconName as any} size={24} color={service.color} />
          </View>
          <View style={styles.cardTitleArea}>
            <Text style={styles.cardTitle}>{service.title}</Text>
            <Text style={styles.cardDesc} numberOfLines={expanded ? undefined : 2}>
              {service.description}
            </Text>
          </View>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={Colors.textMuted}
          />
        </View>

        {expanded && (
          <View style={styles.expandedContent}>
            <View style={styles.divider} />
            {service.subItems.map((item) => (
              <View key={item} style={styles.subItem}>
                <View style={[styles.subItemDot, { backgroundColor: service.color }]} />
                <Text style={styles.subItemText}>{item}</Text>
              </View>
            ))}
            <Pressable
              style={[styles.detailBtn, { borderColor: service.color + '50' }]}
              onPress={handleDetail}
            >
              <Text style={[styles.detailBtnText, { color: service.color }]}>
                Request Service
              </Text>
              <Ionicons name="arrow-forward" size={14} color={service.color} />
            </Pressable>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPadding = Platform.OS === 'web' ? 34 : 0;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPadding + 16 }]}>
        <LinearGradient
          colors={[Colors.surface, Colors.bg]}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.headerTitle}>Services</Text>
        <Text style={styles.headerSubtitle}>Tap any service to explore</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {SERVICES.map((service, i) => (
          <ServiceCard key={service.id} service={service} index={i} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textMuted,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 10,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 14,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardTitleArea: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.text,
  },
  cardDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 4,
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subItemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  subItemText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  detailBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
});
