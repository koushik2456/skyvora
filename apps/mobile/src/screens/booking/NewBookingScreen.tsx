import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from '@/components/ui/Motion';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '@/components/common/Header';
import { useTranslation } from '@/hooks/useTranslation';
import StepProgress from '@/components/ui/StepProgress';
import AnimatedButton from '@/components/ui/AnimatedButton';
import LocationStep from '@/components/booking/LocationStep';
import CropAreaStep from '@/components/booking/CropAreaStep';
import ServiceStep from '@/components/booking/ServiceStep';
import DateStep from '@/components/booking/DateStep';
import ReviewStep from '@/components/booking/ReviewStep';
import { Colors, Shadow, Spacing, resolveShadow } from '@/constants/theme';
import { useBookingStore } from '@/store/bookingStore';
import { useLocationStore } from '@/store/locationStore';
import { useBookingsRepo } from '@/store/bookingsRepo';
import { useAuthStore } from '@/store/authStore';
import { isValidFarmerName } from '@/utils/validators';
import { toAcres, isAreaValid } from '@/utils/areaConverter';
import type { AreaUnit } from '@/types';
import type { BookingStackParamList } from '@/navigation/types';

const STEP_LABEL_KEYS = ['stepLocation', 'stepCrop', 'stepService', 'stepSchedule', 'stepReview'] as const;

type Nav = NativeStackNavigationProp<BookingStackParamList, 'NewBooking'>;
type Rt = RouteProp<BookingStackParamList, 'NewBooking'>;

export default function NewBookingScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const preset = route.params?.presetServiceId;

  const [step, setStep] = useState(0);
  const booking = useBookingStore();
  const location = useLocationStore();
  const createBooking = useBookingsRepo((s) => s.createBooking);
  const userId = useAuthStore((s) => s.user?.uid ?? 'demo');

  const [areaInput, setAreaInput] = useState(
    booking.areaValue ? String(booking.areaValue) : ''
  );

  useEffect(() => {
    if (preset) {
      booking.setService(preset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return (
          !!location.selectedState &&
          !!location.selectedDistrict &&
          !!location.selectedMandal &&
          !!location.selectedVillage &&
          isValidFarmerName(booking.farmerName)
        );
      case 1: {
        const n = parseFloat(areaInput) || 0;
        return !!booking.cropType && n > 0 && isAreaValid(toAcres(n, booking.areaUnit));
      }
      case 2:
        return !!booking.serviceId;
      case 3:
        return !!booking.preferredDate && !!booking.preferredSlot;
      default:
        return true;
    }
  };

  const persistStep = () => {
    if (step === 0) {
      booking.setLocation({
        state: location.selectedState!.name,
        district: location.selectedDistrict!.name,
        mandal: location.selectedMandal!.name,
        village: location.selectedVillage!.name,
        farmerName: booking.farmerName,
      });
    }
    if (step === 1) {
      booking.setCropArea(booking.cropType!, parseFloat(areaInput), booking.areaUnit);
    }
  };

  const onNext = () => {
    persistStep();
    if (step < 4) {
      setStep((s) => s + 1);
    } else {
      const created = createBooking({
        userId,
        state: booking.state!,
        district: booking.district!,
        mandal: booking.mandal!,
        village: booking.village!,
        farmerName: booking.farmerName,
        cropType: booking.cropType!,
        areaValue: booking.areaValue!,
        areaUnit: booking.areaUnit,
        areaInAcres: booking.areaInAcres!,
        serviceId: booking.serviceId!,
        preferredDate: booking.preferredDate!,
        preferredSlot: booking.preferredSlot!,
        specialInstructions: booking.specialInstructions,
      });
      navigation.navigate('Payment', { bookingId: created.bookingId });
    }
  };

  const onBack = () => {
    if (step === 0) {
      Alert.alert(t('discardTitle'), t('discardBody'), [
        { text: t('keepEditing'), style: 'cancel' },
        {
          text: t('discard'),
          style: 'destructive',
          onPress: () => {
            booking.resetBooking();
            location.reset();
            navigation.getParent()?.goBack();
          },
        },
      ]);
    } else {
      setStep((s) => s - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={t('newBooking')} onBack={onBack} />
      <StepProgress
        current={step}
        total={5}
        labels={STEP_LABEL_KEYS.map((k) => t(k))}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
        keyboardVerticalOffset={20}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          nestedScrollEnabled={Platform.OS === 'android'}
        >
          <MotiView
            key={step}
            from={{ opacity: 0, translateX: 24 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 280 }}
          >
            {step === 0 && (
              <LocationStep
                farmerName={booking.farmerName}
                onFarmerName={booking.setFarmerName}
              />
            )}
            {step === 1 && (
              <CropAreaStep
                cropType={booking.cropType}
                areaValue={areaInput}
                areaUnit={booking.areaUnit}
                onCrop={(c) => booking.setCropArea(c, parseFloat(areaInput) || 0, booking.areaUnit)}
                onAreaValue={(v) => {
                  setAreaInput(v);
                  booking.setCropArea(booking.cropType ?? '', parseFloat(v) || 0, booking.areaUnit);
                }}
                onAreaUnit={(u: AreaUnit) =>
                  booking.setCropArea(booking.cropType ?? '', parseFloat(areaInput) || 0, u)
                }
              />
            )}
            {step === 2 && (
              <ServiceStep serviceId={booking.serviceId} onSelect={booking.setService} />
            )}
            {step === 3 && (
              <DateStep
                date={booking.preferredDate}
                slot={booking.preferredSlot}
                instructions={booking.specialInstructions}
                onDate={(d) => booking.setSchedule(d, booking.preferredSlot ?? 'morning')}
                onSlot={(s) => booking.setSchedule(booking.preferredDate ?? '', s)}
                onInstructions={(t) =>
                  booking.setSchedule(
                    booking.preferredDate ?? '',
                    booking.preferredSlot ?? 'morning',
                    t
                  )
                }
              />
            )}
            {step === 4 && <ReviewStep onEdit={(s) => setStep(s)} />}
          </MotiView>
        </ScrollView>

        <View style={styles.footer}>
          <AnimatedButton
            label={step === 4 ? t('confirmPay') : t('next')}
            disabled={!canProceed()}
            onPress={onNext}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xl, gap: Spacing.base },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...resolveShadow(Shadow.card),
  },
});
