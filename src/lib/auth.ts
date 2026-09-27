import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from './db';
import { admins } from './db/schema';
import { eq } from 'drizzle-orm';
import { ensureDatabaseSeeded } from './db/seed';

export const SESSION_COOKIE_NAME = 'cms_session';

const getSecretKey = () => {
  const secret = process.env.AUTH_SECRET || 'praktis-pos-cms-secret-key-2026-secure-jwt';
  return new TextEncoder().encode(secret);
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signSessionToken(payload: { id: number; username: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<{ id: number; username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.id === 'number' && typeof payload.username === 'string') {
      return { id: payload.id, username: payload.username };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<{ id: number; username: string } | null> {
  try {
    ensureDatabaseSeeded();
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload) return null;

    const admin = db.select().from(admins).where(eq(admins.id, payload.id)).get();
    if (!admin) return null;

    return { id: admin.id, username: admin.username };
  } catch {
    return null;
  }
}
