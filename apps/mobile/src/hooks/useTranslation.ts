import { useCallback, useMemo } from 'react';
import {
  AREA_UNIT_KEYS,
  CROP_KEY_MAP,
  PAYMENT_STATUS_KEYS,
  SLOT_KEYS,
  TIMELINE_STATUS_KEYS,
} from '@/i18n/contentMaps';
import { STRINGS, type TranslationKey } from '@/i18n/strings';
import { LANGUAGES, type AppLanguage } from '@/i18n/types';
import { useLanguageStore } from '@/store/languageStore';
import type { AreaUnit, BookingStatus, TimeSlot } from '@/types';

type Params = Record<string, string | number>;

function interpolate(template: string, params?: Params): string {
  if (!params) return template;
  return Object.entries(params).reduce(
    (text, [key, value]) => text.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    template
  );
}

const STATUS_KEYS: Record<BookingStatus, TranslationKey> = {
  DRAFT: 'statusDraft',
  PENDING_PAYMENT: 'statusPending',
  PAYMENT_FAILED: 'statusPaymentFailed',
  PAYMENT_CONFIRMED: 'statusConfirmed',
  ASSIGNED: 'statusOnTheWay',
  IN_PROGRESS: 'statusInProgress',
  COMPLETED: 'statusFulfilled',
  CANCELLED: 'statusCancelled',
};

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);

  const t = useCallback(
    (key: TranslationKey, params?: Params) => {
      const bundle = STRINGS[language] ?? STRINGS.en;
      return interpolate(bundle[key] ?? STRINGS.en[key], params);
    },
    [language]
  );

  const languageLabel =
    LANGUAGES.find((l) => l.code === language)?.nativeLabel ?? 'English';

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 17) return t('goodAfternoon');
    return t('goodEvening');
  }, [t]);

  const tStatus = useCallback(
    (status: BookingStatus) => t(STATUS_KEYS[status] ?? 'statusDraft'),
    [t]
  );

  const tService = useCallback(
    (serviceId: string, fallback?: string) => {
      const key = `service_${serviceId}` as TranslationKey;
      const bundle = STRINGS[language] ?? STRINGS.en;
      return bundle[key] ?? fallback ?? STRINGS.en[key] ?? serviceId;
    },
    [language]
  );

  const tServiceDesc = useCallback(
    (serviceId: string, fallback?: string) => {
      const key = `service_${serviceId}_desc` as TranslationKey;
      const bundle = STRINGS[language] ?? STRINGS.en;
      return bundle[key] ?? fallback ?? STRINGS.en[key] ?? '';
    },
    [language]
  );

  const tCrop = useCallback(
    (crop: string) => {
      const key = CROP_KEY_MAP[crop];
      return key ? t(key) : crop;
    },
    [t]
  );

  const tAreaUnit = useCallback(
    (unit: AreaUnit) => t(AREA_UNIT_KEYS[unit]),
    [t]
  );

  const tTimeSlot = useCallback(
    (slot: TimeSlot) => {
      const keys = SLOT_KEYS[slot];
      return { label: t(keys.label), sub: t(keys.sub) };
    },
    [t]
  );

  const tTimeline = useCallback(
    (status: BookingStatus) => {
      const key = TIMELINE_STATUS_KEYS[status];
      return key ? t(key) : '';
    },
    [t]
  );

  const tPaymentStatus = useCallback(
    (status: string) => {
      const key = PAYMENT_STATUS_KEYS[status.toLowerCase()];
      return key ? t(key) : status.toUpperCase();
    },
    [t]
  );

  return {
    t,
    language,
    languageLabel,
    greeting,
    tStatus,
    tService,
    tServiceDesc,
    tCrop,
    tAreaUnit,
    tTimeSlot,
    tTimeline,
    tPaymentStatus,
  };
}

export function getLanguageLabel(code: AppLanguage): string {
  return LANGUAGES.find((l) => l.code === code)?.nativeLabel ?? 'English';
}
