import React from 'react';
import { MessageCircle, MonitorPlay, Sparkles, Check, ArrowRight } from 'lucide-react';
import { PACKAGE_DATA, WHATSAPP_NUMBER, LIVE_DEMO_URL } from '../data/package-data';
import { MockupPreview } from './MockupPreview';

export const Hero: React.FC = () => {
  const getWaUrl = () => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PACKAGE_DATA.waTemplate)}`;
  };

  return (
    <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0EB] dark:bg-[#2B150B] border border-[#E0511F]/20 dark:border-[#E0511F]/30 text-[#E0511F] text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>Mesin Kasir Praktis POS • Paket Siap Pakai</span>
          </div>

          {/* Headline H1 */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#000000] dark:text-[#FFFFFF] tracking-tight leading-[1.15]">
            Solusi Mesin Kasir Lengkap: <br className="hidden sm:inline" />
            <span className="text-[#E0511F]">Buka Dus, Colok,</span> Langsung Siap Jualan.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-[#525252] dark:text-[#A1A1AA] leading-relaxed max-w-2xl mx-auto">
            Bersama <strong>Praktis POS</strong>, kelola transaksi kasir secepat kilat, pantau stok akurat, dan otomatis pisahkan uang modal kulakan vs laba bersih toko Anda. <strong>100% tanpa biaya langganan bulanan seumur hidup.</strong>
          </p>

          {/* 2 CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={getWaUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold bg-[#E0511F] text-[#FFFFFF] hover:bg-[#C94213] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Konsultasi & Pesan via WhatsApp</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href={LIVE_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold bg-[#EDF0F4] dark:bg-[#222226] text-[#080808] dark:text-[#FFFFFF] hover:bg-[#E2E6EA] dark:hover:bg-[#2C2C32] transition-colors duration-200 cursor-pointer"
            >
              <MonitorPlay className="w-5 h-5 text-[#525252] dark:text-[#A1A1AA]" />
              <span>Eksplorasi Live Demo Software</span>
            </a>
          </div>

          {/* Value Highlights Under CTA */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#525252] dark:text-[#A1A1AA]">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#E0511F] stroke-[2.5]" />
              Hak Milik Seumur Hidup
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#E0511F] stroke-[2.5]" />
              Garansi Hardware 1 Tahun
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#E0511F] stroke-[2.5]" />
              Gratis Setup & Training
            </span>
          </div>
        </div>

        {/* Mockup Dashboard Preview Container */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
          <MockupPreview />
        </div>
      </div>
    </section>
  );
};
