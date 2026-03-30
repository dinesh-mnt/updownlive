import Navbar from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import StocksPage from "@/components/Website/Stocks/Stocks";

export const metadata = { title: "Stocks | UpDownLive" };

export default function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Navbar />
      <MarketTicker />
      <StocksPage />
      <Footer />
    </div>
  );
}
