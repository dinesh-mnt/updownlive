"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { Clock, Calendar, Coins, BarChart2, Newspaper, BarChart3 } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import TradingViewChart from "@/components/TradingViewChart";

// ==========================================
// Chart Symbols
// ==========================================
const POPULAR_SYMBOLS = [
  { symbol: "NASDAQ:AAPL", name: "Apple Inc.", category: "Tech" },
  { symbol: "NASDAQ:TSLA", name: "Tesla Inc.", category: "Auto" },
  { symbol: "NASDAQ:GOOGL", name: "Alphabet Inc.", category: "Tech" },
  { symbol: "NYSE:NVDA", name: "NVIDIA Corp.", category: "Tech" },
  { symbol: "BINANCE:BTCUSDT", name: "Bitcoin", category: "Crypto" },
  { symbol: "FX:EURUSD", name: "EUR/USD", category: "Forex" },
  { symbol: "COMEX:GC1!", name: "Gold Futures", category: "Commodity" },
  { symbol: "NASDAQ:QQQ", name: "NASDAQ 100", category: "Index" },
];

// ==========================================
// Types
// ==========================================
interface ForexArticle {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  url: string;
  body: string;
  source: string;
  currencies: string[];
}

interface GoldArticle {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  url: string;
  body: string;
  source: string;
  tags: string[];
}

interface CryptoArticle {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  url: string;
  body: string;
  source: string;
  tags: string[];
}

