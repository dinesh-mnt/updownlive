import Navbar from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import StockDetailPage from "@/components/Website/Stocks/StockDetailPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      <MarketTicker />
      <StockDetailPage id={id} />
      <Footer />
    </div>
  );
}
