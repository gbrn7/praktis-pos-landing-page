# Design Spec: Setup Podman Compose (Hybrid Production & Development)

- **Date:** 2026-10-13
- **Project:** Praktis POS Landing Page & CMS
- **Author:** raygbrn & Antigravity
- **Status:** Approved

---

## 1. Executive Summary

Proyek **Praktis POS Landing Page & CMS** membutuhkan konfigurasi orkestrasi container menggunakan **Podman Compose** yang andal di lingkungan Linux/WSL2 dengan dukungan:
1. **Mode Development**: Live reload (hot-reloading Next.js), source code host mounted, node_modules terisolasi, dan penanganan permission rootless podman.
2. **Mode Production**: Multi-stage build yang ramping, aman, standalone binary/runner non-root (`nextjs`), dan penyimpanan SQLite serta uploads yang persisten.
3. **NPM Scripts Pembantu**: Perintah singkat untuk mempermudah lifecycle container (`up`, `down`, `logs`).

---

## 2. Analisis Lingkungan & Konteks Sistem

Berdasarkan inspeksi sistem host:
- **OS**: Linux / WSL2 (Ubuntu 24.04, kernel 6.18.40)
- **Podman**: v4.9.3 (*rootless* aktif)
- **Podman Socket**: aktif di `/run/user/1000/podman/podman.sock`
- **Podman Compose CLI**: v1.0.6 (Python) dan provider bawaan Podman via docker-compose 1.29.2.
- **Karakteristik v1.0.6**: Tidak mendukung flag `--profile`. Oleh karena itu, pendekatan multi-file terpisah (`docker-compose.yml` untuk produksi dan `docker-compose.dev.yml` untuk development) dipilih untuk menjamin kompatibilitas 100% tanpa risiko tabrakan port antar service.

---

## 3. Komponen Desain & Arsitektur

### 3.1 Multi-Stage Dockerfile (`Dockerfile`)

Dockerfile disempurnakan dengan menambahkan target stage `dev` yang bercabang dari stage `deps`:

```text
       [base: node:22-bookworm-slim + build tools (python3, make, g++)]
                                 │
                                 ▼
                     [deps: npm ci / node_modules]
                                 │
             ┌───────────────────┴───────────────────┐
             ▼                                       ▼
    [dev: Target Development]             [builder: npm run build]
    - NODE_ENV=development                           │
    - CMD: npm run dev                               ▼
                                          [runner: Target Production]
                                          - user: nextjs (1001)
                                          - CMD: npm start
```

Detail stage `dev`:
```dockerfile
# Stage: Development Runner
FROM deps AS dev
WORKDIR /app
ENV NODE_ENV=development
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### 3.2 File Compose Produksi (`docker-compose.yml`)

Melayani kebutuhan rilis stabil dan mandiri:
- **Service Name**: `praktis-pos`
- **Build**: Context `.`, target default (stage `runner`)
- **Image**: `praktis-pos-landing:latest`
- **Container Name**: `praktis-pos-landing`
- **Ports**: `${PORT:-3000}:3000`
- **Environment**:
  - `NODE_ENV=production`
  - `PORT=3000`
  - `AUTH_SECRET=${AUTH_SECRET:-praktis-pos-secret-change-this-in-production}`
- **Volumes**:
  - `praktis_data:/app/data:Z` (database SQLite `cms.db`)
  - `praktis_uploads:/app/public/uploads:Z` (foto produk CMS)
- **Restart**: `unless-stopped`

### 3.3 File Compose Development (`docker-compose.dev.yml`)

Melayani proses pengembangan harian dengan fitur hot-reload:
- **Service Name**: `praktis-pos-dev`
- **Build**: Context `.`, Dockerfile `Dockerfile`, target `dev`
- **Image**: `praktis-pos-landing:dev`
- **Container Name**: `praktis-pos-landing-dev`
- **Ports**: `${PORT:-3000}:3000`
- **Environment**:
  - `NODE_ENV=development`
  - `PORT=3000`
  - `AUTH_SECRET=${AUTH_SECRET:-praktis-pos-dev-secret}`
  - `WATCHPACK_POLLING=true` (menjamin deteksi perubahan file di WSL2/Linux container)
- **Volumes**:
  - `.:/app:z` (live mount source code host)
  - `/app/node_modules` (anonymous volume untuk menjaga node_modules container Linux tidak tertimpa host)
  - `/app/.next` (anonymous volume untuk mengisolasi cache build)
  - `praktis_dev_data:/app/data:Z` (database dev terpisah)
  - `praktis_dev_uploads:/app/public/uploads:Z` (upload dev terpisah)
- **Rootless User Namespace**:
  - `userns_mode: keep-id` (memetakan UID container ke host UID `1000:raygbrn` agar tidak terjadi error izin berkas/permission denied)

### 3.4 Variabel Lingkungan (`.env.example`)

File `.env.example` disediakan dengan variabel:
```env
# Port HTTP aplikasi
PORT=3000

# Rahasia token autentikasi JWT admin (Ubah di lingkungan produksi)
AUTH_SECRET=praktis-pos-secret-key-change-this-in-production
```

### 3.5 Shortcut NPM Scripts (`package.json`)

Ditambahkan ke dalam `scripts`:
```json
{
  "podman:dev": "podman-compose -f docker-compose.dev.yml up --build",
  "podman:dev:d": "podman-compose -f docker-compose.dev.yml up -d --build",
  "podman:dev:down": "podman-compose -f docker-compose.dev.yml down",
  "podman:prod": "podman-compose -f docker-compose.yml up --build",
  "podman:prod:d": "podman-compose -f docker-compose.yml up -d --build",
  "podman:prod:down": "podman-compose -f docker-compose.yml down",
  "podman:down": "podman-compose -f docker-compose.yml down && podman-compose -f docker-compose.dev.yml down",
  "podman:logs": "podman-compose logs -f"
}
```

---

## 4. Rencana Pengujian & Verifikasi

1. **Sintaks & Parsing Compose**:
   - `podman-compose -f docker-compose.yml config` valid tanpa error.
   - `podman-compose -f docker-compose.dev.yml config` valid tanpa error.
2. **Uji Build & Dry-Run**:
   - Verifikasi build stage `dev` dan stage `runner` via podman.
3. **Uji Lifecycle Development**:
   - Menjalankan `podman-compose -f docker-compose.dev.yml up -d`
   - Verifikasi service merespons HTTP 200 di `http://localhost:3000`.
   - Menghentikan dengan `down`.
4. **Uji Lifecycle Production**:
   - Menjalankan `podman-compose -f docker-compose.yml up -d`
   - Verifikasi service merespons HTTP 200 di `http://localhost:3000`.
   - Menghentikan dengan `down`.
5. **Integritas Dokumentasi**:
   - Perbarui [README.md](file:///home/raygbrn/project/react/praktis-pos-landing-page/README.md) dengan panduan lengkap Podman Compose.
