import React, { useState } from 'react';
import { Store, MessageCircle, MonitorPlay, Menu, X } from 'lucide-react';
import { PACKAGE_DATA, WHATSAPP_NUMBER, LIVE_DEMO_URL } from '../data/package-data';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getWaUrl = () => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PACKAGE_DATA.waTemplate)}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FDFDFD]/95 backdrop-blur-md border-b border-[#E7E7EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] flex items-center justify-center text-[#E0511F] group-hover:bg-[#FFE4DB] transition-colors duration-200">
              <Store className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#000000]">Super<span className="text-[#E0511F]">POS</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FFF0EB] text-[#E0511F]">All-in-One</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#525252]">
            <a href="#hardware" className="hover:text-[#000000] transition-colors duration-200 cursor-pointer">Paket Hardware</a>
            <a href="#fitur" className="hover:text-[#000000] transition-colors duration-200 cursor-pointer">Fitur Software</a>
            <a href="#keunggulan" className="hover:text-[#000000] transition-colors duration-200 cursor-pointer">Kas Modal & Profit</a>
            <a href="#faq" className="hover:text-[#000000] transition-colors duration-200 cursor-pointer">FAQ</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={LIVE_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#EDF0F4] text-[#080808] hover:bg-[#E2E6EA] transition-colors duration-200 cursor-pointer"
            >
              <MonitorPlay className="w-4 h-4 text-[#525252]" />
              <span>Coba Demo</span>
            </a>
            <a
              href={getWaUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-[#E0511F] text-[#FFFFFF] hover:bg-[#C94213] shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Pesan Paket</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={getWaUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E0511F] text-[#FFFFFF] cursor-pointer"
            >
              Pesan
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#525252] hover:text-[#000000] hover:bg-[#EDF0F4] transition-colors duration-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E7E7EE] flex flex-col gap-3">
            <a
              href="#hardware"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 text-sm font-medium text-[#525252] hover:text-[#000000] transition-colors cursor-pointer"
            >
              Paket Hardware
            </a>
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 text-sm font-medium text-[#525252] hover:text-[#000000] transition-colors cursor-pointer"
            >
              Fitur Software
            </a>
            <a
              href="#keunggulan"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 text-sm font-medium text-[#525252] hover:text-[#000000] transition-colors cursor-pointer"
            >
              Kas Modal & Profit
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 text-sm font-medium text-[#525252] hover:text-[#000000] transition-colors cursor-pointer"
            >
              FAQ
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href={LIVE_DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#EDF0F4] text-[#080808] cursor-pointer"
              >
                <MonitorPlay className="w-4 h-4 text-[#525252]" />
                <span>Coba Live Demo Software</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
