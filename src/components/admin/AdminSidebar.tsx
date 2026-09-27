'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

import logoLight from '@/assets/img/Logo-with-text-white-bg.png';
import logoDark from '@/assets/img/Logo-with-text-dark-bg.png';
import logoIcon from '@/assets/img/Logo.png';

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
        {open ? (
          <div className="flex items-center justify-between w-full px-1 py-1">
            <Link href="/admin" className="flex items-center gap-2 min-w-0">
              {/* Light mode logo */}
              <Image
                src={logoLight}
                alt="Praktis POS"
                height={34}
                width={125}
                className="h-8 w-auto object-contain dark:hidden"
                priority
              />
              {/* Dark mode logo */}
              <Image
                src={logoDark}
                alt="Praktis POS"
                height={34}
                width={125}
                className="h-8 w-auto object-contain hidden dark:block"
                priority
              />
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full py-1">
            <Link href="/admin">
              <Image
                src={logoIcon}
                alt="Praktis POS"
                height={32}
                width={32}
                className="h-8 w-8 object-contain"
                priority
              />
            </Link>
          </div>
        )}
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
