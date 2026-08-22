import { NextResponse } from 'next/server';
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req: Request) {
  try {
    const { to, message } = await req.json();

    const recipient = to || process.env.ALERT_WHATSAPP_TO;
    if (!recipient) {
      return NextResponse.json({ error: 'No recipient specified' }, { status: 400 });
    }

    // Format the number for WhatsApp if not already formatted
    const formattedTo = recipient.startsWith('whatsapp:') ? recipient : `whatsapp:${recipient}`;
    const from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

    const result = await client.messages.create({
      body: message || '🚨 Annapurna Cold Chain Alert: A cargo shipment needs immediate attention!',
      from: from,
      to: formattedTo,
    });

    return NextResponse.json({ success: true, sid: result.sid });
  } catch (error: unknown) {
    console.error('WhatsApp send error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to send WhatsApp', details: message }, { status: 500 });
  }
}
