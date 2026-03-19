"use client";
import React, { useState, useMemo } from "react";
import { Search, Grid3X3, List, ChevronLeft, ChevronRight } from "lucide-react";

interface MarketPageLayoutProps<T> {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor?: string;
  items: T[];
  loading: boolean;
  error: string;
  searchFilter: (item: T, query: string) => boolean;
  renderGridItem: (item: T, index: number) => React.ReactNode;
  renderListItem: (item: T, index: number) => React.ReactNode;
  pageSize?: number;
}

export default function MarketPageLayout<T>({
  title,
  subtitle,
  icon,
  accentColor = "text-brand-blue",
  items,
  loading,
  error,
  searchFilter,
  renderGridItem,
  renderListItem,
  pageSize = 12,
}: MarketPageLayoutProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    return items.filter((item) => searchFilter(item, searchQuery.toLowerCase()));
  }, [items, searchQuery, searchFilter]);

  // Paginate filtered items
  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="bg-white dark:bg-black min-h-screen font-sans">
      {/* Header Section */}
      <div className="bg-linear-to-br from-brand-light dark:from-zinc-900/50 via-white dark:via-black to-blue-50 dark:to-zinc-900/50 border-b border-brand-border dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Icon */}
            <div className={`p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/10 shadow-lg ${accentColor}`}>
              {icon}
            </div>
            
            {/* Title and Subtitle */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold text-brand-black dark:text-white tracking-tight mb-4">
                {title}
              </h1>
              <p className="text-lg text-brand-gray dark:text-gray-400 leading-relaxed max-w-3xl">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray" size={18} />
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-border dark:border-white/10 bg-white dark:bg-zinc-900 text-brand-black dark:text-white placeholder:text-brand-gray dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-brand-light dark:bg-zinc-900 border border-brand-border dark:border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-white dark:bg-zinc-800 text-brand-blue shadow-sm"
                  : "text-brand-gray dark:text-gray-400 hover:text-brand-black dark:hover:text-white"
              }`}
            >
              <Grid3X3 size={16} />
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                viewMode === "list"
                  ? "bg-white dark:bg-zinc-800 text-brand-blue shadow-sm"
                  : "text-brand-gray dark:text-gray-400 hover:text-brand-black dark:hover:text-white"
              }`}
            >
              <List size={16} />
              List
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-brand-gray dark:text-gray-500">
            {loading ? (
              "Loading..."
            ) : error ? (
              <span className="text-brand-red">Error: {error}</span>
            ) : (
              <>
                Showing {paginatedItems.length} of {filteredItems.length} results
                {searchQuery && ` for "${searchQuery}"`}
              </>
            )}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-brand-light dark:bg-zinc-900 rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-brand-border dark:bg-zinc-800 rounded mb-4"></div>
                <div className="h-6 bg-brand-border dark:bg-zinc-800 rounded mb-2"></div>
                <div className="h-4 bg-brand-border dark:bg-zinc-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-brand-light border border-brand-border flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-brand-black dark:text-white mb-2">Something went wrong</h3>
            <p className="text-brand-gray dark:text-gray-400">{error}</p>
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-brand-light dark:bg-zinc-900 border border-brand-border dark:border-white/10 flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-brand-gray" />
            </div>
            <h3 className="text-xl font-bold text-brand-black dark:text-white mb-2">No results found</h3>
            <p className="text-brand-gray dark:text-gray-400">
              {searchQuery
                ? `No items match "${searchQuery}". Try adjusting your search.`
                : "No items available at the moment."}
            </p>
          </div>
        ) : (
          <>
            {/* Items Grid/List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {paginatedItems.map((item, index) =>
                viewMode === "grid"
                  ? renderGridItem(item, startIndex + index)
                  : renderListItem(item, startIndex + index)
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-border dark:border-white/10 bg-white dark:bg-zinc-900 text-brand-gray dark:text-gray-400 hover:text-brand-black dark:hover:text-white hover:border-brand-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                          currentPage === pageNum
                            ? "bg-brand-blue text-white"
                            : "bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/10 text-brand-gray dark:text-gray-400 hover:text-brand-black dark:hover:text-white hover:border-brand-blue"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-border dark:border-white/10 bg-white dark:bg-zinc-900 text-brand-gray dark:text-gray-500 hover:text-brand-black dark:hover:text-white hover:border-brand-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}