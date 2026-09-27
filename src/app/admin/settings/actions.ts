'use server';

import { db } from '@/lib/db';
import { siteSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { ensureDatabaseSeeded } from '@/lib/db/seed';

export async function updateSiteSettings(data: {
  heroPill: string;
  heroHeadline: string;
  heroSubtitle: string;
  waNumber: string;
  waTemplate: string;
  liveDemoUrl: string;
  demoBannerTitle: string;
  demoBannerDesc: string;
  ctaBannerTitle: string;
  ctaBannerDesc: string;
}) {
  try {
    ensureDatabaseSeeded();

    const current = db.select().from(siteSettings).limit(1).get();

    if (current) {
      db.update(siteSettings)
        .set({
          ...data,
          updatedAt: Math.floor(Date.now() / 1000),
        })
        .where(eq(siteSettings.id, current.id))
        .run();
    } else {
      db.insert(siteSettings)
        .values({
          ...data,
        })
        .run();
    }

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/settings');

    return { success: true };
  } catch (error) {
    console.error('Failed to update site settings:', error);
    return { success: false, error: 'Gagal memperbarui pengaturan website' };
  }
}
