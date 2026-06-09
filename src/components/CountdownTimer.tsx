"use client";

import { useEffect, useState, useCallback } from "react";

interface CountdownTimerProps {
  expiresAt: number;
  onExpire?: () => void;
  size?: "sm" | "lg";
}

export default function CountdownTimer({
  expiresAt,
  onExpire,
  size = "sm",
}: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(() => Math.max(0, expiresAt - Date.now()));
  const [expired, setExpired] = useState(false);

  const tick = useCallback(() => {
    const diff = Math.max(0, expiresAt - Date.now());
    setRemaining(diff);
    if (diff <= 0 && !expired) {
      setExpired(true);
      onExpire?.();
    }
  }, [expiresAt, expired, onExpire]);

  useEffect(() => {
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, [tick]);

  const totalSeconds = Math.ceil(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const isUrgent = totalSeconds < 120;
  const isCritical = totalSeconds < 60;

  if (expired) {
    return (
      <span
        className={`font-[family-name:var(--font-mono)] font-bold text-red-500 animate-pulse-fast ${
          size === "lg" ? "text-2xl" : "text-sm"
        }`}
      >
        EXPIRED
      </span>
    );
  }

  return (
    <span
      className={`font-[family-name:var(--font-mono)] font-semibold tabular-nums tracking-tight transition-colors duration-300 ${
        isCritical
          ? "text-red-500 animate-pulse-fast"
          : isUrgent
          ? "text-red-400 animate-pulse-danger"
          : "text-amber-400"
      } ${size === "lg" ? "text-3xl" : "text-sm"}`}
    >
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </span>
  );
}
