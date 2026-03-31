"use client";
import React from "react";
import TradingViewChart from "@/components/TradingViewChart";
import { Activity, ArrowRight, BarChart3, TrendingUp } from "lucide-react";
import Link from "next/link";

const POPULAR_SYMBOLS = [
  { symbol: "NASDAQ:AAPL", name: "Apple Inc.", category: "Tech" },
  { symbol: "NASDAQ:TSLA", name: "Tesla Inc.", category: "Auto" },
  { symbol: "NASDAQ:GOOGL", name: "Alphabet Inc.", category: "Tech" },
  { symbol: "NYSE:NVDA", name: "NVIDIA Corp.", category: "Tech" },
  { symbol: "BINANCE:BTCUSDT", name: "Bitcoin", category: "Crypto" },
  { symbol: "FX:EURUSD", name: "EUR/USD", category: "Forex" },
  { symbol: "COMEX:GC1!", name: "Gold Futures", category: "Commodity" },
  { symbol: "NASDAQ:QQQ", name: "NASDAQ 100", category: "Index" }
];

export default function MarketOverviewSection() {
  const [selectedSymbol, setSelectedSymbol] = React.useState(POPULAR_SYMBOLS[0]);

  return (
    <section className="py-12 md:py-20 lg:py-24 bg-brand-light dark:bg-zinc-950 border-b border-brand-border dark:border-white/5 relative overflow-hidden">
      {/* BG accents */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-blue/4 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 md:mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-semibold text-sm mb-4 md:mb-5">
              <Activity size={15} />
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
              </span>
              Live Data Focus
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-black dark:text-white tracking-tight mb-3 md:mb-4">
              Live <span className="text-brand-blue">Market</span> Overview
            </h2>
            <p className="text-base md:text-lg text-brand-gray dark:text-gray-400 leading-relaxed">
              Interactive charts powered by{" "}
              <span className="font-semibold text-brand-black dark:text-white">TradingView</span>. Monitor major indexes in real-time.
            </p>
          </div>
          <Link
            href="/charts"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-brand-blue text-brand-blue font-bold text-sm md:text-base hover:bg-brand-blue hover:text-white hover:shadow-lg hover:shadow-brand-blue/25 transition-all duration-200"
          >
            Full Charts <ArrowRight size={18} />
          </Link>
        </div>

        {/* Symbol Selector — scrollable on mobile */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="text-brand-blue" size={20} />
            <h3 className="text-base md:text-lg font-bold text-brand-black dark:text-white">Popular Markets</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {POPULAR_SYMBOLS.map((item) => (
              <button
                key={item.symbol}
                onClick={() => setSelectedSymbol(item)}
                className={`px-3 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  selectedSymbol.symbol === item.symbol
                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/25'
                    : 'bg-white dark:bg-white/5 border border-brand-border dark:border-white/10 text-brand-gray dark:text-gray-300 hover:border-brand-blue hover:text-brand-blue'
                }`}
              >
                {item.name}
                <span className="text-xs opacity-60 ml-1">({item.category})</span>
              </button>
            ))}
          </div>
        </div>

        {/* TradingView Widget Container */}
        <div className="w-full rounded-2xl shadow-2xl shadow-brand-black/10 dark:shadow-black/50 overflow-hidden border border-brand-border dark:border-white/10 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-brand-border dark:border-white/10 bg-white dark:bg-zinc-900">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-brand-red/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-sm font-semibold text-brand-gray dark:text-gray-400 ml-2">
              UpDownLive — {selectedSymbol.name} Chart
            </span>
            <span className="ml-auto flex items-center gap-1.5 text-xs font-bold text-green-600">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              LIVE
            </span>
          </div>
          <TradingViewChart 
            symbol={selectedSymbol.symbol}
            interval="D"
            height={typeof window !== 'undefined' && window.innerWidth < 768 ? 350 : 600}
            showToolbar={true}
            showLegend={true}
          />
        </div>

        {/* Quick market highlights */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Forex Pairs", count: "28+", color: "text-brand-blue", bg: "bg-brand-blue/8 dark:bg-blue-600/10", icon: TrendingUp },
            { label: "Crypto Assets", count: "50+", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-600/10", icon: Activity },
            { label: "Commodities", count: "15+", color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-600/10", icon: BarChart3 },
            { label: "Major Indices", count: "12+", color: "text-green-600", bg: "bg-green-50 dark:bg-green-600/10", icon: ArrowRight },
          ].map((item, i) => {
            const IconComponent = item.icon;
            return (
              <div
                key={i}
                className={`${item.bg} rounded-xl px-5 py-4 border border-white/80 flex flex-col gap-1 hover:shadow-md transition-shadow duration-200 group`}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-2xl font-extrabold ${item.color}`}>{item.count}</p>
                  <IconComponent className={`${item.color} group-hover:scale-110 transition-transform`} size={20} />
                </div>
                <p className="text-sm font-semibold text-brand-gray dark:text-gray-400">{item.label}</p>
              </div>
            );
          })}
        </div>

        {/* TradingView Attribution */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Charts powered by{" "}
            <a 
              href="https://www.tradingview.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-brand-blue hover:underline font-semibold"
            >
              TradingView
            </a>
            {" "}— Professional market analysis and real-time data
          </p>
        </div>
      </div>
    </section>
  );
}
