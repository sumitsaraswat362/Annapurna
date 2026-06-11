"use client";

import { useState, useEffect } from "react";
import { useAppState } from "@/lib/store";
import { Bid } from "@/lib/types";
import CargoOfferCard from "@/components/CargoOfferCard";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

export default function WholesalerDashboard() {
  const { state, dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<"offers" | "orders">("offers");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "offers" || hash === "orders") {
        setActiveTab(hash as "offers" | "orders");
      } else {
        setActiveTab("offers");
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    if (window.location.hash) handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabClick = (tab: "offers" | "orders") => {
    window.location.hash = tab;
  };

  const getAvailableQuantity = (cargoId: string, totalQty: number) => {
    const bidsForCargo = state.bids.filter(b => b.cargoId === cargoId && (b.status === "pending" || b.status === "accepted"));
    const orderedQty = bidsForCargo.reduce((sum, bid) => sum + bid.requestedQuantityKg, 0);
    return Math.max(0, totalQty - orderedQty);
  };

  // Get cargos that are in emergency mode (available for purchase)
  const emergencyCargosRaw = state.cargos.filter(
    (c) => c.status === "emergency" || (c.askingPricePerKg !== undefined && c.askingPricePerKg !== null && c.status !== "rerouting")
  );

  const emergencyCargos = emergencyCargosRaw
    .map(c => ({ ...c, quantityKg: getAvailableQuantity(c.id, c.quantityKg) }))
    .filter(c => c.quantityKg > 0);

  const { user, logout } = useAuth();
  
  // Real orders (accepted bids by this wholesaler)
  const orders = state.bids.filter(
    (b) => b.wholesalerId === user?.name && (b.status === "accepted" || b.status === "delivered" || b.status === "payment_cleared")
  );

  const upcomingCargosRaw = state.cargos.filter(
    (c) => c.status === "warning"
  );

  const upcomingCargos = upcomingCargosRaw
    .map(c => ({ ...c, quantityKg: getAvailableQuantity(c.id, c.quantityKg) }))
    .filter(c => c.quantityKg > 0);

  const totalOffers = emergencyCargos.length + upcomingCargos.length;

  const handleSendBid = (cargoId: string, price: number, qty: number) => {
    const cargo = state.cargos.find(c => c.id === cargoId);
    if (!cargo || !user) return;
    
    const existingBid = state.bids.find(b => b.cargoId === cargoId && b.wholesalerId === user.name);
    
    if (existingBid) {
      // Just update the existing bid if they are countering a counter-offer
      dispatch({ 
        type: "UPDATE_BID_STATUS", 
        bidId: existingBid.id, 
        status: "pending",
        counterPrice: undefined // Reset counter price since wholesaler responded
      });
      // We also need to update offered price, but for demo just status is enough to show pending
    } else {
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
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* ===== TOP BAR ===== */}
      <header className="ios-navbar">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#007AFF]/15 to-[#34C759]/15 border border-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#34C759]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold bg-gradient-to-r from-[#007AFF] to-[#34C759] bg-clip-text text-transparent">
                Annapurna Marketplace
              </p>
              <p className="text-[10px] text-white/50">Wholesaler Portal</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <span className="badge badge-safe text-[10px]">● Online</span>

            {/* Notification bell */}
            <button className="relative w-11 h-11 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center hover:bg-[#050505] transition-colors">
              <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              {totalOffers > 0 && (
                <span className="absolute -top-1 -right-1 badge-count animate-pulse-danger">
                  {totalOffers}
                </span>
              )}
            </button>

            {/* User */}
            <div onClick={logout} className="flex items-center gap-2 cursor-pointer hover:bg-[#FF3B30]/10 p-2 rounded-lg transition-colors group min-h-[44px]">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#34C759]/20 to-[#5AC8FA]/20 border border-white/10 flex items-center justify-center text-sm font-semibold text-[#248A3D] group-hover:border-[#FF3B30]/50 group-hover:text-[#FF3B30]">
                {user?.name?.charAt(0).toUpperCase() || "W"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white group-hover:text-[#FF3B30]">{user?.name || "Wholesaler"}</p>
                <p className="text-[10px] text-white/50 max-w-[150px] truncate">{user?.location || "Local Operations"}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="ios-large-title text-white mb-2">
            Emergency Cargo Nearby
          </h1>
          <p className="text-white/50 ios-subheadline">
            {totalOffers > 0
              ? `${totalOffers} distress shipment${totalOffers > 1 ? "s" : ""} within 50km of your location`
              : "No distress shipments available right now. Check back soon."}
          </p>
        </div>

        {/* Segment Control (Tabs) */}
        <div className="ios-segment w-fit mb-8">
          <button
            onClick={() => handleTabClick("offers")}
            className={`ios-segment-item ${activeTab === "offers" ? "active" : ""}`}
          >
            Live Offers
            {totalOffers > 0 && (
              <span className="ml-2 badge-count text-[10px]">
                {totalOffers}
              </span>
            )}
          </button>
          <button
            onClick={() => handleTabClick("orders")}
            className={`ios-segment-item ${activeTab === "orders" ? "active" : ""}`}
          >
            My Orders
            <span className="ml-2 text-white/50">({orders.length})</span>
          </button>
        </div>

        {activeTab === "offers" ? (
          <>
            {/* Emergency Offers */}
            {emergencyCargos.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse-dot" />
                  <h2 className="text-sm font-semibold text-[#FF3B30] uppercase tracking-wider">
                    Urgent — Respond Immediately
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {emergencyCargos.map((cargo) => {
                    const existingBid = state.bids.find(b => b.cargoId === cargo.id && b.wholesalerId === user?.name);
                    return (
                    <CargoOfferCard
                      key={cargo.id}
                      cargo={cargo}
                      existingBid={existingBid}
                      distance={12}
                      etaMinutes={18}
                      onAcceptFull={(id) => handleSendBid(id, cargo.askingPricePerKg || Math.round(cargo.estimatedCargoValue / cargo.quantityKg), cargo.quantityKg)}
                      onAcceptPartial={(id, qty) => handleSendBid(id, cargo.askingPricePerKg || Math.round(cargo.estimatedCargoValue / cargo.quantityKg), qty)}
                      onCounterOffer={(id, price, qty) => handleSendBid(id, price, qty)}
                    />
                  )})}
                </div>
              </div>
            )}

            {/* Warning Offers */}
            {upcomingCargos.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#FF9500]" />
                  <h2 className="text-sm font-semibold text-[#FF9500] uppercase tracking-wider">
                    Upcoming — Cold Chain at Risk
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {upcomingCargos.map((cargo) => {
                    const existingBid = state.bids.find(b => b.cargoId === cargo.id && b.wholesalerId === user?.name);
                    return (
                    <CargoOfferCard
                      key={cargo.id}
                      cargo={{...cargo, askingPricePerKg: cargo.askingPricePerKg ?? Math.round(cargo.estimatedCargoValue / cargo.quantityKg)}}
                      existingBid={existingBid}
                      distance={28}
                      etaMinutes={35}
                      onAcceptFull={(id) => handleSendBid(id, cargo.askingPricePerKg || Math.round(cargo.estimatedCargoValue / cargo.quantityKg), cargo.quantityKg)}
                      onAcceptPartial={(id, qty) => handleSendBid(id, cargo.askingPricePerKg || Math.round(cargo.estimatedCargoValue / cargo.quantityKg), qty)}
                      onCounterOffer={(id, price, qty) => handleSendBid(id, price, qty)}
                    />
                  )})}
                </div>
              </div>
            )}

            {/* Empty State */}
            {emergencyCargos.length === 0 && upcomingCargos.length === 0 && (
              <div className="glass-card p-16 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#007AFF]/5 border border-[#007AFF]/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#007AFF]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No Distress Cargo Available</h3>
                <p className="text-sm text-white/50 max-w-md mx-auto">
                  All nearby trucks have healthy cold chains right now. You&apos;ll be notified instantly when a distress shipment becomes available within your radius.
                </p>
                <p className="text-xs text-white/50/50 mt-4">
                  💡 Tip: Open the Fleet Manager dashboard in another tab and click &quot;Simulate Cold Chain Failure&quot; to see how the marketplace works.
                </p>
              </div>
            )}
          </>
        ) : (
          /* ===== ORDERS TAB ===== */
          <>
            {/* Desktop Table */}
            <div className="glass-card overflow-hidden hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-5 py-3 text-[10px] text-white/50 uppercase tracking-widest font-semibold">Cargo</th>
                    <th className="text-left px-5 py-3 text-[10px] text-white/50 uppercase tracking-widest font-semibold">Quantity</th>
                    <th className="text-left px-5 py-3 text-[10px] text-white/50 uppercase tracking-widest font-semibold">Price Paid</th>
                    <th className="text-left px-5 py-3 text-[10px] text-white/50 uppercase tracking-widest font-semibold">Total</th>
                    <th className="text-left px-5 py-3 text-[10px] text-white/50 uppercase tracking-widest font-semibold">Truck</th>
                    <th className="text-left px-5 py-3 text-[10px] text-white/50 uppercase tracking-widest font-semibold">Status</th>
                    <th className="text-left px-5 py-3 text-[10px] text-white/50 uppercase tracking-widest font-semibold">ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const cargo = state.cargos.find(c => c.id === order.cargoId);
                    return (
                    <tr
                      key={order.id}
                      className="border-b border-white/10 hover:bg-[#050505] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-white capitalize">
                          {cargo?.type || "Unknown"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-[family-name:var(--font-mono)] text-sm text-white/90">
                          {(order.requestedQuantityKg / 1000).toFixed(1)}T
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-[family-name:var(--font-mono)] text-sm text-[#34C759]">
                          ₹{order.offeredPricePerKg}/kg
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-[family-name:var(--font-mono)] text-sm text-white font-semibold">
                          ₹{order.totalValue.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-[family-name:var(--font-mono)] text-xs text-white/50">
                          {cargo?.truckPlate || "Unknown"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {order.status === "accepted" ? (
                          <button 
                            onClick={() => dispatch({ type: "UPDATE_BID_STATUS", bidId: order.id, status: "delivered" })}
                            className="btn btn-primary btn-sm text-xs w-full text-center"
                          >
                            Mark Received
                          </button>
                        ) : order.status === "delivered" ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="badge badge-warning w-full text-center block">
                              Payment Pending
                            </span>
                            <button 
                              onClick={() => dispatch({ type: "UPDATE_BID_STATUS", bidId: order.id, status: "payment_cleared" })}
                              className="text-[9px] text-[#FF9500] hover:text-white underline mt-0.5"
                            >
                              Mark Paid
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <span className="badge badge-safe text-[9px] w-full text-center block">✓ Contract Executed</span>
                            <span className="font-[family-name:var(--font-mono)] text-[8px] text-[#34C759]">Tx: 0x{order.id.split('-')[1]}...</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {order.status === "accepted" ? (
                          <span className="font-[family-name:var(--font-mono)] text-xs font-bold text-[#FF9500] animate-pulse">
                            {order.etaMinutes ? `${order.etaMinutes} min` : "Arriving"}
                          </span>
                        ) : (
                          <span className="font-[family-name:var(--font-mono)] text-xs text-white/50">
                            Delivered
                          </span>
                        )}
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-3">
              {orders.map((order) => {
                const cargo = state.cargos.find(c => c.id === order.cargoId);
                return (
                  <div key={order.id} className="glass-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-semibold text-white capitalize">
                        {cargo?.type || "Unknown"}
                      </span>
                      {order.status === "accepted" ? (
                        <span className="font-[family-name:var(--font-mono)] text-xs font-bold text-[#FF9500] animate-pulse">
                          ETA: {order.etaMinutes ? `${order.etaMinutes} min` : "Arriving"}
                        </span>
                      ) : (
                        <span className="font-[family-name:var(--font-mono)] text-xs text-white/50">
                          Delivered
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">Qty</p>
                        <p className="font-[family-name:var(--font-mono)] text-sm text-white/90">
                          {(order.requestedQuantityKg / 1000).toFixed(1)}T
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">Price</p>
                        <p className="font-[family-name:var(--font-mono)] text-sm text-[#34C759]">
                          ₹{order.offeredPricePerKg}/kg
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">Total</p>
                        <p className="font-[family-name:var(--font-mono)] text-sm text-white font-semibold">
                          ₹{order.totalValue.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="font-[family-name:var(--font-mono)] text-xs text-white/50">
                        {cargo?.truckPlate || "Unknown"}
                      </span>
                      {order.status === "accepted" ? (
                        <button 
                          onClick={() => dispatch({ type: "UPDATE_BID_STATUS", bidId: order.id, status: "delivered" })}
                          className="btn btn-primary btn-sm text-xs"
                        >
                          Mark Received
                        </button>
                      ) : order.status === "delivered" ? (
                        <div className="flex flex-col items-end gap-1">
                          <span className="badge badge-warning text-center">
                            Payment Pending
                          </span>
                          <button 
                            onClick={() => dispatch({ type: "UPDATE_BID_STATUS", bidId: order.id, status: "payment_cleared" })}
                            className="text-[9px] text-[#FF9500] hover:text-white underline"
                          >
                            Mark Paid
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-1">
                          <span className="badge badge-safe text-[9px] text-center">✓ Contract Executed</span>
                          <span className="font-[family-name:var(--font-mono)] text-[8px] text-[#34C759]">Tx: 0x{order.id.split('-')[1]}...</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Stats Footer */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="kpi-card text-center">
            <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-[#34C759]">{orders.length}</p>
            <p className="kpi-label mt-1">Orders This Month</p>
          </div>
          <div className="kpi-card text-center">
            <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-[#007AFF]">
              ₹{orders.reduce((acc, o) => acc + (o.totalValue * 0.15), 0).toLocaleString("en-IN")}
            </p>
            <p className="kpi-label mt-1">Estimated Savings</p>
          </div>
          <div className="kpi-card text-center">
            <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-[#FF9500]">
              {(orders.reduce((acc, o) => acc + o.requestedQuantityKg, 0) / 1000).toFixed(1)}T
            </p>
            <p className="kpi-label mt-1">Food Saved</p>
          </div>
          <div className="kpi-card text-center">
            <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-[#AF52DE]">100%</p>
            <p className="kpi-label mt-1">Acceptance Rate</p>
          </div>
        </div>
      </main>
    </div>
  );
}
