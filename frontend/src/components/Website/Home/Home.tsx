import React from "react";
import HeroSection from "./HeroSection";
import StatsSection from "./StatsSection";
import MarketOverviewSection from "./MarketOverviewSection";
import LatestNewsSection from "./LatestNewsSection";
import CTASection from "./CTASection";

interface HomeProps {
  news?: any[];
}

export default function Home({ news }: HomeProps) {
  return (
    <div className="w-full min-h-screen">
      {/* 1. Hero — headline, CTA, live market card & tickers */}
      <HeroSection />

      {/* 2. Stats / Features — platform highlights */}
      <StatsSection />

      {/* 3. Market Overview — TradingView live chart widget */}
      <MarketOverviewSection />

      {/* 4. Latest News — featured + compact list */}
      <LatestNewsSection />

      {/* 5. CTA Banner — drive engagement */}
      {/* <CTASection /> */}
    </div>
  );
}
