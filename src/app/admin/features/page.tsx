import React from 'react';
import { db } from '@/lib/db';
import { features } from '@/lib/db/schema';
import { ensureDatabaseSeeded } from '@/lib/db/seed';
import { FeaturesManager } from './FeaturesManager';
import { Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminFeaturesPage() {
  ensureDatabaseSeeded();

  const allFeatures = db.select().from(features).orderBy(features.displayOrder).all();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E7EE] dark:border-[#232326]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fitur Kasir</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000] dark:text-[#FFFFFF] tracking-tight">
            Fitur Software Unggulan
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#A1A1AA] mt-1">
            Kelola kartu fitur software kasir, tagline, deskripsi mendalam, serta poin-poin manfaat bagi pemilik toko.
          </p>
        </div>
      </div>

      <FeaturesManager initialFeatures={allFeatures} />
    </div>
  );
}
