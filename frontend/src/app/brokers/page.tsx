import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import Brokers from "@/components/Website/Brokers/Brokers";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return getSeoMetadata("brokers");
}

export default function BrokersPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Header />
      <MarketTicker />
      <Brokers />
      <Footer />
    </div>
  );
}
