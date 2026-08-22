import { NextResponse } from "next/server";
import { ai, DEFAULT_MODEL } from "@/lib/vertex-client";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const prompt = `You are a filter extraction AI. Extract filtering criteria from the user query and return a JSON object.

User query: "${query}"

Return a JSON object with ONLY the fields that the user mentioned. Possible fields:
- type: string (cargo type like "seafood", "dairy", "vegetables", "fish", "tomatoes", "mangoes", "flowers")
- minPrice: number (minimum price per kg)
- maxPrice: number (maximum price per kg)
- minQty: number (minimum quantity in kg)
- maxSpoilage: number (maximum spoilage time in minutes)
- tempMin: number (minimum temperature in Celsius)
- tempMax: number (maximum temperature in Celsius)
- humMin: number (minimum humidity percentage)
- humMax: number (maximum humidity percentage)
- ethyleneLevel: string ("low", "medium", or "high")
- maxDistance: number (maximum distance in km)
- temporal: string ("loaded_under_2h", "loaded_under_4h", or "loaded_over_4h")
- sortBy: string ("price_asc", "price_desc", "spoilage_asc", "distance_asc", or "best_match")

Only include fields the user explicitly or implicitly mentioned. Return valid JSON only.`;

    const result = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = result.text || "{}";
    
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Failed to parse JSON" }, { status: 500 });
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("Error in AI filter route:", error);
    return NextResponse.json({ error: "Failed to process AI filter" }, { status: 500 });
  }
}
