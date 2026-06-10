import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface Props {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
  subtitle?: string;
}

export default function Header({ title, onBack, right, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.back} hitSlop={10}>
          <ChevronLeft size={26} color={Colors.textPrimary} />
        </Pressable>
      ) : (
        <View style={styles.back} />
      )}
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  back: { width: 40, alignItems: 'flex-start' },
  center: { flex: 1, alignItems: 'center' },
  title: {
    fontFamily: Typography.fontDisplaySemi,
    fontSize: Typography.sizes.md,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  right: { width: 40, alignItems: 'flex-end' },
});
