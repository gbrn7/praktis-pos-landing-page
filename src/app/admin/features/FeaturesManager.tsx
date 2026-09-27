'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  Wallet,
  Barcode,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { saveFeature, deleteFeature } from './actions';

interface FeatureItemData {
  id: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  badge: string | null;
  benefits: string; // JSON string
  displayOrder: number;
  isActive: number;
}

interface Props {
  initialFeatures: FeatureItemData[];
}

export const FeaturesManager: React.FC<Props> = ({ initialFeatures }) => {
  const [features, setFeatures] = useState<FeatureItemData[]>(initialFeatures);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    tagline: '',
    description: '',
    iconName: 'ShoppingCart',
    badge: '',
    benefitsText: '',
    isActive: 1,
  });

  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'ShoppingCart': return ShoppingCart;
      case 'Wallet': return Wallet;
      case 'Barcode': return Barcode;
      case 'TrendingUp': return TrendingUp;
      default: return ShoppingCart;
    }
  };

  const openAddDialog = () => {
    setIsEditing(false);
    setEditingId('');
    setFormData({
      id: `fitur-${Date.now()}`,
      title: '',
      tagline: '',
      description: '',
      iconName: 'ShoppingCart',
      badge: '',
      benefitsText: 'Benefit 1\nBenefit 2\nBenefit 3',
      isActive: 1,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (feature: FeatureItemData) => {
    setIsEditing(true);
    setEditingId(feature.id);
    let parsedBenefits: string[] = [];
    try {
      parsedBenefits = JSON.parse(feature.benefits);
    } catch {
      parsedBenefits = [];
    }

    setFormData({
      id: feature.id,
      title: feature.title,
      tagline: feature.tagline,
      description: feature.description,
      iconName: feature.iconName,
      badge: feature.badge || '',
      benefitsText: parsedBenefits.join('\n'),
      isActive: feature.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.id) return;

    const benefitsArray = formData.benefitsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      id: formData.id,
      title: formData.title,
      tagline: formData.tagline,
      description: formData.description,
      iconName: formData.iconName,
      badge: formData.badge ? formData.badge.trim() : null,
      benefits: benefitsArray,
      isActive: formData.isActive,
    };

    const res = await saveFeature(payload);

    if (res.success) {
      setFeedback({ msg: 'Fitur kasir berhasil disimpan!', type: 'success' });
      setIsDialogOpen(false);

      const updatedItem: FeatureItemData = {
        ...payload,
        badge: payload.badge,
        benefits: JSON.stringify(benefitsArray),
        displayOrder: 1,
      };

      if (isEditing) {
        setFeatures((prev) =>
          prev.map((f) => (f.id === editingId ? { ...f, ...updatedItem } : f))
        );
      } else {
        setFeatures((prev) => [...prev, updatedItem]);
      }
    } else {
      setFeedback({ msg: res.error || 'Gagal menyimpan fitur', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus fitur ini?')) return;
    const res = await deleteFeature(id);
    if (res.success) {
      setFeatures((prev) => prev.filter((f) => f.id !== id));
      setFeedback({ msg: 'Fitur berhasil dihapus', type: 'success' });
    }
  };

  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Daftar Fitur Software Unggulan</CardTitle>
            <CardDescription>
              Fitur-fitur utama kasir yang ditampilkan pada section Feature Grid
            </CardDescription>
          </div>
          <Button onClick={openAddDialog} className="font-bold gap-2 self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            <span>Tambah Fitur</span>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Ikon</TableHead>
                <TableHead>Nama Fitur</TableHead>
                <TableHead>Tagline</TableHead>
                <TableHead className="hidden md:table-cell">Badge</TableHead>
                <TableHead className="w-24 text-center">Status</TableHead>
                <TableHead className="w-24 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => {
                const IconComponent = getIcon(feature.iconName);
                return (
                  <TableRow key={feature.id}>
                    <TableCell>
                      <div className="w-10 h-10 rounded-lg bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] flex items-center justify-center">
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-[#000000] dark:text-[#FFFFFF]">
                      <div>{feature.title}</div>
                      <div className="text-[11px] text-[#71717A] font-mono">ID: {feature.id}</div>
                    </TableCell>
                    <TableCell className="text-xs text-[#525252] dark:text-[#A1A1AA]">
                      {feature.tagline}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {feature.badge ? (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F]">
                          {feature.badge}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {feature.isActive === 1 ? (
                        <span className="text-[11px] font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-full">
                          Aktif
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                          Nonaktif
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(feature)}
                          className="h-8 w-8 text-[#525252] hover:text-[#000000] dark:hover:text-[#FFFFFF]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(feature.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Fitur' : 'Tambah Fitur Baru'}</DialogTitle>
            <DialogDescription>
              Lengkapi deskripsi dan poin-poin keuntungan fitur software.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                  ID Unik (Slug)
                </label>
                <Input
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  disabled={isEditing}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                  Badge Label (Opsional)
                </label>
                <Input
                  placeholder="Contoh: Fitur Finansial Unik"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                Judul Fitur
              </label>
              <Input
                placeholder="Contoh: Pemisah Kas Modal & Kas Profit"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                Tagline Singkat
              </label>
              <Input
                placeholder="Contoh: Uang Modal Aman, Laba Bersih Pasti"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                Deskripsi Fitur
              </label>
              <Textarea
                rows={3}
                placeholder="Jelaskan bagaimana fitur ini membantu pemilik toko..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                  Pilih Ikon
                </label>
                <select
                  value={formData.iconName}
                  onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                  className="flex h-9 w-full rounded-lg border border-[#E7E7EE] dark:border-[#232326] bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  <option value="ShoppingCart">ShoppingCart (Kasir)</option>
                  <option value="Wallet">Wallet (Dual-Wallet / Keuangan)</option>
                  <option value="Barcode">Barcode (Inventori & Cetak Barcode)</option>
                  <option value="TrendingUp">TrendingUp (Laporan & HPP)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                  Status Tampil
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: Number(e.target.value) })}
                  className="flex h-9 w-full rounded-lg border border-[#E7E7EE] dark:border-[#232326] bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  <option value={1}>Aktif</option>
                  <option value={0}>Nonaktif</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                Daftar Keuntungan / Benefit (1 baris per poin)
              </label>
              <Textarea
                rows={4}
                value={formData.benefitsText}
                onChange={(e) => setFormData({ ...formData, benefitsText: e.target.value })}
                placeholder="Pemisahan otomatis kas modal vs laba..."
                required
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="font-bold">
                Simpan Fitur
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
