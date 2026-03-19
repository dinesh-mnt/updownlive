import ForexDetailPage from "@/components/Website/Forex/ForexDetailPage";

export default function ForexArticlePage({ params }: { params: { id: string } }) {
  return <ForexDetailPage params={params} />;
}
