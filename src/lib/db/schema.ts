import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const admins = sqliteTable('admins', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`),
});

export const sectionSettings = sqliteTable('section_settings', {
  sectionKey: text('section_key').primaryKey(),
  label: text('label').notNull(),
  isVisible: integer('is_visible').notNull().default(1),
  displayOrder: integer('display_order').notNull().default(0),
});

export const siteSettings = sqliteTable('site_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  heroPill: text('hero_pill').notNull().default('Mesin Kasir Praktis POS • Paket Siap Pakai'),
  heroHeadline: text('hero_headline').notNull(),
  heroSubtitle: text('hero_subtitle').notNull(),
  heroMockupImage: text('hero_mockup_image'),
  heroHighlights: text('hero_highlights'),
  waNumber: text('wa_number').notNull().default('6281234567890'),
  waTemplate: text('wa_template').notNull(),
  liveDemoUrl: text('live_demo_url').notNull(),
  demoBannerTitle: text('demo_banner_title').notNull(),
  demoBannerDesc: text('demo_banner_desc').notNull(),
  ctaBannerTitle: text('cta_banner_title').notNull(),
  ctaBannerDesc: text('cta_banner_desc').notNull(),
  updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`),
});

export const hardwareItems = sqliteTable('hardware_items', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  spec: text('spec').notNull(),
  description: text('description').notNull(),
  iconName: text('icon_name').notNull().default('Tablet'),
  imageUrl: text('image_url'),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: integer('is_active').notNull().default(1),
});

export const hardwareBonuses = sqliteTable('hardware_bonuses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  text: text('text').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
});

export const features = sqliteTable('features', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  tagline: text('tagline').notNull(),
  description: text('description').notNull(),
  iconName: text('icon_name').notNull().default('ShoppingCart'),
  badge: text('badge'),
  benefits: text('benefits').notNull(), // JSON string array
  displayOrder: integer('display_order').notNull().default(0),
  isActive: integer('is_active').notNull().default(1),
});

export const faqs = sqliteTable('faqs', {
  id: text('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: integer('is_active').notNull().default(1),
});
