"use client";
import React, { useState, useEffect, memo } from "react";
import { TrendingUp, DollarSign, Coins, BarChart3, LineChart, Activity, Bitcoin, ArrowRight } from "lucide-react";
import TradingViewChart from "@/components/TradingViewChart";

interface ChartType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  symbol: string;
  color: string;
}

const chartTypes: ChartType[] = [
  {
    id: "realtime",
    title: "Real-Time Charts",
    description: "Live updating charts that show price movement instantly. Used in trading platforms like TradingView.",
    icon: <Activity size={24} />,
    symbol: "NASDAQ:AAPL",
    color: "blue",
  },
  {
    id: "forex",
    title: "Currency Chart (Forex)",
    description: "Shows exchange rates like USD/INR, EUR/USD. Used for forex trading & analysis.",
    icon: <DollarSign size={24} />,
    symbol: "FX:EURUSD",
    color: "green",
  },
  {
    id: "futures",
    title: "Futures Chart",
    description: "Tracks future contracts like Gold Futures, Crude Oil Futures.",
    icon: <TrendingUp size={24} />,
    symbol: "COMEX:GC1!",
    color: "yellow",
  },
  {
    id: "stocks",
    title: "Stocks Chart",
    description: "Shows company stock prices like Apple (AAPL), Tesla (TSLA).",
    icon: <LineChart size={24} />,
    symbol: "NASDAQ:TSLA",
    color: "purple",
  },
  {
    id: "indices",
    title: "Indices Chart",
    description: "Tracks market indices like Nifty 50, S&P 500.",
    icon: <BarChart3 size={24} />,
    symbol: "SP:SPX",
    color: "red",
  },
  {
    id: "crypto",
    title: "Cryptocurrency Chart",
    description: "Shows crypto prices like Bitcoin (BTC), Ethereum (ETH).",
    icon: <Bitcoin size={24} />,
    symbol: "BINANCE:BTCUSDT",
    color: "orange",
  },
];

