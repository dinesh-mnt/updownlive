import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
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

  // For admin routes, check session on server-side
  if (pathname.startsWith('/admin')) {
    // Get session cookie
    const sessionToken = request.cookies.get('better-auth.session_token');
    
    console.log('Middleware check:', {
      pathname,
      hasSessionToken: !!sessionToken,
      cookieValue: sessionToken?.value?.substring(0, 20) + '...'
    });

    // If no session token, redirect to login
    if (!sessionToken) {
      console.log('No session token found, redirecting to login');
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Session exists, allow access (role check happens client-side)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};