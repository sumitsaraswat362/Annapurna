import { motion } from "motion/react";
import Link from "next/link";
import { Home, LayoutDashboard, Map, Gavel } from "lucide-react";

interface FloatingNavProps {
  activeTab: "features" | "tracking" | "bidding" | "home";
}

export function FloatingNav({ activeTab }: FloatingNavProps) {
  const tabs = [
    { id: "features", label: "Features", href: "/features", icon: LayoutDashboard },
    { id: "tracking", label: "Tracking", href: "/tracking", icon: Map },
    { id: "bidding", label: "Bidding", href: "/bidding", icon: Gavel },
  ] as const;

  return (
    <>
    <div className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[95%] md:max-w-fit">
      <div className="flex items-center justify-between p-1 rounded-full bg-black/40 backdrop-blur-[40px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative">
        
        {/* Navigation Links */}
        <div className="flex items-center flex-1 justify-center max-md:gap-0">
          <Link
            href="/"
            className={`relative flex items-center justify-center px-2 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-medium transition-colors duration-300 z-10 ${
              activeTab === "home" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
          {activeTab === "home" && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 bg-white/10 rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10"><Home className="w-4 h-4" /></span>
        </Link>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Link
              href={tab.href}
              key={tab.id}
              className={`relative flex items-center justify-center text-center px-2 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-medium transition-colors duration-300 z-10 ${
                isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </Link>
          );
        })}
        </div>

        {/* Login Button */}
        <div>
          <Link href="/login" className="flex items-center whitespace-nowrap px-3 py-1.5 md:px-5 md:py-2.5 rounded-full bg-gradient-to-b from-[#0A84FF] to-[#005DEB] shadow-[inset_0px_1px_1px_rgba(255,255,255,0.4)] hover:opacity-90 transition-opacity text-white text-[11px] md:text-sm font-medium">
            Use App
          </Link>
        </div>

      </div>
    </div>
    
    {/* Page Logo Fixed Top Left */}
    <div className="fixed top-6 left-6 md:top-8 md:left-8 z-40 hidden sm:flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#007AFF] to-[#34C759] flex items-center justify-center text-xs font-bold text-black">A</div>
      <span className="text-base font-semibold tracking-tight text-white">Annapurna Logistics</span>
    </div>
    </>
  );
}
