import React from 'react';
import { Store, ShoppingBag, Coffee, Sparkles } from 'lucide-react';
import { SocialProofMetric, DEFAULT_SOCIAL_PROOF_METRICS } from '@/types';

interface SocialProofProps {
  metrics?: SocialProofMetric[];
}

export const SocialProof: React.FC<SocialProofProps> = ({ metrics }) => {
  const metricItems = metrics && metrics.length > 0 ? metrics : DEFAULT_SOCIAL_PROOF_METRICS;

  const industries = [
    { name: 'Minimarket & Kelontong', icon: Store },
    { name: 'Fashion, Pakaian & Butik', icon: ShoppingBag },
    { name: 'Kafe, Resto & F&B Retail', icon: Coffee },
    { name: 'Toko ATK, Bangunan & Elektronik', icon: Sparkles },
  ];

  return (
    <section className="py-12 border-y border-[#E7E7EE] dark:border-[#232326] bg-[#FFFFFF] dark:bg-[#111113] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4 Metrik Utama */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {metricItems.map((m, idx) => (
            <div key={idx} className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#E0511F]">{m.number}</div>
              <div className="text-sm font-bold text-[#000000] dark:text-[#FFFFFF] mt-0.5">{m.label}</div>
              <p className="text-xs text-[#525252] dark:text-[#A1A1AA] mt-1 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>

        {/* Target Industri */}
        <div className="mt-10 pt-8 border-t border-[#E7E7EE] dark:border-[#232326]">
          <p className="text-center text-xs font-semibold text-[#525252] dark:text-[#A1A1AA] uppercase tracking-wider mb-4">
            Dirancang & Teruji untuk Berbagai Jenis Bisnis Retail & UMKM
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {industries.map((ind, idx) => {
              const Icon = ind.icon;
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E7E7EE] dark:border-[#232326] bg-[#FDFDFD] dark:bg-[#18181B] text-xs font-medium text-[#000000] dark:text-[#E4E4E7] shadow-2xs"
                >
                  <Icon className="w-3.5 h-3.5 text-[#E0511F]" />
                  <span>{ind.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
