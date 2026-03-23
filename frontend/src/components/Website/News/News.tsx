"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, ArrowRight, Newspaper } from 'lucide-react';
import { setArticle } from '@/lib/articleStore';

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

export default function NewsPage() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('business');
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const router = useRouter();

  useEffect(() => {
    fetchNews();
  }, [category]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        category: searchTerm || category,
        search: searchTerm,
        page: '1',
        limit: '12'
      });

      const response = await fetch(`/api/business-news?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.articles) {
          setNews(data.articles);
        } else {
          setNews([]);
        }
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchNews();
  };

  const handleReadClick = (article: Article) => {
    setArticle(`news_${article.id}`, article);
    router.push(`/news/${article.id}`);
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-black dark:text-white mb-6 tracking-tight">
            Global Market News
          </h1>
          <p className="text-lg text-brand-gray dark:text-gray-400 leading-relaxed">
            Discover the latest updates, breaking news, and insights shaping world markets today.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {['business', 'technology', 'general'].map((cat) => (
              <button 
                key={cat} 
                className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wide capitalize whitespace-nowrap transition-all border-2 
                  ${category === cat && !searchTerm 
                    ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20 -translate-y-0.5' 
                    : 'bg-white dark:bg-zinc-900 text-brand-gray dark:text-gray-300 border-brand-border dark:border-white/10 hover:border-brand-blue hover:text-brand-blue'
                  }`}
                onClick={() => { setCategory(cat); setSearchTerm(''); }}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" size={20} />
              <input 
                type="text" 
                placeholder="Search developments..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-border dark:border-white/10 bg-white dark:bg-zinc-900 text-brand-black dark:text-white outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all font-medium"
              />
            </div>
            <button 
              type="submit" 
              className="bg-brand-black dark:bg-brand-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-blue dark:hover:bg-blue-600 transition-colors shadow-lg"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-brand-gray">
            <Loader2 size={48} className="animate-spin text-brand-blue mb-4" />
            <p className="font-semibold text-lg animate-pulse text-brand-blue">Gathering latest updates...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.length > 0 ? news.map((article, index) => (
              <div 
                key={article.id} 
                className="flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-brand-border dark:border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="h-56 w-full relative overflow-hidden bg-brand-light dark:bg-zinc-800">
                  {article.imageUrl && !imageErrors.has(index) ? (
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={() => handleImageError(index)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-blue/10 to-brand-red/10 dark:from-blue-900/20 dark:to-red-900/20">
                      <Newspaper size={40} className="text-brand-border dark:text-white/20" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/95 dark:bg-black/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-brand-red uppercase tracking-wider shadow-sm">
                    {article.source}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-brand-black dark:text-white leading-snug mb-4 flex-1">
                    <button
                      onClick={() => handleReadClick(article)}
                      className="hover:text-brand-blue transition-colors line-clamp-3 text-left"
                    >
                      {article.title}
                    </button>
                  </h3>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-border dark:border-white/10 text-xs text-brand-gray dark:text-gray-400 font-medium uppercase tracking-wide">
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => handleReadClick(article)}
                      className="text-brand-blue flex items-center gap-1 hover:text-brand-red transition-colors font-bold"
                    >
                      Read <ArrowRight size={14}/>
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-24 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10">
                <Newspaper size={48} className="mx-auto text-brand-border dark:text-white/20 mb-4" />
                <p className="text-brand-gray dark:text-gray-400 text-xl mb-4">No matching news found.</p>
                <button 
                   onClick={() => {setSearchTerm(''); setCategory('business');}}
                   className="text-brand-blue font-bold px-6 py-2 bg-brand-blue/10 rounded-full hover:bg-brand-blue hover:text-white transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
