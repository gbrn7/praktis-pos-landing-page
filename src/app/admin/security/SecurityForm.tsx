'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, Shield, KeyRound, User } from 'lucide-react';
import { updateAdminCredentials } from './actions';

interface Props {
  currentUsername: string;
}

export const SecurityForm: React.FC<Props> = ({ currentUsername }) => {
  const [username, setUsername] = useState(currentUsername);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!currentPassword) {
      setFeedback({ msg: 'Password saat ini wajib diisi untuk verifikasi keamanan.', type: 'error' });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setFeedback({ msg: 'Konfirmasi password baru tidak cocok.', type: 'error' });
      return;
    }

    setLoading(true);

    const res = await updateAdminCredentials({
      currentPassword,
      newUsername: username !== currentUsername ? username : undefined,
      newPassword: newPassword || undefined,
    });

    if (res.success) {
      setFeedback({ msg: 'Kredensial akun berhasil diperbarui!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setFeedback({ msg: res.error || 'Gagal memperbarui kredensial.', type: 'error' });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-center gap-3 mb-6 transition-all ${
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
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#E0511F]" />
            <CardTitle>Keamanan Akun Admin</CardTitle>
          </div>
          <CardDescription>
            Ubah username atau kata sandi akun administrator CMS Praktis POS.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#525252]" />
                <span>Username Admin</span>
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="pt-2 border-t border-[#E7E7EE] dark:border-[#232326] space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#525252]" />
                  <span>Password Saat Ini (Wajib)</span>
                </label>
                <Input
                  type="password"
                  placeholder="Masukkan password saat ini untuk konfirmasi"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                    Password Baru (Opsional)
                  </label>
                  <Input
                    type="password"
                    placeholder="Kosongkan jika tidak ingin ganti"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">
                    Ulangi Password Baru
                  </label>
                  <Input
                    type="password"
                    placeholder="Ulangi password baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t border-[#E7E7EE] dark:border-[#232326] flex justify-end">
            <Button type="submit" disabled={loading} className="font-bold">
              {loading ? 'Menyimpan...' : 'Perbarui Kredensial'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
