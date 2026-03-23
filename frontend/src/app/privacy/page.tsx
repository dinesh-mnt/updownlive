"use client";
import React from 'react';
import Link from 'next/link';
import { Shield, FileText, ArrowLeft } from 'lucide-react';
import PrivacyContent from '@/components/Legal/PrivacyContent';
import Header from '@/components/Website/Header/Header';
import Footer from '@/components/Website/Footer/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <div className="bg-white dark:bg-black min-h-screen font-sans text-black dark:text-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900/20 dark:via-black dark:to-blue-900/20 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-brand-blue hover:text-blue-600 transition-colors text-sm font-medium mb-8 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            
            <div className="flex items-start gap-6 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                <Shield size={32} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-black dark:text-white mb-4 tracking-tight">
                  Privacy Notice
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                  Your privacy matters to us. Learn how we collect, use, and protect your personal information.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Last Updated
              </span>
              <span className="font-medium text-brand-black dark:text-white">
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl p-8 md:p-12">
            <PrivacyContent />
          </div>

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Link 
              href="/terms"
              className="group bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-8 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                  <FileText size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-black dark:text-white mb-2 group-hover:text-brand-blue transition-colors">
                    Terms of Service
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Read our terms and conditions for using UpDownLive services
                  </p>
                </div>
              </div>
            </Link>

            <Link 
              href="/contact-us"
              className="group bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border border-green-200 dark:border-green-500/20 rounded-2xl p-8 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center shrink-0">
                  <FileText size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-black dark:text-white mb-2 group-hover:text-brand-blue transition-colors">
                    Contact Us
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Have questions about privacy? Get in touch with our team
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
