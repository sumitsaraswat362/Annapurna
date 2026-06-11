"use client";

import { TrackingPage } from "@/components/landing/TrackingPage";
import { FloatingNav } from "@/components/landing/FloatingNav";
import { Navbar } from "@/components/landing/Navbar";
import { FooterCTA } from "@/components/landing/FooterCTA";

export default function Tracking() {
  return (
    <div className="bg-black min-h-screen text-white font-sans font-['Inter'] overflow-x-hidden selection:bg-[#007AFF] selection:text-white pt-28 pb-12">
      {/* Background Mesh Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#007AFF] opacity-20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0A84FF] opacity-10 blur-[100px] rounded-full pointer-events-none" />
      
      <Navbar />
      <FloatingNav activeTab="tracking" />
      <TrackingPage />
      <FooterCTA />
    </div>
  );
}
