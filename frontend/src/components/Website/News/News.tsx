"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('business');

  useEffect(() => {
    fetchNews();
  }, [category]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      let API_KEY = '';
      try {
        const configRes = await axios.get('http://localhost:5000/api/settings/news-api-key');
        if (configRes.data?.apiKey) API_KEY = configRes.data.apiKey;
      } catch (e) {
        console.error('Failed to load API Key from DB');
      }

      if (!API_KEY) {
        setNews([]);
        return;
      }
      
      const queryKeyword = searchTerm ? searchTerm : category;

      const res = await axios.get('https://eventregistry.org/api/v1/article/getArticles', {
        params: {
          action: 'getArticles',
          keyword: queryKeyword,
          articlesPage: 1,
          articlesCount: 12,
          articlesSortBy: 'date',
          articlesSortByAsc: false,
          dataType: 'news',
          resultType: 'articles',
          apiKey: API_KEY,
        },
        validateStatus: (s) => s < 500 
      });

      if (res.status === 401 || res.status === 403) {
        setNews([]);
        return;
      }
      
      const rawArticles = res.data?.articles?.results || [];
      const mappedNews = rawArticles.map((article: any) => ({
        title: article.title,
        url: article.url,
        urlToImage: article.image,
        source: { name: article.source?.title || 'Global News' },
        publishedAt: article.dateTimePub || article.date || new Date().toISOString(),
      }));

      setNews(mappedNews);
    } catch {
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews();
  };

  return (
    <div className="bg-brand-light min-h-screen py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-black mb-6 tracking-tight">Global Market News</h1>
          <p className="text-lg text-brand-gray leading-relaxed">Discover the latest updates, breaking news, and insights shaping world markets today.</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {['business', 'technology', 'general'].map((cat) => (
              <button 
                key={cat} 
                className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wide capitalize whitespace-nowrap transition-all border-2 
                  ${category === cat && !searchTerm 
                    ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20 -translate-y-0.5' 
                    : 'bg-white text-brand-gray border-brand-border hover:border-brand-blue hover:text-brand-blue'
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
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-border bg-white text-brand-black outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all font-medium"
              />
            </div>
            <button type="submit" className="bg-brand-black text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-blue transition-colors shadow-lg">
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
            {news.length > 0 ? news.map((article: any, index: number) => (
              <div key={index} className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="h-56 w-full relative overflow-hidden bg-brand-light">
                  {article.urlToImage ? (
                    <img src={article.urlToImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-gray font-medium">No Image</div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-brand-red uppercase tracking-wider shadow-sm">
                    {article.source.name}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-brand-black leading-snug mb-4 flex-1">
                    <Link href={`/news/${encodeURIComponent(article.url)}`} className="hover:text-brand-blue transition-colors line-clamp-3">
                      {article.title}
                    </Link>
                  </h3>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-border text-xs text-brand-gray font-medium uppercase tracking-wide">
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    <Link href={`/news/${encodeURIComponent(article.url)}`} className="text-brand-blue flex items-center gap-1 hover:text-brand-red transition-colors font-bold">
                      Read <ArrowRight size={14}/>
                    </Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-24 text-center bg-white rounded-2xl border border-brand-border">
                <p className="text-brand-gray text-xl mb-4">No matching news found.</p>
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
