"use client";

import React, { useState, useEffect, memo } from "react";
import { Clock, Coins, Newspaper, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setArticle } from "@/lib/articleStore";

interface Article {
  id: string;
  title: string;
  text: string;
  source_name: string;
  date: string;
  image_url: string;
  news_url: string;
  topics: string[];
  sentiment: string;
  currency: string[];
  type: string;
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return dateStr;
  const diff = Date.now() - parsed.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function SentimentDot({ sentiment }: { sentiment: string }) {
  const s = sentiment?.toLowerCase();
  if (s === "positive") return <TrendingUp size={11} className="text-emerald-500 shrink-0" />;
  if (s === "negative") return <TrendingDown size={11} className="text-red-500 shrink-0" />;
  return <Minus size={11} className="text-gray-400 shrink-0" />;
}

// ── Shared Card ──────────────────────────────────────────────────────────────
const NewsCard = memo(({ article, prefix, tagColor }: {
  article: Article;
  prefix: string;
  tagColor: string;
}) => {
  const router = useRouter();

  const handleRoute = (e: React.MouseEvent) => {
    e.preventDefault();
    setArticle(`${prefix}_${article.id}`, article);
    router.push(`/${prefix}/${article.id}`);
  };

  return (
    <a
      href={article.news_url}
      onClick={handleRoute}
      className="group bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 overflow-hidden hover:shadow-xl hover:shadow-brand-blue/8 hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      {article.image_url ? (
        <div className="relative overflow-hidden h-48 bg-gray-100 dark:bg-zinc-800 shrink-0">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {(article.currency?.length ?? 0) > 0 && (
            <div className="absolute top-2.5 left-2.5 flex gap-1 flex-wrap">
              {article.currency.slice(0, 3).map(c => (
                <span key={c} className={`text-xs font-black text-white ${tagColor} backdrop-blur px-2 py-0.5 rounded-md`}>{c}</span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="h-48 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
          <Newspaper size={32} className="text-gray-300 dark:text-zinc-600" />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 gap-2">
        <h3 className="font-extrabold text-brand-black dark:text-white text-base leading-snug line-clamp-3 group-hover:text-brand-blue transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1">
          {article.text}
        </p>
        {(article.topics?.length ?? 0) > 0 && (
          <div className="flex gap-1 flex-wrap">
            {article.topics.slice(0, 3).map(t => (
              <span key={t} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-white/10">{t}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/10 mt-1">
          <span className="text-sm font-semibold text-brand-blue truncate max-w-[60%]">{article.source_name}</span>
          <div className="flex items-center gap-1.5 shrink-0">
            {article.sentiment && <SentimentDot sentiment={article.sentiment} />}
            <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
              <Clock size={11} /> {timeAgo(article.date)}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
});
NewsCard.displayName = "NewsCard";

// ── Main Component ───────────────────────────────────────────────────────────
export default function LiveFeed() {
  const [forexArticles, setForexArticles] = useState<Article[]>([]);
  const [goldArticles, setGoldArticles] = useState<Article[]>([]);
  const [cryptoArticles, setCryptoArticles] = useState<Article[]>([]);
  const [loadingForex, setLoadingForex] = useState(true);
  const [loadingGold, setLoadingGold] = useState(true);
  const [loadingCrypto, setLoadingCrypto] = useState(true);
  const [errorForex, setErrorForex] = useState(false);
  const [errorGold, setErrorGold] = useState(false);
  const [errorCrypto, setErrorCrypto] = useState(false);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    axios.get(`${api}/forex/news`)
      .then(r => { if (r.data?.success) setForexArticles(r.data.articles || []); })
      .catch(() => setErrorForex(true))
      .finally(() => setLoadingForex(false));

    axios.get(`${api}/forex/news`)
      .then(r => { if (r.data?.success) setGoldArticles(r.data.articles || []); })
      .catch(() => setErrorGold(true))
      .finally(() => setLoadingGold(false));

    axios.get(`${api}/crypto/news`)
      .then(r => { if (r.data?.success) setCryptoArticles(r.data.articles || []); })
      .catch(() => setErrorCrypto(true))
      .finally(() => setLoadingCrypto(false));
  }, []);

  const EmptyState = () => (
    <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/10 rounded-2xl p-12 text-center">
      <Newspaper size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
      <p className="text-brand-gray dark:text-gray-400">No articles available at the moment.</p>
    </div>
  );

  const ComingSoon = () => (
    <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/10 rounded-2xl p-10 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 dark:text-gray-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-extrabold text-brand-black dark:text-white mb-2">We're Getting Things Ready</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
        This feed is being set up. Live market updates will be available here shortly. Please check back soon.
      </p>
    </div>
  );

  const Spinner = ({ color = "border-brand-blue" }: { color?: string }) => (
    <div className="flex items-center justify-center py-20">
      <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${color}`} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 font-outfit min-h-screen relative z-10">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 space-y-4 md:space-y-0 border-b border-brand-border dark:border-white/10 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-black dark:text-white tracking-tight">Live Feeds</h1>
          <p className="text-brand-gray dark:text-gray-400 mt-3 text-lg">Real-time market news across Forex, Gold/Oil, and Crypto.</p>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-brand-gray dark:text-gray-400 bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/10 px-5 py-2.5 rounded-xl shadow-sm">
          <Clock size={16} className="text-brand-blue" />
          <span>Live Data Sync <span className="text-green-500 font-bold ml-1 animate-pulse">● Active</span></span>
        </div>
      </div>

      <div className="space-y-24">

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
          {loadingForex ? <Spinner /> : errorForex ? <ComingSoon /> : forexArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {forexArticles.slice(0, 12).map(a => <NewsCard key={a.id} article={a} prefix="forex" tagColor="bg-brand-blue/90" />)}
            </div>
          ) : <EmptyState />}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center">
              <span className="text-2xl">🪙</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-black dark:text-white">Gold/Oil News</h2>
              <p className="text-brand-gray dark:text-gray-400 text-sm mt-1">Latest updates on gold, oil, and commodity markets.</p>
            </div>
          </div>
          {loadingGold ? <Spinner color="border-yellow-500" /> : errorGold ? <ComingSoon /> : goldArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {goldArticles.slice(0, 12).map(a => <NewsCard key={a.id} article={a} prefix="gold" tagColor="bg-yellow-500/90" />)}
            </div>
          ) : <EmptyState />}
        </section>

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
          {loadingCrypto ? <Spinner color="border-indigo-500" /> : errorCrypto ? <ComingSoon /> : cryptoArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cryptoArticles.slice(0, 12).map(a => <NewsCard key={a.id} article={a} prefix="crypto" tagColor="bg-indigo-500/90" />)}
            </div>
          ) : <EmptyState />}
        </section>

      </div>

      <div className="fixed top-1/4 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
    </div>
  );
}
