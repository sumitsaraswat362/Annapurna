"use client";

import { useState } from "react";
import { useAppState } from "@/lib/store";
import { Bid } from "@/lib/types";
import CargoOfferCard from "@/components/CargoOfferCard";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

export default function WholesalerDashboard() {
  const { state, dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<"offers" | "orders">("offers");

  // Get cargos that are in emergency mode (available for purchase)
  const emergencyCargos = state.cargos.filter(
    (c) => c.status === "emergency" || (c.askingPricePerKg !== undefined && c.askingPricePerKg !== null && c.status !== "rerouting")
  );

  const { user, logout } = useAuth();
  
  // Real orders (accepted bids by this wholesaler)
  const orders = state.bids.filter(
    (b) => b.wholesalerId === user?.name && (b.status === "accepted" || b.status === "delivered" || b.status === "payment_cleared")
  );

  const upcomingCargos = state.cargos.filter(
    (c) => c.status === "warning"
  );

  const totalOffers = emergencyCargos.length + upcomingCargos.length;

  const handleSendBid = (cargoId: string, price: number, qty: number) => {
    const cargo = state.cargos.find(c => c.id === cargoId);
    if (!cargo || !user) return;
    
      const newBid: Bid = {
      id: `bid-${Date.now()}`,
      cargoId: cargoId,
      wholesalerId: user.name, // using name as ID for demo
      wholesalerName: user.name,
      wholesalerLocation: user.location || "Local Operations",
      offeredPricePerKg: price,
      requestedQuantityKg: qty,
      totalValue: price * qty,
      distanceKm: Math.floor(Math.random() * 30) + 5,
      etaMinutes: Math.floor(Math.random() * 45) + 10,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * 60000,
      status: "pending"
    };
    dispatch({ type: "ADD_BID", bid: newBid });
  };

  return (
    <div className="min-h-screen">
      {/* ===== TOP BAR ===== */}
      <header className="glass-card rounded-none border-x-0 border-t-0 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Annapurna Marketplace
              </p>
              <p className="text-[10px] text-[#8c909f]">Wholesaler Portal</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <span className="badge badge-safe text-[10px]">● Online</span>

            {/* Notification bell */}
            <button className="relative w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:bg-white/5 transition-colors">
              <svg className="w-5 h-5 text-[#8c909f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              {totalOffers > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold animate-pulse-danger">
                  {totalOffers}
                </span>
              )}
            </button>

            {/* User */}
            <div onClick={logout} className="flex items-center gap-2 cursor-pointer hover:bg-red-500/10 p-2 rounded-lg transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-white/10 flex items-center justify-center text-sm font-semibold text-emerald-300 group-hover:border-red-500/50 group-hover:text-red-400">
                {user?.name?.charAt(0).toUpperCase() || "W"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-[#e2e2eb] group-hover:text-red-400">{user?.name || "Wholesaler"}</p>
                <p className="text-[10px] text-[#8c909f] max-w-[150px] truncate">{user?.location || "Local Operations"}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#e2e2eb] mb-2">
            Emergency Cargo Nearby
          </h1>
          <p className="text-[#8c909f]">
            {totalOffers > 0
              ? `${totalOffers} distress shipment${totalOffers > 1 ? "s" : ""} within 50km of your location`
              : "No distress shipments available right now. Check back soon."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 glass-card w-fit mb-8">
          <button
            onClick={() => setActiveTab("offers")}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "offers"
                ? "bg-blue-500/15 text-blue-400"
                : "text-[#8c909f] hover:text-[#e2e2eb]"
            }`}
          >
            Live Offers
            {totalOffers > 0 && (
              <span className="ml-2 w-5 h-5 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                {totalOffers}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "orders"
                ? "bg-blue-500/15 text-blue-400"
                : "text-[#8c909f] hover:text-[#e2e2eb]"
            }`}
          >
            My Orders
            <span className="ml-2 text-[#8c909f]">({orders.length})</span>
          </button>
        </div>

        {activeTab === "offers" ? (
          <>
            {/* Emergency Offers */}
            {emergencyCargos.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-dot" />
                  <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider">
                    Urgent — Respond Immediately
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {emergencyCargos.map((cargo) => (
                    <CargoOfferCard
                      key={cargo.id}
                      cargo={cargo}
                      distance={12}
                      etaMinutes={18}
                      onAcceptFull={(id) => handleSendBid(id, cargo.askingPricePerKg || Math.round(cargo.estimatedCargoValue / cargo.quantityKg), cargo.quantityKg)}
                      onAcceptPartial={(id, qty) => handleSendBid(id, cargo.askingPricePerKg || Math.round(cargo.estimatedCargoValue / cargo.quantityKg), qty)}
                      onCounterOffer={(id, price, qty) => handleSendBid(id, price, qty)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Warning Offers */}
            {upcomingCargos.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
                    Upcoming — Cold Chain at Risk
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {upcomingCargos.map((cargo) => (
                    <CargoOfferCard
                      key={cargo.id}
                      cargo={{...cargo, askingPricePerKg: cargo.askingPricePerKg ?? Math.round(cargo.estimatedCargoValue / cargo.quantityKg)}}
                      distance={28}
                      etaMinutes={35}
                      onAcceptFull={(id) => handleSendBid(id, cargo.askingPricePerKg || Math.round(cargo.estimatedCargoValue / cargo.quantityKg), cargo.quantityKg)}
                      onAcceptPartial={(id, qty) => handleSendBid(id, cargo.askingPricePerKg || Math.round(cargo.estimatedCargoValue / cargo.quantityKg), qty)}
                      onCounterOffer={(id, price, qty) => handleSendBid(id, price, qty)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {emergencyCargos.length === 0 && upcomingCargos.length === 0 && (
              <div className="glass-card p-16 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#e2e2eb] mb-2">No Distress Cargo Available</h3>
                <p className="text-sm text-[#8c909f] max-w-md mx-auto">
                  All nearby trucks have healthy cold chains right now. You&apos;ll be notified instantly when a distress shipment becomes available within your radius.
                </p>
                <p className="text-xs text-[#8c909f]/50 mt-4">
                  💡 Tip: Open the Fleet Manager dashboard in another tab and click &quot;Simulate Cold Chain Failure&quot; to see how the marketplace works.
                </p>
              </div>
            )}
          </>
        ) : (
          /* ===== ORDERS TAB ===== */
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-3 text-[10px] text-[#8c909f] uppercase tracking-widest font-semibold">Cargo</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#8c909f] uppercase tracking-widest font-semibold">Quantity</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#8c909f] uppercase tracking-widest font-semibold">Price Paid</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#8c909f] uppercase tracking-widest font-semibold">Total</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#8c909f] uppercase tracking-widest font-semibold">Truck</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#8c909f] uppercase tracking-widest font-semibold">Status</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#8c909f] uppercase tracking-widest font-semibold">ETA</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const cargo = state.cargos.find(c => c.id === order.cargoId);
                  return (
                  <tr
                    key={order.id}
                    className="border-b border-white/3 hover:bg-white/3 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-[#e2e2eb] capitalize">
                        {cargo?.type || "Unknown"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-[family-name:var(--font-mono)] text-sm text-[#c2c6d6]">
                        {(order.requestedQuantityKg / 1000).toFixed(1)}T
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-[family-name:var(--font-mono)] text-sm text-emerald-400">
                        ₹{order.offeredPricePerKg}/kg
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-[family-name:var(--font-mono)] text-sm text-[#e2e2eb] font-semibold">
                        ₹{order.totalValue.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-[family-name:var(--font-mono)] text-xs text-[#8c909f]">
                        {cargo?.truckPlate || "Unknown"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {order.status === "accepted" ? (
                        <button 
                          onClick={() => dispatch({ type: "UPDATE_BID_STATUS", bidId: order.id, status: "delivered" })}
                          className="btn btn-primary py-1.5 px-3 text-xs w-full text-center"
                        >
                          Mark Received
                        </button>
                      ) : order.status === "delivered" ? (
                        <span className="badge badge-warning text-[9px] w-full text-center block">⌛ Payment Pending</span>
                      ) : (
                        <span className="badge badge-safe text-[9px] w-full text-center block">✓ Completed</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {order.status === "accepted" ? (
                        <span className="font-[family-name:var(--font-mono)] text-xs font-bold text-amber-400 animate-pulse">
                          {order.etaMinutes ? `${order.etaMinutes} min` : "Arriving"}
                        </span>
                      ) : (
                        <span className="font-[family-name:var(--font-mono)] text-xs text-[#8c909f]">
                          Delivered
                        </span>
                      )}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-12 grid grid-cols-4 gap-4">
          <div className="glass-card p-5 text-center">
            <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-emerald-400">{orders.length}</p>
            <p className="text-[10px] text-[#8c909f] uppercase tracking-widest mt-1">Orders This Month</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-blue-400">
              ₹{orders.reduce((acc, o) => acc + (o.totalValue * 0.15), 0).toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-[#8c909f] uppercase tracking-widest mt-1">Estimated Savings</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-amber-400">
              {(orders.reduce((acc, o) => acc + o.requestedQuantityKg, 0) / 1000).toFixed(1)}T
            </p>
            <p className="text-[10px] text-[#8c909f] uppercase tracking-widest mt-1">Food Saved</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-purple-400">100%</p>
            <p className="text-[10px] text-[#8c909f] uppercase tracking-widest mt-1">Acceptance Rate</p>
          </div>
        </div>
      </main>
    </div>
  );
}
