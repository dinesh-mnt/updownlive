"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
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
  body: string; // full content for the expanded section
  source: string;
  currencies: string[]; // e.g. ["USD", "JPY"]
}

// ───────────────────────── Fallback data ───────────────────────────────────
const FALLBACK: ForexArticle[] = [
  {
    id: "1",
    title: "The Japanese yen weakens further amid a lack of bullish drivers; USD/JPY eyes a breakout",
    subtitle: "The USDJPY pair is crawling back towards the \"intervention\" level as US dollar bids return. What's next?",
    author: "Giuseppe Dellamotta",
    publishedAt: new Date(Date.now() - 48 * 60000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&q=80",
    url: "#",
    source: "ForexLive",
    currencies: ["USD", "JPY"],
    body: `**USD:** The US dollar strengthened against the yen on Monday as traders positioned ahead of the key intervention level near 150.00. Market participants remain cautious, with BOJ officials refraining from jawboning despite the pair's recent surge.\n\n**JPY:** The Japanese yen continues to face headwinds from the divergence in monetary policy between the Bank of Japan and the Federal Reserve. While the BOJ maintains ultra-loose settings, the Fed keeps rates elevated, weighing on the yen.\n\nKey levels to watch: Resistance at 150.00 (intervention zone), Support at 148.50 and 147.20.`,
  },
  {
    id: "2",
    title: "Australian dollar rises to the best levels since 2023. Four reasons why it's climbing",
    subtitle: "Australian dollar is proving to be an all-weather winner",
    author: "Adam Button",
    publishedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&q=80",
    url: "#",
    source: "ForexLive",
    currencies: ["AUD", "USD"],
    body: `**AUD:** The Australian dollar has surged to multi-year highs, driven by a combination of strong commodity prices, improved risk sentiment, and better-than-expected economic data from China.\n\n**USD:** The greenback faces headwinds as market participants reprice the Federal Reserve's rate path lower, reducing the yield advantage that has supported the dollar for much of the past two years.\n\nThe AUD/USD pair has broken above 0.6800 for the first time since early 2023, with momentum indicators suggesting further upside potential.`,
  },
  {
    id: "3",
    title: "EUR/USD holds gains ahead of ECB meeting; euro bulls target 1.0900",
    subtitle: "The European Central Bank is expected to hold rates steady, but the tone of the statement will be key",
    author: "Francesco Pesole",
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300&q=80",
    url: "#",
    source: "ING",
    currencies: ["EUR", "USD"],
    body: `**EUR:** The euro is holding near session highs ahead of Thursday's ECB meeting. Markets are fully priced for a hold, but the accompanying statement and Lagarde's press conference could shift sentiment significantly.\n\n**USD:** Dollar weakness has been the dominant driver of EUR/USD gains this week, with US economic data coming in below consensus. The market is questioning whether the Fed can maintain its 'higher for longer' narrative.\n\nTechnical analysis: EUR/USD has reclaimed the 1.0850 level and eyes resistance at 1.0920. A break above would open the door to 1.1000.`,
  },
  {
    id: "4",
    title: "GBP/USD set for weekly gain as UK GDP beats estimates",
    subtitle: "The UK economy avoided a technical recession, providing fresh impetus for sterling bulls",
    author: "James Stanley",
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=80",
    url: "#",
    source: "DailyFX",
    currencies: ["GBP", "USD"],
    body: `**GBP:** Sterling surged after UK GDP data for Q4 showed a 0.1% expansion, defying expectations of a contraction. This removed one of the key bearish arguments for the pound and prompted a sharp short-covering rally.\n\n**USD:** The dollar slipped broadly as risk appetite improved, with stock markets rallying on the back of better global economic data. The DXY index fell to its lowest level in six weeks.\n\nGBP/USD has cleared the key 1.2700 level and traders are now eyeing the November highs near 1.2820.`,
  },
  {
    id: "5",
    title: "USD/CAD falls as oil prices surge; Canadian dollar outperforms G10 peers",
    subtitle: "Crude oil's rally past $85/barrel gives the loonie a significant tailwind",
    author: "Nick Cawley",
    publishedAt: new Date(Date.now() - 22 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&q=80",
    url: "#",
    source: "DailyFX",
    currencies: ["USD", "CAD"],
    body: `**CAD:** The Canadian dollar is the top performer in the G10 space today, boosted by a surge in crude oil prices. WTI crude crossed above $85/barrel as OPEC+ supply cuts continue to tighten global supply.\n\n**USD:** The greenback fell across the board as investors moved away from safe-haven assets amid improved risk sentiment. Upcoming US CPI data remains the key near-term risk for the dollar.\n\nUSD/CAD has broken below the 1.3550 support level and targets 1.3480 next, with further downside to 1.3400 if oil maintains its bid.`,
  },
  {
    id: "6",
    title: "Swiss franc strengthens as safe-haven demand returns amid Middle East tensions",
    subtitle: "CHF benefits from geopolitical risk-off flows; EUR/CHF tests key support",
    author: "Eren Sengezer",
    publishedAt: new Date(Date.now() - 30 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300&q=80",
    url: "#",
    source: "FXStreet",
    currencies: ["CHF", "EUR"],
    body: `**CHF:** The Swiss franc surged as investors sought safe-haven assets amid renewed tensions in the Middle East. The SNB has recently softened its rhetoric against CHF strength, allowing the currency to appreciate.\n\n**EUR:** The euro came under selling pressure as risk aversion dominated market sentiment. EUR/CHF has fallen to its lowest level in three months, approaching the critical 0.9300 support zone.\n\nThe SNB is unlikely to intervene at current levels, and with geopolitical risks remaining elevated, the franc could see further gains toward parity.`,
  },
  {
    id: "7",
    title: "NZD/USD bounces from support as RBNZ signals end to rate hike cycle",
    subtitle: "Reserve Bank of New Zealand hints at rate cuts later in 2024",
    author: "Charlotte Edwards",
    publishedAt: new Date(Date.now() - 40 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=80",
    url: "#",
    source: "Reuters",
    currencies: ["NZD", "USD"],
    body: `**NZD:** The New Zealand dollar recovered from earlier losses after the RBNZ's latest meeting minutes hinted that the rate hike cycle may be coming to an end. Markets now fully price a rate cut by Q3 2024.\n\n**USD:** Dollar mixed ahead of this week's FOMC minutes, with traders looking for clues on the timing of the first Fed rate cut. Current market pricing shows a 65% probability of a cut in June.\n\nNZD/USD bounced from the 0.5960 support zone and eyes resistance at 0.6050 in the near term.`,
  },
  {
    id: "8",
    title: "USD/MXN falls to historic lows as Banxico keeps rates steady",
    subtitle: "Mexican peso at strongest vs dollar in nearly three decades on carry trade appeal",
    author: "Pablo Piovano",
    publishedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300&q=80",
    url: "#",
    source: "FXStreet",
    currencies: ["USD", "MXN"],
    body: `**MXN:** The Mexican peso continues its extraordinary run, hitting levels not seen since 1993. The high benchmark rate of 11.00% makes MXN one of the most attractive carry trade currencies among emerging markets.\n\n**USD:** Broad dollar weakness combined with strong EM sentiment has pushed USD/MXN to multi-decade lows. Banxico's hawkish stance and Mexico's strong manufacturing sector (nearshoring boom) underpin the peso.\n\nUSD/MXN has broken below the critical 17.00 psychological level, with the next major support seen at 16.62.`,
  },
  {
    id: "9",
    title: "EUR/JPY surges past 163 as divergence trade continues to dominate",
    subtitle: "The gap between ECB and BOJ policy remains the key driver for the cross",
    author: "Mathias Gould",
    publishedAt: new Date(Date.now() - 55 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&q=80",
    url: "#",
    source: "Commerzbank",
    currencies: ["EUR", "JPY"],
    body: `**EUR:** The euro benefits from the ECB's commitment to keeping rates elevated for longer, with President Lagarde repeatedly pushing back against early rate cut expectations.\n\n**JPY:** The yen remains under pressure from the Bank of Japan's ultra-loose monetary stance. Despite rising inflation in Japan, the BOJ continues to lag other major central banks in policy normalization.\n\nEUR/JPY is testing the 163.00 resistance level, a break of which could accelerate the move toward the 2023 high at 164.30.`,
  },
  {
    id: "10",
    title: "GBP/JPY breaks to 19-year high amid persistent UK-Japan rate divergence",
    subtitle: "Sterling-yen cross targets 190 as momentum accelerates to the upside",
    author: "Richard Perry",
    publishedAt: new Date(Date.now() - 60 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=80",
    url: "#",
    source: "Hantec Markets",
    currencies: ["GBP", "JPY"],
    body: `**GBP:** The British pound surged to a 19-year high against the Japanese yen, driven by the Bank of England's hawkish stance and the UK's resilient economic performance relative to expectations.\n\n**JPY:** The yen bore the brunt of the risk-on move, with Japanese authorities showing little urgency to intervene despite the currency's persistent weakness. Verbal warnings have so far failed to materially impact the market.\n\nGBP/JPY is approaching the 190.00 psychological level, with momentum indicators at multi-decade highs suggesting the trend remains firmly bullish.`,
  },
  {
    id: "11",
    title: "DXY consolidates near 104 as markets await US jobs report",
    subtitle: "Non-Farm Payrolls this Friday will be pivotal for the dollar's direction in Q2",
    author: "Yohay Elam",
    publishedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300&q=80",
    url: "#",
    source: "FXStreet",
    currencies: ["USD"],
    body: `**USD:** The US Dollar Index (DXY) is consolidating near the 104.00 level as traders adopt a wait-and-see approach ahead of Friday's Non-Farm Payrolls report. Consensus estimate is 230K new jobs, with any significant deviation likely to cause sharp moves.\n\nA strong print above 250K would reinforce the Fed's 'higher for longer' narrative and could push DXY toward 105.00. Conversely, a miss below 180K would increase bets for an early rate cut and send the dollar lower.\n\nThe Fed's next meeting is in late March, and the NFP data will be crucial in shaping expectations for that decision.`,
  },
  {
    id: "12",
    title: "AUD/NZD at 5-month high as RBA-RBNZ divergence widens",
    subtitle: "Reserve Bank of Australia's hawkish hold contrasts with RBNZ's dovish pivot",
    author: "Fiona Cincotta",
    publishedAt: new Date(Date.now() - 80 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&q=80",
    url: "#",
    source: "City Index",
    currencies: ["AUD", "NZD"],
    body: `**AUD:** The Reserve Bank of Australia maintained its hawkish tone at its recent meeting, keeping the door open for further rate hikes. Governor Bullock emphasized the need for inflation to return to target before considering cuts.\n\n**NZD:** In contrast, the Reserve Bank of New Zealand signaled a more dovish outlook, with markets now pricing earlier rate cuts for New Zealand versus Australia, widening the policy divergence.\n\nAUD/NZD has broken above the 1.0850 resistance and targets the December 2023 high at 1.0960, with further potential toward 1.1050.`,
  },
];

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
  // Convert **text** to <strong>
  return text.split("**").map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-bold text-[#111111]">{part}</strong> : part
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
    <article className="border-b border-[#e8e8e8] last:border-0">
      {/* ── Collapsed view ── */}
      <div className="py-5 flex gap-5 items-start">
        {/* Text area */}
        <div className="flex-1 min-w-0">
          <h2
            className="text-xl md:text-2xl font-extrabold text-[#111111] leading-snug mb-2 cursor-pointer hover:text-brand-blue transition-colors"
            onClick={() => setExpanded(!expanded)}
          >
            {article.title}
          </h2>
          <p className="text-sm text-[#555] leading-relaxed mb-3 line-clamp-2">
            {article.subtitle}
          </p>

          {/* Meta row */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-brand-blue">
                {article.author}
              </span>
              <span className="text-[#ccc]">·</span>
              <span className="text-sm text-[#888] flex items-center gap-1">
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

            {/* Expand / Collapse button */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-sm font-bold text-[#333] hover:text-brand-blue transition-colors whitespace-nowrap select-none"
            >
              {expanded ? (
                <><span>Collapse</span> <ChevronUp size={16} /></>
              ) : (
                <><span>Expand</span> <ChevronDown size={16} /></>
              )}
            </button>
          </div>
        </div>

        {/* Thumbnail */}
        <a
          href={article.url}
          onClick={handleRoute}
          className="flex-shrink-0 w-[200px] md:w-[240px] hidden sm:block"
          tabIndex={-1}
        >
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-[130px] md:h-[145px] object-cover rounded-lg border border-[#eaeaea] hover:opacity-90 transition-opacity"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&q=80";
            }}
          />
        </a>
      </div>

      {/* ── Expanded view ── */}
      {expanded && (
        <div className="pb-6 pr-0 sm:pr-[256px] animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-xs font-black text-[#555] uppercase tracking-[0.15em] mb-4">
            Fundamental Overview
          </h3>
          <div className="space-y-4 text-[15px] text-[#333] leading-relaxed">
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
      className="group bg-white rounded-2xl border border-[#e8e8e8] overflow-hidden hover:shadow-xl hover:shadow-brand-blue/8 hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden h-44 bg-[#f5f5f5] flex-shrink-0">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80";
          }}
        />
        {/* Currency badges overlay */}
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

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-extrabold text-[#111111] text-sm leading-snug line-clamp-3 group-hover:text-brand-blue transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-[#777] leading-relaxed line-clamp-2 flex-1">
          {article.subtitle}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-[#f0f0f0] mt-1">
          <span className="text-xs font-semibold text-brand-blue truncate max-w-[55%]">
            {article.author}
          </span>
          <span className="text-xs text-[#aaa] flex items-center gap-1 flex-shrink-0">
            <Clock size={10} /> {timeAgo(article.publishedAt)}
          </span>
        </div>
      </div>
    </a>
  );
}

// ──────────────────────── Main Page ────────────────────────────────────────
const PAGE_SIZE = 10;

export default function Forex() {
  const [articles, setArticles] = useState<ForexArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"list" | "grid">("list");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const keyRes = await axios.get(`${apiUrl}/settings/news-api-key`, {
          timeout: 3000,
          validateStatus: s => s < 500,
        });
        const apiKey = keyRes.data?.apiKey;

        if (apiKey) {
          const res = await axios.get("https://eventregistry.org/api/v1/article/getArticles", {
            params: {
              action: "getArticles",
              keyword: "forex currency exchange",
              articlesPage: 1,
              articlesCount: 30,
              articlesSortBy: "date",
              articlesSortByAsc: false,
              dataType: "news",
              resultType: "articles",
              apiKey,
            },
            timeout: 8000,
            validateStatus: s => s < 500,
          });

          const raw = res.data?.articles?.results || [];
          if (raw.length > 0) {
            const mapped: ForexArticle[] = raw.map((a: any, i: number) => ({
              id: `api-${i}`,
              title: a.title || "",
              subtitle: a.body?.slice(0, 150) || "",
              author: a.authors?.[0]?.name || a.source?.title || "Staff Writer",
              publishedAt: a.dateTimePub || a.date || new Date().toISOString(),
              imageUrl: a.image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&q=80",
              url: a.url || "#",
              source: a.source?.title || "UpDownLive",
              currencies: [],
              body: a.body?.slice(0, 800) || a.title,
            }));
            setArticles(mapped);
            return;
          }
        }
        setArticles(FALLBACK);
      } catch {
        setArticles(FALLBACK);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter
  const filtered = useMemo(() => {
    setPage(1);
    if (!query.trim()) return articles;
    const q = query.toLowerCase();
    return articles.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.currencies.some(c => c.toLowerCase().includes(q))
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, articles]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goTo = (p: number) => {
    setPage(Math.min(Math.max(1, p), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // page number range
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
    <div className="bg-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Page Title */}
        <h1 className="text-4xl font-extrabold text-[#111111] mb-6 tracking-tight">Forex</h1>

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e8e8e8]">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search articles, pairs…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#f7f7f7] border border-[#e0e0e0] rounded-lg text-[#111] placeholder:text-[#aaa] focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 transition-all"
            />
          </div>

          {/* Article count */}
          {!loading && (
            <span className="text-xs text-[#888] font-medium whitespace-nowrap hidden sm:block">
              {filtered.length} article{filtered.length !== 1 ? "s" : ""}
            </span>
          )}

          {/* Grid / List Toggle */}
          <div className="flex items-center bg-[#f7f7f7] border border-[#e0e0e0] rounded-xl p-1 gap-1 flex-shrink-0">
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

        {/* ── Content ── */}
        {loading ? (
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="py-5 border-b border-[#e8e8e8] flex gap-5">
                <div className="flex-1 space-y-3">
                  <div className="h-7 bg-[#f0f0f0] rounded-lg animate-pulse w-4/5" />
                  <div className="h-4 bg-[#f5f5f5] rounded animate-pulse w-3/5" />
                  <div className="h-3 bg-[#f5f5f5] rounded animate-pulse w-2/5" />
                </div>
                <div className="w-[200px] h-[130px] bg-[#f0f0f0] rounded-lg animate-pulse flex-shrink-0 hidden sm:block" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-20 text-center">
            <AlertCircle size={40} className="text-brand-red mb-3" />
            <p className="font-bold text-[#111]">Failed to load articles</p>
            <p className="text-sm text-[#888] mt-1">{error}</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Newspaper size={40} className="text-[#ccc] mb-3" />
            <p className="font-bold text-[#111]">No articles found</p>
            <p className="text-sm text-[#888] mt-1">Try a different search term.</p>
          </div>
        ) : view === "list" ? (
          /* ── List (accordion) view ── */
          <div>
            {paginated.map(article => (
              <ArticleRow key={article.id} article={article} />
            ))}
          </div>
        ) : (
          /* ── Grid view ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map(article => (
              <ArticleGridCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && !error && filtered.length > PAGE_SIZE && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#e8e8e8]">
            <p className="text-sm text-[#888]">
              Showing{" "}
              <span className="font-bold text-[#111]">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}
              </span>{" "}
              of <span className="font-bold text-[#111]">{filtered.length}</span>
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => goTo(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg border border-[#e0e0e0] hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
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
                      : "border-[#e0e0e0] hover:border-brand-blue hover:text-brand-blue"
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
                className="p-2 rounded-lg border border-[#e0e0e0] hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
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
