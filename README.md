# Praktis POS - Landing Page & CMS

Landing page modern berkecepatan tinggi untuk **Praktis POS** (Paket Mesin Kasir All-in-One Siap Pakai) yang dilengkapi dengan dashboard **Content Management System (CMS)** internal, autentikasi terproteksi, database lokal **SQLite** via **Drizzle ORM**, dan komponen **shadcn/ui**.

---

## 🌟 Fitur Utama

### 1. Landing Page Publik
* **Performa Tinggi**: Dibangun dengan Next.js 15 App Router & Server Components asinkron.
* **Desain Modern & Responsif**: Tampilan adaptif untuk smartphone, tablet, dan desktop dengan dukungan tema otomatis **Light / Dark Mode**.
* **Struktur Section Interaktif**:
  * Hero Section dengan Mockup Dashboard Kasir interaktif.
  * Social Proof (4 Metrik Utama & Target Industri UMKM).
  * Showcase Paket Hardware & Bonus Starter Kit Toko.
  * Fitur Software Unggulan (Transaksi Kilat, Dual-Wallet Kas Modal vs Profit, Barcode Scanner, Laporan HPP).
  * Banner Uji Coba Demo Kasir tanpa instalasi.
  * FAQ Accordion interaktif.
  * Banner Ajakan Pemesanan (CTA) langsung terhubung ke WhatsApp.
  * Floating WhatsApp Action Button.

### 2. Dashboard CMS Admin (`/admin`)
* **Autentikasi Aman**: Single-admin access via HTTP-Only cookie bertanda tangan JWT (`jose`) dan password terenkripsi (`bcryptjs`).
* **Proteksi Rute Otomatis**: Intercept otomatis lewat Next.js Middleware.
* **Fitur Hide & Show Section**: Sakelar switch interaktif untuk menyembunyikan atau memunculkan masing-masing dari 8 section landing page. Link di Navbar otomatis sinkron.
* **Manajemen Paket Hardware**: Tambah/edit spesifikasi produk, kelola bonus starter kit, dan fitur **Upload Foto Produk Lokal** (tersimpan di `public/uploads/`).
* **Pengaturan Teks & Kontak**: Edit headline hero, nomor WhatsApp pemesanan, template pesan chat otomatis, dan URL live demo aplikasi.
* **Manajemen Fitur & FAQ**: CRUD lengkap untuk kartu fitur unggulan dan daftar pertanyaan pelanggan.
* **Revalidasi Instan**: Setiap perubahan di CMS langsung memicu `revalidatePath('/')` sehingga pengunjung website publik langsung melihat perubahan terbaru secara instan.
* **Auto-Seed Otomatis**: Saat pertama kali dijalankan, sistem otomatis membuat dan mengisi tabel database SQLite dari data bawaan.

---

## 🔑 Kredensial Default Admin

* **URL Dashboard**: `http://localhost:3000/admin`
* **Username**: `admin`
* **Password**: `admin123`

