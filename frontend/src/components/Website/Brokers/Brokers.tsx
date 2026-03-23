"use client";
import React from "react";
import { Building2, Clock, Sparkles } from "lucide-react";

export default function Brokers() {
  return (
    <div className="bg-white dark:bg-black min-h-screen font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-brand-black dark:text-white mb-3 tracking-tight">
            Brokers
          </h1>
          <p className="text-brand-gray dark:text-gray-400 text-lg">
            Comprehensive broker reviews and comparisons
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-2xl w-full">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border-2 border-blue-200 dark:border-blue-500/20 rounded-3xl p-12 text-center shadow-xl">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-brand-blue to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Building2 size={48} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                      <Sparkles size={20} className="text-yellow-900" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-black dark:text-white mb-4">
                Coming Soon
              </h2>

              {/* Description */}
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                We're working hard to bring you comprehensive broker reviews, comparisons, and ratings. 
                This section will feature detailed analysis of forex brokers, trading platforms, and regulatory information.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-blue-200 dark:border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-brand-blue font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-black dark:text-white mb-1">Broker Reviews</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">In-depth analysis of top brokers</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-blue-200 dark:border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-brand-blue font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-black dark:text-white mb-1">Comparisons</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Side-by-side broker comparisons</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-blue-200 dark:border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-brand-blue font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-black dark:text-white mb-1">Ratings</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Expert ratings and user reviews</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-blue-200 dark:border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-brand-blue font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-black dark:text-white mb-1">Regulation Info</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Regulatory status and compliance</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-500/20 rounded-full px-6 py-3 shadow-sm">
                <Clock size={18} className="text-brand-blue animate-pulse" />
                <span className="text-sm font-semibold text-brand-black dark:text-white">
                  Under Development
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Stay tuned for updates. We'll notify you when this section goes live.
          </p>
        </div>
      </div>
    </div>
  );
}
