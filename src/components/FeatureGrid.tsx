import React from 'react';
import { ShoppingCart, Wallet, Barcode, TrendingUp, Check } from 'lucide-react';
import { CORE_FEATURES } from '../data/features';
import { FeatureItem } from '../types';

interface FeatureGridProps {
  features?: FeatureItem[];
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => {
  const featureList = features && features.length > 0 ? features : CORE_FEATURES;

  const getIcon = (name: string) => {
    switch (name) {
      case 'ShoppingCart': return ShoppingCart;
      case 'Wallet': return Wallet;
      case 'Barcode': return Barcode;
      case 'TrendingUp': return TrendingUp;
      default: return ShoppingCart;
    }
  };

  return (
    <section id="fitur" className="py-16 sm:py-24 bg-[#FFFFFF] dark:bg-[#111113] border-t border-[#E7E7EE] dark:border-[#232326] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] text-xs font-bold uppercase tracking-wider mb-3">
            Fitur Software Unggulan
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#000000] dark:text-[#FFFFFF] tracking-tight">
            Lebih Dari Sekadar Kasir Biasa
          </h2>
          <p className="mt-3 text-base text-[#525252] dark:text-[#A1A1AA]">
            Dibangun dengan teknologi modern yang ringan, cepat, dan dibekali alat keuangan unik untuk mengamankan keuntungan toko Anda.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featureList.map((feature) => {
            const Icon = getIcon(feature.iconName);
            const isHighlight = feature.id === 'dual-wallet';

            return (
              <div
                key={feature.id}
                id={feature.id === 'dual-wallet' ? 'keunggulan' : undefined}
                className={`p-8 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isHighlight
                    ? 'border-[#E0511F] bg-[#FFFFFF] dark:bg-[#141416] shadow-md ring-1 ring-[#E0511F]/20'
                    : 'border-[#E7E7EE] dark:border-[#232326] bg-[#FDFDFD] dark:bg-[#141416] hover:border-[#E0511F]/30 dark:hover:border-[#E0511F]/40 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FFF0EB] dark:bg-[#2B150B] flex items-center justify-center text-[#E0511F]">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    {feature.badge && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F]">
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-[#000000] dark:text-[#FFFFFF]">{feature.title}</h3>
                  <p className="text-sm font-semibold text-[#E0511F] mt-1">{feature.tagline}</p>
                  <p className="text-sm text-[#525252] dark:text-[#A1A1AA] mt-3 leading-relaxed">{feature.description}</p>

                  {/* Bullet Benefits */}
                  <ul className="mt-5 space-y-2.5">
                    {feature.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#000000] dark:text-[#E4E4E7]">
                        <div className="w-4 h-4 rounded-full bg-[#FFF0EB] dark:bg-[#2B150B] flex items-center justify-center text-[#E0511F] shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
