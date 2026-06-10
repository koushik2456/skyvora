import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MotiView } from '@/components/ui/Motion';
import { Check } from 'lucide-react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { TIME_SLOTS } from '@/constants/services';
import { today, maxBookingDate } from '@/utils/date';
import type { TimeSlot } from '@/types';

interface Props {
  date: string | null;
  slot: TimeSlot | null;
  instructions: string;
  onDate: (d: string) => void;
  onSlot: (s: TimeSlot) => void;
  onInstructions: (t: string) => void;
}

export default function DateStep({
  date,
  slot,
  instructions,
  onDate,
  onSlot,
  onInstructions,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Schedule</Text>

      <Text style={styles.section}>Preferred Date</Text>
      <View style={styles.calendarCard}>
        <Calendar
          minDate={today()}
          maxDate={maxBookingDate()}
          onDayPress={(d) => onDate(d.dateString)}
          markedDates={
            date
              ? { [date]: { selected: true, selectedColor: Colors.primary } }
              : {}
          }
          disableAllTouchEventsForDisabledDays
          theme={{
            todayTextColor: Colors.primaryLight,
            arrowColor: Colors.primary,
            textMonthFontFamily: Typography.fontDisplaySemi,
            textDayFontFamily: Typography.fontBody,
            textDayHeaderFontFamily: Typography.fontBodyMedium,
            selectedDayBackgroundColor: Colors.primary,
          }}
        />
      </View>
      <Text style={styles.note}>Bookable up to 30 days ahead · Sundays unavailable.</Text>

      <Text style={styles.section}>Time Slot</Text>
      {TIME_SLOTS.map((s) => {
        const active = slot === s.value;
        return (
          <Pressable key={s.value} onPress={() => onSlot(s.value)}>
            <MotiView
              animate={{ borderColor: active ? Colors.primary : Colors.border }}
              style={styles.slotRow}
            >
              <View>
                <Text style={[styles.slotLabel, active && styles.slotLabelActive]}>{s.label}</Text>
                <Text style={styles.slotSub}>{s.sub}</Text>
              </View>
              <View style={[styles.radio, active && styles.radioActive]}>
                {active ? <Check size={14} color={Colors.white} strokeWidth={3} /> : null}
              </View>
            </MotiView>
          </Pressable>
        );
      })}
      <Text style={styles.note}>Actual time will be confirmed by our team.</Text>

      <Text style={styles.section}>Special Instructions (optional)</Text>
      <TextInput
        value={instructions}
        onChangeText={(t) => onInstructions(t.slice(0, 300))}
        placeholder="Any notes for our team..."
        placeholderTextColor={Colors.textMuted}
        multiline
        style={styles.textArea}
      />
      <Text style={styles.counter}>{instructions.length}/300</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.sm },
  title: { fontFamily: Typography.fontDisplay, fontSize: Typography.sizes.xl, color: Colors.textPrimary },
  section: { fontFamily: Typography.fontBodySemi, fontSize: Typography.sizes.sm, color: Colors.textSecondary, marginTop: Spacing.base },
  calendarCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    paddingBottom: Spacing.sm,
  },
  note: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    minHeight: 56,
  },
  slotLabel: { fontFamily: Typography.fontBodySemi, fontSize: Typography.sizes.base, color: Colors.textPrimary },
  slotLabelActive: { color: Colors.primary },
  slotSub: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  textArea: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.base,
    minHeight: 90,
    textAlignVertical: 'top',
    fontFamily: Typography.fontBody,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  counter: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.xs, color: Colors.textMuted, textAlign: 'right' },
});
