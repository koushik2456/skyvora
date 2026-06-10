const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const formatDate = (iso: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

export const formatDateLong = (iso: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_FULL[d.getMonth()]} ${d.getFullYear()}`;
};

export const toISODate = (d: Date): string => d.toISOString().split('T')[0];

export const today = (): string => toISODate(new Date());

export const maxBookingDate = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return toISODate(d);
};

export const isSunday = (iso: string): boolean => new Date(iso).getDay() === 0;
