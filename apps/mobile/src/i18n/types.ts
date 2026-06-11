export type AppLanguage = 'en' | 'te' | 'hi';

export const LANGUAGES: { code: AppLanguage; nativeLabel: string }[] = [
  { code: 'en', nativeLabel: 'English' },
  { code: 'te', nativeLabel: 'తెలుగు' },
  { code: 'hi', nativeLabel: 'हिन्दी' },
];

export const DEFAULT_LANGUAGE: AppLanguage = 'en';
