import React from 'react';
import { db } from '@/lib/db';
import { hardwareItems, hardwareBonuses } from '@/lib/db/schema';
import { ensureDatabaseSeeded } from '@/lib/db/seed';
import { HardwareManager } from './HardwareManager';
import { Package, Sliders } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminHardwarePage() {
  ensureDatabaseSeeded();

  const items = db.select().from(hardwareItems).orderBy(hardwareItems.displayOrder).all();
  const bonuses = db.select().from(hardwareBonuses).orderBy(hardwareBonuses.displayOrder).all();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E7EE] dark:border-[#232326]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] text-xs font-bold mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Katalog Produk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000] dark:text-[#FFFFFF] tracking-tight">
            Paket Mesin Kasir & Starter Kit
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#A1A1AA] mt-1">
            Atur spesifikasi tiap perangkat dalam paket kasir, upload foto produk lokal, dan perbarui bonus starter kit toko.
          </p>
        </div>
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#E7E7EE] dark:border-[#232326] bg-[#FFFFFF] dark:bg-[#18181B] hover:bg-[#F8F9FA] dark:hover:bg-[#202024] text-[#000000] dark:text-[#FFFFFF] transition-colors shrink-0"
        >
          <Sliders className="w-3.5 h-3.5 text-[#E0511F]" />
          <span>Edit Teks What's In The Box</span>
        </Link>
      </div>

      <HardwareManager initialItems={items} initialBonuses={bonuses} />
    </div>
  );
}
