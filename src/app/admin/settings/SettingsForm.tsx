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
  Check,
  Plus,
  Trash2,
  BarChart3,
  Store,
  ShoppingBag,
  Coffee,
  Utensils,
  Scissors,
  Shirt,
  Wrench,
  Pill,
  Package,
  Tag,
  Laptop,
  Flower2,
  BookOpen,
  Car,
} from 'lucide-react';
import { updateSiteSettings } from './actions';
import {
  SocialProofMetric,
  DEFAULT_SOCIAL_PROOF_METRICS,
  TargetIndustryItem,
  DEFAULT_TARGET_INDUSTRIES,
  DEFAULT_TARGET_INDUSTRIES_TITLE,
} from '@/types';

export const INDUSTRY_ICON_OPTIONS = [
  { value: 'Store', label: 'Toko / Minimarket', icon: Store },
  { value: 'ShoppingBag', label: 'Tas Belanja / Fashion', icon: ShoppingBag },
  { value: 'Coffee', label: 'Kafe / Kopi', icon: Coffee },
  { value: 'Sparkles', label: 'Bintang / Kilau', icon: Sparkles },
  { value: 'Utensils', label: 'Resto / Kuliner', icon: Utensils },
  { value: 'Scissors', label: 'Salon / Barbershop', icon: Scissors },
  { value: 'Shirt', label: 'Pakaian / Distro', icon: Shirt },
  { value: 'Wrench', label: 'Bengkel / Perkakas', icon: Wrench },
  { value: 'Pill', label: 'Apotek / Farmasi', icon: Pill },
  { value: 'Package', label: 'Grosir / Dus Paket', icon: Package },
  { value: 'Tag', label: 'Label Harga / Retail', icon: Tag },
  { value: 'Laptop', label: 'Elektronik / Komputer', icon: Laptop },
  { value: 'Flower2', label: 'Bunga / Florist', icon: Flower2 },
  { value: 'BookOpen', label: 'Buku / ATK', icon: BookOpen },
  { value: 'Car', label: 'Otomotif / Cuci Mobil', icon: Car },
];

export const getIndustryIcon = (iconName?: string) => {
  const match = INDUSTRY_ICON_OPTIONS.find((item) => item.value === iconName);
  return match ? match.icon : Store;
};

