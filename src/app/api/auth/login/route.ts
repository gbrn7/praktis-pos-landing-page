import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { admins } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, signSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { ensureDatabaseSeeded } from '@/lib/db/seed';

export async function POST(request: Request) {
  try {
    ensureDatabaseSeeded();

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password wajib diisi' },
        { status: 400 }
      );
    }

    const admin = db.select().from(admins).where(eq(admins.username, String(username).trim())).get();

    if (!admin) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(String(password), admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      );
    }

    const token = await signSessionToken({
      id: admin.id,
      username: admin.username,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      user: { username: admin.username },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat login' },
      { status: 500 }
    );
  }
}
