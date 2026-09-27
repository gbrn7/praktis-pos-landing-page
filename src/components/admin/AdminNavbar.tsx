'use client';

import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ShieldCheck } from 'lucide-react';

export const AdminNavbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#E7E7EE] dark:border-[#232326] bg-[#FFFFFF]/90 dark:bg-[#111113]/90 px-4 sm:px-6 backdrop-blur-md transition-colors duration-200">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="h-4 w-px bg-[#E7E7EE] dark:bg-[#232326]" />
        <span className="text-sm font-bold text-[#000000] dark:text-[#FFFFFF]">
          Dashboard CMS
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin Terverifikasi</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};
