# Podman Compose Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menyiapkan konfigurasi Podman Compose hybrid (Production & Development) untuk Praktis POS Landing Page & CMS lengkap dengan persistensi SQLite, live-reload, rootless user namespace, dan shortcut NPM scripts.

**Architecture:** Memanfaatkan multi-stage Dockerfile dengan target stage `dev` dan `runner`, didukung oleh 2 file compose terpisah (`docker-compose.yml` untuk produksi dan `docker-compose.dev.yml` untuk development) guna menjamin kompatibilitas 100% pada `podman-compose` v1.0.6 tanpa tabrakan port, serta parameter `userns_mode: keep-id` untuk rootless file permissions.

**Tech Stack:** Podman 4.9.3, podman-compose 1.0.6, Node.js 22, Next.js 15, SQLite (better-sqlite3), Drizzle ORM.

## Global Constraints

- OS: Linux / WSL2 dengan Podman Rootless aktif.
- Database: SQLite lokal di `/app/data/cms.db` harus persisten lintas lifecycle container.
- Media upload: `/app/public/uploads` harus persisten lintas lifecycle container.
- Port: Default port HTTP adalah 3000.
- Zero breaking changes pada build lokal (`npm run dev` / `npm run build`).

---

### Task 1: Buat Template Variabel Lingkungan (`.env.example`)

**Files:**
- Create: `.env.example`

**Interfaces:**
- Consumes: Default environment variables di `src/lib/auth.ts` dan compose files.
- Produces: `.env.example` sebagai referensi konfigurasi.

- [ ] **Step 1: Buat file `.env.example`**

```env
# Port aplikasi
PORT=3000

# Rahasia token sesi JWT admin (Ganti dengan kunci acak yang aman di produksi)
AUTH_SECRET=praktis-pos-secret-key-change-this-in-production
```

- [ ] **Step 2: Verifikasi file terbuat**

Run: `test -f .env.example && echo "PASS"`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add .env.example
git commit -m "chore: add .env.example template"
```

---

### Task 2: Tambahkan Stage `dev` pada Multi-Stage `Dockerfile`

**Files:**
- Modify: `Dockerfile`

**Interfaces:**
- Consumes: Stage `deps` yang sudah memiliki paket dependensi lengkap (termasuk devDependencies dan tool build better-sqlite3).
- Produces: Target build `dev` yang mengeksekusi `npm run dev` pada port 3000.

- [ ] **Step 1: Perbarui `Dockerfile`**

Sisipkan stage `dev` setelah stage `deps` dan sebelum stage `builder`:

```dockerfile
# =============================================================================
# Stage: Development Runner
# =============================================================================
FROM deps AS dev
WORKDIR /app

ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

- [ ] **Step 2: Uji sintaks build target `dev` dengan podman**

Run: `podman build --target dev -t praktis-pos-landing:dev .`
Expected: Successfully built image `praktis-pos-landing:dev`

- [ ] **Step 3: Commit**

```bash
git add Dockerfile
git commit -m "build(docker): add dev target stage in multi-stage Dockerfile"
```

---

### Task 3: Optimasi Konfigurasi Produksi (`docker-compose.yml`)

**Files:**
- Modify: `docker-compose.yml`

**Interfaces:**
- Consumes: Target stage `runner` di `Dockerfile`.
- Produces: Service `praktis-pos` yang terisolasi dengan volume persisten untuk data dan uploads.

- [ ] **Step 1: Perbarui `docker-compose.yml`**

Pastikan volume menggunakan penanda `:Z` dan environment mendukung variabel konfigurasi:

```yaml
services:
  praktis-pos:
    build:
      context: .
      dockerfile: Dockerfile
    image: praktis-pos-landing:latest
    container_name: praktis-pos-landing
    restart: unless-stopped
    ports:
      - "${PORT:-3000}:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - AUTH_SECRET=${AUTH_SECRET:-praktis-pos-secret-change-this-in-production}
    volumes:
      - praktis_data:/app/data:Z
      - praktis_uploads:/app/public/uploads:Z

volumes:
  praktis_data:
    driver: local
  praktis_uploads:
    driver: local
```

- [ ] **Step 2: Validasi sintaks compose produksi**

Run: `podman-compose -f docker-compose.yml config`
Expected: Output YAML valid tanpa syntax error

- [ ] **Step 3: Commit**

```bash
git add docker-compose.yml
git commit -m "build(compose): update production compose configuration with SELinux flags"
```

---

