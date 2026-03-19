"use client";
import React from "react";
import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import BackToTop from "@/components/UI/BackToTop";

interface CryptoDetailPageProps {
  params: { id: string };
}

export default function CryptoDetailPage({ params }: CryptoDetailPageProps) {
  return (
    <>
      <Header />
      <MarketTicker />
      
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 p-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black dark:text-white mb-6">
              <span className="text-purple-500">Cryptocurrency</span> Analysis - {params.id}
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-brand-gray dark:text-gray-300 mb-6">
                This is the detailed view for cryptocurrency analysis {params.id}. You can customize this component 
                to display specific crypto analysis, market trends, and blockchain insights.
              </p>
              
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-6 mb-6 border border-purple-200 dark:border-purple-800">
                <h2 className="text-xl font-bold text-brand-black dark:text-white mb-4">
                  Crypto Market Analysis
                </h2>
                <ul className="space-y-2 text-brand-gray dark:text-gray-300">
                  <li>• Price Analysis & Trends</li>
                  <li>• Market Capitalization</li>
                  <li>• Blockchain Technology</li>
                  <li>• DeFi & NFT Insights</li>
                  <li>• Investment Strategies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <BackToTop />
    </>
  );
}