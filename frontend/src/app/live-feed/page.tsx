import React from "react";
import Navbar from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import LiveFeed from "@/components/Website/LiveFeed/LiveFeed";

export default function LiveFeedPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black font-outfit transition-colors duration-300">
      <Navbar />
      <MarketTicker />
      <LiveFeed />
      <Footer />
    </div>
  );
}