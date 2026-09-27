import React from 'react';
import { db } from '@/lib/db';
import { admins } from '@/lib/db/schema';
import { ensureDatabaseSeeded } from '@/lib/db/seed';
import { SecurityForm } from './SecurityForm';
import { Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminSecurityPage() {
  ensureDatabaseSeeded();

  const admin = db.select().from(admins).limit(1).get();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E7EE] dark:border-[#232326]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Pengaturan Akun</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000] dark:text-[#FFFFFF] tracking-tight">
            Keamanan Akun Admin
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#A1A1AA] mt-1">
            Ganti username administrator atau ubah kata sandi akses panel CMS Anda secara berkala untuk menjaga keamanan data.
          </p>
        </div>
      </div>

      <SecurityForm currentUsername={admin?.username || 'admin'} />
    </div>
  );
}
