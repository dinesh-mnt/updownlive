"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from '@/lib/axios';
import { Save, Loader2, Search, LayoutTemplate, Globe, Sparkles, Eye } from "lucide-react";
import { Button } from "@/components/UI/Button";
import { useToast } from "@/hooks/use-toast";

interface SeoSettingsData {
  title: string;
  description: string;
  keywords: string;
}

const PAGES = [
  { id: "global", label: "Global Defaults", icon: Globe },
  { id: "home", label: "Home Page", icon: Sparkles },
  { id: "forex", label: "Forex Market", icon: LayoutTemplate },
  { id: "crypto", label: "Cryptocurrency", icon: LayoutTemplate },
  { id: "gold", label: "Gold & Precious Metals", icon: LayoutTemplate },
  { id: "brokers", label: "Brokers", icon: LayoutTemplate },
  { id: "charts", label: "Charts", icon: LayoutTemplate },
  { id: "economic-calendar", label: "Economic Calendar", icon: LayoutTemplate },
  { id: "contact", label: "Contact Us", icon: LayoutTemplate },
];

const DEFAULT_DATA: SeoSettingsData = {
  title: "",
  description: "",
  keywords: "",
};

export default function SeoSettings() {
  const [data, setData] = useState<Record<string, SeoSettingsData>>({});
  const [activePage, setActivePage] = useState<string>("global");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axiosInstance.get(`/settings/seo`);
      if (res.data?.seo) {
        let fetchedSeo = res.data.seo;
        if (fetchedSeo.title !== undefined && !fetchedSeo.global) {
          fetchedSeo = { global: fetchedSeo };
        }
        setData(fetchedSeo);
      } else {
        setData({ global: { ...DEFAULT_DATA } });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load SEO settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [activePage]: {
        ...(prev[activePage] || DEFAULT_DATA),
        [name]: value,
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.post(`/settings/seo`, { seo: data });
      toast({
        title: "Success",
        description: "SEO settings have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save SEO settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  const currentData = data[activePage] || DEFAULT_DATA;
  const activePageInfo = PAGES.find(p => p.id === activePage);

  return (
    <div className="max-w-[1400px] mx-auto pb-24">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-brrom-brand-blue to-blue-600 flex items-center justify-center shadow-lg shadow-brand-blue/20">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-black dark:text-white tracking-tight">
              SEO Settings
            </h1>
            <p className="text-sm text-brand-gray dark:text-gray-400 mt-0.5">
              Optimize your website for search engines
            </p>
          </div>
        </div>
      </div>

      {/* Page Selector Pills */}
      <div className="mb-6 bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <LayoutTemplate className="w-4 h-4 text-brand-gray dark:text-gray-400" />
          <span className="text-sm font-semibold text-brand-gray dark:text-gray-400">Select Page</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PAGES.map(page => (
            <button
              key={page.id}
              onClick={() => setActivePage(page.id)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                activePage === page.id
                  ? 'bg-linear-to-r from-brand-blue to-blue-600 text-white shadow-lg shadow-brand-blue/30'
                  : 'bg-brand-light dark:bg-white/5 text-brand-gray dark:text-gray-400 hover:bg-brand-blue/10 dark:hover:bg-white/10'
              }`}
            >
              {page.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form Area */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 shadow-xl overflow-hidden">
          <div className="border-b border-brand-border dark:border-white/10 bg-linear-to-r from-brand-light/50 to-transparent dark:from-white/5 dark:to-transparent px-8 py-6">
            <div className="flex items-center gap-3">
              {activePageInfo && <activePageInfo.icon className="w-5 h-5 text-brand-blue" />}
              <div>
                <h2 className="text-xl font-bold text-brand-black dark:text-white">
                  {activePageInfo?.label}
                </h2>
                <p className="text-sm text-brand-gray dark:text-gray-400 mt-0.5">
                  Configure SEO metadata for this page
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Title Field */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-brand-black dark:text-white mb-2">
                <div className="w-8 h-8 rounded-lg bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center group-hover:bg-brand-blue/20 dark:group-hover:bg-brand-blue/30 transition-colors">
                  <Search className="w-4 h-4 text-brand-blue" />
                </div>
                <span>Page Title</span>
              </label>
              <input
                type="text"
                name="title"
                value={currentData.title}
                onChange={handleChange}
                placeholder="e.g. UpDownLive - Global Market & News Portal"
                className="w-full bg-white dark:bg-zinc-800 border-2 border-brand-border dark:border-white/10 text-brand-black dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all placeholder:text-brand-gray/50 dark:placeholder:text-gray-600 hover:border-brand-blue/50"
              />
              <p className="text-xs text-brand-gray dark:text-gray-500 mt-2 ml-10">
                Displayed in browser tabs and search results (50-60 characters recommended)
              </p>
            </div>

            {/* Description Field */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-brand-black dark:text-white mb-2">
                <div className="w-8 h-8 rounded-lg bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center group-hover:bg-brand-blue/20 dark:group-hover:bg-brand-blue/30 transition-colors">
                  <LayoutTemplate className="w-4 h-4 text-brand-blue" />
                </div>
                <span>Meta Description</span>
              </label>
              <textarea
                name="description"
                value={currentData.description}
                onChange={handleChange}
                placeholder="e.g. Real-time global market data, latest financial news, and insights."
                rows={4}
                className="w-full bg-white dark:bg-zinc-800 border-2 border-brand-border dark:border-white/10 text-brand-black dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all resize-none placeholder:text-brand-gray/50 dark:placeholder:text-gray-600 hover:border-brand-blue/50"
              />
              <div className="flex items-center justify-between mt-2 ml-10">
                <p className="text-xs text-brand-gray dark:text-gray-500">
                  Brief summary for search results (150-160 characters optimal)
                </p>
                <span className={`text-xs font-semibold ${
                  currentData.description.length > 160 
                    ? 'text-red-500' 
                    : currentData.description.length > 150 
                    ? 'text-yellow-500' 
                    : 'text-green-500'
                }`}>
                  {currentData.description.length}/160
                </span>
              </div>
            </div>

            {/* Keywords Field */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-brand-black dark:text-white mb-2">
                <div className="w-8 h-8 rounded-lg bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center group-hover:bg-brand-blue/20 dark:group-hover:bg-brand-blue/30 transition-colors">
                  <Sparkles className="w-4 h-4 text-brand-blue" />
                </div>
                <span>Keywords</span>
              </label>
              <input
                type="text"
                name="keywords"
                value={currentData.keywords}
                onChange={handleChange}
                placeholder="e.g. forex, crypto, news, trading, charts"
                className="w-full bg-white dark:bg-zinc-800 border-2 border-brand-border dark:border-white/10 text-brand-black dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all placeholder:text-brand-gray/50 dark:placeholder:text-gray-600 hover:border-brand-blue/50"
              />
              <p className="text-xs text-brand-gray dark:text-gray-500 mt-2 ml-10">
                Comma-separated keywords for search discovery
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-brand-border dark:border-white/10">
              <button
                onClick={handleSave}
                disabled={saving}
                className="group relative bg-linear-to-r from-brand-blue to-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-blue/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-brand-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-2">
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save SEO Settings</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview Area */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-brand-blue" />
                <h3 className="text-lg font-bold text-brand-black dark:text-white">
                  Live Preview
                </h3>
              </div>

              {/* Google Search Preview */}
              <div className="bg-brand-light dark:bg-white/5 p-5 rounded-xl border border-brand-border dark:border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center">
                    <Search className="w-3 h-3 text-brand-blue" />
                  </div>
                  <span className="text-xs font-medium text-brand-gray dark:text-gray-400">
                    yoursite.com
                  </span>
                </div>
                <h4 className="text-blue-600 dark:text-blue-400 text-lg font-semibold mb-1 line-clamp-1 hover:underline cursor-pointer">
                  {currentData.title || "Your Page Title"}
                </h4>
                <p className="text-sm text-brand-gray dark:text-gray-400 line-clamp-2">
                  {currentData.description || "Your meta description will appear here. Make it engaging to improve click-through rates!"}
                </p>
              </div>

              {/* Keywords Display */}
              {currentData.keywords && (
                <div className="mt-4 pt-4 border-t border-brand-border dark:border-white/10">
                  <h4 className="text-sm font-semibold text-brand-black dark:text-white mb-3">
                    Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentData.keywords.split(',').map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue text-xs font-semibold rounded-full border border-brand-blue/20"
                      >
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SEO Tips */}
            <div className="bg-linear-to-br from-brand-blue/10 to-blue-600/10 dark:from-brand-blue/20 dark:to-blue-600/20 rounded-2xl border border-brand-blue/20 p-6">
              <h4 className="text-sm font-bold text-brand-black dark:text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-blue" />
                SEO Tips
              </h4>
              <ul className="space-y-2 text-xs text-brand-gray dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-0.5">•</span>
                  <span>Keep titles under 60 characters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-0.5">•</span>
                  <span>Descriptions should be 150-160 characters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-0.5">•</span>
                  <span>Use relevant keywords naturally</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-blue mt-0.5">•</span>
                  <span>Make descriptions compelling and actionable</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
