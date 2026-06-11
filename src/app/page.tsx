"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FloatingNav } from "@/components/landing/FloatingNav";
import { FooterCTA } from "@/components/landing/FooterCTA";
import { FeaturesPage } from "@/components/landing/FeaturesPage";
import { TrackingPage } from "@/components/landing/TrackingPage";
import { BiddingPage } from "@/components/landing/BiddingPage";
import Link from "next/link";

export type TabType = "features" | "tracking" | "bidding";

export default function LandingHome() {
  const [activeTab, setActiveTab] = useState<TabType>("features");

  return (
    <div className="bg-black min-h-screen text-white font-sans font-['Inter'] overflow-x-hidden selection:bg-[#007AFF] selection:text-white">
      {/* Background Mesh Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#007AFF] opacity-20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0A84FF] opacity-10 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Logo & Login button (Top layer) */}
      <div className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 py-4 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#007AFF] to-[#34C759] flex items-center justify-center text-xs font-bold text-black">A</div>
          <span className="text-xl font-semibold tracking-tight text-white/90">Annapurna</span>
        </div>
        <div className="flex items-center gap-3 pointer-events-auto">
          <Link href="/login" className="px-5 py-2.5 text-sm font-medium rounded-full bg-gradient-to-b from-[#0A84FF] to-[#005DEB] shadow-[inset_0px_1px_1px_rgba(255,255,255,0.4)] hover:opacity-90 transition-opacity text-white">
            Login / Use App
          </Link>
        </div>
      </div>

      <FloatingNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-screen pt-28 pb-12"
        >
          {activeTab === "features" && <FeaturesPage />}
          {activeTab === "tracking" && <TrackingPage />}
          {activeTab === "bidding" && <BiddingPage />}
        </motion.div>
      </AnimatePresence>
      
      <FooterCTA />
    </div>
  );
}
