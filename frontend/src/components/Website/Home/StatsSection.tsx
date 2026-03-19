"use client";
import React from "react";
import { Activity, Globe, Newspaper, Shield, TrendingUp, Users } from "lucide-react";

const stats = [
  {
    icon: <Activity size={28} className="text-[#0642f0]" />,
    value: "Real-Time",
    label: "Market Data",
    description: "Live prices updated every second",
    bg: "bg-[#0642f0]/8 dark:bg-blue-600/10",
    border: "border-[#0642f0]/15 dark:border-white/10",
  },
  {
    icon: <Globe size={28} className="text-[#0642f0]" />,
    value: "150+",
    label: "Markets Covered",
    description: "Forex, Stocks, Crypto & Commodities",
    bg: "bg-[#0642f0]/8 dark:bg-blue-600/10",
    border: "border-[#0642f0]/15 dark:border-white/10",
  },
  {
    icon: <Newspaper size={28} className="text-[#c63634]" />,
    value: "1,000+",
    label: "News Daily",
    description: "Curated global financial news",
    bg: "bg-[#c63634]/8 dark:bg-red-600/10",
    border: "border-[#c63634]/15 dark:border-white/10",
  },
  {
    icon: <TrendingUp size={28} className="text-green-600" />,
    value: "Advanced",
    label: "Chart Tools",
    description: "TradingView powered analytics",
    bg: "bg-green-50 dark:bg-green-600/10",
    border: "border-green-200 dark:border-white/10",
  },
  {
    icon: <Shield size={28} className="text-purple-600" />,
    value: "Verified",
    label: "Broker Reviews",
    description: "Expert-rated broker analysis",
    bg: "bg-purple-50 dark:bg-purple-600/10",
    border: "border-purple-200 dark:border-white/10",
  },
  {
    icon: <Users size={28} className="text-orange-500" />,
    value: "50K+",
    label: "Active Traders",
    description: "Growing trusted community",
    bg: "bg-orange-50 dark:bg-orange-600/10",
    border: "border-orange-200 dark:border-white/10",
  },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-white dark:bg-black border-b border-[#eaeaea] dark:border-white/5 relative overflow-hidden">
      {/* subtle bg pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(6,66,240,0.04),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(198,54,52,0.04),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0642f0]/10 border border-[#0642f0]/20 text-[#0642f0] font-semibold text-sm mb-5">
            <Shield size={15} /> Why UpDownLive?
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] dark:text-white tracking-tight mb-4">
            Everything You Need to
            <span className="text-[#0642f0]"> Trade Smarter</span>
          </h2>
          <p className="text-lg text-[#333333] dark:text-gray-400 max-w-2xl mx-auto">
            One platform. All the tools, data, and news you need to make informed financial decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`group relative p-7 rounded-2xl border ${stat.border} ${stat.bg} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default`}
            >
              {/* Decorative corner */}
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/80 dark:bg-white/10 shadow-sm border border-white/60 dark:border-white/10 backdrop-blur">
                  {stat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-extrabold text-[#111111] dark:text-white tracking-tight leading-none mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm font-bold text-[#111111] dark:text-white mb-1">{stat.label}</p>
                  <p className="text-sm text-[#333333] dark:text-gray-400 leading-relaxed">{stat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
