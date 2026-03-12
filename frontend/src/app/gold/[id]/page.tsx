import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import ArticleDetailPage from "@/components/Website/Shared/ArticleDetailPage";

export default function GoldArticlePage({ params }: { params: { id: string } }) {
  return (
    <>
      <Header />
      <MarketTicker />
      <ArticleDetailPage
        sectionTitle="Gold & Precious Metals"
        backHref="/gold"
        accentColor="text-yellow-500"
        storageKey={`gold_${params.id}`}
      />
      <Footer />
    </>
  );
}
