import React, { useMemo, useState } from 'react';
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
import { ClipboardList } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ServiceIcon from '@/components/ui/ServiceIcon';
import StatusBadge from '@/components/ui/StatusBadge';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { getServiceById } from '@/constants/services';
import { useBookingsRepo } from '@/store/bookingsRepo';
import { formatINRShort } from '@/utils/pricing';
import { formatDate } from '@/utils/date';
import type { BookingStatus } from '@/types';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FILTERS: { label: string; value: BookingStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING_PAYMENT' },
  { label: 'Confirmed', value: 'PAYMENT_CONFIRMED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function BookingListScreen() {
  const navigation = useNavigation<Nav>();
  const bookings = useBookingsRepo((s) => s.bookings);
  const [filter, setFilter] = useState<BookingStatus | 'ALL'>('ALL');

  const filtered = useMemo(
    () => (filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter)),
    [bookings, filter]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerWrap}>
        <Text style={styles.heading}>My Bookings</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        style={styles.filtersScroll}
      >
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <Pressable key={f.value} onPress={() => setFilter(f.value)}>
              <MotiView
                animate={{
                  backgroundColor: active ? Colors.primary : Colors.surface,
                  borderColor: active ? Colors.primary : Colors.border,
                }}
                style={styles.filterChip}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{f.label}</Text>
              </MotiView>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(b) => b.bookingId}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ClipboardList size={56} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptySub}>Book a drone service to get started.</Text>
            <AnimatedButton
              label="Book a Service"
              style={{ marginTop: Spacing.base }}
              onPress={() => navigation.navigate('BookingFlow', { screen: 'NewBooking' })}
            />
          </View>
        }
        renderItem={({ item, index }) => {
          const svc = getServiceById(item.serviceId);
          return (
            <MotiView
              from={{ opacity: 0, translateY: 16 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', delay: index * 60 }}
            >
              <Pressable
                style={styles.card}
                onPress={() => navigation.navigate('BookingDetail', { bookingId: item.bookingId })}
              >
                <View style={styles.cardTop}>
                  <View style={[styles.iconWrap, { backgroundColor: `${svc?.color}1A` }]}>
                    <ServiceIcon name={svc?.icon ?? 'leaf'} color={svc?.color} size={20} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardService}>{item.serviceName}</Text>
                    <Text style={styles.cardId}>{item.bookingId}</Text>
                  </View>
                  <StatusBadge status={item.status} size="sm" />
                </View>
                <View style={styles.cardMetaRow}>
                  <Text style={styles.cardMeta}>
                    {item.village}, {item.district}
                  </Text>
                  <Text style={styles.cardMeta}>{formatDate(item.preferredDate)}</Text>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardArea}>{item.areaInAcres} acres</Text>
                  <Text style={styles.cardAmount}>{formatINRShort(item.totalAmount)}</Text>
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
  container: { flex: 1, backgroundColor: Colors.background },
  headerWrap: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.sm },
  heading: { fontFamily: Typography.fontDisplay, fontSize: Typography.sizes['2xl'], color: Colors.textPrimary },
  filtersScroll: { maxHeight: 52, flexGrow: 0 },
  filters: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingVertical: 4 },
  filterChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
  },
  filterText: { fontFamily: Typography.fontBodyMedium, fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  filterTextActive: { color: Colors.white, fontFamily: Typography.fontBodySemi },
  list: { padding: Spacing.lg, gap: Spacing.base, paddingBottom: 120 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardService: { fontFamily: Typography.fontBodySemi, fontSize: Typography.sizes.base, color: Colors.textPrimary },
  cardId: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  cardMetaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardMeta: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  cardArea: { fontFamily: Typography.fontBodyMedium, fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  cardAmount: { fontFamily: Typography.fontDisplaySemi, fontSize: Typography.sizes.md, color: Colors.primary },
  empty: { alignItems: 'center', paddingTop: Spacing['3xl'], gap: Spacing.sm },
  emptyTitle: { fontFamily: Typography.fontDisplaySemi, fontSize: Typography.sizes.lg, color: Colors.textPrimary, marginTop: Spacing.md },
  emptySub: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.sm, color: Colors.textMuted },
});
