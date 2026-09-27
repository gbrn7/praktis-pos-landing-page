import React from 'react';
import Link from 'next/link';
import {
  Database,
  Eye,
  Package,
  Sparkles,
  HelpCircle,
  Sliders,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { db } from '@/lib/db';
import { sectionSettings, hardwareItems, features, faqs } from '@/lib/db/schema';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ensureDatabaseSeeded } from '@/lib/db/seed';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  ensureDatabaseSeeded();

  const sections = db.select().from(sectionSettings).orderBy(sectionSettings.displayOrder).all();
  const hardwareList = db.select().from(hardwareItems).all();
  const featuresList = db.select().from(features).all();
  const faqsList = db.select().from(faqs).all();

  const visibleSectionsCount = sections.filter((s) => s.isVisible === 1).length;
  const activeHardwareCount = hardwareList.filter((h) => h.isActive === 1).length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-[#FFF0EB] via-white to-white dark:from-[#2B150B]/60 dark:via-[#141416] dark:to-[#141416] border border-[#E7E7EE] dark:border-[#232326] shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#E0511F] uppercase tracking-wider">
              Control Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000] dark:text-[#FFFFFF] mt-1 tracking-tight">
              Selamat Datang di Praktis POS CMS
            </h1>
            <p className="text-sm text-[#525252] dark:text-[#A1A1AA] mt-1.5 max-w-2xl leading-relaxed">
              Kelola seluruh tampilan landing page, status visibilitas section (Hide/Show), paket produk hardware, teks penawaran, dan kontak WhatsApp toko Anda secara langsung.
            </p>
          </div>
          <Link href="/admin/sections">
            <Button className="shrink-0 font-bold gap-2">
              <Eye className="w-4 h-4" />
              <span>Kelola Section</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-[#525252] dark:text-[#A1A1AA] uppercase tracking-wider">
              Status Database
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-extrabold text-[#000000] dark:text-[#FFFFFF]">
              SQLite Aktif
            </div>
            <p className="text-xs text-[#525252] dark:text-[#A1A1AA] mt-1">
              File: <code className="font-mono text-[11px]">data/cms.db</code> (WAL Mode)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-[#525252] dark:text-[#A1A1AA] uppercase tracking-wider">
              Visibilitas Section
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-extrabold text-[#000000] dark:text-[#FFFFFF]">
              {visibleSectionsCount} / {sections.length} Aktif
            </div>
            <p className="text-xs text-[#525252] dark:text-[#A1A1AA] mt-1">
              {sections.length - visibleSectionsCount} section disembunyikan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-[#525252] dark:text-[#A1A1AA] uppercase tracking-wider">
              Produk Hardware
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-extrabold text-[#000000] dark:text-[#FFFFFF]">
              {activeHardwareCount} Perangkat
            </div>
            <p className="text-xs text-[#525252] dark:text-[#A1A1AA] mt-1">
              {hardwareList.length} total perangkat di database
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-[#525252] dark:text-[#A1A1AA] uppercase tracking-wider">
              Fitur & FAQ
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-extrabold text-[#000000] dark:text-[#FFFFFF]">
              {faqsList.length} FAQ • {featuresList.length} Fitur
            </div>
            <p className="text-xs text-[#525252] dark:text-[#A1A1AA] mt-1">
              Siap ditampilkan di landing page
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overview Table of Sections */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Status Visibilitas Section Landing Page</CardTitle>
            <CardDescription>
              Status live setiap section di halaman utama
            </CardDescription>
          </div>
          <Link href="/admin/sections">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <span>Ubah Switch Visibilitas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {sections.map((section) => (
              <div
                key={section.sectionKey}
                className="flex items-center justify-between p-3.5 rounded-xl border border-[#E7E7EE] dark:border-[#232326] bg-[#FDFDFD] dark:bg-[#18181B]"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF] truncate">
                    {section.label}
                  </p>
                  <p className="text-[11px] text-[#525252] dark:text-[#A1A1AA] font-mono">
                    #{section.sectionKey}
                  </p>
                </div>
                {section.isVisible === 1 ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-full shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Tampil</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full shrink-0">
                    <XCircle className="w-3 h-3" />
                    <span>Sembunyi</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/hardware" className="group">
          <Card className="h-full hover:border-[#E0511F]/40 dark:hover:border-[#E0511F]/50 transition-colors">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] flex items-center justify-center mb-2">
                <Package className="w-5 h-5" />
              </div>
              <CardTitle className="text-base group-hover:text-[#E0511F] transition-colors">
                Kelola Paket Hardware
              </CardTitle>
              <CardDescription>
                Tambah, edit spesifikasi produk kasir, kelola bonus starter kit, dan upload foto perangkat.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/settings" className="group">
          <Card className="h-full hover:border-[#E0511F]/40 dark:hover:border-[#E0511F]/50 transition-colors">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] flex items-center justify-center mb-2">
                <Sliders className="w-5 h-5" />
              </div>
              <CardTitle className="text-base group-hover:text-[#E0511F] transition-colors">
                Teks Utama & WhatsApp
              </CardTitle>
              <CardDescription>
                Ubah judul hero, nomor WhatsApp pemesanan, template pesan chat, dan URL live demo aplikasi.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/faqs" className="group">
          <Card className="h-full hover:border-[#E0511F]/40 dark:hover:border-[#E0511F]/50 transition-colors">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] flex items-center justify-center mb-2">
                <HelpCircle className="w-5 h-5" />
              </div>
              <CardTitle className="text-base group-hover:text-[#E0511F] transition-colors">
                Tanya Jawab (FAQ)
              </CardTitle>
              <CardDescription>
                Atur pertanyaan dan jawaban umum seputar biaya lisensi, garansi, instalasi, dan panduan.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
