import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to auth page, but protect dashboard and API routes
  if (pathname.startsWith('/nimda1/dashboard') || pathname.startsWith('/api/nimda1')) {
    // For now, redirect to 404 for all unauthorized access
    // In production, you could add Firebase token verification here
    return NextResponse.redirect(new URL('/404', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/nimda1/dashboard/:path*',
    '/api/nimda1/:path*',
  ],
} 