import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SocialProof } from './components/SocialProof';
import { HardwareShowcase } from './components/HardwareShowcase';
import { FeatureGrid } from './components/FeatureGrid';

export default function App() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#000000]">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <HardwareShowcase />
        <FeatureGrid />
      </main>
    </div>
  );
}
