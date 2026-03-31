import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = (
  process.env.BACKEND_URL ||
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api'
).replace(/\/api$/, '');

export async function GET(request: NextRequest) {
  const articleUrl = request.nextUrl.searchParams.get('articleUrl');
  const res = await fetch(`${BACKEND_URL}/api/comments?articleUrl=${encodeURIComponent(articleUrl || '')}`, {
    headers: { cookie: request.headers.get('cookie') || '' },
    cache: 'no-store',
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await fetch(`${BACKEND_URL}/api/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: request.headers.get('cookie') || '',
      ...(request.headers.get('authorization') ? { authorization: request.headers.get('authorization')! } : {}),
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
