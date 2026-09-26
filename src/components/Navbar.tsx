'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MessageCircle, MonitorPlay, Menu, X } from 'lucide-react';
import { PACKAGE_DATA, WHATSAPP_NUMBER, LIVE_DEMO_URL } from '../data/package-data';
import logoLight from '../assets/img/Logo-with-text-white-bg.png';
import logoDark from '../assets/img/Logo-with-text-dark-bg.png';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getWaUrl = () => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PACKAGE_DATA.waTemplate)}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FDFDFD]/95 dark:bg-[#0B0B0C]/95 backdrop-blur-md border-b border-[#E7E7EE] dark:border-[#232326] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo with automatic Theme Switching */}
          <a href="#" className="flex items-center gap-2 group cursor-pointer">
            {/* Light Mode Logo */}
            <Image
              src={logoLight}
              alt="Praktis POS"
              height={44}
              width={160}
              className="h-9 sm:h-11 w-auto object-contain dark:hidden"
              priority
            />
            {/* Dark Mode Logo */}
            <Image
              src={logoDark}
              alt="Praktis POS"
              height={44}
              width={160}
              className="h-9 sm:h-11 w-auto object-contain hidden dark:block"
              priority
            />
            <span className="hidden sm:inline-block ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F]">
              All-in-One
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#525252] dark:text-[#A1A1AA]">
            <a href="#hardware" className="hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer">Paket Hardware</a>
            <a href="#fitur" className="hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer">Fitur Software</a>
            <a href="#keunggulan" className="hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer">Kas Modal & Profit</a>
            <a href="#faq" className="hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer">FAQ</a>
          </nav>

          {/* Action Buttons & Desktop Theme Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            <a
              href={LIVE_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#EDF0F4] dark:bg-[#222226] text-[#080808] dark:text-[#FFFFFF] hover:bg-[#E2E6EA] dark:hover:bg-[#2C2C32] transition-colors duration-200 cursor-pointer"
            >
              <MonitorPlay className="w-4 h-4 text-[#525252] dark:text-[#A1A1AA]" />
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

          {/* Mobile Menu & Theme Controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
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
              className="p-2 rounded-lg text-[#525252] dark:text-[#A1A1AA] hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:bg-[#EDF0F4] dark:hover:bg-[#222226] transition-colors duration-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E7E7EE] dark:border-[#232326] flex flex-col gap-3">
            <a
              href="#hardware"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 text-sm font-medium text-[#525252] dark:text-[#A1A1AA] hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors cursor-pointer"
            >
              Paket Hardware
            </a>
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 text-sm font-medium text-[#525252] dark:text-[#A1A1AA] hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors cursor-pointer"
            >
              Fitur Software
            </a>
            <a
              href="#keunggulan"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 text-sm font-medium text-[#525252] dark:text-[#A1A1AA] hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors cursor-pointer"
            >
              Kas Modal & Profit
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 text-sm font-medium text-[#525252] dark:text-[#A1A1AA] hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors cursor-pointer"
            >
              FAQ
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href={LIVE_DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#EDF0F4] dark:bg-[#222226] text-[#080808] dark:text-[#FFFFFF] cursor-pointer"
              >
                <MonitorPlay className="w-4 h-4 text-[#525252] dark:text-[#A1A1AA]" />
                <span>Coba Live Demo Software</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
