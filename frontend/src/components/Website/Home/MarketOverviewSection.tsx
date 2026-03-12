"use client";
import React, { useState } from "react";
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
  const [selectedSymbol, setSelectedSymbol] = useState(POPULAR_SYMBOLS[0]);

  return (
    <section className="py-24 bg-brand-light border-b border-brand-border relative overflow-hidden">
      {/* BG accents */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-blue/4 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-semibold text-sm mb-5">
              <Activity size={15} />
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
              </span>
              Live Data Focus
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black tracking-tight mb-4">
              Live{" "}
              <span className="text-brand-blue">Market</span> Overview
            </h2>
            <p className="text-lg text-brand-gray leading-relaxed">
              Interactive, dynamic charts powered by{" "}
              <span className="font-semibold text-brand-black">TradingView</span>. Monitor major
              indexes and track your favorite global assets in real-time.
            </p>
          </div>
          <Link
            href="/charts"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-blue text-brand-blue font-bold text-base hover:bg-brand-blue hover:text-white hover:shadow-lg hover:shadow-brand-blue/25 transition-all duration-200"
          >
            Full Charts <ArrowRight size={18} />
          </Link>
        </div>

        {/* Symbol Selector */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="text-brand-blue" size={20} />
            <h3 className="text-lg font-bold text-brand-black">Popular Markets</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SYMBOLS.map((item) => (
              <button
                key={item.symbol}
                onClick={() => setSelectedSymbol(item)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedSymbol.symbol === item.symbol
                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/25'
                    : 'bg-white border border-brand-border text-brand-gray hover:border-brand-blue hover:text-brand-blue'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{item.name}</span>
                  <span className="text-xs opacity-75">({item.category})</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* TradingView Widget Container */}
        <div className="w-full rounded-2xl shadow-2xl shadow-brand-black/10 overflow-hidden border border-brand-border bg-white">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-brand-border bg-white">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-brand-red/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-sm font-semibold text-brand-gray ml-2">
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
            theme="light"
            height={600}
            showToolbar={true}
            showLegend={true}
          />
        </div>

        {/* Quick market highlights */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Forex Pairs", count: "28+", color: "text-brand-blue", bg: "bg-brand-blue/8", icon: TrendingUp },
            { label: "Crypto Assets", count: "50+", color: "text-purple-600", bg: "bg-purple-50", icon: Activity },
            { label: "Commodities", count: "15+", color: "text-yellow-600", bg: "bg-yellow-50", icon: BarChart3 },
            { label: "Major Indices", count: "12+", color: "text-green-600", bg: "bg-green-50", icon: ArrowRight },
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
                <p className="text-sm font-semibold text-brand-gray">{item.label}</p>
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
