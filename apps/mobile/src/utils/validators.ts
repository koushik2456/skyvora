export const isValidPhone = (phone: string): boolean => /^[6-9]\d{9}$/.test(phone);

export const isValidOtp = (otp: string): boolean => /^\d{6}$/.test(otp);

export const isValidFarmerName = (name: string): boolean => {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 80 && /^[a-zA-Z .]+$/.test(trimmed);
};

export const generateBookingId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 6; i += 1) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SKY-${id}`;
};
