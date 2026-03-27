"use client";

import React, { useRef, useEffect, useState, memo } from "react";
import { Info, Filter } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

// ─── All supported countries by TradingView widget ────────────────────────────
const COUNTRY_OPTIONS = [
  { value: "us", label: "🇺🇸 United States" },
  { value: "eu", label: "🇪🇺 Euro Zone" },
  { value: "gb", label: "🇬🇧 United Kingdom" },
  { value: "jp", label: "🇯🇵 Japan" },
  { value: "au", label: "🇦🇺 Australia" },
  { value: "ca", label: "🇨🇦 Canada" },
  { value: "cn", label: "🇨🇳 China" },
  { value: "de", label: "🇩🇪 Germany" },
  { value: "fr", label: "🇫🇷 France" },
  { value: "in", label: "🇮🇳 India" },
  { value: "br", label: "🇧🇷 Brazil" },
  { value: "kr", label: "🇰🇷 South Korea" },
  { value: "mx", label: "🇲🇽 Mexico" },
  { value: "ru", label: "🇷🇺 Russia" },
  { value: "za", label: "🇿🇦 South Africa" },
  { value: "ch", label: "🇨🇭 Switzerland" },
  { value: "nz", label: "🇳🇿 New Zealand" },
  { value: "sg", label: "🇸🇬 Singapore" },
  { value: "tr", label: "🇹🇷 Turkey" },
  { value: "sa", label: "🇸🇦 Saudi Arabia" },
  { value: "id", label: "🇮🇩 Indonesia" },
  { value: "ar", label: "🇦🇷 Argentina" },
  { value: "it", label: "🇮🇹 Italy" },
  { value: "es", label: "🇪🇸 Spain" },
];

// importanceFilter: -1=low, 0=medium, 1=high  (comma-separated)
const IMPORTANCE_OPTIONS = [
  { value: "-1,0,1", label: "All Impact" },
  { value: "1",      label: "🔴 High Only" },
  { value: "0,1",    label: "🟠 Medium & High" },
  { value: "-1",     label: "🟢 Low Only" },
];

// ─── Widget ───────────────────────────────────────────────────────────────────
interface WidgetProps {
  theme: string;
  importance: string;
  countries: string[];
}

const EconomicCalendarWidget = memo(({ theme, importance, countries }: WidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const countryFilter = countries.length > 0
      ? countries.join(",")
      : "ar,au,br,ca,cn,de,es,fr,gb,id,in,it,jp,kr,mx,ru,sa,sg,tr,us,za,eu,ch,nz";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: theme === "dark" ? "dark" : "light",
      isTransparent: false,
      width: "100%",
      height: "650",
      locale: "en",
      importanceFilter: importance,
      countryFilter,
    });

    containerRef.current.appendChild(script);
  }, [theme, importance, countries]);

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{ width: "100%", height: "650px" }}
    />
  );
});
EconomicCalendarWidget.displayName = "EconomicCalendarWidget";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EconomicCalendar() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [importance, setImportance] = useState("-1,0,1");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [showCountryPanel, setShowCountryPanel] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const theme = mounted ? (resolvedTheme || "light") : "light";

  const toggleCountry = (code: string) => {
    setSelectedCountries(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const clearCountries = () => setSelectedCountries([]);
  const selectAll = () => setSelectedCountries(COUNTRY_OPTIONS.map(c => c.value));

  const activeCountryLabel = selectedCountries.length === 0
    ? "All Countries"
    : `${selectedCountries.length} selected`;

  return (
    <div className="w-full max-w-[1420px] mx-auto font-outfit pb-12 mt-4">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-brand-black dark:text-white">Economic Calendar</h1>
            <Info size={16} className="text-gray-400 cursor-pointer hover:text-gray-600" />
          </div>
          <p className="text-sm text-brand-gray dark:text-gray-400">
            Real-time macro-economic events and data reports.{" "}
            <Link href="/brokers" className="text-brand-blue hover:underline">Compare Brokers</Link>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-brand-gray dark:text-gray-500 bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/10 px-4 py-2 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
          Live · Powered by TradingView
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4 p-4 bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/10 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-black dark:text-white">
          <Filter size={16} className="text-brand-blue" />
          Filters:
        </div>

        {/* Importance filter */}``
        <div className="flex gap-1.5">
          {IMPORTANCE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setImportance(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                importance === opt.value
                  ? "bg-brand-blue text-white shadow-md shadow-brand-blue/25"
                  : "bg-brand-light dark:bg-white/5 border border-brand-border dark:border-white/10 text-brand-gray dark:text-gray-300 hover:border-brand-blue hover:text-brand-blue"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-brand-border dark:bg-white/10" />

        {/* Country filter toggle */}
        <div className="relative">
          <button
            onClick={() => setShowCountryPanel(!showCountryPanel)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              selectedCountries.length > 0
                ? "bg-brand-blue text-white border-brand-blue shadow-md shadow-brand-blue/25"
                : "bg-brand-light dark:bg-white/5 border-brand-border dark:border-white/10 text-brand-gray dark:text-gray-300 hover:border-brand-blue hover:text-brand-blue"
            }`}
          >
            🌍 {activeCountryLabel}
            <span className="text-[10px] opacity-70">▼</span>
          </button>

          {showCountryPanel && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/10 rounded-2xl shadow-2xl z-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-brand-black dark:text-white">Select Countries</span>
                <div className="flex gap-2">
                  <button onClick={selectAll} className="text-[11px] text-brand-blue hover:underline font-semibold">All</button>
                  <button onClick={clearCountries} className="text-[11px] text-brand-gray hover:underline font-semibold">Clear</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1 max-h-64 overflow-y-auto pr-1">
                {COUNTRY_OPTIONS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => toggleCountry(c.value)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left ${
                      selectedCountries.includes(c.value)
                        ? "bg-brand-blue/10 text-brand-blue border border-brand-blue/30"
                        : "hover:bg-brand-light dark:hover:bg-white/5 text-brand-gray dark:text-gray-300 border border-transparent"
                    }`}
                  >
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowCountryPanel(false)}
                className="mt-3 w-full py-2 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-brand-blue/90 transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Active country chips */}
        {selectedCountries.length > 0 && selectedCountries.length <= 5 && (
          <div className="flex flex-wrap gap-1">
            {selectedCountries.map(code => {
              const opt = COUNTRY_OPTIONS.find(c => c.value === code);
              return (
                <span key={code} className="flex items-center gap-1 px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[11px] font-bold rounded-full border border-brand-blue/20">
                  {opt?.label.split(" ")[0]} {code.toUpperCase()}
                  <button onClick={() => toggleCountry(code)} className="hover:text-brand-red ml-0.5">×</button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Widget */}
      <div className="bg-white dark:bg-[#131722] border border-brand-border dark:border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {mounted ? (
          <EconomicCalendarWidget
            theme={theme}
            importance={importance}
            countries={selectedCountries}
          />
        ) : (
          <div className="flex items-center justify-center h-[650px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue" />
          </div>
        )}
      </div>

    </div>
  );
}
