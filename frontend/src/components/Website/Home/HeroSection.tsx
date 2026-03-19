"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Zap,
  BarChart2,
} from "lucide-react";

const tickers = [
  { symbol: "EUR/USD", value: "1.0842", change: "+0.12%", up: true },
  { symbol: "BTC/USD", value: "68,420", change: "+2.34%", up: true },
  { symbol: "GOLD", value: "2,318", change: "-0.45%", up: false },
  { symbol: "S&P 500", value: "5,241", change: "+0.87%", up: true },
  { symbol: "OIL/WTI", value: "78.52", change: "-1.02%", up: false },
];

const chartBars = [35, 55, 40, 75, 48, 85, 62, 92, 70, 100, 80, 95];

export default function HeroSection() {
  const [animatedBars, setAnimatedBars] = useState(chartBars.map(() => 0));
  const [activeTicker, setActiveTicker] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedBars(chartBars);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTicker((prev) => (prev + 1) % tickers.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-brand-light via-white to-blue-50 dark:from-black dark:via-zinc-950 dark:to-brand-blue/10 py-24 border-b border-brand-border dark:border-white/10 transition-colors duration-300">
      {/* Background decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/6 dark:bg-brand-blue/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-red/5 dark:bg-brand-red/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-brand-blue/30 dark:bg-brand-blue/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
        {/* Left: Text Content */}
        <div className="flex-1 max-w-2xl">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 dark:bg-blue-500/10 border border-blue-600/20 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-8 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 dark:bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600 dark:bg-blue-400"></span>
            </span>
            Live Market Data — Updated in Real-Time
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-none tracking-tighter mb-7">
            Global Market
            <br />
            <span className="text-gray-900 dark:text-white">Insights</span>
            <br />
            <span className="text-blue-600 dark:text-brand-blue relative inline-block">
              In Real-Time
              <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-linear-to-r from-red-600 to-red-600/30 rounded-full" />
            </span>
          </h1>

          <p className="text-xl text-gray-700 dark:text-zinc-300 leading-relaxed mb-10 max-w-lg">
            Stay ahead of the curve.{" "}
            <span className="font-semibold text-gray-900 dark:text-white">UpDownLive</span>{" "}
            brings you real-time market data, the latest financial news, and
            expert analysis in one place.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-base shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-blue-600/50 transition-all duration-200"
            >
              Read Latest News <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white font-bold text-base hover:border-blue-600 dark:hover:border-brand-blue hover:text-blue-600 dark:hover:text-brand-blue hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
            >
              Get In Touch
            </Link>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap items-center gap-6 text-gray-700 dark:text-zinc-300 text-sm font-semibold">
            <div className="flex items-center gap-2.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur px-4 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 shadow-sm">
              <Activity size={20} className="text-blue-600 dark:text-brand-blue" />
              <span>Real-time Data</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur px-4 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 shadow-sm">
              <Globe size={20} className="text-blue-600 dark:text-brand-blue" />
              <span>Global Coverage</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur px-4 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 shadow-sm">
              <Zap size={20} className="text-red-600" />
              <span>Instant Alerts</span>
            </div>
          </div>
        </div>

        {/* Right: Market Card */}
        <div className="flex-1 w-full max-w-md flex flex-col gap-5 relative">
          {/* Main NASDAQ card */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/80 dark:border-zinc-700/50 rounded-2xl p-7 w-full shadow-2xl shadow-blue-600/10 hover:shadow-blue-600/20 transition-all duration-500 group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-bold text-blue-600 dark:text-brand-blue uppercase tracking-widest mb-1">
                  NASDAQ
                </p>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  Market Forecast
                </h3>
                <p className="text-gray-700 dark:text-zinc-400 text-sm">Technology Sector</p>
              </div>
              <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 p-2.5 rounded-xl">
                <TrendingUp size={22} className="text-green-600" />
              </div>
            </div>

            <p className="text-green-600 font-extrabold text-5xl mb-1 tracking-tight">
              +1.45%
            </p>
            <p className="text-gray-700 dark:text-zinc-400 text-sm mb-6 font-medium">
              Today's Performance
            </p>

            {/* Animated Chart */}
            <div className="h-28 w-full flex items-end justify-between gap-1.5 relative">
              {animatedBars.map((height, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col justify-end"
                  style={{ height: "100%" }}
                >
                  <div
                    className="w-full rounded-t-md bg-linear-to-t from-blue-600 to-blue-600/30 dark:from-blue-500 dark:to-blue-500/30 transition-all duration-700 ease-out"
                    style={{
                      height: `${height}%`,
                      transitionDelay: `${i * 50}ms`,
                      opacity: 0.7 + i * 0.025,
                    }}
                  />
                </div>
              ))}
              {/* Trend line overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-600/20 via-blue-600/60 to-blue-600/20 dark:from-blue-400/20 dark:via-blue-400/60 dark:to-blue-400/20 rounded-full" />
            </div>

            <div className="mt-5 pt-4 border-t border-gray-300 dark:border-zinc-700 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-700 dark:text-zinc-400 font-medium">NYSE: AAPL</p>
                <p className="text-red-600 font-bold flex items-center gap-1 mt-0.5">
                  <TrendingDown size={14} /> -0.23%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-700 dark:text-zinc-400 font-medium text-right">
                  NASDAQ: MSFT
                </p>
                <p className="text-green-600 font-bold flex items-center gap-1 justify-end mt-0.5">
                  <TrendingUp size={14} /> +1.87%
                </p>
              </div>
            </div>
          </div>

          {/* Live ticker strip */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/80 dark:border-zinc-700/50 rounded-2xl p-5 shadow-lg shadow-blue-600/6 overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <BarChart2 size={18} className="text-blue-600 dark:text-brand-blue" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                Live Tickers
              </span>
              <span className="ml-auto text-xs text-gray-700 dark:text-zinc-400 font-medium">
                Auto-updating
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tickers.map((ticker, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    i === activeTicker
                      ? "bg-blue-600/10 dark:bg-blue-500/10 border border-blue-600/30 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 scale-105"
                      : "bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300"
                  }`}
                >
                  <span className="font-bold">{ticker.symbol}</span>
                  <span>{ticker.value}</span>
                  <span
                    className={ticker.up ? "text-green-600" : "text-red-600"}
                  >
                    {ticker.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative blobs */}
          <div className="absolute -z-10 -bottom-8 -left-8 w-32 h-32 bg-red-600 rounded-2xl opacity-10 blur-2xl dark:opacity-20" />
          <div className="absolute -z-10 -top-8 -right-8 w-40 h-40 bg-blue-600 rounded-full opacity-10 blur-2xl dark:opacity-20" />
        </div>
      </div>
    </section>
  );
}
