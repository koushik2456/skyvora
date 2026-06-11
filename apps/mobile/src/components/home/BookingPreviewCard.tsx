import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import CoverImage from '@/components/ui/CoverImage';
import StatusBadge from '@/components/ui/StatusBadge';
import { useTranslation } from '@/hooks/useTranslation';
import { Images } from '@/constants/images';
import { Colors, Radius, resolveShadow, Shadow, Spacing, Typography } from '@/constants/theme';
import { SERVICE_IMAGES } from '@/constants/services';
import { formatDate } from '@/utils/date';
import type { Booking } from '@/types';

interface Props {
  booking: Booking;
  onPress: () => void;
}

export default function BookingPreviewCard({ booking, onPress }: Props) {
  const { tService } = useTranslation();
  const thumb = SERVICE_IMAGES[booking.serviceId] ?? Images.hero_farm_aerial;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.thumbWrap}>
        <CoverImage uri={thumb} fallbackUri={Images.hero_farm_aerial} />
      </View>
      <View style={styles.body}>
        <StatusBadge status={booking.status} size="sm" />
        <Text style={styles.service} numberOfLines={1}>
          {tService(booking.serviceId, booking.serviceName)}
        </Text>
        <View style={styles.meta}>
          <MapPin size={12} color={Colors.sage} />
          <Text style={styles.location} numberOfLines={1}>
            {booking.village}, {booking.district}
          </Text>
        </View>
        <Text style={styles.date}>{formatDate(booking.preferredDate)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 260,
    flexDirection: 'row',
    backgroundColor: Colors.bgEmerald,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginRight: Spacing.md,
    minHeight: 110,
    ...resolveShadow(Shadow.md),
  },
  thumbWrap: { width: 80, minHeight: 110, backgroundColor: Colors.bgForest },
  body: { flex: 1, padding: Spacing.md, gap: 4 },
  service: {
    fontFamily: Typography.heading,
    fontSize: Typography.sizes.base,
    color: Colors.mint,
    marginTop: 2,
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  location: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.xs,
    color: Colors.textSubtle,
    flex: 1,
  },
  date: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.xs,
    color: Colors.sage,
    marginTop: 2,
  },
});
