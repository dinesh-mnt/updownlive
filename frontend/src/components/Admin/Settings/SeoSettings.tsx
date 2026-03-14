"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from '@/lib/axios';
import { Save, Loader2, Globe, Search, Image as ImageIcon, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/UI/Button";
import { useToast } from "@/hooks/use-toast";

interface SeoSettingsData {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  ogUrl: string;
}

const PAGES = [
  { id: "global", label: "Global Defaults" },
  { id: "home", label: "Home Page" },
  { id: "forex", label: "Forex Market" },
  { id: "crypto", label: "Cryptocurrency" },
  { id: "gold", label: "Gold & Precious Metals" },
  { id: "brokers", label: "Brokers" },
  { id: "charts", label: "Charts" },
  { id: "economic-calendar", label: "Economic Calendar" },
  { id: "contact", label: "Contact Us" },
];

const DEFAULT_DATA: SeoSettingsData = {
  title: "",
  description: "",
  keywords: "",
  ogImage: "",
  ogUrl: "",
};

export default function SeoSettings() {
  const [data, setData] = useState<Record<string, SeoSettingsData>>({});
  const [activePage, setActivePage] = useState<string>("global");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axiosInstance.get(`/settings/seo`);
      if (res.data?.seo) {
        // If it was the old single-object format (without 'global' or 'home' keys), migrate it
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

  return (
    <div className="p-6 max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#111] tracking-tight">Search Engine Optimization</h1>
        <p className="text-[#555] mt-2 text-[15px]">
          Manage the meta tags, descriptions, and OpenGraph details for each page on your website.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8e8e8] shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Form Area */}
        <div className="p-6 sm:p-8 flex-1 border-b md:border-b-0 md:border-r border-[#e8e8e8]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-[#111] flex items-center gap-2">
              <Search className="w-5 h-5 text-brand-blue" />
              SEO Properties
            </h2>
            
            <div className="flex items-center gap-2 bg-[#f4f4f4] border border-[#e0e0e0] px-3 py-1.5 rounded-xl">
              <LayoutTemplate size={16} className="text-[#888] shrink-0" />
              <select
                value={activePage}
                onChange={(e) => setActivePage(e.target.value)}
                className="bg-transparent text-sm font-semibold text-[#111] focus:outline-none cursor-pointer border-none p-0 pr-2"
              >
                {PAGES.map(page => (
                  <option key={page.id} value={page.id}>{page.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#333] mb-1.5">Site Title</label>
              <input type="text"
                name="title"
                value={currentData.title}
                onChange={handleChange}
                placeholder="e.g. UpDownLive - Global Market & News Portal"
                className="w-full h-11 px-3 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
              />
              <p className="text-xs text-[#888] mt-1.5 font-medium">This is the default title shown in browser tabs and search engine results.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#333] mb-1.5">Meta Description</label>
              <textarea
                name="description"
                value={currentData.description}
                onChange={handleChange}
                placeholder="e.g. Real-time global market data, latest financial news, and insights."
                className="w-full rounded-xl border border-[#e0e0e0] p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all resize-y"
              />
              <p className="text-xs text-[#888] mt-1.5 font-medium">Keep this under 160 characters for optimal display in search results.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#333] mb-1.5">Keywords</label>
              <input type="text"
                name="keywords"
                value={currentData.keywords}
                onChange={handleChange}
                placeholder="e.g. forex, crypto, news, trading, charts"
                className="w-full h-11 px-3 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
              />
              <p className="text-xs text-[#888] mt-1.5 font-medium">Comma-separated list of relevant keywords to help discovery.</p>
            </div>

            <div className="border-t border-[#f0f0f0] pt-6 mt-6">
              <h3 className="text-lg font-bold text-[#111] mb-5 flex items-center gap-2">
                <Globe className="w-5 h-5 text-brand-blue" />
                Social Graph (OpenGraph)
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-1.5">OG Image URL</label>
                  <input type="text"
                    name="ogImage"
                    value={currentData.ogImage}
                    onChange={handleChange}
                    placeholder="https://example.com/banner.png"
                    className="w-full h-11 px-3 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                  />
                  <p className="text-xs text-[#888] mt-1.5 font-medium">The image that appears when your site is shared on Facebook, X, etc.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-1.5">Canonical URL</label>
                  <input type="text"
                    name="ogUrl"
                    value={currentData.ogUrl}
                    onChange={handleChange}
                    placeholder="https://updownlive.com"
                    className="w-full h-11 px-3 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                  />
                  <p className="text-xs text-[#888] mt-1.5 font-medium">The primary URL for your application.</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 bg-brand-blue hover:bg-brand-red text-white py-6 w-full sm:w-auto font-bold rounded-xl transition-all shadow-md shadow-brand-blue/20"
            >
              {saving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Changes...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> Save SEO Settings</>
              )}
            </Button>
          </div>
        </div>

        {/* Right Preview Area */}
        <div className="w-full md:w-[380px] lg:w-[450px] bg-[#fafafa] p-6 sm:p-8 shrink-0">
          <h2 className="text-xl font-bold text-[#111] mb-6 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#888]" />
            Live Preview <span className="text-sm font-semibold text-[#aaa] ml-2">({PAGES.find(p=>p.id===activePage)?.label})</span>
          </h2>
          
          <div className="space-y-8 sticky top-6">
            
            {/* Google Search Preview */}
            <div className="bg-white p-5 rounded-xl border border-brand-border shadow-sm">
              <div className="text-[14px] text-[#202124] flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-[#f0f0f0] flex items-center justify-center shrink-0">
                  <Globe size={12} className="text-[#888]"/>
                </div>
                <div className="truncate flex-1">
                  <span className="font-medium text-[rgba(32,33,36,1)] leading-none">{currentData.ogUrl || "https://yoursite.com"}</span>
                </div>
              </div>
              <h3 className="text-[#1a0dab] text-[20px] leading-[1.3] truncate hover:underline cursor-pointer">
                {currentData.title || "Your Site Title"}
              </h3>
              <p className="text-[#4d5156] text-[14px] mt-1 leading-[1.58] line-clamp-2">
                {currentData.description || "Your meta description will appear here, keeping it concise and engaging makes users want to click!"}
              </p>
            </div>

            {/* Social Share Preview (Twitter/X style) */}
            <div className="bg-white rounded-xl border border-brand-border shadow-sm overflow-hidden">
              <div className="h-[200px] w-full bg-[#f4f4f4] border-b border-brand-border flex items-center justify-center relative overflow-hidden">
                {currentData.ogImage ? (
                  <img src={currentData.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-[#aaa] flex flex-col items-center gap-2">
                    <ImageIcon size={32} />
                    <span className="text-sm font-semibold">No Image Set</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-[#f8f9fa] border-t border-brand-border">
                <p className="text-[#536471] text-[13px] truncate uppercase tracking-wide">
                  {(() => {
                    try { return new URL(currentData.ogUrl || "https://yoursite.com").hostname; }
                    catch { return "yoursite.com"; }
                  })()}
                </p>
                <p className="text-[#0f1419] font-bold text-[15px] truncate leading-tight mt-0.5">{currentData.title || "Your Site Title"}</p>
                <p className="text-[#536471] text-[14px] truncate leading-tight mt-0.5">{currentData.description || "Description preview..."}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