interface SiteSettingsData {
  heroPill: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroMockupImage?: string | null;
  heroHighlights?: string[];
  socialProofMetrics?: SocialProofMetric[];
  targetIndustries?: TargetIndustryItem[];
  targetIndustriesTitle?: string;
  hardwarePill?: string;
  hardwareHeadline?: string;
  hardwareSubtitle?: string;
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
  const [form, setForm] = useState<SiteSettingsData>({
    ...initialSettings,
    heroHighlights: initialSettings.heroHighlights || [
      'Hak Milik Seumur Hidup',
      'Garansi Hardware 1 Tahun',
      'Gratis Setup & Training',
    ],
    socialProofMetrics: initialSettings.socialProofMetrics || DEFAULT_SOCIAL_PROOF_METRICS,
    targetIndustries: initialSettings.targetIndustries || DEFAULT_TARGET_INDUSTRIES,
    targetIndustriesTitle: initialSettings.targetIndustriesTitle || DEFAULT_TARGET_INDUSTRIES_TITLE,
    hardwarePill: initialSettings.hardwarePill || "What's In The Box",
    hardwareHeadline: initialSettings.hardwareHeadline || '1 Paket Lengkap Mesin Kasir Praktis POS',
    hardwareSubtitle:
      initialSettings.hardwareSubtitle ||
      'Semua perangkat yang Anda butuhkan untuk operasional toko sudah tersedia dalam satu paket. Buka dus, colok kabel, dan langsung siap transaksi.',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingMockup, setSavingMockup] = useState(false);
  const [savingHero, setSavingHero] = useState(false);
  const [savingMetrics, setSavingMetrics] = useState(false);
  const [savingIndustries, setSavingIndustries] = useState(false);
  const [savingHardware, setSavingHardware] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // --- Hardware Header Handlers ---
  const handleResetHardware = () => {
    setForm({
      ...form,
      hardwarePill: "What's In The Box",
      hardwareHeadline: '1 Paket Lengkap Mesin Kasir Praktis POS',
      hardwareSubtitle:
        'Semua perangkat yang Anda butuhkan untuk operasional toko sudah tersedia dalam satu paket. Buka dus, colok kabel, dan langsung siap transaksi.',
    });
  };

  const handleSaveHardwareOnly = async () => {
    setSavingHardware(true);
    setFeedback(null);
    const res = await updateSiteSettings(form);
    if (res.success) {
      setFeedback({
        msg: "Teks judul & deskripsi What's In The Box berhasil disimpan dan langsung aktif di landing page!",
        type: 'success',
      });
    } else {
      setFeedback({ msg: res.error || 'Gagal menyimpan header hardware', type: 'error' });
    }
    setSavingHardware(false);
  };

  // --- Target Industries Handlers ---
  const handleIndustryChange = (index: number, field: keyof TargetIndustryItem, value: string) => {
    const list = [...(form.targetIndustries || DEFAULT_TARGET_INDUSTRIES)].map((item) => ({ ...item }));
    if (list[index]) {
      list[index][field] = value;
      setForm({ ...form, targetIndustries: list });
    }
  };

  const handleAddIndustry = () => {
    const list = [...(form.targetIndustries || DEFAULT_TARGET_INDUSTRIES)].map((item) => ({ ...item }));
    list.push({ name: 'Bisnis Baru', iconName: 'Store' });
    setForm({ ...form, targetIndustries: list });
  };

  const handleRemoveIndustry = (index: number) => {
    const list = [...(form.targetIndustries || DEFAULT_TARGET_INDUSTRIES)].map((item) => ({ ...item }));
    list.splice(index, 1);
    setForm({ ...form, targetIndustries: list });
  };

  const handleResetIndustries = () => {
    setForm({
      ...form,
      targetIndustries: DEFAULT_TARGET_INDUSTRIES.map((item) => ({ ...item })),
      targetIndustriesTitle: DEFAULT_TARGET_INDUSTRIES_TITLE,
    });
  };

  const handleSaveIndustriesOnly = async () => {
    setSavingIndustries(true);
    setFeedback(null);
    const res = await updateSiteSettings(form);
    if (res.success) {
      setFeedback({
        msg: 'Target jenis bisnis & industri berhasil disimpan dan langsung aktif di landing page!',
        type: 'success',
      });
    } else {
      setFeedback({ msg: res.error || 'Gagal menyimpan target industri', type: 'error' });
    }
    setSavingIndustries(false);
  };

  // --- Metrics Handlers ---
  const handleMetricChange = (index: number, field: keyof SocialProofMetric, value: string) => {
    const list = [...(form.socialProofMetrics || DEFAULT_SOCIAL_PROOF_METRICS)].map((item) => ({ ...item }));
    if (list[index]) {
      list[index][field] = value;
      setForm({ ...form, socialProofMetrics: list });
    }
  };

  const handleAddMetric = () => {
    const list = [...(form.socialProofMetrics || DEFAULT_SOCIAL_PROOF_METRICS)].map((item) => ({ ...item }));
    list.push({ number: '100%', label: 'Fitur Unggulan', desc: 'Penjelasan manfaat fitur bagi operasional toko' });
    setForm({ ...form, socialProofMetrics: list });
  };

  const handleRemoveMetric = (index: number) => {
    const list = [...(form.socialProofMetrics || DEFAULT_SOCIAL_PROOF_METRICS)].map((item) => ({ ...item }));
    list.splice(index, 1);
    setForm({ ...form, socialProofMetrics: list });
  };

  const handleResetMetrics = () => {
    setForm({
      ...form,
      socialProofMetrics: DEFAULT_SOCIAL_PROOF_METRICS.map((item) => ({ ...item })),
    });
  };

  const handleSaveMetricsOnly = async () => {
    setSavingMetrics(true);
    setFeedback(null);
    const res = await updateSiteSettings(form);
    if (res.success) {
      setFeedback({
        msg: 'Metrik keunggulan berhasil disimpan dan langsung aktif di landing page!',
        type: 'success',
      });
    } else {
      setFeedback({ msg: res.error || 'Gagal menyimpan metrik keunggulan', type: 'error' });
    }
    setSavingMetrics(false);
  };

  // --- Highlights Handlers ---
  const handleHighlightChange = (index: number, value: string) => {
    const list = [...(form.heroHighlights || [])];
    list[index] = value;
    setForm({ ...form, heroHighlights: list });
  };

  const handleAddHighlight = () => {
    const list = [...(form.heroHighlights || [])];
    list.push('');
    setForm({ ...form, heroHighlights: list });
  };

  const handleRemoveHighlight = (index: number) => {
    const list = [...(form.heroHighlights || [])];
    list.splice(index, 1);
    setForm({ ...form, heroHighlights: list });
  };

  const handleResetHighlights = () => {
    setForm({
      ...form,
      heroHighlights: ['Hak Milik Seumur Hidup', 'Garansi Hardware 1 Tahun', 'Gratis Setup & Training'],
    });
  };

  const handleSaveHeroOnly = async () => {
    setSavingHero(true);
    setFeedback(null);
    const res = await updateSiteSettings(form);
    if (res.success) {
      setFeedback({
        msg: 'Teks hero dan poin keunggulan berhasil disimpan dan langsung aktif di landing page!',
        type: 'success',
      });
    } else {
      setFeedback({ msg: res.error || 'Gagal menyimpan pengaturan hero', type: 'error' });
    }
    setSavingHero(false);
  };

  // --- Mockup Handlers ---
  const handleSaveMockup = async (customUrl?: string) => {
    const targetUrl = customUrl !== undefined ? customUrl : (form.heroMockupImage || '/mockup-dashboard.png');
    setSavingMockup(true);
    setFeedback(null);

    const updated = { ...form, heroMockupImage: targetUrl };
    setForm(updated);

    const res = await updateSiteSettings(updated);
    if (res.success) {
      setFeedback({
        msg: 'Gambar mockup berhasil disimpan dan langsung aktif di landing page!',
        type: 'success',
      });
    } else {
      setFeedback({ msg: res.error || 'Gagal menyimpan gambar mockup', type: 'error' });
    }
    setSavingMockup(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFeedback(null);
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

        // Simpan langsung ke database agar pengguna tidak perlu tekan Enter
        const updated = { ...form, heroMockupImage: data.url };
        const saveRes = await updateSiteSettings(updated);
        if (saveRes.success) {
          setFeedback({ msg: 'Foto mockup berhasil diunggah dan langsung tersimpan ke website!', type: 'success' });
        } else {
          setFeedback({ msg: 'Foto terunggah tapi gagal disimpan otomatis. Silakan klik tombol Simpan Gambar Mockup.', type: 'error' });
        }
      } else {
        setFeedback({ msg: data.error || 'Gagal mengunggah foto', type: 'error' });
      }
    } catch {
      setFeedback({ msg: 'Terjadi kesalahan saat upload gambar', type: 'error' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleResetDefault = async () => {
    await handleSaveMockup('/mockup-dashboard.png');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const res = await updateSiteSettings(form);
    if (res.success) {
      setFeedback({ msg: 'Semua pengaturan website berhasil disimpan dan langsung aktif di landing page!', type: 'success' });
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

      {/* Hero Section Texts & Highlights */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E0511F]" />
            <CardTitle>Teks & Poin Keunggulan Hero Section</CardTitle>
          </div>
          <CardDescription>
            Pesan pembuka, headline utama, sub-judul, dan poin centang keunggulan pada bagian paling atas website
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

          {/* Poin Centang Keunggulan (Highlights) */}
          <div className="space-y-3 pt-3 border-t border-[#E7E7EE] dark:border-[#232326]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#E0511F] stroke-[2.5]" />
                  <span>Poin Centang Keunggulan di Bawah Tombol CTA</span>
                </label>
                <p className="text-[11px] text-[#71717A] mt-0.5">
                  Poin-poin benefit singkat dengan ikon centang di bawah tombol WhatsApp & Demo kasir.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetHighlights}
                  className="text-xs h-8"
                  title="Kembalikan ke 3 poin bawaan"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  <span>Reset Bawaan</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddHighlight}
                  className="text-xs h-8 text-[#E0511F] border-[#E0511F]/30 hover:bg-[#FFF0EB] dark:hover:bg-[#2B150B]"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  <span>Tambah Poin</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {(form.heroHighlights || []).map((highlight, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FFF0EB] dark:bg-[#2B150B] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#E0511F] stroke-[2.5]" />
                  </div>
                  <Input
                    value={highlight}
                    onChange={(e) => handleHighlightChange(index, e.target.value)}
                    placeholder={`Contoh: Garansi Hardware 1 Tahun`}
                    required
                    className="flex-1 text-xs"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveHighlight(index)}
                    title="Hapus poin"
                    className="h-8 w-8 p-0 text-[#71717A] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Live Visual Preview of Highlights */}
            {form.heroHighlights && form.heroHighlights.length > 0 && (
              <div className="mt-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-[#E7E7EE] dark:border-[#232326]">
                <div className="text-[10px] font-semibold text-[#71717A] mb-1.5 uppercase tracking-wide">
                  Pratinjau Tampilan di Landing Page:
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#525252] dark:text-[#A1A1AA]">
                  {form.heroHighlights.filter(Boolean).map((text, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 font-medium">
                      <Check className="w-3.5 h-3.5 text-[#E0511F] stroke-[2.5]" />
                      <span>{text}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-3 border-t border-[#E7E7EE] dark:border-[#232326] flex items-center justify-between">
          <span className="text-xs text-[#525252] dark:text-[#A1A1AA]">
            {savingHero ? 'Sedang menyimpan teks hero...' : 'Simpan teks dan poin centang hero section di atas.'}
          </span>
          <Button
            type="button"
            onClick={handleSaveHeroOnly}
            disabled={savingHero || loading}
            className="font-bold gap-2 bg-[#E0511F] hover:bg-[#C94213] text-white shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{savingHero ? 'Menyimpan...' : 'Simpan Teks & Poin Hero'}</span>
          </Button>
        </CardFooter>
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
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Input
                placeholder="/mockup-dashboard.png atau https://..."
                value={form.heroMockupImage || ''}
                onChange={(e) => setForm({ ...form, heroMockupImage: e.target.value })}
                className="flex-1"
              />
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#EDF0F4] dark:bg-[#222226] text-[#080808] dark:text-[#FFFFFF] hover:bg-[#E2E6EA] dark:hover:bg-[#2C2C32] transition-colors border border-[#E7E7EE] dark:border-[#232326]">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Mengunggah...' : 'Upload Gambar'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading || savingMockup}
                    className="hidden"
                  />
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetDefault}
                  disabled={savingMockup || uploading}
                  title="Kembalikan ke gambar bawaan dan simpan langsung"
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
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF] flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-[#E0511F]" />
                <span>Pratinjau Jendela :</span>
              </label>
              <span className="text-[11px] text-[#71717A]">
                Tampilan persis seperti yang dilihat pengunjung di Hero landing page
              </span>
            </div>

            <div className="w-full rounded-2xl border border-[#E7E7EE] dark:border-[#232326] overflow-hidden bg-white dark:bg-[#141416] shadow-lg transition-all">
              {/* Full-size Mac Window Header */}
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
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Sistem Kasir Praktis POS Aktif</span>
                </div>
              </div>

              {/* Full-width Image Preview */}
              <div className="relative w-full bg-white dark:bg-[#141416] flex items-center justify-center">
                {form.heroMockupImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.heroMockupImage}
                    alt="Pratinjau Mockup"
                    className="w-full h-auto block object-cover"
                  />
                ) : (
                  <div className="p-12 text-center text-sm text-zinc-400">
                    <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    Belum ada gambar yang dipilih
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-3 border-t border-[#E7E7EE] dark:border-[#232326] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-[#525252] dark:text-[#A1A1AA]">
            {uploading
              ? 'Sedang memproses upload...'
              : savingMockup
              ? 'Sedang menyimpan ke database...'
              : 'Klik tombol simpan jika Anda mengetik URL gambar secara manual.'}
          </span>
          <Button
            type="button"
            onClick={() => handleSaveMockup()}
            disabled={savingMockup || uploading}
            className="font-bold gap-2 bg-[#E0511F] hover:bg-[#C94213] text-white shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{savingMockup ? 'Menyimpan...' : 'Simpan Gambar Mockup'}</span>
          </Button>
        </CardFooter>
      </Card>

      {/* Social Proof Metrics Settings */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#E0511F]" />
              <div>
                <CardTitle>Metrik Nilai & Keunggulan (Social Proof)</CardTitle>
                <CardDescription>
                  Atur 4 kartu angka sorotan dan keunggulan utama di bawah Hero section landing page
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetMetrics}
                className="text-xs h-8"
                title="Kembalikan 4 kartu ke metrik bawaan"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                <span>Reset Default</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddMetric}
                className="text-xs h-8 text-[#E0511F] border-[#E0511F]/30 hover:bg-[#FFF0EB] dark:hover:bg-[#2B150B]"
              >
                <Plus className="w-3 h-3 mr-1" />
                <span>Tambah Kartu</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(form.socialProofMetrics || []).map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#E7E7EE] dark:border-[#232326] bg-zinc-50/60 dark:bg-zinc-900/50 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#E0511F] px-2 py-0.5 rounded-md bg-[#FFF0EB] dark:bg-[#2B150B]">
                    Kartu #{idx + 1}
                  </span>
                  {(form.socialProofMetrics || []).length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMetric(idx)}
                      title="Hapus kartu ini"
                      className="h-7 w-7 p-0 text-[#71717A] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#525252] dark:text-[#A1A1AA]">
                      Angka / Sorotan
                    </label>
                    <Input
                      value={m.number}
                      onChange={(e) => handleMetricChange(idx, 'number', e.target.value)}
                      placeholder="Contoh: Rp 0 / 100%"
                      className="h-8 text-xs font-bold text-[#E0511F]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#525252] dark:text-[#A1A1AA]">
                      Label Judul
                    </label>
                    <Input
                      value={m.label}
                      onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                      placeholder="Contoh: Biaya Bulanan"
                      className="h-8 text-xs font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#525252] dark:text-[#A1A1AA]">
                    Penjelasan Singkat
                  </label>
                  <Textarea
                    rows={2}
                    value={m.desc}
                    onChange={(e) => handleMetricChange(idx, 'desc', e.target.value)}
                    placeholder="Contoh: Sekali beli, bebas biaya sewa atau perpanjangan selamanya"
                    className="text-xs resize-none"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Live Preview */}
          <div className="mt-4 p-4 rounded-xl border border-[#E7E7EE] dark:border-[#232326] bg-white dark:bg-[#111113]">
            <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-3">
              Pratinjau Tampilan di Landing Page:
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {(form.socialProofMetrics || []).map((m, idx) => (
                <div key={idx} className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl font-extrabold text-[#E0511F]">{m.number || '—'}</div>
                  <div className="text-xs sm:text-sm font-bold text-[#000000] dark:text-[#FFFFFF] mt-0.5">{m.label || '—'}</div>
                  <p className="text-[11px] text-[#525252] dark:text-[#A1A1AA] mt-1 leading-relaxed">{m.desc || '—'}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-3 border-t border-[#E7E7EE] dark:border-[#232326] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-[#525252] dark:text-[#A1A1AA]">
            {savingMetrics ? 'Sedang menyimpan metrik...' : 'Simpan perubahan metrik keunggulan di atas.'}
          </span>
          <Button
            type="button"
            onClick={handleSaveMetricsOnly}
            disabled={savingMetrics || loading}
            className="font-bold gap-2 bg-[#E0511F] hover:bg-[#C94213] text-white shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{savingMetrics ? 'Menyimpan...' : 'Simpan Metrik Keunggulan'}</span>
          </Button>
        </CardFooter>
      </Card>

      {/* Target Industries Settings */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-[#E0511F]" />
              <div>
                <CardTitle>Target Industri & Jenis Bisnis (Social Proof)</CardTitle>
                <CardDescription>
                  Atur jenis usaha/industri yang didukung Praktis POS (tampil sebagai lencana pill di bawah 4 metrik keunggulan)
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetIndustries}
                className="text-xs h-8"
                title="Kembalikan daftar industri ke bawaan"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                <span>Reset Default</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddIndustry}
                className="text-xs h-8 text-[#E0511F] border-[#E0511F]/30 hover:bg-[#FFF0EB] dark:hover:bg-[#2B150B]"
              >
                <Plus className="w-3 h-3 mr-1" />
                <span>Tambah Industri</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
              Judul / Teks Pengantar Di Atas Lencana
            </label>
            <Input
              value={form.targetIndustriesTitle || ''}
              onChange={(e) => setForm({ ...form, targetIndustriesTitle: e.target.value })}
              placeholder="Contoh: Dirancang & Teruji untuk Berbagai Jenis Bisnis Retail & UMKM"
              required
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
              Daftar Lencana Industri & Ikon
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(form.targetIndustries || []).map((ind, idx) => {
                const CurrentIcon = getIndustryIcon(ind.iconName);
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-[#E7E7EE] dark:border-[#232326] bg-zinc-50/60 dark:bg-zinc-900/50 flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#525252] dark:text-[#A1A1AA] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#E0511F]" />
                        <span>Industri #{idx + 1}</span>
                      </span>
                      {(form.targetIndustries || []).length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveIndustry(idx)}
                          title="Hapus industri ini"
                          className="h-7 w-7 p-0 text-[#71717A] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg bg-white dark:bg-zinc-800 border border-[#E7E7EE] dark:border-[#232326] flex items-center justify-center shrink-0 text-[#E0511F]">
                        <CurrentIcon className="w-4 h-4" />
                      </div>
                      <Input
                        value={ind.name}
                        onChange={(e) => handleIndustryChange(idx, 'name', e.target.value)}
                        placeholder="Contoh: Minimarket & Kelontong"
                        className="h-9 text-xs flex-1"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-[11px] text-[#71717A] shrink-0">Ikon:</label>
                      <select
                        value={ind.iconName}
                        onChange={(e) => handleIndustryChange(idx, 'iconName', e.target.value)}
                        className="h-8 text-xs w-full rounded-md border border-[#E7E7EE] dark:border-[#232326] bg-white dark:bg-zinc-800 px-2 text-[#000000] dark:text-[#FFFFFF]"
                      >
                        {INDUSTRY_ICON_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label} ({opt.value})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Preview */}
          <div className="mt-4 p-4 rounded-xl border border-[#E7E7EE] dark:border-[#232326] bg-white dark:bg-[#111113]">
            <p className="text-center text-xs font-semibold text-[#525252] dark:text-[#A1A1AA] uppercase tracking-wider mb-4">
              {form.targetIndustriesTitle || 'Dirancang & Teruji untuk Berbagai Jenis Bisnis Retail & UMKM'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {(form.targetIndustries || []).map((ind, idx) => {
                const Icon = getIndustryIcon(ind.iconName);
                return (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E7E7EE] dark:border-[#232326] bg-[#FDFDFD] dark:bg-[#18181B] text-xs font-medium text-[#000000] dark:text-[#E4E4E7] shadow-2xs"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#E0511F]" />
                    <span>{ind.name || '—'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-3 border-t border-[#E7E7EE] dark:border-[#232326] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-[#525252] dark:text-[#A1A1AA]">
            {savingIndustries ? 'Sedang menyimpan target industri...' : 'Simpan perubahan daftar industri & jenis bisnis di atas.'}
          </span>
          <Button
            type="button"
            onClick={handleSaveIndustriesOnly}
            disabled={savingIndustries || loading}
            className="font-bold gap-2 bg-[#E0511F] hover:bg-[#C94213] text-white shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{savingIndustries ? 'Menyimpan...' : 'Simpan Target Industri'}</span>
          </Button>
        </CardFooter>
      </Card>

      {/* Hardware Section Header Settings */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#E0511F]" />
              <div>
                <CardTitle>Header Paket Hardware (What's In The Box)</CardTitle>
                <CardDescription>
                  Atur teks lencana, judul headline, dan deskripsi pengantar pada section paket perangkat kasir di landing page
                </CardDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetHardware}
              className="text-xs h-8"
              title="Kembalikan teks header hardware ke bawaan"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              <span>Reset Default</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-1">
              <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                Badge Pill / Label Atas
              </label>
              <Input
                value={form.hardwarePill || ''}
                onChange={(e) => setForm({ ...form, hardwarePill: e.target.value })}
                placeholder="Contoh: What's In The Box"
                required
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                Judul Utama Headline
              </label>
              <Input
                value={form.hardwareHeadline || ''}
                onChange={(e) => setForm({ ...form, hardwareHeadline: e.target.value })}
                placeholder="Contoh: 1 Paket Lengkap Mesin Kasir Praktis POS"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
              Deskripsi Subtitle
            </label>
            <Textarea
              rows={2}
              value={form.hardwareSubtitle || ''}
              onChange={(e) => setForm({ ...form, hardwareSubtitle: e.target.value })}
              placeholder="Contoh: Semua perangkat yang Anda butuhkan untuk operasional toko sudah tersedia dalam satu paket..."
              required
            />
          </div>

          {/* Live Visual Preview */}
          <div className="mt-4 p-6 rounded-xl border border-[#E7E7EE] dark:border-[#232326] bg-[#FDFDFD] dark:bg-[#0B0B0C] text-center">
            <div className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider mb-3 text-left">
              Pratinjau Tampilan Header di Landing Page:
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] text-xs font-bold uppercase tracking-wider mb-3">
              {form.hardwarePill || "What's In The Box"}
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#000000] dark:text-[#FFFFFF] tracking-tight">
              {form.hardwareHeadline || '1 Paket Lengkap Mesin Kasir Praktis POS'}
            </h3>
            <p className="mt-2 text-sm text-[#525252] dark:text-[#A1A1AA] max-w-2xl mx-auto">
              {form.hardwareSubtitle ||
                'Semua perangkat yang Anda butuhkan untuk operasional toko sudah tersedia dalam satu paket. Buka dus, colok kabel, dan langsung siap transaksi.'}
            </p>
          </div>
        </CardContent>

        <CardFooter className="pt-3 border-t border-[#E7E7EE] dark:border-[#232326] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-[#525252] dark:text-[#A1A1AA]">
            {savingHardware ? 'Sedang menyimpan header hardware...' : 'Simpan teks judul dan deskripsi What\'s In The Box di atas.'}
          </span>
          <Button
            type="button"
            onClick={handleSaveHardwareOnly}
            disabled={savingHardware || loading}
            className="font-bold gap-2 bg-[#E0511F] hover:bg-[#C94213] text-white shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{savingHardware ? 'Menyimpan...' : 'Simpan Header Hardware'}</span>
          </Button>
        </CardFooter>
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
