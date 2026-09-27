'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Tablet,
  Printer,
  ScanBarcode,
  ShieldCheck,
  Cpu,
  Plus,
  Edit2,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Gift,
  ImageIcon,
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
import {
  saveHardwareItem,
  deleteHardwareItem,
  addHardwareBonus,
  deleteHardwareBonus,
} from './actions';

interface HardwareItem {
  id: string;
  name: string;
  category: string;
  spec: string;
  description: string;
  iconName: string;
  imageUrl: string | null;
  displayOrder: number;
  isActive: number;
}

interface BonusItem {
  id: number;
  text: string;
  displayOrder: number;
}

interface Props {
  initialItems: HardwareItem[];
  initialBonuses: BonusItem[];
}

export const HardwareManager: React.FC<Props> = ({ initialItems, initialBonuses }) => {
  const [items, setItems] = useState<HardwareItem[]>(initialItems);
  const [bonuses, setBonuses] = useState<BonusItem[]>(initialBonuses);
  const [newBonusText, setNewBonusText] = useState('');

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    spec: '',
    description: '',
    iconName: 'Tablet',
    imageUrl: '' as string | null,
    isActive: 1,
  });

  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Tablet': return Tablet;
      case 'Printer': return Printer;
      case 'ScanBarcode': return ScanBarcode;
      case 'ShieldCheck': return ShieldCheck;
      case 'Cpu': return Cpu;
      default: return Tablet;
    }
  };

  const openAddDialog = () => {
    setIsEditing(false);
    setEditingId('');
    setFormData({
      id: `item-${Date.now()}`,
      name: '',
      category: '',
      spec: '',
      description: '',
      iconName: 'Tablet',
      imageUrl: null,
      isActive: 1,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: HardwareItem) => {
    setIsEditing(true);
    setEditingId(item.id);
    setFormData({
      id: item.id,
      name: item.name,
      category: item.category,
      spec: item.spec,
      description: item.description,
      iconName: item.iconName,
      imageUrl: item.imageUrl,
      isActive: item.isActive,
    });
    setIsDialogOpen(true);
  };

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
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
        setFeedback({ msg: 'Foto berhasil diunggah ke server!', type: 'success' });
      } else {
        setFeedback({ msg: data.error || 'Gagal mengunggah foto', type: 'error' });
      }
    } catch {
      setFeedback({ msg: 'Terjadi kesalahan saat upload', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.id) return;

    const res = await saveHardwareItem(formData);
    if (res.success) {
      setFeedback({ msg: 'Perangkat kasir berhasil disimpan!', type: 'success' });
      setIsDialogOpen(false);

      if (isEditing) {
        setItems((prev) => prev.map((it) => (it.id === editingId ? { ...it, ...formData } : it)));
      } else {
        setItems((prev) => [...prev, { ...formData, displayOrder: prev.length + 1 }]);
      }
    } else {
      setFeedback({ msg: res.error || 'Gagal menyimpan perangkat', type: 'error' });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus perangkat ini?')) return;
    const res = await deleteHardwareItem(id);
    if (res.success) {
      setItems((prev) => prev.filter((it) => it.id !== id));
      setFeedback({ msg: 'Perangkat berhasil dihapus', type: 'success' });
    }
  };

  const handleAddBonus = async () => {
    if (!newBonusText.trim()) return;
    const res = await addHardwareBonus(newBonusText);
    if (res.success) {
      setBonuses((prev) => [...prev, { id: Date.now(), text: newBonusText.trim(), displayOrder: prev.length + 1 }]);
      setNewBonusText('');
      setFeedback({ msg: 'Bonus berhasil ditambahkan!', type: 'success' });
    }
  };

  const handleDeleteBonus = async (id: number) => {
    const res = await deleteHardwareBonus(id);
    if (res.success) {
      setBonuses((prev) => prev.filter((b) => b.id !== id));
      setFeedback({ msg: 'Bonus berhasil dihapus', type: 'success' });
    }
  };

  return (
    <div className="space-y-8">
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

      {/* Hardware Items Table Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Daftar Perangkat Kasir (What's in the Box)</CardTitle>
            <CardDescription>
              Item hardware yang disertakan dalam paket mesin kasir Praktis POS
            </CardDescription>
          </div>
          <Button onClick={openAddDialog} className="font-bold gap-2 self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            <span>Tambah Perangkat</span>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Ikon / Foto</TableHead>
                <TableHead>Nama Perangkat</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="hidden md:table-cell">Spesifikasi</TableHead>
                <TableHead className="w-24 text-center">Status</TableHead>
                <TableHead className="w-24 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const IconComponent = getIcon(item.iconName);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.imageUrl ? (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#E7E7EE] dark:border-[#232326]">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] flex items-center justify-center">
                          <IconComponent className="w-5 h-5" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-bold text-[#000000] dark:text-[#FFFFFF]">
                      <div>{item.name}</div>
                      <div className="text-[11px] text-[#71717A] font-mono">ID: {item.id}</div>
                    </TableCell>
                    <TableCell className="text-xs text-[#525252] dark:text-[#A1A1AA]">
                      {item.category}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-[#525252] dark:text-[#A1A1AA] max-w-xs truncate">
                      {item.spec}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.isActive === 1 ? (
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
                          onClick={() => openEditDialog(item)}
                          className="h-8 w-8 text-[#525252] hover:text-[#000000] dark:hover:text-[#FFFFFF]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
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

      {/* Starter Kit Bonus Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#E0511F]" />
            <CardTitle>Bonus Spesial Starter Kit</CardTitle>
          </div>
          <CardDescription>
            Poin bonus gratis yang ditampilkan pada kartu spesial promo hardware
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Tulis bonus baru, contoh: Gratis 10 Roll Kertas Struk..."
              value={newBonusText}
              onChange={(e) => setNewBonusText(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddBonus} className="font-semibold gap-1.5 shrink-0">
              <Plus className="w-4 h-4" />
              <span>Tambah Bonus</span>
            </Button>
          </div>

          <div className="space-y-2 pt-2">
            {bonuses.map((bonus) => (
              <div
                key={bonus.id}
                className="flex items-center justify-between p-3 rounded-xl border border-[#E7E7EE] dark:border-[#232326] bg-[#FDFDFD] dark:bg-[#18181B] text-xs sm:text-sm text-[#000000] dark:text-[#FFFFFF]"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E0511F] shrink-0" />
                  <span className="truncate">{bonus.text}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteBonus(bonus.id)}
                  className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Perangkat Kasir' : 'Tambah Perangkat Kasir'}
            </DialogTitle>
            <DialogDescription>
              Isi data detail spesifikasi perangkat dan unggah foto produk jika tersedia.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveItem} className="space-y-4 pt-2">
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
                  Kategori
                </label>
                <Input
                  placeholder="Contoh: Pencetak Struk"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                Nama Perangkat
              </label>
              <Input
                placeholder="Contoh: Printer Thermal 80mm Autocutter"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                Ringkasan Spesifikasi
              </label>
              <Input
                placeholder="Contoh: Kecepatan 90mm/detik, koneksi Bluetooth + USB"
                value={formData.spec}
                onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                Deskripsi Lengkap
              </label>
              <Textarea
                placeholder="Deskripsi fungsi dan keuntungan perangkat..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                  Pilih Ikon Default
                </label>
                <select
                  value={formData.iconName}
                  onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                  className="flex h-9 w-full rounded-lg border border-[#E7E7EE] dark:border-[#232326] bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  <option value="Tablet">Tablet (Layar Kasir)</option>
                  <option value="Printer">Printer (Pencetak Struk)</option>
                  <option value="ScanBarcode">ScanBarcode (Scanner)</option>
                  <option value="ShieldCheck">ShieldCheck (Laci Kasir)</option>
                  <option value="Cpu">Cpu (Software & Otomasi)</option>
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
                  <option value={1}>Aktif (Ditampilkan)</option>
                  <option value={0}>Nonaktif (Disembunyikan)</option>
                </select>
              </div>
            </div>

            {/* Local Image Upload Section */}
            <div className="space-y-2 pt-2 border-t border-[#E7E7EE] dark:border-[#232326]">
              <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF] flex items-center justify-between">
                <span>Foto Produk Lokal (Opsional)</span>
                {formData.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: null })}
                    className="text-[11px] text-red-500 hover:underline cursor-pointer"
                  >
                    Hapus Foto (Gunakan Ikon)
                  </button>
                )}
              </label>

              {formData.imageUrl ? (
                <div className="flex items-center gap-4 p-3 rounded-xl border border-[#E7E7EE] dark:border-[#232326] bg-[#FDFDFD] dark:bg-[#18181B]">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                    <Image
                      src={formData.imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#000000] dark:text-[#FFFFFF] truncate">
                      {formData.imageUrl}
                    </p>
                    <p className="text-[11px] text-green-600 dark:text-green-400 mt-0.5">
                      Foto tersimpan di public/uploads
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed border-[#E0511F]/50 bg-[#FFF0EB]/30 dark:bg-[#2B150B]/30 text-xs font-semibold text-[#E0511F] hover:bg-[#FFF0EB]/60 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? 'Mengunggah...' : 'Pilih File Gambar'}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-[#71717A]">
                    PNG, JPG, WEBP maks. 5MB
                  </span>
                </div>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="font-bold">
                Simpan Perangkat
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
