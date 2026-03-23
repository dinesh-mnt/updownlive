import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || 'business';
    const search = searchParams.get('search') || '';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12';

    const params = new URLSearchParams({
      category,
      search,
      page,
      limit
    });

    // Remove /api from BACKEND_URL if it exists, then add the full path
    const baseUrl = BACKEND_URL.replace(/\/api$/, '');
    const apiUrl = `${baseUrl}/api/news/business?${params}`;

    console.log('Fetching news from:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('News API error:', response.status, response.statusText);
      return NextResponse.json(
        { success: false, articles: [], message: 'Failed to fetch news' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('News API success:', data.articles?.length || 0, 'articles');
    return NextResponse.json(data);

  } catch (error) {
    console.error('Business news API route error:', error);
    return NextResponse.json(
      { success: false, articles: [], message: 'Internal server error' },
      { status: 500 }
    );
  }
}
