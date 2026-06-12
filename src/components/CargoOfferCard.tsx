"use client";

import { useState, useEffect } from "react";
import CountdownTimer from "./CountdownTimer";
import { Cargo, Bid } from "@/lib/types";

interface CargoOfferCardProps {
  cargo: Cargo;
  distance: number;
  etaMinutes: number;
  onAcceptFull: (cargoId: string) => void;
  onAcceptPartial: (cargoId: string, quantity: number) => void;
  onCounterOffer: (cargoId: string, pricePerKg: number, quantity: number) => void;
  existingBid?: Bid;
}

export default function CargoOfferCard({
  cargo,
  distance,
  etaMinutes,
  onAcceptFull,
  onAcceptPartial,
  onCounterOffer,
  existingBid,
}: CargoOfferCardProps) {
  const [mode, setMode] = useState<"idle" | "partial" | "counter">("idle");
  const [partialQty, setPartialQty] = useState(Math.floor(cargo.quantityKg / 2));
  
  // If there's a counter offer from logistics, use it as default
  const defaultPrice = existingBid?.status === "counter_offered" && existingBid.counterPricePerKg
    ? existingBid.counterPricePerKg
    : (cargo.askingPricePerKg ? cargo.askingPricePerKg - 2 : 10);
    
  const [counterPrice, setCounterPrice] = useState(defaultPrice);
  const [counterQty, setCounterQty] = useState(cargo.quantityKg);
  const [accepted, setAccepted] = useState(false);

  const urgency =
    cargo.telemetry.temperature > cargo.safeTemperatureMax + 5
      ? "critical"
      : cargo.telemetry.temperature > cargo.safeTemperatureMax
      ? "warning"
      : "normal";

  const qualityPercent =
    urgency === "critical" ? 78 : urgency === "warning" ? 85 : 95;
  const qualityLabel =
    urgency === "critical"
      ? "Sell within 1hr"
      : urgency === "warning"
      ? "Good if sold within 2hrs"
      : "Excellent";

  const borderColor =
    urgency === "critical"
      ? "border-[#FF3B30]/30"
      : urgency === "warning"
      ? "border-[#FF9500]/30"
      : "border-[#E5E5EA]";

  const expiresAt = Date.now() + (urgency === "critical" ? 5 * 60 * 1000 : 15 * 60 * 1000);

  if (accepted) {
    return (
      <div className="ios-card clay p-5 border border-[#34C759]/40">
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-[#34C759]/10 border border-[#34C759]/30 flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-[#34C759]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#34C759] mb-1">Order Placed!</h3>
          <p className="text-sm text-[#8E8E93]">
            {cargo.type.charAt(0).toUpperCase() + cargo.type.slice(1)} · Truck arriving in ~{etaMinutes} min
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`ios-card clay p-5 transition-all duration-300 border ${borderColor}`}>
      {/* Urgency Strip */}
      {urgency === "critical" && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-[#FF3B30] animate-pulse-danger">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span className="text-[11px] font-semibold text-white uppercase tracking-wider">
            Urgent — Respond Immediately
          </span>
        </div>
      )}

      {urgency === "warning" && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-[#FF9500]">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span className="text-[11px] font-semibold text-white uppercase tracking-wider">
            Warning — Cold Chain at Risk
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#000000]">
            {cargo.type.charAt(0).toUpperCase() + cargo.type.slice(1)}
            <span className="font-[family-name:var(--font-mono)] text-[#8E8E93] text-sm ml-2">
              {(cargo.quantityKg / 1000).toFixed(0)} Tonnes
            </span>
          </h3>
          <p className="text-xs text-[#8E8E93] mt-0.5">
            Truck: {cargo.truckPlate} · From {cargo.origin.name}
          </p>
        </div>
        <CountdownTimer expiresAt={expiresAt} size="sm" />
      </div>

      {/* Stats Grid — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <div className="text-center p-2 rounded-lg bg-[#F2F2F7]">
          <p className="text-[9px] text-[#8E8E93] uppercase tracking-widest">Temp</p>
          <p className={`font-[family-name:var(--font-mono)] text-sm font-bold mt-0.5 ${
            urgency === "critical" ? "text-[#FF3B30]" : urgency === "warning" ? "text-[#FF9500]" : "text-[#34C759]"
          }`}>
            {cargo.telemetry.temperature.toFixed(1)}°C
          </p>
        </div>
        <div className="text-center p-2 rounded-lg bg-[#F2F2F7]">
          <p className="text-[9px] text-[#8E8E93] uppercase tracking-widest">Quality</p>
          <p className={`font-[family-name:var(--font-mono)] text-sm font-bold mt-0.5 ${
            qualityPercent > 85 ? "text-[#34C759]" : qualityPercent > 70 ? "text-[#FF9500]" : "text-[#FF3B30]"
          }`}>
            {qualityPercent}%
          </p>
        </div>
        <div className="text-center p-2 rounded-lg bg-[#F2F2F7]">
          <p className="text-[9px] text-[#8E8E93] uppercase tracking-widest">Distance</p>
          <p className="font-[family-name:var(--font-mono)] text-sm font-bold text-[#000000] mt-0.5">
            {distance} km
          </p>
        </div>
        <div className="text-center p-2 rounded-lg bg-[#F2F2F7]">
          <p className="text-[9px] text-[#8E8E93] uppercase tracking-widest">ETA</p>
          <p className="font-[family-name:var(--font-mono)] text-sm font-bold text-[#000000] mt-0.5">
            {etaMinutes}m
          </p>
        </div>
      </div>

      {/* Quality Note */}
      <p className="text-xs text-[#8E8E93] mb-3 italic">
        Quality estimate: {qualityLabel}
      </p>

      {/* Asking Price */}
      <div className="flex items-center justify-between mt-2 mb-4 bg-[#F2F2F7] p-3 rounded-lg border border-[#E5E5EA]">
        <span className="text-sm text-[#3C3C43]">Asking Price</span>
        <div className="flex flex-col items-end">
          <span className="font-[family-name:var(--font-mono)] text-xl font-bold text-[#34C759]">
            ₹{cargo.askingPricePerKg ?? 0}/kg
          </span>
        </div>
      </div>

      {/* Counter Offer Status */}
      {existingBid && existingBid.status === "counter_offered" && existingBid.counterPricePerKg && mode === "idle" && (
        <div className="mb-4 p-3 rounded-lg bg-[#AF52DE]/10 border border-[#AF52DE]/30">
          <p className="text-[10px] text-[#AF52DE] uppercase tracking-widest block mb-2 font-bold">
            Logistics Countered Your Bid
          </p>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-[#000000]">They want:</span>
            <span className="font-[family-name:var(--font-mono)] text-lg font-bold text-[#AF52DE]">
              ₹{existingBid.counterPricePerKg}/kg
            </span>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                onAcceptFull(cargo.id); // This will re-send bid at counter price, handling logic is on page
                setAccepted(true);
              }}
              className="btn btn-primary flex-1 text-xs skeuomorphic-btn skeuomorphic-primary"
            >
              Accept at ₹{existingBid.counterPricePerKg}/kg
            </button>
          </div>
        </div>
      )}
      
      {/* Pending Status */}
      {existingBid && existingBid.status === "pending" && mode === "idle" && (
        <div className="mb-4 p-3 rounded-lg bg-[#007AFF]/10 border border-[#007AFF]/30 text-center">
           <span className="text-sm font-semibold text-[#007AFF]">Your Bid is Pending Review...</span>
        </div>
      )}

      {/* Partial Order Form */}
      {mode === "partial" && (
        <div className="mb-4 p-3 rounded-lg bg-[#007AFF]/5 border border-[#007AFF]/20">
          <label className="text-[10px] text-[#007AFF] uppercase tracking-widest block mb-2">
            How much do you want? (kg)
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="range"
              min={500}
              max={cargo.quantityKg}
              step={500}
              value={partialQty}
              onChange={(e) => setPartialQty(Number(e.target.value))}
              className="flex-1 accent-[#007AFF]"
            />
            <span className="font-[family-name:var(--font-mono)] text-sm text-[#007AFF] w-20 text-right">
              {(partialQty / 1000).toFixed(1)}T
            </span>
          </div>
          <div className="flex justify-between mt-2 text-xs text-[#8E8E93]">
            <span>Total: ₹{((cargo.askingPricePerKg ?? 0) * partialQty).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                onAcceptPartial(cargo.id, partialQty);
                setAccepted(true);
              }}
              className="btn btn-primary flex-1 text-xs skeuomorphic-btn skeuomorphic-primary"
            >
              Confirm {(partialQty / 1000).toFixed(1)}T Order
            </button>
            <button onClick={() => setMode("idle")} className="btn btn-ghost text-xs skeuomorphic-btn skeuomorphic-danger">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Counter Offer Form */}
      {mode === "counter" && (
        <div className="mb-4 p-3 rounded-lg bg-[#FF9500]/5 border border-[#FF9500]/20">
          <label className="text-[10px] text-[#FF9500] uppercase tracking-widest block mb-2">
            Your offer
          </label>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <span className="text-[10px] text-[#8E8E93] block mb-1">Price (₹/kg)</span>
              <input
                type="number"
                value={counterPrice}
                onChange={(e) => setCounterPrice(Number(e.target.value))}
                className="ios-input font-[family-name:var(--font-mono)] text-sm"
                min={1}
                step={0.5}
              />
            </div>
            <div>
              <span className="text-[10px] text-[#8E8E93] block mb-1">Quantity (kg)</span>
              <input
                type="number"
                value={counterQty}
                onChange={(e) => setCounterQty(Number(e.target.value))}
                className="ios-input font-[family-name:var(--font-mono)] text-sm"
                min={500}
                max={cargo.quantityKg}
                step={500}
              />
            </div>
          </div>
          <p className="text-xs text-[#8E8E93] mb-3">
            Total offer: <span className="font-[family-name:var(--font-mono)] text-[#FF9500]">₹{(counterPrice * counterQty).toLocaleString("en-IN")}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onCounterOffer(cargo.id, counterPrice, counterQty);
                setAccepted(true);
              }}
              className="btn btn-warning flex-1 text-xs skeuomorphic-btn skeuomorphic-primary"
            >
              Send Counter Offer
            </button>
            <button onClick={() => setMode("idle")} className="btn btn-ghost text-xs skeuomorphic-btn skeuomorphic-danger">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {mode === "idle" && (!existingBid || existingBid.status === "counter_offered") && (
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              onAcceptFull(cargo.id);
              setAccepted(true);
            }}
            className="btn btn-success text-xs skeuomorphic-btn skeuomorphic-primary"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Accept Full
          </button>
          <button
            onClick={() => setMode("partial")}
            className="btn btn-primary text-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6Z" />
            </svg>
            Partial
          </button>
          <button
            onClick={() => setMode("counter")}
            className="btn btn-warning text-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            Counter
          </button>
        </div>
      )}
    </div>
  );
}
