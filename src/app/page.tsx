"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";

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
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-500/8 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-t from-emerald-500/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Logo & Title */}
      <div className="text-center mb-12 relative z-10">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-white/10 flex items-center justify-center backdrop-blur-xl">
          <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-emerald-400 bg-clip-text text-transparent">
            Annapurna System Login
          </span>
        </h1>
        <p className="text-[#8c909f] text-lg max-w-md mx-auto leading-relaxed">
          Select your portal and identity to access the live simulation network.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="glass-card p-8 max-w-md w-full relative z-10 shadow-2xl">
        <div className="mb-6">
          <label className="text-xs font-bold text-[#8c909f] uppercase tracking-widest mb-3 block">Select Portal</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole("director")}
              className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${
                role === "director" 
                  ? "bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
                  : "bg-black/20 border-white/5 text-[#8c909f] hover:border-white/20 hover:text-[#e2e2eb]"
              }`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
              </svg>
              <span className="text-sm font-semibold">Fleet Director</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("wholesaler")}
              className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${
                role === "wholesaler" 
                  ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                  : "bg-black/20 border-white/5 text-[#8c909f] hover:border-white/20 hover:text-[#e2e2eb]"
              }`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
              </svg>
              <span className="text-sm font-semibold">Wholesaler</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-xs font-bold text-[#8c909f] uppercase tracking-widest mb-2 block">
            {role === "director" ? "Logistics Company Name" : "Business Name"}
          </label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={role === "director" ? "e.g. BlueDart Logistics" : "e.g. Fresh Foods Co."}
            required
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-[#e2e2eb] text-sm focus:border-blue-500/50 outline-none transition-colors mb-4" 
          />

          <label className="text-xs font-bold text-[#8c909f] uppercase tracking-widest mb-2 block">
            Password (Login or Create New)
          </label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-[#e2e2eb] text-sm focus:border-blue-500/50 outline-none transition-colors mb-4" 
          />

          {role === "wholesaler" && (
            <>
              <label className="text-xs font-bold text-[#8c909f] uppercase tracking-widest mb-2 block">
                Store Location / Delivery Address
              </label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Vashi APMC Market, Navi Mumbai"
                required={role === "wholesaler"}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-[#e2e2eb] text-sm focus:border-emerald-500/50 outline-none transition-colors" 
              />
            </>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400 font-medium text-center">{error}</p>
          </div>
        )}

        <button type="submit" className={`w-full btn py-3 text-base ${role === "director" ? "btn-primary" : "btn-success"}`}>
          Initialize Session
        </button>
      </form>

      {/* Stats bar */}
      <div className="mt-12 flex items-center gap-8 text-center relative z-10">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-blue-400">Multiplayer</p>
          <p className="text-[10px] text-[#8c909f] uppercase tracking-wider mt-1">Cross-Device Sync Active</p>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div>
          <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-emerald-400">Zero</p>
          <p className="text-[10px] text-[#8c909f] uppercase tracking-wider mt-1">Mock Data Mode</p>
        </div>
      </div>
    </main>
  );
}
