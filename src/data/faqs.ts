import { FaqItem } from '../types';

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Apakah mesin kasir ini memerlukan koneksi internet setiap saat?',
    answer: 'Tidak wajib. Sistem Praktis POS dapat beroperasi secara offline di jaringan lokal toko Anda. Transaksi kasir, cetak struk, dan update stok tetap berjalan lancar saat internet mati. Saat terhubung internet, data dapat disinkronkan untuk dipantau pemilik dari jauh.',
  },
  {
    id: 'faq-2',
    question: 'Apakah benar-benar tidak ada biaya langganan bulanan atau tahunan?',
    answer: 'Benar 100%. Pembelian paket ini berskema beli putus (Lifetime License). Anda tidak akan ditagih biaya sewa bulanan, biaya per transaksi, atau biaya perpanjangan tahunan.',
  },
  {
    id: 'faq-3',
    question: 'Bagaimana jika saya atau kasir saya belum pernah menggunakan mesin kasir sebelumnya?',
    answer: 'Semua unit hardware sudah kami rakit, install driver, dan uji coba sebelum dikirim. Saat paket tiba, Anda tinggal mencolokkan kabel ke stopkontak. Kami juga menyertakan video panduan langkah-demi-langkah berbahasa Indonesia serta layanan bantuan teknis langsung via WhatsApp.',
  },
  {
    id: 'faq-4',
    question: 'Bagaimana ketentuan garansi hardware jika ada perangkat yang rusak?',
    answer: 'Semua perangkat hardware (layar kasir, printer thermal, scanner barcode, laci uang) dilindungi garansi 1 tahun. Jika terjadi kendala bawaan pabrik, tim teknis kami siap membantu servis atau penggantian komponen.',
  },
  {
    id: 'faq-5',
    question: 'Bisakah saya memasukkan data ratusan produk toko saya sekaligus?',
    answer: 'Bisa sangat mudah! Kami menyediakan fitur import data produk melalui file Excel. Anda cukup memasukkan nama barang, harga modal, harga jual, dan stok, lalu upload ke sistem dalam hitungan detik. Bahkan untuk pembeli paket ini, tim kami bisa bantu masukkan 100 produk pertama secara gratis.',
  },
];
