import { motion } from "motion/react";

interface FloatingNavProps {
  activeTab: "features" | "tracking" | "bidding";
  setActiveTab: (tab: "features" | "tracking" | "bidding") => void;
}

export function FloatingNav({ activeTab, setActiveTab }: FloatingNavProps) {
  const tabs = [
    { id: "features", label: "Features" },
    { id: "tracking", label: "Tracking" },
    { id: "bidding", label: "Bidding" },
  ] as const;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[340px]">
      <div className="flex items-center justify-between p-1 rounded-full bg-black/40 backdrop-blur-[40px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 px-4 py-2.5 text-sm font-medium transition-colors duration-300 z-10 ${
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
            </button>
          );
        })}
      </div>
    </div>
  );
}
