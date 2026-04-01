"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Search, Clock, ExternalLink,
  Newspaper, LayoutGrid, List, TrendingUp, TrendingDown, Minus, Loader2
} from "lucide-react";
import { setArticle } from "@/lib/articleStore";

export interface ForexArticle {
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

interface ForexProps {
  articles?: ForexArticle[];
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) {
    // Try to extract a readable date from RFC 2822 strings
    const match = dateStr.match(/(\d{1,2}\s\w{3}\s\d{4})/);
    return match ? match[1] : dateStr;
  }
  const diff = Date.now() - parsed.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const s = sentiment?.toLowerCase();
  if (s === "positive") return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700 px-2 py-0.5 rounded-full">
      <TrendingUp size={10} /> Positive
    </span>
  );
  if (s === "negative") return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-700 px-2 py-0.5 rounded-full">
      <TrendingDown size={10} /> Negative
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 px-2 py-0.5 rounded-full">
      <Minus size={10} /> Neutral
    </span>
  );
}

// ── Article Row (List view) ──────────────────────────────────────────────────
function ArticleRow({ article }: { article: ForexArticle }) {
  const router = useRouter();

  const handleRoute = (e: React.MouseEvent) => {
    e.preventDefault();
    setArticle(`forex_${article.id}`, article);
    router.push(`/forex/${article.id}`);
  };

  return (
    <article className="border-b border-[#e8e8e8] dark:border-white/10 last:border-0">
      <div className="py-5 flex gap-5 items-start">
        <div className="flex-1 min-w-0">
          <h2
            className="text-xl md:text-2xl font-extrabold text-brand-black dark:text-white leading-snug mb-2 cursor-pointer hover:text-brand-blue transition-colors"
            onClick={handleRoute}
          >
            {article.title}
          </h2>
          <p className="text-sm text-[#555] dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
            {article.text}
          </p>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-brand-blue">{article.source_name}</span>
              <span className="text-[#ccc]">·</span>
              <span className="text-sm text-[#888] dark:text-gray-500 flex items-center gap-1">
                <Clock size={12} /> {timeAgo(article.date)}
              </span>
              {article.sentiment && (
                <><span className="text-[#ccc]">·</span><SentimentBadge sentiment={article.sentiment} /></>
              )}
              {(article.currency?.length ?? 0) > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {article.currency.map(c => (
                    <span key={c} className="text-xs font-black text-brand-blue bg-brand-blue/8 border border-brand-blue/15 px-1.5 py-0.5 rounded-md">
                      {c}
                    </span>
                  ))}
                </div>
              )}
              {(article.topics?.length ?? 0) > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {article.topics.map(t => (
                    <span key={t} className="text-xs text-[#888] dark:text-gray-500 bg-[#f5f5f5] dark:bg-zinc-800 px-1.5 py-0.5 rounded-md border border-[#e8e8e8] dark:border-white/10">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <a
              href={article.news_url}
              onClick={handleRoute}
              className="flex items-center gap-1.5 text-sm font-bold text-brand-blue hover:text-brand-red transition-colors whitespace-nowrap select-none"
            >
              Read Article <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {article.image_url && (
          <a href={article.news_url} onClick={handleRoute} className="shrink-0 w-[200px] md:w-[240px] hidden sm:block" tabIndex={-1}>
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-[130px] md:h-[145px] object-cover rounded-lg border border-brand-border dark:border-white/10 hover:opacity-90 transition-opacity"
            />
          </a>
        )}
      </div>
    </article>
  );
}

// ── Grid Card ────────────────────────────────────────────────────────────────
function ArticleGridCard({ article }: { article: ForexArticle }) {
  const router = useRouter();

  const handleRoute = (e: React.MouseEvent) => {
    e.preventDefault();
    setArticle(`forex_${article.id}`, article);
    router.push(`/forex/${article.id}`);
  };

  return (
    <a
      href={article.news_url}
      onClick={handleRoute}
      className="group bg-white dark:bg-zinc-900 rounded-2xl border border-[#e8e8e8] dark:border-white/10 overflow-hidden hover:shadow-xl hover:shadow-brand-blue/8 hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      {article.image_url ? (
        <div className="relative overflow-hidden h-44 bg-[#f5f5f5] dark:bg-zinc-800 shrink-0">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {(article.currency?.length ?? 0) > 0 && (
            <div className="absolute top-2.5 left-2.5 flex gap-1 flex-wrap">
              {article.currency.map(c => (
                <span key={c} className="text-xs font-black text-white bg-brand-blue/90 backdrop-blur px-2 py-0.5 rounded-md">{c}</span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="h-44 bg-[#f5f5f5] dark:bg-zinc-800 flex items-center justify-center shrink-0">
          <Newspaper size={32} className="text-[#ccc] dark:text-zinc-600" />
        </div>
      )}

      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-extrabold text-brand-black dark:text-white text-sm leading-snug line-clamp-3 group-hover:text-brand-blue transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-[#777] dark:text-gray-400 leading-relaxed line-clamp-2 flex-1">{article.text}</p>
        {(article.topics?.length ?? 0) > 0 && (
          <div className="flex gap-1 flex-wrap">
            {article.topics.slice(0, 3).map(t => (
              <span key={t} className="text-xs text-[#888] dark:text-gray-500 bg-[#f5f5f5] dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-[#e8e8e8] dark:border-white/10">{t}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-[#f0f0f0] dark:border-white/10 mt-1">
          <span className="text-xs font-semibold text-brand-blue truncate max-w-[55%]">{article.source_name}</span>
          <div className="flex items-center gap-2 shrink-0">
            {article.sentiment && <SentimentBadge sentiment={article.sentiment} />}
            <span className="text-xs text-[#aaa] dark:text-gray-500 flex items-center gap-1">
              <Clock size={10} /> {timeAgo(article.date)}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;

export default function Forex({ articles: initialArticles }: ForexProps) {
  const [articles, setArticles] = useState<ForexArticle[]>(initialArticles || []);
  const [loading, setLoading] = useState(!initialArticles);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"list" | "grid">("list");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (initialArticles) return;
    axios.get('/api/forex-news')
      .then(res => { if (res.data?.success) setArticles(res.data.articles || []); })
      .catch(err => console.error('Failed to fetch forex news:', err?.message))
      .finally(() => setLoading(false));
  }, [initialArticles]);

  const filtered = useMemo(() => {
    setPage(1);
    if (!query.trim()) return articles;
    const q = query.toLowerCase();
    return articles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.source_name.toLowerCase().includes(q) ||
      a.currency.some(c => c.toLowerCase().includes(q)) ||
      a.topics.some(t => t.toLowerCase().includes(q))
    );
  }, [query, articles]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goTo = (p: number) => {
    setPage(Math.min(Math.max(1, p), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNums = useMemo(() => {
    let s = Math.max(1, page - 2), e = Math.min(totalPages, s + 4);
    s = Math.max(1, e - 4);
    const n: number[] = [];
    for (let i = s; i <= e; i++) n.push(i);
    return n;
  }, [page, totalPages]);

  return (
    <div className="bg-white dark:bg-black min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-4xl font-extrabold text-brand-black dark:text-white mb-6 tracking-tight">Forex</h1>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e8e8e8] dark:border-white/10">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search articles, pairs, topics…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#f7f7f7] dark:bg-zinc-900 border border-[#e0e0e0] dark:border-white/10 rounded-lg text-[#111] dark:text-white placeholder:text-[#aaa] dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 transition-all"
            />
          </div>
          <span className="text-xs text-[#888] font-medium whitespace-nowrap hidden sm:block ml-auto">
            {filtered.length} article{filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="hidden sm:flex items-center bg-[#f7f7f7] dark:bg-zinc-900 border border-[#e0e0e0] dark:border-white/10 rounded-xl p-1 gap-1 shrink-0">
            <button onClick={() => setView("list")} title="List view"
              className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-brand-blue text-white shadow-sm" : "text-[#888] hover:bg-[#e8e8e8] dark:hover:bg-zinc-800"}`}>
              <List size={15} />
            </button>
            <button onClick={() => setView("grid")} title="Grid view"
              className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-brand-blue text-white shadow-sm" : "text-[#888] hover:bg-[#e8e8e8] dark:hover:bg-zinc-800"}`}>
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-brand-blue" />
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-green-500" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-brand-black dark:text-white mb-2">We're Getting Things Ready</h2>
            <p className="text-[#555] dark:text-gray-400 text-sm max-w-sm leading-relaxed">
              Our forex news feed is being set up. Live currency market updates and analysis will be available here shortly. Please check back soon.
            </p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Newspaper size={40} className="text-[#ccc] mb-3" />
            <p className="font-bold text-[#111] dark:text-white">No articles found</p>
            <p className="text-sm text-[#888] dark:text-gray-500 mt-1">Try a different search term.</p>
          </div>
        ) : view === "list" && !isMobile ? (
          <div>{paginated.map(a => <ArticleRow key={a.id} article={a} />)}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map(a => <ArticleGridCard key={a.id} article={a} />)}
          </div>
        )}

        {articles.length > 0 && filtered.length > PAGE_SIZE && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#e8e8e8] dark:border-white/10">
            <p className="text-sm text-[#888] dark:text-gray-500">
              Showing <span className="font-bold text-[#111] dark:text-white">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="font-bold text-[#111] dark:text-white">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => goTo(page - 1)} disabled={page === 1} className="p-2 rounded-lg border border-[#e0e0e0] dark:border-white/10 hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm dark:bg-zinc-900">‹ Prev</button>
              {pageNums[0] > 1 && <><button onClick={() => goTo(1)} className="w-9 h-9 rounded-lg border border-[#e0e0e0] dark:border-white/10 text-sm font-bold hover:border-brand-blue hover:text-brand-blue transition-all dark:bg-zinc-900">1</button>{pageNums[0] > 2 && <span className="px-1 text-[#aaa]">…</span>}</>}
              {pageNums.map(p => (
                <button key={p} onClick={() => goTo(p)} className={`w-9 h-9 rounded-lg border text-sm font-bold transition-all ${p === page ? "bg-brand-blue border-brand-blue text-white" : "border-[#e0e0e0] dark:border-white/10 hover:border-brand-blue hover:text-brand-blue dark:bg-zinc-900"}`}>{p}</button>
              ))}
              {pageNums[pageNums.length - 1] < totalPages && <>{pageNums[pageNums.length - 1] < totalPages - 1 && <span className="px-1 text-[#aaa]">…</span>}<button onClick={() => goTo(totalPages)} className="w-9 h-9 rounded-lg border border-[#e0e0e0] dark:border-white/10 text-sm font-bold hover:border-brand-blue hover:text-brand-blue transition-all dark:bg-zinc-900">{totalPages}</button></>}
              <button onClick={() => goTo(page + 1)} disabled={page === totalPages} className="p-2 rounded-lg border border-[#e0e0e0] dark:border-white/10 hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm dark:bg-zinc-900">Next ›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
