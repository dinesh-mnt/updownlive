import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import ForexPage from '@/components/Website/Markets/Forex/Forex';
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return getSeoMetadata("forex");
}

export default function Page() {
  return(
    <>
      <Header />
      <MarketTicker />
      <ForexPage />
      <Footer />
    </>
  )
}
