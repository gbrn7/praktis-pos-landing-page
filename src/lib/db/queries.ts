import { db } from './index';
import {
  sectionSettings,
  siteSettings,
  hardwareItems,
  hardwareBonuses,
  features,
  faqs,
} from './schema';
import { ensureDatabaseSeeded } from './seed';
import { PACKAGE_DATA, WHATSAPP_NUMBER, LIVE_DEMO_URL } from '@/data/package-data';
import { CORE_FEATURES } from '@/data/features';
import { FAQS } from '@/data/faqs';
import { FeatureItem, FaqItem, HardwareItem, SocialProofMetric, DEFAULT_SOCIAL_PROOF_METRICS, TargetIndustryItem, DEFAULT_TARGET_INDUSTRIES, DEFAULT_TARGET_INDUSTRIES_TITLE } from '@/types';

export { DEFAULT_SOCIAL_PROOF_METRICS, DEFAULT_TARGET_INDUSTRIES, DEFAULT_TARGET_INDUSTRIES_TITLE };
export type { SocialProofMetric, TargetIndustryItem };

export interface SiteSettingsPublic {
  heroPill: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroMockupImage: string;
  heroHighlights: string[];
  socialProofMetrics: SocialProofMetric[];
  targetIndustries: TargetIndustryItem[];
  targetIndustriesTitle: string;
  hardwarePill: string;
  hardwareHeadline: string;
  hardwareSubtitle: string;
  featuresPill: string;
  featuresHeadline: string;
  featuresSubtitle: string;
  waNumber: string;
  waTemplate: string;
  liveDemoUrl: string;
  demoBannerTitle: string;
  demoBannerDesc: string;
  ctaBannerTitle: string;
  ctaBannerDesc: string;
}

export interface LandingPageData {
  visibility: Record<string, boolean>;
  settings: SiteSettingsPublic;
  hardwareList: (HardwareItem & { imageUrl?: string | null })[];
  bonuses: string[];
  featuresList: FeatureItem[];
  faqsList: FaqItem[];
}

