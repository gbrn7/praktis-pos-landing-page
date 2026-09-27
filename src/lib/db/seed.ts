import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { PACKAGE_DATA, WHATSAPP_NUMBER, LIVE_DEMO_URL } from '@/data/package-data';
import { CORE_FEATURES } from '@/data/features';
import { FAQS } from '@/data/faqs';

export function ensureDatabaseSeeded() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'cms.db');
  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');

  // 1. Create tables if not exists
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS section_settings (
      section_key TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      is_visible INTEGER NOT NULL DEFAULT 1,
      display_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hero_pill TEXT NOT NULL DEFAULT 'Mesin Kasir Praktis POS • Paket Siap Pakai',
      hero_headline TEXT NOT NULL,
      hero_subtitle TEXT NOT NULL,
      hero_mockup_image TEXT,
      hero_highlights TEXT,
      social_proof_metrics TEXT,
      wa_number TEXT NOT NULL DEFAULT '6281234567890',
      wa_template TEXT NOT NULL,
      live_demo_url TEXT NOT NULL,
      demo_banner_title TEXT NOT NULL,
      demo_banner_desc TEXT NOT NULL,
      cta_banner_title TEXT NOT NULL,
      cta_banner_desc TEXT NOT NULL,
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS hardware_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      spec TEXT NOT NULL,
      description TEXT NOT NULL,
      icon_name TEXT NOT NULL DEFAULT 'Tablet',
      image_url TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS hardware_bonuses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS features (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      icon_name TEXT NOT NULL DEFAULT 'ShoppingCart',
      badge TEXT,
      benefits TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );
  `);

  // 2. Seed Default Admin
  const adminCount = sqlite.prepare('SELECT count(*) as count FROM admins').get() as { count: number };
  if (adminCount.count === 0) {
    const passwordHash = bcrypt.hashSync('admin123', 10);
    sqlite
      .prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)')
      .run('admin', passwordHash);
  }

  // 3. Seed Section Settings
  const sectionCount = sqlite.prepare('SELECT count(*) as count FROM section_settings').get() as { count: number };
  if (sectionCount.count === 0) {
    const defaultSections = [
      { key: 'hero', label: 'Hero Section', order: 1 },
      { key: 'social_proof', label: 'Social Proof & Metrik', order: 2 },
      { key: 'hardware', label: 'Showcase Paket Hardware', order: 3 },
      { key: 'features', label: 'Fitur Software Kasir', order: 4 },
      { key: 'demo_banner', label: 'Banner Uji Coba Demo', order: 5 },
      { key: 'faq', label: 'Tanya Jawab (FAQ)', order: 6 },
      { key: 'cta_banner', label: 'Banner CTA Penutup', order: 7 },
      { key: 'floating_wa', label: 'Tombol Floating WhatsApp', order: 8 },
    ];
    const insertSection = sqlite.prepare(
      'INSERT INTO section_settings (section_key, label, is_visible, display_order) VALUES (?, ?, 1, ?)'
    );
    for (const sec of defaultSections) {
      insertSection.run(sec.key, sec.label, sec.order);
    }
  }

  // 4. Seed Site Settings & Migration
  try {
    const siteCols = sqlite.prepare("PRAGMA table_info(site_settings)").all() as Array<{ name: string }>;
    if (siteCols.length > 0 && !siteCols.some((col) => col.name === 'hero_mockup_image')) {
      sqlite.exec("ALTER TABLE site_settings ADD COLUMN hero_mockup_image TEXT;");
    }
    if (siteCols.length > 0 && !siteCols.some((col) => col.name === 'hero_highlights')) {
      sqlite.exec("ALTER TABLE site_settings ADD COLUMN hero_highlights TEXT;");
    }
    if (siteCols.length > 0 && !siteCols.some((col) => col.name === 'social_proof_metrics')) {
      sqlite.exec("ALTER TABLE site_settings ADD COLUMN social_proof_metrics TEXT;");
    }
  } catch (err) {
    console.error('Migration error on site_settings:', err);
  }

  const siteCount = sqlite.prepare('SELECT count(*) as count FROM site_settings').get() as { count: number };
  if (siteCount.count === 0) {
    sqlite
      .prepare(`
        INSERT INTO site_settings (
          hero_pill, hero_headline, hero_subtitle, hero_mockup_image, hero_highlights, social_proof_metrics, wa_number, wa_template, live_demo_url,
          demo_banner_title, demo_banner_desc, cta_banner_title, cta_banner_desc
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        'Mesin Kasir Praktis POS • Paket Siap Pakai',
        'Solusi Mesin Kasir Lengkap: Buka Dus, Colok, Langsung Siap Jualan.',
        'Bersama Praktis POS, kelola transaksi kasir secepat kilat, pantau stok akurat, dan otomatis pisahkan uang modal kulakan vs laba bersih toko Anda. 100% tanpa biaya langganan bulanan seumur hidup.',
        '/mockup-dashboard.png',
        JSON.stringify(['Hak Milik Seumur Hidup', 'Garansi Hardware 1 Tahun', 'Gratis Setup & Training']),
        JSON.stringify([
          { number: 'Rp 0', label: 'Biaya Bulanan', desc: 'Sekali beli, bebas biaya sewa atau perpanjangan selamanya' },
          { number: '100%', label: 'Siap Pakai', desc: 'Hardware, driver & database sudah di-setting sebelum kirim' },
          { number: '2 Dompet', label: 'Terpisah Otomatis', desc: 'Uang modal kulakan & laba bersih tidak akan tercampur' },
          { number: '1 Tahun', label: 'Garansi Resmi', desc: 'Jaminan penggantian unit hardware & konsultasi teknis' },
        ]),
        WHATSAPP_NUMBER,
        PACKAGE_DATA.waTemplate,
        LIVE_DEMO_URL,
        'Ingin Mencoba Langsung Praktis POS?',
        'Buka aplikasi demo langsung di browser Anda sekarang. Rasakan sendiri cepatnya transaksi, kemudahan scan barcode, dan kejelasan laporan kas modal vs profit sebelum memesan paket hardware.',
        'Miliki Paket Mesin Kasir Praktis POS Hari Ini',
        'Konsultasikan jenis usaha dan kebutuhan toko Anda dengan tim kami. Perangkat kami rakit dan uji sebelum dikirim langsung ke alamat Anda.'
      );
  }

  // 5. Seed Hardware Items
  const hardwareCount = sqlite.prepare('SELECT count(*) as count FROM hardware_items').get() as { count: number };
  if (hardwareCount.count === 0) {
    const insertHardware = sqlite.prepare(`
      INSERT INTO hardware_items (id, name, category, spec, description, icon_name, image_url, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
    PACKAGE_DATA.hardwareList.forEach((item, index) => {
      insertHardware.run(
        item.id,
        item.name,
        item.category,
        item.spec,
        item.description,
        item.iconName,
        null,
        index + 1
      );
    });
  }

  // 6. Seed Bonuses
  const bonusCount = sqlite.prepare('SELECT count(*) as count FROM hardware_bonuses').get() as { count: number };
  if (bonusCount.count === 0) {
    const insertBonus = sqlite.prepare('INSERT INTO hardware_bonuses (text, display_order) VALUES (?, ?)');
    PACKAGE_DATA.bonuses.forEach((b, index) => {
      insertBonus.run(b, index + 1);
    });
  }

  // 7. Seed Features
  const featuresCount = sqlite.prepare('SELECT count(*) as count FROM features').get() as { count: number };
  if (featuresCount.count === 0) {
    const insertFeature = sqlite.prepare(`
      INSERT INTO features (id, title, tagline, description, icon_name, badge, benefits, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
    CORE_FEATURES.forEach((f, index) => {
      insertFeature.run(
        f.id,
        f.title,
        f.tagline,
        f.description,
        f.iconName,
        f.badge ?? null,
        JSON.stringify(f.benefits),
        index + 1
      );
    });
  }

  // 8. Seed FAQs
  const faqCount = sqlite.prepare('SELECT count(*) as count FROM faqs').get() as { count: number };
  if (faqCount.count === 0) {
    const insertFaq = sqlite.prepare(`
      INSERT INTO faqs (id, question, answer, display_order, is_active)
      VALUES (?, ?, ?, ?, 1)
    `);
    FAQS.forEach((faq, index) => {
      insertFaq.run(faq.id, faq.question, faq.answer, index + 1);
    });
  }

  sqlite.close();
}
