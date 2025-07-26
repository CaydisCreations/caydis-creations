import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect API routes, not the dashboard pages
  // Dashboard pages will be protected by client-side authentication
  if (pathname.startsWith('/api/nimda1')) {
    // For API routes, we'll let them through and handle auth in the API itself
    // The API routes have their own authentication checks
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/nimda1/:path*',
  ],
} 