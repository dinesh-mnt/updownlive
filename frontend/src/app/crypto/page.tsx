import Navbar from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import CryptoPage from '@/components/Website/Markets/Crypto/Crypto';
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return getSeoMetadata("crypto");
}

export default function Page() {
  return(
    <>
      <Navbar />
      <MarketTicker />
      <CryptoPage />
      <Footer />
    </>
  )
}
