"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Calendar,
  AlertCircle,
  Newspaper,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { getArticle } from "@/lib/articleStore";
import CommentSection from "@/components/Website/News/CommentSection";

interface GoldArticle {
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

function timeAgo(d: string): string {
  if (!d) return "";
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return d;
  const diff = Date.now() - parsed.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function formatDate(d: string): string {
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return d;
  return parsed.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const s = sentiment?.toLowerCase();
  if (s === "positive")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 px-2.5 py-1 rounded-full">
        <TrendingUp size={11} /> Positive
      </span>
    );
  if (s === "negative")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 px-2.5 py-1 rounded-full">
        <TrendingDown size={11} /> Negative
      </span>
    );
  if (!s) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 px-2.5 py-1 rounded-full">
      <Minus size={11} /> Neutral
    </span>
  );
}

export default function GoldDetailPage({ id }: { id: string }) {
  const [article, setArticle] = useState<GoldArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getArticle<GoldArticle>(`gold_${id}`);
    setArticle(data);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center p-12 bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 max-w-md">
          <AlertCircle size={48} className="text-brand-red mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-brand-black dark:text-white mb-3">
            Article Not Found
          </h2>
          <p className="text-brand-gray dark:text-gray-400 mb-6">
            Please go back and click the article again.
          </p>
          <Link
            href="/gold"
            className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Gold
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Link
          href="/gold"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Gold
        </Link>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 overflow-hidden">
          <div className="p-8 md:p-10 border-b border-brand-border dark:border-white/10 bg-brand-light dark:bg-zinc-800">
            <div className="flex flex-wrap gap-2 mb-5">
              {(article.currency ?? []).map((c) => (
                <span
                  key={c}
                  className="text-xs font-black text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/30 px-2.5 py-1 rounded-full"
                >
                  {c}
                </span>
              ))}
              {article.sentiment && (
                <SentimentBadge sentiment={article.sentiment} />
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black dark:text-white leading-tight mb-6">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-brand-gray dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/30 flex items-center justify-center text-yellow-700 dark:text-yellow-400 font-black text-sm">
                    {article.source_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-brand-black dark:text-white">
                    {article.source_name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formatDate(article.date)}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {timeAgo(article.date)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {article.news_url && article.news_url !== "#" && (
                  <a
                    href={article.news_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-brand-blue hover:bg-blue-600 px-3 py-2 rounded-xl transition-all"
                  >
                    <ExternalLink size={13} /> Source
                  </a>
                )}
              </div>
            </div>
          </div>

          {article.image_url && (
            <div className="w-full max-h-[420px] overflow-hidden bg-brand-light dark:bg-zinc-800">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 md:p-10">
            <p className="text-brand-gray dark:text-gray-300 leading-relaxed mb-8">
              {article.text}
            </p>

            {(article.topics ?? []).length > 0 && (
              <div className="flex gap-2 flex-wrap mb-8">
                {article.topics.map((t) => (
                  <span
                    key={t}
                    className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full border border-gray-200 dark:border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mb-8">
              <a
                href={article.news_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg"
              >
                Read Full Article <ExternalLink size={15} />
              </a>
            </div>

            <div className="pt-6 border-t border-brand-border dark:border-white/10 flex items-center justify-between text-sm text-brand-gray dark:text-gray-400">
              <span>
                Source:{" "}
                <span className="font-semibold text-brand-black dark:text-white">
                  {article.source_name}
                </span>
              </span>
              <Link
                href="/gold"
                className="inline-flex items-center gap-1.5 text-brand-blue hover:underline font-medium"
              >
                <ArrowLeft size={14} /> Back to Gold
              </Link>
            </div>
          </div>
        </div>

        <CommentSection
          articleUrl={article.news_url}
          articleTitle={article.title}
        />
      </div>
    </div>
  );
}
