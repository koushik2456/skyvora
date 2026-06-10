import { Router } from 'express';
import { z } from 'zod';
import { db, admin } from '../lib/firebase';
import type { AuthedRequest } from '../middleware/auth';
import { createRazorpayOrder, verifySignature } from './razorpay';
import { sendBookingNotification } from '../notifications/sendPush';

export const paymentRoutes = Router();

// POST /api/payments/create-order
paymentRoutes.post('/create-order', async (req: AuthedRequest, res) => {
  const schema = z.object({ bookingId: z.string(), amount: z.number().positive() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }
  try {
    const order = await createRazorpayOrder(parsed.data.amount, parsed.data.bookingId);
    res.json({ razorpayOrderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Failed to create payment order' });
  }
});

// POST /api/payments/verify
paymentRoutes.post('/verify', async (req: AuthedRequest, res) => {
  const schema = z.object({
    bookingId: z.string(),
    razorpayOrderId: z.string(),
    razorpayPaymentId: z.string(),
    razorpaySignature: z.string(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }
  const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = parsed.data;

  const valid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  if (!valid) {
    await db.collection('bookings').doc(bookingId).update({
      paymentStatus: 'failed',
      status: 'PAYMENT_FAILED',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(400).json({ error: 'Signature verification failed' });
    return;
  }

  const ref = db.collection('bookings').doc(bookingId);
  await ref.update({
    paymentStatus: 'paid',
    status: 'PAYMENT_CONFIRMED',
    razorpayPaymentId,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const booking = (await ref.get()).data();
  if (booking) {
    await sendBookingNotification(booking.userId, 'booking_confirmed', booking as any);
  }

  res.json({ ok: true, status: 'PAYMENT_CONFIRMED' });
});
