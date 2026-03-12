import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import ArticleDetailPage from "@/components/Website/Shared/ArticleDetailPage";

export default function ChartsArticlePage({ params }: { params: { id: string } }) {
  return (
    <>
      <Header />
      <MarketTicker />
      <ArticleDetailPage
        sectionTitle="Charts & Technical Analysis"
        backHref="/charts"
        accentColor="text-brand-blue"
        storageKey={`charts_${params.id}`}
      />
      <Footer />
    </>
  );
}
