'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toggleSectionVisibility } from './actions';

interface SectionItem {
  sectionKey: string;
  label: string;
  isVisible: number;
  displayOrder: number;
}

interface Props {
  initialSections: SectionItem[];
}

export const SectionToggleList: React.FC<Props> = ({ initialSections }) => {
  const [sections, setSections] = useState<SectionItem[]>(initialSections);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ key: string; msg: string; type: 'success' | 'error' } | null>(null);

  const getSectionDescription = (key: string) => {
    switch (key) {
      case 'hero':
        return 'Bagian utama di paling atas: headline penawaran, mockup dashboard kasir, dan tombol CTA utama WhatsApp & Demo.';
      case 'social_proof':
        return 'Baris 4 metrik keuntungan (Rp 0 Biaya Bulanan, 100% Siap Pakai, 2 Dompet, 1 Thn Garansi) serta badge jenis usaha UMKM.';
      case 'hardware':
        return 'Showcase paket perangkat keras (Tablet, Printer Struk, Barcode Scanner, Cash Drawer, Lisensi Software) dan starter kit bonus.';
      case 'features':
        return 'Daftar 4 fitur unggulan software kasir: Transaksi Kilat, Dual-Wallet Kas Modal vs Profit, Inventori Barcode, dan Laporan HPP.';
      case 'demo_banner':
        return 'Banner ajakan interaktif untuk mencoba live demo aplikasi kasir langsung dari browser.';
      case 'faq':
        return 'Accordion tanya jawab pelanggan seputar biaya bulanan, garansi hardware, setting produk, dan koneksi internet.';
      case 'cta_banner':
        return 'Banner penutup penawaran di bagian bawah halaman sebelum footer dengan ajakan konsultasi WhatsApp.';
      case 'floating_wa':
        return 'Tombol WhatsApp melayang (floating action button) di sudut kanan bawah layar yang selalu terlihat saat di-scroll.';
      default:
        return 'Komponen landing page Praktis POS.';
    }
  };

  const handleToggle = async (sectionKey: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setLoadingKey(sectionKey);
    setFeedback(null);

    // Optimistic update
    setSections((prev) =>
      prev.map((s) => (s.sectionKey === sectionKey ? { ...s, isVisible: nextStatus ? 1 : 0 } : s))
    );

    const res = await toggleSectionVisibility(sectionKey, nextStatus);

    if (res.success) {
      setFeedback({
        key: sectionKey,
        msg: `Section ${sectionKey} berhasil di-${nextStatus ? 'tampilkan' : 'sembunyikan'}. Perubahan langsung aktif di landing page!`,
        type: 'success',
      });
    } else {
      // Revert optimistic update
      setSections((prev) =>
        prev.map((s) => (s.sectionKey === sectionKey ? { ...s, isVisible: currentStatus ? 1 : 0 } : s))
      );
      setFeedback({
        key: sectionKey,
        msg: res.error || 'Gagal mengubah visibilitas section.',
        type: 'error',
      });
    }

    setLoadingKey(null);
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-center gap-3 transition-all ${
            feedback.type === 'success'
              ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/40 text-green-700 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600 dark:text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
          )}
          <span>{feedback.msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {sections.map((section) => {
          const isVisible = section.isVisible === 1;
          const isLoading = loadingKey === section.sectionKey;

          return (
            <Card
              key={section.sectionKey}
              className={`transition-all duration-200 ${
                isVisible
                  ? 'border-[#E7E7EE] dark:border-[#232326] bg-[#FFFFFF] dark:bg-[#141416]'
                  : 'border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 opacity-80'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F]">
                        #{section.sectionKey}
                      </span>
                      {isVisible ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Aktif (Tampil)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500">
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Disembunyikan (Hide)</span>
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-base sm:text-lg mt-1 font-bold">
                      {section.label}
                    </CardTitle>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Switch
                      checked={isVisible}
                      disabled={isLoading}
                      onCheckedChange={() => handleToggle(section.sectionKey, isVisible)}
                      aria-label={`Toggle visibility for ${section.label}`}
                    />
                  </div>
                </div>
                <CardDescription className="pt-2 text-xs leading-relaxed">
                  {getSectionDescription(section.sectionKey)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <div className="text-[11px] text-[#71717A] flex items-center justify-between border-t border-[#E7E7EE] dark:border-[#232326] pt-3">
                  <span>Urutan render: #{section.displayOrder}</span>
                  <span>{isVisible ? 'Terlihat oleh publik' : 'Hanya terlihat di preview admin'}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
