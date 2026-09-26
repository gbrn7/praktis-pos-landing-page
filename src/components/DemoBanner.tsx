import React from 'react';
import { MonitorPlay, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { LIVE_DEMO_URL } from '../data/package-data';

export const DemoBanner: React.FC = () => {
  return (
    <section className="py-14 bg-[#FDFDFD]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E7E7EE] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] text-[#E0511F] text-xs font-bold mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Tanpa Perlu Install Apapun</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#000000] tracking-tight">
              Ingin Mencoba Langsung Praktis POS?
            </h3>
            <p className="mt-2 text-sm text-[#525252] leading-relaxed">
              Buka aplikasi demo langsung di browser Anda sekarang. Rasakan sendiri cepatnya transaksi, kemudahan scan barcode, dan kejelasan laporan kas modal vs profit sebelum memesan paket hardware.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
            <a
              href={LIVE_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-[#E0511F] text-[#FFFFFF] hover:bg-[#C94213] shadow transition-all duration-200 cursor-pointer"
            >
              <MonitorPlay className="w-4 h-4" />
              <span>Buka Live Demo Kasir</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <div className="flex items-center justify-center gap-1 text-xs text-[#525252]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E0511F]" />
              <span>Akses langsung instan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
