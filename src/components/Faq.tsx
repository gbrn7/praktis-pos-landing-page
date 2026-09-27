'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQS } from '../data/faqs';
import { FaqItem } from '../types';

interface FaqProps {
  faqs?: FaqItem[];
}

export const Faq: React.FC<FaqProps> = ({ faqs }) => {
  const faqList = faqs && faqs.length > 0 ? faqs : FAQS;
  const [openId, setOpenId] = useState<string | null>(faqList[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-[#FFFFFF] dark:bg-[#111113] border-t border-[#E7E7EE] dark:border-[#232326] transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] dark:bg-[#2B150B] text-[#E0511F] text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tanya Jawab</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#000000] dark:text-[#FFFFFF] tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-2 text-sm text-[#525252] dark:text-[#A1A1AA]">
            Informasi penting terkait perangkat keras, software, dan garansi paket Praktis POS.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqList.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl border border-[#E7E7EE] dark:border-[#232326] bg-[#FDFDFD] dark:bg-[#141416] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#000000] dark:text-[#FFFFFF] hover:text-[#E0511F] dark:hover:text-[#E0511F] transition-colors duration-200 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#525252] dark:text-[#A1A1AA] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-[#E0511F]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#525252] dark:text-[#A1A1AA] leading-relaxed border-t border-[#E7E7EE]/60 dark:border-[#232326] pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
