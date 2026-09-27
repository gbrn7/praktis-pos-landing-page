'use server';

import { db } from '@/lib/db';
import { faqs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { ensureDatabaseSeeded } from '@/lib/db/seed';

export async function saveFaq(data: {
  id: string;
  question: string;
  answer: string;
  isActive?: number;
}) {
  try {
    ensureDatabaseSeeded();

    const existing = db.select().from(faqs).where(eq(faqs.id, data.id)).get();

    if (existing) {
      db.update(faqs)
        .set({
          question: data.question,
          answer: data.answer,
          isActive: data.isActive ?? 1,
        })
        .where(eq(faqs.id, data.id))
        .run();
    } else {
      const all = db.select().from(faqs).all();
      db.insert(faqs)
        .values({
          id: data.id,
          question: data.question,
          answer: data.answer,
          displayOrder: all.length + 1,
          isActive: 1,
        })
        .run();
    }

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/faqs');

    return { success: true };
  } catch (error) {
    console.error('Failed to save FAQ:', error);
    return { success: false, error: 'Gagal menyimpan FAQ' };
  }
}

export async function deleteFaq(id: string) {
  try {
    ensureDatabaseSeeded();
    db.delete(faqs).where(eq(faqs.id, id)).run();

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/faqs');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete FAQ:', error);
    return { success: false, error: 'Gagal menghapus FAQ' };
  }
}
