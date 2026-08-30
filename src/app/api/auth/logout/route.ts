import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ message: 'Logout is now handled by Firebase client SDK. Use useAuth().logout().' });
}
