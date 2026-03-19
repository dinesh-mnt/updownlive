"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search, ChevronDown, ChevronUp, Clock, ExternalLink,
  Newspaper, AlertCircle, LayoutGrid, List
} from "lucide-react";

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

interface ForexProps {
  articles: ForexArticle[];
}

// ──────────────────────── Helpers ──────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) !== 1 ? "s" : ""} ago`;
}

function parseBoldMarkdown(text: string) {
  return text.split("**").map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-bold text-brand-black dark:text-white">{part}</strong> : part
  );
}

// ──────────────────────── Article Row ──────────────────────────────────────
function ArticleRow({ article }: { article: ForexArticle }) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const handleRoute = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem(`forex_${article.id}`, JSON.stringify(article));
    router.push(`/forex/${article.id}`);
  };

  const paragraphs = article.body.split("\n\n").filter(Boolean);

  return (
    <article className="border-b border-[#e8e8e8] dark:border-white/10 last:border-0">
      <div className="py-5 flex gap-5 items-start">
        <div className="flex-1 min-w-0">
          <h2
            className="text-xl md:text-2xl font-extrabold text-brand-black dark:text-white leading-snug mb-2 cursor-pointer hover:text-brand-blue transition-colors"
            onClick={() => setExpanded(!expanded)}
          >
            {article.title}
          </h2>
          <p className="text-sm text-[#555] dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
            {article.subtitle}
          </p>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-brand-blue">
                {article.author}
              </span>
              <span className="text-[#ccc]">·</span>
              <span className="text-sm text-[#888] dark:text-gray-500 flex items-center gap-1">
                <Clock size={12} /> {timeAgo(article.publishedAt)}
              </span>
              {article.currencies.length > 0 && (
                <>
                  <span className="text-[#ccc]">·</span>
                  <div className="flex gap-1">
                    {article.currencies.map(c => (
                      <span key={c} className="text-xs font-black text-brand-blue bg-brand-blue/8 border border-brand-blue/15 px-1.5 py-0.5 rounded-md">
                        {c}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-sm font-bold text-[#333] dark:text-gray-300 hover:text-brand-blue transition-colors whitespace-nowrap select-none"
            >
              {expanded ? (
                <><span>Collapse</span> <ChevronUp size={16} /></>
              ) : (
                <><span>Expand</span> <ChevronDown size={16} /></>
              )}
            </button>
          </div>
        </div>

        <a
          href={article.url}
          onClick={handleRoute}
          className="shrink-0 w-[200px] md:w-[240px] hidden sm:block"
          tabIndex={-1}
        >
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-[130px] md:h-[145px] object-cover rounded-lg border border-brand-border dark:border-white/10 hover:opacity-90 transition-opacity"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&q=80";
            }}
          />
        </a>
      </div>

      {expanded && (
        <div className="pb-6 pr-0 sm:pr-[256px] animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-xs font-black text-[#555] dark:text-gray-500 uppercase tracking-[0.15em] mb-4">
            Fundamental Overview
          </h3>
          <div className="space-y-4 text-[15px] text-[#333] dark:text-gray-300 leading-relaxed">
            {paragraphs.map((para, i) => (
              <p key={i}>{parseBoldMarkdown(para)}</p>
            ))}
          </div>
          <a
            href={article.url}
            onClick={handleRoute}
            className="inline-flex items-center gap-1.5 mt-5 text-sm font-bold text-brand-blue hover:text-brand-red transition-colors"
          >
            Read full article <ExternalLink size={13} />
          </a>
        </div>
      )}
    </article>
  );
}

// ──────────────────────── Grid Card ─────────────────────────────────────────
function ArticleGridCard({ article }: { article: ForexArticle }) {
  const router = useRouter();

  const handleRoute = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem(`forex_${article.id}`, JSON.stringify(article));
    router.push(`/forex/${article.id}`);
  };

  return (
    <a
      href={article.url}
      onClick={handleRoute}
      className="group bg-white dark:bg-zinc-900 rounded-2xl border border-[#e8e8e8] dark:border-white/10 overflow-hidden hover:shadow-xl hover:shadow-brand-blue/8 hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      <div className="relative overflow-hidden h-44 bg-[#f5f5f5] dark:bg-zinc-800 shrink-0">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80";
          }}
        />
        {article.currencies.length > 0 && (
          <div className="absolute top-2.5 left-2.5 flex gap-1">
            {article.currencies.map(c => (
              <span key={c} className="text-xs font-black text-white bg-brand-blue/90 backdrop-blur px-2 py-0.5 rounded-md">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-extrabold text-brand-black dark:text-white text-sm leading-snug line-clamp-3 group-hover:text-brand-blue transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-[#777] dark:text-gray-400 leading-relaxed line-clamp-2 flex-1">
          {article.subtitle}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-[#f0f0f0] dark:border-white/10 mt-1">
          <span className="text-xs font-semibold text-brand-blue truncate max-w-[55%]">
            {article.author}
          </span>
          <span className="text-xs text-[#aaa] dark:text-gray-500 flex items-center gap-1 shrink-0">
            <Clock size={10} /> {timeAgo(article.publishedAt)}
          </span>
        </div>
      </div>
    </a>
  );
}

// ──────────────────────── Main Page ────────────────────────────────────────
const PAGE_SIZE = 10;

export default function Forex({ articles }: ForexProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"list" | "grid">("list");

  // Filter
  const filtered = useMemo(() => {
    if (!query.trim()) return articles;
    const q = query.toLowerCase();
    return articles.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.currencies.some(c => c.toLowerCase().includes(q))
    );
  }, [query, articles]);

  // Reset page when filter changes
  useMemo(() => {
    setPage(1);
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goTo = (p: number) => {
    setPage(Math.min(Math.max(1, p), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNums = useMemo(() => {
    const half = 2;
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    const nums: number[] = [];
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }, [page, totalPages]);

  return (
    <div className="bg-white dark:bg-black min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-4xl font-extrabold text-brand-black dark:text-white mb-6 tracking-tight">Forex</h1>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e8e8e8] dark:border-white/10">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search articles, pairs…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#f7f7f7] dark:bg-zinc-900 border border-[#e0e0e0] dark:border-white/10 rounded-lg text-[#111] dark:text-white placeholder:text-[#aaa] dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 transition-all"
            />
          </div>

          <span className="text-xs text-[#888] font-medium whitespace-nowrap hidden sm:block">
            {filtered.length} article{filtered.length !== 1 ? "s" : ""}
          </span>

          <div className="flex items-center bg-[#f7f7f7] dark:bg-zinc-900 border border-[#e0e0e0] dark:border-white/10 rounded-xl p-1 gap-1 shrink-0">
            <button
              onClick={() => setView("list")}
              title="List view"
              className={`p-2 rounded-lg transition-all ${
                view === "list"
                  ? "bg-brand-blue text-white shadow-sm"
                  : "text-[#888] hover:bg-[#e8e8e8]"
              }`}
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setView("grid")}
              title="Grid view"
              className={`p-2 rounded-lg transition-all ${
                view === "grid"
                  ? "bg-brand-blue text-white shadow-sm"
                  : "text-[#888] hover:bg-[#e8e8e8]"
              }`}
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <AlertCircle size={40} className="text-brand-red mb-3" />
            <p className="font-bold text-[#111] dark:text-white">No forex data available</p>
            <p className="text-sm text-[#888] dark:text-gray-500 mt-1">
              Please configure the MarketAux API key in Admin Dashboard → API Integration.
            </p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Newspaper size={40} className="text-[#ccc] mb-3" />
            <p className="font-bold text-[#111] dark:text-white">No articles found</p>
            <p className="text-sm text-[#888] dark:text-gray-500 mt-1">Try a different search term.</p>
          </div>
        ) : view === "list" ? (
          <div>
            {paginated.map(article => (
              <ArticleRow key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map(article => (
              <ArticleGridCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {articles.length > 0 && filtered.length > PAGE_SIZE && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#e8e8e8] dark:border-white/10">
            <p className="text-sm text-[#888] dark:text-gray-500">
              Showing{" "}
              <span className="font-bold text-[#111] dark:text-white">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}
              </span>{" "}
              of <span className="font-bold text-[#111] dark:text-white">{filtered.length}</span>
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => goTo(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg border border-[#e0e0e0] dark:border-white/10 hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm dark:bg-zinc-900"
              >
                ‹ Prev
              </button>

              {pageNums[0] > 1 && (
                <>
                  <button onClick={() => goTo(1)} className="w-9 h-9 rounded-lg border border-[#e0e0e0] text-sm font-bold hover:border-brand-blue hover:text-brand-blue transition-all">1</button>
                  {pageNums[0] > 2 && <span className="px-1 text-[#aaa]">…</span>}
                </>
              )}

              {pageNums.map(p => (
                <button
                  key={p}
                  onClick={() => goTo(p)}
                  className={`w-9 h-9 rounded-lg border text-sm font-bold transition-all ${
                    p === page
                      ? "bg-brand-blue border-brand-blue text-white"
                      : "border-[#e0e0e0] dark:border-white/10 hover:border-brand-blue hover:text-brand-blue dark:bg-zinc-900"
                  }`}
                >
                  {p}
                </button>
              ))}

              {pageNums[pageNums.length - 1] < totalPages && (
                <>
                  {pageNums[pageNums.length - 1] < totalPages - 1 && <span className="px-1 text-[#aaa]">…</span>}
                  <button onClick={() => goTo(totalPages)} className="w-9 h-9 rounded-lg border border-[#e0e0e0] text-sm font-bold hover:border-brand-blue hover:text-brand-blue transition-all">{totalPages}</button>
                </>
              )}

              <button
                onClick={() => goTo(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-[#e0e0e0] dark:border-white/10 hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm dark:bg-zinc-900"
              >
                Next ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
