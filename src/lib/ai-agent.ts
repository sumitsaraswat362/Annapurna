// ============================================================
// ANNAPURNA — Agentic AI Decision Engine
// ============================================================
//
// In production, this would call Google Gemini API for natural
// language reasoning. For the demo/hackathon, we use deterministic
// logic that produces the same high-quality output without
// API latency or rate limits.
//
// TODO (Production): Replace deterministic logic with:
//   const response = await ai.generateContent({
//     model: "gemini-2.0-flash",
//     systemInstruction: AGENT_SYSTEM_PROMPT,
//     contents: [{ role: "user", parts: [{ text: JSON.stringify(cargo) }] }],
//   });
// ============================================================

import { Cargo, AIDecision, Market } from "./types";
import { calculateSpoilageTime } from "./simulator";

/**
 * The Agentic AI analyzes the cargo's current state and makes an
 * autonomous decision: continue delivery, or emergency reroute.
 */
export async function makeDecision(cargo: Cargo): Promise<AIDecision> {
  const { telemetry, safeTemperatureMax, etaMinutes, reroutableMarkets } = cargo;
  const spoilageMinutes = calculateSpoilageTime(
    telemetry.temperature,
    safeTemperatureMax,
    telemetry.ethyleneLevel
  );

  // --- Decision Logic ---

  // Case 1: Temperature is safe
  if (telemetry.temperature <= safeTemperatureMax) {
    return {
      cargoId: cargo.id,
      timestamp: Date.now(),
      reasoning: `All systems nominal. Temperature ${telemetry.temperature}°C is within safe range (≤${safeTemperatureMax}°C). Humidity at ${telemetry.humidity}%. Ethylene levels: ${telemetry.ethyleneLevel}. Continuing delivery to ${cargo.originalDestination.name}.`,
      recommendation: "continue",
      suggestedMarket: null,
      estimatedRecoveryPercent: 100,
      estimatedRecoveryValue: cargo.estimatedCargoValue,
      confidence: 0.95,
    };
  }

  // Case 2: Temperature exceeded but cargo will survive transit
  if (spoilageMinutes > (etaMinutes ?? 999)) {
    return {
      cargoId: cargo.id,
      timestamp: Date.now(),
      reasoning: `⚠️ WARNING: Temperature ${telemetry.temperature}°C exceeds safe limit of ${safeTemperatureMax}°C. However, estimated spoilage in ${spoilageMinutes} minutes. ETA to ${cargo.originalDestination.name}: ${etaMinutes} minutes. Cargo will survive transit. Continuing delivery with elevated monitoring.`,
      recommendation: "continue",
      suggestedMarket: null,
      estimatedRecoveryPercent: 90,
      estimatedRecoveryValue: Math.round(cargo.estimatedCargoValue * 0.9),
      confidence: 0.75,
    };
  }

  // Case 3: EMERGENCY — Cargo will spoil before arrival
  const nearestMarket = findNearestViableMarket(reroutableMarkets, spoilageMinutes);

  if (!nearestMarket) {
    return {
      cargoId: cargo.id,
      timestamp: Date.now(),
      reasoning: `🚨 CRITICAL: Cold chain failure detected. Temperature ${telemetry.temperature}°C far exceeds safe limit of ${safeTemperatureMax}°C. Ethylene levels: ${telemetry.ethyleneLevel.toUpperCase()}. Estimated spoilage in ${spoilageMinutes} minutes. ETA to ${cargo.originalDestination.name}: ${etaMinutes} minutes. NO viable markets found within spoilage window. Cargo at severe risk.`,
      recommendation: "emergency_sell",
      suggestedMarket: null,
      estimatedRecoveryPercent: 20,
      estimatedRecoveryValue: Math.round(cargo.estimatedCargoValue * 0.2),
      confidence: 0.6,
    };
  }

  const recoveryPercent = calculateRecoveryPercent(nearestMarket, spoilageMinutes);
  const recoveryValue = Math.round(cargo.estimatedCargoValue * (recoveryPercent / 100));

  return {
    cargoId: cargo.id,
    timestamp: Date.now(),
    reasoning: `🚨 COLD CHAIN FAILURE DETECTED

Current temperature: ${telemetry.temperature}°C — exceeds safe limit of ${safeTemperatureMax}°C
Humidity: ${telemetry.humidity}% | Ethylene: ${telemetry.ethyleneLevel.toUpperCase()}
ETA to ${cargo.originalDestination.name}: ${etaMinutes} min
Estimated spoilage in: ${spoilageMinutes} min

⛔ Cargo WILL NOT survive transit to original destination.

✅ RECOMMENDATION: Emergency reroute to ${nearestMarket.name}
   Distance: ${nearestMarket.distanceKm} km (${nearestMarket.etaMinutes} min)
   Estimated value recovery: ₹${recoveryValue.toLocaleString("en-IN")} of ₹${cargo.estimatedCargoValue.toLocaleString("en-IN")} (${recoveryPercent}%)

Broadcasting to nearby wholesalers for immediate purchase.`,
    recommendation: "reroute",
    suggestedMarket: nearestMarket,
    estimatedRecoveryPercent: recoveryPercent,
    estimatedRecoveryValue: recoveryValue,
    confidence: 0.92,
  };
}

/**
 * Find the nearest market that can be reached before spoilage.
 */
function findNearestViableMarket(
  markets: Market[],
  spoilageMinutes: number
): Market | null {
  const viable = markets
    .filter((m) => m.etaMinutes < spoilageMinutes - 10) // 10 min safety buffer
    .sort((a, b) => a.etaMinutes - b.etaMinutes);

  return viable.length > 0 ? viable[0] : null;
}

/**
 * Calculate what percentage of cargo value can be recovered
 * based on how quickly we reach the market.
 */
function calculateRecoveryPercent(market: Market, spoilageMinutes: number): number {
  // If we arrive with plenty of time, we recover ~80-85%
  // The closer to spoilage, the less recovery (distress discount)
  const timeBuffer = spoilageMinutes - market.etaMinutes;
  if (timeBuffer > 60) return 85;
  if (timeBuffer > 30) return 80;
  if (timeBuffer > 15) return 70;
  return 55;
}
