import React from 'react';
import { db } from '@/lib/db';
import { faqs } from '@/lib/db/schema';
import { ensureDatabaseSeeded } from '@/lib/db/seed';
import { FaqsManager } from './FaqsManager';
import { HelpCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminFaqsPage() {
  ensureDatabaseSeeded();

  const allFaqs = db.select().from(faqs).orderBy(faqs.displayOrder).all();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E7EE] dark:border-[#232326]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tanya Jawab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000] dark:text-[#FFFFFF] tracking-tight">
            Tanya Jawab Pelanggan (FAQ)
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#A1A1AA] mt-1">
            Kelola daftar pertanyaan dan jawaban seputar sistem kasir, skema harga tanpa langganan, garansi hardware, dan panduan penggunaan.
          </p>
        </div>
      </div>

      <FaqsManager initialFaqs={allFaqs} />
    </div>
  );
}
