import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import ForexPage from '@/components/Website/Forex/Forex';
import { getSeoMetadata } from "@/lib/seo";
import axios from "axios";
import axiosInstance from '@/lib/axios';

export async function generateMetadata() {
  return getSeoMetadata("forex");
}

// Fetch forex news articles server-side
async function getForexNews() {
  let API_KEY = "";

  try {
    const configRes = await axiosInstance.get(`/settings/forex-news-api-key`);
    if (configRes.data?.apiKey) API_KEY = configRes.data.apiKey;
  } catch (e) {
    console.warn("Could not reach backend for forex news API key:", (e as Error).message);
    return [];
  }

  if (!API_KEY) {
    console.warn("Forex news API key not configured");
    return [];
  }

  try {
    const res = await axios.get("https://api.marketaux.com/v1/news/all", {
      params: {
        symbols: 'EURUSD,GBPUSD,USDJPY,AUDUSD,USDCAD,USDCHF,NZDUSD',
        filter_entities: true,
        language: 'en',
        limit: 50,
        api_token: API_KEY,
      },
      timeout: 15000,
      validateStatus: (status) => status < 500,
    });

    if (res.status === 401 || res.status === 403) {
      console.warn("Forex API authentication failed");
      return [];
    }

    const rawArticles = res.data?.data || [];
    return rawArticles.map((item: any, index: number) => ({
      id: item.uuid || `forex-${index}`,
      title: item.title || 'Forex Market Update',
      subtitle: item.description || item.snippet || '',
      author: item.source || 'Market Analyst',
      publishedAt: item.published_at || new Date().toISOString(),
      imageUrl: item.image_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&q=80',
      url: item.url || '#',
      source: item.source || 'Market News',
      currencies: extractCurrencies(item.title + ' ' + (item.description || '')),
      body: item.description || item.snippet || 'Market analysis and trading insights.',
    }));
  } catch (error) {
    console.error("Failed to fetch forex news:", error);
    return [];
  }
}

// Extract currency pairs from text
function extractCurrencies(text: string): string[] {
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD', 'CNY', 'MXN'];
  const found = new Set<string>();
  
  currencies.forEach(currency => {
    if (text.toUpperCase().includes(currency)) {
      found.add(currency);
    }
  });
  
  return Array.from(found);
}

export default async function Page() {
  const articles = await getForexNews();
  
  return(
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Header />
      <MarketTicker />
      <ForexPage articles={articles} />
      <Footer />
    </div>
  )
}