// ==========================================
// Helper Functions
// ==========================================
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) !== 1 ? "s" : ""} ago`;
}

// ==========================================
// TradingView Widget Components
// ==========================================

const EconomicCalendarWidget = memo(({ theme }: { theme: string }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: theme === "dark" ? "dark" : "light",
      isTransparent: true,
      width: "100%",
      height: "600",
      locale: "en",
      importanceFilter: "-1,0,1",
      currencyFilter: "USD,EUR,ITL,NZD,CHF,AUD,FRF,JPY,ZAR,TRL,CAD,BAM,DEM,MXN,ESP,GBP"
    });
    container.current.appendChild(script);
  }, [theme]);

  return <div className="tradingview-widget-container" ref={container} style={{ height: "80vh", width: "100%" }}></div>;
});
EconomicCalendarWidget.displayName = "EconomicCalendarWidget";

// ==========================================
// Gold News Card Component
// ==========================================
const GoldNewsCard = memo(({ article }: { article: GoldArticle }) => {
  const router = useRouter();

  const handleRoute = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem(`gold_${article.id}`, JSON.stringify(article));
    router.push(`/gold/${article.id}`);
  };

  return (
    <a
      href={article.url}
      onClick={handleRoute}
      className="group bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 overflow-hidden hover:shadow-xl hover:shadow-brand-blue/8 hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      <div className="relative overflow-hidden h-48 bg-gray-100 dark:bg-zinc-800 shrink-0">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=80";
          }}
        />
        {article.tags.length > 0 && (
          <div className="absolute top-2.5 left-2.5 flex gap-1">
            {article.tags.slice(0, 3).map(t => (
              <span key={t} className="text-xs font-black text-white bg-yellow-500/90 backdrop-blur px-2 py-0.5 rounded-md">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 gap-2">
        <h3 className="font-extrabold text-brand-black dark:text-white text-base leading-snug line-clamp-3 group-hover:text-brand-blue transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1">
          {article.subtitle}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/10 mt-2">
          <span className="text-sm font-semibold text-brand-blue truncate max-w-[60%]">
            {article.author}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 shrink-0">
            <Clock size={12} /> {timeAgo(article.publishedAt)}
          </span>
        </div>
      </div>
    </a>
  );
});
GoldNewsCard.displayName = "GoldNewsCard";

// ==========================================
// Crypto News Card Component
// ==========================================
const CryptoNewsCard = memo(({ article }: { article: CryptoArticle }) => {
  const router = useRouter();

  const handleRoute = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem(`crypto_${article.id}`, JSON.stringify(article));
    router.push(`/crypto/${article.id}`);
  };

  return (
    <a
      href={article.url}
      onClick={handleRoute}
      className="group bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 overflow-hidden hover:shadow-xl hover:shadow-brand-blue/8 hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      <div className="relative overflow-hidden h-48 bg-gray-100 dark:bg-zinc-800 shrink-0">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1640826514546-05db5ac9e6e8?w=400&q=80";
          }}
        />
        {article.tags.length > 0 && (
          <div className="absolute top-2.5 left-2.5 flex gap-1">
            {article.tags.slice(0, 3).map(t => (
              <span key={t} className="text-xs font-black text-white bg-indigo-500/90 backdrop-blur px-2 py-0.5 rounded-md">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 gap-2">
        <h3 className="font-extrabold text-brand-black dark:text-white text-base leading-snug line-clamp-3 group-hover:text-brand-blue transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1">
          {article.subtitle}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/10 mt-2">
          <span className="text-sm font-semibold text-brand-blue truncate max-w-[60%]">
            {article.author}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 shrink-0">
            <Clock size={12} /> {timeAgo(article.publishedAt)}
          </span>
        </div>
      </div>
    </a>
  );
});
CryptoNewsCard.displayName = "CryptoNewsCard";

// ==========================================
// Forex News Card Component
// ==========================================
const ForexNewsCard = memo(({ article }: { article: ForexArticle }) => {
  const router = useRouter();

  const handleRoute = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem(`forex_${article.id}`, JSON.stringify(article));
    router.push(`/forex/${article.id}`);
  };

  return (
    <a
      href={article.url}
      onClick={handleRoute}
      className="group bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 overflow-hidden hover:shadow-xl hover:shadow-brand-blue/8 hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      <div className="relative overflow-hidden h-48 bg-gray-100 dark:bg-zinc-800 shrink-0">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80";
          }}
        />
        {article.currencies.length > 0 && (
          <div className="absolute top-2.5 left-2.5 flex gap-1">
            {article.currencies.slice(0, 3).map(c => (
              <span key={c} className="text-xs font-black text-white bg-brand-blue/90 backdrop-blur px-2 py-0.5 rounded-md">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 gap-2">
        <h3 className="font-extrabold text-brand-black dark:text-white text-base leading-snug line-clamp-3 group-hover:text-brand-blue transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1">
          {article.subtitle}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/10 mt-2">
          <span className="text-sm font-semibold text-brand-blue truncate max-w-[60%]">
            {article.author}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 shrink-0">
            <Clock size={12} /> {timeAgo(article.publishedAt)}
          </span>
        </div>
      </div>
    </a>
  );
});
ForexNewsCard.displayName = "ForexNewsCard";

// ==========================================
// Main Dashboard Component
// ==========================================

export default function LiveFeed() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(POPULAR_SYMBOLS[0]);
  const [forexArticles, setForexArticles] = useState<ForexArticle[]>([]);
  const [goldArticles, setGoldArticles] = useState<GoldArticle[]>([]);
  const [cryptoArticles, setCryptoArticles] = useState<CryptoArticle[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [loadingGold, setLoadingGold] = useState(true);
  const [loadingCrypto, setLoadingCrypto] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Fetch Forex articles
    const fetchForexArticles = async () => {
      try {
        const response = await fetch('/api/forex-news');
        if (response.ok) {
          const data = await response.json();
          setForexArticles(data.articles || []);
        }
      } catch (error) {
        console.error('Failed to fetch forex articles:', error);
      } finally {
        setLoadingArticles(false);
      }
    };

    // Fetch Gold articles
    const fetchGoldArticles = async () => {
      try {
        const response = await fetch('/api/gold-news');
        if (response.ok) {
          const data = await response.json();
          setGoldArticles(data.articles || []);
        }
      } catch (error) {
        console.error('Failed to fetch gold articles:', error);
      } finally {
        setLoadingGold(false);
      }
    };

    // Fetch Crypto articles
    const fetchCryptoArticles = async () => {
      try {
        const response = await fetch('/api/crypto-news');
        if (response.ok) {
          const data = await response.json();
          setCryptoArticles(data.articles || []);
        }
      } catch (error) {
        console.error('Failed to fetch crypto articles:', error);
      } finally {
        setLoadingCrypto(false);
      }
    };

    fetchForexArticles();
    fetchGoldArticles();
    fetchCryptoArticles();
  }, []);

  // Avoid hydration mismatch by waiting for mount to inject proper theme
  const safeTheme = mounted ? (resolvedTheme || "light") : "light";

  // Get first 12 articles for 3x4 grid
  const displayArticles = forexArticles.slice(0, 12);
  const displayGoldArticles = goldArticles.slice(0, 12);
  const displayCryptoArticles = cryptoArticles.slice(0, 12);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 font-outfit min-h-screen relative z-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 space-y-4 md:space-y-0 relative z-10 border-b border-brand-border dark:border-white/10 pb-8">
        <div>
           <h1 className="text-4xl md:text-5xl font-extrabold text-brand-black dark:text-white tracking-tight">
             Live Feeds
           </h1>
           <p className="text-brand-gray dark:text-gray-400 mt-3 text-lg">Powered by TradingView API Connections</p>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-brand-gray dark:text-gray-400 bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/10 px-5 py-2.5 rounded-xl shadow-sm">
           <Clock size={16} className="text-brand-blue" />
           <span>Live Data Sync <span className="text-green-500 font-bold ml-1 animate-pulse">● Active</span></span>
        </div>
      </div>

      {/* Stacked Layout Sections */}
      <div className="space-y-24">
        
        {/* Section 1: Forex News Grid */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
              <Newspaper size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-black dark:text-white">Forex Market News</h2>
              <p className="text-brand-gray dark:text-gray-400 text-sm mt-1">Latest news and analysis from the foreign exchange market.</p>
            </div>
          </div>
          
          {loadingArticles ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
            </div>
          ) : displayArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayArticles.map(article => (
                <ForexNewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/10 rounded-2xl p-12 text-center">
              <Newspaper size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-brand-gray dark:text-gray-400">No forex news available at the moment.</p>
            </div>
          )}
        </section>

        {/* Section 2: Economic Calendar */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <Calendar size={24} className="text-brand-blue" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-black dark:text-white">Global Economic Calendar</h2>
              <p className="text-brand-gray dark:text-gray-400 text-sm mt-1">Real-time macro-economic events and data reports.</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#131722] border border-brand-border dark:border-white/10 rounded-2xl overflow-hidden shadow-xl p-1">
            <EconomicCalendarWidget theme={safeTheme} />
          </div>
        </section>

        {/* Section 3: Gold & Precious Metals News */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center">
              <span className="text-2xl">🪙</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-black dark:text-white">Gold & Precious Metals News</h2>
              <p className="text-brand-gray dark:text-gray-400 text-sm mt-1">Latest updates on gold, silver, platinum, and precious metals markets.</p>
            </div>
          </div>
          
          {loadingGold ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : displayGoldArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayGoldArticles.map(article => (
                <GoldNewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/10 rounded-2xl p-12 text-center">
              <Newspaper size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-brand-gray dark:text-gray-400">No gold news available at the moment.</p>
            </div>
          )}
        </section>

        {/* Section 4: Cryptocurrency News */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <Coins size={24} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-black dark:text-white">Cryptocurrency News</h2>
              <p className="text-brand-gray dark:text-gray-400 text-sm mt-1">Latest updates on Bitcoin, Ethereum, and the broader crypto market.</p>
            </div>
          </div>
          
          {loadingCrypto ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : displayCryptoArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayCryptoArticles.map(article => (
                <CryptoNewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/10 rounded-2xl p-12 text-center">
              <Newspaper size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-brand-gray dark:text-gray-400">No crypto news available at the moment.</p>
            </div>
          )}
        </section>

        {/* Section 5: Advanced Charts */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
              <BarChart2 size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-black dark:text-white">Advanced Technical Charts</h2>
              <p className="text-brand-gray dark:text-gray-400 text-sm mt-1">Interactive candlestick charts powered by TradingView.</p>
            </div>
          </div>

          {/* Symbol Selector */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="text-brand-blue" size={20} />
              <h3 className="text-lg font-bold text-brand-black dark:text-white">Popular Markets</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SYMBOLS.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => setSelectedSymbol(item)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedSymbol.symbol === item.symbol
                      ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/25"
                      : "bg-white dark:bg-white/5 border border-brand-border dark:border-white/10 text-brand-gray dark:text-gray-300 hover:border-brand-blue hover:text-brand-blue"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{item.name}</span>
                    <span className="text-xs opacity-75">({item.category})</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chart Container */}
          <div className="w-full rounded-2xl shadow-2xl shadow-brand-black/10 dark:shadow-black/50 overflow-hidden border border-brand-border dark:border-white/10 bg-white dark:bg-zinc-900">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-brand-border dark:border-white/10 bg-white dark:bg-zinc-900">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-brand-red/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-sm font-semibold text-brand-gray dark:text-gray-400 ml-2">
                UpDownLive — {selectedSymbol.name} Chart
              </span>
              <span className="ml-auto flex items-center gap-1.5 text-xs font-bold text-green-600">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                LIVE
              </span>
            </div>
            <TradingViewChart
              symbol={selectedSymbol.symbol}
              interval="D"
              height={600}
              showToolbar={true}
              showLegend={true}
            />
          </div>
        </section>

      </div>

      {/* Background Decorative Blob */}
      <div className="fixed top-1/4 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

    </div>
  );
}
