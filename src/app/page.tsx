import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { SocialProof } from '@/components/SocialProof';
import { HardwareShowcase } from '@/components/HardwareShowcase';
import { FeatureGrid } from '@/components/FeatureGrid';
import { DemoBanner } from '@/components/DemoBanner';
import { Faq } from '@/components/Faq';
import { CtaBanner } from '@/components/CtaBanner';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { getLandingPageData } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { visibility, settings, hardwareList, bonuses, featuresList, faqsList } =
    await getLandingPageData();

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0B0B0C] text-[#000000] dark:text-[#FFFFFF] transition-colors duration-200">
      <Navbar settings={settings} visibility={visibility} />
      <main>
        {visibility.hero && <Hero settings={settings} />}
        {visibility.social_proof && <SocialProof />}
        {visibility.hardware && (
          <HardwareShowcase items={hardwareList} bonuses={bonuses} settings={settings} />
        )}
        {visibility.features && <FeatureGrid features={featuresList} />}
        {visibility.demo_banner && <DemoBanner settings={settings} />}
        {visibility.faq && <Faq faqs={faqsList} />}
        {visibility.cta_banner && <CtaBanner settings={settings} />}
      </main>
      <Footer settings={settings} visibility={visibility} />
      {visibility.floating_wa && <FloatingWhatsApp settings={settings} />}
    </div>
  );
}
