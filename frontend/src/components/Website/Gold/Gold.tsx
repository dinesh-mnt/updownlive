"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import axiosInstance from '@/lib/axios';
import { useRouter } from "next/navigation";
import { Search, ChevronDown, ChevronUp, Clock, ExternalLink, Newspaper, AlertCircle, LayoutGrid, List } from "lucide-react";

interface Article {
  id: string; title: string; subtitle: string; author: string;
  publishedAt: string; imageUrl: string; url: string; body: string;
  source: string; tags: string[];
}

const FALLBACK: Article[] = [
  { id:"1", title:"Gold records best monthly performance in a year as safe-haven demand surges", subtitle:"Precious metal climbs above $2,300/oz as geopolitical fears and Fed pivot bets fuel buying.", author:"Rhea Patel", publishedAt: new Date(Date.now()-20*60000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=80", url:"#", source:"Bloomberg", tags:["XAU","USD"], body:`**XAU/USD:** Gold broke above the psychologically significant $2,300/oz level for the first time, driven by a combination of safe-haven demand, central bank buying, and growing expectations of Federal Reserve rate cuts.\n\n**Central Bank Demand:** Central banks globally purchased over 1,000 tonnes of gold in 2023 — the second highest on record. China, India, Poland and Turkey are among the largest buyers, diversifying away from USD-denominated reserves.\n\nTechnically, gold has broken above a long-term resistance zone and analysts target $2,400 as the next key level. The 200-day moving average provides strong support at $2,050.` },
  { id:"2", title:"Silver lags gold but analysts see 30% upside as industrial demand accelerates", subtitle:"The gold-silver ratio at 90x signals historic opportunity for silver bulls.", author:"Tom Hartley", publishedAt: new Date(Date.now()-2*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=400&q=80", url:"#", source:"Kitco", tags:["XAG","USD"], body:`**XAG/USD:** Silver has underperformed gold considerably, with the gold-silver ratio elevated near 90:1 — historically elevated levels that have often preceded significant silver outperformance.\n\n**Industrial Demand:** Silver's industrial applications (solar panels, electronics, EVs) are growing rapidly. The global push for green energy is expected to absorb a significant portion of annual silver production, tightening physical supply.\n\nAnalysts at Goldman Sachs target $35/oz for silver within 12 months, citing the combination of investment demand catch-up and structural industrial demand growth.` },
  { id:"3", title:"Platinum deficit widens as South African mining output falls 8% year-on-year", subtitle:"Supply disruptions in the world's largest platinum producer threaten to push prices above $1,100/oz.", author:"Sarah Mbeki", publishedAt: new Date(Date.now()-5*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1637001882069-8f8e0ac04be4?w=400&q=80", url:"#", source:"Metals Focus", tags:["XPT","USD"], body:`**XPT/USD:** Platinum's supply deficit is widening as South African production — which accounts for 70% of global supply — fell 8% year-on-year due to power outages and operational challenges.\n\n**Hydrogen Economy:** Long-term demand fundamentals for platinum are brightening due to its critical role in hydrogen fuel cell catalysts. The global push for green hydrogen is expected to create significant incremental demand over the coming decade.\n\nPlatinum currently trades at a significant discount to gold (ratio of ~2.5x), compared to a historical average of 1.1x, suggesting substantial undervaluation from a historical perspective.` },
  { id:"4", title:"Gold ETF holdings stabilize after 10 consecutive months of outflows", subtitle:"Physical gold-backed ETFs see net inflows for the first time since Q1 2023.", author:"Marcus Chen", publishedAt: new Date(Date.now()-8*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=80", url:"#", source:"World Gold Council", tags:["XAU","ETF"], body:`**ETF Flows:** Gold ETFs globally recorded net inflows of 18 tonnes in March — the first positive month after 10 consecutive months of outflows. North American funds led the reversal, adding 12 tonnes.\n\n**Macro Backdrop:** The shift in ETF sentiment coincides with growing conviction that the Federal Reserve's rate hike cycle has ended. Lower interest rates reduce the opportunity cost of holding non-yielding gold, making it relatively more attractive.\n\nTotal gold ETF holdings stand at 3,100 tonnes globally. A return to the 2020 peak of 3,900 tonnes would represent meaningful additional demand of nearly 800 tonnes — equivalent to roughly 25% of annual mine supply.` },
  { id:"5", title:"China's central bank extends gold buying streak to 17 consecutive months", subtitle:"PBoC adds 12 tonnes in March, bringing total reserves to a record high of 2,262 tonnes.", author:"Wei Zhang", publishedAt: new Date(Date.now()-12*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=400&q=80", url:"#", source:"Reuters", tags:["XAU","CNY"], body:`**PBoC Buying:** The People's Bank of China has now purchased gold for 17 consecutive months, adding approximately 12 tonnes in March to bring total reserves to a record high. China's gold reserves now constitute about 4.6% of total foreign exchange reserves.\n\n**Dedollarization:** China's persistent gold accumulation is widely interpreted as part of a broader strategy to reduce dependency on US dollar-denominated assets. Russia, Turkey, Kazakhstan and other nations are pursuing similar strategies.\n\nCentral bank gold demand globally is expected to remain elevated in 2024, providing a structural demand floor for prices above $2,000/oz.` },
  { id:"6", title:"Palladium extends decline as EV adoption reduces autocatalyst demand", subtitle:"XPD falls to 5-year lows as internal combustion engine market share shrinks.", author:"Ivan Petrov", publishedAt: new Date(Date.now()-16*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1637001882069-8f8e0ac04be4?w=400&q=80", url:"#", source:"Johnson Matthey", tags:["XPD","USD"], body:`**XPD/USD:** Palladium has fallen to its lowest levels since 2018, driven by the structural shift away from gasoline-powered vehicles (which use palladium in catalytic converters) toward electric vehicles (which do not).\n\n**Market Dynamics:** While palladium still benefits from the continued dominance of ICE vehicles in the near term, the long-term demand outlook is deteriorating. The market is pricing in a gradual transition that will erode palladium's primary demand driver.\n\nPalladium now trades below platinum for the first time since 2018, having previously commanded a 4x premium at the peak of the autocatalyst super-cycle.` },
  { id:"7", title:"Gold miners outperform bullion as margins expand at current price levels", subtitle:"Major gold producers guide for record free cash flow in Q1 2024 with gold above $2,200.", author:"Alex Morrison", publishedAt: new Date(Date.now()-22*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=80", url:"#", source:"BofA Securities", tags:["XAU","GDX"], body:`**Gold Miners:** With gold above $2,200/oz, major gold mining companies are generating substantial free cash flow. Their all-in sustaining costs (AISC) average around $1,300-1,400/oz, leaving margins of $800-900/oz — among the best in the industry's history.\n\n**Shareholder Returns:** Companies like Newmont, Barrick, and Agnico Eagle are prioritizing dividends and share buybacks at current cash generation levels. Gold equity dividends have increased significantly over the past 12 months.\n\nHistorically, gold mining stocks (GDX ETF) have offered 2-3x leverage to gold price moves. With gold potentially heading higher, miners appear attractively valued relative to the metal itself.` },
  { id:"8", title:"India's gold demand surges ahead of wedding season; imports hit 3-year high", subtitle:"World's second-largest consumer imports nearly 200 tonnes in Q1, boosting global physical demand.", author:"Priya Sharma", publishedAt: new Date(Date.now()-28*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=400&q=80", url:"#", source:"India Bullion", tags:["XAU","INR"], body:`**Indian Demand:** India imported approximately 200 tonnes of gold in Q1 2024 — the highest quarterly figure in three years — as retailers stocked up ahead of the busy wedding and festival season.\n\n**Cultural Demand:** Gold holds deep cultural significance in India, with approximately 700 tonnes consumed annually in jewelry, investment, and industrial applications. India and China together account for over half of global gold demand.\n\nThe Indian government has maintained import duties on gold, but domestic demand remains robust. Higher gold prices have not significantly dampened purchasing enthusiasm among Indian consumers.` },
  { id:"9", title:"COMEX gold futures open interest reaches all-time high amid speculative fervor", subtitle:"Managed money positions in gold at record levels, raising short-term correction risk.", author:"James Faulkner", publishedAt: new Date(Date.now()-36*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1637001882069-8f8e0ac04be4?w=400&q=80", url:"#", source:"CFTC", tags:["XAU","COMEX"], body:`**Futures Market:** Open interest in COMEX gold futures has reached an all-time high, indicating elevated speculative participation. Managed money (hedge funds) net long positions are at their highest levels since 2020.\n\n**Risk Assessment:** While strong positioning reflects bullish conviction, it also raises the risk of a sharp correction if macro sentiment shifts. Any hawkish surprise from the Fed or easing of geopolitical tensions could trigger significant long liquidation.\n\nTechnical analysts note that momentum oscillators are in overbought territory on daily charts, suggesting consolidation or a brief pullback before the next leg higher is possible.` },
  { id:"10", title:"Silver industrial demand from solar panels forecast to hit 200M oz by 2025", subtitle:"Green energy transition makes silver the critical metal of the energy revolution.", author:"Dr. Lydia Green", publishedAt: new Date(Date.now()-42*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=80", url:"#", source:"Silver Institute", tags:["XAG","Solar"], body:`**Solar Demand:** The Silver Institute projects that solar panel manufacturing alone will consume over 200 million troy ounces of silver by 2025, up from 140 million oz in 2022. Each solar panel contains approximately 20g of silver.\n\n**Supply Constraints:** Global silver mine production is relatively inelastic — most silver is produced as a byproduct of zinc, lead and copper mining, making it difficult to rapidly increase supply in response to price signals.\n\nThe combination of growing industrial demand (solar, EVs, 5G electronics) and investment demand recovery creates a compelling supply-demand imbalance for silver over the medium term.` },
  { id:"11", title:"Gold breaks record set in 2020 bull market as dollar weakens broadly", subtitle:"XAU/USD surpasses all previous highs as real interest rates turn negative again.", author:"Emma Watts", publishedAt: new Date(Date.now()-50*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=400&q=80", url:"#", source:"FT Commodities", tags:["XAU","USD"], body:`**XAU Record:** Gold has broken above its previous all-time high set in August 2020 ($2,075), representing a new chapter in the metal's long-term bull market. The break was accompanied by high trading volume, confirming the significance of the move.\n\n**Real Rates:** The key driver has been a decline in real (inflation-adjusted) interest rates. When real rates are negative, the opportunity cost of holding zero-yield gold diminishes, making the metal relatively more attractive.\n\nLong-term price targets from major banks range from $2,500 to $3,000/oz over the next 1-2 years, with the more bullish scenarios contingent on significant Fed rate cuts and continued central bank buying.` },
  { id:"12", title:"Rhodium collapses 95% from peak as autocatalyst demand destruction accelerates", subtitle:"Once the world's most expensive precious metal, rhodium faces existential demand challenge from EVs.", author:"Craig Donnelly", publishedAt: new Date(Date.now()-60*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1637001882069-8f8e0ac04be4?w=400&q=80", url:"#", source:"Metal Bulletin", tags:["Rhodium","PGM"], body:`**Rhodium Market:** Rhodium, which peaked at $29,800/oz in 2021, has collapsed 95% to trade near $1,400/oz as electric vehicle adoption devastates the autocatalyst market that drives the vast majority of rhodium demand.\n\n**Structural Shift:** Unlike gold and silver, which have diversified demand bases, rhodium is almost entirely dependent on its use in three-way catalytic converters for gasoline and diesel vehicles. As ICE vehicle production declines, so does rhodium demand.\n\nThe rhodium collapse serves as a stark warning for other PGMs (platinum, palladium) — and underscores why precious metals investors are increasingly diversifying toward gold and silver, which have more resilient demand profiles.` },
];

function timeAgo(d: string): string {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function parseBold(t: string) {
  return t.split("**").map((p, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-[#111]">{p}</strong> : p);
}

function ArticleRow({ a }: { a: Article }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleRoute = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem(`gold_${a.id}`, JSON.stringify(a));
    router.push(`/gold/${a.id}`);
  };

  return (
    <article className="border-b border-[#e8e8e8] last:border-0">
      <div className="py-5 flex gap-5 items-start">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#111] leading-snug mb-2 cursor-pointer hover:text-brand-blue transition-colors" onClick={() => setOpen(!open)}>{a.title}</h2>
          <p className="text-sm text-[#555] leading-relaxed mb-3 line-clamp-2">{a.subtitle}</p>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-brand-blue">{a.author}</span>
              <span className="text-[#ccc]">·</span>
              <span className="text-sm text-[#888] flex items-center gap-1"><Clock size={12}/>{timeAgo(a.publishedAt)}</span>
              {a.tags.length > 0 && <>{<span className="text-[#ccc]">·</span>}<div className="flex gap-1">{a.tags.map(t=><span key={t} className="text-xs font-black text-brand-blue bg-brand-blue/8 border border-brand-blue/15 px-1.5 py-0.5 rounded-md">{t}</span>)}</div></>}
            </div>
            <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 text-sm font-bold text-[#333] hover:text-brand-blue transition-colors whitespace-nowrap">
              {open ? <><span>Collapse</span><ChevronUp size={16}/></> : <><span>Expand</span><ChevronDown size={16}/></>}
            </button>
          </div>
        </div>
        <a href={a.url} onClick={handleRoute} className="flex-shrink-0 w-[200px] md:w-[240px] hidden sm:block" tabIndex={-1}>
          <img src={a.imageUrl} alt={a.title} className="w-full h-[130px] md:h-[145px] object-cover rounded-lg border border-[#eaeaea] hover:opacity-90 transition-opacity"
            onError={e=>{(e.target as HTMLImageElement).src="https://images.unsplash.com/photo-1610375461246-83df859d849d?w=300&q=80"}}/>
        </a>
      </div>
      {open && (
        <div className="pb-6 pr-0 sm:pr-[256px] animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-xs font-black text-[#555] uppercase tracking-[0.15em] mb-4">Market Overview</h3>
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
    sessionStorage.setItem(`gold_${a.id}`, JSON.stringify(a));
    router.push(`/gold/${a.id}`);
  };

  return (
    <a href={a.url} onClick={handleRoute} className="group bg-white rounded-2xl border border-[#e8e8e8] overflow-hidden hover:shadow-xl hover:shadow-brand-blue/8 hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className="relative overflow-hidden h-44 bg-[#f5f5f5]">
        <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e=>{(e.target as HTMLImageElement).src="https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=80"}}/>
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

export default function Gold() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"list"|"grid">("list");

  useEffect(() => {
    const load = async () => {
      try {
        const kr = await axiosInstance.get(`/settings/news-api-key`);
        const key = kr.data?.apiKey;
        if (key) {
          const res = await axios.get("https://eventregistry.org/api/v1/article/getArticles", {
            params: { action:"getArticles", keyword:"gold silver precious metals commodities investing", articlesPage:1, articlesCount:30, articlesSortBy:"date", articlesSortByAsc:false, dataType:"news", resultType:"articles", apiKey: key },
            timeout: 8000, validateStatus: s => s < 500,
          });
          const raw = res.data?.articles?.results || [];
          if (raw.length > 0) {
            setArticles(raw.map((a: any, i: number) => ({ id:`api-${i}`, title: a.title||"", subtitle: a.body?.slice(0,150)||"", author: a.authors?.[0]?.name||a.source?.title||"Staff Writer", publishedAt: a.dateTimePub||a.date||new Date().toISOString(), imageUrl: a.image||"https://images.unsplash.com/photo-1610375461246-83df859d849d?w=300&q=80", url: a.url||"#", source: a.source?.title||"UpDownLive", tags: [], body: a.body?.slice(0,800)||a.title })));
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
        <h1 className="text-4xl font-extrabold text-[#111] mb-6 tracking-tight">Gold & Precious Metals</h1>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e8e8e8]">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]"/>
            <input type="text" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search gold news…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#f7f7f7] border border-[#e0e0e0] rounded-lg text-[#111] placeholder:text-[#aaa] focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 transition-all"/>
          </div>
          {!loading && <span className="text-xs text-[#888] font-medium whitespace-nowrap hidden sm:block">{filtered.length} article{filtered.length!==1?"s":""}</span>}
          <div className="flex items-center bg-[#f7f7f7] border border-[#e0e0e0] rounded-xl p-1 gap-1 flex-shrink-0">
            <button onClick={()=>setView("list")} title="List view" className={`p-2 rounded-lg transition-all ${view==="list"?"bg-brand-blue text-white shadow-sm":"text-[#888] hover:bg-[#e8e8e8]"}`}><List size={15}/></button>
            <button onClick={()=>setView("grid")} title="Grid view" className={`p-2 rounded-lg transition-all ${view==="grid"?"bg-brand-blue text-white shadow-sm":"text-[#888] hover:bg-[#e8e8e8]"}`}><LayoutGrid size={15}/></button>
          </div>
        </div>

        {/* Content */}
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

        {/* Pagination */}
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
