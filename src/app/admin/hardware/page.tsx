import React from 'react';
import { db } from '@/lib/db';
import { hardwareItems, hardwareBonuses } from '@/lib/db/schema';
import { ensureDatabaseSeeded } from '@/lib/db/seed';
import { HardwareManager } from './HardwareManager';
import { Package } from 'lucide-react';

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
      </div>

      <HardwareManager initialItems={items} initialBonuses={bonuses} />
    </div>
  );
}
