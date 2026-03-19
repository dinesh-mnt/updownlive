import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import TopAd from "@/components/TopAd"
import EconomicCalendar from "@/components/Website/EconomicCalendar/EconomicCalendar";
import BackToTop from "@/components/UI/BackToTop";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return getSeoMetadata("economic-calendar");
}

export default function EconomicCalendarPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <TopAd />
      <Header />
      <MarketTicker />
      <EconomicCalendar />
      <Footer />
      <BackToTop />
    </div>
  );
}
