import { Router } from 'express';
import { db, admin } from '../lib/firebase';
import type { AuthedRequest } from '../middleware/auth';

export const reportRoutes = Router();

// GET /api/reports
reportRoutes.get('/', async (req: AuthedRequest, res) => {
  const snap = await db
    .collection('bookings')
    .where('userId', '==', req.uid)
    .where('status', '==', 'COMPLETED')
    .orderBy('updatedAt', 'desc')
    .get();
  const reports = snap.docs
    .map((d) => d.data())
    .filter((b) => !!b.reportUrl)
    .map((b) => ({
      bookingId: b.bookingId,
      serviceName: b.serviceName,
      village: b.village,
      preferredDate: b.preferredDate,
      reportUrl: b.reportUrl,
    }));
  res.json({ reports });
});

// GET /api/reports/:bookingId
reportRoutes.get('/:bookingId', async (req: AuthedRequest, res) => {
  const doc = await db.collection('bookings').doc(req.params.bookingId).get();
  const data = doc.data();
  if (!doc.exists || data?.userId !== req.uid || !data?.reportUrl) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }

  const bucket = admin.storage().bucket();
  const filePath = data.reportUrl as string;
  const [url] = await bucket.file(filePath).getSignedUrl({
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });
  res.json({ url });
});
