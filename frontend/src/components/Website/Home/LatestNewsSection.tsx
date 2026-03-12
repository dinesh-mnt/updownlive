
import Link from "next/link";
import { ArrowRight, Newspaper, Clock } from "lucide-react";

interface Article {
  title: string;
  url: string;
  urlToImage?: string;
  source: { name: string };
  publishedAt: string;
}

interface LatestNewsSectionProps {
  news: Article[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function LatestNewsSection({ news }: LatestNewsSectionProps) {


  return (
    <section className="py-24 bg-white border-t border-brand-border relative overflow-hidden">
      {/* decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red font-semibold text-sm mb-5">
              <Newspaper size={15} /> Breaking Updates
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black tracking-tight mb-4">
              Latest{" "}
              <span className="text-brand-red">Business</span> News
            </h2>
            <p className="text-lg text-brand-gray leading-relaxed">
              The most recent developments impacting global markets and modern economies.
            </p>
          </div>
          <Link
            href="/news"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-red text-brand-red font-bold text-base hover:bg-brand-red hover:text-white hover:shadow-lg hover:shadow-brand-red/25 transition-all duration-200"
          >
            View All News <ArrowRight size={18} />
          </Link>
        </div>

        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {news.slice(0, 6).map((article, index) => (
              <div
                key={index}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-border hover:shadow-xl hover:shadow-brand-black/8 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="h-52 w-full overflow-hidden bg-brand-light relative shrink-0">
                  {article.urlToImage ? (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-brand-blue/10 to-brand-red/10">
                      <Newspaper size={40} className="text-brand-border" />
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Source badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-brand-blue px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {article.source.name}
                    </span>
                  </div>
                  {index === 0 && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-brand-red text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                        Latest
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-brand-gray font-medium mb-3">
                    <Clock size={12} />
                    {timeAgo(article.publishedAt)}
                  </div>
                  <h3 className="text-base font-extrabold text-brand-black leading-snug mb-4 flex-1 group-hover:text-brand-blue transition-colors duration-200">
                    <Link
                      href={`/news/${encodeURIComponent(article.url)}`}
                      className="line-clamp-3"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                    <span className="text-xs font-semibold text-brand-gray uppercase tracking-wider">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/news/${encodeURIComponent(article.url)}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-red hover:text-brand-blue transition-colors"
                    >
                      Read <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="inline-flex flex-col items-center gap-4 p-10 rounded-2xl bg-brand-light border border-brand-border">
              <Newspaper size={40} className="text-brand-border" />
              <p className="text-lg font-semibold text-brand-gray">
                No news available at the moment.
              </p>
              <p className="text-sm text-brand-gray">Please check back later.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
