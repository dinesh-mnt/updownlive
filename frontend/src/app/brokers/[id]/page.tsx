import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import ArticleDetailPage from "@/components/Website/Shared/ArticleDetailPage";

export default function BrokersArticlePage({ params }: { params: { id: string } }) {
  return (
    <>
      <Header />
      <MarketTicker />
      <ArticleDetailPage
        sectionTitle="Brokers"
        backHref="/brokers"
        accentColor="text-brand-blue"
        storageKey={`brokers_${params.id}`}
      />
      <Footer />
    </>
  );
}
