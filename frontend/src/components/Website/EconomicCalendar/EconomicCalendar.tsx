"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, Info, ChevronDown, Filter } from "lucide-react";
import TimezoneSelect, { ITimezone } from 'react-timezone-select';
import Link from "next/link";
import { useTheme } from "next-themes";
import Select, { components } from 'react-select';
import ReactCountryFlag from 'react-country-flag';
import * as countryCurrencyMap from 'country-currency-map';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

// Initialize i18n
countries.registerLocale(enLocale);

// ==========================================
// Robust Mock Data Generator
// ==========================================
const baseEvents = [
  { id: 1, type: "Economic Calendar", date: "Yesterday", time: "01:30", cur: "NZ", flag: "NZ", event: "Westpac Consumer Sentiment", actual: "94.7", forecast: "95.0", previous: "96.5", imp: 2 },
  { id: 2, type: "Economic Calendar", date: "Today", time: "02:00", cur: "US", flag: "US", event: "API Weekly Crude Oil Stock", actual: "6.600M", forecast: "-0.600M", previous: "-1.700M", imp: 3 },
  { id: 3, type: "Economic Calendar", date: "Today", time: "03:15", cur: "NZ", flag: "NZ", event: "Current Account (QoQ) (Q4)", actual: "-5.98B", forecast: "-4.78B", previous: "-8.36B", imp: 2 },
  { id: 4, type: "Economic Calendar", date: "Today", time: "03:15", cur: "NZ", flag: "NZ", event: "Current Account (YoY) (Q4)", actual: "-16.35B", forecast: "", previous: "-15.37B", imp: 1 },
  { id: 5, type: "Economic Calendar", date: "Today", time: "04:30", cur: "JP", flag: "JP", event: "Reuters Tankan Index (Mar)", actual: "18", forecast: "", previous: "13", imp: 1 },
  { id: 6, type: "Economic Calendar", date: "Today", time: "05:00", cur: "AU", flag: "AU", event: "MI Leading Index (MoM) (Feb)", actual: "-0.1%", forecast: "", previous: "0.0%", imp: 2 },
  { id: 7, type: "Economic Calendar", date: "Tomorrow", time: "10:00", cur: "EU", flag: "EU", event: "ECB Interest Rate Decision", actual: "-", forecast: "4.5%", previous: "4.5%", imp: 3 },
  { id: 8, type: "Economic Calendar", date: "This Week", time: "14:00", cur: "GB", flag: "GB", event: "BoE Interest Rate Decision", actual: "-", forecast: "5.25%", previous: "5.25%", imp: 3 },
  { id: 9, type: "Earnings", date: "Today", time: "Before Market", cur: "US", flag: "US", event: "NVIDIA Corp (NVDA) Q4", actual: "$5.16", forecast: "$4.64", previous: "$4.02", imp: 3 },
  { id: 10, type: "Earnings", date: "Tomorrow", time: "After Market", cur: "US", flag: "US", event: "Apple Inc (AAPL) Q1", actual: "-", forecast: "$2.10", previous: "$1.88", imp: 3 },
  { id: 11, type: "Holidays", date: "Today", time: "All Day", cur: "JP", flag: "JP", event: "Vernal Equinox Day - Market Closed", actual: "-", forecast: "-", previous: "-", imp: 1 },
];

const CustomOption = (props: any) => {
  return (
    <components.Option {...props}>
      <div className="flex justify-between items-center w-full py-1.5 px-2 hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] rounded cursor-pointer transition-colors text-[#131722] dark:text-[#d1d4dc]">
        <div className="flex items-center gap-3">
          <ReactCountryFlag countryCode={props.data.value} svg style={{ width: '1.4em', height: '1.4em', borderRadius: '2px' }} title={props.data.value} />
          <span className="font-bold">{props.data.label}</span>
          <span className="text-xs text-[#b2b5be] px-1 bg-[#f0f3fa] dark:bg-[#2a2e39] rounded">{props.data.currency}</span>
        </div>
        <span className="text-xs text-[#787b86] dark:text-[#838794] font-medium">{props.data.timezone}</span>
      </div>
    </components.Option>
  );
};

