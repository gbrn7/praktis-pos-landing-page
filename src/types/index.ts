export interface HardwareItem {
  id: string;
  name: string;
  category: string;
  spec: string;
  description: string;
  iconName: string;
  imageUrl?: string | null;
}

export interface FeatureItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  benefits: string[];
  iconName: string;
  badge?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface PackageDetail {
  title: string;
  tagline: string;
  priceNote: string;
  hardwareList: HardwareItem[];
  bonuses: string[];
  guarantees: string[];
  waTemplate: string;
}

export interface SocialProofMetric {
  number: string;
  label: string;
  desc: string;
}

export const DEFAULT_SOCIAL_PROOF_METRICS: SocialProofMetric[] = [
  { number: 'Rp 0', label: 'Biaya Bulanan', desc: 'Sekali beli, bebas biaya sewa atau perpanjangan selamanya' },
  { number: '100%', label: 'Siap Pakai', desc: 'Hardware, driver & database sudah di-setting sebelum kirim' },
  { number: '2 Dompet', label: 'Terpisah Otomatis', desc: 'Uang modal kulakan & laba bersih tidak akan tercampur' },
  { number: '1 Tahun', label: 'Garansi Resmi', desc: 'Jaminan penggantian unit hardware & konsultasi teknis' },
];

export interface TargetIndustryItem {
  name: string;
  iconName: string;
}

export const DEFAULT_TARGET_INDUSTRIES: TargetIndustryItem[] = [
  { name: 'Minimarket & Kelontong', iconName: 'Store' },
  { name: 'Fashion, Pakaian & Butik', iconName: 'ShoppingBag' },
  { name: 'Kafe, Resto & F&B Retail', iconName: 'Coffee' },
  { name: 'Toko ATK, Bangunan & Elektronik', iconName: 'Sparkles' },
];

export const DEFAULT_TARGET_INDUSTRIES_TITLE =
  'Dirancang & Teruji untuk Berbagai Jenis Bisnis Retail & UMKM';


