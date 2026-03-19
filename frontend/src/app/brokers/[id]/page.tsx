import BrokerDetailPage from "@/components/Website/Brokers/BrokerDetailPage";

export default function BrokersArticlePage({ params }: { params: { id: string } }) {
  return <BrokerDetailPage params={params} />;
}
