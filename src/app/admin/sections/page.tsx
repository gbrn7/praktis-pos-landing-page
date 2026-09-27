import React from 'react';
import { db } from '@/lib/db';
import { sectionSettings } from '@/lib/db/schema';
import { ensureDatabaseSeeded } from '@/lib/db/seed';
import { SectionToggleList } from './SectionToggleList';
import { Eye, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminSectionsPage() {
  ensureDatabaseSeeded();

  const sections = db.select().from(sectionSettings).orderBy(sectionSettings.displayOrder).all();

  return (
    <div className="space-y-8">
      {/* Header Page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E7EE] dark:border-[#232326]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kontrol Tampilan Landing Page</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000] dark:text-[#FFFFFF] tracking-tight">
            Kelola Visibilitas Section
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#A1A1AA] mt-1">
            Gunakan tombol sakelar (Switch) untuk menyembunyikan (*hide*) atau memunculkan (*show*) section di landing page publik.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs text-[#525252] dark:text-[#A1A1AA]">
          <Eye className="w-4 h-4 text-[#E0511F]" />
          <span>Sinkronisasi Instan (No Re-deploy)</span>
        </div>
      </div>

      {/* Interactive Switch List */}
      <SectionToggleList initialSections={sections} />
    </div>
  );
}
