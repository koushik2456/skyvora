import type { NextFunction, Request, Response } from 'express';
import { auth } from '../lib/firebase';

export interface AuthedRequest extends Request {
  uid?: string;
  phone?: string;
}

export async function authMiddleware(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: 'Missing Authorization bearer token' });
    return;
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    req.uid = decoded.uid;
    req.phone = decoded.phone_number;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
