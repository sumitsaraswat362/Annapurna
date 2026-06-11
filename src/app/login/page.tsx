"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "motion/react";

export default function Home() {
  const { login } = useAuth();
  const [role, setRole] = useState<"director" | "wholesaler">("director");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && password.trim()) {
      if (role === "wholesaler" && !location.trim()) {
        setError("Location is required for wholesalers.");
        return;
      }
      const err = login(name, role, password, location);
      if (err) setError(err);
    }
  };

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#050505]">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-screen" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#007AFF] blur-[180px] opacity-20 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#34C759] blur-[180px] opacity-20 animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo & Title */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="w-24 h-24 mx-auto mb-6 rounded-[28px] bg-gradient-to-br from-[#007AFF]/20 to-[#34C759]/20 flex items-center justify-center shadow-[0_0_50px_rgba(0,122,255,0.15)] border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <svg className="w-12 h-12 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3 bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent drop-shadow-sm">Annapurna</h1>
          <p className="text-white/50 text-lg max-w-sm mx-auto leading-relaxed font-medium tracking-wide">
            Cold Chain Intelligence
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          {/* Role Selector */}
          <div className="mb-8 relative z-10">
            <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl relative shadow-inner">
              {/* Highlight background */}
              <motion.div 
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white/10 rounded-xl shadow-sm border border-white/5 backdrop-blur-lg"
                animate={{ 
                  x: role === "director" ? "0%" : "100%",
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
              
              <button
                type="button"
                onClick={() => setRole("director")}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-colors z-10 ${role === "director" ? "text-white drop-shadow-md" : "text-white/40 hover:text-white/70"}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
                </svg>
                Fleet Director
              </button>
              <button
                type="button"
                onClick={() => setRole("wholesaler")}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-colors z-10 ${role === "wholesaler" ? "text-white drop-shadow-md" : "text-white/40 hover:text-white/70"}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349" />
                </svg>
                Wholesaler
              </button>
            </div>
          </div>

          <div className="space-y-5 relative z-10">
            {/* Name Field */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white/70 ml-1">
                {role === "director" ? "Logistics Company Name" : "Business Name"}
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === "director" ? "e.g. BlueDart Logistics" : "e.g. Fresh Foods Co."}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/50 focus:border-[#007AFF]/50 transition-all shadow-inner" 
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white/70 ml-1">
                Password <span className="text-white/30 font-normal">(Login or Create New)</span>
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/50 focus:border-[#007AFF]/50 transition-all shadow-inner" 
              />
            </div>

            {/* Location Field (Wholesaler only) */}
            <AnimatePresence>
              {role === "wholesaler" && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block mb-2 text-sm font-medium text-white/70 ml-1">
                    Store Location / Delivery Address
                  </label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Vashi APMC Market, Navi Mumbai"
                    required={role === "wholesaler"}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#34C759]/50 focus:border-[#34C759]/50 transition-all shadow-inner" 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-5 p-4 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-xl">
                  <p className="text-sm text-[#FF3B30] font-medium text-center">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button 
            type="submit" 
            className={`w-full mt-8 py-4 rounded-xl text-[17px] font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 relative overflow-hidden group ${role === "director" ? "bg-gradient-to-b from-[#007AFF] to-[#005bb5] border border-[#007AFF]" : "bg-gradient-to-b from-[#34C759] to-[#248a3d] border border-[#34C759]"}`}
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[scan_1.5s_ease-in-out_infinite]" />
            Sign In Securely
          </button>
        </form>

        {/* Bottom info */}
        <div className="mt-10 flex items-center justify-center gap-8 text-center">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-sm font-bold text-white/80">Live Sync</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Cross-Device</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className="font-[family-name:var(--font-mono)] text-sm font-bold text-white/80">Real Data</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Supabase Edge</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
