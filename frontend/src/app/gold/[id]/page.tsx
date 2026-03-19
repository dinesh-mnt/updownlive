import GoldDetailPage from "@/components/Website/Gold/GoldDetailPage";

export default function GoldArticlePage({ params }: { params: { id: string } }) {
  return <GoldDetailPage params={params} />;
}
