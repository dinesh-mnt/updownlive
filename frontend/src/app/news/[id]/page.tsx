import Navbar from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import ArticleClient from "@/components/Website/News/ArticleClient";

export default function NewsDetailPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Navbar />
      <MarketTicker />
      <ArticleClient />
      <Footer />
    </div>
  );
}
