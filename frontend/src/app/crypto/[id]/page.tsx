import CryptoDetailPage from "@/components/Website/Crypto/CryptoDetailPage";

export default function CryptoArticlePage({ params }: { params: { id: string } }) {
  return <CryptoDetailPage params={params} />;
}
