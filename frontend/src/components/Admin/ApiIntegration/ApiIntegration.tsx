"use client";
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { Key, Eye, EyeOff, Save, Loader2, ExternalLink, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/UI/Card";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyConfig {
  id: string;
  label: string;
  endpoint: string;
  placeholder: string;
  description: string;
  docUrl: string;
  docLabel: string;
  instructions: string[];
  tag: string;
  tagColor: string;
}

const API_CONFIGS: ApiKeyConfig[] = [
  {
    id: "news",
    label: "NewsAPI.ai (Event Registry)",
    endpoint: "news-api-key",
    placeholder: "Paste your NewsAPI.ai / Event Registry API Key…",
    description: "Powers the Latest News section on the Home page and the /news route. Used to pull the latest global business articles.",
    docUrl: "https://eventregistry.org/documentation",
    docLabel: "EventRegistry Docs",
    tag: "Home Page • News",
    tagColor: "bg-brand-blue/10 text-brand-blue border border-brand-blue/20",
    instructions: [
      "1. Go to eventregistry.org and create a free account.",
      "2. Navigate to My Profile → API Key.",
      "3. Copy your API key and paste it below.",
      "4. Free plan: 1 000 article requests/day.",
    ],
  },
  {
    id: "forex",
    label: "ExchangeRate-API (Forex)",
    endpoint: "forex-api-key",
    placeholder: "Paste your ExchangeRate-API key…",
    description: "Powers the /forex page with live USD-based currency exchange rates for 160+ currencies.",
    docUrl: "https://www.exchangerate-api.com/docs",
    docLabel: "ExchangeRate-API Docs",
    tag: "Forex Page",
    tagColor: "bg-green-100 text-green-700 border border-green-200",
    instructions: [
      "1. Sign up free at exchangerate-api.com.",
      "2. Copy your API key from the dashboard.",
      "3. Free plan: 1 500 requests/month.",
      "4. API endpoint used: GET /v6/{KEY}/latest/USD",
    ],
  },
  {
    id: "crypto",
    label: "CoinGecko API (Crypto)",
    endpoint: "crypto-api-key",
    placeholder: "Paste your CoinGecko Demo API key (or 'demo' for public)…",
    description: "Powers the /crypto page with real-time cryptocurrency prices, market caps, and 24h changes for 250+ assets.",
    docUrl: "https://www.coingecko.com/api/documentation",
    docLabel: "CoinGecko Docs",
    tag: "Crypto Page",
    tagColor: "bg-purple-100 text-purple-700 border border-purple-200",
    instructions: [
      "1. Go to coingecko.com/api and click 'Get Demo API Key'.",
      "2. Sign up and copy your Demo API key.",
      "3. Demo plan: 30 calls/min, 10 000 calls/month.",
      "4. Enter 'demo' to use the public (rate-limited) endpoint.",
    ],
  },
  {
    id: "metals",
    label: "Metals.live API (Gold & Precious Metals)",
    endpoint: "metals-api-key",
    placeholder: "Paste your Metals.live API key…",
    description: "Powers the /gold page with live spot prices for Gold, Silver, Platinum, and Palladium.",
    docUrl: "https://metals.live/api",
    docLabel: "Metals.live Docs",
    tag: "Gold Page",
    tagColor: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    instructions: [
      "1. Register at metals.live.",
      "2. Copy your API key from the dashboard.",
      "3. Free tier: 100 requests/month.",
      "4. API endpoint used: GET /v1/spot with header X-API-KEY",
    ],
  },
];

export default function ApiIntegration() {
  const { toast } = useToast();
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const fetches = API_CONFIGS.map(async (cfg) => {
        try {
          const res = await axiosInstance.get(`/settings/${cfg.endpoint}`);
          return { id: cfg.id, key: res.data?.apiKey || '' };
        } catch {
          return { id: cfg.id, key: '' };
        }
      });
      const results = await Promise.all(fetches);
      const map: Record<string, string> = {};
      results.forEach(r => { map[r.id] = r.key; });
      setKeys(map);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const handleSave = async (cfg: ApiKeyConfig) => {
    setSaving(s => ({ ...s, [cfg.id]: true }));
    try {
      await axiosInstance.post(`/settings/${cfg.endpoint}`, { apiKey: keys[cfg.id] || '' });
      setSaved(s => ({ ...s, [cfg.id]: true }));
      setTimeout(() => setSaved(s => ({ ...s, [cfg.id]: false })), 3000);
      toast({ variant: 'success' as any, description: `${cfg.label} API key saved successfully.` });
    } catch {
      toast({ variant: 'destructive', description: `Failed to save ${cfg.label} API key.` });
    } finally {
      setSaving(s => ({ ...s, [cfg.id]: false }));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={32} className="animate-spin text-brand-blue" />
    </div>
  );

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black mb-2 tracking-tight">
          API Integrations & Webhooks
        </h1>
        <p className="text-brand-gray text-lg">
          Manage all third-party API keys. Each key powers a specific page on the website. All keys are stored securely in MongoDB.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {API_CONFIGS.map((cfg) => (
          <Card key={cfg.id} className="rounded-3xl border-brand-border shadow-sm">
            <CardHeader className="border-b border-brand-border bg-brand-light/50 rounded-t-3xl px-8 py-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Key size={22} className="text-brand-blue" /> {cfg.label}
                </CardTitle>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.tagColor}`}>
                  {cfg.tag}
                </span>
              </div>
              <CardDescription className="mt-1">{cfg.description}</CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              {/* Step-by-step instructions */}
              <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-2xl p-5 mb-6">
                <p className="text-xs font-bold text-brand-blue uppercase tracking-widest flex items-center gap-2 mb-3">
                  <Info size={14} /> How to get your API key
                </p>
                <ol className="space-y-1">
                  {cfg.instructions.map((step, i) => (
                    <li key={i} className="text-sm text-brand-gray leading-relaxed">{step}</li>
                  ))}
                </ol>
                <a
                  href={cfg.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-brand-blue hover:text-brand-red transition-colors"
                >
                  <ExternalLink size={13} /> {cfg.docLabel}
                </a>
              </div>

              {/* Key input + save */}
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full relative">
                  <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">
                    API Key
                  </label>
                  <div className="relative">
                    <input
                      type={show[cfg.id] ? "text" : "password"}
                      value={keys[cfg.id] || ''}
                      onChange={(e) => setKeys(k => ({ ...k, [cfg.id]: e.target.value }))}
                      className="w-full bg-white border border-brand-border text-brand-black px-4 py-3 pr-12 rounded-xl focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all font-medium font-mono"
                      placeholder={cfg.placeholder}
                    />
                    <button
                      onClick={() => setShow(s => ({ ...s, [cfg.id]: !s[cfg.id] }))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-blue transition-colors focus:outline-none"
                    >
                      {show[cfg.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleSave(cfg)}
                  disabled={saving[cfg.id] || !keys[cfg.id]}
                  className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-red transition-colors shadow-lg shadow-brand-blue/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto justify-center h-[50px]"
                >
                  {saving[cfg.id] ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : saved[cfg.id] ? (
                    <><CheckCircle size={18} /> Saved!</>
                  ) : (
                    <><Save size={18} /> Save Key</>
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
