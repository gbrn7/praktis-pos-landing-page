export interface HardwareItem {
  id: string;
  name: string;
  category: string;
  spec: string;
  description: string;
  iconName: string;
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
