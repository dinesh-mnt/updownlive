import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api$/, '');

export async function GET(request: NextRequest) {
  const res = await fetch(`${BACKEND_URL}/api/comments/all`, {
    headers: { cookie: request.headers.get('cookie') || '' },
    cache: 'no-store',
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
