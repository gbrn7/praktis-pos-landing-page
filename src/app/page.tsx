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

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#000000]">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <HardwareShowcase />
        <FeatureGrid />
        <DemoBanner />
        <Faq />
        <CtaBanner />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
