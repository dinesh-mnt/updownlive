"use client";

import React from "react";
import { Info, Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

const EconomicCalendarWidget = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full overflow-x-auto">
        <iframe 
          src="https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&category=_employment,_economicActivity,_inflation,_credit,_centralBanks,_confidenceIndex,_balance,_Bonds&importance=3&features=datepicker,timezone&countries=95,86,29,25,54,114,145,47,34,8,174,163,32,70,6,232,27,37,122,15,78,113,107,55,24,121,59,89,72,71,22,17,74,51,39,93,106,14,48,66,33,23,10,119,35,92,102,57,94,204,97,68,96,103,111,42,109,188,7,139,247,105,82,172,21,43,20,60,87,44,193,148,125,45,53,38,170,100,56,80,52,238,36,90,112,110,11,26,162,9,12,46,85,41,202,63,123,61,143,4,5,180,168,138,178,84,75&calType=week&timeZone=8&lang=1" 
          width="100%" 
          height="467" 
          frameBorder="0" 
          allowTransparency={true}
          marginWidth={0} 
          marginHeight={0}
          className="min-w-[320px] w-full"
          style={{ minHeight: '467px' }}
        />
      </div>
      <div className="w-full mt-3 text-center px-2">
        <span className="text-[11px] text-gray-600 dark:text-gray-400">
          Real Time Economic Calendar provided by{' '}
          <a 
            href="https://www.investing.com/" 
            rel="nofollow" 
            target="_blank" 
            className="text-brand-blue font-semibold hover:underline"
          >
            Investing.com
          </a>
        </span>
      </div>
    </div>
  );
};

export default function EconomicCalendar() {
  return (
    <div className="w-full max-w-[1420px] mx-auto font-outfit pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-sm font-medium mb-4">
            <Calendar size={14} />
            <span>Market Events Tracker</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-brand-black dark:text-white mb-4 tracking-tight">
            Economic Calendar
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Stay ahead of the markets with real-time updates on global macroeconomic events, data reports, and central bank announcements.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 shadow-sm px-5 py-3 rounded-2xl">
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-20 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-brand-black dark:text-white leading-tight">Live Market Data</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Powered by Investing.com</span>
            </div>
          </div>
          
          <Link 
            href="/brokers" 
            className="group flex items-center gap-2 bg-brand-black dark:bg-white text-white dark:text-brand-black px-5 py-3 rounded-2xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
          >
            Compare Brokers
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Widget Container with Glassmorphism */}
      <div className="relative w-full rounded-[2rem] bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-white/10 shadow-2xl dark:shadow-none p-2 sm:p-4 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-6 duration-500 flex justify-center">
        {/* Glow Effects (Visible in dark mode) */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-brand-blue/20 to-purple-500/20 rounded-[2rem] blur-xl opacity-0 dark:opacity-100 -z-10" />
        
        <div className="w-full max-w-[800px] bg-gray-50 dark:bg-[#0a0a0a] rounded-xl sm:rounded-2xl border border-gray-100 dark:border-white/5 p-2 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-200 dark:border-white/10 pb-4 px-2">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-brand-black dark:text-white">
              <Clock size={18} className="text-brand-blue" />
              Global Economic Schedule
            </h2>
            <div className="flex items-center gap-2">
              <Info size={14} className="text-gray-400" />
              <span className="text-xs text-gray-500">Times are shown in your local timezone</span>
            </div>
          </div>
          
          <EconomicCalendarWidget />
        </div>
      </div>
    </div>
  );
}
