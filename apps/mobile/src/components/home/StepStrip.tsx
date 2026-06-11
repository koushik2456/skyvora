import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

interface Props {
  onPress?: () => void;
}

export default function StepStrip({ onPress }: Props) {
  const { t } = useTranslation();

  const steps = [
    { num: '1', title: t('step1Title'), sub: t('step1Sub') },
    { num: '2', title: t('step2Title'), sub: t('step2Sub') },
    { num: '3', title: t('step3Title'), sub: t('step3Sub') },
  ];

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>{t('bookStepsHeading')}</Text>
      <View style={styles.row}>
        {steps.map((s, i) => (
          <View key={s.num} style={styles.step}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{s.num}</Text>
            </View>
            <Text style={styles.title}>{s.title}</Text>
            <Text style={styles.sub}>{s.sub}</Text>
            {i < steps.length - 1 ? <View style={styles.connector} /> : null}
          </View>
        ))}
      </View>
      {onPress ? (
        <Text style={styles.link} onPress={onPress}>
          {t('startBooking')}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.sectionBg,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heading: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizes.lg,
    color: Colors.textPrimary,
    letterSpacing: Typography.tracking.tight,
  },
  row: { flexDirection: 'row', gap: Spacing.sm },
  step: { flex: 1, alignItems: 'center', position: 'relative' },
  badge: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  badgeText: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.sizes.base,
    color: Colors.white,
  },
  title: {
    fontFamily: Typography.fontBodySemi,
    fontSize: Typography.sizes.xs,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  sub: {
    fontFamily: Typography.fontBody,
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  connector: {
    position: 'absolute',
    top: 18,
    right: -Spacing.sm,
    width: Spacing.base,
    height: 2,
    backgroundColor: Colors.border,
  },
  link: {
    fontFamily: Typography.fontBodySemi,
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    textAlign: 'center',
  },
});
