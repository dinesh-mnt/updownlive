import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import EconomicCalendar from "@/components/Website/EconomicCalendar/EconomicCalendar";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return getSeoMetadata("economic-calendar");
}

export default function EconomicCalendarPage() {
  return (
    <>
      <Header />
      <MarketTicker />
      <EconomicCalendar />
      <Footer />
    </>
  );
}
