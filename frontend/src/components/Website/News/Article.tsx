"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, PenTool, Newspaper } from 'lucide-react';
import CommentSection from './CommentSection';
import { getArticle } from '@/lib/articleStore';

interface Article {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  url: string;
  body: string;
  source: string;
}

export default function ArticlePage() {
  const { id } = useParams() as { id: string };
  const [article, setArticle] = useState<Article | null>(null);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const data = getArticle<Article>(`news_${id}`);
    setArticle(data);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center bg-white dark:bg-black">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-semibold text-lg text-brand-blue">Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white dark:bg-black">
        <div className="bg-white dark:bg-zinc-900 p-12 rounded-2xl shadow-xl border border-brand-border dark:border-white/10 text-center max-w-lg mx-auto">
          <Newspaper size={48} className="mx-auto text-brand-border dark:text-white/20 mb-4" />
          <h2 className="text-2xl font-bold text-brand-black dark:text-white mb-4">Article Not Found</h2>
          <p className="text-brand-gray dark:text-gray-400 mb-8">This article may have been removed or is no longer accessible.</p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft size={18} /> Return to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12 md:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Link
          href="/news"
          className="inline-flex items-center text-brand-gray dark:text-gray-400 hover:text-brand-blue transition-colors font-medium mb-10 group"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to News Feed
        </Link>

        <article className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-brand-border dark:border-white/10 overflow-hidden">
          <header className="p-8 md:p-12 pb-8 border-b border-brand-border dark:border-white/10 bg-brand-light dark:bg-zinc-800">
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-red text-white text-xs font-black uppercase tracking-widest mb-6">
              {article.source}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black dark:text-white leading-tight tracking-tight mb-8">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-brand-gray dark:text-gray-400 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-brand-blue" />
                {new Date(article.publishedAt).toLocaleDateString(undefined, {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </div>
              {article.author && (
                <div className="flex items-center gap-2">
                  <PenTool size={16} className="text-brand-red" />
                  {article.author}
                </div>
              )}
            </div>
          </header>

          {article.imageUrl && !imageError && (
            <div className="w-full max-h-[480px] overflow-hidden bg-brand-light dark:bg-zinc-800">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover object-center"
                onError={() => setImageError(true)}
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            {article.subtitle && (
              <p className="text-xl font-medium text-brand-gray dark:text-gray-300 leading-relaxed mb-8 border-l-4 border-brand-blue pl-6 italic">
                {article.subtitle}
              </p>
            )}

            {article.body && (
              <div className="text-lg text-brand-black dark:text-gray-100 leading-loose mb-8">
                {article.body.split('[+')[0].trim()}
              </div>
            )}

            {/* Full article CTA — NewsAPI only provides a preview, full content is on the source */}
            <div className="rounded-2xl border-2 border-dashed border-brand-blue/30 dark:border-brand-blue/20 bg-brand-blue/5 dark:bg-brand-blue/10 p-8 mb-12 text-center">
              <Newspaper size={36} className="mx-auto text-brand-blue mb-4 opacity-70" />
              <h4 className="text-lg font-bold text-brand-black dark:text-white mb-2">
                This is a preview — full article is on the source
              </h4>
              <p className="text-brand-gray dark:text-gray-400 text-sm mb-6">
                News providers limit preview content. Click below to read the complete article on the original site.
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg"
              >
                Read Full Article <ExternalLink size={18} />
              </a>
            </div>

            <div className="pt-8 border-t border-brand-border dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-brand-gray dark:text-gray-400">
              <span>Source: <span className="font-semibold text-brand-black dark:text-white">{article.source}</span></span>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand-blue hover:underline font-medium"
              >
                View on {article.source} <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </article>

        <CommentSection articleUrl={article.url} articleTitle={article.title} />
      </div>
    </div>
  );
}
