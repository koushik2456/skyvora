import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star } from 'lucide-react-native';
import ServiceIcon from '@/components/ui/ServiceIcon';
import { useTranslation } from '@/hooks/useTranslation';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { Service } from '@/types';

const SERVICE_IMAGES: Record<string, string> = {
  spray_pesticide: 'https://images.unsplash.com/photo-1574943329822-7976e509864e?auto=format&fit=crop&w=800&q=80',
  spray_fertilizer: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
  crop_management: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
  land_survey: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3858?auto=format&fit=crop&w=800&q=80',
  water_management: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
  soil_testing: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  fertilizer_report: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80',
};

interface Props {
  service: Service;
  onPress: () => void;
}

export default function ImageLeadCard({ service, onPress }: Props) {
  const { t, tService } = useTranslation();
  const uri = SERVICE_IMAGES[service.id] ?? SERVICE_IMAGES.spray_fertilizer;

  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <ImageBackground source={{ uri }} style={styles.image} imageStyle={styles.imageRadius}>
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={styles.overlay}>
          <View style={styles.topRow}>
            <View style={[styles.iconWrap, { backgroundColor: `${service.color}33` }]}>
              <ServiceIcon name={service.icon} color={Colors.white} size={18} />
            </View>
            <View style={styles.pricePill}>
              <Text style={styles.priceText}>₹{service.ratePerAcre}{t('perAcre')}</Text>
            </View>
          </View>
          <Text style={styles.name}>{tService(service.id, service.name)}</Text>
          <View style={styles.ratingRow}>
            <Star size={12} color={Colors.accent} fill={Colors.accent} />
            <Text style={styles.rating}>4.9 · {service.estimatedDuration}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '48%', marginBottom: Spacing.base },
  image: { height: 168, justifyContent: 'flex-end' },
  imageRadius: { borderRadius: Radius.xl },
  overlay: {
    borderRadius: Radius.xl,
    padding: Spacing.md,
    minHeight: 168,
    justifyContent: 'flex-end',
    gap: 4,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'auto' },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pricePill: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  priceText: {
    fontFamily: Typography.fontBodySemi,
    fontSize: 10,
    color: Colors.primary,
  },
  name: {
    fontFamily: Typography.fontDisplaySemi,
    fontSize: Typography.sizes.base,
    color: Colors.white,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.xs,
    color: 'rgba(255,255,255,0.85)',
  },
});
