import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import GoldDetailClient from "@/components/Website/Gold/GoldDetailClient";

export default async function GoldArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <MarketTicker />
      <GoldDetailClient id={id} />
      <Footer />
    </div>
  );
}
