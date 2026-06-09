"use client";

import { useMemo } from "react";

interface CargoHealthMonitorProps {
  temperature: number;
  humidity: number;
  ethyleneLevel: "low" | "medium" | "high";
  safeMax: number;
  spoilageMinutes: number | null;
}

export default function CargoHealthMonitor({
  temperature,
  humidity,
  ethyleneLevel,
  safeMax,
  spoilageMinutes,
}: CargoHealthMonitorProps) {
  const status = useMemo(() => {
    if (temperature <= safeMax - 2) return "safe";
    if (temperature <= safeMax) return "warning";
    return "danger";
  }, [temperature, safeMax]);

  const gaugePercent = useMemo(() => {
    const maxDisplay = safeMax * 2.5;
    return Math.min(100, (temperature / maxDisplay) * 100);
  }, [temperature, safeMax]);

  const circumference = 2 * Math.PI * 58;
  const strokeDashoffset = circumference - (gaugePercent / 100) * circumference;

  const strokeColor =
    status === "safe" ? "#10b981" : status === "warning" ? "#f59e0b" : "#ef4444";

  const spoilHours = spoilageMinutes ? Math.floor(spoilageMinutes / 60) : null;
  const spoilMins = spoilageMinutes ? spoilageMinutes % 60 : null;

  return (
    <div className={`glass-card p-5 ${status === "danger" ? "glow-red" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#c2c6d6] uppercase tracking-wider">
          Cargo Health Monitor
        </h3>
        <span
          className={`badge ${
            status === "safe"
              ? "badge-safe"
              : status === "warning"
              ? "badge-warning"
              : "badge-danger"
          }`}
        >
          {status === "safe" ? "● Nominal" : status === "warning" ? "● Caution" : "● Critical"}
        </span>
      </div>

      {/* Temperature Gauge */}
      <div className="flex justify-center my-4">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke={strokeColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="gauge-circle"
              style={{
                filter: status === "danger" ? `drop-shadow(0 0 8px ${strokeColor})` : "none",
              }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`font-[family-name:var(--font-mono)] text-3xl font-bold transition-colors duration-500 ${
                status === "safe"
                  ? "text-emerald-400"
                  : status === "warning"
                  ? "text-amber-400"
                  : "text-red-400"
              } ${status === "danger" ? "animate-pulse-danger" : ""}`}
            >
              {temperature.toFixed(1)}°
            </span>
            <span className="text-xs text-[#8c909f] mt-0.5">
              Safe: ≤{safeMax}°C
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="glass-card p-3 text-center">
          <p className="text-[10px] text-[#8c909f] uppercase tracking-widest mb-1">Humidity</p>
          <p className="font-[family-name:var(--font-mono)] text-lg font-semibold text-[#e2e2eb]">
            {humidity}%
          </p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-[10px] text-[#8c909f] uppercase tracking-widest mb-1">Ethylene</p>
          <p
            className={`font-[family-name:var(--font-mono)] text-lg font-semibold ${
              ethyleneLevel === "high"
                ? "text-red-400"
                : ethyleneLevel === "medium"
                ? "text-amber-400"
                : "text-emerald-400"
            }`}
          >
            {ethyleneLevel.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Spoilage Countdown */}
      {spoilageMinutes !== null && spoilageMinutes < 360 && (
        <div className="mt-4 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
          <p className="text-[10px] text-red-400/70 uppercase tracking-widest text-center mb-1">
            Estimated Time to Spoilage
          </p>
          <p
            className={`font-[family-name:var(--font-mono)] text-2xl font-bold text-center ${
              spoilageMinutes < 60 ? "text-red-500 animate-pulse-fast" : "text-red-400 animate-pulse-danger"
            }`}
          >
            {spoilHours !== null && spoilMins !== null
              ? `${String(spoilHours).padStart(2, "0")}:${String(spoilMins).padStart(2, "0")}:00`
              : "--:--:--"}
          </p>
        </div>
      )}
    </div>
  );
}
