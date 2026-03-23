"use client";
import React from 'react';
import Link from 'next/link';
import { FileText, Shield, ArrowLeft } from 'lucide-react';
import TermsContent from '@/components/Legal/TermsContent';
import Header from '@/components/Website/Header/Header';
import Footer from '@/components/Website/Footer/Footer';

export default function TermsPage() {
  return (
    <>
      <Header />
      <div className="bg-white dark:bg-black min-h-screen font-sans text-black dark:text-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-black dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-brand-blue hover:text-blue-600 transition-colors text-sm font-medium mb-8 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            
            <div className="flex items-start gap-6 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center shrink-0">
                <FileText size={32} className="text-brand-blue" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-black dark:text-white mb-4 tracking-tight">
                  Terms of Service
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                  Please read these terms carefully before using our services. By accessing UpDownLive, you agree to be bound by these terms.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Effective Date
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
            <TermsContent />
          </div>

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Link 
              href="/privacy"
              className="group bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-500/20 rounded-2xl p-8 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Shield size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-black dark:text-white mb-2 group-hover:text-brand-blue transition-colors">
                    Privacy Notice
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Learn how we collect, use, and protect your personal information
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
                    Have questions? Get in touch with our support team
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
