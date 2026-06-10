import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, FileText, MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FadeUp from '@/components/ui/FadeUp';
import ServiceIcon from '@/components/ui/ServiceIcon';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/constants/theme';
import { getCropVisual, getReportDetail } from '@/constants/reports';
import { useBookingsRepo } from '@/store/bookingsRepo';
import { formatDate } from '@/utils/date';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ReportsScreen() {
  const navigation = useNavigation<Nav>();
  const bookings = useBookingsRepo((s) => s.bookings);
  const reports = bookings.filter((b) => b.status === 'COMPLETED' || b.reportUrl);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerWrap}>
        <Text style={styles.heading}>Reports</Text>
        <Text style={styles.headingSub}>Crop intelligence from your completed missions</Text>
      </View>
      <FlatList
        data={reports}
        keyExtractor={(b) => b.bookingId}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <FileText size={56} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No reports yet</Text>
            <Text style={styles.emptySub}>
              Your service reports will appear here after completion.
            </Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const visual = getCropVisual(item.cropType);
          const detail = getReportDetail(item.bookingId);
          return (
            <FadeUp delay={index * 80}>
              <Pressable
                onPress={() =>
                  navigation.navigate('ReportDetail', { bookingId: item.bookingId })
                }
              >
                <View style={[styles.card, Shadow.card]}>
                  {/* Crop visual header */}
                  <LinearGradient
                    colors={visual.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.thumb}
                  >
                    <ServiceIcon name={visual.icon} size={42} color="rgba(255,255,255,0.95)" />
                    <View style={styles.cropPill}>
                      <Text style={styles.cropPillText}>{item.cropType}</Text>
                    </View>
                  </LinearGradient>

                  <View style={styles.cardBody}>
                    <View style={styles.cardTopRow}>
                      <Text style={styles.service}>{item.serviceName}</Text>
                      <View style={styles.scoreChip}>
                        <Text style={styles.scoreText}>{detail.healthScore}</Text>
                        <Text style={styles.scoreLabel}>health</Text>
                      </View>
                    </View>
                    <View style={styles.metaRow}>
                      <MapPin size={13} color={Colors.textMuted} />
                      <Text style={styles.meta}>
                        {item.village}, {item.district} · {formatDate(item.preferredDate)}
                      </Text>
                    </View>
                    <View style={styles.footRow}>
                      <Text style={styles.footText}>
                        {item.areaInAcres} acres · {Math.round(detail.sprayCoverage * 100)}% covered
                      </Text>
                      <View style={styles.viewRow}>
                        <Text style={styles.viewText}>View Report</Text>
                        <ChevronRight size={16} color={Colors.primary} />
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            </FadeUp>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerWrap: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.sm, gap: 2 },
  heading: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizes['2xl'],
    color: Colors.textPrimary,
    letterSpacing: Typography.tracking.tight,
  },
  headingSub: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.sm, color: Colors.textMuted },
  list: { padding: Spacing.lg, gap: Spacing.base, paddingBottom: 120, flexGrow: 1 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  thumb: {
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cropPill: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
  },
  cropPillText: { fontFamily: Typography.fontBodySemi, fontSize: Typography.sizes.xs, color: Colors.white },
  cardBody: { padding: Spacing.base, gap: 6 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  service: {
    flex: 1,
    fontFamily: Typography.fontDisplaySemi,
    fontSize: Typography.sizes.md,
    color: Colors.textPrimary,
  },
  scoreChip: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
  },
  scoreText: { fontFamily: Typography.fontDisplay, fontSize: Typography.sizes.base, color: Colors.success },
  scoreLabel: { fontFamily: Typography.fontBody, fontSize: 10, color: Colors.success },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  footRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  footText: { fontFamily: Typography.fontBodyMedium, fontSize: Typography.sizes.xs, color: Colors.textSecondary },
  viewRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewText: { fontFamily: Typography.fontBodySemi, fontSize: Typography.sizes.sm, color: Colors.primary },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  emptyTitle: {
    fontFamily: Typography.fontDisplaySemi,
    fontSize: Typography.sizes.lg,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  emptySub: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
