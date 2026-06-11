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
    <main className="min-h-dvh flex flex-col items-center justify-center p-6 bg-[#F2F2F7]">
      {/* Logo & Title */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 mx-auto mb-5 rounded-[22px] bg-gradient-to-br from-[#007AFF]/15 to-[#34C759]/15 flex items-center justify-center shadow-sm">
          <svg className="w-10 h-10 text-[#007AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
        </div>
        <h1 className="ios-large-title mb-2">Annapurna</h1>
        <p className="text-[#8E8E93] text-[17px] max-w-sm mx-auto leading-relaxed">
          AI-Powered Cold Chain Intelligence
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="ios-card p-6 max-w-md w-full mx-4">
        {/* Role Selector */}
        <div className="mb-6">
          <label className="ios-footnote block mb-3 font-medium uppercase tracking-wider">Select Portal</label>
          <div className="ios-segment">
            <button
              type="button"
              onClick={() => setRole("director")}
              className={`ios-segment-item ${role === "director" ? "active" : ""}`}
            >
              <svg className="w-4 h-4 inline mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
              </svg>
              Fleet Director
            </button>
            <button
              type="button"
              onClick={() => setRole("wholesaler")}
              className={`ios-segment-item ${role === "wholesaler" ? "active" : ""}`}
            >
              <svg className="w-4 h-4 inline mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349" />
              </svg>
              Wholesaler
            </button>
          </div>
        </div>

        {/* Name Field */}
        <div className="mb-4">
          <label className="ios-footnote block mb-1.5 font-medium">
            {role === "director" ? "Logistics Company Name" : "Business Name"}
          </label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={role === "director" ? "e.g. BlueDart Logistics" : "e.g. Fresh Foods Co."}
            required
            className="ios-input" 
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="ios-footnote block mb-1.5 font-medium">
            Password (Login or Create New)
          </label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="ios-input" 
          />
        </div>

        {/* Location Field (Wholesaler only) */}
        {role === "wholesaler" && (
          <div className="mb-4">
            <label className="ios-footnote block mb-1.5 font-medium">
              Store Location / Delivery Address
            </label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Vashi APMC Market, Navi Mumbai"
              required={role === "wholesaler"}
              className="ios-input" 
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-[#FF3B30]/10 rounded-lg">
            <p className="text-[15px] text-[#FF3B30] font-medium text-center">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button type="submit" className={`w-full btn text-[17px] mt-2 ${role === "director" ? "btn-primary" : "btn-success"}`}>
          Sign In
        </button>
      </form>

      {/* Bottom info */}
      <div className="mt-8 flex items-center gap-6 text-center">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-lg font-bold text-[#007AFF]">Live Sync</p>
          <p className="text-[12px] text-[#8E8E93]">Cross-Device</p>
        </div>
        <div className="w-px h-8 bg-[#C6C6C8]" />
        <div>
          <p className="font-[family-name:var(--font-mono)] text-lg font-bold text-[#34C759]">Real Data</p>
          <p className="text-[12px] text-[#8E8E93]">Supabase Connected</p>
        </div>
      </div>
    </main>
  );
}
