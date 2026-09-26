import { PackageDetail } from '../types';

export const PACKAGE_DATA: PackageDetail = {
  title: 'Paket Komplit Mesin Kasir Super POS',
  tagline: '1 Set Hardware Kasir Premium + Software Seumur Hidup Siap Pakai',
  priceNote: 'Sekali Beli • Tanpa Biaya Langganan Bulanan • Hak Milik Seumur Hidup',
  hardwareList: [
    {
      id: 'terminal',
      name: 'Terminal Kasir Touchscreen / Tablet Stand',
      category: 'Display & Komputasi',
      spec: 'Layar responsif tajam, stand metal kokoh anti goyang, hemat daya',
      description: 'Perangkat kasir siap pakai dengan performa stabil untuk melayani transaksi padat seharian.',
      iconName: 'Tablet',
    },
    {
      id: 'printer',
      name: 'Printer Thermal Struk 58mm / 80mm',
      category: 'Pencetak Struk',
      spec: 'Kecepatan cetak 90mm/detik, koneksi USB/Bluetooth, tanpa tinta (thermal)',
      description: 'Format cetak struk retro ala minimarket/Indomaret yang rapi, cepat, dan jelas.',
      iconName: 'Printer',
    },
    {
      id: 'scanner',
      name: 'Barcode Scanner Laser Responsif',
      category: 'Input Cepat',
      spec: 'Sensitivitas tinggi, auto-sensing barcode 1D/2D pada kemasan produk & layar HP',
      description: 'Pindai barcode barang tanpa jeda, memangkas antrean kasir hingga 70%.',
      iconName: 'ScanBarcode',
    },
    {
      id: 'drawer',
      name: 'Laci Uang Kasir Otomatis (Cash Drawer)',
      category: 'Keamanan Uang',
      spec: 'Bodi baja kokoh, 4 slot uang kertas + 5 slot koin, konektor RJ-11',
      description: 'Laci terbuka otomatis setiap kali transaksi kasir selesai dicetak struknya.',
      iconName: 'ShieldCheck',
    },
    {
      id: 'software',
      name: 'Software Super POS Lisensi Lifetime',
      category: 'Sistem Kasir & Keuangan',
      spec: 'Lisensi seumur hidup, multi-user kasir, database lokal & cloud sync',
      description: 'Lengkap dengan modul pemisah Kas Modal & Kas Profit, HPP, cetak barcode, dan retur barang.',
      iconName: 'Cpu',
    },
  ],
  bonuses: [
    'Gratis 5 Roll Kertas Thermal Struk Kualitas Tinggi',
    'Gratis Jasa Instalasi & Setting Driver Sebelum Barang Dikirim',
    'Gratis Input 100 Data Produk Awal Toko Anda',
    'Video Tutorial Lengkap & Panduan Bahasa Indonesia',
  ],
  guarantees: [
    'Garansi Resmi Hardware 1 Tahun',
    'Bantuan Teknis & Konsultasi Langsung via WhatsApp',
    '100% Bebas Biaya Langganan Bulanan atau Tahunan',
  ],
  waTemplate: 'Halo tim Super POS, saya tertarik dengan Paket Komplit Mesin Kasir Siap Pakai. Mohon informasi ketersediaan paket dan cara pemesanannya. Terima kasih!',
};

export const WHATSAPP_NUMBER = '6281234567890';
export const LIVE_DEMO_URL = 'http://localhost:8000';
