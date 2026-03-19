import React from "react";
import Navbar from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import Contact from "@/components/Website/Contact/Contact";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <MarketTicker />
      <Contact />
      <Footer />
    </div>
  );
}