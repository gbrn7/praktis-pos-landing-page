import React from 'react';
import { ShoppingCart, Wallet, ArrowUpRight, TrendingUp, CheckCircle2 } from 'lucide-react';
import logoIcon from '../assets/img/Logo.png';

export const MockupPreview: React.FC = () => {
  return (
    <div className="w-full bg-[#FFFFFF] rounded-2xl border border-[#E7E7EE] shadow-xl overflow-hidden transition-all duration-300">
      {/* Window header */}
      <div className="bg-[#F8F9FA] px-4 py-3 border-b border-[#E7E7EE] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          <span className="ml-2 text-xs font-medium text-[#525252] hidden sm:inline">praktispos.app/dashboard</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#000000]">
          <img src={logoIcon} alt="Praktis POS" className="w-4 h-4 object-contain" />
          <span>Sistem Kasir Praktis POS Aktif</span>
        </div>
      </div>

      {/* Mockup Dashboard Body */}
      <div className="p-4 sm:p-6 bg-[#FFFFFF] space-y-5">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Omzet Hari Ini */}
          <div className="p-4 rounded-xl border border-[#E7E7EE] bg-[#FDFDFD]">
            <div className="flex items-center justify-between text-xs font-medium text-[#525252]">
              <span>Omzet Hari Ini</span>
              <div className="w-6 h-6 rounded-md bg-[#FFF0EB] flex items-center justify-center text-[#E0511F]">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-bold text-[#000000]">Rp 4.850.000</div>
            <div className="mt-1 flex items-center text-xs font-medium text-[#E0511F]">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              <span>42 Transaksi Selesai</span>
            </div>
          </div>

          {/* Dompet Modal (Capital Wallet) */}
          <div className="p-4 rounded-xl border border-[#E7E7EE] bg-[#FDFDFD]">
            <div className="flex items-center justify-between text-xs font-medium text-[#525252]">
              <span>Dompet Modal (Kulakan)</span>
              <div className="w-6 h-6 rounded-md bg-[#EDF0F4] flex items-center justify-center text-[#525252]">
                <Wallet className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-bold text-[#000000]">Rp 3.200.000</div>
            <div className="mt-1 flex items-center text-xs font-medium text-[#525252]">
              <span>Aman & Terkunci untuk Restock</span>
            </div>
          </div>

          {/* Dompet Profit (Bersih Siap Tarik) */}
          <div className="p-4 rounded-xl border border-[#E0511F]/30 bg-[#FFF0EB]/40">
            <div className="flex items-center justify-between text-xs font-semibold text-[#E0511F]">
              <span>Dompet Profit (Laba Bersih)</span>
              <div className="w-6 h-6 rounded-md bg-[#FFF0EB] flex items-center justify-center text-[#E0511F]">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-bold text-[#E0511F]">Rp 1.650.000</div>
            <div className="mt-1 flex items-center text-xs font-semibold text-[#000000]">
              <span>Siap Dicairkan Pemilik Toko</span>
            </div>
          </div>
        </div>

        {/* Live POS Transaction Feed Preview */}
        <div className="rounded-xl border border-[#E7E7EE] overflow-hidden">
          <div className="bg-[#F8F9FA] px-4 py-2.5 text-xs font-semibold text-[#000000] flex justify-between items-center">
            <span>Transaksi Kasir Real-time Terkini</span>
            <span className="text-[11px] font-normal text-[#525252]">Cetak Struk Otomatis</span>
          </div>
          <div className="divide-y divide-[#E7E7EE] text-xs">
            <div className="p-3 flex items-center justify-between hover:bg-[#FDFDFD] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFF0EB] flex items-center justify-center text-[#E0511F]">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-[#000000]">INV-20260926-042</div>
                  <div className="text-[11px] text-[#525252]">3 Barang • Kasir: Budi • QRIS</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#000000]">Rp 145.000</div>
                <div className="text-[11px] text-[#E0511F] font-medium">+Rp 45.000 Profit</div>
              </div>
            </div>

            <div className="p-3 flex items-center justify-between hover:bg-[#FDFDFD] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EDF0F4] flex items-center justify-center text-[#080808]">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-[#000000]">INV-20260926-041</div>
                  <div className="text-[11px] text-[#525252]">5 Barang • Kasir: Siti • Tunai</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#000000]">Rp 320.000</div>
                <div className="text-[11px] text-[#E0511F] font-medium">+Rp 95.000 Profit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
