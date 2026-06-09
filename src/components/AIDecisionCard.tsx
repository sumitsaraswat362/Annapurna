"use client";

import { AIDecision } from "@/lib/types";

interface AIDecisionCardProps {
  decision: AIDecision | null;
}

export default function AIDecisionCard({ decision }: AIDecisionCardProps) {
  if (!decision) {
    return (
      <div className="glass-card p-5 glow-blue">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#c2c6d6] uppercase tracking-wider">
              AI Agent
            </h3>
            <p className="text-xs text-[#8c909f]">Monitoring cargo telemetry...</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#8c909f]">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse-dot" />
          Analyzing temperature trends, traffic conditions, and market availability
        </div>
      </div>
    );
  }

  const isEmergency = decision.recommendation === "reroute" || decision.recommendation === "emergency_sell";
  const isContinue = decision.recommendation === "continue";

  return (
    <div
      className={`glass-card p-5 transition-all duration-500 ${
        isEmergency ? "glow-red border-red-500/30" : isContinue ? "glow-blue" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isEmergency
                ? "bg-red-500/10 border border-red-500/20"
                : "bg-blue-500/10 border border-blue-500/20"
            }`}
          >
            <svg
              className={`w-5 h-5 ${isEmergency ? "text-red-400" : "text-blue-400"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#c2c6d6] uppercase tracking-wider">
              AI Decision
            </h3>
            <p className="text-[10px] text-[#8c909f] font-[family-name:var(--font-mono)]">
              {new Date(decision.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <span
          className={`badge ${
            decision.recommendation === "continue"
              ? "badge-safe"
              : decision.recommendation === "reroute"
              ? "badge-danger"
              : "badge-warning"
          }`}
        >
          {decision.recommendation === "continue"
            ? "Continue"
            : decision.recommendation === "reroute"
            ? "⚡ Reroute"
            : "🚨 Emergency Sell"}
        </span>
      </div>

      {/* Reasoning */}
      <div className="text-sm text-[#c2c6d6] leading-relaxed whitespace-pre-line mb-4 p-3 rounded-lg bg-black/20 border border-white/5 font-[family-name:var(--font-mono)] text-xs">
        {decision.reasoning}
      </div>

      {/* Recovery Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-3 text-center">
          <p className="text-[10px] text-[#8c909f] uppercase tracking-widest mb-1">Recovery</p>
          <p className={`font-[family-name:var(--font-mono)] text-xl font-bold ${
            decision.estimatedRecoveryPercent >= 80 ? "text-emerald-400" :
            decision.estimatedRecoveryPercent >= 60 ? "text-amber-400" : "text-red-400"
          }`}>
            {decision.estimatedRecoveryPercent}%
          </p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-[10px] text-[#8c909f] uppercase tracking-widest mb-1">Value</p>
          <p className="font-[family-name:var(--font-mono)] text-xl font-bold text-emerald-400">
            ₹{decision.estimatedRecoveryValue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mt-3">
        <div className="flex justify-between text-[10px] text-[#8c909f] mb-1">
          <span>AI Confidence</span>
          <span className="font-[family-name:var(--font-mono)]">{Math.round(decision.confidence * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-1000"
            style={{ width: `${decision.confidence * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
