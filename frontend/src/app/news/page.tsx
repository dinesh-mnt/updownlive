import NewsPage from '@/components/Website/News/News';
import Navbar from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";

export default function Page() {
  return(
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
    <Navbar />
    <MarketTicker />
    <NewsPage />
    <Footer />
    </div>
  )
}
