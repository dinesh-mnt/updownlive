"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Newspaper, Clock } from "lucide-react";
import { setArticle as storeArticle } from "@/lib/articleStore";

interface Article {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  url: string;
  source: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function LatestNewsSection() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/business-news?category=business&limit=6');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.articles) {
            setNews(data.articles);
          }
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const router = useRouter();

  const handleReadClick = (article: Article) => {
    storeArticle(`news_${article.id}`, article);
    router.push(`/news/${article.id}`);
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  return (
    <section className="py-24 bg-white dark:bg-black border-t border-brand-border dark:border-white/5 relative overflow-hidden">
      {/* decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red font-semibold text-sm mb-5">
              <Newspaper size={15} /> Breaking Updates
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black dark:text-white tracking-tight mb-4">
              Latest{" "}
              <span className="text-brand-red">Business</span> News
            </h2>
            <p className="text-lg text-brand-gray dark:text-gray-400 leading-relaxed">
              The most recent developments impacting global markets and modern economies.
            </p>
          </div>
          <Link
            href="/news"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-red text-brand-red font-bold text-base hover:bg-brand-red hover:text-white hover:shadow-lg hover:shadow-brand-red/25 transition-all duration-200"
          >
            View All News <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 overflow-hidden">
                <div className="h-52 bg-brand-light dark:bg-zinc-800 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-brand-light dark:bg-zinc-800 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-brand-light dark:bg-zinc-800 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {news.map((article, index) => (
              <div
                key={article.id}
                className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-brand-border dark:border-white/10 hover:shadow-xl hover:shadow-brand-black/8 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="h-52 w-full overflow-hidden bg-brand-light dark:bg-zinc-800 relative shrink-0">
                  {article.imageUrl && !imageErrors.has(index) ? (
                    <img
                      src={article.imageUrl}
                      alt={article.title || 'News article image'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={() => handleImageError(index)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-brand-blue/10 to-brand-red/10 dark:from-blue-900/20 dark:to-red-900/20">
                      <Newspaper size={40} className="text-brand-border dark:text-white/20" />
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Source badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 dark:bg-black/90 backdrop-blur-sm text-brand-blue px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {article.source}
                    </span>
                  </div>
                  {index === 0 && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-brand-red text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                        Latest
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-brand-gray dark:text-gray-400 font-medium mb-3">
                    <Clock size={12} />
                    {timeAgo(article.publishedAt)}
                  </div>
                  <h3 className="text-base font-extrabold text-brand-black dark:text-white leading-snug mb-4 flex-1 group-hover:text-brand-blue transition-colors duration-200">
                    <button
                      onClick={() => handleReadClick(article)}
                      className="line-clamp-3 text-left hover:text-brand-blue transition-colors"
                    >
                      {article.title}
                    </button>
                  </h3>
                  <div className="pt-4 border-t border-brand-border dark:border-white/10 flex items-center justify-between">
                    <span className="text-xs font-semibold text-brand-gray dark:text-gray-400 uppercase tracking-wider">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleReadClick(article)}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-red hover:text-brand-blue transition-colors"
                    >
                      Read <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="inline-flex flex-col items-center gap-4 p-10 rounded-2xl bg-brand-light dark:bg-zinc-900 border border-brand-border dark:border-white/10">
              <Newspaper size={40} className="text-brand-border dark:text-white/20" />
              <p className="text-lg font-semibold text-brand-gray dark:text-white">
                No news available at the moment.
              </p>
              <p className="text-sm text-brand-gray dark:text-gray-400">Please check back later.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
