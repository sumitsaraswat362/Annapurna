import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ message: 'Authentication is now handled by Firebase client SDK. Use the /login page.' });
}
