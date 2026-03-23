import { NextResponse } from 'next/server';
import axiosInstance from '@/lib/axios';

export async function GET() {
  try {
    const res = await axiosInstance.get('/gold/news', {
      timeout: 15000,
      validateStatus: (status) => status < 500,
    });

    if (res.status === 401 || res.status === 403) {
      return NextResponse.json({ success: false, articles: [] }, { status: 200 });
    }

    if (res.status === 429) {
      return NextResponse.json({ success: false, articles: [] }, { status: 200 });
    }

    if (!res.data?.success) {
      return NextResponse.json({ success: false, articles: [] }, { status: 200 });
    }

    return NextResponse.json({ 
      success: true, 
      articles: res.data.articles || [] 
    });
  } catch (error) {
    console.error("Failed to fetch gold news:", error);
    return NextResponse.json({ success: false, articles: [] }, { status: 200 });
  }
}
