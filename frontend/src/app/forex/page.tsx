import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import ForexPage from '@/components/Website/Forex/Forex';
import { getSeoMetadata } from "@/lib/seo";
import axiosInstance from '@/lib/axios';

export async function generateMetadata() {
  return getSeoMetadata("forex");
}

// Fetch forex news articles server-side from backend API
async function getForexNews() {
  try {
    // Fetch from your backend which uses NewsAPI
    const res = await axiosInstance.get('/forex/news', {
      timeout: 15000,
      validateStatus: (status) => status < 500,
    });

    if (res.status === 401 || res.status === 403) {
      console.warn("Forex API authentication failed");
      return [];
    }

    if (res.status === 429) {
      console.warn("Forex API rate limit exceeded");
      return [];
    }

    if (!res.data?.success) {
      console.warn("Forex API returned unsuccessful response");
      return [];
    }

    return res.data.articles || [];
  } catch (error) {
    console.error("Failed to fetch forex news:", error);
    return [];
  }
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
