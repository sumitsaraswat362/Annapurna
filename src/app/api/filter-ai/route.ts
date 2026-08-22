import { NextResponse } from "next/server";
import { ai } from "@/lib/vertex-client";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            type: { type: "string", description: "Cargo type, e.g., seafood, produce, dairy, meat, vaccines. Null if not specified." },
            minPrice: { type: "number", description: "Minimum price per kg. Null if not specified." },
            maxPrice: { type: "number", description: "Maximum price per kg. Null if not specified." },
            minQty: { type: "number", description: "Minimum quantity in kg. Null if not specified." },
            maxSpoilage: { type: "number", description: "Maximum spoilage minutes. Null if not specified." },
            tempMin: { type: "number", description: "Minimum temperature in Celsius. Null if not specified." },
            tempMax: { type: "number", description: "Maximum temperature in Celsius. Null if not specified." },
            humMin: { type: "number", description: "Minimum humidity percentage. Null if not specified." },
            humMax: { type: "number", description: "Maximum humidity percentage. Null if not specified." },
            ethyleneLevel: { type: "string", description: "Ethylene level: 'all', 'low', 'medium', or 'high'. Null if not specified." },
            maxDistance: { type: "number", description: "Maximum distance in km. Null if not specified." },
            temporal: { type: "string", description: "Temporal filter: 'all', 'loaded_under_2h', 'loaded_under_4h', or 'loaded_over_4h'. Null if not specified." },
            sortBy: { type: "string", description: "Sort option: 'default', 'price_asc', 'price_desc', 'spoilage_asc', 'distance_asc', or 'best_match'. Null if not specified." }
          }
        }
      }
    });

    const prompt = `Extract the following filtering criteria from the user query.
User query: "${query}"

Return a JSON object matching the schema. If a criteria is not mentioned, omit it or set it to null.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      return NextResponse.json({ error: "Failed to parse JSON" }, { status: 500 });
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("Error in AI filter route:", error);
    return NextResponse.json({ error: "Failed to process AI filter" }, { status: 500 });
  }
}
