"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "motion/react";

const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Pune", "Nashik", "Kolhapur", "Nagpur",
  "Ahmedabad", "Bengaluru", "Chennai", "Hyderabad", "Jaipur", "Lucknow",
  "Kalyan", "Thane", "Navi Mumbai", "Ratnagiri", "Solapur", "Aurangabad"
];

export default function Home() {
  const { login } = useAuth();
  const [role, setRole] = useState<"director" | "wholesaler">("director");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const requestLocation = () => {
    setGeoStatus("loading");
    if (!navigator.geolocation) {
      setGeoStatus("error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus("success");
      },
      () => setGeoStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) return;
    if (role === "wholesaler" && (!city.trim() || !address.trim())) {
      setError("City and delivery address are required.");
      return;
    }
    const loc = role === "wholesaler" ? `${address}, ${city}` : location;
    const err = login(name, role, password, loc, city, address, coords || undefined);
    if (err) setError(err);
  };

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#050505]">
      {/* Background */}
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
        {/* Logo */}
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
          <p className="text-white/50 text-lg max-w-sm mx-auto leading-relaxed font-medium tracking-wide">Cold Chain Intelligence</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          {/* Role Selector */}
          <div className="mb-8 relative z-10">
            <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl relative shadow-inner">
              <motion.div
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white/10 rounded-xl shadow-sm border border-white/5 backdrop-blur-lg"
                animate={{ x: role === "director" ? "0%" : "100%" }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
              <button type="button" onClick={() => setRole("director")} className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-colors z-10 ${role === "director" ? "text-white" : "text-white/40 hover:text-white/70"}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" /></svg>
                Fleet Director
              </button>
              <button type="button" onClick={() => setRole("wholesaler")} className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-colors z-10 ${role === "wholesaler" ? "text-white" : "text-white/40 hover:text-white/70"}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349" /></svg>
                Wholesaler
              </button>
            </div>
          </div>

          <div className="space-y-5 relative z-10">
            {/* Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white/70 ml-1">
                {role === "director" ? "Logistics Company Name" : "Business Name"}
              </label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder={role === "director" ? "e.g. BlueDart Logistics" : "e.g. Fresh Foods Co."}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/50 focus:border-[#007AFF]/50 transition-all shadow-inner"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white/70 ml-1">
                Password <span className="text-white/30 font-normal">(Login or Create New)</span>
              </label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/50 focus:border-[#007AFF]/50 transition-all shadow-inner"
              />
            </div>

            {/* Fleet Director: GPS Location */}
            <AnimatePresence>
              {role === "director" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <label className="block mb-2 text-sm font-medium text-white/70 ml-1">Truck Live Location</label>
                  <button type="button" onClick={requestLocation}
                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl border text-sm font-semibold transition-all ${
                      geoStatus === "success"
                        ? "bg-[#34C759]/10 border-[#34C759]/30 text-[#34C759]"
                        : geoStatus === "error"
                        ? "bg-[#FF3B30]/10 border-[#FF3B30]/30 text-[#FF3B30]"
                        : geoStatus === "loading"
                        ? "bg-[#007AFF]/10 border-[#007AFF]/30 text-[#007AFF] animate-pulse"
                        : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    {geoStatus === "success" && coords
                      ? `📍 Location: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
                      : geoStatus === "loading"
                      ? "Detecting location..."
                      : geoStatus === "error"
                      ? "Location access denied — tap to retry"
                      : "Enable GPS Location Access"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Wholesaler: City + Address */}
            <AnimatePresence>
              {role === "wholesaler" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-5">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-white/70 ml-1">City</label>
                    <select value={city} onChange={(e) => setCity(e.target.value)} required
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#34C759]/50 focus:border-[#34C759]/50 transition-all shadow-inner appearance-none"
                    >
                      <option value="" className="bg-black text-white/40">Select your city</option>
                      {INDIAN_CITIES.map((c) => (
                        <option key={c} value={c} className="bg-black text-white">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-white/70 ml-1">Delivery Address</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Vashi APMC Market, Shop No. 42"
                      required
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#34C759]/50 focus:border-[#34C759]/50 transition-all shadow-inner"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mt-5 p-4 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-xl">
                  <p className="text-sm text-[#FF3B30] font-medium text-center">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button type="submit"
            className={`w-full mt-8 py-4 rounded-xl text-[17px] font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 relative overflow-hidden group ${
              role === "director"
                ? "bg-gradient-to-b from-[#007AFF] to-[#005bb5] border border-[#007AFF]"
                : "bg-gradient-to-b from-[#34C759] to-[#248a3d] border border-[#34C759]"
            }`}
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
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
