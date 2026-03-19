import Navbar from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import CryptoPage from '@/components/Website/Crypto/Crypto';
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return getSeoMetadata("crypto");
}

export default function Page() {
  return(
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Navbar />
      <MarketTicker />
      <CryptoPage />
      <Footer />
    </div>
  )
}
