"use client";
import React from "react";
import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import BackToTop from "@/components/UI/BackToTop";

interface ChartsDetailPageProps {
  params: { id: string };
}

export default function ChartsDetailPage({ params }: ChartsDetailPageProps) {
  return (
    <>
      <Header />
      <MarketTicker />
      
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 p-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black dark:text-white mb-6">
              <span className="text-brand-blue">Charts & Technical Analysis</span> - {params.id}
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-brand-gray dark:text-gray-300 mb-6">
                This is the detailed view for charts and technical analysis {params.id}. You can customize this component 
                to display specific chart patterns, technical indicators, and trading analysis.
              </p>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 mb-6 border border-green-200 dark:border-green-800">
                <h2 className="text-xl font-bold text-brand-black dark:text-white mb-4">
                  Technical Analysis
                </h2>
                <ul className="space-y-2 text-brand-gray dark:text-gray-300">
                  <li>• Chart Patterns</li>
                  <li>• Technical Indicators</li>
                  <li>• Support & Resistance</li>
                  <li>• Trend Analysis</li>
                  <li>• Trading Signals</li>
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