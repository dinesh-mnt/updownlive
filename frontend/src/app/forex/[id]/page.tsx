import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import ArticleDetailPage from "@/components/Website/Shared/ArticleDetailPage";

export default function ForexArticlePage({ params }: { params: { id: string } }) {
  return (
    <>
      <Header />
      <MarketTicker />
      <ArticleDetailPage
        sectionTitle="Forex"
        backHref="/forex"
        accentColor="text-brand-blue"
        storageKey={`forex_${params.id}`}
      />
      <Footer />
    </>
  );
}
