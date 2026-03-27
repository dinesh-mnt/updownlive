"use client";

import React, { useState, useEffect, memo } from "react";
import { Clock, Coins, Newspaper } from "lucide-react";
import { useRouter } from "next/navigation";

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
          <span className="text-sm font-semibold text-brand-blue truncate max-w-[60%]">{article.author}</span>
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
          <span className="text-sm font-semibold text-brand-blue truncate max-w-[60%]">{article.author}</span>
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
          <span className="text-sm font-semibold text-brand-blue truncate max-w-[60%]">{article.author}</span>
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
// Main Component
// ==========================================
export default function LiveFeed() {
  const [forexArticles, setForexArticles] = useState<ForexArticle[]>([]);
  const [goldArticles, setGoldArticles] = useState<GoldArticle[]>([]);
  const [cryptoArticles, setCryptoArticles] = useState<CryptoArticle[]>([]);
  const [loadingForex, setLoadingForex] = useState(true);
  const [loadingGold, setLoadingGold] = useState(true);
  const [loadingCrypto, setLoadingCrypto] = useState(true);

  useEffect(() => {
    fetch('/api/forex-news')
      .then(r => r.ok ? r.json() : { articles: [] })
      .then(d => setForexArticles(d.articles || []))
      .catch(() => {})
      .finally(() => setLoadingForex(false));

    fetch('/api/gold-news')
      .then(r => r.ok ? r.json() : { articles: [] })
      .then(d => setGoldArticles(d.articles || []))
      .catch(() => {})
      .finally(() => setLoadingGold(false));

    fetch('/api/crypto-news')
      .then(r => r.ok ? r.json() : { articles: [] })
      .then(d => setCryptoArticles(d.articles || []))
      .catch(() => {})
      .finally(() => setLoadingCrypto(false));
  }, []);

  const EmptyState = () => (
    <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/10 rounded-2xl p-12 text-center">
      <Newspaper size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
      <p className="text-brand-gray dark:text-gray-400">No articles available at the moment.</p>
    </div>
  );

  const Spinner = ({ color = "border-brand-blue" }: { color?: string }) => (
    <div className="flex items-center justify-center py-20">
      <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${color}`} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 font-outfit min-h-screen relative z-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 space-y-4 md:space-y-0 border-b border-brand-border dark:border-white/10 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-black dark:text-white tracking-tight">Live Feeds</h1>
          <p className="text-brand-gray dark:text-gray-400 mt-3 text-lg">Real-time market news across Forex, Gold, and Crypto.</p>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-brand-gray dark:text-gray-400 bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/10 px-5 py-2.5 rounded-xl shadow-sm">
          <Clock size={16} className="text-brand-blue" />
          <span>Live Data Sync <span className="text-green-500 font-bold ml-1 animate-pulse">● Active</span></span>
        </div>
      </div>

      <div className="space-y-24">

        {/* Forex News */}
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
          {loadingForex ? <Spinner /> : forexArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {forexArticles.slice(0, 12).map(a => <ForexNewsCard key={a.id} article={a} />)}
            </div>
          ) : <EmptyState />}
        </section>

        {/* Gold News */}
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
          {loadingGold ? <Spinner color="border-yellow-500" /> : goldArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {goldArticles.slice(0, 12).map(a => <GoldNewsCard key={a.id} article={a} />)}
            </div>
          ) : <EmptyState />}
        </section>

        {/* Crypto News */}
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
          {loadingCrypto ? <Spinner color="border-indigo-500" /> : cryptoArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cryptoArticles.slice(0, 12).map(a => <CryptoNewsCard key={a.id} article={a} />)}
            </div>
          ) : <EmptyState />}
        </section>

      </div>

      <div className="fixed top-1/4 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
    </div>
  );
}
