'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { PACKAGE_DATA, WHATSAPP_NUMBER } from '../data/package-data';

export const FloatingWhatsApp: React.FC = () => {
  const getWaUrl = () => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PACKAGE_DATA.waTemplate)}`;
  };

  return (
    <aside aria-label="WhatsApp Support" className="fixed bottom-6 right-6 z-50">
      <a
        href={getWaUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Konsultasi via WhatsApp"
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#E0511F] text-[#FFFFFF] shadow-lg hover:shadow-xl hover:bg-[#C94213] hover:scale-105 transition-all duration-200 cursor-pointer group"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-xs font-bold">Chat WhatsApp</span>
        <span className="w-2.5 h-2.5 rounded-full bg-[#FFFFFF] animate-ping" />
      </a>
    </aside>
  );
};
