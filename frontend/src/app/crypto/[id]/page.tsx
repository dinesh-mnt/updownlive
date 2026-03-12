import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import ArticleDetailPage from "@/components/Website/Shared/ArticleDetailPage";

export default function CryptoArticlePage({ params }: { params: { id: string } }) {
  return (
    <>
      <Header />
      <MarketTicker />
      <ArticleDetailPage
        sectionTitle="Cryptocurrency"
        backHref="/crypto"
        accentColor="text-purple-500"
        storageKey={`crypto_${params.id}`}
      />
      <Footer />
    </>
  );
}
