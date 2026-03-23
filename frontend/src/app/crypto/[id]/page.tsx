import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import CryptoDetailClient from "@/components/Website/Crypto/CryptoDetailClient";

export default async function CryptoArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <MarketTicker />
      <CryptoDetailClient id={id} />
      <Footer />
    </div>
  );
}
