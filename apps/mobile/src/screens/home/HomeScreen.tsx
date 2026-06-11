import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  ChevronDown,
  ClipboardList,
  CreditCard,
  MapPin,
  Sprout,
  Star,
  Wheat,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MotiView } from '@/components/ui/Motion';
import { GooeyText } from '@/components/ui/GooeyText';
import CountUp from '@/components/ui/CountUp';
import CoverImage from '@/components/ui/CoverImage';
import DroneLogo from '@/components/ui/DroneLogo';
import ServiceGridCard from '@/components/home/ServiceGridCard';
import BookingPreviewCard from '@/components/home/BookingPreviewCard';
import { Images } from '@/constants/images';
import { SERVICES } from '@/constants/services';
import { BotanicalGradient, Colors, Radius, Spacing, TextStyles, Typography } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/authStore';
import { useBookingsRepo } from '@/store/bookingsRepo';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const STAT_KEYS = [
  { Icon: Sprout, value: 1200, suffix: '+', labelKey: 'statAcres' as const },
  { Icon: ClipboardList, value: 850, suffix: '+', labelKey: 'statBookings' as const },
  { Icon: Star, value: 98, suffix: '%', labelKey: 'statSatisfaction' as const },
];

const STEP_KEYS = [
  { num: '01', icon: MapPin, titleKey: 'step1Title' as const, descKey: 'step1Sub' as const },
  { num: '02', icon: Wheat, titleKey: 'step2Title' as const, descKey: 'step2Sub' as const },
  { num: '03', icon: CreditCard, titleKey: 'step3Title' as const, descKey: 'step3Sub' as const },
];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { greeting, t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const bookings = useBookingsRepo((s) => s.bookings);
  const recent = bookings.slice(0, 5);

  const openBooking = (presetServiceId?: string) =>
    navigation.navigate('BookingFlow', {
      screen: 'NewBooking',
      params: { presetServiceId },
    });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero — full-bleed farm aerial + botanical gradient */}
        <View style={styles.hero}>
          <CoverImage uri={Images.hero_farm_aerial} fallbackUri={Images.hero_green_fields} />
          <LinearGradient
            colors={[...BotanicalGradient.hero]}
            style={StyleSheet.absoluteFillObject}
          />

          <SafeAreaView edges={['top']}>
            <View style={styles.topBar}>
              <View>
                <Text style={styles.greeting}>
                  {greeting}, {user?.name ?? t('farmer')}
                </Text>
                <Text style={styles.subGreeting}>{t('homeSubGreeting')}</Text>
              </View>
              <Pressable style={styles.bell} hitSlop={8}>
                <Bell size={20} color={Colors.mint} />
                <View style={styles.bellBadge} />
              </Pressable>
            </View>
          </SafeAreaView>

          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>
              {t('homeHeroLine1')}
              {'\n'}
              {t('homeHeroLine2')}
            </Text>
            <GooeyText
              texts={['Spray', 'Survey', 'Protect', 'Grow']}
              morphTime={1}
              cooldownTime={0.3}
              color={Colors.sage}
            />
          </View>

          <View style={styles.ctaRow}>
            <Pressable style={styles.primaryCTA} onPress={() => openBooking()}>
              <DroneLogo size={22} color={Colors.mint} accent={Colors.sage} />
              <Text style={styles.ctaText}>{t('bookService')}</Text>
            </Pressable>
            <Pressable
              style={styles.secondaryCTA}
              onPress={() => navigation.navigate('App', { screen: 'Bookings' })}
            >
              <Text style={styles.secondaryCtaText}>{t('myBookings')}</Text>
            </Pressable>
          </View>

          <MotiView
            from={{ translateY: 0, opacity: 1 }}
            animate={{ translateY: 8, opacity: 0.5 }}
            transition={{ loop: true, type: 'timing', duration: 800 }}
            style={styles.scrollHint}
          >
            <ChevronDown color={Colors.sage} size={24} />
          </MotiView>
        </View>

        {/* Stats */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsRow}
        >
          {STAT_KEYS.map((stat, index) => {
            const Icon = stat.Icon;
            return (
              <MotiView
                key={stat.labelKey}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: index * 100 }}
                style={styles.statCard}
              >
                <View style={styles.statIconWrap}>
                  <Icon size={22} color={Colors.sage} />
                </View>
                <CountUp
                  value={stat.value}
                  suffix={stat.suffix}
                  style={styles.statValue}
                  decimals={0}
                />
                <Text style={styles.statLabel}>{t(stat.labelKey)}</Text>
              </MotiView>
            );
          })}
        </ScrollView>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ourServices')}</Text>
          <Text style={styles.sectionSub}>{t('tapToBook')}</Text>
          <View style={styles.serviceGrid}>
            {SERVICES.map((s, i) => (
              <ServiceGridCard
                key={s.id}
                service={s}
                index={i}
                onPress={() => openBooking(s.id)}
              />
            ))}
          </View>
        </View>

        {/* Recent bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>{t('recentBookings')}</Text>
            <Pressable onPress={() => navigation.navigate('App', { screen: 'Bookings' })}>
              <Text style={styles.viewAll}>{t('viewAll')}</Text>
            </Pressable>
          </View>
          {recent.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>{t('noBookingsYet')}</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recent.map((b, i) => (
                <MotiView
                  key={b.bookingId}
                  from={{ opacity: 0, translateX: 30 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ delay: i * 60 }}
                >
                  <BookingPreviewCard
                    booking={b}
                    onPress={() =>
                      navigation.navigate('BookingDetail', { bookingId: b.bookingId })
                    }
                  />
                </MotiView>
              ))}
            </ScrollView>
          )}
        </View>

        {/* How it works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('bookStepsHeading')}</Text>
          <View style={styles.stepsWrap}>
            {STEP_KEYS.map((step, i) => {
              const Icon = step.icon;
              return (
                <View key={step.num} style={styles.stepCard}>
                  {i < STEP_KEYS.length - 1 ? <View style={styles.stepLine} /> : null}
                  <Text style={styles.stepNum}>{step.num}</Text>
                  <View style={styles.stepIconWrap}>
                    <Icon size={18} color={Colors.sage} />
                  </View>
                  <View style={styles.stepText}>
                    <Text style={styles.stepTitle}>{t(step.titleKey)}</Text>
                    <Text style={styles.stepDesc}>{t(step.descKey)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgDeep },
  scrollContent: { paddingBottom: 120 },

  hero: {
    minHeight: 520,
    justifyContent: 'flex-end',
    paddingBottom: Spacing['2xl'],
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  greeting: {
    fontFamily: Typography.bodyMed,
    fontSize: Typography.sizes.sm,
    color: Colors.sage,
  },
  subGreeting: {
    fontFamily: Typography.heading,
    fontSize: Typography.sizes.lg,
    color: Colors.mint,
    marginTop: 2,
  },
  bell: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(22, 56, 50, 0.65)',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadge: {
    position: 'absolute',
    top: 9,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.sage,
  },
  heroText: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing['2xl'],
    gap: Spacing.sm,
  },
  heroTitle: {
    ...TextStyles.heroTitle,
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: 1,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  primaryCTA: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.jade,
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(142, 182, 155, 0.25)',
  },
  ctaText: {
    fontFamily: Typography.heading,
    fontSize: Typography.sizes.base,
    color: Colors.mint,
  },
  secondaryCTA: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: 'rgba(142, 182, 155, 0.35)',
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(11, 43, 38, 0.5)',
  },
  secondaryCtaText: {
    fontFamily: Typography.bodyMed,
    fontSize: Typography.sizes.base,
    color: Colors.mint,
  },
  scrollHint: { alignSelf: 'center', marginTop: Spacing.lg },

  statsRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  statCard: {
    width: 140,
    backgroundColor: Colors.bgEmerald,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgForest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontFamily: Typography.mono,
    fontSize: Typography.sizes.xl,
    color: Colors.mint,
  },
  statLabel: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.xs,
    color: Colors.sage,
    textAlign: 'center',
  },

  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl, gap: Spacing.sm },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { ...TextStyles.sectionHead },
  sectionSub: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  viewAll: {
    fontFamily: Typography.bodyMed,
    fontSize: Typography.sizes.sm,
    color: Colors.sage,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  emptyCard: {
    backgroundColor: Colors.bgEmerald,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    fontFamily: Typography.body,
    color: Colors.sage,
  },

  stepsWrap: { gap: Spacing.md, marginTop: Spacing.sm },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bgEmerald,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  stepLine: {
    position: 'absolute',
    left: 28,
    bottom: -Spacing.md,
    width: 2,
    height: Spacing.md,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepNum: {
    fontFamily: Typography.mono,
    fontSize: 28,
    color: Colors.sage,
    width: 40,
  },
  stepIconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.bgForest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { flex: 1, gap: 2 },
  stepTitle: {
    fontFamily: Typography.heading,
    fontSize: Typography.sizes.base,
    color: Colors.mint,
  },
  stepDesc: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
});
