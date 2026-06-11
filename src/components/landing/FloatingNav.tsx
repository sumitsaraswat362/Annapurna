import { motion } from "motion/react";
import Link from "next/link";
import { Home } from "lucide-react";

interface FloatingNavProps {
  activeTab: "features" | "tracking" | "bidding" | "home";
}

export function FloatingNav({ activeTab }: FloatingNavProps) {
  const tabs = [
    { id: "features", label: "Features", href: "/features" },
    { id: "tracking", label: "Tracking", href: "/tracking" },
    { id: "bidding", label: "Bidding", href: "/bidding" },
  ] as const;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[400px]">
      <div className="flex items-center justify-between p-1 rounded-full bg-black/40 backdrop-blur-[40px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative">
        <Link
          href="/"
          className={`relative flex items-center justify-center px-4 py-2.5 text-sm font-medium transition-colors duration-300 z-10 ${
            activeTab === "home" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          {activeTab === "home" && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 bg-[#007AFF] rounded-full"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
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
              className={`relative flex-1 text-center px-4 py-2.5 text-sm font-medium transition-colors duration-300 z-10 ${
                isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-[#007AFF] rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
