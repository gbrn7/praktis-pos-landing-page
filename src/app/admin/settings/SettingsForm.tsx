'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  AlertCircle,
  Save,
  Phone,
  MessageSquare,
  MonitorPlay,
  Sparkles,
  Layout,
  Upload,
  RotateCcw,
  Image as ImageIcon,
} from 'lucide-react';
import { updateSiteSettings } from './actions';

interface SiteSettingsData {
  heroPill: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroMockupImage?: string | null;
  waNumber: string;
  waTemplate: string;
  liveDemoUrl: string;
  demoBannerTitle: string;
  demoBannerDesc: string;
  ctaBannerTitle: string;
  ctaBannerDesc: string;
}

interface Props {
  initialSettings: SiteSettingsData;
}

export const SettingsForm: React.FC<Props> = ({ initialSettings }) => {
  const [form, setForm] = useState<SiteSettingsData>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm((prev) => ({ ...prev, heroMockupImage: data.url }));
        setFeedback({ msg: 'Foto mockup berhasil diunggah ke server!', type: 'success' });
      } else {
        setFeedback({ msg: data.error || 'Gagal mengunggah foto', type: 'error' });
      }
    } catch {
      setFeedback({ msg: 'Terjadi kesalahan saat upload gambar', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const res = await updateSiteSettings(form);
    if (res.success) {
      setFeedback({ msg: 'Pengaturan website berhasil disimpan dan langsung aktif di landing page!', type: 'success' });
    } else {
      setFeedback({ msg: res.error || 'Gagal menyimpan pengaturan', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-center gap-3 transition-all ${
            feedback.type === 'success'
              ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/40 text-green-700 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600 dark:text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
          )}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Hero Section Texts */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E0511F]" />
            <CardTitle>Teks Hero Section</CardTitle>
          </div>
          <CardDescription>
            Pesan pembuka, headline utama, dan sub-judul pada bagian paling atas website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
              Badge / Pill Atas
            </label>
            <Input
              value={form.heroPill}
              onChange={(e) => setForm({ ...form, heroPill: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
              Headline Utama (H1)
            </label>
            <Input
              value={form.heroHeadline}
              onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
              Subtitle / Deskripsi Penawaran
            </label>
            <Textarea
              rows={3}
              value={form.heroSubtitle}
              onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Mockup Dashboard Image Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-[#E0511F]" />
            <CardTitle>Gambar Mockup Dashboard Kasir (Jendela Mac)</CardTitle>
          </div>
          <CardDescription>
            Atur gambar konten dashboard kasir yang tampil di dalam bingkai jendela Mac pada Hero landing page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
              URL Gambar atau Upload File Lokal
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="/mockup-dashboard.png atau https://..."
                value={form.heroMockupImage || ''}
                onChange={(e) => setForm({ ...form, heroMockupImage: e.target.value })}
                className="flex-1"
              />
              <div className="flex gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#EDF0F4] dark:bg-[#222226] text-[#080808] dark:text-[#FFFFFF] hover:bg-[#E2E6EA] dark:hover:bg-[#2C2C32] transition-colors border border-[#E7E7EE] dark:border-[#232326]">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Mengunggah...' : 'Upload Gambar'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setForm({ ...form, heroMockupImage: '/mockup-dashboard.png' })}
                  title="Kembalikan ke gambar bawaan"
                  className="text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  <span>Reset Default</span>
                </Button>
              </div>
            </div>
            <p className="text-[11px] text-[#71717A]">
              Format gambar yang disarankan: PNG / JPEG / WebP dengan rasio ~2.5:1 (misal 900x350px). Gambar akan otomatis berada di dalam bingkai jendela Mac dengan 3 traffic light buttons di landing page.
            </p>
          </div>

          {/* Interactive Preview in Mac Window Style */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-[#525252] dark:text-[#A1A1AA]">
              Pratinjau Jendela Mac:
            </label>
            <div className="rounded-xl border border-[#E7E7EE] dark:border-[#232326] overflow-hidden bg-white dark:bg-[#141416] shadow-sm max-w-xl">
              {/* Mini Mac Window Header */}
              <div className="bg-[#F8F9FA] dark:bg-[#18181B] px-3 py-2 border-b border-[#E7E7EE] dark:border-[#232326] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  <span className="ml-1.5 text-[10px] font-mono text-[#71717A]">praktispos.app/dashboard</span>
                </div>
                <span className="text-[10px] font-medium text-[#71717A]">Sistem Kasir Aktif</span>
              </div>
              {/* Image Preview */}
              <div className="relative bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center min-h-[120px]">
                {form.heroMockupImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.heroMockupImage}
                    alt="Pratinjau Mockup"
                    className="w-full h-auto max-h-48 object-contain block"
                  />
                ) : (
                  <div className="p-6 text-center text-xs text-zinc-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-40" />
                    Belum ada gambar yang dipilih
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp & Demo Link */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#E0511F]" />
            <CardTitle>Kontak WhatsApp & Live Demo URL</CardTitle>
          </div>
          <CardDescription>
            Tujuan tombol aksi pemesanan dan eksplorasi live demo kasir
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#525252]" />
                <span>Nomor WhatsApp (dengan kode negara 62)</span>
              </label>
              <Input
                placeholder="6281234567890"
                value={form.waNumber}
                onChange={(e) => setForm({ ...form, waNumber: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF] flex items-center gap-1.5">
                <MonitorPlay className="w-3.5 h-3.5 text-[#525252]" />
                <span>URL Live Demo Aplikasi</span>
              </label>
              <Input
                placeholder="http://localhost:8000"
                value={form.liveDemoUrl}
                onChange={(e) => setForm({ ...form, liveDemoUrl: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#525252]" />
              <span>Template Pesan WhatsApp Otomatis</span>
            </label>
            <Textarea
              rows={3}
              value={form.waTemplate}
              onChange={(e) => setForm({ ...form, waTemplate: e.target.value })}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Banner Texts */}
      <Card>
        <CardHeader>
          <CardTitle>Teks Banner Promosi & Penutup</CardTitle>
          <CardDescription>
            Judul dan deskripsi ajakan pada Demo Banner dan CTA Banner bawah
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
              Judul Demo Banner
            </label>
            <Input
              value={form.demoBannerTitle}
              onChange={(e) => setForm({ ...form, demoBannerTitle: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
              Deskripsi Demo Banner
            </label>
            <Textarea
              rows={2}
              value={form.demoBannerDesc}
              onChange={(e) => setForm({ ...form, demoBannerDesc: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#E7E7EE] dark:border-[#232326]">
            <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
              Judul CTA Banner Penutup
            </label>
            <Input
              value={form.ctaBannerTitle}
              onChange={(e) => setForm({ ...form, ctaBannerTitle: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
              Deskripsi CTA Banner Penutup
            </label>
            <Textarea
              rows={2}
              value={form.ctaBannerDesc}
              onChange={(e) => setForm({ ...form, ctaBannerDesc: e.target.value })}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="pt-2 border-t border-[#E7E7EE] dark:border-[#232326] flex justify-end">
          <Button type="submit" disabled={loading} className="font-bold gap-2">
            <Save className="w-4 h-4" />
            <span>{loading ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}</span>
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
