import Razorpay from 'razorpay';
import * as crypto from 'crypto';

const keyId = process.env.RAZORPAY_KEY_ID ?? '';
const keySecret = process.env.RAZORPAY_KEY_SECRET ?? '';

let client: Razorpay | null = null;
const getClient = (): Razorpay => {
  if (!client) {
    client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return client;
};

export async function createRazorpayOrder(amountInRupees: number, receipt: string) {
  return getClient().orders.create({
    amount: Math.round(amountInRupees * 100), // paise
    currency: 'INR',
    receipt,
  });
}

/** Verify the HMAC-SHA256 signature returned by Razorpay checkout. */
export function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
