import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import Charts from "@/components/Website/Charts/Charts";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return getSeoMetadata("charts");
}

export default function ChartsPage() {
  return (
    <>
      <Header />
      <MarketTicker />
      <Charts />
      <Footer />
    </>
  );
}
