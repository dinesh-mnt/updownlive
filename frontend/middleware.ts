import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (
    pathname.startsWith('/admin/login') || 
    pathname.startsWith('/admin/register') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname === '/' ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/brokers') ||
    pathname.startsWith('/charts') ||
    pathname.startsWith('/crypto') ||
    pathname.startsWith('/forex') ||
    pathname.startsWith('/gold') ||
    pathname.startsWith('/news') ||
    pathname.startsWith('/economic-calendar')
  ) {
    return NextResponse.next();
  }

  // For admin routes, let client-side protection handle it
  // since we're using cross-origin cookies
  if (pathname.startsWith('/admin')) {
    console.log('Admin route access attempt:', pathname);
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};