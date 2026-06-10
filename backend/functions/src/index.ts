import express from 'express';
import cors from 'cors';
import { onRequest } from 'firebase-functions/v2/https';
import { authMiddleware } from './middleware/auth';
import { bookingRoutes } from './bookings';
import { paymentRoutes } from './payments';
import { reportRoutes } from './reports';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true, service: 'skyvora-api' }));

// All routes below require a valid Firebase ID token
app.use('/api', authMiddleware);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

export const api = onRequest(
  { region: 'us-central1', secrets: ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'] },
  app
);
