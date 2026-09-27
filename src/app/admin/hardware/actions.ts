'use server';

import { db } from '@/lib/db';
import { hardwareItems, hardwareBonuses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { ensureDatabaseSeeded } from '@/lib/db/seed';

export async function saveHardwareItem(data: {
  id: string;
  name: string;
  category: string;
  spec: string;
  description: string;
  iconName: string;
  imageUrl?: string | null;
  isActive?: number;
}) {
  try {
    ensureDatabaseSeeded();

    const existing = db.select().from(hardwareItems).where(eq(hardwareItems.id, data.id)).get();

    if (existing) {
      db.update(hardwareItems)
        .set({
          name: data.name,
          category: data.category,
          spec: data.spec,
          description: data.description,
          iconName: data.iconName,
          imageUrl: data.imageUrl ?? existing.imageUrl,
          isActive: data.isActive ?? existing.isActive,
        })
        .where(eq(hardwareItems.id, data.id))
        .run();
    } else {
      const all = db.select().from(hardwareItems).all();
      db.insert(hardwareItems)
        .values({
          id: data.id,
          name: data.name,
          category: data.category,
          spec: data.spec,
          description: data.description,
          iconName: data.iconName || 'Tablet',
          imageUrl: data.imageUrl || null,
          displayOrder: all.length + 1,
          isActive: 1,
        })
        .run();
    }

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/hardware');

    return { success: true };
  } catch (error) {
    console.error('Failed to save hardware item:', error);
    return { success: false, error: 'Gagal menyimpan data perangkat' };
  }
}

export async function deleteHardwareItem(id: string) {
  try {
    ensureDatabaseSeeded();
    db.delete(hardwareItems).where(eq(hardwareItems.id, id)).run();

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/hardware');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete hardware item:', error);
    return { success: false, error: 'Gagal menghapus perangkat' };
  }
}

export async function addHardwareBonus(text: string) {
  try {
    ensureDatabaseSeeded();
    if (!text.trim()) return { success: false, error: 'Teks bonus tidak boleh kosong' };

    const bonuses = db.select().from(hardwareBonuses).all();
    db.insert(hardwareBonuses)
      .values({
        text: text.trim(),
        displayOrder: bonuses.length + 1,
      })
      .run();

    revalidatePath('/');
    revalidatePath('/admin/hardware');

    return { success: true };
  } catch (error) {
    console.error('Failed to add bonus:', error);
    return { success: false, error: 'Gagal menambahkan bonus' };
  }
}

export async function deleteHardwareBonus(id: number) {
  try {
    ensureDatabaseSeeded();
    db.delete(hardwareBonuses).where(eq(hardwareBonuses.id, id)).run();

    revalidatePath('/');
    revalidatePath('/admin/hardware');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete bonus:', error);
    return { success: false, error: 'Gagal menghapus bonus' };
  }
}
