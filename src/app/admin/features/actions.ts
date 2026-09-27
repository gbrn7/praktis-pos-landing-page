'use server';

import { db } from '@/lib/db';
import { features } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { safeRevalidatePath } from '@/lib/revalidate';
import { ensureDatabaseSeeded } from '@/lib/db/seed';

export async function saveFeature(data: {
  id: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  badge?: string | null;
  benefits: string[];
  isActive?: number;
}) {
  try {
    ensureDatabaseSeeded();

    const existing = db.select().from(features).where(eq(features.id, data.id)).get();

    if (existing) {
      db.update(features)
        .set({
          title: data.title,
          tagline: data.tagline,
          description: data.description,
          iconName: data.iconName,
          badge: data.badge ?? null,
          benefits: JSON.stringify(data.benefits),
          isActive: data.isActive ?? 1,
        })
        .where(eq(features.id, data.id))
        .run();
    } else {
      const all = db.select().from(features).all();
      db.insert(features)
        .values({
          id: data.id,
          title: data.title,
          tagline: data.tagline,
          description: data.description,
          iconName: data.iconName || 'ShoppingCart',
          badge: data.badge ?? null,
          benefits: JSON.stringify(data.benefits),
          displayOrder: all.length + 1,
          isActive: 1,
        })
        .run();
    }

    safeRevalidatePath('/');
    safeRevalidatePath('/admin');
    safeRevalidatePath('/admin/features');

    return { success: true };
  } catch (error) {
    console.error('Failed to save feature:', error);
    return { success: false, error: 'Gagal menyimpan fitur' };
  }
}

export async function deleteFeature(id: string) {
  try {
    ensureDatabaseSeeded();
    db.delete(features).where(eq(features.id, id)).run();

    safeRevalidatePath('/');
    safeRevalidatePath('/admin');
    safeRevalidatePath('/admin/features');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete feature:', error);
    return { success: false, error: 'Gagal menghapus fitur' };
  }
}
