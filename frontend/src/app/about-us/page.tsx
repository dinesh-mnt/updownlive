import React from "react";
import Navbar from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Navbar />
      <MarketTicker />
      
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#111] dark:text-white mb-6">
            About <span className="text-brand-blue">UpDownLive</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your premier destination for real-time global market data, financial news, and trading insights.
          </p>
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            UpDownLive is a comprehensive financial platform that provides traders, investors, and market enthusiasts 
            with real-time market data, breaking news, and in-depth analysis across multiple asset classes including 
            forex, cryptocurrencies, commodities, and traditional markets.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            To democratize access to financial information and empower individuals to make informed trading and 
            investment decisions through cutting-edge technology and comprehensive market coverage.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6">What We Offer</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3">
            <li>Real-time market data and price feeds</li>
            <li>Breaking financial news and market analysis</li>
            <li>Comprehensive broker reviews and comparisons</li>
            <li>Economic calendar and event tracking</li>
            <li>Interactive charts and technical analysis tools</li>
            <li>Educational resources for traders of all levels</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}