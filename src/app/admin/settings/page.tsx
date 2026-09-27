import React from 'react';
import { db } from '@/lib/db';
import { siteSettings } from '@/lib/db/schema';
import { ensureDatabaseSeeded } from '@/lib/db/seed';
import { DEFAULT_SOCIAL_PROOF_METRICS, SocialProofMetric, DEFAULT_TARGET_INDUSTRIES, DEFAULT_TARGET_INDUSTRIES_TITLE, TargetIndustryItem } from '@/types';
import { SettingsForm } from './SettingsForm';
import { Sliders } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  ensureDatabaseSeeded();

  const current = db.select().from(siteSettings).limit(1).get();

  let initialHighlights = ['Hak Milik Seumur Hidup', 'Garansi Hardware 1 Tahun', 'Gratis Setup & Training'];
  if (current?.heroHighlights) {
    try {
      const val = JSON.parse(current.heroHighlights);
      if (Array.isArray(val) && val.length > 0) {
        initialHighlights = val;
      }
    } catch {
      // fallback
    }
  }

  let initialSocialProofMetrics: SocialProofMetric[] = DEFAULT_SOCIAL_PROOF_METRICS;
  if (current?.socialProofMetrics) {
    try {
      const val = JSON.parse(current.socialProofMetrics);
      if (Array.isArray(val) && val.length > 0) {
        initialSocialProofMetrics = val;
      }
    } catch {
      // fallback
    }
  }

  let initialTargetIndustries: TargetIndustryItem[] = DEFAULT_TARGET_INDUSTRIES;
  if (current?.targetIndustries) {
    try {
      const val = JSON.parse(current.targetIndustries);
      if (Array.isArray(val) && val.length > 0) {
        initialTargetIndustries = val;
      }
    } catch {
      // fallback
    }
  }

  const settingsData = {
    heroPill: current?.heroPill || 'Mesin Kasir Praktis POS • Paket Siap Pakai',
    heroHeadline: current?.heroHeadline || 'Solusi Mesin Kasir Lengkap: Buka Dus, Colok, Langsung Siap Jualan.',
    heroSubtitle: current?.heroSubtitle || 'Bersama Praktis POS, kelola transaksi kasir secepat kilat, pantau stok akurat, dan otomatis pisahkan uang modal kulakan vs laba bersih toko Anda. 100% tanpa biaya langganan bulanan seumur hidup.',
    heroMockupImage: current?.heroMockupImage || '/mockup-dashboard.png',
    heroHighlights: initialHighlights,
    socialProofMetrics: initialSocialProofMetrics,
    targetIndustries: initialTargetIndustries,
    targetIndustriesTitle: current?.targetIndustriesTitle || DEFAULT_TARGET_INDUSTRIES_TITLE,
    hardwarePill: current?.hardwarePill || "What's In The Box",
    hardwareHeadline: current?.hardwareHeadline || '1 Paket Lengkap Mesin Kasir Praktis POS',
    hardwareSubtitle:
      current?.hardwareSubtitle ||
      'Semua perangkat yang Anda butuhkan untuk operasional toko sudah tersedia dalam satu paket. Buka dus, colok kabel, dan langsung siap transaksi.',
    waNumber: current?.waNumber || '6281234567890',
    waTemplate: current?.waTemplate || 'Halo tim Praktis POS, saya tertarik dengan Paket Komplit Mesin Kasir Siap Pakai. Mohon informasi ketersediaan paket dan cara pemesanannya. Terima kasih!',
    liveDemoUrl: current?.liveDemoUrl || 'http://localhost:8000',
    demoBannerTitle: current?.demoBannerTitle || 'Ingin Mencoba Langsung Praktis POS?',
    demoBannerDesc: current?.demoBannerDesc || 'Buka aplikasi demo langsung di browser Anda sekarang. Rasakan sendiri cepatnya transaksi, kemudahan scan barcode, dan kejelasan laporan kas modal vs profit sebelum memesan paket hardware.',
    ctaBannerTitle: current?.ctaBannerTitle || 'Miliki Paket Mesin Kasir Praktis POS Hari Ini',
    ctaBannerDesc: current?.ctaBannerDesc || 'Konsultasikan jenis usaha dan kebutuhan toko Anda dengan tim kami. Perangkat kami rakit dan uji sebelum dikirim langsung ke alamat Anda.',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E7EE] dark:border-[#232326]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] text-xs font-bold mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Konten & Kontak</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000] dark:text-[#FFFFFF] tracking-tight">
            Pengaturan Teks & Kontak Website
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#A1A1AA] mt-1">
            Ubah teks headline penawaran, poin centang keunggulan, gambar mockup dashboard kasir, nomor WhatsApp CS, template pesan chat, dan URL live demo aplikasi.
          </p>
        </div>
      </div>

      <SettingsForm initialSettings={settingsData} />
    </div>
  );
}
