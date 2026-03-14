"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import axiosInstance from '@/lib/axios';
import { useRouter } from "next/navigation";
import {
  Search, ChevronDown, ChevronUp, Clock, ExternalLink,
  Newspaper, AlertCircle, LayoutGrid, List
} from "lucide-react";

interface Article {
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

// ── Fallback data ──────────────────────────────────────────────────────────
const FALLBACK: Article[] = [
  {
    id: "1", title: "Bitcoin surges past $70,000 as ETF inflows hit record high",
    subtitle: "Spot Bitcoin ETFs recorded over $1 billion in daily inflows, pushing BTC to new all-time highs.",
    author: "Rachel Lin", publishedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1640826514546-05db5ac9e6e8?w=400&q=80",
    url: "#", source: "CoinDesk", tags: ["BTC", "ETF"],
    body: `**BTC:** Bitcoin broke above the $70,000 mark for the first time, fueled by massive inflows into spot Bitcoin ETFs. BlackRock's IBIT and Fidelity's FBTC alone recorded combined inflows exceeding $800M in a single session.\n\n**ETF Impact:** The approval of spot Bitcoin ETFs has fundamentally changed the demand dynamics for BTC. Institutional money is flowing in at an unprecedented pace, providing structural support for prices.\n\nOn-chain data shows long-term holders are not selling into strength, while exchange reserves continue to decline — historically a bullish signal suggesting supply tightening.`,
  },
  {
    id: "2", title: "Ethereum eyes $4,000 as developers confirm Dencun upgrade timeline",
    subtitle: "The Dencun upgrade promises to dramatically reduce Layer-2 transaction fees via proto-danksharding.",
    author: "Marcus Webb", publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&q=80",
    url: "#", source: "The Block", tags: ["ETH"],
    body: `**ETH:** Ethereum is trading near the key $3,800 resistance level as traders position ahead of the Dencun upgrade. Proto-danksharding (EIP-4844) will introduce "blobs" to dramatically reduce data costs for Layer-2 networks.\n\n**L2 Impact:** Networks like Arbitrum, Optimism, Base and zkSync are expected to see transaction fees drop by 10-100x post-upgrade, making Ethereum significantly more competitive with alternative Layer-1 blockchains.\n\nTechnically, ETH needs a clean break above $3,850 to confirm the next leg higher toward $4,200. Support is established at $3,500.`,
  },
  {
    id: "3", title: "Solana network processes 50,000 TPS amid memecoin trading frenzy",
    subtitle: "SOL hits highest throughput ever recorded as retail activity surges on-chain.",
    author: "Aria Chen", publishedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&q=80",
    url: "#", source: "Decrypt", tags: ["SOL"],
    body: `**SOL:** Solana's network throughput has hit a new all-time high, processing over 50,000 transactions per second as memecoin trading activity explodes on-chain. The Solana blockchain's high throughput and low fees have made it the preferred venue for speculative retail activity.\n\n**Network Health:** Despite the surge in activity, Solana has maintained uptime stability. Previous network congestion issues appear to have been addressed through recent validator client improvements.\n\nSOL has rallied 25% over the past two weeks, with technical analysts targeting the January high at $210.`,
  },
  {
    id: "4", title: "Bitcoin halving countdown: Everything you need to know about April's event",
    subtitle: "Bitcoin's fourth halving will reduce miner rewards from 6.25 BTC to 3.125 BTC per block.",
    author: "Daniel Park", publishedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&q=80",
    url: "#", source: "Bitcoin Magazine", tags: ["BTC"],
    body: `**BTC Halving:** The Bitcoin halving, expected around April 20, 2024, will cut the block reward from 6.25 BTC to 3.125 BTC. Historically, halvings have been followed by significant price appreciation in the 12-18 months that follow.\n\n**Miner Economics:** The reduction in block rewards will pressure mining economics, particularly for miners with higher electricity costs. Consolidation among mining companies is expected to accelerate post-halving.\n\nMarket participants are divided on whether the halving is already "priced in" given the pre-halving rally, or whether further upside lies ahead once the supply shock effect takes hold.`,
  },
  {
    id: "5", title: "XRP gains 15% as Ripple wins partial victory in SEC legal battle",
    subtitle: "Court rules XRP sales on secondary markets do not constitute securities offerings.",
    author: "Sophie Turner", publishedAt: new Date(Date.now() - 10 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&q=80",
    url: "#", source: "CoinTelegraph", tags: ["XRP"],
    body: `**XRP:** Ripple scored a major legal victory as a federal judge ruled that XRP sales on secondary markets (exchanges) do not constitute unregistered securities offerings. This is a significant precedent for the broader crypto industry.\n\n**Regulatory Clarity:** The ruling provides much-needed clarity for crypto exchanges that had delisted or restricted XRP trading during the SEC lawsuit. Several major exchanges have announced plans to relist XRP following the decision.\n\nXRP surged 15% on the news and is now targeting the $0.70 resistance level, with the broader regulatory clarity boosting sentiment across the entire crypto market.`,
  },
  {
    id: "6", title: "Dogecoin rallies 20% following Elon Musk's X platform payment integration hints",
    subtitle: "Musk's social media platform X may integrate DOGE for payments, sparking a sharp rally.",
    author: "James Hartley", publishedAt: new Date(Date.now() - 14 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1640826514546-05db5ac9e6e8?w=400&q=80",
    url: "#", source: "Reuters", tags: ["DOGE"],
    body: `**DOGE:** Dogecoin surged 20% after Elon Musk posted cryptic hints about DOGE integration into the X (formerly Twitter) platform's upcoming payments system. Musk has consistently expressed support for DOGE over the years.\n\n**Social Media Payments:** X has been building out a payments infrastructure under Musk's leadership. If DOGE is integrated as a payment method, it would give the memecoin significant real-world utility and exposure to X's 350+ million active users.\n\nOn-chain data shows a spike in DOGE wallet activity, with new addresses created at the highest rate since the 2021 bull market.`,
  },
  {
    id: "7", title: "Cardano's Midnight privacy chain launches public testnet",
    subtitle: "ADA ecosystem expands with privacy-focused smart contract capabilities via Midnight sidechain.",
    author: "Laura Simmons", publishedAt: new Date(Date.now() - 20 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&q=80",
    url: "#", source: "Cardano Foundation", tags: ["ADA"],
    body: `**ADA:** Cardano's Midnight blockchain — a privacy-preserving sidechain — has launched its public testnet, marking a significant milestone for the ecosystem. Midnight allows developers to build applications with selective data disclosure.\n\n**Technology:** Midnight uses zero-knowledge proofs to enable private transactions and smart contracts. This positions Cardano as a leading platform for enterprise and DeFi applications requiring confidentiality.\n\nADA has responded positively to the announcement, gaining 8% as investors reassess the long-term value of the Cardano ecosystem beyond its existing DeFi and NFT applications.`,
  },
  {
    id: "8", title: "DeFi total value locked surpasses $100 billion milestone once more",
    subtitle: "Decentralized finance protocols see renewed capital inflows as crypto markets recover.",
    author: "Ryan O'Brien", publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&q=80",
    url: "#", source: "DefiLlama", tags: ["DeFi"],
    body: `**DeFi:** The total value locked (TVL) in decentralized finance protocols has surpassed the $100 billion mark for the first time since the 2022 bear market. Ethereum-based protocols account for the majority of TVL, followed by Tron and Solana.\n\n**Leading Protocols:** Lido Finance leads with over $35B in TVL (liquid staking), followed by Aave ($12B), EigenLayer ($10B), and Uniswap ($6B). Real-world asset tokenization protocols are among the fastest-growing categories.\n\nThe DeFi resurgence is being driven by higher crypto prices, improved yields, and growing institutional interest in on-chain financial products.`,
  },
  {
    id: "9", title: "NFT market shows signs of life with CryptoPunks sales breaking $1M barrier",
    subtitle: "Blue-chip NFTs lead a tentative recovery in digital collectibles following 18 months of decline.",
    author: "Emma Clarke", publishedAt: new Date(Date.now() - 30 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&q=80",
    url: "#", source: "OpenSea Blog", tags: ["NFT"],
    body: `**NFT Market:** Several CryptoPunks have sold for over $1 million in recent weeks, signaling a potential recovery in the blue-chip NFT segment after an extended bear market. Trading volumes across major platforms are up 40% month-over-month.\n\n**Market Dynamics:** The NFT recovery is led by provably scarce, story-rich collections that have maintained cultural relevance despite the market downturn. Speculative projects and low-quality PFP collections continue to struggle.\n\nOpenSea reported its highest weekly volume since Q1 2023, while newer platforms like Blur and Magic Eden continue to gain market share through aggressive trader incentives.`,
  },
  {
    id: "10", title: "Avalanche ecosystem raises $100M fund for institutional DeFi development",
    subtitle: "Ava Labs partners with major financial institutions to build regulated DeFi infrastructure on AVAX.",
    author: "Chris Anderson", publishedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1640826514546-05db5ac9e6e8?w=400&q=80",
    url: "#", source: "Bloomberg", tags: ["AVAX"],
    body: `**AVAX:** Ava Labs has announced a $100 million ecosystem fund focused on building institutional-grade DeFi infrastructure on the Avalanche blockchain. Partners include KKR, Citigroup, and JPMorgan Chase.\n\n**Institutional DeFi:** The fund will support the development of tokenized real-world assets, institutional lending protocols, and regulatory-compliant trading infrastructure. Avalanche Subnets allow institutions to deploy customized, permissioned blockchains within the broader ecosystem.\n\nAVAX gained 12% on the announcement as investors view institutional partnerships as a key catalyst for the next phase of crypto adoption.`,
  },
  {
    id: "11", title: "Polkadot's parachain ecosystem reaches 50 active chains milestone",
    subtitle: "DOT's multi-chain vision matures as interoperability drives developer activity.",
    author: "Sean Murphy", publishedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&q=80",
    url: "#", source: "Polkadot Network", tags: ["DOT"],
    body: `**DOT:** Polkadot's parachain ecosystem has reached 50 active parachains, with combined TVL growing 35% quarter-over-quarter. Key parachains include Moonbeam (EVM compatibility), Acala (DeFi hub), and Phala (confidential computing).\n\n**Interoperability:** Polkadot's cross-chain messaging protocol (XCM) enables seamless transfer of assets and data across all parachains, positioning the ecosystem as a leading platform for multi-chain applications.\n\nDOT has underperformed relative to other Layer-1 assets but analysts see potential for a re-rating as the ecosystem's technical advantages become more widely recognized.`,
  },
  {
    id: "12", title: "Chainlink surges as major banks integrate LINK price oracles into tokenized asset platforms",
    subtitle: "Real-world asset tokenization drives institutional demand for Chainlink's data infrastructure.",
    author: "Victoria Nash", publishedAt: new Date(Date.now() - 55 * 3600000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&q=80",
    url: "#", source: "The Block", tags: ["LINK"],
    body: `**LINK:** Chainlink's oracle network has been integrated by several major banks including HSBC and BNY Mellon for their real-world asset tokenization platforms. LINK surged 18% on the news as investors recognized the critical infrastructure role Chainlink plays in the tokenization narrative.\n\n**RWA Narrative:** Real-world asset tokenization is one of the hottest themes in crypto and TradFi convergence. Chainlink's Cross-Chain Interoperability Protocol (CCIP) is emerging as the standard for secure cross-chain asset transfers.\n\nTechnically, LINK has broken out above the $18 resistance level and targets $22 next, with strong institutional interest providing fundamental support.`,
  },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) !== 1 ? "s" : ""} ago`;
}

function parseBold(text: string) {
  return text.split("**").map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-bold text-[#111111]">{part}</strong> : part
  );
}

// ── Article List Row ────────────────────────────────────────────────────────
function ArticleRow({ article }: { article: Article }) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const handleRoute = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem(`crypto_${article.id}`, JSON.stringify(article));
    router.push(`/crypto/${article.id}`);
  };

  const paragraphs = article.body.split("\n\n").filter(Boolean);
  return (
    <article className="border-b border-[#e8e8e8] last:border-0">
      <div className="py-5 flex gap-5 items-start">
        <div className="flex-1 min-w-0">
          <h2
            className="text-xl md:text-2xl font-extrabold text-[#111111] leading-snug mb-2 cursor-pointer hover:text-brand-blue transition-colors"
            onClick={() => setExpanded(!expanded)}
          >
            {article.title}
          </h2>
          <p className="text-sm text-[#555] leading-relaxed mb-3 line-clamp-2">{article.subtitle}</p>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-brand-blue">{article.author}</span>
              <span className="text-[#ccc]">·</span>
              <span className="text-sm text-[#888] flex items-center gap-1">
                <Clock size={12} /> {timeAgo(article.publishedAt)}
              </span>
              {article.tags.length > 0 && (
                <>
                  <span className="text-[#ccc]">·</span>
                  <div className="flex gap-1">
                    {article.tags.map(t => (
                      <span key={t} className="text-xs font-black text-brand-blue bg-brand-blue/8 border border-brand-blue/15 px-1.5 py-0.5 rounded-md">{t}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-sm font-bold text-[#333] hover:text-brand-blue transition-colors whitespace-nowrap select-none"
            >
              {expanded ? <><span>Collapse</span><ChevronUp size={16} /></> : <><span>Expand</span><ChevronDown size={16} /></>}
            </button>
          </div>
        </div>
        <a href={article.url} onClick={handleRoute}
          className="flex-shrink-0 w-[200px] md:w-[240px] hidden sm:block" tabIndex={-1}>
          <img src={article.imageUrl} alt={article.title}
            className="w-full h-[130px] md:h-[145px] object-cover rounded-lg border border-[#eaeaea] hover:opacity-90 transition-opacity"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1640826514546-05db5ac9e6e8?w=300&q=80"; }}
          />
        </a>
      </div>
      {expanded && (
        <div className="pb-6 pr-0 sm:pr-[256px] animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-xs font-black text-[#555] uppercase tracking-[0.15em] mb-4">Market Overview</h3>
          <div className="space-y-4 text-[15px] text-[#333] leading-relaxed">
            {paragraphs.map((p, i) => <p key={i}>{parseBold(p)}</p>)}
          </div>
          <a href={article.url} onClick={handleRoute}
             className="inline-flex items-center gap-1.5 mt-5 text-sm font-bold text-brand-blue hover:text-brand-red transition-colors">
            Read full article <ExternalLink size={13} />
          </a>
        </div>
      )}
    </article>
  );
}

// ── Article Grid Card ───────────────────────────────────────────────────────
function ArticleGridCard({ article }: { article: Article }) {
  const router = useRouter();

  const handleRoute = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem(`crypto_${article.id}`, JSON.stringify(article));
    router.push(`/crypto/${article.id}`);
  };

  return (
    <a href={article.url} onClick={handleRoute}
       className="group bg-white rounded-2xl border border-[#e8e8e8] overflow-hidden hover:shadow-xl hover:shadow-brand-blue/8 hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className="relative overflow-hidden h-44 bg-[#f5f5f5] flex-shrink-0">
        <img src={article.imageUrl} alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1640826514546-05db5ac9e6e8?w=400&q=80"; }}
        />
        {article.tags.length > 0 && (
          <div className="absolute top-2.5 left-2.5 flex gap-1">
            {article.tags.map(t => (
              <span key={t} className="text-xs font-black text-white bg-brand-blue/90 backdrop-blur px-2 py-0.5 rounded-md">{t}</span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-extrabold text-[#111111] text-sm leading-snug line-clamp-3 group-hover:text-brand-blue transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-[#777] leading-relaxed line-clamp-2 flex-1">{article.subtitle}</p>
        <div className="flex items-center justify-between pt-2 border-t border-[#f0f0f0] mt-1">
          <span className="text-xs font-semibold text-brand-blue truncate max-w-[55%]">{article.author}</span>
          <span className="text-xs text-[#aaa] flex items-center gap-1 flex-shrink-0">
            <Clock size={10} /> {timeAgo(article.publishedAt)}
          </span>
        </div>
      </div>
    </a>
  );
}

const PAGE_SIZE = 10;

export default function Crypto() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"list" | "grid">("list");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const keyRes = await axiosInstance.get(`/settings/news-api-key`);
        const apiKey = keyRes.data?.apiKey;
        if (apiKey) {
          const res = await axios.get("https://eventregistry.org/api/v1/article/getArticles", {
            params: {
              action: "getArticles",
              keyword: "bitcoin ethereum cryptocurrency blockchain crypto",
              articlesPage: 1, articlesCount: 30,
              articlesSortBy: "date", articlesSortByAsc: false,
              dataType: "news", resultType: "articles", apiKey,
            },
            timeout: 8000, validateStatus: s => s < 500,
          });
          const raw = res.data?.articles?.results || [];
          if (raw.length > 0) {
            setArticles(raw.map((a: any, i: number) => ({
              id: `api-${i}`,
              title: a.title || "",
              subtitle: a.body?.slice(0, 150) || "",
              author: a.authors?.[0]?.name || a.source?.title || "Staff Writer",
              publishedAt: a.dateTimePub || a.date || new Date().toISOString(),
              imageUrl: a.image || "https://images.unsplash.com/photo-1640826514546-05db5ac9e6e8?w=300&q=80",
              url: a.url || "#",
              source: a.source?.title || "UpDownLive",
              tags: [],
              body: a.body?.slice(0, 800) || a.title,
            })));
            return;
          }
        }
        setArticles(FALLBACK);
      } catch { setArticles(FALLBACK); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    setPage(1);
    if (!query.trim()) return articles;
    const q = query.toLowerCase();
    return articles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, articles]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goTo = (p: number) => {
    setPage(Math.min(Math.max(1, p), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNums = useMemo(() => {
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    const nums: number[] = [];
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }, [page, totalPages]);

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-4xl font-extrabold text-[#111111] mb-6 tracking-tight">Cryptocurrency</h1>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e8e8e8]">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search crypto news…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#f7f7f7] border border-[#e0e0e0] rounded-lg text-[#111] placeholder:text-[#aaa] focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 transition-all"
            />
          </div>
          {!loading && <span className="text-xs text-[#888] font-medium whitespace-nowrap hidden sm:block">{filtered.length} article{filtered.length !== 1 ? "s" : ""}</span>}
          <div className="flex items-center bg-[#f7f7f7] border border-[#e0e0e0] rounded-xl p-1 gap-1 flex-shrink-0">
            <button onClick={() => setView("list")} title="List view"
              className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-brand-blue text-white shadow-sm" : "text-[#888] hover:bg-[#e8e8e8]"}`}>
              <List size={15} />
            </button>
            <button onClick={() => setView("grid")} title="Grid view"
              className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-brand-blue text-white shadow-sm" : "text-[#888] hover:bg-[#e8e8e8]"}`}>
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>

        {/* Content */}
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
          <div>{paginated.map(a => <ArticleRow key={a.id} article={a} />)}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map(a => <ArticleGridCard key={a.id} article={a} />)}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && filtered.length > PAGE_SIZE && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#e8e8e8]">
            <p className="text-sm text-[#888]">
              Showing <span className="font-bold text-[#111]">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="font-bold text-[#111]">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => goTo(page - 1)} disabled={page === 1} className="p-2 rounded-lg border border-[#e0e0e0] hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm">‹ Prev</button>
              {pageNums[0] > 1 && <><button onClick={() => goTo(1)} className="w-9 h-9 rounded-lg border border-[#e0e0e0] text-sm font-bold hover:border-brand-blue hover:text-brand-blue transition-all">1</button>{pageNums[0] > 2 && <span className="px-1 text-[#aaa]">…</span>}</>}
              {pageNums.map(p => (
                <button key={p} onClick={() => goTo(p)} className={`w-9 h-9 rounded-lg border text-sm font-bold transition-all ${p === page ? "bg-brand-blue border-brand-blue text-white" : "border-[#e0e0e0] hover:border-brand-blue hover:text-brand-blue"}`}>{p}</button>
              ))}
              {pageNums[pageNums.length - 1] < totalPages && <>{pageNums[pageNums.length - 1] < totalPages - 1 && <span className="px-1 text-[#aaa]">…</span>}<button onClick={() => goTo(totalPages)} className="w-9 h-9 rounded-lg border border-[#e0e0e0] text-sm font-bold hover:border-brand-blue hover:text-brand-blue transition-all">{totalPages}</button></>}
              <button onClick={() => goTo(page + 1)} disabled={page === totalPages} className="p-2 rounded-lg border border-[#e0e0e0] hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm">Next ›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
