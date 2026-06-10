import { Router } from 'express';
import { z } from 'zod';
import { db, admin } from '../lib/firebase';
import type { AuthedRequest } from '../middleware/auth';
import {
  calculateCost,
  generateBookingId,
  getService,
  toAcres,
} from '../constants/services';
import { createRazorpayOrder } from '../payments/razorpay';

export const bookingRoutes = Router();

const createSchema = z.object({
  state: z.string().min(1),
  district: z.string().min(1),
  mandal: z.string().min(1),
  village: z.string().min(1),
  farmerName: z.string().min(2).max(80),
  cropType: z.string().min(1),
  areaValue: z.number().positive(),
  areaUnit: z.enum(['acres', 'guntas', 'sqft', 'sqm', 'cents', 'hectares']),
  serviceId: z.string().min(1),
  preferredDate: z.string().min(1),
  preferredSlot: z.enum(['morning', 'afternoon', 'evening']),
  specialInstructions: z.string().max(300).optional(),
});

// POST /api/bookings
bookingRoutes.post('/', async (req: AuthedRequest, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
    return;
  }
  const data = parsed.data;
  const service = getService(data.serviceId);
  if (!service) {
    res.status(400).json({ error: 'Unknown service' });
    return;
  }

  const areaInAcres = toAcres(data.areaValue, data.areaUnit);
  if (areaInAcres < 0.25 || areaInAcres > 500) {
    res.status(400).json({ error: 'Area must be between 0.25 and 500 acres' });
    return;
  }

  const cost = calculateCost(data.serviceId, areaInAcres);
  const bookingId = generateBookingId();

  let razorpayOrderId: string | undefined;
  try {
    const order = await createRazorpayOrder(cost.total, bookingId);
    razorpayOrderId = order.id;
  } catch (err) {
    console.error('Razorpay order creation failed', err);
  }

  const now = admin.firestore.FieldValue.serverTimestamp();
  const booking = {
    bookingId,
    userId: req.uid,
    ...data,
    serviceName: service.name,
    ratePerAcre: service.ratePerAcre,
    areaInAcres,
    baseAmount: cost.base,
    gstAmount: cost.gst,
    totalAmount: cost.total,
    paymentStatus: 'pending',
    status: 'PENDING_PAYMENT',
    razorpayOrderId: razorpayOrderId ?? null,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection('bookings').doc(bookingId).set(booking);

  res.status(201).json({
    bookingId,
    totalAmount: cost.total,
    razorpayOrderId,
    currency: 'INR',
  });
});

// GET /api/bookings?status=...
bookingRoutes.get('/', async (req: AuthedRequest, res) => {
  const status = req.query.status as string | undefined;
  let query = db
    .collection('bookings')
    .where('userId', '==', req.uid)
    .orderBy('createdAt', 'desc');
  if (status && status !== 'ALL') {
    query = db
      .collection('bookings')
      .where('userId', '==', req.uid)
      .where('status', '==', status)
      .orderBy('createdAt', 'desc');
  }
  const snap = await query.limit(100).get();
  res.json({ bookings: snap.docs.map((d) => d.data()) });
});

// GET /api/bookings/:bookingId
bookingRoutes.get('/:bookingId', async (req: AuthedRequest, res) => {
  const doc = await db.collection('bookings').doc(req.params.bookingId).get();
  if (!doc.exists || doc.data()?.userId !== req.uid) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }
  res.json(doc.data());
});

// PATCH /api/bookings/:bookingId/cancel
bookingRoutes.patch('/:bookingId/cancel', async (req: AuthedRequest, res) => {
  const ref = db.collection('bookings').doc(req.params.bookingId);
  const doc = await ref.get();
  if (!doc.exists || doc.data()?.userId !== req.uid) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }
  if (!['PENDING_PAYMENT', 'PAYMENT_CONFIRMED'].includes(doc.data()?.status)) {
    res.status(409).json({ error: 'Booking cannot be cancelled at this stage' });
    return;
  }
  await ref.update({
    status: 'CANCELLED',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  res.json({ ok: true });
});
