import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Firebase Auth handles authentication client-side via the AuthProvider.
// Protected routes use the useAuth() hook for client-side redirects.
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
