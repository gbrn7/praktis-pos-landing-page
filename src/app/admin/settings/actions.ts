'use server';

import { db } from '@/lib/db';
import { siteSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { safeRevalidatePath } from '@/lib/revalidate';
import { ensureDatabaseSeeded } from '@/lib/db/seed';

export async function updateSiteSettings(data: {
  heroPill: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroMockupImage?: string | null;
  heroHighlights?: string[] | string | null;
  socialProofMetrics?: { number: string; label: string; desc: string }[] | string | null;
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

    const payload = {
      ...data,
      heroHighlights: Array.isArray(data.heroHighlights)
        ? JSON.stringify(data.heroHighlights)
        : typeof data.heroHighlights === 'string'
        ? data.heroHighlights
        : null,
      socialProofMetrics: Array.isArray(data.socialProofMetrics)
        ? JSON.stringify(data.socialProofMetrics)
        : typeof data.socialProofMetrics === 'string'
        ? data.socialProofMetrics
        : null,
      updatedAt: Math.floor(Date.now() / 1000),
    };

    if (current) {
      db.update(siteSettings)
        .set(payload)
        .where(eq(siteSettings.id, current.id))
        .run();
    } else {
      db.insert(siteSettings)
        .values(payload)
        .run();
    }

    safeRevalidatePath('/');
    safeRevalidatePath('/admin');
    safeRevalidatePath('/admin/settings');

    return { success: true };
  } catch (error) {
    console.error('Failed to update site settings:', error);
    return { success: false, error: 'Gagal memperbarui pengaturan website' };
  }
}
