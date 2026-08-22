import { NextResponse } from 'next/server';
import { ai, DEFAULT_MODEL } from '@/lib/vertex-client';

export async function POST(req: Request) {
  try {
    const { scenario } = await req.json().catch(() => ({ scenario: '15% rot detected in shipment' }));

    const prompt = `You are an orchestrator simulating a fierce but professional B2B negotiation between two AI agents:
1. 'BuyerAgent': Represents the Wholesaler. They want a high penalty/discount due to issues with the shipment.
2. 'SellerAgent': Represents the Fleet/Logistics company. They want to minimize the penalty, arguing external factors like traffic or weather.

Scenario: ${scenario}

Generate exactly a 3-turn exchange (Buyer, Seller, Buyer, Seller, Buyer, Seller) where they negotiate and finally agree on a final penalty percentage.

Return the result STRICTLY as JSON with the following schema:
{
  "negotiation": [
    { "agent": "BuyerAgent", "message": "..." },
    { "agent": "SellerAgent", "message": "..." }
  ],
  "finalPenaltyPercentage": number
}`;

    const result = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = result.text || '';
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error('Negotiation API error:', error);
    // Fallback response in case of API error or missing key
    return NextResponse.json({
      negotiation: [
        { agent: "BuyerAgent", message: "Initial scan indicates 15% spoilage. We are enforcing a 20% penalty on the total invoice." },
        { agent: "SellerAgent", message: "Telemetry shows the delay was caused by a Category 3 storm, force majeure. We can offer a 5% goodwill discount." },
        { agent: "BuyerAgent", message: "Force majeure clause requires 24h notice. We received none. We can accept 15% to cover our immediate loss." },
        { agent: "SellerAgent", message: "The storm developed rapidly. However, to maintain our partnership, we will split the difference at 10%." },
        { agent: "BuyerAgent", message: "10% is unacceptable given the market price for replacement goods. 12.5% is our final offer." },
        { agent: "SellerAgent", message: "Understood. We accept the 12.5% penalty. Adjustment applied to invoice." }
      ],
      finalPenaltyPercentage: 12.5
    });
  }
}
