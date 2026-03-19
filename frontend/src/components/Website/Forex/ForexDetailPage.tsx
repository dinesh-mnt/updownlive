"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import BackToTop from "@/components/UI/BackToTop";
import { 
  ArrowLeft, 
  Clock, 
  ExternalLink, 
  Share2, 
  Copy, 
  CheckCheck, 
  Tag, 
  Calendar,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

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

interface ForexDetailPageProps {
  params: { id: string };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric",
  });
}

function parseBody(body: string): React.ReactNode[] {
  return body.split("\n\n").map((paragraph, index) => {
    if (!paragraph.trim()) return null;
    
    // Parse **bold** markdown
    const parts = paragraph.split("**").map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} className="font-bold text-brand-black dark:text-white">
          {part}
        </strong>
      ) : (
        part
      )
    );
    
    return (
      <p key={index} className="mb-4 text-brand-gray dark:text-gray-300 leading-relaxed">
        {parts}
      </p>
    );
  }).filter(Boolean);
}

export default function ForexDetailPage({ params }: ForexDetailPageProps) {
  const [article, setArticle] = useState<ForexArticle | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadArticle = () => {
      try {
        // Get article from sessionStorage
        const storageKey = `forex_${params.id}`;
        const raw = sessionStorage.getItem(storageKey);
        
        if (raw) {
          const articleData = JSON.parse(raw);
          setArticle(articleData);
        } else {
          // Create a fallback article if not found in storage
          setArticle({
            id: params.id,
            title: `Forex Analysis - ${params.id}`,
            subtitle: "Real-time forex market analysis and trading insights",
            author: "Market Analyst",
            publishedAt: new Date().toISOString(),
            imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
            url: "#",
            source: "TradingView",
            currencies: ["USD", "EUR", "GBP", "JPY"],
            body: `**Market Overview:** This forex analysis provides comprehensive insights into currency pair movements and market trends.\n\n**Technical Analysis:** Key support and resistance levels, trend analysis, and trading opportunities in the current market environment.\n\n**Fundamental Factors:** Economic indicators, central bank policies, and geopolitical events affecting currency valuations.`
          });
        }
      } catch (error) {
        console.error('Error loading article:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [params.id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <MarketTicker />
        <div className="min-h-screen bg-white dark:bg-black">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (notFound || !article) {
    return (
      <>
        <Header />
        <MarketTicker />
        <div className="min-h-screen bg-white dark:bg-black">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center py-20">
              <AlertCircle size={48} className="text-brand-red mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-brand-black dark:text-white mb-2">
                Article Not Found
              </h1>
              <p className="text-brand-gray dark:text-gray-400 mb-6">
                The forex analysis you're looking for doesn't exist or has been removed.
              </p>
              <Link 
                href="/forex"
                className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-blue/90 transition-colors"
              >
                <ArrowLeft size={16} /> Back to Forex
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <MarketTicker />
      
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 p-8">
            
            {/* Back Button */}
            <div className="mb-8">
              <Link 
                href="/forex"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-brand-blue/80 transition-colors"
              >
                <ArrowLeft size={16} /> Back to Forex
              </Link>
            </div>

            {/* Currency Tags */}
            {article.currencies.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-6">
                {article.currencies.map(currency => (
                  <span 
                    key={currency} 
                    className="inline-flex items-center gap-1 text-xs font-black text-brand-blue bg-brand-blue/8 border border-brand-blue/20 px-2.5 py-1 rounded-full"
                  >
                    <TrendingUp size={10} /> {currency}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black dark:text-white leading-[1.2] mb-4 tracking-tight">
              {article.title}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-brand-gray dark:text-gray-400 leading-relaxed mb-6 font-medium">
              {article.subtitle}
            </p>

            {/* Meta Information */}
            <div className="flex items-center justify-between gap-4 flex-wrap pb-6 border-b border-brand-border dark:border-white/10 mb-8">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Author */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-black text-brand-blue">
                      {article.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-black dark:text-white leading-tight">
                      {article.author}
                    </p>
                    <p className="text-xs text-brand-gray dark:text-gray-500">
                      {article.source}
                    </p>
                  </div>
                </div>

                <span className="text-brand-border hidden sm:block">|</span>

                {/* Date */}
                <div className="flex items-center gap-1.5 text-sm text-brand-gray dark:text-gray-500">
                  <Calendar size={14} />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>

                {/* Time ago */}
                <div className="flex items-center gap-1.5 text-sm text-brand-gray dark:text-gray-500">
                  <Clock size={13} />
                  <span>{timeAgo(article.publishedAt)}</span>
                </div>
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 text-xs font-bold text-brand-gray dark:text-gray-400 bg-brand-light dark:bg-white/5 border border-brand-border dark:border-white/10 hover:border-brand-blue hover:text-brand-blue px-3 py-2 rounded-xl transition-all"
                >
                  {copied ? (
                    <>
                      <CheckCheck size={13} className="text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> Copy link
                    </>
                  )}
                </button>
                {article.url && article.url !== "#" && (
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-brand-blue hover:bg-brand-blue/90 px-3 py-2 rounded-xl transition-all"
                  >
                    <ExternalLink size={13} /> Source
                  </a>
                )}
              </div>
            </div>

            {/* Hero Image */}
            <div className="rounded-2xl overflow-hidden border border-brand-border dark:border-white/10 mb-10 relative">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-[300px] sm:h-[400px] object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80";
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-4 py-3">
                <p className="text-xs text-white/70">
                  {article.source} · Forex Analysis
                </p>
              </div>
            </div>

            {/* Article Body */}
            <article className="prose-custom mb-10">
              {parseBody(article.body)}
            </article>

            {/* Divider */}
            <div className="border-t border-brand-border dark:border-white/10 my-10" />

            {/* Footer CTA */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-extrabold text-brand-black dark:text-white text-lg mb-1">
                  Want to read more Forex analysis?
                </p>
                <p className="text-sm text-brand-gray dark:text-gray-400">
                  Browse all articles, filter by currency pairs, and stay updated with market trends.
                </p>
              </div>
              <Link 
                href="/forex"
                className="shrink-0 inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-blue/90 transition-colors shadow-lg shadow-brand-blue/20 whitespace-nowrap"
              >
                <ArrowLeft size={16} /> Back to Forex
              </Link>
            </div>

          </div>
        </div>
      </div>
      
      <Footer />
      <BackToTop />
    </>
  );
}