'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Eye,
  Package,
  Sliders,
  Sparkles,
  HelpCircle,
  Shield,
  ExternalLink,
  LogOut,
  Store,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { open } = useSidebar();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Kelola Section', href: '/admin/sections', icon: Eye },
    { label: 'Paket Hardware', href: '/admin/hardware', icon: Package },
    { label: 'Teks & Kontak', href: '/admin/settings', icon: Sliders },
    { label: 'Fitur Unggulan', href: '/admin/features', icon: Sparkles },
    { label: 'Tanya Jawab (FAQ)', href: '/admin/faqs', icon: HelpCircle },
    { label: 'Keamanan Akun', href: '/admin/security', icon: Shield },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-[#E0511F] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Store className="w-5 h-5" />
          </div>
          {open && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-sm text-[#000000] dark:text-[#FFFFFF] truncate">Praktis POS</span>
              <span className="text-[11px] text-[#E0511F] font-semibold">CMS Panel</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton isActive={isActive}>
                    <Icon className="w-4 h-4 shrink-0" />
                    {open && <span className="truncate">{item.label}</span>}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <SidebarMenuButton>
                <ExternalLink className="w-4 h-4 shrink-0" />
                {open && <span className="truncate">Buka Landing Page</span>}
              </SidebarMenuButton>
            </a>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {open && <span className="truncate">Keluar (Logout)</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
