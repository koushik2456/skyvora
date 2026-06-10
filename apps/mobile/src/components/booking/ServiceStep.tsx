import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FadeScale from '@/components/ui/FadeScale';
import ServiceCard from '@/components/ui/ServiceCard';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { SERVICES } from '@/constants/services';

interface Props {
  serviceId: string | null;
  onSelect: (id: string) => void;
}

export default function ServiceStep({ serviceId, onSelect }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Select Service</Text>
      <Text style={styles.subtitle}>Choose the service you need for your field.</Text>
      {SERVICES.map((s, i) => (
        <FadeScale key={s.id} delay={i * 50} from={0.96}>
          <ServiceCard
            service={s}
            selected={serviceId === s.id}
            onPress={() => onSelect(s.id)}
            compact
          />
        </FadeScale>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.md },
  title: { fontFamily: Typography.fontDisplay, fontSize: Typography.sizes.xl, color: Colors.textPrimary },
  subtitle: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.sm, color: Colors.textSecondary, marginTop: -Spacing.sm },
});
