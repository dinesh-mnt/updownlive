"use client";
import React from "react";
import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import BackToTop from "@/components/UI/BackToTop";

interface BrokerDetailPageProps {
  params: { id: string };
}

export default function BrokerDetailPage({ params }: BrokerDetailPageProps) {
  return (
    <>
      <Header />
      <MarketTicker />
      
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 p-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black dark:text-white mb-6">
              Broker Details - {params.id}
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-brand-gray dark:text-gray-300 mb-6">
                This is the detailed view for broker {params.id}. You can customize this component 
                to display specific broker information, reviews, features, and more.
              </p>
              
              <div className="bg-brand-light dark:bg-white/5 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold text-brand-black dark:text-white mb-4">
                  Broker Information
                </h2>
                <ul className="space-y-2 text-brand-gray dark:text-gray-300">
                  <li>• Regulation & Licensing</li>
                  <li>• Trading Platforms</li>
                  <li>• Account Types</li>
                  <li>• Spreads & Fees</li>
                  <li>• Customer Support</li>
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