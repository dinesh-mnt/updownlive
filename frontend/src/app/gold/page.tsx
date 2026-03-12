import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import Gold from "@/components/Website/Gold/Gold";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return getSeoMetadata("gold");
}

export default function GoldPage() {
  return (
    <>
      <Header />
      <MarketTicker />
      <Gold />
      <Footer />
    </>
  );
}
