import type { Metadata } from 'next';

export async function getSeoMetadata(pageKey: string): Promise<Metadata> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    // We use cache: 'no-store' so changes reflect instantly during testing
    const res = await fetch(`${apiUrl}/settings/seo`, { cache: 'no-store' });
    const data = await res.json();
    const seoMap = data?.seo || {};
    
    // We prioritize the specific page key, but if it has no title set, we fall back to 'global'
    const pageData = seoMap[pageKey] || {};
    const globalData = seoMap.global || {};

    const origin = pageData.ogUrl || globalData.ogUrl || "https://updownlive.com";
    const title = pageData.title || globalData.title || "UpDownLive - Global Market & News Portal";
    const description = pageData.description || globalData.description || "Real-time global market data, latest financial news, and insights.";
    const keywords = pageData.keywords || globalData.keywords || "finance, market, crypto, forex, gold, brokers";
    const ogImage = pageData.ogImage || globalData.ogImage;

    return {
      title,
      description,
      keywords,
      metadataBase: new URL(origin),
      openGraph: {
        title,
        description,
        url: origin,
        siteName: title,
        images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch (error) {
    // Ultimate fallback if backend is unreachable
    return {
      title: "UpDownLive - Global Market & News Portal",
      description: "Real-time global market data, latest financial news, and insights.",
    };
  }
}
