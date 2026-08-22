import { Firestore } from "@google-cloud/firestore";
import { BigQuery } from "@google-cloud/bigquery";
import { NextResponse } from "next/server";
import { calculateSpoilageTime } from "../../../lib/simulator";

const PROJECT_ID = process.env.GCP_PROJECT_ID || "project-a9c284f8-6bca-440a-a0c";

const firestore = new Firestore({ projectId: PROJECT_ID });
const bigquery = new BigQuery({ projectId: PROJECT_ID });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cargoId = "cargo-001", temperature, humidity, ethyleneLevel = "low", rawGasValue = 0 } = body;

    if (temperature === undefined || humidity === undefined) {
      return NextResponse.json({ error: "Missing temperature or humidity" }, { status: 400 });
    }

    const timestamp = Date.now();
    const tempNum = Number(temperature);
    const humNum = Number(humidity);

    // Calculate spoilage time based on physical formula
    const spoilageMinutes = calculateSpoilageTime(tempNum, 10, ethyleneLevel);

    // 1. Update Firestore Real-time Cargo Telemetry
    const cargoRef = firestore.collection("cargos").doc(cargoId);
    const cargoDoc = await cargoRef.get();

    let newStatus = "in_transit";
    if (tempNum > 10) newStatus = "warning";
    if (spoilageMinutes < 260 && tempNum > 12) newStatus = "emergency";

    if (cargoDoc.exists) {
      await cargoRef.set(
        {
          telemetry: {
            temperature: tempNum,
            humidity: humNum,
            ethyleneLevel,
            timestamp,
          },
          spoilageTimeMinutes: spoilageMinutes,
          status: cargoDoc.data()?.status === "rerouting" ? "rerouting" : newStatus,
        },
        { merge: true }
      );
    }

    // 2. Stream to BigQuery Telemetry Table
    try {
      await bigquery
        .dataset("annapurna_telemetry")
        .table("truck_telemetry")
        .insert([
          {
            truck_id: cargoId,
            temperature_celsius: tempNum,
            humidity_percent: humNum,
            ethylene_level: ethyleneLevel,
            status: newStatus,
            timestamp: new Date(timestamp).toISOString(),
          },
        ]);
    } catch (bqErr: any) {
      console.warn("[BigQuery IoT Stream Warning]:", bqErr.message);
    }

    return NextResponse.json({
      success: true,
      cargoId,
      status: newStatus,
      spoilageMinutes,
      timestamp,
    });
  } catch (error: any) {
    console.error("IoT Telemetry Ingestion Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
