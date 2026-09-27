'use server';

import { db } from '@/lib/db';
import { admins } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentAdmin, verifyPassword, hashPassword } from '@/lib/auth';
import { ensureDatabaseSeeded } from '@/lib/db/seed';

export async function updateAdminCredentials(data: {
  currentPassword: string;
  newUsername?: string;
  newPassword?: string;
}) {
  try {
    ensureDatabaseSeeded();

    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return { success: false, error: 'Sesi login tidak valid. Silakan login kembali.' };
    }

    const admin = db.select().from(admins).where(eq(admins.id, currentAdmin.id)).get();
    if (!admin) {
      return { success: false, error: 'Akun admin tidak ditemukan.' };
    }

    const isMatch = await verifyPassword(data.currentPassword, admin.passwordHash);
    if (!isMatch) {
      return { success: false, error: 'Password saat ini salah.' };
    }

    const updates: { username?: string; passwordHash?: string; updatedAt: number } = {
      updatedAt: Math.floor(Date.now() / 1000),
    };

    if (data.newUsername && data.newUsername.trim()) {
      updates.username = data.newUsername.trim();
    }

    if (data.newPassword && data.newPassword.trim()) {
      if (data.newPassword.length < 6) {
        return { success: false, error: 'Password baru minimal harus 6 karakter.' };
      }
      updates.passwordHash = await hashPassword(data.newPassword);
    }

    db.update(admins).set(updates).where(eq(admins.id, admin.id)).run();

    return { success: true };
  } catch (error) {
    console.error('Failed to update credentials:', error);
    return { success: false, error: 'Gagal memperbarui kredensial akun' };
  }
}
