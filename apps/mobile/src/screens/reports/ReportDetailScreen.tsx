import React, { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Download, Layers, MapPin, ScanLine, Sprout } from 'lucide-react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '@/components/common/Header';
import FadeUp from '@/components/ui/FadeUp';
import AnimatedButton from '@/components/ui/AnimatedButton';
import ServiceIcon from '@/components/ui/ServiceIcon';
import { Colors, Radius, Shadow, Spacing, Typography, resolveShadow } from '@/constants/theme';
import { getCropVisual } from '@/constants/reports';
import { getLocalizedReportDetail, tRecType, tSoilLevel } from '@/i18n/reportContent';
import { useTranslation } from '@/hooks/useTranslation';
import { useBookingsRepo } from '@/store/bookingsRepo';
import { formatDate } from '@/utils/date';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ReportDetail'>;
type Rt = RouteProp<RootStackParamList, 'ReportDetail'>;

const LEVEL_COLOR = {
  low: Colors.warning,
  optimal: Colors.success,
  high: Colors.info,
} as const;

export default function ReportDetailScreen() {
  const { t, tService, tCrop } = useTranslation();
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const booking = useBookingsRepo((s) => s.getById(params.bookingId));

  const detail = useMemo(
    () => (booking ? getLocalizedReportDetail(t, booking.bookingId) : null),
    [booking, t]
  );

  if (!booking || !detail) return null;

  const visual = getCropVisual(booking.cropType);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={t('cropReport')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <FadeUp>
          <LinearGradient
            colors={visual.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <ServiceIcon name={visual.icon} size={52} color="rgba(255,255,255,0.95)" />
            <Text style={styles.heroService}>
              {tService(booking.serviceId, booking.serviceName)}
            </Text>
            <View style={styles.heroMetaRow}>
              <MapPin size={13} color="rgba(255,255,255,0.9)" />
              <Text style={styles.heroMeta}>
                {booking.village}, {booking.district} · {formatDate(booking.preferredDate)}
              </Text>
            </View>
            <View style={styles.heroChips}>
              <HeroChip label={`${booking.areaInAcres} ${t('acres')}`} />
              <HeroChip label={tCrop(booking.cropType)} />
              <HeroChip label={booking.bookingId} />
            </View>
          </LinearGradient>
        </FadeUp>

        <View style={styles.twinRow}>
          <FadeUp delay={100} style={styles.twinItem}>
            <View style={[styles.metricCard, resolveShadow(Shadow.card)]}>
              <Sprout size={18} color={Colors.success} />
              <Text style={styles.metricValue}>{detail.healthScore}/100</Text>
              <Text style={styles.metricLabel}>{t('cropHealthIndex')}</Text>
            </View>
          </FadeUp>
          <FadeUp delay={180} style={styles.twinItem}>
            <View style={[styles.metricCard, resolveShadow(Shadow.card)]}>
              <ScanLine size={18} color={Colors.primary} />
              <Text style={styles.metricValue}>{Math.round(detail.sprayCoverage * 100)}%</Text>
              <Text style={styles.metricLabel}>{t('areaCovered')}</Text>
            </View>
          </FadeUp>
        </View>

        <FadeUp delay={220}>
          <Text style={styles.sectionTitle}>{t('sprayCoverageMap')}</Text>
          <View style={[styles.coverageCard, resolveShadow(Shadow.card)]}>
            <View style={styles.fieldGrid}>
              {Array.from({ length: 24 }).map((_, i) => {
                const covered = i / 24 < detail.sprayCoverage;
                return (
                  <View
                    key={i}
                    style={[
                      styles.fieldCell,
                      { backgroundColor: covered ? `${visual.colors[0]}CC` : Colors.surfaceAlt },
                    ]}
                  />
                );
              })}
            </View>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: visual.colors[0] }]} />
                <Text style={styles.legendText}>{t('sprayed')}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.surfaceAlt }]} />
                <Text style={styles.legendText}>{t('skippedBuffer')}</Text>
              </View>
            </View>
          </View>
        </FadeUp>

        <FadeUp delay={260}>
          <Text style={styles.sectionTitle}>{t('soilAnalysis')}</Text>
          <View style={[styles.soilCard, resolveShadow(Shadow.card)]}>
            <View style={styles.soilNatureRow}>
              <Layers size={16} color={Colors.textSecondary} />
              <Text style={styles.soilNature}>{detail.soilNature}</Text>
            </View>
            <View style={styles.soilGrid}>
              {detail.soil.map((m) => (
                <View key={m.label} style={styles.soilCell}>
                  <Text style={styles.soilValue}>{m.value}</Text>
                  <Text style={styles.soilLabel}>{m.label}</Text>
                  <View
                    style={[styles.soilLevel, { backgroundColor: `${LEVEL_COLOR[m.level]}1A` }]}
                  >
                    <Text style={[styles.soilLevelText, { color: LEVEL_COLOR[m.level] }]}>
                      {tSoilLevel(t, m.level)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </FadeUp>

        <FadeUp delay={300}>
          <Text style={styles.sectionTitle}>{t('recommendations')}</Text>
          <View style={styles.recsWrap}>
            {detail.recommendations.map((r) => (
              <View key={r.name} style={[styles.recCard, resolveShadow(Shadow.card)]}>
                <View style={styles.recTop}>
                  <View
                    style={[
                      styles.recTag,
                      {
                        backgroundColor:
                          r.type === 'Fertilizer' ? 'rgba(34,197,94,0.1)' : 'rgba(249,115,22,0.1)',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.recTagText,
                        { color: r.type === 'Fertilizer' ? Colors.success : Colors.accent },
                      ]}
                    >
                      {tRecType(t, r.type)}
                    </Text>
                  </View>
                  <Text style={styles.recDosage}>{r.dosage}</Text>
                </View>
                <Text style={styles.recName}>{r.name}</Text>
                <Text style={styles.recNote}>{r.note}</Text>
              </View>
            ))}
          </View>
        </FadeUp>

        <FadeUp delay={340}>
          <Text style={styles.sectionTitle}>{t('fieldObservations')}</Text>
          <View style={[styles.obsCard, resolveShadow(Shadow.card)]}>
            {detail.observations.map((o, i) => (
              <View key={i} style={styles.obsRow}>
                <View style={styles.obsDot} />
                <Text style={styles.obsText}>{o}</Text>
              </View>
            ))}
          </View>
        </FadeUp>

        <FadeUp delay={380}>
          <AnimatedButton
            label={t('downloadPdfReport')}
            icon={<Download size={18} color={Colors.white} />}
            onPress={() => Alert.alert(t('downloadPdfReport'), t('downloadPdfMsg'))}
          />
        </FadeUp>
      </ScrollView>
    </SafeAreaView>
  );
}

function HeroChip({ label }: { label: string }) {
  return (
    <View style={styles.heroChip}>
      <Text style={styles.heroChipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing['3xl'], gap: Spacing.base },
  hero: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  heroService: { fontFamily: Typography.fontDisplay, fontSize: Typography.sizes.xl, color: Colors.white },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroMeta: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.92)' },
  heroChips: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  heroChip: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  heroChipText: { fontFamily: Typography.fontBodySemi, fontSize: Typography.sizes.xs, color: Colors.white },

  twinRow: { flexDirection: 'row', gap: Spacing.md },
  twinItem: { flex: 1 },
  metricCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: 4,
  },
  metricValue: { fontFamily: Typography.fontDisplay, fontSize: Typography.sizes.xl, color: Colors.textPrimary },
  metricLabel: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.xs, color: Colors.textMuted },

  sectionTitle: {
    fontFamily: Typography.fontDisplaySemi,
    fontSize: Typography.sizes.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  coverageCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  fieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  fieldCell: {
    width: '15.5%',
    aspectRatio: 1.4,
    borderRadius: 4,
  },
  legendRow: { flexDirection: 'row', gap: Spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 3 },
  legendText: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.xs, color: Colors.textSecondary },

  soilCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: Spacing.base,
  },
  soilNatureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  soilNature: { fontFamily: Typography.fontBodyMedium, fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  soilGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: Spacing.base },
  soilCell: { width: '33.3%', gap: 2, paddingRight: Spacing.sm },
  soilValue: { fontFamily: Typography.fontDisplaySemi, fontSize: Typography.sizes.base, color: Colors.textPrimary },
  soilLabel: { fontFamily: Typography.fontBody, fontSize: 10, color: Colors.textMuted },
  soilLevel: { alignSelf: 'flex-start', borderRadius: Radius.full, paddingHorizontal: 6, paddingVertical: 1, marginTop: 2 },
  soilLevelText: { fontFamily: Typography.fontBodySemi, fontSize: 9, letterSpacing: 0.5 },

  recsWrap: { gap: Spacing.md },
  recCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: 4,
  },
  recTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recTag: { borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: 3 },
  recTagText: { fontFamily: Typography.fontBodySemi, fontSize: 10, letterSpacing: 0.6 },
  recDosage: { fontFamily: Typography.fontDisplaySemi, fontSize: Typography.sizes.sm, color: Colors.primary },
  recName: { fontFamily: Typography.fontDisplaySemi, fontSize: Typography.sizes.base, color: Colors.textPrimary, marginTop: 4 },
  recNote: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.sm, color: Colors.textSecondary, lineHeight: 19 },

  obsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  obsRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  obsDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary, marginTop: 7 },
  obsText: { flex: 1, fontFamily: Typography.fontBody, fontSize: Typography.sizes.sm, color: Colors.textSecondary, lineHeight: 20 },
});
