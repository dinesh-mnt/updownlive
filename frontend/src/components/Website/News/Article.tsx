"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar, PenTool } from 'lucide-react';
import axios from 'axios';

export default function ArticlePage() {
  const { id } = useParams() as { id: string };
  const urlParams = decodeURIComponent(id);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        let API_KEY = '';
        try {
          const configRes = await axios.get('http://localhost:5000/api/settings/news-api-key');
          if (configRes.data?.apiKey) API_KEY = configRes.data.apiKey;
        } catch (e) {
          console.error('Failed to load API Key from DB');
        }

        if (!API_KEY) {
          setArticle(null);
          return;
        }
        
        const queryKeyword = urlParams.split('/').pop()?.replace(/-/g, ' ') || 'market';
        
        const res = await axios.get(
          'https://eventregistry.org/api/v1/article/getArticles',
          { 
            params: {
              action: 'getArticles',
              keyword: queryKeyword,
              articlesPage: 1,
              articlesCount: 5,
              dataType: 'news',
              resultType: 'articles',
              apiKey: API_KEY,
            },
            validateStatus: (s) => s < 500 
          }
        );

        if (res.status === 401 || res.status === 403) {
          setArticle(null);
          return;
        }
        
        const data = res.data;
        const rawArticles = data.articles?.results || [];
        
        const mappedArticles = rawArticles.map((a: any) => ({
          title: a.title,
          url: a.url,
          urlToImage: a.image,
          source: { name: a.source?.title || 'Global News' },
          publishedAt: a.dateTimePub || a.date || new Date().toISOString(),
          description: a.body?.substring(0, 200) || 'Description not available.',
          content: a.body || 'Full content available at the source.',
          author: a.authors?.[0]?.name || null,
        }));
        
        const found = mappedArticles.find((a: any) => a.url === urlParams);
        if (found) {
          setArticle(found);
        } else if (mappedArticles.length > 0) {
          setArticle(mappedArticles[0]);
        }
      } catch {
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArticle();
  }, [id, urlParams]);

  if (loading) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center bg-white text-brand-gray">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-semibold text-lg text-brand-blue">Loading article contents...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-brand-light">
        <div className="bg-white p-12 rounded-2xl shadow-xl border border-brand-border text-center max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-brand-black mb-4">Article Not Found</h2>
          <p className="text-brand-gray mb-8">This article may have been removed or is no longer accessible via the API.</p>
          <Link href="/news" className="btn-primary inline-flex">
            <ArrowLeft className="mr-2" size={18} /> Return to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 md:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/news" className="inline-flex items-center text-brand-gray hover:text-brand-blue transition-colors font-medium mb-10 group">
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to News Feed
        </Link>
        
        <article className="bg-white rounded-3xl shadow-2xl border border-brand-border overflow-hidden">
          <header className="p-8 md:p-12 pb-8 border-b border-brand-border bg-brand-light">
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-red text-white text-xs font-black uppercase tracking-widest mb-6">
              {article.source.name}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-brand-black leading-tight tracking-tight mb-8">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-brand-gray text-sm font-medium">
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

          {article.urlToImage && (
            <div className="w-full max-h-[500px] overflow-hidden bg-brand-light">
              <img src={article.urlToImage} alt={article.title} className="w-full h-full object-cover object-center" />
            </div>
          )}

          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-medium text-brand-gray leading-relaxed mb-8 border-l-4 border-brand-blue pl-6 italic">
              {article.description}
            </h2>
            <div className="text-lg text-brand-black leading-loose whitespace-pre-line mb-12">
              {article.content ? article.content.split('[+')[0] : 'Full content available at the source.'}
            </div>
            
            <div className="pt-8 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-6 bg-brand-light rounded-xl p-8">
               <div className="text-center sm:text-left">
                 <h4 className="font-bold text-brand-black mb-2">Want to keep reading?</h4>
                 <p className="text-brand-gray text-sm">Read the full story on the original publication site.</p>
               </div>
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary w-full sm:w-auto"
              >
                Read Original <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
