'use server';

import { db } from '@/lib/db';
import { sectionSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { safeRevalidatePath } from '@/lib/revalidate';
import { ensureDatabaseSeeded } from '@/lib/db/seed';

export async function toggleSectionVisibility(sectionKey: string, isVisible: boolean) {
  try {
    ensureDatabaseSeeded();

    const numericValue = isVisible ? 1 : 0;
    db.update(sectionSettings)
      .set({ isVisible: numericValue })
      .where(eq(sectionSettings.sectionKey, sectionKey))
      .run();

    safeRevalidatePath('/');
    safeRevalidatePath('/admin');
    safeRevalidatePath('/admin/sections');

    return { success: true, isVisible };
  } catch (error) {
    console.error('Failed to toggle section visibility:', error);
    return { success: false, error: 'Gagal memperbarui status visibilitas section' };
  }
}
