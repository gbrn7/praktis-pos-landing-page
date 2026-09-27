'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, Save, Phone, MessageSquare, MonitorPlay, Sparkles } from 'lucide-react';
import { updateSiteSettings } from './actions';

interface SiteSettingsData {
  heroPill: string;
  heroHeadline: string;
  heroSubtitle: string;
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
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

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
