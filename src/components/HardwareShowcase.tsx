import React from 'react';
import { Tablet, Printer, ScanBarcode, ShieldCheck, Cpu, CheckCircle2, Gift, MessageCircle, ArrowRight } from 'lucide-react';
import { PACKAGE_DATA, WHATSAPP_NUMBER } from '../data/package-data';

export const HardwareShowcase: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Tablet': return Tablet;
      case 'Printer': return Printer;
      case 'ScanBarcode': return ScanBarcode;
      case 'ShieldCheck': return ShieldCheck;
      case 'Cpu': return Cpu;
      default: return Tablet;
    }
  };

  const getWaUrl = () => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PACKAGE_DATA.waTemplate)}`;
  };

  return (
    <section id="hardware" className="py-16 sm:py-24 bg-[#FDFDFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] text-[#E0511F] text-xs font-bold uppercase tracking-wider mb-3">
            What's In The Box
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#000000] tracking-tight">
            1 Paket Lengkap Mesin Kasir Praktis POS
          </h2>
          <p className="mt-3 text-base text-[#525252]">
            Semua perangkat yang Anda butuhkan untuk operasional toko sudah tersedia dalam satu paket. Buka dus, colok kabel, dan langsung siap transaksi.
          </p>
        </div>

        {/* 5 Hardware Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKAGE_DATA.hardwareList.map((item) => {
            const IconComponent = getIcon(item.iconName);
            return (
              <div
                key={item.id}
                className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E7E7EE] hover:border-[#E0511F]/40 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#FFF0EB] flex items-center justify-center text-[#E0511F] mb-4">
                    <IconComponent className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-xs font-semibold text-[#E0511F] uppercase tracking-wider">{item.category}</span>
                  <h3 className="text-lg font-bold text-[#000000] mt-1">{item.name}</h3>
                  <p className="text-xs font-medium text-[#525252] mt-1 bg-[#F8F9FA] p-2 rounded-lg border border-[#E7E7EE]">
                    Spesifikasi: {item.spec}
                  </p>
                  <p className="text-sm text-[#525252] mt-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E7E7EE] flex items-center gap-1.5 text-xs font-semibold text-[#000000]">
                  <CheckCircle2 className="w-4 h-4 text-[#E0511F]" />
                  <span>Termasuk Setting & Driver</span>
                </div>
              </div>
            );
          })}

          {/* Card Bonus & Guarantee */}
          <div className="bg-[#FFFFFF] p-6 rounded-2xl border-2 border-dashed border-[#E0511F]/30 bg-[#FFF0EB]/20 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FFF0EB] flex items-center justify-center text-[#E0511F] mb-4">
                <Gift className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-[#E0511F] uppercase tracking-wider">Bonus Spesial Pembelian</span>
              <h3 className="text-lg font-bold text-[#000000] mt-1">Gratis Starter Kit Toko</h3>
              <ul className="mt-3 space-y-2 text-xs text-[#525252]">
                {PACKAGE_DATA.bonuses.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E0511F] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E0511F]/20">
              <a
                href={getWaUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-[#E0511F] text-[#FFFFFF] hover:bg-[#C94213] transition-colors duration-200 cursor-pointer shadow-sm hover:shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Tanyakan Harga Promo via WA</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
