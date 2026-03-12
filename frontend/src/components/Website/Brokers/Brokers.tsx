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
  { id:"1", title:"IC Markets named best ECN broker for 2024 by FX Awards", subtitle:"The Australian broker tops the rankings for raw spread, execution speed, and MetaTrader integration.", author:"James Caldwell", publishedAt: new Date(Date.now()-30*60000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80", url:"#", source:"FX Awards", tags:["ECN","ASIC"], body:`**IC Markets:** IC Markets has won the Best ECN Broker award for 2024, citing in particular its raw spread offering (from 0.0 pips on major pairs) and ultra-fast execution averaging 40ms. The broker serves over 180,000 active clients globally.\n\n**Regulation:** IC Markets holds regulatory licenses from ASIC (Australia), CySEC (Cyprus), and the SCB (Bahamas), covering traders in most major jurisdictions worldwide. All client funds are held in segregated accounts.\n\nThe broker offers MetaTrader 4, MetaTrader 5, and cTrader platforms, catering to both algorithmic traders and discretionary prop trading desk setups.` },
  { id:"2", title:"Pepperstone expands into South Africa with new FSCA-regulated entity", subtitle:"UK-affiliated Australian broker grows its regulated footprint in emerging markets.", author:"Emma Sanderson", publishedAt: new Date(Date.now()-2*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=400&q=80", url:"#", source:"Finance Magnates", tags:["FSCA","FCA"], body:`**Pepperstone:** The broker has established a new entity regulated by the Financial Sector Conduct Authority (FSCA) in South Africa, allowing it to serve South African retail traders under local regulatory oversight.\n\n**Global Expansion:** Pepperstone already holds FCA (UK), ASIC (AU), CMA (Kenya), SCB (Bahamas), and DFSA (Dubai) licences. The addition of FSCA further strengthens its emerging markets presence.\n\nSouth Africa is one of the fastest-growing retail FX markets in Africa, with a well-established retail trading culture and growing interest in CFD products.` },
  { id:"3", title:"eToro IPO plans revived — valuation targets $5 billion on Nasdaq listing", subtitle:"Social trading pioneer eyes 2024 US public market debut after previous attempts were shelved.", author:"Robert Price", publishedAt: new Date(Date.now()-5*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80", url:"#", source:"Bloomberg", tags:["IPO","CySEC"], body:`**eToro:** The social trading and investment platform has revived plans for a Nasdaq IPO, with a target valuation of approximately $5 billion. The company had previously attempted to go public via a SPAC merger in 2021 at a $10.4B valuation before market conditions deteriorated.\n\n**Business Model:** eToro operates a unique "social trading" model where users can automatically copy trades from successful investors. The platform has over 30 million registered users across 140 countries.\n\nThe planned IPO would provide liquidity for early investors and employees while raising fresh capital for further international expansion and product development.` },
  { id:"4", title:"ESMA proposes stricter leverage limits on crypto CFDs; 2:1 cap under review", subtitle:"European regulator considers permanent restrictions on high-risk digital asset derivatives.", author:"Elena Martinez", publishedAt: new Date(Date.now()-8*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=400&q=80", url:"#", source:"ESMA", tags:["ESMA","CySEC"], body:`**ESMA Regulation:** The European Securities and Markets Authority is consulting on a proposal to cap leverage on cryptocurrency CFDs at 2:1 permanently, extending temporary measures that were first introduced in 2018.\n\n**Industry Impact:** The proposed restrictions would primarily affect EU-regulated brokers offering crypto CFDs. Many brokers have responded by establishing offshore entities in less restrictive jurisdictions (SCB, VFSC, FSA Seychelles) to serve clients seeking higher leverage.\n\nThe consultation period closes in June, with final rules expected to take effect in Q1 2025. Trading associations are lobbying for a more nuanced approach that accounts for client sophistication.` },
  { id:"5", title:"Interactive Brokers reports record quarterly revenue on surge in options trading", subtitle:"IBKR benefits from high volatility and growing retail options market participation.", author:"Michael Chen", publishedAt: new Date(Date.now()-12*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80", url:"#", source:"SEC Filings", tags:["IBKR","SEC"], body:`**Interactive Brokers:** The publicly listed broker reported record quarterly net revenues of $1.2 billion, driven primarily by increased options trading activity. Daily Average Revenue Trades (DARTs) grew 18% year-over-year to 2.1 million.\n\n**Client Metrics:** IBKR's client accounts grew to 2.4 million, with total client equity reaching $456 billion. The broker's competitive commission structure ($0.65/contract for options) and advanced platform continue to attract active traders.\n\nThe broker also benefits from net interest income, which has increased dramatically as rates have risen — IBKR earns on client idle cash at favorable spreads.` },
  { id:"6", title:"OANDA launches algorithmic trading marketplace for retail forex traders", subtitle:"FX pioneer LPs institutional quant strategies to retail clients via new subscription model.", author:"Sarah Kim", publishedAt: new Date(Date.now()-18*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=400&q=80", url:"#", source:"OANDA Press", tags:["OANDA","Algo"], body:`**OANDA:** The veteran forex broker has launched a curated marketplace of algorithmic trading strategies, allowing retail traders to subscribe to institutional-quality quant models for a monthly fee.\n\n**Strategy Variety:** The marketplace includes trend-following, mean-reversion, carry, and machine-learning-based strategies across forex, commodities, and indices. Performance data is audited and backtested over 10 years of historical data.\n\nThe launch positions OANDA as a technology leader in the retail FX space, competing with newer fintech entrants rather than solely on spread and execution quality.` },
  { id:"7", title:"FCA bans five unregistered forex firms targeting UK retail investors", subtitle:"Regulator issues consumer alerts against clone firms impersonating regulated brokers.", author:"Katherine Brown", publishedAt: new Date(Date.now()-24*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80", url:"#", source:"FCA", tags:["FCA","Warning"], body:`**FCA Action:** The UK's Financial Conduct Authority has banned five unregistered firms claiming to offer forex and CFD trading services, warning consumers of potential financial losses. Three of the firms were found to be "clone" companies impersonating legitimate authorized brokers.\n\n**Clone Firms:** Clone firm fraud involves criminals creating convincing replicas of legitimate broker websites, cloning regulatory registration numbers and logos. Victims typically lose deposited funds immediately.\n\nThe FCA advises consumers to always check the official FCA register at register.fca.org.uk before depositing funds with any firm. Legitimate regulated brokers will have verifiable registration numbers that can be cross-checked.` },
  { id:"8", title:"Saxo Bank introduces fractional trading for US and European equities", subtitle:"Premium Danish broker democratizes access to expensive stocks with minimum $1 investment.", author:"Lars Petersen", publishedAt: new Date(Date.now()-30*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=400&q=80", url:"#", source:"Saxo Bank", tags:["Saxo","Stocks"], body:`**Saxo Bank:** The Copenhagen-headquartered broker has introduced fractional share trading across 150 of the most popular US and European stocks, allowing investors to buy as little as $1 worth of shares in companies like Berkshire Hathaway (BRK.A at ~$600,000/share) and Amazon.\n\n**Democratization:** Fractional investing reduces the capital barrier to owning quality stocks, enabling proper portfolio diversification even for investors with smaller amounts. This feature has been popularized by US platforms like Robinhood and Public.\n\nThe feature is live for SaxoInvestor platform users and will be rolled out to SaxoTraderGO and SaxoTraderPRO in subsequent quarters.` },
  { id:"9", title:"XM Group hits 15 million client milestone with aggressive emerging market expansion", subtitle:"The Cyprus-based broker now serves clients in 196 countries following recent LATAM push.", author:"Carlos Rodriguez", publishedAt: new Date(Date.now()-40*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80", url:"#", source:"XM Press", tags:["XM","CySEC"], body:`**XM Group:** The multi-regulated broker has reached 15 million registered client accounts, reflecting its aggressive expansion in Latin America, Southeast Asia, and Africa. The milestone was achieved through localized marketing, translated platforms, and local payment methods.\n\n**Offering:** XM offers forex, stock CFDs, commodities, and indices on MetaTrader 4 and 5. A $5 minimum deposit and leverage up to 1:888 (in offshore jurisdictions) make it particularly accessible for emerging market traders.\n\nThe broker runs competitions and educational programs targeting newer traders, having established itself as a benchmark for retail client acquisition in developing markets.` },
  { id:"10", title:"London CFD industry calls for regulatory harmonization ahead of EU divergence", subtitle:"Post-Brexit fragmentation creates compliance burden as UK and EU rules diverge further.", author:"Simon Hughes", publishedAt: new Date(Date.now()-48*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=400&q=80", url:"#", source:"City A.M.", tags:["FCA","ESMA"], body:`**Regulatory Divergence:** London's CFD industry is calling for greater alignment between FCA and ESMA rules following post-Brexit rule-making. Key divergences include leverage limits, disclosure requirements, and crypto CFD restrictions.\n\n**Industry Impact:** Brokers operating in both UK and EU markets must maintain dual compliance frameworks, increasing operational costs. Some smaller brokers have consolidated to a single regulatory jurisdiction to reduce complexity.\n\nThe FCA is currently reviewing its retail investment framework through the Consumer Duty regime, which may lead to further divergence from the EU's MiFID II framework in areas like product intervention powers and client categorization.` },
  { id:"11", title:"Robinhood enters UK market — signals European expansion ambitions", subtitle:"US zero-commission pioneer launches British app following FCA authorization.", author:"Jessica Wild", publishedAt: new Date(Date.now()-56*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80", url:"#", source:"FT", tags:["FCA","Robinhood"], body:`**Robinhood UK:** The zero-commission US broker has launched in the UK following FCA authorization, offering commission-free US stock trading to British retail investors. The launch marks Robinhood's first move outside of North America.\n\n**Competition:** The UK already has several well-established zero-commission platforms including Trading 212, Freetrade, and eToro. Robinhood's brand recognition and technology may give it an edge, though it lacks the ISA (Individual Savings Account) wrapper that many UK investors use for tax efficiency.\n\nThe company plans to leverage its UK presence as a springboard for further European expansion, potentially seeking MiFID authorization to serve EU27 clients.` },
  { id:"12", title:"Plus500 reports record profits as CFD trading volumes surge globally", subtitle:"FTSE 250 CFD provider benefits from high market volatility and growing retail participation.", author:"David Levy", publishedAt: new Date(Date.now()-64*3600000).toISOString(), imageUrl:"https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=400&q=80", url:"#", source:"Reuters", tags:["Plus500","FCA"], body:`**Plus500:** The FTSE 250-listed CFD provider reported record annual profits of $725 million, driven by elevated market volatility across forex, commodities, and equities. The company's proprietary platform (no MetaTrader) retained 300,000 active clients in the period.\n\n**Business Model:** Plus500 operates a market-maker model, profiting from the spread between client buy and sell prices. The concentrated business model (CFDs only, proprietary platform) generates high margins when volatility is elevated.\n\nThe board approved a $250 million share buyback alongside a special dividend, returning substantial capital to shareholders following the record trading period.` },
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
    sessionStorage.setItem(`brokers_${a.id}`, JSON.stringify(a));
    router.push(`/brokers/${a.id}`);
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
            onError={e=>{(e.target as HTMLImageElement).src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&q=80"}}/>
        </a>
      </div>
      {open && (
        <div className="pb-6 pr-0 sm:pr-[256px] animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-xs font-black text-[#555] uppercase tracking-[0.15em] mb-4">Broker Overview</h3>
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
    sessionStorage.setItem(`brokers_${a.id}`, JSON.stringify(a));
    router.push(`/brokers/${a.id}`);
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

export default function Brokers() {
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
            params: { action:"getArticles", keyword:"forex broker trading platform regulation FCA ASIC retail investing", articlesPage:1, articlesCount:30, articlesSortBy:"date", articlesSortByAsc:false, dataType:"news", resultType:"articles", apiKey: key },
            timeout: 8000, validateStatus: s => s < 500,
          });
          const raw = res.data?.articles?.results || [];
          if (raw.length > 0) {
            setArticles(raw.map((a: any, i: number) => ({ id:`api-${i}`, title: a.title||"", subtitle: a.body?.slice(0,150)||"", author: a.authors?.[0]?.name||a.source?.title||"Staff Writer", publishedAt: a.dateTimePub||a.date||new Date().toISOString(), imageUrl: a.image||"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&q=80", url: a.url||"#", source: a.source?.title||"UpDownLive", tags: [], body: a.body?.slice(0,800)||a.title })));
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
        <h1 className="text-4xl font-extrabold text-[#111] mb-6 tracking-tight">Brokers</h1>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e8e8e8]">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]"/>
            <input type="text" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search broker news…"
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
