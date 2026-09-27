import React from 'react';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { PACKAGE_DATA, WHATSAPP_NUMBER } from '../data/package-data';
import logoLight from '../assets/img/Logo-with-text-white-bg.png';
import logoDark from '../assets/img/Logo-with-text-dark-bg.png';
import { SiteSettingsPublic } from '@/lib/db/queries';

interface FooterProps {
  settings?: SiteSettingsPublic;
  visibility?: Record<string, boolean>;
}

export const Footer: React.FC<FooterProps> = ({ settings, visibility }) => {
  const waNum = settings?.waNumber || WHATSAPP_NUMBER;
  const waMsg = settings?.waTemplate || PACKAGE_DATA.waTemplate;

  const showHardware = visibility ? visibility.hardware !== false : true;
  const showFeatures = visibility ? visibility.features !== false : true;
  const showFaq = visibility ? visibility.faq !== false : true;

  const getWaUrl = () => {
    return `https://wa.me/${waNum}?text=${encodeURIComponent(waMsg)}`;
  };

  return (
    <footer className="bg-[#FFFFFF] dark:bg-[#0E0E10] border-t border-[#E7E7EE] dark:border-[#232326] py-12 text-[#525252] dark:text-[#A1A1AA] text-xs sm:text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <Image
                src={logoLight}
                alt="Praktis POS"
                height={40}
                width={150}
                className="h-9 sm:h-10 w-auto object-contain dark:hidden"
              />
              <Image
                src={logoDark}
                alt="Praktis POS"
                height={40}
                width={150}
                className="h-9 sm:h-10 w-auto object-contain hidden dark:block"
              />
            </div>
            <p className="mt-3 text-xs text-[#525252] dark:text-[#A1A1AA] max-w-sm leading-relaxed">
              Solusi paket mesin kasir All-in-One siap pakai untuk ritel dan UMKM di seluruh Indonesia. Transaksi cepat, pencatatan rapi, dan otomatis memisahkan kas modal & profit toko.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="font-bold text-[#000000] dark:text-[#FFFFFF] text-xs uppercase tracking-wider mb-3">Navigasi</h4>
            <ul className="space-y-2 text-xs">
              {showHardware && (
                <li><a href="#hardware" className="hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors cursor-pointer">Paket Hardware</a></li>
              )}
              {showFeatures && (
                <>
                  <li><a href="#fitur" className="hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors cursor-pointer">Fitur Software</a></li>
                  <li><a href="#keunggulan" className="hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors cursor-pointer">Kas Modal & Profit</a></li>
                </>
              )}
              {showFaq && (
                <li><a href="#faq" className="hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors cursor-pointer">Pertanyaan Umum</a></li>
              )}
            </ul>
          </div>

          {/* Kontak & Dukungan */}
          <div>
            <h4 className="font-bold text-[#000000] dark:text-[#FFFFFF] text-xs uppercase tracking-wider mb-3">Pemesanan & Support</h4>
            <p className="text-xs text-[#525252] dark:text-[#A1A1AA] mb-3">
              Layanan konsultasi penjualan & bantuan teknis online via WhatsApp.
            </p>
            <a
              href={getWaUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] font-semibold text-xs hover:bg-[#FFE4DB] dark:hover:bg-[#3D1E10] transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat Tim Sales</span>
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-[#E7E7EE] dark:border-[#232326] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Praktis POS. All rights reserved.</p>
          <p className="text-[#525252] dark:text-[#A1A1AA]">Paket Mesin Kasir Lengkap Hardware + Software Siap Pakai.</p>
        </div>
      </div>
    </footer>
  );
};
