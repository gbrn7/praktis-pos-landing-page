# Desain Teknis: CMS Praktis POS dengan Autentikasi, SQLite & Komponen shadcn/ui

- **Topik**: Sistem Manajemen Konten (CMS) Landing Page Praktis POS
- **Tanggal**: 2026-09-27
- **Status**: Disetujui (Approved)
- **Teknologi Utama**: Next.js 15 (App Router), React 19, SQLite (`better-sqlite3`), Drizzle ORM, shadcn/ui, Tailwind CSS, `jose`, `bcryptjs`.

---

## 1. Ringkasan & Tujuan Sistem

Membangun area dashboard admin CMS internal (`/admin`) untuk mengelola seluruh konten pada landing page Praktis POS secara dinamis tanpa perlu mengubah kode sumber atau melakukan *re-deployment*. 

### Fitur Kunci:
1. **Autentikasi Aman**: Single-admin access via HTTP-Only cookie session dan Next.js middleware protection.
2. **Database Lokal SQLite & Drizzle ORM**: Ringan, cepat, type-safe, tersimpan dalam satu file database lokal (`data/cms.db`).
3. **Fitur Hide & Show Section**: Sakelar (*toggle switch*) untuk menampilkan atau menyembunyikan masing-masing blok section landing page secara fleksibel.
4. **Manajemen Konten Lengkap**:
   - Pengaturan teks utama & kontak (Hero headline, nomor WhatsApp, URL demo, teks banner).
   - Katalog paket perangkat keras kasir (Hardware items & Starter kit bonus).
   - Kartu fitur unggulan (Title, tagline, description, benefits).
   - Tanya Jawab / FAQ (Questions & answers).
5. **Upload Gambar Lokal**: Kemampuan mengunggah foto produk hardware dan banner langsung ke direktori `public/uploads/`.
6. **Antarmuka Modern shadcn/ui**: Tampilan dashboard berbasis komponen shadcn (Sidebar collapsible, Card, Switch, Table, Dialog, Sheet, Button, Input).
7. **Revalidasi Instan & Auto-Seed**: Revalidasi halaman utama dengan `revalidatePath('/')` saat data diubah, serta mekanisme *auto-seeding* dari data default yang ada sekarang saat pertama kali inisialisasi.

---

## 2. Arsitektur Sistem & Database

### 2.1 File Database & Konfigurasi Drizzle
* Lokasi file database: `data/cms.db`
* Konfigurasi koneksi: `src/lib/db/index.ts` menggunakan driver `better-sqlite3`.
* Skema Drizzle: `src/lib/db/schema.ts`
* Konfigurasi drizzle: `drizzle.config.ts`

### 2.2 Skema Tabel Database

#### A. Tabel `admins`
Menyimpan kredensial admin tunggal:
* `id`: `INTEGER PRIMARY KEY AUTOINCREMENT`
* `username`: `TEXT NOT NULL UNIQUE`
* `password_hash`: `TEXT NOT NULL`
* `created_at`: `INTEGER NOT NULL DEFAULT (unixepoch())`
* `updated_at`: `INTEGER NOT NULL DEFAULT (unixepoch())`

#### B. Tabel `section_settings` (Hide/Show & Urutan)
Menyimpan status visibilitas masing-masing section:
* `section_key`: `TEXT PRIMARY KEY` (contoh: `'hero'`, `'social_proof'`, `'hardware'`, `'features'`, `'demo_banner'`, `'faq'`, `'cta_banner'`, `'floating_wa'`)
* `label`: `TEXT NOT NULL` (Nama label di antarmuka CMS, contoh: "Showcase Paket Hardware")
* `is_visible`: `INTEGER NOT NULL DEFAULT 1` (`1` = Aktif/Show, `0` = Disembunyikan/Hide)
* `display_order`: `INTEGER NOT NULL DEFAULT 0`

#### C. Tabel `site_settings`
Menyimpan konten teks umum, kontak WhatsApp, dan link demo:
* `id`: `INTEGER PRIMARY KEY AUTOINCREMENT` (selalu 1 baris)
* `hero_pill`: `TEXT NOT NULL DEFAULT 'Mesin Kasir Praktis POS • Paket Siap Pakai'`
* `hero_headline`: `TEXT NOT NULL`
* `hero_subtitle`: `TEXT NOT NULL`
* `wa_number`: `TEXT NOT NULL DEFAULT '6281234567890'`
* `wa_template`: `TEXT NOT NULL`
* `live_demo_url`: `TEXT NOT NULL`
* `demo_banner_title`: `TEXT NOT NULL`
* `demo_banner_desc`: `TEXT NOT NULL`
* `cta_banner_title`: `TEXT NOT NULL`
* `cta_banner_desc`: `TEXT NOT NULL`
* `updated_at`: `INTEGER NOT NULL DEFAULT (unixepoch())`

