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
            maxPrice: { type: "number", description: "Maximum price per kg. Null if not specified." },
            minQty: { type: "number", description: "Minimum quantity in kg. Null if not specified." },
            maxSpoilage: { type: "number", description: "Maximum spoilage minutes. Null if not specified." }
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
