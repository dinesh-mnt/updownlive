import ChartsDetailPage from "@/components/Website/Charts/ChartsDetailPage";

export default function ChartsArticlePage({ params }: { params: { id: string } }) {
  return <ChartsDetailPage params={params} />;
}