// Per-category symbol options
const symbolOptions: Record<string, { symbol: string; name: string }[]> = {
  realtime: [
    { symbol: "NASDAQ:AAPL", name: "Apple" },
    { symbol: "NASDAQ:MSFT", name: "Microsoft" },
    { symbol: "NYSE:NVDA", name: "NVIDIA" },
    { symbol: "NASDAQ:AMZN", name: "Amazon" },
  ],
  forex: [
    { symbol: "FX:EURUSD", name: "EUR/USD" },
    { symbol: "FX:GBPUSD", name: "GBP/USD" },
    { symbol: "FX:USDJPY", name: "USD/JPY" },
    { symbol: "FX:AUDUSD", name: "AUD/USD" },
  ],
  futures: [
    { symbol: "COMEX:GC1!", name: "Gold" },
    { symbol: "NYMEX:CL1!", name: "Crude Oil" },
    { symbol: "CBOT:ZW1!", name: "Wheat" },
    { symbol: "NYMEX:NG1!", name: "Nat. Gas" },
  ],
  stocks: [
    { symbol: "NASDAQ:TSLA", name: "Tesla" },
    { symbol: "NASDAQ:GOOGL", name: "Alphabet" },
    { symbol: "NYSE:JPM", name: "JPMorgan" },
    { symbol: "NYSE:BAC", name: "Bank of America" },
  ],
  indices: [
    { symbol: "SP:SPX", name: "S&P 500" },
    { symbol: "NASDAQ:QQQ", name: "NASDAQ 100" },
    { symbol: "TVC:DJI", name: "Dow Jones" },
    { symbol: "NSE:NIFTY50", name: "Nifty 50" },
  ],
  crypto: [
    { symbol: "BINANCE:BTCUSDT", name: "Bitcoin" },
    { symbol: "BINANCE:ETHUSDT", name: "Ethereum" },
    { symbol: "BINANCE:SOLUSDT", name: "Solana" },
    { symbol: "BINANCE:BNBUSDT", name: "BNB" },
  ],
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-500/10",   text: "text-blue-600 dark:text-blue-400",   border: "border-blue-200 dark:border-blue-500/20" },
  green:  { bg: "bg-green-50 dark:bg-green-500/10",  text: "text-green-600 dark:text-green-400",  border: "border-green-200 dark:border-green-500/20" },
  yellow: { bg: "bg-yellow-50 dark:bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-500/20" },
  purple: { bg: "bg-purple-50 dark:bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-500/20" },
  red:    { bg: "bg-red-50 dark:bg-red-500/10",    text: "text-red-600 dark:text-red-400",    border: "border-red-200 dark:border-red-500/20" },
  orange: { bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-500/20" },
};

export default function Charts() {
  const [selectedChart, setSelectedChart] = useState<ChartType>(chartTypes[0]);
  const [selectedSymbol, setSelectedSymbol] = useState(symbolOptions[chartTypes[0].id][0]);

  // When chart category changes, reset symbol to first option
  const handleChartChange = (chart: ChartType) => {
    setSelectedChart(chart);
    setSelectedSymbol(symbolOptions[chart.id][0]);
  };

  const colors = colorMap[selectedChart.color];
  const symbols = symbolOptions[selectedChart.id];

  return (
    <div className="bg-white dark:bg-black min-h-screen font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-brand-black dark:text-white mb-3 tracking-tight">
            Charts & Technical Analysis
          </h1>
          <p className="text-brand-gray dark:text-gray-400 text-lg">
            Real-time market data and interactive charts powered by TradingView
          </p>
        </div>

        {/* Chart Category Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {chartTypes.map((chart) => {
            const c = colorMap[chart.color];
            const isSelected = selectedChart.id === chart.id;
            return (
              <button
                key={chart.id}
                onClick={() => handleChartChange(chart)}
                className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                  isSelected
                    ? `${c.border} ${c.bg} shadow-lg scale-[1.02]`
                    : "border-gray-200 dark:border-white/10 hover:border-brand-blue/30 dark:hover:border-brand-blue/30 bg-white dark:bg-zinc-900"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center shrink-0 ${c.text}`}>
                    {chart.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-base mb-1 ${isSelected ? c.text : "text-brand-black dark:text-white"}`}>
                      {chart.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {chart.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Chart Viewer */}
        <div className="w-full rounded-2xl shadow-2xl shadow-brand-black/10 dark:shadow-black/50 overflow-hidden border border-brand-border dark:border-white/10 bg-white dark:bg-zinc-900">

          {/* Symbol Selector Bar */}
          <div className={`px-6 py-4 border-b border-brand-border dark:border-white/10 ${colors.bg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text}`}>
                  {selectedChart.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
                  <p className={`text-sm font-bold ${colors.text}`}>{selectedChart.title}</p>
                </div>
              </div>
              <div className="sm:ml-auto flex flex-wrap gap-2">
                {symbols.map((item) => (
                  <button
                    key={item.symbol}
                    onClick={() => setSelectedSymbol(item)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      selectedSymbol.symbol === item.symbol
                        ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/25"
                        : "bg-white dark:bg-white/5 border border-brand-border dark:border-white/10 text-brand-gray dark:text-gray-300 hover:border-brand-blue hover:text-brand-blue"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Browser Chrome Bar */}
          <div className="flex items-center gap-3 px-6 py-3 border-b border-brand-border dark:border-white/10 bg-white dark:bg-zinc-900">
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

          {/* TradingView Chart */}
          <TradingViewChart
            symbol={selectedSymbol.symbol}
            interval="D"
            height={600}
            showToolbar={true}
            showLegend={true}
          />

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-zinc-800/50 border-t border-brand-border dark:border-white/10">
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Symbol:</span>
                <span className="ml-2 font-semibold text-brand-black dark:text-white">{selectedSymbol.symbol}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Interval:</span>
                <span className="ml-2 font-semibold text-brand-black dark:text-white">Daily (1D)</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Data Source:</span>
                <span className="ml-2 font-semibold text-brand-black dark:text-white">TradingView</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-brand-black dark:text-white mb-3">📊 About These Charts</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              All charts are powered by TradingView, providing real-time market data with professional-grade technical
              analysis tools. Zoom, pan, and interact with the charts to analyze price movements and trends.
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-brand-black dark:text-white mb-3">💡 How to Use</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Pick a chart category, then select a specific symbol from the bar above the chart. Each chart includes
              candlestick patterns, volume data, and technical indicators for detailed analysis.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
