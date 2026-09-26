import React from 'react';
import { MessageCircle, Check, ArrowRight } from 'lucide-react';
import { PACKAGE_DATA, WHATSAPP_NUMBER } from '../data/package-data';

export const CtaBanner: React.FC = () => {
  const getWaUrl = () => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PACKAGE_DATA.waTemplate)}`;
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FDFDFD] border-t border-[#E7E7EE]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative p-8 sm:p-14 rounded-3xl bg-[#FFFFFF] border-2 border-[#E7E7EE] shadow-lg text-center overflow-hidden">
          {/* Subtle background accent dot */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#FFF0EB] -z-0 opacity-70" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-[#FFF0EB] text-[#E0511F] text-xs font-bold uppercase tracking-wider mb-4">
              Siap Memajukan Toko Anda?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#000000] tracking-tight">
              Miliki Paket Mesin Kasir Praktis POS Hari Ini
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#525252] leading-relaxed">
              Konsultasikan jenis usaha dan kebutuhan toko Anda dengan tim kami. Perangkat kami rakit dan uji sebelum dikirim langsung ke alamat Anda.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={getWaUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-[#E0511F] text-[#FFFFFF] hover:bg-[#C94213] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Konsultasi & Pesan via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-[#525252]">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#E0511F]" /> Beli Putus Tanpa Biaya Bulanan
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#E0511F]" /> Garansi Hardware 1 Tahun
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#E0511F]" /> Bantuan Panduan Sampai Bisa
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
