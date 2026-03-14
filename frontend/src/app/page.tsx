import React from "react";
import Home from "@/components/Website/Home/Home";
import axios from "axios";
import axiosInstance from '@/lib/axios';
import TopAd from "@/components/TopAd";
import Navbar from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return getSeoMetadata("home");
}

async function getTopNews() {
  let API_KEY = "";

  try {
    const configRes = await axiosInstance.get(`/settings/news-api-key`);
    if (configRes.data?.apiKey) API_KEY = configRes.data.apiKey;
  } catch (e) {
    console.warn("Could not reach backend for news API key:", (e as Error).message);
    return [];
  }

  if (!API_KEY) return [];

  try {
    const res = await axios.get(
      "https://eventregistry.org/api/v1/article/getArticles",
      {
        params: {
          action: "getArticles",
          keyword: "business",
          articlesPage: 1,
          articlesCount: 6,
          articlesSortBy: "date",
          articlesSortByAsc: false,
          dataType: "news",
          resultType: "articles",
          apiKey: API_KEY,
        },
        validateStatus: (status) => status < 500,
      },
    );
    if (res.status === 401 || res.status === 403) return [];

    const rawArticles = res.data?.articles?.results || [];
    return rawArticles.map((article: any) => ({
      title: article.title,
      url: article.url,
      urlToImage: article.image,
      source: { name: article.source?.title || "Business News" },
      publishedAt:
        article.dateTimePub || article.date || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function Page() {
  const news = await getTopNews();
  return (
    <>
      <TopAd />
      <Navbar />
      <MarketTicker />
      <Home news={news} />
      <Footer />
    </>
  );
}
