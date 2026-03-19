"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { Clock, Calendar, TrendingUp, Coins, Activity, BarChart2 } from "lucide-react";
import { useTheme } from "next-themes";

// ==========================================
// TradingView Widget Components
// ==========================================

const EconomicCalendarWidget = memo(({ theme }: { theme: string }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: theme === "dark" ? "dark" : "light",
      isTransparent: true,
      width: "100%",
      height: "600",
      locale: "en",
      importanceFilter: "-1,0,1",
      currencyFilter: "USD,EUR,ITL,NZD,CHF,AUD,FRF,JPY,ZAR,TRL,CAD,BAM,DEM,MXN,ESP,GBP"
    });
    container.current.appendChild(script);
  }, [theme]);

  return <div className="tradingview-widget-container" ref={container} style={{ height: "600px", width: "100%" }}></div>;
});
EconomicCalendarWidget.displayName = "EconomicCalendarWidget";

const ForexCrossRatesWidget = memo(({ theme }: { theme: string }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "400",
      currencies: [
        "EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD", "CNY"
      ],
      isTransparent: true,
      colorTheme: theme === "dark" ? "dark" : "light",
      locale: "en"
    });
    container.current.appendChild(script);
  }, [theme]);

  return <div className="tradingview-widget-container" ref={container} style={{ height: "400px", width: "100%" }}></div>;
});
ForexCrossRatesWidget.displayName = "ForexCrossRatesWidget";

const GoldOverviewWidget = memo(({ theme }: { theme: string }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        ["GOLD", "OANDA:XAUUSD|1D"],
        ["SILVER", "OANDA:XAGUSD|1D"],
        ["PLATINUM", "TVC:PLATINUM|1D"]
      ],
      chartOnly: false,
      width: "100%",
      height: "400",
      locale: "en",
      colorTheme: theme === "dark" ? "dark" : "light",
      autosize: false,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: "right",
      scaleMode: "Normal",
      fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      maLineColor: "#2962FF",
      maLineWidth: 1,
      maLength: 9,
      backgroundColor: "rgba(0, 0, 0, 0)",
      isTransparent: true
    });
    container.current.appendChild(script);
  }, [theme]);

  return <div className="tradingview-widget-container" ref={container} style={{ height: "400px", width: "100%" }}></div>;
});
GoldOverviewWidget.displayName = "GoldOverviewWidget";

const CryptoScreenerWidget = memo(({ theme }: { theme: string }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "600",
      defaultColumn: "overview",
      screener_type: "crypto_mkt",
      displayCurrency: "USD",
      colorTheme: theme === "dark" ? "dark" : "light",
      locale: "en",
      isTransparent: true
    });
    container.current.appendChild(script);
  }, [theme]);

  return <div className="tradingview-widget-container" ref={container} style={{ height: "600px", width: "100%" }}></div>;
});
CryptoScreenerWidget.displayName = "CryptoScreenerWidget";

const AdvancedChartWidget = memo(({ theme }: { theme: string }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "NASDAQ:AAPL",
      interval: "D",
      timezone: "Etc/UTC",
      theme: theme === "dark" ? "dark" : "light",
      style: "1",
      locale: "en",
      enable_publishing: false,
      backgroundColor: "rgba(0, 0, 0, 0)",
      gridColor: theme === "dark" ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      container_id: "tradingview_advanced_chart",
      support_host: "https://www.tradingview.com"
    });
    container.current.appendChild(script);
  }, [theme]);

  return <div className="tradingview-widget-container" ref={container} style={{ height: "600px", width: "100%" }}></div>;
});
AdvancedChartWidget.displayName = "AdvancedChartWidget";

// ==========================================
// Main Dashboard Component
// ==========================================

export default function LiveFeed() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by waiting for mount to inject proper theme
  const safeTheme = mounted ? (resolvedTheme || "light") : "light";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 font-outfit min-h-screen relative z-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 space-y-4 md:space-y-0 relative z-10 border-b border-brand-border dark:border-white/10 pb-8">
        <div>
           <h1 className="text-4xl md:text-5xl font-extrabold text-brand-black dark:text-white tracking-tight">
             Live Feeds
           </h1>
           <p className="text-brand-gray dark:text-gray-400 mt-3 text-lg">Powered by TradingView API Connections</p>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-brand-gray dark:text-gray-400 bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/10 px-5 py-2.5 rounded-xl shadow-sm">
           <Clock size={16} className="text-brand-blue" />
           <span>Live Data Sync <span className="text-green-500 font-bold ml-1 animate-pulse">● Active</span></span>
        </div>
      </div>

      {/* Stacked Layout Sections */}
      <div className="space-y-24">
        
        {/* Section 1: Economic Calendar */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <Calendar size={24} className="text-brand-blue" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-black dark:text-white">Global Economic Calendar</h2>
              <p className="text-brand-gray dark:text-gray-400 text-sm mt-1">Real-time macro-economic events and data reports.</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#131722] border border-brand-border dark:border-white/10 rounded-2xl overflow-hidden shadow-xl p-1">
            <EconomicCalendarWidget theme={safeTheme} />
          </div>
        </section>

        {/* Section 2: Forex Market */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-black dark:text-white">Forex Market Rates</h2>
              <p className="text-brand-gray dark:text-gray-400 text-sm mt-1">Live bid/ask quotes and spreads for major currency pairs.</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#131722] border border-brand-border dark:border-white/10 rounded-2xl overflow-hidden shadow-xl p-1">
            <ForexCrossRatesWidget theme={safeTheme} />
          </div>
        </section>

        {/* Section 3: Gold & Precious Metals */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center">
              <span className="text-2xl">🪙</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-black dark:text-white">Gold & Precious Metals</h2>
              <p className="text-brand-gray dark:text-gray-400 text-sm mt-1">Track comprehensive overviews for XAU/USD, Silver, and Platinum.</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#131722] border border-brand-border dark:border-white/10 rounded-2xl overflow-hidden shadow-xl p-1">
            <GoldOverviewWidget theme={safeTheme} />
          </div>
        </section>

        {/* Section 4: Crypto Screener */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <Coins size={24} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-black dark:text-white">Crypto Market Screener</h2>
              <p className="text-brand-gray dark:text-gray-400 text-sm mt-1">Real-time updates for Bitcoin, Ethereum, and the broader altcoin market.</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#131722] border border-brand-border dark:border-white/10 rounded-2xl overflow-hidden shadow-xl p-1">
            <CryptoScreenerWidget theme={safeTheme} />
          </div>
        </section>

        {/* Section 5: Advanced Charts */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
              <BarChart2 size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-black dark:text-white">Advanced Technical Charts</h2>
              <p className="text-brand-gray dark:text-gray-400 text-sm mt-1">Interactive candlestick charts powered by TradingView.</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#131722] border border-brand-border dark:border-white/10 rounded-2xl overflow-hidden shadow-xl p-1">
            <AdvancedChartWidget theme={safeTheme} />
          </div>
        </section>

      </div>

      {/* Background Decorative Blob */}
      <div className="fixed top-1/4 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

    </div>
  );
}
