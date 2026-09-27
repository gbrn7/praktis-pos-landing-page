'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import logoLight from '@/assets/img/Logo-with-text-white-bg.png';
import logoDark from '@/assets/img/Logo-with-text-dark-bg.png';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login gagal, periksa username dan password Anda.');
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Terjadi kendala koneksi ke server.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] dark:bg-[#0B0B0C] px-4 py-12 transition-colors duration-200">
      <div className="w-full max-w-md">
        <Card className="border border-[#E7E7EE] dark:border-[#232326] shadow-xl bg-white dark:bg-[#141416]">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-3">
              <Image
                src={logoLight}
                alt="Praktis POS"
                height={44}
                width={160}
                className="h-10 w-auto object-contain dark:hidden"
                priority
              />
              <Image
                src={logoDark}
                alt="Praktis POS"
                height={44}
                width={160}
                className="h-10 w-auto object-contain hidden dark:block"
                priority
              />
            </div>
            <div className="inline-flex items-center gap-1 mx-auto px-2.5 py-0.5 rounded-full bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] text-xs font-bold mb-2">
              CMS Portal Admin
            </div>
            <CardTitle className="text-xl font-extrabold tracking-tight">Login Administrator</CardTitle>
            <CardDescription>
              Masuk untuk mengelola konten landing page & visibilitas section
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#525252] dark:text-[#A1A1AA]" />
                  <span>Username</span>
                </label>
                <Input
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#525252] dark:text-[#A1A1AA]" />
                  <span>Password</span>
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

            </CardContent>

            <CardFooter className="pt-2">
              <Button type="submit" className="w-full h-10 font-bold" disabled={loading}>
                {loading ? (
                  <span>Memproses...</span>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