> 💡 **Tips Keamanan:** Anda dapat mengubah username dan password sewaktu-waktu melalui menu **Keamanan Akun** (`/admin/security`) di dalam dashboard.

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
* **Frontend**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
* **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Sidebar, Switch, Table, Dialog, Card, Button, Input)
* **Database**: [SQLite](https://www.sqlite.org/) via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) (WAL mode)
* **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
* **Autentikasi**: [`jose`](https://github.com/panva/jose) (JWT), [`bcryptjs`](https://github.com/dcodeIO/bcrypt.js)
* **Ikon**: [Lucide React](https://lucide.dev/)

---

## 🚀 Panduan Menjalankan Proyek

### Opsi A: Menjalankan Secara Lokal (Node.js)

1. **Instal Dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan Mode Pengembangan (Development)**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

3. **Build & Jalankan Mode Produksi**:
   ```bash
   npm run build
   npm start
   ```

---

### Opsi B: Menjalankan dengan Docker

Proyek ini telah dikontainerisasi dengan `Dockerfile` multi-stage dan `docker-compose.yml` lengkap dengan volume persisten untuk database dan file upload.

#### Menggunakan Docker Compose (Direkomendasikan):
```bash
# Build dan jalankan container di background
docker compose up -d --build

# Melihat logs container
docker compose logs -f

# Menghentikan container
docker compose down
```

#### Menggunakan Docker CLI Standalone:
```bash
# 1. Build image
docker build -t praktis-pos-landing:latest .

# 2. Buat volume untuk data dan upload
docker volume create praktis_data
docker volume create praktis_uploads

# 3. Jalankan container
docker run -d \
  --name praktis-pos-landing \
  -p 3000:3000 \
  -v praktis_data:/app/data \
  -v praktis_uploads:/app/public/uploads \
  -e AUTH_SECRET=kunci-rahasia-jwt-anda \
  praktis-pos-landing:latest
```

---

### Opsi C: Menjalankan dengan Podman

Podman didukung penuh secara *rootless* dan aman di lingkungan Linux dan WSL2.

#### 1. Mode Development (Live Reload & Hot-Reload):
Menggunakan live source-code mount (`.:/app:z`) dan `userns_mode: keep-id` untuk permission yang lancar:
```bash
# Jalankan development interaktif via NPM script (Direkomendasikan):
npm run podman:dev

# Atau di background (-d):
npm run podman:dev:d

# Atau langsung via podman-compose CLI:
podman-compose -f docker-compose.dev.yml up --build

# Menghentikan container development:
npm run podman:dev:down
```

#### 2. Mode Produksi (Optimized Multi-Stage Build):
Membangun image teroptimasi mandiri dengan SQLite & uploads persisten:
```bash
# Jalankan produksi di background via NPM script (Direkomendasikan):
npm run podman:prod:d

# Atau langsung via podman-compose CLI:
podman-compose -f docker-compose.yml up -d --build

# Memantau log:
npm run podman:logs

# Menghentikan container produksi:
npm run podman:prod:down
```

#### 3. Ringkasan NPM Helper Scripts:
| Perintah | Deskripsi |
|---|---|
| `npm run podman:dev` | Jalankan container mode development interaktif |
| `npm run podman:dev:d` | Jalankan container mode development di background |
| `npm run podman:dev:down` | Hentikan container development |
| `npm run podman:prod` | Jalankan container mode produksi interaktif |
| `npm run podman:prod:d` | Jalankan container mode produksi di background |
| `npm run podman:prod:down` | Hentikan container produksi |
| `npm run podman:down` | Hentikan semua container podman (dev & prod) |
| `npm run podman:logs` | Pantau log container secara real-time |

#### 4. Menggunakan Podman CLI Standalone:
```bash
# 1. Build image
podman build -t praktis-pos-landing:latest .

# 2. Buat volume persisten
podman volume create praktis_data
podman volume create praktis_uploads

# 3. Jalankan container
podman run -d \
  --name praktis-pos-landing \
  -p 3000:3000 \
  -v praktis_data:/app/data:Z \
  -v praktis_uploads:/app/public/uploads:Z \
  -e AUTH_SECRET=kunci-rahasia-jwt-anda \
  praktis-pos-landing:latest
```
*(Catatan: Flag `:Z` pada volume mount otomatis diaplikasikan untuk isolasi SELinux yang aman).*

---

## 📁 Struktur Direktori Proyek

```text
├── data/                      # Lokasi database SQLite (cms.db)
├── docs/                      # Dokumentasi teknis & specs
│   └── superpowers/
│       ├── specs/             # Dokumen desain sistem
│       └── plans/             # Rencana implementasi
├── public/
│   ├── uploads/               # Foto produk/media lokal yang diunggah
│   └── ...
├── src/
│   ├── app/
│   │   ├── (public)/          # Landing page publik (page.tsx)
│   │   ├── admin/             # Dashboard CMS Admin
│   │   │   ├── login/         # Halaman login
│   │   │   ├── sections/      # Kontrol Hide / Show Section
│   │   │   ├── hardware/      # Manajemen produk kasir & starter kit
│   │   │   ├── settings/      # Pengaturan teks hero & WhatsApp
│   │   │   ├── features/      # Manajemen fitur unggulan
│   │   │   ├── faqs/          # Manajemen tanya jawab FAQ
│   │   │   └── security/      # Keamanan ganti password
│   │   └── api/               # API Routes (/auth/login, /auth/logout, /upload)
│   ├── components/
│   │   ├── ui/                # Komponen dasar shadcn/ui (Button, Switch, Dialog, Table, dll.)
│   │   ├── admin/             # Komponen layout admin (AdminSidebar, AdminNavbar)
│   │   └── ...                # Komponen section landing page (Hero, HardwareShowcase, dll.)
│   ├── lib/
│   │   ├── db/                # Drizzle schema, koneksi SQLite, auto-seed, & query repository
│   │   ├── auth.ts            # Logika session cookie JWT & hashing bcrypt
│   │   └── utils.ts           # Helper styling cn()
│   ├── types/                 # Definisi interface TypeScript
│   └── data/                  # Data statis bawaan awal (seed fallback)
├── Dockerfile                 # Konfigurasi container multi-stage
├── docker-compose.yml         # Konfigurasi Podman Compose mode Produksi
├── docker-compose.dev.yml     # Konfigurasi Podman Compose mode Development
├── .env.example               # Template variabel lingkungan
└── README.md
```

---

## ⚙️ Variabel Lingkungan (Environment Variables)

| Variabel | Default | Keterangan |
|---|---|---|
| `NODE_ENV` | `production` | Mode runtime aplikasi |
| `PORT` | `3000` | Port HTTP yang digunakan |
| `AUTH_SECRET` | *(Built-in fallback)* | Kunci enkripsi token sesi JWT admin |

---

## 📄 Lisensi
Hak Cipta © 2026 Praktis POS. Seluruh hak cipta dilindungi undang-undang.
