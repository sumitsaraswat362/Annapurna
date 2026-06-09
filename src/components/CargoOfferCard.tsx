"use client";

import { useState } from "react";
import CountdownTimer from "./CountdownTimer";
import { Cargo } from "@/lib/types";

interface CargoOfferCardProps {
  cargo: Cargo;
  distance: number;
  etaMinutes: number;
  onAcceptFull: (cargoId: string) => void;
  onAcceptPartial: (cargoId: string, quantity: number) => void;
  onCounterOffer: (cargoId: string, pricePerKg: number, quantity: number) => void;
}

export default function CargoOfferCard({
  cargo,
  distance,
  etaMinutes,
  onAcceptFull,
  onAcceptPartial,
  onCounterOffer,
}: CargoOfferCardProps) {
  const [mode, setMode] = useState<"idle" | "partial" | "counter">("idle");
  const [partialQty, setPartialQty] = useState(Math.floor(cargo.quantityKg / 2));
  const [counterPrice, setCounterPrice] = useState(
    cargo.askingPricePerKg ? cargo.askingPricePerKg - 2 : 10
  );
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

  const borderGlow =
    urgency === "critical"
      ? "border-red-500/30 glow-red"
      : urgency === "warning"
      ? "border-amber-500/30 glow-amber"
      : "border-blue-500/20 glow-blue";

  const expiresAt = Date.now() + (urgency === "critical" ? 5 * 60 * 1000 : 15 * 60 * 1000);

  if (accepted) {
    return (
      <div className="glass-card p-5 border-emerald-500/40 glow-green">
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-emerald-400 mb-1">Order Placed!</h3>
          <p className="text-sm text-[#8c909f]">
            {cargo.type.charAt(0).toUpperCase() + cargo.type.slice(1)} · Truck arriving in ~{etaMinutes} min
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card p-5 transition-all duration-300 ${borderGlow}`}>
      {/* Urgency Strip */}
      {urgency === "critical" && (
        <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/20 animate-pulse-danger">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">
            Urgent — Respond Immediately
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#e2e2eb]">
            {cargo.type.charAt(0).toUpperCase() + cargo.type.slice(1)}
            <span className="font-[family-name:var(--font-mono)] text-[#8c909f] text-sm ml-2">
              {(cargo.quantityKg / 1000).toFixed(0)} Tonnes
            </span>
          </h3>
          <p className="text-xs text-[#8c909f] mt-0.5">
            Truck: {cargo.truckPlate} · From {cargo.origin.name}
          </p>
        </div>
        <CountdownTimer expiresAt={expiresAt} size="sm" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center p-2 rounded-md bg-black/20">
          <p className="text-[9px] text-[#8c909f] uppercase tracking-widest">Temp</p>
          <p className={`font-[family-name:var(--font-mono)] text-sm font-bold mt-0.5 ${
            urgency === "critical" ? "text-red-400" : urgency === "warning" ? "text-amber-400" : "text-emerald-400"
          }`}>
            {cargo.telemetry.temperature.toFixed(1)}°C
          </p>
        </div>
        <div className="text-center p-2 rounded-md bg-black/20">
          <p className="text-[9px] text-[#8c909f] uppercase tracking-widest">Quality</p>
          <p className={`font-[family-name:var(--font-mono)] text-sm font-bold mt-0.5 ${
            qualityPercent > 85 ? "text-emerald-400" : qualityPercent > 70 ? "text-amber-400" : "text-red-400"
          }`}>
            {qualityPercent}%
          </p>
        </div>
        <div className="text-center p-2 rounded-md bg-black/20">
          <p className="text-[9px] text-[#8c909f] uppercase tracking-widest">Distance</p>
          <p className="font-[family-name:var(--font-mono)] text-sm font-bold text-[#e2e2eb] mt-0.5">
            {distance} km
          </p>
        </div>
        <div className="text-center p-2 rounded-md bg-black/20">
          <p className="text-[9px] text-[#8c909f] uppercase tracking-widest">ETA</p>
          <p className="font-[family-name:var(--font-mono)] text-sm font-bold text-[#e2e2eb] mt-0.5">
            {etaMinutes}m
          </p>
        </div>
      </div>

      {/* Quality Note */}
      <p className="text-xs text-[#8c909f] mb-3 italic">
        Quality estimate: {qualityLabel}
      </p>

      {/* Asking Price */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15 mb-4">
        <span className="text-sm text-[#c2c6d6]">Asking Price</span>
        <span className="font-[family-name:var(--font-mono)] text-xl font-bold text-emerald-400">
          ₹{cargo.askingPricePerKg ?? 0}/kg
        </span>
      </div>

      {/* Partial Order Form */}
      {mode === "partial" && (
        <div className="mb-4 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
          <label className="text-[10px] text-blue-400 uppercase tracking-widest block mb-2">
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
              className="flex-1 accent-blue-500"
            />
            <span className="font-[family-name:var(--font-mono)] text-sm text-blue-400 w-20 text-right">
              {(partialQty / 1000).toFixed(1)}T
            </span>
          </div>
          <div className="flex justify-between mt-2 text-xs text-[#8c909f]">
            <span>Total: ₹{((cargo.askingPricePerKg ?? 0) * partialQty).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                onAcceptPartial(cargo.id, partialQty);
                setAccepted(true);
              }}
              className="btn btn-primary flex-1 text-xs"
            >
              Confirm {(partialQty / 1000).toFixed(1)}T Order
            </button>
            <button onClick={() => setMode("idle")} className="btn btn-ghost text-xs">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Counter Offer Form */}
      {mode === "counter" && (
        <div className="mb-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
          <label className="text-[10px] text-amber-400 uppercase tracking-widest block mb-2">
            Your offer
          </label>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <span className="text-[10px] text-[#8c909f] block mb-1">Price (₹/kg)</span>
              <input
                type="number"
                value={counterPrice}
                onChange={(e) => setCounterPrice(Number(e.target.value))}
                className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 font-[family-name:var(--font-mono)] text-sm text-[#e2e2eb] focus:outline-none focus:border-amber-500/50 transition-colors"
                min={1}
                step={0.5}
              />
            </div>
            <div>
              <span className="text-[10px] text-[#8c909f] block mb-1">Quantity (kg)</span>
              <input
                type="number"
                value={counterQty}
                onChange={(e) => setCounterQty(Number(e.target.value))}
                className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 font-[family-name:var(--font-mono)] text-sm text-[#e2e2eb] focus:outline-none focus:border-amber-500/50 transition-colors"
                min={500}
                max={cargo.quantityKg}
                step={500}
              />
            </div>
          </div>
          <p className="text-xs text-[#8c909f] mb-3">
            Total offer: <span className="font-[family-name:var(--font-mono)] text-amber-400">₹{(counterPrice * counterQty).toLocaleString("en-IN")}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onCounterOffer(cargo.id, counterPrice, counterQty);
                setAccepted(true);
              }}
              className="btn btn-warning flex-1 text-xs"
            >
              Send Counter Offer
            </button>
            <button onClick={() => setMode("idle")} className="btn btn-ghost text-xs">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {mode === "idle" && (
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              onAcceptFull(cargo.id);
              setAccepted(true);
            }}
            className="btn btn-success text-xs"
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
