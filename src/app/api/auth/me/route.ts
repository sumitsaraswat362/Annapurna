import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ message: 'Authentication is now handled by Firebase client SDK. Use useAuth() hook.' });
}
