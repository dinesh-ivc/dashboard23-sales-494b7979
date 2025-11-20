import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function setAuthCookie(token) {
  cookies().set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
    sameSite: 'strict',
  });
}

export function getAuthToken() {
  return cookies().get('auth-token')?.value;
}

export function clearAuthCookie() {
  cookies().delete('auth-token');
}