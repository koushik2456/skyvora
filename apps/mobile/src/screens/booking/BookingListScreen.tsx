import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from '@/components/ui/Motion';
import { ClipboardList, MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CoverImage from '@/components/ui/CoverImage';
import StatusBadge from '@/components/ui/StatusBadge';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { useTranslation } from '@/hooks/useTranslation';
import type { TranslationKey } from '@/i18n/strings';
import { Images } from '@/constants/images';
import { Colors, Radius, resolveShadow, Shadow, Spacing, Typography } from '@/constants/theme';
import { SERVICE_IMAGES } from '@/constants/services';
import { useBookingsRepo } from '@/store/bookingsRepo';
import { formatDate } from '@/utils/date';
import { formatBookingId } from '@/utils/validators';
import type { BookingStatus } from '@/types';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FILTER_KEYS: { labelKey: TranslationKey; value: BookingStatus | 'ALL' }[] = [
  { labelKey: 'filterAll', value: 'ALL' },
  { labelKey: 'filterPending', value: 'PENDING_PAYMENT' },
  { labelKey: 'filterConfirmed', value: 'PAYMENT_CONFIRMED' },
  { labelKey: 'filterInProgress', value: 'IN_PROGRESS' },
  { labelKey: 'filterCompleted', value: 'COMPLETED' },
  { labelKey: 'filterCancelled', value: 'CANCELLED' },
];

export default function BookingListScreen() {
  const navigation = useNavigation<Nav>();
  const { t, tService } = useTranslation();
  const bookings = useBookingsRepo((s) => s.bookings);
  const [filter, setFilter] = useState<BookingStatus | 'ALL'>('ALL');

  const filtered = useMemo(
    () => (filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter)),
    [bookings, filter]
  );

  const ListHeader = useCallback(
    () => (
      <View style={styles.headerBlock}>
        <Text style={styles.heading}>{t('myBookings')}</Text>
        <Text style={styles.headingSub}>{t('bookingsSub')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <View style={styles.filters}>
            {FILTER_KEYS.map((f) => {
              const active = filter === f.value;
              return (
                <Pressable key={f.value} onPress={() => setFilter(f.value)}>
                  <MotiView
                    animate={{
                      backgroundColor: active ? Colors.jade : Colors.bgEmerald,
                      borderColor: active ? Colors.sage : Colors.border,
                    }}
                    style={styles.filterChip}
                  >
                    <Text style={[styles.filterText, active && styles.filterTextActive]}>
                      {t(f.labelKey)}
                    </Text>
                  </MotiView>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    ),
    [filter, t]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filtered}
        keyExtractor={(b) => b.bookingId}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ClipboardList size={56} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>{t('noBookingsTitle')}</Text>
            <Text style={styles.emptySub}>{t('noBookingsSub')}</Text>
            <AnimatedButton
              label={t('bookService')}
              style={{ marginTop: Spacing.base }}
              onPress={() => navigation.navigate('BookingFlow', { screen: 'NewBooking' })}
            />
          </View>
        }
        renderItem={({ item, index }) => {
          const thumb = SERVICE_IMAGES[item.serviceId] ?? Images.hero_farm_aerial;
          return (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 60 }}
            >
              <Pressable
                style={styles.card}
                onPress={() => navigation.navigate('BookingDetail', { bookingId: item.bookingId })}
              >
                <View style={styles.thumbWrap}>
                  <CoverImage uri={thumb} fallbackUri={Images.hero_farm_aerial} />
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.cardTop}>
                    <Text style={styles.bookingId}>{formatBookingId(item.bookingId)}</Text>
                    <StatusBadge status={item.status} size="sm" />
                  </View>
                  <Text style={styles.cardService}>
                    {tService(item.serviceId, item.serviceName)}
                  </Text>
                  <View style={styles.meta}>
                    <MapPin size={12} color={Colors.sage} />
                    <Text style={styles.metaText}>
                      {item.village}, {item.district}
                    </Text>
                  </View>
                  <View style={styles.footer}>
                    <Text style={styles.date}>{formatDate(item.preferredDate)}</Text>
                    <Text style={styles.amount}>
                      ₹{item.totalAmount.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </MotiView>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgDeep },
  headerBlock: { gap: Spacing.sm, marginBottom: Spacing.base },
  heading: {
    fontFamily: Typography.heading,
    fontSize: Typography.sizes['2xl'],
    color: Colors.mint,
  },
  headingSub: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.sm,
    color: Colors.sage,
  },
  filtersScroll: { marginTop: Spacing.sm },
  filters: { flexDirection: 'row', gap: Spacing.sm, paddingRight: Spacing.lg },
  filterChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
  },
  filterText: {
    fontFamily: Typography.bodyMed,
    fontSize: Typography.sizes.sm,
    color: Colors.sage,
  },
  filterTextActive: { color: Colors.mint, fontFamily: Typography.bodyMed },
  list: { padding: Spacing.lg, gap: Spacing.base, paddingBottom: 120 },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.bgEmerald,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    minHeight: 120,
    ...resolveShadow(Shadow.md),
  },
  thumbWrap: { width: 100, minHeight: 120, backgroundColor: Colors.bgForest },
  cardBody: { flex: 1, padding: Spacing.base, gap: 4 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookingId: {
    fontFamily: Typography.mono,
    fontSize: Typography.sizes.xs,
    color: Colors.textSubtle,
  },
  cardService: {
    fontFamily: Typography.heading,
    fontSize: Typography.sizes.base,
    color: Colors.mint,
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.sm,
    color: Colors.textSubtle,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  date: { fontFamily: Typography.body, fontSize: Typography.sizes.sm, color: Colors.sage },
  amount: {
    fontFamily: Typography.mono,
    fontSize: Typography.sizes.md,
    color: Colors.mint,
  },
  empty: { alignItems: 'center', paddingTop: Spacing['3xl'], gap: Spacing.sm },
  emptyTitle: {
    fontFamily: Typography.heading,
    fontSize: Typography.sizes.lg,
    color: Colors.mint,
    marginTop: Spacing.md,
  },
  emptySub: { fontFamily: Typography.body, fontSize: Typography.sizes.sm, color: Colors.sage },
});
