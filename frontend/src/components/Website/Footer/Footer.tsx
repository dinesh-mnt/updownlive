"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { Twitter, Youtube, Facebook, Linkedin, Instagram, Send } from 'lucide-react';

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState({
    twitter: '#',
    telegram: '#',
    youtube: '#',
    facebook: '#',
    linkedin: '#',
    instagram: '#'
  });
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axiosInstance.get(`/settings/social-media`);
        if (res.data?.links) {
          setSocialLinks(prev => {
            const up: any = { ...prev };
            Object.keys(res.data.links).forEach(key => {
              if (res.data.links[key]) up[key] = res.data.links[key];
            });
            return up;
          });
        }
      } catch (e) {
        console.error("Failed to load generic social media footer links", e);
      }
    };
    fetchLinks();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !agreed) {
      setMessage('Please enter your email and agree to the terms.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await axiosInstance.post('/newsletter/subscribe', { email });
      setMessage('Successfully subscribed to our newsletter!');
      setEmail('');
      setAgreed(false);
      
      // Auto-close modal after 10 seconds
      setTimeout(() => {
        setMessage('');
      }, 10000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to subscribe. Please try again.');
      
      // Auto-close error modal after 10 seconds
      setTimeout(() => {
        setMessage('');
      }, 10000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-900 pt-16 mt-16 font-sans text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        
        {/* Top section: Links, Newsletter, Social */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Logo & Navigation Links */}
          <div className="md:col-span-6 lg:col-span-4">
            <h3 className="text-3xl font-extrabold mb-8 flex items-center gap-1">
              <span className="text-brand-blue">Up</span><span className="text-black dark:text-white">Down</span><span className="text-brand-red">Live</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <Link href="/" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Home</Link>
              <Link href="/live-feed" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Live Feed</Link>
              <Link href="/economic-calendar" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Economic Calendar</Link>
              <Link href="/forex" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Forex</Link>
              <Link href="/gold" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Gold</Link>
              <Link href="/crypto" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Crypto</Link>
              <Link href="/charts" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Charts</Link>
              <Link href="/brokers" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Brokers</Link>
              <Link href="/about-us" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">About Us</Link>
              <Link href="/contact-us" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Contact Us</Link>
            </div>
          </div>

          {/* Newsletter Subscribe */}
          <div className="md:col-span-6 lg:col-span-5 border-y md:border-y-0 md:border-l border-gray-200 dark:border-gray-800 py-8 md:py-0 md:pl-8 lg:pl-12">
            <h4 className="text-xl font-bold mb-6 text-black dark:text-white tracking-wide">Subscribe to our Daily News Wrap</h4>
            <form onSubmit={handleSubscribe}>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address" 
                  className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-black dark:text-white placeholder-gray-500 px-4 py-3 rounded focus:outline-none focus:ring-1 focus:ring-brand-blue transition-all font-medium"
                  required
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-brand-blue text-white px-8 py-3 rounded font-bold hover:bg-blue-600 shadow-md hover:shadow-lg transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center mt-1">
                  <input 
                    type="checkbox" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-brand-blue focus:ring-brand-blue bg-white dark:bg-gray-900 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                    required
                  />
                </div>
                <span className="text-xs text-gray-500 leading-relaxed">
                  By submitting my contact details and message above, I acknowledge and agree to the UpDownLive <Link href="/terms" className="text-brand-blue hover:text-blue-400 transition-colors underline">Terms of Service</Link>
                </span>
              </label>

              {/* Modal Popup */}
              {message && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                  {/* Backdrop with blur */}
                  <div 
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setMessage('')}
                  ></div>
                  
                  {/* Modal Content */}
                  <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
                    {/* Close Button */}
                    <button
                      onClick={() => setMessage('')}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      {message.includes('Success') || message.includes('subscribed') ? (
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">
                      {message.includes('Success') || message.includes('subscribed') ? 'Success!' : 'Oops!'}
                    </h3>

                    {/* Message */}
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                      {message}
                    </p>

                    {/* OK Button */}
                    <button
                      onClick={() => setMessage('')}
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        message.includes('Success') || message.includes('subscribed')
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      OK
                    </button>

                    {/* Auto-close indicator */}
                    <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
                      Auto-closing in 10 seconds...
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Follow Us */}
          <div className="md:col-span-12 lg:col-span-3 lg:pl-8 flex flex-col justify-center lg:justify-start">
            <h4 className="text-xl font-bold mb-6 text-black dark:text-white tracking-wide">Follow Us</h4>
            <div className="flex flex-wrap gap-3">
               <Link href={socialLinks.twitter} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all" aria-label="Twitter"><Twitter size={18} /></Link>
               <Link href={socialLinks.telegram} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all" aria-label="Telegram"><Send size={18} /></Link>
               <Link href={socialLinks.youtube} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all" aria-label="YouTube"><Youtube size={18} /></Link>
               <Link href={socialLinks.facebook} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all" aria-label="Facebook"><Facebook size={18} /></Link>
               <Link href={socialLinks.linkedin} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all" aria-label="LinkedIn"><Linkedin size={18} /></Link>
               <Link href={socialLinks.instagram} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-linear-to-tr hover:from-yellow-400 hover:to-pink-600 hover:text-white hover:border-transparent transition-all" aria-label="Instagram"><Instagram size={18} /></Link>
            </div>
          </div>

        </div>

        {/* Horizontal Divider */}
        <div className="relative my-10 hidden md:flex items-center gap-4">
          <div className="flex-1 h-px bg-linear-to-r from-transparent via-red-500/60 to-amber-500/60" />
          <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-red-500 dark:text-red-400 px-3 py-1 rounded-full border border-red-500/30 bg-red-50 dark:bg-red-500/10">
            ⚠ Risk Warnings
          </span>
          <div className="flex-1 h-px bg-linear-to-l from-transparent via-red-500/60 to-amber-500/60" />
        </div>

        {/* Warnings Section */}
        <div className="flex flex-col gap-4 mt-8 md:mt-0">
          <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 px-5 py-4">
            <p className="text-xs text-red-700 dark:text-red-300/80 leading-relaxed text-justify">
              <strong className="text-red-600 dark:text-red-400 font-bold">High risk warning: </strong>
              Foreign exchange trading carries a high level of risk that may not be suitable for all investors. Leverage creates additional risk and loss exposure. Before you decide to trade foreign exchange, carefully consider your investment objectives, experience level, and risk tolerance. You could lose some or all of your initial investment; do not invest money that you cannot afford to lose. Educate yourself on the risks associated with foreign exchange trading and seek advice from an independent financial or tax advisor if you have any questions.
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 px-5 py-4">
            <p className="text-xs text-amber-700 dark:text-amber-300/80 leading-relaxed text-justify">
              <strong className="text-amber-600 dark:text-amber-400 font-bold">Advisory warning: </strong>
              UpDownLive is not an investment advisor, UpDownLive provides references and links to selected news, blogs and other sources of economic and market information for informational purposes and as an educational service to its clients and prospects and does not endorse the opinions or recommendations of the blogs or other sources of information. Clients and prospects are advised to carefully consider the opinions and analysis offered in the blogs or other information sources in the context of the client or prospect's individual analysis and decision making. None of the blogs or other sources of information is to be considered as constituting a track record. Past performance is no guarantee of future results and UpDownLive specifically advises clients and prospects to carefully review all claims and representations made by advisors, bloggers, money managers and system vendors before investing any funds or opening an account with any Forex dealer. Any news, opinions, research, data, or other information contained within this website is provided on an "as-is" basis as a general market commentary and does not constitute investment or trading advice. UpDownLive expressly disclaims any liability for any lost principal or profits which may arise directly or indirectly from the use of or reliance on such information.
            </p>
          </div>

          <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 px-5 py-4">
            <p className="text-xs text-red-700 dark:text-red-300/80 leading-relaxed text-justify">
              <strong className="text-red-600 dark:text-red-400 font-bold">Disclaimer: </strong>
              UpDownLive may be compensated by the advertisers that appear on the website, based on your interaction with the advertisements or advertisers.
            </p>
          </div>
        </div>

      </div>
      
      {/* Bottom Legal */}
      <div className="border-t border-gray-200 dark:border-gray-900 py-6 text-gray-600 dark:text-gray-500 text-xs font-medium bg-gray-50 dark:bg-black mt-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} UpDownLive Limited</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
             <Link href="/terms" className="hover:text-black dark:hover:text-white transition-colors underline underline-offset-4 decoration-gray-300 dark:decoration-gray-700 hover:decoration-black dark:hover:decoration-white">Terms</Link>
             <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors underline underline-offset-4 decoration-gray-300 dark:decoration-gray-700 hover:decoration-black dark:hover:decoration-white">Privacy Notice</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