export async function getLandingPageData(): Promise<LandingPageData> {
  try {
    ensureDatabaseSeeded();

    // 1. Visibilities
    const allSections = db.select().from(sectionSettings).orderBy(sectionSettings.displayOrder).all();
    const visibility: Record<string, boolean> = {
      hero: true,
      social_proof: true,
      hardware: true,
      features: true,
      demo_banner: true,
      faq: true,
      cta_banner: true,
      floating_wa: true,
    };
    for (const sec of allSections) {
      visibility[sec.sectionKey] = sec.isVisible === 1;
    }

    // 2. Settings
    const settingsRecord = db.select().from(siteSettings).limit(1).get();
    let parsedHighlights = ['Hak Milik Seumur Hidup', 'Garansi Hardware 1 Tahun', 'Gratis Setup & Training'];
    if (settingsRecord?.heroHighlights) {
      try {
        const val = JSON.parse(settingsRecord.heroHighlights);
        if (Array.isArray(val) && val.length > 0) {
          parsedHighlights = val;
        }
      } catch {
        // fallback
      }
    }

    let parsedMetrics: SocialProofMetric[] = DEFAULT_SOCIAL_PROOF_METRICS;
    if (settingsRecord?.socialProofMetrics) {
      try {
        const val = JSON.parse(settingsRecord.socialProofMetrics);
        if (Array.isArray(val) && val.length > 0) {
          parsedMetrics = val;
        }
      } catch {
        // fallback
      }
    }

    let parsedIndustries: TargetIndustryItem[] = DEFAULT_TARGET_INDUSTRIES;
    if (settingsRecord?.targetIndustries) {
      try {
        const val = JSON.parse(settingsRecord.targetIndustries);
        if (Array.isArray(val) && val.length > 0) {
          parsedIndustries = val;
        }
      } catch {
        // fallback
      }
    }

    const settings: SiteSettingsPublic = settingsRecord
      ? {
          heroPill: settingsRecord.heroPill,
          heroHeadline: settingsRecord.heroHeadline,
          heroSubtitle: settingsRecord.heroSubtitle,
          heroMockupImage: settingsRecord.heroMockupImage || '/mockup-dashboard.png',
          heroHighlights: parsedHighlights,
          socialProofMetrics: parsedMetrics,
          targetIndustries: parsedIndustries,
          targetIndustriesTitle: settingsRecord.targetIndustriesTitle || DEFAULT_TARGET_INDUSTRIES_TITLE,
          hardwarePill: settingsRecord.hardwarePill || "What's In The Box",
          hardwareHeadline: settingsRecord.hardwareHeadline || '1 Paket Lengkap Mesin Kasir Praktis POS',
          hardwareSubtitle:
            settingsRecord.hardwareSubtitle ||
            'Semua perangkat yang Anda butuhkan untuk operasional toko sudah tersedia dalam satu paket. Buka dus, colok kabel, dan langsung siap transaksi.',
          featuresPill: settingsRecord.featuresPill || 'Fitur Software Unggulan',
          featuresHeadline: settingsRecord.featuresHeadline || 'Lebih Dari Sekadar Kasir Biasa',
          featuresSubtitle:
            settingsRecord.featuresSubtitle ||
            'Dibangun dengan teknologi modern yang ringan, cepat, dan dibekali alat keuangan unik untuk mengamankan keuntungan toko Anda.',
          waNumber: settingsRecord.waNumber,
          waTemplate: settingsRecord.waTemplate,
          liveDemoUrl: settingsRecord.liveDemoUrl,
          demoBannerTitle: settingsRecord.demoBannerTitle,
          demoBannerDesc: settingsRecord.demoBannerDesc,
          ctaBannerTitle: settingsRecord.ctaBannerTitle,
          ctaBannerDesc: settingsRecord.ctaBannerDesc,
        }
      : {
          heroPill: 'Mesin Kasir Praktis POS • Paket Siap Pakai',
          heroHeadline: 'Solusi Mesin Kasir Lengkap: Buka Dus, Colok, Langsung Siap Jualan.',
          heroSubtitle:
            'Bersama Praktis POS, kelola transaksi kasir secepat kilat, pantau stok akurat, dan otomatis pisahkan uang modal kulakan vs laba bersih toko Anda. 100% tanpa biaya langganan bulanan seumur hidup.',
          heroMockupImage: '/mockup-dashboard.png',
          heroHighlights: ['Hak Milik Seumur Hidup', 'Garansi Hardware 1 Tahun', 'Gratis Setup & Training'],
          socialProofMetrics: DEFAULT_SOCIAL_PROOF_METRICS,
          targetIndustries: DEFAULT_TARGET_INDUSTRIES,
          targetIndustriesTitle: DEFAULT_TARGET_INDUSTRIES_TITLE,
          hardwarePill: "What's In The Box",
          hardwareHeadline: '1 Paket Lengkap Mesin Kasir Praktis POS',
          hardwareSubtitle:
            'Semua perangkat yang Anda butuhkan untuk operasional toko sudah tersedia dalam satu paket. Buka dus, colok kabel, dan langsung siap transaksi.',
          featuresPill: 'Fitur Software Unggulan',
          featuresHeadline: 'Lebih Dari Sekadar Kasir Biasa',
          featuresSubtitle:
            'Dibangun dengan teknologi modern yang ringan, cepat, dan dibekali alat keuangan unik untuk mengamankan keuntungan toko Anda.',
          waNumber: WHATSAPP_NUMBER,
          waTemplate: PACKAGE_DATA.waTemplate,
          liveDemoUrl: LIVE_DEMO_URL,
          demoBannerTitle: 'Ingin Mencoba Langsung Praktis POS?',
          demoBannerDesc:
            'Buka aplikasi demo langsung di browser Anda sekarang. Rasakan sendiri cepatnya transaksi, kemudahan scan barcode, dan kejelasan laporan kas modal vs profit sebelum memesan paket hardware.',
          ctaBannerTitle: 'Miliki Paket Mesin Kasir Praktis POS Hari Ini',
          ctaBannerDesc:
            'Konsultasikan jenis usaha dan kebutuhan toko Anda dengan tim kami. Perangkat kami rakit dan uji sebelum dikirim langsung ke alamat Anda.',
        };

    // 3. Hardware items & bonuses
    const hwDb = db.select().from(hardwareItems).orderBy(hardwareItems.displayOrder).all();
    const activeHw = hwDb.filter((h) => h.isActive === 1);
    const hardwareList: (HardwareItem & { imageUrl?: string | null })[] = activeHw.length > 0
      ? activeHw.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          spec: item.spec,
          description: item.description,
          iconName: item.iconName,
          imageUrl: item.imageUrl,
        }))
      : PACKAGE_DATA.hardwareList;

    const bonusesDb = db.select().from(hardwareBonuses).orderBy(hardwareBonuses.displayOrder).all();
    const bonuses = bonusesDb.length > 0 ? bonusesDb.map((b) => b.text) : PACKAGE_DATA.bonuses;

    // 4. Features
    const featDb = db.select().from(features).orderBy(features.displayOrder).all();
    const activeFeat = featDb.filter((f) => f.isActive === 1);
    const featuresList: FeatureItem[] = activeFeat.length > 0
      ? activeFeat.map((f) => {
          let parsedBenefits: string[] = [];
          try {
            parsedBenefits = JSON.parse(f.benefits);
          } catch {
            parsedBenefits = [];
          }
          return {
            id: f.id,
            title: f.title,
            tagline: f.tagline,
            description: f.description,
            benefits: parsedBenefits,
            iconName: f.iconName,
            badge: f.badge ?? undefined,
          };
        })
      : CORE_FEATURES;

    // 5. FAQs
    const faqDb = db.select().from(faqs).orderBy(faqs.displayOrder).all();
    const activeFaqs = faqDb.filter((fq) => fq.isActive === 1);
    const faqsList: FaqItem[] = activeFaqs.length > 0
      ? activeFaqs.map((fq) => ({
          id: fq.id,
          question: fq.question,
          answer: fq.answer,
        }))
      : FAQS;

    return {
      visibility,
      settings,
      hardwareList,
      bonuses,
      featuresList,
      faqsList,
    };
  } catch (error) {
    console.error('getLandingPageData fallback triggered:', error);
    // Graceful fallback to static data
    return {
      visibility: {
        hero: true,
        social_proof: true,
        hardware: true,
        features: true,
        demo_banner: true,
        faq: true,
        cta_banner: true,
        floating_wa: true,
      },
      settings: {
        heroPill: 'Mesin Kasir Praktis POS • Paket Siap Pakai',
        heroHeadline: 'Solusi Mesin Kasir Lengkap: Buka Dus, Colok, Langsung Siap Jualan.',
        heroSubtitle:
          'Bersama Praktis POS, kelola transaksi kasir secepat kilat, pantau stok akurat, dan otomatis pisahkan uang modal kulakan vs laba bersih toko Anda. 100% tanpa biaya langganan bulanan seumur hidup.',
        heroMockupImage: '/mockup-dashboard.png',
        heroHighlights: ['Hak Milik Seumur Hidup', 'Garansi Hardware 1 Tahun', 'Gratis Setup & Training'],
        socialProofMetrics: DEFAULT_SOCIAL_PROOF_METRICS,
        targetIndustries: DEFAULT_TARGET_INDUSTRIES,
        targetIndustriesTitle: DEFAULT_TARGET_INDUSTRIES_TITLE,
        hardwarePill: "What's In The Box",
        hardwareHeadline: '1 Paket Lengkap Mesin Kasir Praktis POS',
        hardwareSubtitle:
          'Semua perangkat yang Anda butuhkan untuk operasional toko sudah tersedia dalam satu paket. Buka dus, colok kabel, dan langsung siap transaksi.',
        featuresPill: 'Fitur Software Unggulan',
        featuresHeadline: 'Lebih Dari Sekadar Kasir Biasa',
        featuresSubtitle:
          'Dibangun dengan teknologi modern yang ringan, cepat, dan dibekali alat keuangan unik untuk mengamankan keuntungan toko Anda.',
        waNumber: WHATSAPP_NUMBER,
        waTemplate: PACKAGE_DATA.waTemplate,
        liveDemoUrl: LIVE_DEMO_URL,
        demoBannerTitle: 'Ingin Mencoba Langsung Praktis POS?',
        demoBannerDesc:
          'Buka aplikasi demo langsung di browser Anda sekarang. Rasakan sendiri cepatnya transaksi, kemudahan scan barcode, dan kejelasan laporan kas modal vs profit sebelum memesan paket hardware.',
        ctaBannerTitle: 'Miliki Paket Mesin Kasir Praktis POS Hari Ini',
        ctaBannerDesc:
          'Konsultasikan jenis usaha dan kebutuhan toko Anda dengan tim kami. Perangkat kami rakit dan uji sebelum dikirim langsung ke alamat Anda.',
      },
      hardwareList: PACKAGE_DATA.hardwareList,
      bonuses: PACKAGE_DATA.bonuses,
      featuresList: CORE_FEATURES,
      faqsList: FAQS,
    };
  }
}
