import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const countryCode = searchParams.get('countryCode') || '';
  const limit = searchParams.get('limit') || '50';

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const params = new URLSearchParams({ limit });
  if (countryCode) params.set('countryCode', countryCode);

  try {
    const res = await fetch(`${backendUrl}/economic-calendar/events?${params}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ success: false, events: [] }, { status: 500 });
  }
}
