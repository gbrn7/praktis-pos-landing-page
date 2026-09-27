'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
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
import { saveFaq, deleteFaq } from './actions';

interface FaqItemData {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: number;
}

interface Props {
  initialFaqs: FaqItemData[];
}

export const FaqsManager: React.FC<Props> = ({ initialFaqs }) => {
  const [faqs, setFaqs] = useState<FaqItemData[]>(initialFaqs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    question: '',
    answer: '',
    isActive: 1,
  });

  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const openAddDialog = () => {
    setIsEditing(false);
    setEditingId('');
    setFormData({
      id: `faq-${Date.now()}`,
      question: '',
      answer: '',
      isActive: 1,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (faq: FaqItemData) => {
    setIsEditing(true);
    setEditingId(faq.id);
    setFormData({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.id) return;

    const res = await saveFaq(formData);

    if (res.success) {
      setFeedback({ msg: 'FAQ berhasil disimpan!', type: 'success' });
      setIsDialogOpen(false);

      if (isEditing) {
        setFaqs((prev) =>
          prev.map((f) => (f.id === editingId ? { ...f, ...formData } : f))
        );
      } else {
        setFaqs((prev) => [...prev, { ...formData, displayOrder: prev.length + 1 }]);
      }
    } else {
      setFeedback({ msg: res.error || 'Gagal menyimpan FAQ', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pertanyaan FAQ ini?')) return;
    const res = await deleteFaq(id);
    if (res.success) {
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      setFeedback({ msg: 'FAQ berhasil dihapus', type: 'success' });
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
            <CardTitle>Daftar Pertanyaan yang Sering Diajukan</CardTitle>
            <CardDescription>
              Pertanyaan & jawaban umum yang ditampilkan pada accordion section FAQ
            </CardDescription>
          </div>
          <Button onClick={openAddDialog} className="font-bold gap-2 self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            <span>Tambah FAQ</span>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                <TableHead>Pertanyaan</TableHead>
                <TableHead className="hidden md:table-cell">Jawaban</TableHead>
                <TableHead className="w-24 text-center">Status</TableHead>
                <TableHead className="w-24 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.map((faq, idx) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-mono text-xs text-[#71717A]">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="font-bold text-[#000000] dark:text-[#FFFFFF] max-w-sm">
                    <div>{faq.question}</div>
                    <div className="text-[11px] text-[#71717A] font-mono">ID: {faq.id}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-[#525252] dark:text-[#A1A1AA] max-w-md truncate">
                    {faq.answer}
                  </TableCell>
                  <TableCell className="text-center">
                    {faq.isActive === 1 ? (
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
                        onClick={() => openEditDialog(faq)}
                        className="h-8 w-8 text-[#525252] hover:text-[#000000] dark:hover:text-[#FFFFFF]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(faq.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit FAQ' : 'Tambah FAQ Baru'}</DialogTitle>
            <DialogDescription>
              Tulis pertanyaan yang sering ditanyakan calon pembeli dan jawaban solutifnya.
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

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                Pertanyaan
              </label>
              <Input
                placeholder="Contoh: Apakah mesin kasir ini memerlukan internet setiap saat?"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                Jawaban Lengkap
              </label>
              <Textarea
                rows={4}
                placeholder="Tulis jawaban lengkap dan jelas..."
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                required
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="font-bold">
                Simpan FAQ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
