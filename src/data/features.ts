import { FeatureItem } from '../types';

export const CORE_FEATURES: FeatureItem[] = [
  {
    id: 'pos-cashier',
    title: 'Transaksi Kasir Cepat & Struk Minimarket',
    tagline: 'Layanan Kilat, Struk Rapi, Tanpa Antre',
    description: 'Pilihan mode tampilan ganda (Grid Gambar atau List Kasir Grosir). Dukungan barcode scan instan, diskon per item/total, multi-pembayaran QRIS & tunai, serta struk thermal retro monospace.',
    benefits: [
      'Mode tampilan grid foto atau tabel kasir super cepat',
      'Cetak struk thermal retro monospace ala minimarket',
      'Multi metode bayar: Tunai, QRIS, Transfer Bank',
      'Peringatan otomatis jika stok barang tidak mencukupi',
    ],
    iconName: 'ShoppingCart',
    badge: 'Transaksi Cepat',
  },
  {
    id: 'dual-wallet',
    title: 'Pemisah Kas Modal & Kas Profit',
    tagline: 'Uang Modal Aman, Laba Bersih Pasti',
    description: 'Satu-satunya sistem kasir yang secara otomatis memisahkan uang kulakan (modal) dan keuntungan bersih di setiap transaksi. Mencegah uang modal terpakai untuk belanja pribadi.',
    benefits: [
      'Pemisahan otomatis kas modal vs kas laba pada setiap struk',
      'Tahu pasti berapa dividen/keuntungan yang aman diambil pemilik',
      'Catat suntikan modal (inject) dan tarik modal (drawdown)',
      'Laporan mutasi dompet transparan dan bisa diexport ke Excel',
    ],
    iconName: 'Wallet',
    badge: 'Fitur Finansial Unik',
  },
  {
    id: 'inventory-barcode',
    title: 'Manajemen Stok & Cetak Barcode Mandiri',
    tagline: 'Stok Terkendali, Label Barcode Sekali Klik',
    description: 'Kelola ribuan produk dengan mudah. Cetak stiker barcode produk langsung dari aplikasi tanpa software tambahan, dapatkan notifikasi stok menipis, dan import massal via Excel.',
    benefits: [
      'Cetak label barcode langsung untuk ditempel ke produk',
      'Peringatan otomatis saat stok barang mulai menipis',
      'Impor dan ekspor data barang massal via template Excel',
      'Pelacakan total produk terjual (sold quantity) real-time',
    ],
    iconName: 'Barcode',
    badge: 'Inventori Otomatis',
  },
  {
    id: 'hpp-report',
    title: 'Kalkulator HPP & Laporan Laba Rugi',
    tagline: 'Hitung Margin Presisi, Pantau Bisnis Real-Time',
    description: 'Kalkulator HPP bawaan membantu menghitung biaya modal dan menentukan harga jual ideal. Dilengkapi dashboard analitik dengan grafik omzet, tren laba bersih, dan produk terlaris.',
    benefits: [
      'Kalkulator HPP untuk menghitung margin keuntungan sebelum jual',
      'Grafik interaktif tren omzet & penjualan harian/bulanan',
      'Laporan produk paling laris (Best Sellers) untuk restock',
      'Modul retur barang otomatis merevisi stok & laporan keuangan',
    ],
    iconName: 'TrendingUp',
    badge: 'Analitik Akurat',
  },
];
