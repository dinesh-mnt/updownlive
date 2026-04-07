"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { Twitter, Youtube, Facebook, Linkedin, Instagram, Send } from 'lucide-react';

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState({
    twitter: '#', telegram: '#', youtube: '#', facebook: '#', linkedin: '#', instagram: '#'
  });
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axiosInstance.get('/settings/social-media')
      .then(res => {
        if (res.data?.links) {
          setSocialLinks(prev => {
            const up: any = { ...prev };
            Object.keys(res.data.links).forEach(k => { if (res.data.links[k]) up[k] = res.data.links[k]; });
            return up;
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !agreed) { setMessage('Please enter your email and agree to the terms.'); return; }
    setLoading(true);
    setMessage('');
    try {
      await axiosInstance.post('/newsletter/subscribe', { email });
      setMessage('Successfully subscribed to our newsletter!');
      setEmail('');
      setAgreed(false);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 10000);
    }
  };

  const isSuccess = message.includes('Success') || message.includes('subscribed');

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-900 pt-10 md:pt-16 mt-10 md:mt-16 font-sans text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 md:mb-12">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-8 lg:gap-8">

          {/* Nav links */}
          <div className="xl:col-span-4">
            <h3 className="text-2xl md:text-3xl font-extrabold mb-5 flex items-center gap-1">
              <span className="text-brand-blue">Up</span><span className="text-black dark:text-white">Down</span><span className="text-brand-red">Live</span>
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                ['/', 'Home'], ['/live-feed', 'Live Feed'], ['/economic-calendar', 'Economic Calendar'],
                ['/forex', 'Forex'], ['/gold', 'Gold/Oil'], ['/crypto', 'Crypto'],
                ['/stocks', 'Stocks'], ['/charts', 'Charts'], ['/brokers', 'Brokers'],
                ['/about-us', 'About Us'], ['/contact-us', 'Contact Us'],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors text-sm">{label}</Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="xl:col-span-5 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 pt-8 md:pt-0 md:pl-8 lg:pl-12">
            <h4 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-black dark:text-white">Subscribe to our Daily News Wrap</h4>
            <form onSubmit={handleSubscribe}>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-black dark:text-white placeholder-gray-500 px-4 py-3 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue transition-all"
                  required
                />
                <button type="submit" disabled={loading}
                  className="bg-brand-blue text-white px-6 py-3 rounded font-bold hover:bg-blue-600 transition-all whitespace-nowrap disabled:opacity-50 text-sm">
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 shrink-0 rounded border-gray-300 dark:border-gray-700 text-brand-blue focus:ring-brand-blue bg-white dark:bg-gray-900" required />
                <span className="text-xs text-gray-500 leading-relaxed">
                  By submitting, I agree to the UpDownLive <Link href="/terms" className="text-brand-blue hover:text-blue-400 underline">Terms of Service</Link>
                </span>
              </label>
            </form>
          </div>

          {/* Follow Us */}
          <div className="xl:col-span-3 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 pt-8 md:pt-0 md:pl-8">
            <h4 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-black dark:text-white">Follow Us</h4>
            <div className="flex flex-wrap gap-3">
              {[
                { href: socialLinks.twitter, label: 'Twitter', icon: Twitter, hover: 'hover:bg-brand-blue hover:border-brand-blue' },
                { href: socialLinks.telegram, label: 'Telegram', icon: Send, hover: 'hover:bg-blue-500 hover:border-blue-500' },
                { href: socialLinks.youtube, label: 'YouTube', icon: Youtube, hover: 'hover:bg-red-600 hover:border-red-600' },
                { href: socialLinks.facebook, label: 'Facebook', icon: Facebook, hover: 'hover:bg-blue-600 hover:border-blue-600' },
                { href: socialLinks.linkedin, label: 'LinkedIn', icon: Linkedin, hover: 'hover:bg-blue-700 hover:border-blue-700' },
                { href: socialLinks.instagram, label: 'Instagram', icon: Instagram, hover: 'hover:bg-linear-to-tr hover:from-yellow-400 hover:to-pink-600 hover:border-transparent' },
              ].map(({ href, label, icon: Icon, hover }) => (
                <Link key={label} href={href} aria-label={label}
                  className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-white transition-all ${hover}`}>
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Risk divider */}
        <div className="relative my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-linear-to-r from-transparent via-red-500/60 to-amber-500/60" />
          <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-red-500 dark:text-red-400 px-3 py-1 rounded-full border border-red-500/30 bg-red-50 dark:bg-red-500/10">
            ⚠ Risk Warnings
          </span>
          <div className="flex-1 h-px bg-linear-to-l from-transparent via-red-500/60 to-amber-500/60" />
        </div>

        {/* Warnings */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 px-4 py-3 md:px-5 md:py-4">
            <p className="text-xs text-red-700 dark:text-red-300/80 leading-relaxed">
              <strong className="text-red-600 dark:text-red-400 font-bold">High risk warning: </strong>
              Foreign exchange trading carries a high level of risk that may not be suitable for all investors. Leverage creates additional risk and loss exposure. Before you decide to trade foreign exchange, carefully consider your investment objectives, experience level, and risk tolerance. You could lose some or all of your initial investment; do not invest money that you cannot afford to lose.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 px-4 py-3 md:px-5 md:py-4">
            <p className="text-xs text-amber-700 dark:text-amber-300/80 leading-relaxed">
              <strong className="text-amber-600 dark:text-amber-400 font-bold">Advisory warning: </strong>
              UpDownLive is not an investment advisor. UpDownLive provides references and links to selected news and other sources of economic and market information for informational purposes only and does not endorse the opinions or recommendations of those sources. Past performance is no guarantee of future results.
            </p>
          </div>
          <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 px-4 py-3 md:px-5 md:py-4">
            <p className="text-xs text-red-700 dark:text-red-300/80 leading-relaxed">
              <strong className="text-red-600 dark:text-red-400 font-bold">Disclaimer: </strong>
              UpDownLive may be compensated by the advertisers that appear on the website, based on your interaction with the advertisements or advertisers.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 dark:border-gray-900 py-5 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-medium text-gray-600 dark:text-gray-500">
          <p>&copy; {new Date().getFullYear()} UpDownLive Limited</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/terms" className="hover:text-black dark:hover:text-white transition-colors underline underline-offset-4 decoration-gray-300 dark:decoration-gray-700">Terms</Link>
            <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors underline underline-offset-4 decoration-gray-300 dark:decoration-gray-700">Privacy Notice</Link>
          </div>
        </div>
      </div>

      {/* Subscribe modal */}
      {message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMessage('')} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-300">
            <button onClick={() => setMessage('')} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex justify-center mb-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isSuccess ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                {isSuccess
                  ? <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  : <svg className="w-7 h-7 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                }
              </div>
            </div>
            <h3 className="text-lg font-bold text-center mb-2 text-gray-900 dark:text-white">{isSuccess ? 'Success!' : 'Oops!'}</h3>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-5 text-sm">{message}</p>
            <button onClick={() => setMessage('')} className={`w-full py-3 rounded-lg font-semibold text-sm text-white transition-all ${isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>OK</button>
            <p className="text-center text-xs text-gray-400 mt-3">Auto-closing in 10 seconds...</p>
          </div>
        </div>
      )}
    </footer>
  );
}
