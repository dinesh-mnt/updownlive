"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, ChevronUp, Clock, ExternalLink, Newspaper, AlertCircle, LayoutGrid, List } from "lucide-react";

interface Article {
  id: string; title: string; subtitle: string; author: string;
  publishedAt: string; imageUrl: string; url: string; body: string;
  source: string; tags: string[];
}

const FALLBACK: Article[] = [
  { id:"1", title:"S&P 500 breaks 5,300 resistance — technical outlook for Q2 2024", subtitle:"The index records six consecutive weeks of gains as bullish momentum remains intact.", author:"Tom Bradley", publishedAt: new Date(Date.now()-25*60000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80", url:"#", source:"TradingView", tags:["SPX","Technical"], body:`**SPX:** The S&P 500 has broken above the critical 5,300 resistance level, marking its sixth consecutive week of gains. The weekly RSI is running at 68 — elevated but not yet in extreme overbought territory.\n\n**Technical Setup:** The index has formed a clean bullish channel since the October 2023 lows. The channel support at 5,150 and the 50-day moving average at 5,050 provide multiple layers of support on any pullback.\n\nAnalysts target 5,500 as the next resistance zone, with the 161.8% Fibonacci extension from the 2022 bear market at 5,680. A weekly close below 5,000 would invalidate the immediate bullish thesis.` },
  { id:"2", title:"Gold forms rounding bottom pattern — breakout targets $2,500/oz", subtitle:"Technical analysts highlight the 3-year cup-and-handle formation completing on weekly charts.", author:"Sarah Chen", publishedAt: new Date(Date.now()-2*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=400&q=80", url:"#", source:"Kitco Charts", tags:["XAU","Cup&Handle"], body:`**XAU/USD:** Gold's 3-year cup-and-handle pattern has broken out on the weekly chart, triggering measured move targets of $2,500/oz. The handle formation tested the $1,980 support zone three times before the decisive breakout above $2,075.\n\n**Pattern Analysis:** The cup spans approximately 36 months from the August 2020 peak to the late 2023 breakout. The handle's depth is roughly 13%, within the typical 10-15% range for valid cup-and-handle formations.\n\nVolume confirmed the breakout, with above-average participation signaling institutional conviction behind the move. The next major resistance zone is at $2,400, followed by the $2,500 target.` },
  { id:"3", title:"EUR/USD daily chart shows bearish divergence — correction to 1.0650 possible", subtitle:"RSI fails to confirm new highs as price retests resistance at 1.0900.", author:"Milan Cutkovic", publishedAt: new Date(Date.now()-4*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80", url:"#", source:"FXStreet Charts", tags:["EUR","USD","RSI"], body:`**EUR/USD:** The daily chart shows a clear bearish divergence pattern — price printed a higher high versus the January peak, but the RSI formed a lower high at 62, diverging from price. This is a classic warning sign of momentum exhaustion.\n\n**Key Levels:** Immediate resistance at 1.0895 (double-top neckline). A failure to break and hold above increases the probability of a pullback to the 1.0720 support zone, then 1.0650 (200-day MA).\n\nThe 4-hour chart shows a potential head-and-shoulders top formation being built. A break below the neckline at 1.0780 would confirm the pattern with a measured move target of 1.0590.` },
  { id:"4", title:"Bitcoin weekly close above $65,000 confirms bull market structure", subtitle:"BTC's higher-high, higher-low pattern on weekly chart signals sustained uptrend.", author:"Willy Woo", publishedAt: new Date(Date.now()-8*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=400&q=80", url:"#", source:"Bitcoin Charts", tags:["BTC","Weekly"], body:`**BTC/USD:** Bitcoin's weekly chart has confirmed a higher-high, higher-low bull market structure with a close above $65,000. This level was the 2021 all-time high breakout zone and is now acting as support after years as resistance — a classic polarity flip.\n\n**On-Chain Confirmation:** The NVT Signal (Network Value to Transactions) is trending upward, indicating the network is being used increasingly for value transfer relative to price — historically a bullish leading indicator.\n\nWave analysis suggests Bitcoin is in Wave 3 of a 5-wave impulse structure from the 2022 lows. If the structure is valid, Wave 3 targets are in the $85,000-$110,000 range.` },
  { id:"5", title:"USDJPY weekly chart: Parabolic advance risks intervention at 152-155 zone", subtitle:"Japan's intervention history and technical exhaustion signals suggest short-term top forming.", author:"Shusuke Yamada", publishedAt: new Date(Date.now()-12*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80", url:"#", source:"BoA Charts", tags:["USD","JPY"], body:`**USD/JPY:** The weekly chart shows a near-vertical advance from 130 to 152, with momentum indicators in extreme overbought territory (weekly RSI at 78). Historically, such readings have preceded sharp reversals in this pair.\n\n**Intervention Risk:** Japan's Ministry of Finance intervened at 145.90 in September 2022 and at 151.95 in October 2022. With price approaching these levels again, intervention risk is extremely elevated.\n\nA bearish engulfing candle on the weekly chart would be a strong reversal signal. Downside targets on an intervention-driven move are 147.50, 145.00, and potentially 141.00.` },
  { id:"6", title:"Crude oil breakout from 4-month range targets $95/barrel", subtitle:"WTI crude breaks above $83 resistance on strong OPEC+ supply cut compliance.", author:"Ellen Wald", publishedAt: new Date(Date.now()-18*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=400&q=80", url:"#", source:"OilPrice Charts", tags:["WTI","Crude"], body:`**WTI Crude:** Crude oil has broken above the $83/barrel resistance level that had capped rallies for four months, triggering a measured move target of $95. The breakout was accompanied by above-average volume and a bullish MACD crossover on the daily chart.\n\n**Fundamentals:** OPEC+ supply cut compliance improved to 96% in March, tightening the physical market. Geopolitical tensions in the Middle East are adding a risk premium, while improving global demand growth forecasts from the IEA support the bullish case.\n\nKey support levels to watch on any pullback: $83.50 (breakout retest), $80.00 (pivotal round number), and $77.50 (200-day MA).` },
  { id:"7", title:"Tesla stock at critical support — make or break moment for the bulls", subtitle:"TSLA finds standing at $175 as institutional accumulation patterns emerge on daily chart.", author:"Ross Gerber", publishedAt: new Date(Date.now()-24*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80", url:"#", source:"StockCharts", tags:["TSLA","Stock"], body:`**TSLA:** Tesla shares have found support at the $175 level after a sharp 35% decline from the January highs. Daily chart analysis reveals a potential inverse head-and-shoulders pattern forming, with the neckline at $205.\n\n**Accumulation Signals:** The On-Balance Volume (OBV) indicator has been trending upward even as price declined — a positive divergence suggesting institutional accumulation during the retail selling phase.\n\nA break above $205 would confirm the pattern with a measured move target of $235. The 200-day moving average at $212 will serve as a key test of the recovery's sustainability.` },
  { id:"8", title:"Fibonacci retracements: How to identify ideal entry zones in trending markets", subtitle:"A practical guide to using Fibonacci levels for precision entry and exit timing.", author:"Rayner Teo", publishedAt: new Date(Date.now()-30*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=400&q=80", url:"#", source:"TradingwithRayner", tags:["Education","Fibonacci"], body:`**Fibonacci Basics:** The Fibonacci retracement tool connects the swing high and swing low of a price move, plotting horizontal levels at 23.6%, 38.2%, 50%, 61.8%, and 78.6%. These levels often act as support or resistance in trending markets.\n\n**Entry Strategy:** In strong uptrends, the 38.2% and 50% retracement levels offer the highest probability entry zones for continuation trades with favorable risk/reward ratios. The 61.8% level ("the golden ratio") is the deepest retracement that remains consistent with an intact uptrend.\n\n**Confirmation:** Never trade Fibonacci levels in isolation. Look for confluence with support/resistance zones, trendlines, moving averages, or candlestick reversal patterns (hammer, engulfing, doji) at Fibonacci levels before entering.` },
  { id:"9", title:"Nasdaq 100 forms classic 'three pushes to a high' reversal pattern", subtitle:"The distribution pattern near 18,500 suggests institutional selling may be accelerating.", author:"Peter Brandt", publishedAt: new Date(Date.now()-38*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80", url:"#", source:"PeterBrandt.com", tags:["NDX","Distribution"], body:`**NDX:** The Nasdaq 100 has printed three successive pushes to new highs with decreasing momentum — a classic "three pushes to a high" or "wedge" exhaustion pattern. Each push was accompanied by declining volume and weakening RSI.\n\n**Distribution:** Smart money distribution patterns are visible in the tick-by-tick data, with large sellers emerging at each new high while retail buyers chase momentum. This is consistent with a market top building process.\n\nA break below 17,800 would confirm the pattern, targeting 16,500 (the prior breakout level) initially, then 15,800 (the 200-day MA) on continuation. Stop-losses for counter-trend positions should be placed above 18,700.` },
  { id:"10", title:"Moving average crossovers: The most reliable trend-following signals explained", subtitle:"A deep dive into EMA crossovers, their settings, and best market conditions for application.", author:"Adam Grimes", publishedAt: new Date(Date.now()-46*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=400&q=80", url:"#", source:"MarketLife", tags:["Education","EMA"], body:`**EMA Crossovers:** The 20/50 EMA crossover (golden/death cross) is one of the most widely followed trend signals. When the 20-period EMA crosses above the 50-period EMA, it signals emerging bullish momentum; below signals bearish momentum.\n\n**Optimization:** The 9/21 EMA is better for swing trading (2-10 day holds) while the 50/200 MA is suited for position trading. No single setting works best across all markets and timeframes — always backtest on the specific instrument you're trading.\n\n**Limitations:** Moving average crossovers are lagging indicators — they confirm the trend after it's established, not before. In choppy, ranging markets, they generate frequent false signals (whipsaws). Use ADX > 25 to filter for trending conditions before applying crossover strategies.` },
  { id:"11", title:"VIX spikes to 20 — what the 'fear index' is telling us about market direction", subtitle:"Options market pricing suggests institutional hedging activity is increasing ahead of key macro events.", author:"Cboe Analytics", publishedAt: new Date(Date.now()-54*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80", url:"#", source:"Cboe", tags:["VIX","Options"], body:`**VIX:** The Cboe Volatility Index has spiked to 20, crossing from "complacent" territory (below 15) to "concerned" levels. Historically, VIX spikes above 20 have coincided with S&P 500 drawdowns of 5-15%.\n\n**Options Market:** The put/call ratio has moved to 0.90 from 0.65, indicating increased demand for downside protection. The skew (difference between implied volatility of OTM puts vs calls) has also widened — a sign of institutional hedging.\n\n**Contrarian Signal:** From a contrarian perspective, VIX spikes often mark short-term lows rather than the beginning of sustained bear markets. VIX above 30 has historically offered excellent buying opportunities for long-term investors, though the path to those levels can involve significant short-term pain.` },
  { id:"12", title:"Dollar Index completing 5-month head and shoulders pattern — breakdown imminent?", subtitle:"DXY neckline at 102.50 is the key level — a break confirms a measured move to 98.", author:"Karen Ward", publishedAt: new Date(Date.now()-62*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=400&q=80", url:"#", source:"JPMorgan Strategy", tags:["DXY","HnS"], body:`**DXY:** The US Dollar Index has formed a textbook 5-month head-and-shoulders (H&S) top pattern on the daily chart. The left shoulder printed in November, the head in January, and the right shoulder has been forming through March.\n\n**Key Level:** The neckline of the pattern runs at approximately 102.50. A daily close below this level would confirm the reversal pattern, with a measured move target of 98.00 (neckline width subtracted from the neckline).\n\n**Macro Implications:** A weaker dollar would be broadly bullish for commodities (gold, oil, metals), emerging market assets, and non-USD currencies. The EUR, GBP, AUD, and commodity currencies (CAD, AUD) would be primary beneficiaries.` },
];

function timeAgo(d: string): string {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
}
function parseBold(t: string) {
  return t.split("**").map((p, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-[#111]">{p}</strong> : p);
}

function ArticleRow({ a }: { a: Article }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleRoute = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem(`charts_${a.id}`, JSON.stringify(a));
    router.push(`/charts/${a.id}`);
  };

  return (
    <article className="border-b border-[#e8e8e8] last:border-0">
      <div className="py-5 flex gap-5 items-start">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#111] leading-snug mb-2 cursor-pointer hover:text-brand-blue transition-colors" onClick={()=>setOpen(!open)}>{a.title}</h2>
          <p className="text-sm text-[#555] leading-relaxed mb-3 line-clamp-2">{a.subtitle}</p>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-brand-blue">{a.author}</span>
              <span className="text-[#ccc]">·</span>
              <span className="text-sm text-[#888] flex items-center gap-1"><Clock size={12}/>{timeAgo(a.publishedAt)}</span>
              {a.tags.length>0&&<>{<span className="text-[#ccc]">·</span>}<div className="flex gap-1">{a.tags.map(t=><span key={t} className="text-xs font-black text-brand-blue bg-brand-blue/8 border border-brand-blue/15 px-1.5 py-0.5 rounded-md">{t}</span>)}</div></>}
            </div>
            <button onClick={()=>setOpen(!open)} className="flex items-center gap-1.5 text-sm font-bold text-[#333] hover:text-brand-blue transition-colors whitespace-nowrap">
              {open?<><span>Collapse</span><ChevronUp size={16}/></>:<><span>Expand</span><ChevronDown size={16}/></>}
            </button>
          </div>
        </div>
        <a href={a.url} onClick={handleRoute} className="flex-shrink-0 w-[200px] md:w-[240px] hidden sm:block" tabIndex={-1}>
          <img src={a.imageUrl} alt={a.title} className="w-full h-[130px] md:h-[145px] object-cover rounded-lg border border-[#eaeaea] hover:opacity-90 transition-opacity"
            onError={e=>{(e.target as HTMLImageElement).src="https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=300&q=80"}}/>
        </a>
      </div>
      {open && (
        <div className="pb-6 pr-0 sm:pr-[256px] animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-xs font-black text-[#555] uppercase tracking-[0.15em] mb-4">Technical Analysis</h3>
          <div className="space-y-4 text-[15px] text-[#333] leading-relaxed">{a.body.split("\n\n").filter(Boolean).map((p,i)=><p key={i}>{parseBold(p)}</p>)}</div>
          <a href={a.url} onClick={handleRoute} className="inline-flex items-center gap-1.5 mt-5 text-sm font-bold text-brand-blue hover:text-brand-red transition-colors">Read full article <ExternalLink size={13}/></a>
        </div>
      )}
    </article>
  );
}

function ArticleCard({ a }: { a: Article }) {
  const router = useRouter();

  const handleRoute = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem(`charts_${a.id}`, JSON.stringify(a));
    router.push(`/charts/${a.id}`);
  };

  return (
    <a href={a.url} onClick={handleRoute} className="group bg-white rounded-2xl border border-[#e8e8e8] overflow-hidden hover:shadow-xl hover:shadow-brand-blue/8 hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className="relative overflow-hidden h-44 bg-[#f5f5f5]">
        <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e=>{(e.target as HTMLImageElement).src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80"}}/>
        {a.tags.length>0&&<div className="absolute top-2.5 left-2.5 flex gap-1">{a.tags.map(t=><span key={t} className="text-xs font-black text-white bg-brand-blue/90 backdrop-blur px-2 py-0.5 rounded-md">{t}</span>)}</div>}
      </div>
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-extrabold text-[#111] text-sm leading-snug line-clamp-3 group-hover:text-brand-blue transition-colors">{a.title}</h3>
        <p className="text-xs text-[#777] leading-relaxed line-clamp-2 flex-1">{a.subtitle}</p>
        <div className="flex items-center justify-between pt-2 border-t border-[#f0f0f0] mt-1">
          <span className="text-xs font-semibold text-brand-blue truncate max-w-[55%]">{a.author}</span>
          <span className="text-xs text-[#aaa] flex items-center gap-1"><Clock size={10}/>{timeAgo(a.publishedAt)}</span>
        </div>
      </div>
    </a>
  );
}

const PAGE_SIZE = 10;

export default function Charts() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"list"|"grid">("list");

  useEffect(() => {
    const load = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const kr = await axios.get(`${apiUrl}/settings/news-api-key`, { timeout: 3000, validateStatus: s => s < 500 });
        const key = kr.data?.apiKey;
        if (key) {
          const res = await axios.get("https://eventregistry.org/api/v1/article/getArticles", {
            params: { action:"getArticles", keyword:"stock market technical analysis chart trading patterns candlestick", articlesPage:1, articlesCount:30, articlesSortBy:"date", articlesSortByAsc:false, dataType:"news", resultType:"articles", apiKey: key },
            timeout: 8000, validateStatus: s => s < 500,
          });
          const raw = res.data?.articles?.results || [];
          if (raw.length > 0) {
            setArticles(raw.map((a: any, i: number) => ({ id:`api-${i}`, title: a.title||"", subtitle: a.body?.slice(0,150)||"", author: a.authors?.[0]?.name||a.source?.title||"Staff Writer", publishedAt: a.dateTimePub||a.date||new Date().toISOString(), imageUrl: a.image||"https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=300&q=80", url: a.url||"#", source: a.source?.title||"UpDownLive", tags: [], body: a.body?.slice(0,800)||a.title })));
            return;
          }
        }
      } catch {}
      setArticles(FALLBACK);
      setLoading(false);
    };
    load().finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => { setPage(1); if(!query.trim()) return articles; const q=query.toLowerCase(); return articles.filter(a=>a.title.toLowerCase().includes(q)||a.author.toLowerCase().includes(q)||a.tags.some(t=>t.toLowerCase().includes(q))); }, [query, articles]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const goTo = (p: number) => { setPage(Math.min(Math.max(1,p),totalPages)); window.scrollTo({top:0,behavior:"smooth"}); };
  const pageNums = useMemo(() => { let s=Math.max(1,page-2),e=Math.min(totalPages,s+4); s=Math.max(1,e-4); const n: number[]=[]; for(let i=s;i<=e;i++) n.push(i); return n; }, [page, totalPages]);

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-4xl font-extrabold text-[#111] mb-6 tracking-tight">Charts & Technical Analysis</h1>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e8e8e8]">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]"/>
            <input type="text" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search chart analysis…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#f7f7f7] border border-[#e0e0e0] rounded-lg text-[#111] placeholder:text-[#aaa] focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 transition-all"/>
          </div>
          {!loading && <span className="text-xs text-[#888] font-medium whitespace-nowrap hidden sm:block">{filtered.length} article{filtered.length!==1?"s":""}</span>}
          <div className="flex items-center bg-[#f7f7f7] border border-[#e0e0e0] rounded-xl p-1 gap-1 flex-shrink-0">
            <button onClick={()=>setView("list")} title="List view" className={`p-2 rounded-lg transition-all ${view==="list"?"bg-brand-blue text-white shadow-sm":"text-[#888] hover:bg-[#e8e8e8]"}`}><List size={15}/></button>
            <button onClick={()=>setView("grid")} title="Grid view" className={`p-2 rounded-lg transition-all ${view==="grid"?"bg-brand-blue text-white shadow-sm":"text-[#888] hover:bg-[#e8e8e8]"}`}><LayoutGrid size={15}/></button>
          </div>
        </div>
        {loading ? (
          <div className="space-y-1">{Array.from({length:5}).map((_,i)=>(
            <div key={i} className="py-5 border-b border-[#e8e8e8] flex gap-5">
              <div className="flex-1 space-y-3"><div className="h-7 bg-[#f0f0f0] rounded-lg animate-pulse w-4/5"/><div className="h-4 bg-[#f5f5f5] rounded animate-pulse w-3/5"/><div className="h-3 bg-[#f5f5f5] rounded animate-pulse w-2/5"/></div>
              <div className="w-[200px] h-[130px] bg-[#f0f0f0] rounded-lg animate-pulse hidden sm:block"/>
            </div>))}</div>
        ) : paginated.length===0 ? (
          <div className="flex flex-col items-center py-20 text-center"><Newspaper size={40} className="text-[#ccc] mb-3"/><p className="font-bold text-[#111]">No articles found</p></div>
        ) : view==="list" ? (
          <div>{paginated.map(a=><ArticleRow key={a.id} a={a}/>)}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{paginated.map(a=><ArticleCard key={a.id} a={a}/>)}</div>
        )}
        {!loading && filtered.length > PAGE_SIZE && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#e8e8e8]">
            <p className="text-sm text-[#888]">Showing <span className="font-bold text-[#111]">{(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE,filtered.length)}</span> of <span className="font-bold text-[#111]">{filtered.length}</span></p>
            <div className="flex items-center gap-1.5">
              <button onClick={()=>goTo(page-1)} disabled={page===1} className="p-2 rounded-lg border border-[#e0e0e0] hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm">‹ Prev</button>
              {pageNums[0]>1&&<><button onClick={()=>goTo(1)} className="w-9 h-9 rounded-lg border border-[#e0e0e0] text-sm font-bold hover:border-brand-blue hover:text-brand-blue transition-all">1</button>{pageNums[0]>2&&<span className="px-1 text-[#aaa]">…</span>}</>}
              {pageNums.map(p=><button key={p} onClick={()=>goTo(p)} className={`w-9 h-9 rounded-lg border text-sm font-bold transition-all ${p===page?"bg-brand-blue border-brand-blue text-white":"border-[#e0e0e0] hover:border-brand-blue hover:text-brand-blue"}`}>{p}</button>)}
              {pageNums[pageNums.length-1]<totalPages&&<>{pageNums[pageNums.length-1]<totalPages-1&&<span className="px-1 text-[#aaa]">…</span>}<button onClick={()=>goTo(totalPages)} className="w-9 h-9 rounded-lg border border-[#e0e0e0] text-sm font-bold hover:border-brand-blue hover:text-brand-blue transition-all">{totalPages}</button></>}
              <button onClick={()=>goTo(page+1)} disabled={page===totalPages} className="p-2 rounded-lg border border-[#e0e0e0] hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm">Next ›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