#### D. Tabel `hardware_items`
Menyimpan item perangkat keras yang ditampilkan pada section Hardware:
* `id`: `TEXT PRIMARY KEY` (slug unik, misal: `'tablet-pos'`, `'printer-thermal'`)
* `name`: `TEXT NOT NULL`
* `category`: `TEXT NOT NULL`
* `spec`: `TEXT NOT NULL`
* `description`: `TEXT NOT NULL`
* `icon_name`: `TEXT NOT NULL DEFAULT 'Tablet'`
* `image_url`: `TEXT` (opsional: path relatif ke `/uploads/...` jika diupload foto asli)
* `display_order`: `INTEGER NOT NULL DEFAULT 0`
* `is_active`: `INTEGER NOT NULL DEFAULT 1`

#### E. Tabel `hardware_bonuses`
Menyimpan daftar checklist bonus starter kit:
* `id`: `INTEGER PRIMARY KEY AUTOINCREMENT`
* `text`: `TEXT NOT NULL`
* `display_order`: `INTEGER NOT NULL DEFAULT 0`

#### F. Tabel `features`
Menyimpan kartu fitur unggulan software kasir:
* `id`: `TEXT PRIMARY KEY` (slug, misal: `'dual-wallet'`)
* `title`: `TEXT NOT NULL`
* `tagline`: `TEXT NOT NULL`
* `description`: `TEXT NOT NULL`
* `icon_name`: `TEXT NOT NULL DEFAULT 'ShoppingCart'`
* `badge`: `TEXT` (opsional, misal: `'Paling Diminati'`)
* `benefits`: `TEXT NOT NULL` (JSON array of strings, misal: `'["Benefit 1", "Benefit 2"]'`)
* `display_order`: `INTEGER NOT NULL DEFAULT 0`
* `is_active`: `INTEGER NOT NULL DEFAULT 1`

#### G. Tabel `faqs`
Menyimpan daftar tanya jawab:
* `id`: `TEXT PRIMARY KEY` (slug unik)
* `question`: `TEXT NOT NULL`
* `answer`: `TEXT NOT NULL`
* `display_order`: `INTEGER NOT NULL DEFAULT 0`
* `is_active`: `INTEGER NOT NULL DEFAULT 1`

---

## 3. Autentikasi & Keamanan

### 3.1 Session Management
* Autentikasi menggunakan token JWT yang ditandatangani secara aman dengan kunci rahasia (`AUTH_SECRET` dari environment variable, dengan fallback aman saat mode development).
* Token disimpan pada **HTTP-Only Cookie** bernama `cms_session`.
* Parameter cookie:
  * `httpOnly: true`
  * `secure: process.env.NODE_ENV === 'production'`
  * `sameSite: 'lax'`
  * `path: '/'`
  * `maxAge: 60 * 60 * 24 * 7` (7 hari)

### 3.2 Password Hashing
* Menggunakan `bcryptjs` (salt round = 10) untuk memvalidasi dan mengenkripsi kata sandi.

### 3.3 Next.js Route Protection (`middleware.ts`)
* Melindungi seluruh path yang diawali `/admin/*`.
* Pengecualian rute: `/admin/login` dapat diakses tanpa autentikasi.
* Jika pengguna belum login dan mengakses `/admin` atau rute di dalamnya, otomatis di-redirect ke `/admin/login`.
* Jika pengguna sudah login dan mengakses `/admin/login`, otomatis di-redirect ke `/admin`.
* Seluruh rute publik (`/`, gambar, font, dsb.) tidak terkena intercept.

### 3.4 Kredensial Awal & Keamanan
* Saat seeding awal, akun default dibuat:
  * Username: `admin`
  * Password default: `admin123` (atau diambil dari `ADMIN_DEFAULT_PASSWORD`)
* Disediakan menu "Keamanan Akun" di `/admin/security` untuk mengganti username & password.

---

## 4. Antarmuka Dashboard CMS (shadcn/ui)

### 4.1 Komponen Desain Sistem
Menggunakan library komponen **shadcn/ui**:
* `sidebar` (SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarTrigger)
* `switch` (digunakan pada toggle Hide/Show Section)
* `table` (daftar hardware, fitur, FAQ)
* `dialog` & `sheet` (form modal tambah/edit item)
* `card` (kontainer visual dan kartu dashboard)
* `button`, `input`, `textarea`, `badge`, `label`
* `toast` / alert notifikasi aksi berhasil/gagal

### 4.2 Struktur Navigasi & Halaman Admin
1. **`/admin` (Overview Dashboard)**:
   * Status koneksi SQLite, ringkasan jumlah section aktif, total hardware & FAQ.
   * Tombol cepat "Kunjungi Website Publik".
2. **`/admin/sections` (Pengaturan Section & Toggle Hide/Show)**:
   * Kartu list untuk 8 section landing page.
   * Komponen **shadcn `Switch`** untuk toggle `is_visible` secara langsung.
3. **`/admin/settings` (Pengaturan Teks & Kontak)**:
   * Form pengaturan: Teks Hero, Nomor WhatsApp pemesanan, template pesan, URL live demo kasir, teks banner.
4. **`/admin/hardware` (Paket Hardware & Starter Kit)**:
   * Tabel daftar perangkat kasir.
   * Dialog form tambah/edit produk dengan input nama, spesifikasi, dan **komponen upload gambar lokal**.
   * Pengelolaan daftar checklist bonus starter kit.
