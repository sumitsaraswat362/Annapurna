"use client";

import { useState, useEffect } from "react";
import { Bid } from "@/lib/types";
import CountdownTimer from "./CountdownTimer";

interface BidCardProps {
  bid: Bid;
  onAccept: (bidId: string) => void;
  onReject: (bidId: string) => void;
  onCounter: (bidId: string, counterPrice: number) => void;
  onViewMap?: (bidId: string) => void;
  onPaymentReceived?: (bidId: string) => void;
}

export default function BidCard({ bid, onAccept, onReject, onCounter, onViewMap, onPaymentReceived }: BidCardProps) {
  const [showCounter, setShowCounter] = useState(false);
  const [counterPrice, setCounterPrice] = useState(bid.offeredPricePerKg + 2);

  const isAccepted = bid.status === "accepted";
  const isRejected = bid.status === "rejected";
  const isExpired = bid.status === "expired";
  const isDelivered = bid.status === "delivered";
  const isPaymentCleared = bid.status === "payment_cleared";
  const isDisabled = isRejected || isExpired;

  // Fast Timer Logic for Demo
  const [fastSeconds, setFastSeconds] = useState(bid.etaMinutes * 6); // 1 real minute = 6 fast seconds for demo
  useEffect(() => {
    if (isAccepted && fastSeconds > 0) {
      const timer = setInterval(() => setFastSeconds(s => s - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isAccepted, fastSeconds]);

  return (
    <div
      className={`glass-card p-4 transition-all duration-500 ${
        isAccepted
          ? "border-emerald-500/40 glow-green"
          : isRejected
          ? "opacity-50 border-red-500/20"
          : isExpired
          ? "opacity-40"
          : "glass-card-hover"
      }`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-sm font-semibold text-blue-300">
            {bid.wholesalerName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#e2e2eb]">{bid.wholesalerName}</p>
            <p className="text-[11px] text-[#8c909f]">
              {bid.distanceKm} km · {bid.etaMinutes} min away
            </p>
          </div>
        </div>

        {!isDisabled && (
          <CountdownTimer expiresAt={bid.expiresAt} size="sm" />
        )}

        {isAccepted && (
          <div className="text-right flex flex-col items-end">
            <span className="badge badge-safe mb-1">✓ En Route</span>
            <span className="font-[family-name:var(--font-mono)] text-xs font-bold text-amber-400 animate-pulse">
              ETA: {Math.floor(fastSeconds / 60)}m {fastSeconds % 60}s
            </span>
          </div>
        )}
        {isDelivered && (
          <span className="badge badge-warning">⌛ Delivered (Unpaid)</span>
        )}
        {isPaymentCleared && (
          <span className="badge badge-safe">✓ Completed</span>
        )}
        {isRejected && (
          <span className="badge badge-danger">Rejected</span>
        )}
      </div>

      {/* Price & Quantity */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 rounded-md bg-black/20">
          <p className="text-[10px] text-[#8c909f] uppercase tracking-widest">Price/kg</p>
          <p className="font-[family-name:var(--font-mono)] text-lg font-bold text-emerald-400 mt-0.5">
            ₹{bid.offeredPricePerKg}
          </p>
        </div>
        <div className="text-center p-2 rounded-md bg-black/20">
          <p className="text-[10px] text-[#8c909f] uppercase tracking-widest">Quantity</p>
          <p className="font-[family-name:var(--font-mono)] text-lg font-bold text-[#e2e2eb] mt-0.5">
            {(bid.requestedQuantityKg / 1000).toFixed(0)}T
          </p>
        </div>
        <div className="text-center p-2 rounded-md bg-black/20">
          <p className="text-[10px] text-[#8c909f] uppercase tracking-widest">Total</p>
          <p className="font-[family-name:var(--font-mono)] text-lg font-bold text-blue-400 mt-0.5">
            ₹{(bid.totalValue / 1000).toFixed(0)}K
          </p>
        </div>
      </div>

      {/* Counter offer input */}
      {showCounter && !isDisabled && (
        <div className="mb-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 animate-in">
          <label className="text-[10px] text-amber-400 uppercase tracking-widest block mb-2">
            Your counter price (₹/kg)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={counterPrice}
              onChange={(e) => setCounterPrice(Number(e.target.value))}
              className="flex-1 bg-black/30 border border-white/10 rounded-md px-3 py-2 font-[family-name:var(--font-mono)] text-sm text-[#e2e2eb] focus:outline-none focus:border-amber-500/50 transition-colors"
              min={1}
              step={0.5}
            />
            <button
              onClick={() => {
                onCounter(bid.id, counterPrice);
                setShowCounter(false);
              }}
              className="btn btn-warning text-xs px-4"
            >
              Send
            </button>
            <button
              onClick={() => setShowCounter(false)}
              className="btn btn-ghost text-xs px-3"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {(!isDisabled && !isAccepted && !isDelivered && !isPaymentCleared) && (
        <div className="flex gap-2">
          <button
            onClick={() => onAccept(bid.id)}
            className="btn btn-success flex-1 text-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Accept
          </button>
          <button
            onClick={() => setShowCounter(!showCounter)}
            className="btn btn-warning flex-1 text-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            Counter
          </button>
          <button
            onClick={() => onReject(bid.id)}
            className="btn btn-danger text-xs px-3"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Post-Acceptance Actions */}
      {isAccepted && onViewMap && (
        <button
          onClick={() => onViewMap(bid.id)}
          className="w-full mt-2 btn border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs py-2"
        >
          View Route Map
        </button>
      )}

      {isDelivered && onPaymentReceived && (
        <button
          onClick={() => onPaymentReceived(bid.id)}
          className="w-full mt-2 btn btn-primary text-xs py-2"
        >
          Confirm Payment Received
        </button>
      )}
    </div>
  );
}
