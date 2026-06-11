import { Hero } from "./Hero";
import { FloatingNav } from "./FloatingNav";
import { FeatureShowcase } from "./FeatureShowcase";
import { BentoGrid } from "./BentoGrid";
import { FooterCTA } from "./FooterCTA";

export function LandingPage() {
  return (
    <div className="bg-black min-h-screen text-white font-sans font-['Inter']">
      {/* Background Mesh Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#007AFF] opacity-20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0A84FF] opacity-10 blur-[100px] rounded-full pointer-events-none" />
      
      <FloatingNav activeTab="home" />
      <main>
        <Hero />
        <FeatureShowcase />
        <BentoGrid />
      </main>
      <FooterCTA />
    </div>
  );
}
