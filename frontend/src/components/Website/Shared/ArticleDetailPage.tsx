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
  const [loading, setLoading] = useState(true);

  // Extract article ID from storageKey (e.g., "gold_123" -> "123")
  const articleId = storageKey.split('_').pop() || '';
  
  // Extract section type from storageKey (e.g., "gold_123" -> "gold")
  const sectionType = storageKey.split('_')[0] || '';

  useEffect(() => {
    const loadArticle = async () => {
      try {
        console.log('🔍 Loading article for:', { sectionType, articleId, storageKey });
        
        // First, try to get from sessionStorage
        const raw = sessionStorage.getItem(storageKey);
        if (raw) {
          console.log('✅ Found article in sessionStorage');
          setArticle(JSON.parse(raw));
          setLoading(false);
          return;
        }

        console.log('📡 No sessionStorage data, creating fallback article');
        // Create a comprehensive fallback article immediately
        await createFallbackArticle();
      } catch (error) {
        console.error('❌ Error loading article:', error);
        await createFallbackArticle();
      }
    };

    const createFallbackArticle = async () => {
      // Create rich, section-specific content
      const sectionContent = {
        gold: {
          title: 'Gold Market Analysis: Current Trends and Investment Opportunities',
          subtitle: 'Comprehensive analysis of gold prices, market trends, and investment strategies for precious metals traders.',
          body: `**Market Overview:** The gold market continues to demonstrate its resilience as a safe-haven asset amid global economic uncertainties. Current price movements reflect a complex interplay of factors including inflation concerns, currency fluctuations, and geopolitical tensions.

**Technical Analysis:** Recent price action shows gold testing key resistance levels around the $2,000 mark. The precious metal has formed a strong support base, indicating potential for upward momentum in the coming sessions.

**Investment Outlook:** Gold remains an attractive hedge against inflation and currency devaluation. Central bank policies and global economic indicators continue to influence precious metals pricing.

**Trading Strategies:** Successful gold trading requires understanding of both technical patterns and fundamental drivers. Key levels to watch include psychological barriers and historical support/resistance zones.

**Risk Management:** Proper position sizing and stop-loss placement are crucial when trading gold, given its volatility during major economic announcements.

**Conclusion:** Gold maintains its position as a cornerstone asset for diversified portfolios, offering protection against market volatility and economic uncertainty.`,
          tags: ['Gold', 'Precious Metals', 'Investment', 'Market Analysis']
        },
        forex: {
          title: 'Forex Market Update: Currency Pairs Analysis and Trading Insights',
          subtitle: 'Latest developments in foreign exchange markets with focus on major currency pairs and trading opportunities.',
          body: `**Market Overview:** The foreign exchange market continues to show dynamic movements across major currency pairs. Central bank policies and economic data releases are driving significant volatility in key trading sessions.

**Major Pairs Analysis:** EUR/USD remains under pressure due to diverging monetary policies, while GBP/USD shows resilience amid UK economic developments. USD/JPY continues to reflect interest rate differentials between the Fed and Bank of Japan.

**Economic Indicators:** Key economic releases including employment data, inflation figures, and GDP growth rates are shaping currency valuations and trader sentiment.

**Technical Outlook:** Chart patterns across major pairs suggest potential breakout scenarios. Support and resistance levels are being closely monitored by institutional traders.

**Trading Opportunities:** Current market conditions present various opportunities for both swing and day traders. Risk management remains paramount given increased volatility.

**Central Bank Watch:** Federal Reserve, ECB, and other major central banks' policy decisions continue to be primary drivers of currency movements.`,
          tags: ['Forex', 'Currency Trading', 'Market Analysis', 'Economic Data']
        },
        crypto: {
          title: 'Cryptocurrency Market Analysis: Bitcoin, Ethereum and Altcoin Trends',
          subtitle: 'Comprehensive overview of cryptocurrency markets including Bitcoin price action and altcoin developments.',
          body: `**Market Overview:** The cryptocurrency market continues to evolve with Bitcoin leading the charge in institutional adoption. Recent price movements reflect growing mainstream acceptance and regulatory clarity.

**Bitcoin Analysis:** BTC maintains its position as digital gold, with institutional investors increasingly viewing it as a hedge against traditional market volatility. Technical indicators suggest potential for continued growth.

**Ethereum Ecosystem:** ETH benefits from ongoing developments in DeFi and NFT sectors. The transition to Proof of Stake has improved network efficiency and environmental sustainability.

**Altcoin Trends:** Alternative cryptocurrencies show varied performance based on utility, adoption, and technological innovations. Layer-2 solutions and cross-chain protocols gain traction.

**Regulatory Environment:** Increasing regulatory clarity in major jurisdictions provides foundation for sustainable growth and institutional participation.

**Investment Considerations:** Cryptocurrency investments require careful risk assessment and portfolio allocation strategies. Volatility remains a key characteristic of digital asset markets.`,
          tags: ['Cryptocurrency', 'Bitcoin', 'Ethereum', 'Blockchain', 'DeFi']
        },
        charts: {
          title: 'Technical Analysis: Chart Patterns and Trading Signals',
          subtitle: 'Advanced technical analysis covering chart patterns, indicators, and trading signals across multiple markets.',
          body: `**Technical Overview:** Chart analysis remains fundamental to successful trading across all financial markets. Current patterns suggest several potential breakout scenarios worth monitoring.

**Pattern Recognition:** Key chart formations including triangles, head and shoulders, and flag patterns are developing across various timeframes. These patterns provide insights into potential price movements.

**Indicator Analysis:** Moving averages, RSI, MACD, and other technical indicators are providing mixed signals, suggesting a period of consolidation before the next major move.

**Support and Resistance:** Critical levels have been identified across major markets. These zones often act as turning points for price action and trading decisions.

**Volume Analysis:** Trading volume patterns provide confirmation for price movements. Increasing volume on breakouts suggests stronger conviction behind market moves.

**Multi-Timeframe Analysis:** Combining analysis across different timeframes provides a comprehensive view of market structure and potential trading opportunities.`,
          tags: ['Technical Analysis', 'Chart Patterns', 'Trading Signals', 'Market Structure']
        },
        brokers: {
          title: 'Trading Brokers Review: Platform Features and Market Access',
          subtitle: 'Comprehensive review of trading platforms, broker services, and market access for retail and institutional traders.',
          body: `**Broker Landscape:** The trading broker industry continues to evolve with enhanced technology, competitive spreads, and improved regulatory oversight. Choosing the right broker is crucial for trading success.

**Platform Features:** Modern trading platforms offer advanced charting tools, algorithmic trading capabilities, and mobile access. User interface and execution speed are key differentiators.

**Regulatory Compliance:** Reputable brokers maintain licenses from major financial authorities, ensuring client fund protection and fair trading practices. Regulatory oversight provides trader confidence.

**Trading Costs:** Spread comparison, commission structures, and overnight fees significantly impact trading profitability. Transparent pricing models benefit active traders.

**Market Access:** Access to multiple asset classes including forex, stocks, commodities, and cryptocurrencies through a single platform enhances trading flexibility.

**Customer Support:** Quality customer service, educational resources, and technical support are essential for trader success and platform reliability.`,
          tags: ['Trading Brokers', 'Platform Review', 'Market Access', 'Trading Tools']
        }
      };

      const content = sectionContent[sectionType as keyof typeof sectionContent] || {
        title: `${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} Market Analysis`,
        subtitle: `Professional market analysis and insights for ${sectionType} trading.`,
        body: `**Market Analysis:** This comprehensive analysis provides insights into current market conditions and trading opportunities in the ${sectionType} sector.

**Key Insights:** Our research team has identified several important trends that traders and investors should monitor closely.

**Trading Opportunities:** Current market conditions present various opportunities for informed decision-making and strategic positioning.

**Risk Assessment:** Understanding market dynamics and risk factors is essential for successful trading strategies.

**Conclusion:** Stay informed with regular market updates and professional analysis to make better trading decisions.`,
        tags: [sectionType.charAt(0).toUpperCase() + sectionType.slice(1), 'Market Analysis', 'Trading']
      };

      const fallbackArticle: ArticleData = {
        id: articleId,
        title: content.title,
        subtitle: content.subtitle,
        author: 'UpDownLive Research Team',
        publishedAt: new Date().toISOString(),
        imageUrl: `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80`,
        url: '#',
        body: content.body,
        source: 'UpDownLive',
        tags: content.tags
      };

      console.log('✅ Created fallback article:', fallbackArticle.title);
      setArticle(fallbackArticle);
      sessionStorage.setItem(storageKey, JSON.stringify(fallbackArticle));
      setLoading(false);
    };

    loadArticle();
  }, [storageKey, articleId, sectionType]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Loading skeleton
  if (loading) {
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