### Task 4: Buat Konfigurasi Development (`docker-compose.dev.yml`)

**Files:**
- Create: `docker-compose.dev.yml`

**Interfaces:**
- Consumes: Target stage `dev` di `Dockerfile`.
- Produces: Service `praktis-pos-dev` dengan live mount `./src`, volume anonim `node_modules` & `.next`, dan `userns_mode: keep-id`.

- [ ] **Step 1: Buat file `docker-compose.dev.yml`**

```yaml
services:
  praktis-pos-dev:
    build:
      context: .
      dockerfile: Dockerfile
      target: dev
    image: praktis-pos-landing:dev
    container_name: praktis-pos-landing-dev
    ports:
      - "${PORT:-3000}:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
      - AUTH_SECRET=${AUTH_SECRET:-praktis-pos-dev-secret}
      - WATCHPACK_POLLING=true
    volumes:
      - .:/app:z
      - /app/node_modules
      - /app/.next
      - praktis_dev_data:/app/data:Z
      - praktis_dev_uploads:/app/public/uploads:Z
    userns_mode: keep-id

volumes:
  praktis_dev_data:
    driver: local
  praktis_dev_uploads:
    driver: local
```

- [ ] **Step 2: Validasi sintaks compose development**

Run: `podman-compose -f docker-compose.dev.yml config`
Expected: Output YAML valid dengan `userns_mode: keep-id`

- [ ] **Step 3: Commit**

```bash
git add docker-compose.dev.yml
git commit -m "build(compose): add development compose configuration with live reload"
```

---

### Task 5: Tambahkan Shortcut NPM Scripts di `package.json`

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: CLI `podman-compose` dan file `docker-compose.yml` & `docker-compose.dev.yml`.
- Produces: NPM scripts `podman:dev`, `podman:dev:d`, `podman:dev:down`, `podman:prod`, `podman:prod:d`, `podman:prod:down`, `podman:down`, `podman:logs`.

- [ ] **Step 1: Tambahkan skrip ke dalam `package.json`**

```json
    "podman:dev": "podman-compose -f docker-compose.dev.yml up --build",
    "podman:dev:d": "podman-compose -f docker-compose.dev.yml up -d --build",
    "podman:dev:down": "podman-compose -f docker-compose.dev.yml down",
    "podman:prod": "podman-compose -f docker-compose.yml up --build",
    "podman:prod:d": "podman-compose -f docker-compose.yml up -d --build",
    "podman:prod:down": "podman-compose -f docker-compose.yml down",
    "podman:down": "podman-compose -f docker-compose.yml down && podman-compose -f docker-compose.dev.yml down",
    "podman:logs": "podman-compose logs -f"
```

- [ ] **Step 2: Verifikasi package.json tetap valid JSON**

Run: `node -e "JSON.parse(fs.readFileSync('package.json'))"`
Expected: PASS tanpa error

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: add podman compose npm helper scripts"
```

---

### Task 6: Perbarui Panduan di `README.md`

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: Seluruh konfigurasi dan skrip yang telah dibuat.
- Produces: Bagian panduan `Opsi C: Menjalankan dengan Podman` yang lengkap dan akurat.

- [ ] **Step 1: Perbarui bagian Opsi C di `README.md`**

Tambahkan panduan mode development dan production via podman-compose dan npm scripts.

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update README with podman compose dev and prod instructions"
```

---

### Task 7: Pengujian End-to-End (E2E)

**Files:**
- Test target: Seluruh service container dan compose stack

- [ ] **Step 1: Jalankan mode development di background**

Run: `npm run podman:dev:d`
Expected: Container `praktis-pos-landing-dev` berstatus running

- [ ] **Step 2: Uji HTTP endpoint development**

Run: `curl -I http://localhost:3000`
Expected: HTTP 200 OK

- [ ] **Step 3: Matikan container development**

Run: `npm run podman:dev:down`
Expected: Container dimatikan dan dihapus

- [ ] **Step 4: Jalankan mode production di background**

Run: `npm run podman:prod:d`
Expected: Container `praktis-pos-landing` berstatus running

- [ ] **Step 5: Uji HTTP endpoint production**

Run: `curl -I http://localhost:3000`
Expected: HTTP 200 OK

- [ ] **Step 6: Matikan container production**

Run: `npm run podman:prod:down`
Expected: Container dimatikan dan dihapus

- [ ] **Step 7: Verifikasi workspace bersih**

Run: `git status`
Expected: Clean working tree