5. **`/admin/features` (Fitur Unggulan)**:
   * Tabel & dialog tambah/edit fitur dan daftar benefit.
6. **`/admin/faqs` (Pertanyaan & Jawaban)**:
   * Tabel daftar FAQ dengan aksi tambah, edit, hapus, dan toggle status aktif.
7. **`/admin/security` (Keamanan Akun)**:
   * Form ganti username dan ubah password admin.

---

## 5. Sistem Upload Gambar Lokal

### 5.1 Alur Kerja Upload
1. Pengguna memilih file gambar (PNG, JPG, JPEG, WEBP) melalui input file / dropzone pada form hardware atau banner.
2. Form dikirimkan melalui Next.js Server Action / API Route (`/api/upload`).
3. Validasi keamanan di server:
   * Cek MIME type (`image/png`, `image/jpeg`, `image/webp`).
   * Batas ukuran maksimum file: 5 MB.
4. File disimpan di folder `public/uploads/` dengan nama file unik:
   `[timestamp]-[sanitized-filename].[ext]`
5. Path file disimpan ke database SQLite pada kolom `image_url` (contoh: `/uploads/1727419200-tablet-pos.png`).
6. Gambar langsung dapat disajikan secara statis oleh Next.js.

---

## 6. Integrasi Landing Page Publik & Revalidasi

### 6.1 Server Component (`src/app/page.tsx`)
Landing page publik diubah menjadi async Server Component yang membaca data langsung dari SQLite helper:
```tsx
const { visibility, settings, hardwareItems, bonuses, features, faqs } = await getLandingPageData();
```

### 6.2 Render Kondisional Berdasarkan Visibilitas Section
```tsx
<div className="...">
  <Navbar settings={settings} visibility={visibility} />
  <main>
    {visibility.hero && <Hero settings={settings} />}
    {visibility.social_proof && <SocialProof />}
    {visibility.hardware && <HardwareShowcase items={hardwareItems} bonuses={bonuses} settings={settings} />}
    {visibility.features && <FeatureGrid features={features} />}
    {visibility.demo_banner && <DemoBanner settings={settings} />}
    {visibility.faq && <Faq faqs={faqs} />}
    {visibility.cta_banner && <CtaBanner settings={settings} />}
  </main>
  <Footer settings={settings} visibility={visibility} />
  {visibility.floating_wa && <FloatingWhatsApp settings={settings} />}
</div>
```

### 6.3 Link Navigasi Dinamis di Navbar
Menu navigasi di [`Navbar`](file:///home/raygbrn/project/react/praktis-pos-landing-page/src/components/Navbar.tsx) membaca `visibility`: jika section `#hardware` di-hide di CMS, link "Paket Hardware" tidak akan ditampilkan di baris menu navigasi.

### 6.4 Revalidasi Instan (`revalidatePath`)
Setiap Server Action di CMS yang melakukan mutasi data (update settings, toggle section, edit produk, upload foto) memanggil:
```ts
revalidatePath('/');
```
Hal ini memastikan pengunjung landing page langsung mendapatkan versi terbaru dalam hitungan milidetik.

### 6.5 Ketahanan Sistem & Fallback Data
Jika terjadi gangguan query atau database baru dibuat sebelum migrasi selesai:
* Fungsi `getLandingPageData()` dibungkus dalam blok `try/catch`.
* Jika gagal, sistem secara otomatis mengembalikan data default dari file statis yang ada (`src/data/package-data.ts`, `src/data/features.ts`, `src/data/faqs.ts`), sehingga landing page tidak akan pernah mengalami downtime atau error 500.

---

## 7. Rencana Verifikasi & Pengujian

1. **Pengujian Database & Auto-Seed**:
   * Jalankan inisialisasi database: verifikasi tabel `admins`, `section_settings`, `site_settings`, `hardware_items`, `features`, dan `faqs` terbuat dan terisi data awal secara otomatis.
2. **Pengujian Autentikasi**:
   * Akses `/admin` saat belum login -> harus dialihkan ke `/admin/login`.
   * Login dengan password salah -> muncul pesan error yang jelas.
   * Login dengan kredensial benar -> berhasil masuk ke `/admin`.
   * Klik logout -> cookie terhapus dan kembali ke `/admin/login`.
3. **Pengujian Hide / Show Section**:
   * Matikan toggle "Paket Hardware" di `/admin/sections`.
   * Buka landing page publik -> section Paket Hardware dan menu link di Navbar tidak muncul.
   * Aktifkan kembali toggle -> section dan menu kembali muncul secara instan.
4. **Pengujian Edit Konten & Upload Gambar**:
   * Ubah teks headline hero dan nomor WhatsApp -> cek di landing page publik apakah teks dan link WA terupdate.
   * Upload foto baru untuk item hardware -> cek gambar tersimpan di `public/uploads/` dan tampil di kartu hardware landing page.
5. **Pengujian Build & Linter**:
   * Jalankan `npm run lint` dan `npm run build` untuk memastikan tidak ada error TypeScript atau syntax.
