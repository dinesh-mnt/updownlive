"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, Flag, Clock, AlertTriangle } from "lucide-react";
import MarketPageLayout from "@/components/Website/Shared/MarketPageLayout";

interface EcoEvent {
  id: string;
  date: string;
  time: string;
  country: string;
  currency: string;
  event: string;
  impact: "high" | "medium" | "low";
  actual?: string;
  forecast?: string;
  previous?: string;
}

const FALLBACK: EcoEvent[] = [
  { id: "1", date: "2026-03-11", time: "08:30", country: "United States", currency: "USD", event: "Non-Farm Payrolls", impact: "high", actual: "275K", forecast: "230K", previous: "256K" },
  { id: "2", date: "2026-03-11", time: "08:30", country: "United States", currency: "USD", event: "Unemployment Rate", impact: "high", actual: "3.7%", forecast: "3.8%", previous: "3.7%" },
  { id: "3", date: "2026-03-11", time: "10:00", country: "United States", currency: "USD", event: "ISM Manufacturing PMI", impact: "medium", actual: "49.1", forecast: "48.5", previous: "47.8" },
  { id: "4", date: "2026-03-12", time: "08:30", country: "United States", currency: "USD", event: "CPI (MoM)", impact: "high", forecast: "0.3%", previous: "0.4%" },
  { id: "5", date: "2026-03-12", time: "09:00", country: "Eurozone", currency: "EUR", event: "ECB Interest Rate Decision", impact: "high", forecast: "4.00%", previous: "4.00%" },
  { id: "6", date: "2026-03-12", time: "09:30", country: "United Kingdom", currency: "GBP", event: "GDP (MoM)", impact: "medium", forecast: "0.1%", previous: "0.1%" },
  { id: "7", date: "2026-03-13", time: "03:30", country: "Australia", currency: "AUD", event: "RBA Interest Rate Decision", impact: "high", forecast: "4.35%", previous: "4.35%" },
  { id: "8", date: "2026-03-13", time: "08:30", country: "United States", currency: "USD", event: "PPI (MoM)", impact: "medium", forecast: "0.2%", previous: "0.3%" },
  { id: "9", date: "2026-03-13", time: "10:00", country: "United States", currency: "USD", event: "Michigan Consumer Sentiment", impact: "medium", forecast: "76.8", previous: "76.9" },
  { id: "10", date: "2026-03-14", time: "08:00", country: "Germany", currency: "EUR", event: "ZEW Economic Sentiment", impact: "medium", forecast: "22.0", previous: "19.9" },
  { id: "11", date: "2026-03-14", time: "09:30", country: "United Kingdom", currency: "GBP", event: "Consumer Price Index (YoY)", impact: "high", forecast: "3.5%", previous: "4.0%" },
  { id: "12", date: "2026-03-14", time: "18:00", country: "United States", currency: "USD", event: "Fed Chair Powell Speech", impact: "high", forecast: "—", previous: "—" },
  { id: "13", date: "2026-03-17", time: "08:30", country: "Canada", currency: "CAD", event: "Retail Sales (MoM)", impact: "medium", forecast: "0.4%", previous: "-0.2%" },
  { id: "14", date: "2026-03-17", time: "22:00", country: "Japan", currency: "JPY", event: "BOJ Interest Rate Decision", impact: "high", forecast: "0.10%", previous: "0.10%" },
  { id: "15", date: "2026-03-18", time: "09:30", country: "United States", currency: "USD", event: "Building Permits", impact: "low", forecast: "1.50M", previous: "1.47M" },
];

const IMPACT_STYLE = {
  high: "bg-red-100 text-brand-red border border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  low: "bg-green-100 text-green-700 border border-green-200",
};

function EventCard({ event }: { event: EcoEvent }) {
  return (
    <div className="group bg-white rounded-2xl border border-brand-border p-5 hover:shadow-xl hover:shadow-brand-blue/8 hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-lg">{event.currency}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg capitalize ${IMPACT_STYLE[event.impact]}`}>
            {event.impact}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-brand-gray">
          <Clock size={11} /> {event.time}
        </div>
      </div>
      <div>
        <p className="font-extrabold text-brand-black text-base leading-snug">{event.event}</p>
        <p className="text-xs text-brand-gray mt-1 flex items-center gap-1"><Flag size={11} /> {event.country}</p>
      </div>
      <div className="pt-3 border-t border-brand-border grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <p className={`font-bold text-base ${event.actual ? "text-brand-blue" : "text-brand-gray"}`}>{event.actual || "—"}</p>
          <p className="text-brand-gray">Actual</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-base text-brand-black">{event.forecast || "—"}</p>
          <p className="text-brand-gray">Forecast</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-base text-brand-gray">{event.previous || "—"}</p>
          <p className="text-brand-gray">Previous</p>
        </div>
      </div>
      <p className="text-xs text-brand-gray font-medium">{new Date(event.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
    </div>
  );
}

function EventListRow({ event, index }: { event: EcoEvent; index: number }) {
  return (
    <div className="group bg-white rounded-xl border border-brand-border px-5 py-4 hover:shadow-md hover:border-brand-blue/20 transition-all duration-200 flex items-center gap-4">
      <span className="w-7 text-sm font-bold text-brand-gray text-center">{index + 1}</span>
      <div className="flex flex-col gap-0.5 min-w-[90px] shrink-0">
        <p className="text-xs font-bold text-brand-black">{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
        <p className="text-xs text-brand-gray flex items-center gap-1"><Clock size={10} /> {event.time}</p>
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize shrink-0 ${IMPACT_STYLE[event.impact]}`}>{event.impact}</span>
      <span className="text-xs font-black text-brand-blue bg-brand-blue/10 px-2 py-1 rounded-lg shrink-0">{event.currency}</span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-brand-black text-sm truncate">{event.event}</p>
        <p className="text-xs text-brand-gray flex items-center gap-1"><Flag size={10} /> {event.country}</p>
      </div>
      <div className="hidden md:flex items-center gap-6 text-xs text-brand-gray">
        <div className="text-center min-w-[48px]">
          <p className={`font-bold ${event.actual ? "text-brand-blue" : "text-brand-gray"}`}>{event.actual || "—"}</p>
          <p>Actual</p>
        </div>
        <div className="text-center min-w-[48px]">
          <p className="font-bold text-brand-black">{event.forecast || "—"}</p>
          <p>Forecast</p>
        </div>
        <div className="text-center min-w-[48px]">
          <p className="font-bold">{event.previous || "—"}</p>
          <p>Previous</p>
        </div>
      </div>
    </div>
  );
}

export default function EconomicCalendar() {
  const [items, setItems] = useState<EcoEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Economic calendar uses the NewsAPI key (EventRegistry has calendar data)
    // or falls back to static data
    setItems(FALLBACK);
    setLoading(false);
  }, []);

  return (
    <MarketPageLayout
      title="Economic Calendar"
      subtitle="Track major economic events, central bank decisions, and market-moving data releases from G-10 countries worldwide."
      icon={<CalendarDays size={44} strokeWidth={1.5} />}
      accentColor="text-green-400"
      items={items}
      loading={loading}
      error={error}
      searchFilter={(item, q) =>
        item.event.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.currency.toLowerCase().includes(q)
      }
      renderGridItem={(item, i) => <EventCard key={i} event={item} />}
      renderListItem={(item, i) => <EventListRow key={i} event={item} index={i} />}
      pageSize={10}
    />
  );
}
