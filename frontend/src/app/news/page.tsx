import NewsPage from '@/components/Website/News/News';
import Navbar from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";

export default function Page() {
  return(
    <>
    <Navbar />
    <MarketTicker />
    <NewsPage />
    <Footer />
    </>
  )
}
