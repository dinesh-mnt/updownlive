import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import ForexDetailClient from "@/components/Website/Forex/ForexDetailClient";

export default async function ForexArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <MarketTicker />
      <ForexDetailClient id={id} />
      <Footer />
    </div>
  );
}
