import React from 'react';
import Image from 'next/image';
import logoIcon from '../assets/img/Logo.png';

interface MockupPreviewProps {
  imageUrl?: string;
}

export const MockupPreview: React.FC<MockupPreviewProps> = ({ imageUrl }) => {
  const displayImage = imageUrl || '/mockup-dashboard.png';

  return (
    <div className="w-full bg-[#FFFFFF] dark:bg-[#141416] rounded-2xl border border-[#E7E7EE] dark:border-[#232326] shadow-xl overflow-hidden transition-all duration-300">
      {/* Mac Window Header in HTML */}
      <div className="bg-[#F8F9FA] dark:bg-[#18181B] px-4 py-3 border-b border-[#E7E7EE] dark:border-[#232326] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          <span className="ml-2 text-xs font-medium text-[#525252] dark:text-[#A1A1AA] hidden sm:inline">
            praktispos.app/dashboard
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#000000] dark:text-[#FFFFFF]">
          <Image
            src={logoIcon}
            alt="Praktis POS"
            width={16}
            height={16}
            className="w-4 h-4 object-contain"
          />
          <span>Sistem Kasir Praktis POS Aktif</span>
        </div>
      </div>

      {/* Mac Window Body (Dashboard Image) */}
      <div className="relative w-full bg-[#FFFFFF] dark:bg-[#141416]">
        <Image
          src={displayImage}
          alt="Dashboard Kasir Praktis POS"
          width={894}
          height={348}
          priority
          unoptimized
          className="w-full h-auto block object-cover"
        />
      </div>
    </div>
  );
};
