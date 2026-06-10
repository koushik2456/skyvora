import { db, messaging, admin } from '../lib/firebase';

export type NotificationType =
  | 'booking_confirmed'
  | 'team_assigned'
  | 'in_progress'
  | 'completed'
  | 'report_ready'
  | 'cancelled';

interface BookingLike {
  bookingId: string;
  serviceName: string;
  village: string;
  preferredDate: string;
  preferredSlot: string;
  assignedAgent?: { name: string };
}

function getTemplate(
  type: NotificationType,
  b: BookingLike
): { title: string; body: string } {
  switch (type) {
    case 'booking_confirmed':
      return {
        title: 'Booking Confirmed! \u2705',
        body: `Your booking ${b.bookingId} for ${b.serviceName} has been confirmed.`,
      };
    case 'team_assigned':
      return {
        title: 'Team Assigned \uD83D\uDC68\u200D\uD83C\uDF3E',
        body: `${b.assignedAgent?.name ?? 'Our team'} will visit on ${b.preferredDate} in the ${b.preferredSlot} slot.`,
      };
    case 'in_progress':
      return {
        title: 'Service Started \uD83D\uDE81',
        body: `Your ${b.serviceName} is currently underway at ${b.village}.`,
      };
    case 'completed':
      return {
        title: 'Service Completed \u2705',
        body: `Your ${b.serviceName} is done! Report will be available shortly.`,
      };
    case 'report_ready':
      return {
        title: 'Your Report is Ready \uD83D\uDCC4',
        body: `Your service report for ${b.serviceName} is ready to download.`,
      };
    case 'cancelled':
      return {
        title: 'Booking Cancelled',
        body: `Booking ${b.bookingId} has been cancelled. Refund in 5-7 days.`,
      };
    default:
      return { title: 'Skyvora', body: 'You have a new update.' };
  }
}

export async function sendBookingNotification(
  userId: string,
  type: NotificationType,
  booking: BookingLike
): Promise<void> {
  const userDoc = await db.collection('users').doc(userId).get();
  const fcmToken = userDoc.data()?.fcmToken as string | undefined;
  const { title, body } = getTemplate(type, booking);

  if (fcmToken) {
    await messaging.send({
      token: fcmToken,
      notification: { title, body },
      data: { bookingId: booking.bookingId, type },
      android: { priority: 'high' },
      apns: { payload: { aps: { sound: 'default', badge: 1 } } },
    });
  }

  await db.collection('notifications').add({
    userId,
    title,
    body,
    type,
    bookingId: booking.bookingId,
    read: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}