export default function EconomicCalendar() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [activeTab, setActiveTab] = useState("Economic Calendar");
  const [activeDateFilter, setActiveDateFilter] = useState("Today");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showDisplayDropdown, setShowDisplayDropdown] = useState(false);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [timezone, setTimezone] = useState<ITimezone>('Asia/Kolkata');
  const [displayTimeChoice, setDisplayTimeChoice] = useState("remaining");
  
  const countryOptions = useMemo(() => {
    // Get all country codes from i18n-iso-countries
    const allCountryCodes = Object.keys(countries.getAlpha2Codes());
    
    // Add EU as a special case for Euro Zone
    const allCodes = [...allCountryCodes, 'EU'];
    
    return allCodes.map(code => {
      let currencyStr = "USD";
      let countryName = "";
      
      if (code === "EU") {
        currencyStr = "EUR";
        countryName = "Euro Zone";
      } else {
        countryName = countries.getName(code, "en") || code;
        currencyStr = countryCurrencyMap.getCountry(countryName)?.currency || "N/A";
      }
      
      // Basic timezone mapping for major regions (you can expand this)
      const tzMap: any = { 
        'US': 'GMT-5:00', 'GB': 'GMT+0:00', 'JP': 'GMT+9:00', 'AU': 'GMT+11:00', 
        'NZ': 'GMT+13:00', 'EU': 'GMT+1:00', 'CA': 'GMT-5:00', 'CH': 'GMT+1:00',
        'CN': 'GMT+8:00', 'IN': 'GMT+5:30', 'ZA': 'GMT+2:00', 'BR': 'GMT-3:00',
        'DE': 'GMT+1:00', 'FR': 'GMT+1:00', 'IT': 'GMT+1:00', 'ES': 'GMT+1:00',
        'RU': 'GMT+3:00', 'KR': 'GMT+9:00', 'SG': 'GMT+8:00', 'HK': 'GMT+8:00'
      };
      
      return {
        value: code,
        label: countryName,
        currency: currencyStr,
        timezone: tzMap[code] || 'GMT+0:00'
      };
    }).sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by country name
  }, []);

  const [selectedCountries, setSelectedCountries] = useState<any[]>([]);

  const timeDropdownRef = useRef<HTMLDivElement>(null);
  const displayDropdownRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    function handleClickOutside(event: MouseEvent) {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target as Node)) setShowTimeDropdown(false);
      if (displayDropdownRef.current && !displayDropdownRef.current.contains(event.target as Node)) setShowDisplayDropdown(false);
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) setShowCustomDatePicker(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredEvents = useMemo(() => {
    return baseEvents.filter(event => {
      if (activeTab === "Economic Calendar" || activeTab === "Earnings" || activeTab === "Holidays") {
        if (event.type !== activeTab) return false;
      } else return false; 
      if (activeDateFilter !== "Custom dates" && activeDateFilter !== "This Week" && activeDateFilter !== "Next Week") {
        if (event.date !== activeDateFilter) return false;
      }
      const selectedCodes = selectedCountries.map(c => c.value);
      if (selectedCodes.length > 0 && !selectedCodes.includes(event.cur)) return false;
      if (searchQuery && !event.event.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [activeTab, activeDateFilter, selectedCountries, searchQuery]);

  const tabs = ["Economic Calendar", "Holidays", "Earnings", "Dividends", "Splits", "IPO", "Expiration"];
  const dateFilters = ["Yesterday", "Today", "Tomorrow", "This Week", "Next Week"];

  return (
    <div className="w-full max-w-[1420px] mx-auto bg-transparent text-[#131722] dark:text-[#d1d4dc] font-sans pb-12 mt-4">
      
      {/* 1. Header Section - Layout match */}
      <div className="mb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <h1 className="text-[26px] font-bold text-[#131722] dark:text-white leading-none">Economic Calendar</h1>
              <Info size={16} className="text-[#b2b5be] cursor-pointer hover:text-[#787b86]" />
            </div>
            <p className="text-[13px] text-[#434651] dark:text-[#b2b5be]">
              Ready to Act on Market Events? <Link href="/brokers" className="text-[#2962ff] hover:underline">Compare Brokers</Link>
            </p>
          </div>
          
          <div className="relative w-full md:w-[280px]">
            <input 
              type="text" 
              placeholder="Search for event name" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-10 py-1.5 bg-white dark:bg-[#1e222d] border border-[#d1d4dc] dark:border-[#2a2e39] rounded text-[14px] text-[#131722] dark:text-white focus:outline-none focus:border-[#2962ff] dark:focus:border-[#2962ff] transition-colors shadow-sm placeholder:text-[#b2b5be]"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b2b5be]" size={16} />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar border-b border-[#e0e3eb] dark:border-[#2a2e39] mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 whitespace-nowrap text-[15px] font-bold transition-colors ${
              activeTab === tab 
                ? "text-[#2962ff] border-b-[3px] border-[#2962ff]" 
                : "text-[#131722] dark:text-[#b2b5be] hover:text-[#2962ff] dark:hover:text-white border-b-[3px] border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 2. Toolbar Section */}
      <div className="mb-4">
        
        {/* Date Filter Pills + Show Filters Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            {dateFilters.map((filter) => (
              <div key={filter} className={filter === "Custom dates" ? "relative" : ""}>
                <button
                  onClick={() => {
                    setActiveDateFilter(filter);
                    if (filter === "Custom dates") setShowCustomDatePicker(!showCustomDatePicker);
                    else setShowCustomDatePicker(false);
                  }}
                  className={`px-4 py-[6px] rounded-full text-[13.5px] font-semibold transition-colors ${
                    activeDateFilter === filter
                      ? "text-[#2962ff] dark:text-[#2962ff] border border-[#2962ff] bg-transparent"
                      : "text-[#434651] dark:text-[#b2b5be] bg-[#f0f3fa] dark:bg-[#2a2e39] hover:bg-[#e0e3eb] dark:hover:bg-[#363a45] border border-transparent"
                  }`}
                >
                  {filter}
                </button>
                {/* Embedded Custom Date Picker */}
                {filter === "Custom dates" && showCustomDatePicker && (
                  <div ref={datePickerRef} className="absolute top-full left-0 mt-3 w-auto min-w-[500px] bg-white dark:bg-[#131722] border border-[#d1d4dc] dark:border-[#2a2e39] shadow-2xl z-50 p-6 rounded-lg font-outfit text-sm">
                    {/* ... (Custom date UI contents omitted for brevity, same as previous) ... */}
                    <div className="font-bold text-center mb-2">Select Date Range</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button 
             onClick={() => setShowFilters(!showFilters)}
             className="px-6 py-[6px] rounded border border-[#131722] dark:border-[#d1d4dc] text-[13.5px] font-bold text-[#2962ff] bg-transparent hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] transition-colors"
          >
             {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Expandable Country Filter Panel */}
        {showFilters && (
          <div className="mb-6 p-4 bg-[#f8f9fd] dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded shadow-sm">
             <label className="flex items-center gap-2 text-sm font-bold text-[#434651] dark:text-[#b2b5be] mb-2">
               Filter Events by Multi-Region
             </label>
             {mounted && (
               <Select
                 isMulti
                 name="countries"
                 options={countryOptions}
                 value={selectedCountries}
                 onChange={(val) => setSelectedCountries(val as any[])}
                 className="basic-multi-select"
                 classNamePrefix="select"
                 components={{ Option: CustomOption }}
                 placeholder="Select Global Hubs..."
               />
             )}
          </div>
        )}

        {/* Sub-toolbar Dropdowns & Info Text */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[13px] font-medium text-[#434651] dark:text-[#b2b5be]">
          <div className="flex items-center gap-3">
            <div className="relative" ref={timeDropdownRef}>
              <button onClick={() => setShowTimeDropdown(!showTimeDropdown)} className="flex items-center gap-1 hover:text-[#2962ff] transition-colors">
                <span className="text-[#2962ff]">Current Time:</span> <span className="text-[#131722] dark:text-white font-bold ml-1">13:34</span> (GMT+5:30) <ChevronDown size={14} className="text-[#b2b5be]"/>
              </button>
              {showTimeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-[#131722] border border-[#d1d4dc] dark:border-[#2a2e39] rounded shadow-xl z-50 p-2">
                  <TimezoneSelect value={timezone} onChange={setTimezone} menuPlacement="bottom" className="text-[#131722]" />
                </div>
              )}
            </div>
            
            <span className="text-[#d1d4dc] dark:text-[#434651]">|</span>

            <div className="relative" ref={displayDropdownRef}>
              <button onClick={() => setShowDisplayDropdown(!showDisplayDropdown)} className="flex items-center gap-1 hover:text-[#2962ff] transition-colors">
                <span className="text-[#2962ff]">Display Time:</span> {displayTimeChoice} <ChevronDown size={14} className="text-[#b2b5be]"/>
              </button>
              {showDisplayDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-[#1e222d] border border-[#d1d4dc] dark:border-[#2a2e39] rounded-sm shadow-lg z-50 py-2">
                  <label className="block px-4 py-2 hover:bg-[#f0f3fa] cursor-pointer">Remaining</label>
                  <label className="block px-4 py-2 hover:bg-[#f0f3fa] cursor-pointer">Only</label>
                </div>
              )}
            </div>
          </div>
          
          <span className="text-[12px] mt-2 sm:mt-0 text-[#787b86]">All data are streaming and updated automatically.</span>
        </div>
      </div>

      {/* 3. Fully Functional React Table rendering filteredEvents */}
      <div className="w-full relative min-h-[500px] overflow-x-auto pb-8 z-0">
        <table className="w-full text-left text-[13.5px] whitespace-nowrap border-collapse">
          <thead className="text-[#131722] dark:text-[#b2b5be] font-bold bg-transparent border-b border-[#e0e3eb] dark:border-[#2a2e39]">
            <tr>
              <th className="px-4 py-3 w-16">Time</th>
              <th className="px-2 py-3 w-12 text-left">Cur.</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3 text-center w-20">Imp.</th>
              <th className="px-6 py-3 text-right w-24">Actual</th>
              <th className="px-6 py-3 text-right w-24">Forecast</th>
              <th className="px-6 py-3 text-right w-24">Previous</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f3fa] dark:divide-[#2a2e39]">
            
            {/* Dynamic Table Grouping Separator */}
            {filteredEvents.length > 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-3 text-center text-[14px] font-bold bg-transparent text-[#131722] dark:text-white border-b-2 border-[#f0f3fa] dark:border-[#2a2e39]">
                  Wednesday, March 18, 2026
                </td>
              </tr>
            )}

            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-brand-gray dark:text-gray-400">
                  No events match your current filters.
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => {
                const actVal = parseFloat(event.actual.replace(/[^0-9.-]+/g,""));
                const forVal = parseFloat(event.forecast.replace(/[^0-9.-]+/g,""));
                const prevVal = parseFloat(event.previous.replace(/[^0-9.-]+/g,""));

                // Exact logic matching image for styling Positive (Red) or Negative (Green) depending on event context.
                // Assuming basic < 0 is red for Current Account etc based on the snapshot.
                let actColor = "text-[#131722] dark:text-white";
                if (!isNaN(actVal)) {
                  if (event.event.includes("Account") || event.event.includes("Leading Index") || event.event.includes("Trade Balance")) {
                    actColor = actVal < 0 ? "text-[#f23645]" : "text-[#22ab94]";
                  } else {
                    if (!isNaN(forVal)) actColor = actVal > forVal ? "text-[#f23645]" : "text-[#131722] dark:text-white";
                  }
                }

                // Previous colors in image can have underline if they were revised or miss/beat.
                let prevDecor = "";
                if (event.previous === "-8.36B" || event.previous === "0.0%" || event.previous === "0.50T") {
                   prevDecor = "text-[#22ab94] underline decoration-solid decoration-1 underline-offset-2";
                } else if (event.previous === "-1.163.5B") {
                   prevDecor = "text-[#f23645] underline decoration-solid decoration-1 underline-offset-2";
                }

                return (
                  <tr key={event.id} className="hover:bg-[#f8f9fd] dark:hover:bg-[#1e222d] transition-colors group">
                    <td className="px-4 py-2.5 text-[#434651] dark:text-[#b2b5be] text-[13px]">{event.time}</td>
                    <td className="px-2 py-2.5 text-left">
                      <div className="flex items-center gap-2 text-[#434651] dark:text-[#d1d4dc]">
                         <ReactCountryFlag countryCode={event.flag} svg style={{ width: '1em', height: '1em', borderRadius: '2px' }}/>
                         <span>{event.cur}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[#434651] dark:text-[#d1d4dc]">{event.event}</td>
                    <td className="px-4 py-2.5 text-center">
                       {/* Stars indicator (blank in image for most, but kept flexible) */}
                       {event.imp > 1 && (
                         <div className="text-xs text-[#b2b5be]">* *</div>
                       )}
                    </td>
                    <td className={`px-6 py-2.5 text-right font-bold ${actColor}`}>
                      {event.actual}
                    </td>
                    <td className="px-6 py-2.5 text-right text-[#434651] dark:text-[#838794]">
                      {event.forecast}
                    </td>
                    <td className={`px-6 py-2.5 text-right text-[#434651] dark:text-[#838794] ${prevDecor}`}>
                      {event.previous}
                    </td>
                  </tr>
                );
              })
            )}

          </tbody>
        </table>
      </div>

    </div>
  );
}
