import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  BatteryFull,
  Bell,
  ChevronRight,
  Gauge,
  Mail,
  MapPin,
  Package,
  Phone,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FadeUp from '@/components/ui/FadeUp';
import FadeScale from '@/components/ui/FadeScale';
import CountUp from '@/components/ui/CountUp';
import AnimatedButton from '@/components/ui/AnimatedButton';
import AnimatedCard from '@/components/ui/AnimatedCard';
import GlassCard from '@/components/ui/GlassCard';
import ServiceCard from '@/components/ui/ServiceCard';
import StatusBadge from '@/components/ui/StatusBadge';
import DroneLogo from '@/components/ui/DroneLogo';
import PulseRing from '@/components/ui/PulseRing';
import OffersCarousel from '@/components/home/OffersCarousel';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { SERVICES } from '@/constants/services';
import { COMPANY, DRONE_FLEET, UPDATES } from '@/constants/content';
import { useAuthStore } from '@/store/authStore';
import { useBookingsRepo } from '@/store/bookingsRepo';
import { formatINRShort } from '@/utils/pricing';
import { formatDate } from '@/utils/date';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const bookings = useBookingsRepo((s) => s.bookings);

  const active = bookings.find((b) =>
    ['PAYMENT_CONFIRMED', 'ASSIGNED', 'IN_PROGRESS'].includes(b.status)
  );
  const recent = bookings.slice(0, 3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const openBooking = (presetServiceId?: string) =>
    navigation.navigate('BookingFlow', {
      screen: 'NewBooking',
      params: { presetServiceId },
    });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== Dark hero shell ===== */}
        <View style={styles.darkShell}>
          <View style={[styles.orb, styles.orbBlue]} />
          <View style={[styles.orb, styles.orbOrange]} />

          <SafeAreaView edges={['top']}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.greeting}>{greeting},</Text>
                <Text style={styles.name}>{user?.name ?? 'Farmer'}</Text>
              </View>
              <Pressable style={styles.bell} hitSlop={8}>
                <Bell size={20} color={Colors.dark.textPrimary} />
                <View style={styles.bellBadge} />
              </Pressable>
            </View>
          </SafeAreaView>

          {/* Hero */}
          <View style={styles.hero}>
            <FadeUp>
              <Text style={styles.kicker}>PRECISION AGRI DRONES</Text>
              <Text style={styles.heroTitle}>
                Your farm,{'\n'}served from the sky
              </Text>
              <Text style={styles.heroSub}>{COMPANY.tagline}</Text>
            </FadeUp>

            <View style={styles.heroVisual}>
              <PulseRing size={170} color={Colors.primary}>
                <FadeScale delay={200}>
                  <View style={styles.heroDroneBadge}>
                    <DroneLogo size={84} color={Colors.white} accent={Colors.accent} />
                  </View>
                </FadeScale>
              </PulseRing>
            </View>

            <FadeUp delay={250}>
              <AnimatedButton label="Book a Service" onPress={() => openBooking()} />
            </FadeUp>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatCell
              value={COMPANY.stats.acresServiced / 1000}
              decimals={1}
              suffix="K"
              label="Acres Serviced"
              delay={150}
            />
            <StatCell
              value={COMPANY.stats.deliveries / 1000}
              decimals={1}
              suffix="K"
              label="Missions Flown"
              delay={250}
            />
            <StatCell
              value={COMPANY.stats.farmers / 1000}
              decimals={1}
              suffix="K"
              label="Happy Farmers"
              delay={350}
            />
          </View>

          {/* Active booking */}
          {active ? (
            <FadeUp delay={200} style={styles.activeWrap}>
              <Pressable
                onPress={() =>
                  navigation.navigate('BookingDetail', { bookingId: active.bookingId })
                }
              >
                <LinearGradient
                  colors={[Colors.primaryDark, Colors.primaryLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.activeBanner}
                >
                  <View style={styles.activeTop}>
                    <Text style={styles.activeLabel}>ACTIVE BOOKING</Text>
                    <StatusBadge status={active.status} size="sm" />
                  </View>
                  <Text style={styles.activeService}>{active.serviceName}</Text>
                  <Text style={styles.activeMeta}>
                    {active.village}, {active.district} · {formatDate(active.preferredDate)}
                  </Text>
                  <View style={styles.trackRow}>
                    <Text style={styles.trackText}>Track Booking</Text>
                    <ChevronRight size={18} color={Colors.white} />
                  </View>
                </LinearGradient>
              </Pressable>
            </FadeUp>
          ) : null}

          {/* Drone fleet */}
          <View style={styles.fleetHead}>
            <Text style={styles.darkSectionTitle}>Our Drones</Text>
            <Text style={styles.darkSectionSub}>The fleet working your fields</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.fleetScroll}
          >
            {DRONE_FLEET.map((d, i) => (
              <FadeUp key={d.id} delay={150 + i * 100}>
                <GlassCard style={styles.fleetCard}>
                  <View style={[styles.fleetIcon, { backgroundColor: `${d.accent}26` }]}>
                    <DroneLogo size={44} color={d.accent} accent={Colors.accent} />
                  </View>
                  <Text style={styles.fleetName}>{d.name}</Text>
                  <Text style={styles.fleetRole}>{d.role}</Text>
                  <View style={styles.fleetSpecs}>
                    <SpecRow icon={<Package size={13} color={Colors.dark.textSecondary} />} text={d.payload} />
                    <SpecRow icon={<Gauge size={13} color={Colors.dark.textSecondary} />} text={d.coverage} />
                    <SpecRow icon={<BatteryFull size={13} color={Colors.dark.textSecondary} />} text={d.battery} />
                  </View>
                </GlassCard>
              </FadeUp>
            ))}
          </ScrollView>
        </View>

        {/* ===== Light content sheet ===== */}
        <View style={styles.lightSheet}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Our Services</Text>
            <Text style={styles.sectionSub}>Book a drone in minutes</Text>
          </View>
          <View style={styles.grid}>
            {SERVICES.map((s, i) => (
              <View key={s.id} style={styles.gridItem}>
                <FadeScale delay={100 + i * 50} from={0.92}>
                  <ServiceCard service={s} onPress={() => openBooking(s.id)} />
                </FadeScale>
              </View>
            ))}
          </View>

          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Offers for You</Text>
          </View>
          <OffersCarousel />

          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Updates from Skyvora</Text>
          </View>
          <View style={styles.updatesWrap}>
            {UPDATES.map((u, i) => (
              <FadeUp key={u.id} delay={100 + i * 80}>
                <AnimatedCard>
                  <View style={styles.updateTop}>
                    <View style={styles.updateTag}>
                      <Text style={styles.updateTagText}>{u.tag}</Text>
                    </View>
                    <Text style={styles.updateDate}>{u.date}</Text>
                  </View>
                  <Text style={styles.updateTitle}>{u.title}</Text>
                  <Text style={styles.updateBody}>{u.body}</Text>
                </AnimatedCard>
              </FadeUp>
            ))}
          </View>

          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
            <Pressable onPress={() => navigation.navigate('App', { screen: 'Bookings' })}>
              <Text style={styles.viewAll}>View All</Text>
            </Pressable>
          </View>
          {recent.length === 0 ? (
            <AnimatedCard>
              <Text style={styles.emptyText}>
                No bookings yet. Tap the drone to book your first service.
              </Text>
            </AnimatedCard>
          ) : (
            <View style={styles.recentList}>
              {recent.map((b) => (
                <Pressable
                  key={b.bookingId}
                  onPress={() => navigation.navigate('BookingDetail', { bookingId: b.bookingId })}
                >
                  <View style={styles.recentRow}>
                    <View style={styles.recentLeft}>
                      <Text style={styles.recentService}>{b.serviceName}</Text>
                      <Text style={styles.recentMeta}>
                        {b.bookingId} · {b.village}
                      </Text>
                    </View>
                    <View style={styles.recentRight}>
                      <Text style={styles.recentAmount}>{formatINRShort(b.totalAmount)}</Text>
                      <StatusBadge status={b.status} size="sm" />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* ===== Dark footer ===== */}
        <View style={styles.footer}>
          <View style={styles.footerBrandRow}>
            <DroneLogo size={36} color={Colors.white} accent={Colors.accent} />
            <Text style={styles.footerBrand}>SKYVORA</Text>
          </View>
          <Text style={styles.footerAbout}>{COMPANY.about}</Text>
          <View style={styles.footerDivider} />
          <FooterRow icon={<Phone size={15} color={Colors.dark.textSecondary} />} text={COMPANY.phone} />
          <FooterRow icon={<Mail size={15} color={Colors.dark.textSecondary} />} text={COMPANY.email} />
          <FooterRow icon={<MapPin size={15} color={Colors.dark.textSecondary} />} text={COMPANY.address} />
          <Text style={styles.footerLegal}>
            © 2026 {COMPANY.name} · All rights reserved
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCell({
  value,
  label,
  delay,
  decimals,
  suffix,
}: {
  value: number;
  label: string;
  delay: number;
  decimals?: number;
  suffix?: string;
}) {
  return (
    <FadeUp delay={delay} style={styles.statCellWrap}>
      <GlassCard style={styles.statCell}>
        <View style={styles.statValueRow}>
          <CountUp value={value} decimals={decimals} suffix={suffix} style={styles.statValue} />
          <Text style={styles.statPlus}>+</Text>
        </View>
        <Text style={styles.statLabel}>{label}</Text>
      </GlassCard>
    </FadeUp>
  );
}

function SpecRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={styles.specRow}>
      {icon}
      <Text style={styles.specText}>{text}</Text>
    </View>
  );
}

function FooterRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={styles.footerRow}>
      {icon}
      <Text style={styles.footerRowText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 110 },

  // Dark shell
  darkShell: { backgroundColor: Colors.dark.background, overflow: 'hidden', paddingBottom: Spacing.xl },
  orb: { position: 'absolute', borderRadius: 999 },
  orbBlue: { width: 300, height: 300, top: -80, right: -100, backgroundColor: Colors.primary, opacity: 0.18 },
  orbOrange: { width: 220, height: 220, top: 380, left: -100, backgroundColor: Colors.accent, opacity: 0.1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  greeting: {
    fontFamily: Typography.fontBody,
    color: Colors.dark.textSecondary,
    fontSize: Typography.sizes.sm,
  },
  name: {
    fontFamily: Typography.fontDisplay,
    color: Colors.dark.textPrimary,
    fontSize: Typography.sizes.lg,
    letterSpacing: Typography.tracking.tight,
  },
  bell: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    backgroundColor: Colors.dark.glass,
    borderWidth: 1,
    borderColor: Colors.dark.border,
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
    backgroundColor: Colors.accent,
    borderWidth: 1.5,
    borderColor: Colors.dark.background,
  },

  // Hero
  hero: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, gap: Spacing.lg },
  kicker: {
    fontFamily: Typography.fontBodySemi,
    fontSize: Typography.sizes.xs,
    color: Colors.primaryLight,
    letterSpacing: Typography.tracking.wide,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    fontFamily: Typography.fontHero,
    fontSize: Typography.sizes.hero,
    lineHeight: 48,
    color: Colors.dark.textPrimary,
    letterSpacing: Typography.tracking.tight,
  },
  heroSub: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.base,
    color: Colors.dark.textSecondary,
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  heroVisual: { alignItems: 'center', marginVertical: -Spacing.sm },
  heroDroneBadge: {
    width: 128,
    height: 128,
    borderRadius: Radius['2xl'],
    backgroundColor: Colors.dark.glassStrong,
    borderWidth: 1,
    borderColor: Colors.dark.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.glow,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  statCellWrap: { flex: 1 },
  statCell: { alignItems: 'center', paddingVertical: Spacing.base, paddingHorizontal: Spacing.xs, gap: 2 },
  statValueRow: { flexDirection: 'row', alignItems: 'flex-start' },
  statValue: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizes.lg,
    color: Colors.dark.textPrimary,
  },
  statPlus: { fontFamily: Typography.fontDisplay, fontSize: Typography.sizes.sm, color: Colors.accent },
  statLabel: {
    fontFamily: Typography.fontBody,
    fontSize: 10,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },

  // Active booking
  activeWrap: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg },
  activeBanner: { borderRadius: Radius.xl, padding: Spacing.lg, gap: 4 },
  activeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeLabel: {
    fontFamily: Typography.fontBodySemi,
    color: 'rgba(255,255,255,0.8)',
    fontSize: Typography.sizes.xs,
    letterSpacing: 1,
  },
  activeService: { fontFamily: Typography.fontDisplay, color: Colors.white, fontSize: Typography.sizes.lg },
  activeMeta: { fontFamily: Typography.fontBody, color: 'rgba(255,255,255,0.85)', fontSize: Typography.sizes.sm },
  trackRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.sm },
  trackText: { fontFamily: Typography.fontBodySemi, color: Colors.white, fontSize: Typography.sizes.sm },

  // Fleet
  fleetHead: { paddingHorizontal: Spacing.lg, marginTop: Spacing['2xl'], gap: 2 },
  darkSectionTitle: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizes['2xl'],
    color: Colors.dark.textPrimary,
    letterSpacing: Typography.tracking.tight,
  },
  darkSectionSub: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.sm,
    color: Colors.dark.textSecondary,
  },
  fleetScroll: { paddingHorizontal: Spacing.lg, gap: Spacing.md, paddingTop: Spacing.base },
  fleetCard: { width: 200, gap: 4 },
  fleetIcon: {
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  fleetName: {
    fontFamily: Typography.fontDisplaySemi,
    fontSize: Typography.sizes.md,
    color: Colors.dark.textPrimary,
  },
  fleetRole: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.xs,
    color: Colors.dark.textSecondary,
  },
  fleetSpecs: { marginTop: Spacing.sm, gap: 6 },
  specRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  specText: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizes.xs,
    color: Colors.dark.textSecondary,
  },

  // Light sheet
  lightSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.base,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizes.xl,
    color: Colors.textPrimary,
    letterSpacing: Typography.tracking.tight,
  },
  sectionSub: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  viewAll: { fontFamily: Typography.fontBodySemi, color: Colors.primary, fontSize: Typography.sizes.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: Spacing.base },
  gridItem: { width: '48%' },
  updatesWrap: { gap: Spacing.md },
  updateTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  updateTag: {
    backgroundColor: 'rgba(37,99,235,0.08)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
  },
  updateTagText: {
    fontFamily: Typography.fontBodySemi,
    fontSize: 10,
    color: Colors.primary,
    letterSpacing: 0.6,
  },
  updateDate: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  updateTitle: {
    fontFamily: Typography.fontDisplaySemi,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  updateBody: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 19,
  },
  recentList: { gap: Spacing.sm },
  recentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
  },
  recentLeft: { flex: 1, gap: 2 },
  recentService: {
    fontFamily: Typography.fontBodySemi,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  recentMeta: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  recentRight: { alignItems: 'flex-end', gap: 4 },
  recentAmount: {
    fontFamily: Typography.fontDisplaySemi,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  emptyText: { fontFamily: Typography.fontBody, color: Colors.textSecondary, textAlign: 'center' },

  // Footer
  footer: {
    backgroundColor: Colors.dark.background,
    padding: Spacing.xl,
    paddingBottom: Spacing['2xl'],
    gap: Spacing.md,
  },
  footerBrandRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  footerBrand: {
    fontFamily: Typography.fontHero,
    fontSize: Typography.sizes.lg,
    color: Colors.dark.textPrimary,
    letterSpacing: 4,
  },
  footerAbout: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.sm,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
  },
  footerDivider: { height: 1, backgroundColor: Colors.dark.border, marginVertical: Spacing.sm },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  footerRowText: {
    fontFamily: Typography.fontBodyMedium,
    fontSize: Typography.sizes.sm,
    color: Colors.dark.textSecondary,
    flex: 1,
  },
  footerLegal: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.xs,
    color: Colors.dark.textMuted,
    marginTop: Spacing.base,
  },
});
