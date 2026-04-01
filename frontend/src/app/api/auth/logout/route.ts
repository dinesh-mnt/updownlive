import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = (
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api'
).replace(/\/api$/, '');

export async function POST(request: NextRequest) {
  const res = await fetch(`${BACKEND_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { cookie: request.headers.get('cookie') || '' },
  });

  const data = await res.json();
  const response = NextResponse.json(data, { status: res.status });

  // Clear the cookie on our domain too
  response.cookies.set('jwt', '', { expires: new Date(0), path: '/' });

  return response;
}
