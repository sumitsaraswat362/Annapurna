"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useAppState } from "@/lib/store";
import { getSimulationFrame, calculateSpoilageTime, shouldTriggerEmergency, getTotalFrames } from "@/lib/simulator";
import { makeDecision } from "@/lib/ai-agent";
import CargoHealthMonitor from "@/components/CargoHealthMonitor";
import AIDecisionCard from "@/components/AIDecisionCard";
import BidCard from "@/components/BidCard";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

// ============================================================================
// ICONS & NAVIGATION
// ============================================================================
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "fleet", label: "Fleet Tracking", icon: "truck" },
  { id: "alerts", label: "Active Alerts", icon: "bell" },
  { id: "marketplace", label: "Marketplace", icon: "store" },
  { id: "analytics", label: "Analytics", icon: "chart" },
  { id: "settings", label: "Settings", icon: "gear" },
];

function NavIcon({ icon, className = "" }: { icon: string; className?: string }) {
  const c = `w-5 h-5 ${className}`;
  switch (icon) {
    case "grid": return <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" /></svg>;
    case "truck": return <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>;
    case "bell": return <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>;
    case "store": return <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" /></svg>;
    case "chart": return <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>;
    case "gear": return <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
    case "shield": return <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
    default: return null;
  }
}

// ============================================================================
// MAIN LAYOUT
// ============================================================================
export default function FleetApp() {
  const { state, dispatch } = useAppState();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("fleet"); // Default to fleet for hackathon

  // Derived state for sidebar badges
  const emergencyCount = state.cargos.filter((c) => c.status === "emergency" || c.status === "rerouting").length;
  const newBidsCount = state.bids.filter((b) => b.status === "pending").length;
  const unreadAlerts = state.notifications.filter((n) => !n.read).length;

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0c12]">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-[280px] h-full glass-card rounded-none border-t-0 border-b-0 border-l-0 flex flex-col shrink-0 z-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 p-6 border-b border-white/5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <div>
            <p className="text-base font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Annapurna</p>
            <p className="text-[11px] font-medium text-[#8c909f] uppercase tracking-wider mt-0.5">Fleet Command</p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeNav === item.id
                  ? "bg-blue-500/10 text-blue-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-blue-500/20"
                  : "text-[#8c909f] hover:text-[#e2e2eb] hover:bg-white/5 border border-transparent"
              }`}
            >
              <NavIcon icon={item.icon} className={activeNav === item.id ? "text-blue-400" : "text-[#8c909f]"} />
              <span>{item.label}</span>
              {item.id === "alerts" && unreadAlerts > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold shadow-[0_0_12px_rgba(239,68,68,0.5)]">
                  {unreadAlerts}
                </span>
              )}
              {item.id === "marketplace" && newBidsCount > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {newBidsCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-white/5">
          <div onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl glass-card-hover cursor-pointer border border-transparent hover:border-red-500/30 hover:bg-red-500/5 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-emerald-500/30 border border-white/20 flex items-center justify-center text-sm font-bold text-white shadow-lg group-hover:border-red-500/50">
              {user?.name?.charAt(0).toUpperCase() || "D"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#e2e2eb] truncate group-hover:text-red-400">{user?.name || "Director"}</p>
              <p className="text-xs text-[#8c909f] truncate">Logistics Director</p>
            </div>
            <svg className="w-4 h-4 text-[#8c909f] group-hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT WRAPPER ===== */}
      <main className="flex-1 h-full overflow-y-auto relative z-10">
        {/* Top Bar Background Blur */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0a0c12] to-transparent pointer-events-none z-10" />
        
        <div className="p-8 pt-10 min-h-full">
          {/* View Router */}
          <div className="view-transition-enter-active">
            {activeNav === "dashboard" && <DashboardView />}
            {activeNav === "fleet" && <FleetTrackingView />}
            {activeNav === "alerts" && <AlertsView />}
            {activeNav === "marketplace" && <MarketplaceView />}
            {activeNav === "analytics" && <AnalyticsView />}
            {activeNav === "settings" && <SettingsView />}
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// VIEW 1: DASHBOARD (Overview)
// ============================================================================
function DashboardView() {
  const { state } = useAppState();
  
  const totalCargos = state.cargos.length;
  const totalValue = state.cargos.reduce((acc, c) => acc + c.estimatedCargoValue, 0);
  const emergencyCargos = state.cargos.filter((c) => c.status === "emergency").length;
  const reroutedCargos = state.cargos.filter((c) => c.status === "rerouting").length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-[#f8f9fa] tracking-tight">System Overview</h1>
        <p className="text-[#8c909f] mt-1">Real-time aggregate view of your entire logistics network.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 glass-card-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <NavIcon icon="truck" className="w-16 h-16 text-blue-400" />
          </div>
          <p className="text-xs font-semibold text-[#8c909f] uppercase tracking-wider mb-2">Active Fleet</p>
          <p className="text-4xl font-[family-name:var(--font-mono)] font-bold text-[#e2e2eb]">{totalCargos}</p>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" /></svg>
            All systems nominal
          </p>
        </div>

        <div className="glass-card p-6 glass-card-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-16 h-16 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
          </div>
          <p className="text-xs font-semibold text-[#8c909f] uppercase tracking-wider mb-2">Total Cargo Value</p>
          <p className="text-4xl font-[family-name:var(--font-mono)] font-bold text-emerald-400">₹{(totalValue / 100000).toFixed(2)}L</p>
          <p className="text-xs text-[#8c909f] mt-2 font-medium">Insured up to ₹1.0Cr</p>
        </div>

        <div className={`glass-card p-6 relative overflow-hidden transition-all duration-500 ${emergencyCargos > 0 ? 'border-red-500/40 glow-red' : 'glass-card-hover'}`}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <NavIcon icon="bell" className={`w-16 h-16 ${emergencyCargos > 0 ? 'text-red-400' : 'text-amber-400'}`} />
          </div>
          <p className="text-xs font-semibold text-[#8c909f] uppercase tracking-wider mb-2">Critical Alerts</p>
          <p className={`text-4xl font-[family-name:var(--font-mono)] font-bold ${emergencyCargos > 0 ? 'text-red-400 animate-pulse-danger' : 'text-[#e2e2eb]'}`}>{emergencyCargos}</p>
          <p className="text-xs text-[#8c909f] mt-2 font-medium">Requiring immediate attention</p>
        </div>

        <div className="glass-card p-6 glass-card-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <NavIcon icon="shield" className="w-16 h-16 text-blue-400" />
          </div>
          <p className="text-xs font-semibold text-[#8c909f] uppercase tracking-wider mb-2">Cargos Saved</p>
          <p className="text-4xl font-[family-name:var(--font-mono)] font-bold text-blue-400">{reroutedCargos}</p>
          <p className="text-xs text-blue-400 mt-2 font-medium">Autonomously rerouted</p>
        </div>
      </div>

      {/* Large visual placeholder for Dashboard */}
      <div className="glass-card p-8 h-96 flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-emerald-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="text-center relative z-10">
          <div className="w-24 h-24 mx-auto bg-black/40 rounded-3xl border border-white/10 flex items-center justify-center mb-6 shadow-2xl backdrop-blur-xl">
            <svg className="w-12 h-12 text-blue-400 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#e2e2eb] mb-2">Network Topology Map</h3>
          <p className="text-[#8c909f] max-w-sm mx-auto">
            Comprehensive multi-node visualization is disabled in demo mode. Switch to the Fleet Tracking tab to run the single-vehicle simulation.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VIEW 2: FLEET TRACKING (The Core Simulation View)
// ============================================================================
function FleetTrackingView() {
  const { state, dispatch } = useAppState();
  const [selectedCargoId, setSelectedCargoId] = useState("cargo-001");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [emergencyTriggered, setEmergencyTriggered] = useState(false);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMarketModal, setShowMarketModal] = useState(false);
  const [activeMapBid, setActiveMapBid] = useState<Bid | null>(null);
  const [driverLocation, setDriverLocation] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>("");

  // Add Cargo Form States
  const [newPlate, setNewPlate] = useState("MH-04-XX-9999");
  const [newType, setNewType] = useState("Apples");
  const [newQty, setNewQty] = useState(5000);

  // Market Listing States
  const [askingPrice, setAskingPrice] = useState(25);

  const selectedCargo = state.cargos.find((c) => c.id === selectedCargoId);
  const latestDecision = state.aiDecisions.filter((d) => d.cargoId === selectedCargoId).at(-1) ?? null;
  const cargoBids = state.bids.filter((b) => b.cargoId === selectedCargoId);

  const startSimulation = useCallback(() => {
    if (intervalRef.current) return;
    dispatch({ type: "START_SIMULATION" });

    let step = 0;
    intervalRef.current = setInterval(async () => {
      if (step >= getTotalFrames()) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      const frame = getSimulationFrame(step);
      dispatch({ type: "UPDATE_TELEMETRY", cargoId: "cargo-001", telemetry: frame });

      const spoilageMin = calculateSpoilageTime(frame.temperature, 10, frame.ethyleneLevel);

      if (frame.temperature > 10 && !emergencyTriggered) {
        dispatch({ type: "UPDATE_CARGO_STATUS", cargoId: "cargo-001", status: "warning", spoilageMinutes: spoilageMin });
      }

      if (shouldTriggerEmergency(spoilageMin, 260) && !emergencyTriggered) {
        setEmergencyTriggered(true);
        dispatch({ type: "UPDATE_CARGO_STATUS", cargoId: "cargo-001", status: "emergency", spoilageMinutes: spoilageMin });

        const cargo = state.cargos.find((c) => c.id === "cargo-001");
        if (cargo) {
          const updatedCargo = { ...cargo, telemetry: frame, status: "emergency" as const, spoilageTimeMinutes: spoilageMin };
          const decision = await makeDecision(updatedCargo);
          dispatch({ type: "ADD_AI_DECISION", decision });
          dispatch({ type: "SET_ASKING_PRICE", cargoId: "cargo-001", pricePerKg: 16 });
          dispatch({ type: "BROADCAST_TO_MARKETPLACE", cargoId: "cargo-001" });
          dispatch({
            type: "ADD_NOTIFICATION",
            notification: {
              id: `notif-${Date.now()}`,
              type: "system",
              title: "🚨 Emergency Liquidation Mode",
              message: "Cold chain failure on KA-01-AB-1234. AI recommending reroute to Kalyan Wholesale Market.",
              timestamp: Date.now(),
              read: false,
            },
          });
        }
      }

      dispatch({ type: "ADVANCE_SIMULATION" });
      step++;
    }, 2000);
  }, [dispatch, emergencyTriggered, state.cargos]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleAcceptBid = (bidId: string) => {
    dispatch({ type: "ACCEPT_BID", bidId, cargoId: selectedCargoId });
    const acceptedBid = state.bids.find(b => b.id === bidId);
    if (acceptedBid) {
      setActiveMapBid(acceptedBid);
      
      // Request Driver's Real-Time GPS Location
      if ("geolocation" in navigator) {
        setLocationStatus("Detecting truck GPS coordinates...");
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setDriverLocation(`${position.coords.latitude},${position.coords.longitude}`);
            setLocationStatus("Live GPS Locked ✅");
          },
          (error) => {
            console.error("Error getting location:", error);
            setLocationStatus("GPS signal lost. Using approximate origin.");
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        setLocationStatus("GPS hardware not available.");
      }
    }
    
    dispatch({
      type: "ADD_NOTIFICATION",
      notification: {
        id: `notif-accept-${Date.now()}`,
        type: "bid_accepted",
        title: "✅ Bid Accepted",
        message: `Truck is being rerouted. Updated ETA sent to wholesaler.`,
        timestamp: Date.now(),
        read: false,
      },
    });
  };

  const handleRejectBid = (bidId: string) => dispatch({ type: "UPDATE_BID_STATUS", bidId, status: "rejected" });
  const handleCounterBid = (bidId: string, counterPrice: number) => dispatch({ type: "UPDATE_BID_STATUS", bidId, status: "counter_offered", counterPrice });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#f8f9fa] tracking-tight">Active Operations</h1>
          <p className="text-[#8c909f] mt-1">Live telemetry and AI oversight for {state.cargos.length} vehicles in transit.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowAddModal(true)} className="btn btn-success">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            New Consignment
          </button>
          <button
            onClick={startSimulation}
            disabled={state.simulationRunning}
            className={`btn ${state.simulationRunning ? "bg-red-500/10 text-red-400 border-red-500/20 cursor-not-allowed" : "btn-danger"}`}
          >
            {state.simulationRunning ? (
              <><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-dot" /> Simulating Failure...</>
            ) : (
              <><NavIcon icon="shield" className="w-4 h-4" /> Auto-Simulate Script</>
            )}
          </button>
        </div>
      </header>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* ===== LEFT COLUMN (60%) ===== */}
        <div className="flex-[3] space-y-6 flex flex-col min-w-0">
          {/* Map Area */}
          <div className="glass-card p-6 relative overflow-hidden flex-shrink-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-[#e2e2eb] uppercase tracking-widest flex items-center gap-2">
                <NavIcon icon="grid" className="w-4 h-4 text-blue-400" /> Live Vector Map
              </h3>
              <span className="badge badge-info shadow-[0_0_12px_rgba(59,130,246,0.3)]">● GPS Sync Active</span>
            </div>
            
            {/* Map Placeholder */}
            <div className="relative bg-[#050608] rounded-xl h-64 border border-white/5 overflow-hidden shadow-inner">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
              
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 260">
                <path d="M 50 220 Q 120 180, 180 150 Q 240 120, 280 100" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
                
                {selectedCargo?.status === "rerouting" || selectedCargo?.status === "emergency" ? (
                  <>
                    <path d="M 280 100 Q 350 70, 420 50 Q 490 30, 550 40" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="8 6" opacity="0.15" />
                    <path d="M 280 100 Q 310 130, 340 145" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9" />
                    <circle cx="340" cy="145" r="6" fill="#ef4444" opacity="0.3" className="animate-pulse-dot" />
                    <circle cx="340" cy="145" r="3" fill="#ef4444" />
                    <text x="350" y="150" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">Kalyan Mandi</text>
                  </>
                ) : (
                  <path d="M 280 100 Q 350 70, 420 50 Q 490 30, 550 40" stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="8 6" opacity="0.5" />
                )}

                <circle cx="280" cy="100" r="8" fill={selectedCargo?.status === "emergency" ? "#ef4444" : "#3b82f6"} opacity="0.2" className="animate-pulse-dot" />
                <circle cx="280" cy="100" r="4" fill={selectedCargo?.status === "emergency" ? "#ef4444" : "#3b82f6"} />

                <circle cx="50" cy="220" r="4" fill="#10b981" />
                <text x="60" y="225" fill="#8c909f" fontSize="10" fontFamily="monospace">Nashik</text>
                <circle cx="550" cy="40" r="4" fill="#3b82f6" opacity="0.5" />
                <text x="500" y="35" fill="#8c909f" fontSize="10" fontFamily="monospace">Mumbai</text>
              </svg>
            </div>

            {/* Route Info Bar */}
            {selectedCargo && (
              <div className="mt-4 flex items-center gap-4 text-xs font-medium text-[#8c909f] bg-black/20 p-3 rounded-lg border border-white/5">
                <span className="flex items-center gap-2 text-[#e2e2eb]"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" /> {selectedCargo.origin.name}</span>
                <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                {selectedCargo.status === "rerouting" && selectedCargo.selectedMarket ? (
                  <span className="flex items-center gap-2 text-emerald-400 font-bold"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" /> {selectedCargo.selectedMarket.name} (Rerouted)</span>
                ) : selectedCargo.status === "emergency" ? (
                  <span className="flex items-center gap-2 text-red-400 font-bold"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-dot" /> {selectedCargo.originalDestination.name} (At Risk)</span>
                ) : (
                  <span className="flex items-center gap-2 text-[#e2e2eb]"><span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" /> {selectedCargo.originalDestination.name}</span>
                )}
              </div>
            )}
          </div>

          {/* Active Fleet List */}
          <div className="flex-1 overflow-y-auto pr-2 pb-4">
            <h3 className="text-sm font-bold text-[#e2e2eb] uppercase tracking-widest mb-4 flex items-center gap-2">
              <NavIcon icon="truck" className="w-4 h-4 text-[#8c909f]" /> Active Consignments
            </h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {state.cargos.map((cargo) => (
                <button
                  key={cargo.id}
                  onClick={() => setSelectedCargoId(cargo.id)}
                  className={`glass-card p-5 text-left transition-all duration-300 ${
                    selectedCargoId === cargo.id ? "border-blue-500/50 glow-blue bg-blue-500/5" : "glass-card-hover"
                  } ${cargo.status === "emergency" ? "border-red-500/50 glow-red" : ""} ${
                    cargo.status === "rerouting" ? "border-emerald-500/50 glow-green" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-[family-name:var(--font-mono)] text-xs font-bold text-[#c2c6d6] bg-black/40 px-2 py-1 rounded border border-white/5 tracking-wider">
                      {cargo.truckPlate}
                    </span>
                    <span className={`badge ${cargo.status === "in_transit" ? "badge-safe" : cargo.status === "warning" ? "badge-warning" : cargo.status === "emergency" ? "badge-danger" : cargo.status === "rerouting" ? "badge-safe" : "badge-info"}`}>
                      {cargo.status === "in_transit" ? "In Transit" : cargo.status === "rerouting" ? "✓ Rerouting" : cargo.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-base font-bold text-[#f8f9fa] capitalize tracking-tight">
                    {cargo.type} <span className="text-[#8c909f] font-normal mx-1">·</span> {(cargo.quantityKg / 1000).toFixed(1)}T
                  </p>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                    <span className={`font-[family-name:var(--font-mono)] text-sm font-bold flex items-center gap-1.5 ${
                      cargo.telemetry.temperature > cargo.safeTemperatureMax ? "text-red-400" : "text-emerald-400"
                    }`}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.866 8.284 8.284 0 0 0 3 2.48Z" /></svg>
                      {cargo.telemetry.temperature.toFixed(1)}°C
                    </span>
                    <span className="text-xs text-[#8c909f] font-medium flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                      {cargo.originalDestination.name.split(" ")[0]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN (40%) ===== */}
        <div className="flex-[2] overflow-y-auto space-y-6 pb-6 pr-2 min-w-0">
          {selectedCargo && (
            <>
              <CargoHealthMonitor
                temperature={selectedCargo.telemetry.temperature}
                humidity={selectedCargo.telemetry.humidity}
                ethyleneLevel={selectedCargo.telemetry.ethyleneLevel}
                safeMax={selectedCargo.safeTemperatureMax}
                spoilageMinutes={selectedCargo.spoilageTimeMinutes}
              />

              <AIDecisionCard decision={latestDecision} />

              {/* Manual Overrides Control Panel */}
              <div className="glass-card p-5 border-amber-500/30 glow-amber">
                <h3 className="text-sm font-bold text-[#e2e2eb] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" /></svg>
                  Manual Overrides
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      dispatch({ type: "TRIGGER_MANUAL_EMERGENCY", cargoId: selectedCargoId, newTemperature: 18.5 });
                    }}
                    className="w-full btn btn-warning bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                  >
                    Simulate Temp Spike (18.5°C)
                  </button>
                  <button 
                    onClick={() => setShowMarketModal(true)}
                    className="w-full btn btn-primary"
                  >
                    Push to Wholesaler Market
                  </button>
                </div>
              </div>

              {cargoBids.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-sm font-bold text-[#e2e2eb] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <NavIcon icon="store" className="w-4 h-4 text-blue-400" /> Live Bids
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold shadow-[0_0_12px_rgba(59,130,246,0.5)]">
                      {cargoBids.length}
                    </span>
                  </h3>
                  <div className="space-y-4">
                    {cargoBids.map((bid) => (
                      <BidCard 
                        key={bid.id} 
                        bid={bid} 
                        onAccept={handleAcceptBid} 
                        onReject={handleRejectBid} 
                        onCounter={handleCounterBid} 
                        onViewMap={(bidId) => { 
                          const b = state.bids.find(x => x.id === bidId); 
                          if (b) setActiveMapBid(b); 
                        }}
                        onPaymentReceived={(bidId) => dispatch({ type: "UPDATE_BID_STATUS", bidId, status: "payment_cleared" })}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ADD CARGO MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-[#8c909f] hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Register New Consignment</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#8c909f] uppercase tracking-widest mb-1 block">Truck Plate Number</label>
                <input type="text" value={newPlate} onChange={(e) => setNewPlate(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-[#e2e2eb] font-[family-name:var(--font-mono)] text-sm focus:border-blue-500/50 outline-none transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#8c909f] uppercase tracking-widest mb-1 block">Cargo Type</label>
                  <input type="text" value={newType} onChange={(e) => setNewType(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-[#e2e2eb] text-sm focus:border-blue-500/50 outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#8c909f] uppercase tracking-widest mb-1 block">Quantity (kg)</label>
                  <input type="number" value={newQty} onChange={(e) => setNewQty(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-[#e2e2eb] font-[family-name:var(--font-mono)] text-sm focus:border-blue-500/50 outline-none transition-colors" />
                </div>
              </div>
              <button 
                onClick={() => {
                  dispatch({
                    type: "ADD_CARGO",
                    cargo: {
                      id: `cargo-${Date.now()}`,
                      truckPlate: newPlate,
                      type: newType,
                      quantityKg: newQty,
                      estimatedCargoValue: newQty * 50,
                      safeTemperatureMax: 10,
                      spoilageTimeMinutes: 1440,
                      status: "in_transit",
                      origin: { name: "Nashik Hub", lat: 19.99, lng: 73.78 },
                      originalDestination: { name: "Mumbai APMC", lat: 19.07, lng: 72.87 },
                      telemetry: { temperature: 4.2, humidity: 85, ethyleneLevel: "low", gps: { lat: 19.5, lng: 73.2 } }
                    }
                  });
                  setShowAddModal(false);
                }}
                className="w-full btn btn-success mt-2 py-3"
              >
                Launch Consignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MARKETPLACE LISTING MODAL */}
      {showMarketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-md p-6 relative shadow-2xl border-blue-500/30 glow-blue">
            <button onClick={() => setShowMarketModal(false)} className="absolute top-4 right-4 text-[#8c909f] hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-xl font-bold text-white mb-2">Push to Marketplace</h2>
            <p className="text-sm text-[#8c909f] mb-6">Instantly broadcast this cargo to nearby wholesalers for emergency liquidation.</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#8c909f] uppercase tracking-widest mb-1 block">Asking Price (₹ per kg)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[#8c909f] font-bold">₹</span>
                  <input type="number" value={askingPrice} onChange={(e) => setAskingPrice(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 pl-8 text-[#e2e2eb] font-[family-name:var(--font-mono)] text-sm focus:border-blue-500/50 outline-none transition-colors" />
                </div>
              </div>
              
              <button 
                onClick={() => {
                  dispatch({ type: "SET_ASKING_PRICE", cargoId: selectedCargoId, pricePerKg: askingPrice });
                  dispatch({ type: "BROADCAST_TO_MARKETPLACE", cargoId: selectedCargoId });
                  setShowMarketModal(false);
                }}
                className="w-full btn btn-primary mt-2 py-3"
              >
                Broadcast to Market
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAP REROUTE MODAL */}
      {activeMapBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-4xl p-6 relative shadow-2xl border-emerald-500/30 glow-green">
            <button onClick={() => setActiveMapBid(null)} className="absolute top-4 right-4 text-[#8c909f] hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
              Rerouting Driver
            </h2>
            <p className="text-sm text-[#8c909f] mb-2">Live navigation instructions transmitted to Truck {selectedCargo?.truckPlate || "Unknown"}. Destination: {activeMapBid.wholesalerLocation}</p>
            <p className="text-xs font-bold text-emerald-400 mb-6 bg-emerald-500/10 inline-block px-3 py-1.5 rounded-full border border-emerald-500/20">
              {locationStatus || "Initializing GPS tracking module..."}
            </p>
            
            <div className="w-full h-96 rounded-xl overflow-hidden border border-white/10 mb-6 bg-black/50 relative">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://maps.google.com/maps?${driverLocation ? `saddr=${driverLocation}&daddr=${encodeURIComponent(activeMapBid.wholesalerLocation)}` : `q=${encodeURIComponent(activeMapBid.wholesalerLocation)}`}&t=&z=10&ie=UTF8&iwloc=&output=embed`} 
                frameBorder="0" 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0}
              ></iframe>
              {/* Overlay targeting crosshair aesthetic */}
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]" />
            </div>
            <div className="flex gap-4">
              <a 
                href={`https://www.google.com/maps/dir/?api=1${driverLocation ? `&origin=${driverLocation}` : ''}&destination=${encodeURIComponent(activeMapBid.wholesalerLocation)}&travelmode=driving`}
                target="_blank"
                rel="noreferrer"
                className="w-full btn btn-success py-3 text-center flex items-center justify-center gap-2 font-bold"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                Launch Truck Navigation
              </a>
              <button 
                onClick={() => {
                  setActiveMapBid(null);
                  setDriverLocation(null);
                  setLocationStatus("");
                }}
                className="w-full btn glass-card hover:bg-white/5 py-3 font-semibold text-[#8c909f]"
              >
                Close Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// VIEW 3: ACTIVE ALERTS
// ============================================================================
function AlertsView() {
  const { state } = useAppState();
  
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 border-b border-white/5 pb-6">
        <h1 className="text-3xl font-bold text-[#f8f9fa] tracking-tight">Active Alerts & Event Log</h1>
        <p className="text-[#8c909f] mt-1">System notifications, AI interventions, and critical warnings.</p>
      </header>

      {state.notifications.length === 0 ? (
        <div className="glass-card p-16 text-center border-dashed">
          <NavIcon icon="bell" className="w-12 h-12 text-[#8c909f] mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-[#e2e2eb]">No alerts to display</h3>
          <p className="text-[#8c909f] mt-2 text-sm">All systems are nominal. Critical alerts will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          {state.notifications.map((notif, i) => (
            <div key={notif.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Timeline dot */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0a0c12] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_1px_rgba(255,255,255,0.1)] z-10 ${
                notif.type === 'system' ? 'bg-red-500 glow-red' :
                notif.type === 'new_cargo' ? 'bg-blue-500 glow-blue' : 'bg-emerald-500 glow-green'
              }`}>
                <NavIcon icon={notif.type === 'system' ? 'shield' : notif.type === 'new_cargo' ? 'truck' : 'store'} className="w-4 h-4 text-white" />
              </div>
              
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-5 glass-card-hover transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    notif.type === 'system' ? 'text-red-400' :
                    notif.type === 'new_cargo' ? 'text-blue-400' : 'text-emerald-400'
                  }`}>{notif.type.replace('_', ' ')}</span>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-[#8c909f]">
                    {new Date(notif.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#e2e2eb] mb-1">{notif.title}</h4>
                <p className="text-sm text-[#8c909f] leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// VIEW 4: MARKETPLACE HISTORY
// ============================================================================
function MarketplaceView() {
  const { state } = useAppState();
  
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#f8f9fa] tracking-tight">Marketplace Activity</h1>
        <p className="text-[#8c909f] mt-1">Review all incoming wholesaler bids and negotiation history.</p>
      </header>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-6 py-4 text-xs font-bold text-[#c2c6d6] uppercase tracking-widest">Wholesaler</th>
              <th className="px-6 py-4 text-xs font-bold text-[#c2c6d6] uppercase tracking-widest">Cargo ID</th>
              <th className="px-6 py-4 text-xs font-bold text-[#c2c6d6] uppercase tracking-widest">Price/kg</th>
              <th className="px-6 py-4 text-xs font-bold text-[#c2c6d6] uppercase tracking-widest">Quantity</th>
              <th className="px-6 py-4 text-xs font-bold text-[#c2c6d6] uppercase tracking-widest">Total Value</th>
              <th className="px-6 py-4 text-xs font-bold text-[#c2c6d6] uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {state.bids.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-[#8c909f]">
                  No bids recorded in the current session. Run a simulation to generate activity.
                </td>
              </tr>
            ) : (
              state.bids.map((bid) => (
                <tr key={bid.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/20">
                        {bid.wholesalerName.charAt(0)}
                      </div>
                      <span className="font-medium text-[#e2e2eb]">{bid.wholesalerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-[family-name:var(--font-mono)] text-xs text-[#8c909f]">{bid.cargoId}</td>
                  <td className="px-6 py-4 font-[family-name:var(--font-mono)] text-sm font-bold text-emerald-400">₹{bid.offeredPricePerKg}</td>
                  <td className="px-6 py-4 font-[family-name:var(--font-mono)] text-sm text-[#e2e2eb]">{(bid.requestedQuantityKg/1000).toFixed(1)}T</td>
                  <td className="px-6 py-4 font-[family-name:var(--font-mono)] text-sm font-bold text-blue-400">₹{(bid.totalValue/1000).toFixed(0)}K</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${
                      bid.status === 'accepted' ? 'badge-safe glow-green' :
                      bid.status === 'rejected' ? 'badge-danger opacity-70' :
                      bid.status === 'counter_offered' ? 'badge-warning glow-amber' :
                      'badge-info'
                    }`}>
                      {bid.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// VIEW 5: ANALYTICS
// ============================================================================
function AnalyticsView() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#f8f9fa] tracking-tight">Performance Analytics</h1>
        <p className="text-[#8c909f] mt-1">Financial recovery metrics and cold chain reliability scores.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-[#e2e2eb] uppercase tracking-widest mb-6">Spoilage Prevented (₹)</h3>
          <div className="h-64 flex items-end gap-2 bg-[#050608] rounded-xl p-4 border border-white/5 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
              <div className="border-t border-white border-dashed w-full" />
              <div className="border-t border-white border-dashed w-full" />
              <div className="border-t border-white border-dashed w-full" />
              <div className="border-t border-white border-dashed w-full" />
            </div>
            
            {/* Bars */}
            {[40, 65, 30, 85, 55, 95, 75].map((h, i) => (
              <div key={i} className="w-full bg-gradient-to-t from-emerald-500/20 to-emerald-500 relative group cursor-pointer rounded-t-sm transition-all duration-300 hover:opacity-80" style={{ height: `${h}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 badge badge-safe opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  ₹{h}K
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-[#8c909f] font-[family-name:var(--font-mono)] uppercase">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-[#e2e2eb] uppercase tracking-widest mb-6">Cold Chain Failures by Region</h3>
          <div className="h-64 flex items-center justify-center bg-[#050608] rounded-xl border border-white/5 relative">
            {/* Fake Donut Chart SVG */}
            <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-[0_0_12px_rgba(59,130,246,0.2)]">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="16" strokeDasharray="60 191" strokeDashoffset="0" className="opacity-80" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="16" strokeDasharray="80 171" strokeDashoffset="-60" className="opacity-90" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="16" strokeDasharray="40 211" strokeDashoffset="-140" className="opacity-70" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="16" strokeDasharray="71.3 180" strokeDashoffset="-180" className="opacity-80" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-[family-name:var(--font-mono)] font-bold text-white">24</span>
              <span className="text-[10px] uppercase text-[#8c909f] tracking-widest mt-1">Total Events</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-xs text-[#c2c6d6]"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> North</div>
            <div className="flex items-center gap-2 text-xs text-[#c2c6d6]"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> West</div>
            <div className="flex items-center gap-2 text-xs text-[#c2c6d6]"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> South</div>
            <div className="flex items-center gap-2 text-xs text-[#c2c6d6]"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> East</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VIEW 6: SETTINGS
// ============================================================================
function SettingsView() {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#f8f9fa] tracking-tight">Preferences & Settings</h1>
        <p className="text-[#8c909f] mt-1">Manage AI decision boundaries and notification routing.</p>
      </header>

      <div className="space-y-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-[#e2e2eb] mb-4">Autonomous AI Rules</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
              <div>
                <p className="font-semibold text-[#e2e2eb]">Auto-Accept Optimal Bids</p>
                <p className="text-sm text-[#8c909f] mt-1">Allow AI to immediately accept bids &gt; 90% of asking price.</p>
              </div>
              <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer opacity-80">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
              <div>
                <p className="font-semibold text-[#e2e2eb]">Automated Counter-Offers</p>
                <p className="text-sm text-[#8c909f] mt-1">AI will automatically counter low-ball bids based on spoilage curve.</p>
              </div>
              <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer opacity-80">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 opacity-50 grayscale pointer-events-none">
          <h3 className="text-lg font-bold text-[#e2e2eb] mb-4 flex items-center gap-3">
            API Integrations
            <span className="badge badge-warning text-[9px]">Locked in Demo</span>
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#8c909f] uppercase tracking-widest mb-2 block">Google Maps API Key</label>
              <input type="password" value="************************" readOnly className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-[#e2e2eb] font-[family-name:var(--font-mono)]" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#8c909f] uppercase tracking-widest mb-2 block">Gemini AI Project ID</label>
              <input type="text" value="annapurna-prod-v2" readOnly className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-[#e2e2eb] font-[family-name:var(--font-mono)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
