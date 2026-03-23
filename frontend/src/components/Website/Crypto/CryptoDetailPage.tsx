"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Clock, ExternalLink, Copy, CheckCheck,
  Calendar, AlertCircle, Newspaper
} from "lucide-react";
import { getArticle } from "@/lib/articleStore";
import CommentSection from "@/components/Website/News/CommentSection";

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

function timeAgo(d: string): string {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function parseBody(body: string) {
  return body.split("\n\n").filter(Boolean).map((para, i) => (
    <p key={i} className="mb-4 text-brand-gray dark:text-gray-300 leading-relaxed">
      {para.split("**").map((part, j) =>
        j % 2 === 1
          ? <strong key={j} className="font-bold text-brand-black dark:text-white">{part}</strong>
          : part
      )}
    </p>
  ));
}

export default function CryptoDetailPage({ id }: { id: string }) {
  const [article, setArticle] = useState<CryptoArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const data = getArticle<CryptoArticle>(`crypto_${id}`);
    setArticle(data);
    setLoading(false);
  }, [id]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <h2 className="text-2xl font-bold text-brand-black dark:text-white mb-3">Article Not Found</h2>
          <p className="text-brand-gray dark:text-gray-400 mb-6">Please go back and click the article again.</p>
          <Link href="/crypto" className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors">
            <ArrowLeft size={16} /> Back to Crypto
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link href="/crypto" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-blue-600 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Crypto
        </Link>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 overflow-hidden">
          {/* Header */}
          <div className="p-8 md:p-10 border-b border-brand-border dark:border-white/10 bg-brand-light dark:bg-zinc-800">
            {article.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-5">
                {article.tags.map(t => (
                  <span key={t} className="text-xs font-black text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700/30 px-2.5 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black dark:text-white leading-tight mb-4">
              {article.title}
            </h1>
            <p className="text-lg text-brand-gray dark:text-gray-400 leading-relaxed mb-6">{article.subtitle}</p>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-brand-gray dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700/30 flex items-center justify-center text-purple-700 dark:text-purple-400 font-black text-sm">
                    {article.author.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-brand-black dark:text-white">{article.author}</span>
                  <span className="text-brand-border">·</span>
                  <span>{article.source}</span>
                </div>
                <div className="flex items-center gap-1.5"><Calendar size={14} />{formatDate(article.publishedAt)}</div>
                <div className="flex items-center gap-1.5"><Clock size={13} />{timeAgo(article.publishedAt)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs font-bold text-brand-gray dark:text-gray-400 bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/10 hover:border-brand-blue hover:text-brand-blue px-3 py-2 rounded-xl transition-all">
                  {copied ? <><CheckCheck size={13} className="text-green-600" /><span className="text-green-600">Copied!</span></> : <><Copy size={13} />Copy link</>}
                </button>
                {article.url && article.url !== "#" && (
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-white bg-brand-blue hover:bg-blue-600 px-3 py-2 rounded-xl transition-all">
                    <ExternalLink size={13} /> Source
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Image */}
          {article.imageUrl && !imageError && (
            <div className="w-full max-h-[420px] overflow-hidden bg-brand-light dark:bg-zinc-800">
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover"
                onError={() => setImageError(true)} />
            </div>
          )}

          {/* Body */}
          <div className="p-8 md:p-10">
            <div className="mb-10">{parseBody(article.body)}</div>

            <div className="rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-700/40 bg-purple-50 dark:bg-purple-900/10 p-8 mb-10 text-center">
              <Newspaper size={32} className="mx-auto text-purple-500 mb-3 opacity-70" />
              <h4 className="font-bold text-brand-black dark:text-white mb-2">Read the full article on the source</h4>
              <p className="text-brand-gray dark:text-gray-400 text-sm mb-5">Content providers limit preview length. Click below for the complete article.</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg">
                Read Full Article <ExternalLink size={16} />
              </a>
            </div>

            <div className="pt-6 border-t border-brand-border dark:border-white/10 flex items-center justify-between text-sm text-brand-gray dark:text-gray-400">
              <span>Source: <span className="font-semibold text-brand-black dark:text-white">{article.source}</span></span>
              <Link href="/crypto" className="inline-flex items-center gap-1.5 text-brand-blue hover:underline font-medium">
                <ArrowLeft size={14} /> Back to Crypto
              </Link>
            </div>
          </div>
        </div>

        <CommentSection articleUrl={article.url} articleTitle={article.title} />
      </div>
    </div>
  );
}
