import ContactPage from '@/components/Website/Contact/Contact';
import Header from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return getSeoMetadata("contact");
}

export default function Page() {
  return(
    <>
    <Header />
    <MarketTicker />
    <ContactPage />
    <Footer />
    </>
  )
}
