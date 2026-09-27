import React from 'react';
import Image from 'next/image';
import mockupImage from '../assets/img/mockup-dashboard.png';

export const MockupPreview: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full rounded-2xl shadow-2xl overflow-hidden bg-white">
        <Image
          src={mockupImage}
          alt="Mockup Sistem Kasir Praktis POS"
          width={896}
          height={391}
          priority
          className="w-full h-auto object-contain block"
        />
      </div>
    </div>
  );
};
