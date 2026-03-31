import Navbar from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import ArticleClient from "@/components/Website/News/ArticleClient";

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Navbar />
      <MarketTicker />
      <ArticleClient id={id} />
      <Footer />
    </div>
  );
}
