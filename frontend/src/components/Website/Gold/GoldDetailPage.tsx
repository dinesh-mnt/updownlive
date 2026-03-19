"use client";
import React from "react";
import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import BackToTop from "@/components/UI/BackToTop";

interface GoldDetailPageProps {
  params: { id: string };
}

export default function GoldDetailPage({ params }: GoldDetailPageProps) {
  return (
    <>
      <Header />
      <MarketTicker />
      
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 p-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black dark:text-white mb-6">
              <span className="text-yellow-500">Gold & Precious Metals</span> Analysis - {params.id}
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-brand-gray dark:text-gray-300 mb-6">
                This is the detailed view for gold analysis {params.id}. You can customize this component 
                to display specific gold market analysis, price trends, and precious metals insights.
              </p>
              
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-6 mb-6 border border-yellow-200 dark:border-yellow-800">
                <h2 className="text-xl font-bold text-brand-black dark:text-white mb-4">
                  Gold Market Analysis
                </h2>
                <ul className="space-y-2 text-brand-gray dark:text-gray-300">
                  <li>• Current Gold Prices</li>
                  <li>• Market Trends & Forecasts</li>
                  <li>• Economic Factors</li>
                  <li>• Technical Analysis</li>
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