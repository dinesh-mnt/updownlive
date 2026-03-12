"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Clock, ExternalLink, Share2, Copy,
  CheckCheck, Tag, BookOpen, ChevronRight, Calendar
} from "lucide-react";

export interface ArticleData {
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

interface ArticleDetailPageProps {
  /** e.g. "Forex", "Cryptocurrency", "Gold & Precious Metals" */
  sectionTitle: string;
  /** e.g. "/forex", "/crypto", "/gold" */
  backHref: string;
  /** Accent colour class e.g. "text-brand-blue" */
  accentColor?: string;
  /** sessionStorage key that holds the JSON-serialised article */
  storageKey: string;
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
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

/** Convert **bold** markdown to JSX */
function parseBody(body: string): React.ReactNode[] {
  return body.split("\n\n").filter(Boolean).map((para, idx) => {
    // Section heading: starts with **WORD:** or **Word:**
    const headingMatch = para.match(/^\*\*([^*]+)\*\*:([\s\S]*)/);
    if (headingMatch) {
      const heading = headingMatch[1];
      const rest = headingMatch[2].trim();
      return (
        <div key={idx} className="mb-6">
          <h3 className="text-lg font-extrabold text-brand-black mb-2 flex items-center gap-2">
            <span className="w-1 h-5 bg-brand-blue rounded-full inline-block shrink-0" />
            {heading}
          </h3>
          <p className="text-[16px] text-[#333] leading-[1.85]">{rest}</p>
        </div>
      );
    }

    // Normal paragraph with inline **bold**
    const parts = para.split("**").map((part, i) =>
      i % 2 === 1
        ? <strong key={i} className="font-bold text-brand-black">{part}</strong>
        : part
    );
    return (
      <p key={idx} className="text-[16px] text-[#333] leading-[1.85] mb-5">
        {parts}
      </p>
    );
  });
}

export default function ArticleDetailPage({
  sectionTitle,
  backHref,
  accentColor = "text-brand-blue",
  storageKey,
}: ArticleDetailPageProps) {
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [copied, setCopied] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        setArticle(JSON.parse(raw));
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    }
  }, [storageKey]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  // ── Loading skeleton
  if (!article && !notFound) {
    return (
      <div className="bg-white min-h-screen font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="h-4 w-24 bg-brand-light rounded animate-pulse mb-8" />
          <div className="h-8 w-3/4 bg-brand-light rounded-xl animate-pulse mb-4" />
          <div className="h-6 w-1/2 bg-brand-light rounded animate-pulse mb-8" />
          <div className="h-72 bg-brand-light rounded-2xl animate-pulse mb-8" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`h-4 bg-brand-light rounded animate-pulse ${i % 3 === 2 ? "w-3/5" : "w-full"}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Not found
  if (notFound || !article) {
    return (
      <div className="bg-white min-h-screen font-sans flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-20 h-20 rounded-2xl bg-brand-light border border-brand-border flex items-center justify-center mb-5">
          <BookOpen size={36} className="text-[#ccc]" />
        </div>
        <h1 className="text-2xl font-extrabold text-brand-black mb-2">Article not found</h1>
        <p className="text-[#888] text-sm mb-6 max-w-sm">
          The article you're looking for couldn't be loaded. Please go back and select an article.
        </p>
        <Link href={backHref}
          className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-red transition-colors">
          <ArrowLeft size={16} /> Back to {sectionTitle}
        </Link>
      </div>
    );
  }
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* ── Breadcrumb ── */}
      <div className="border-b border-brand-border bg-[#fafafa]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-xs text-[#888]">
          <Link href="/" className="hover:text-brand-blue transition-colors font-medium">Home</Link>
          <ChevronRight size={12} />
          <Link href={backHref} className="hover:text-brand-blue transition-colors font-medium">{sectionTitle}</Link>
          <ChevronRight size={12} />
          <span className="text-[#555] font-medium truncate max-w-[200px]">{article.title.slice(0, 40)}…</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Back button ── */}
        <Link href={backHref}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#555] hover:text-brand-blue transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to {sectionTitle}
        </Link>

        {/* ── Tags ── */}
        {article.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {article.tags.map(t => (
              <span key={t} className="inline-flex items-center gap-1 text-xs font-black text-brand-blue bg-brand-blue/8 border border-brand-blue/20 px-2.5 py-1 rounded-full">
                <Tag size={10} /> {t}
              </span>
            ))}
          </div>
        )}

        {/* ── Title ── */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black leading-[1.2] mb-4 tracking-tight">
          {article.title}
        </h1>

        {/* ── Subtitle ── */}
        <p className="text-lg text-[#555] leading-relaxed mb-6 font-medium">
          {article.subtitle}
        </p>
        {/* ── Meta row ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-6 border-b border-brand-border mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Author avatar */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-black text-brand-blue">
                  {article.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-brand-black leading-tight">{article.author}</p>
                <p className="text-xs text-[#888]">{article.source}</p>
              </div>
            </div>

            {/* Divider */}
            <span className="text-[#ddd] hidden sm:block">|</span>

            {/* Date */}
            <div className="flex items-center gap-1.5 text-sm text-[#888]">
              <Calendar size={14} />
              <span>{formatDate(article.publishedAt)}</span>
            </div>

            {/* Relative time */}
            <div className="flex items-center gap-1.5 text-sm text-[#aaa]">
              <Clock size={13} />
              <span>{timeAgo(article.publishedAt)}</span>
            </div>
          </div>

          {/* Share buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 text-xs font-bold text-[#555] bg-[#f7f7f7] border border-[#e0e0e0] hover:border-brand-blue hover:text-brand-blue px-3 py-2 rounded-xl transition-all"
            >
              {copied ? <><CheckCheck size={13} className="text-green-600"/><span className="text-green-600">Copied!</span></> : <><Copy size={13}/> Copy link</>}
            </button>
            {article.url && article.url !== "#" && (
              <a href={article.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-brand-blue hover:bg-brand-red px-3 py-2 rounded-xl transition-all">
                <ExternalLink size={13} /> Source
              </a>
            )}
          </div>
        </div>
        {/* ── Hero Image ── */}
        <div className="rounded-2xl overflow-hidden border border-brand-border mb-10 relative">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-[300px] sm:h-[400px] object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80";
            }}
          />
          {/* Image attribution overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/50 to-transparent px-4 py-3">
            <p className="text-xs text-white/70">{article.source} · {sectionTitle} Analysis</p>
          </div>
        </div>

        {/* ── Body ── */}
        <article className="prose-custom">
          {parseBody(article.body)}
        </article>

        {/* ── Divider ── */}
        <div className="border-t border-brand-border my-10" />

        {/* ── Footer CTA ── */}
        <div className="bg-brand-light border border-brand-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-extrabold text-brand-black text-lg mb-1">
              Want to read more {sectionTitle} analysis?
            </p>
            <p className="text-sm text-[#888]">
              Browse all articles, filter by topic, and switch between list and grid views.
            </p>
          </div>
          <Link href={backHref}
            className="shrink-0 inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-red transition-colors shadow-lg shadow-brand-blue/20 whitespace-nowrap">
            <ArrowLeft size={16} /> Back to {sectionTitle}
          </Link>
        </div>

      </div>
    </div>
  );
}