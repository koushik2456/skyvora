import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle } from 'lucide-react-native';
import { MotiView } from '@/components/ui/Motion';
import CoverImage from '@/components/ui/CoverImage';
import { BotanicalGradient, Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { SERVICES } from '@/constants/services';
import { Images } from '@/constants/images';
import { useTranslation } from '@/hooks/useTranslation';
import { useBookingStore } from '@/store/bookingStore';

interface Props {
  serviceId: string | null;
  onSelect: (id: string) => void;
}

export default function ServiceStep({ serviceId, onSelect }: Props) {
  const { t, tService, tServiceDesc } = useTranslation();
  const booking = useBookingStore();
  const acres = booking.areaInAcres ?? 0;
  const selected = SERVICES.find((s) => s.id === serviceId);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{t('serviceStepTitle')}</Text>
      <Text style={styles.subtitle}>{t('serviceStepSub')}</Text>

      {SERVICES.map((service) => {
        const isSelected = serviceId === service.id;
        const Icon = service.Icon;
        return (
          <MotiView
            key={service.id}
            animate={{
              scale: isSelected ? 1.02 : 1,
              borderColor: isSelected ? Colors.primary : Colors.border,
            }}
            transition={{ type: 'spring', damping: 15 }}
            style={[styles.card, isSelected && styles.cardActive]}
          >
            <Pressable onPress={() => onSelect(service.id)} style={styles.bg}>
              <CoverImage uri={service.image} fallbackUri={Images.hero_farm_aerial} />
              <LinearGradient
                colors={[...BotanicalGradient.card]}
                style={StyleSheet.absoluteFillObject}
              />
                {isSelected && (
                  <MotiView
                    from={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    style={styles.checkBadge}
                  >
                    <CheckCircle size={22} color={Colors.textOnDark} fill={Colors.primary} />
                  </MotiView>
                )}
                <View style={styles.info}>
                  <View style={styles.iconRow}>
                    <Icon size={18} color={Colors.accent} />
                    <Text style={styles.priceTag}>
                      ₹{service.ratePerAcre.toLocaleString('en-IN')}/acre
                    </Text>
                  </View>
                  <Text style={styles.name}>{tService(service.id, service.name)}</Text>
                  <Text style={styles.desc}>{tServiceDesc(service.id, service.description)}</Text>
                </View>
            </Pressable>
          </MotiView>
        );
      })}

      {selected && acres > 0 ? (
        <View style={styles.sticky}>
          <View>
            <Text style={styles.stickyName}>{tService(selected.id, selected.name)}</Text>
            <Text style={styles.stickyCost}>
              {acres} acres × ₹{selected.ratePerAcre.toLocaleString('en-IN')} = ₹
              {(acres * selected.ratePerAcre).toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.md },
  title: {
    fontFamily: Typography.heading,
    fontSize: Typography.sizes.xl,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: -Spacing.sm,
  },
  card: {
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardActive: { borderColor: Colors.primary, borderWidth: 3 },
  bg: { minHeight: 140, justifyContent: 'flex-end', overflow: 'hidden', borderRadius: Radius.md },
  checkBadge: { position: 'absolute', top: Spacing.md, right: Spacing.md, zIndex: 2 },
  info: { padding: Spacing.lg, gap: 4 },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  priceTag: {
    fontFamily: Typography.mono,
    fontSize: Typography.sizes.sm,
    color: Colors.accent,
  },
  name: {
    fontFamily: Typography.heading,
    fontSize: Typography.sizes.lg,
    color: Colors.textOnDark,
  },
  desc: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.sm,
    color: Colors.textOnDarkMuted,
  },
  sticky: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  stickyName: {
    fontFamily: Typography.heading,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  stickyCost: {
    fontFamily: Typography.mono,
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
