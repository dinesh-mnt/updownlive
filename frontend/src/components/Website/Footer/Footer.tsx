"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { Twitter, Youtube, Facebook, Linkedin, Rss, Instagram, Send } from 'lucide-react';

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState({
    twitter: '#',
    telegram: '#',
    youtube: '#',
    facebook: '#',
    linkedin: '#',
    rss: '#',
    instagram: '#'
  });

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axiosInstance.get(`/settings/social-media`);
        if (res.data?.links) {
          // Merge fetched links with defaults '#'
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

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-900 pt-16 mt-16 font-sans text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        
        {/* Top section: Links, Newsletter, Social */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Logo & Links columns */}
          <div className="md:col-span-6 lg:col-span-4">
            <h3 className="text-3xl font-extrabold mb-8 flex items-center gap-1">
              <span className="text-brand-blue">Up</span><span className="text-black dark:text-white">Down</span><span className="text-brand-red">Live</span>
            </h3>
            
            <div className="flex gap-x-12">
              <ul className="flex flex-col gap-4">
                <li><Link href="/about" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/advertise" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Advertise with Us</Link></li>
                <li><Link href="/newsletter" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Newsletter</Link></li>
                <li><Link href="/live" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Live Feed</Link></li>
              </ul>
              <ul className="flex flex-col gap-4">
                <li><Link href="/finance" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Finance News</Link></li>
                <li><Link href="/education" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Education Center</Link></li>
                <li><Link href="/certified" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Get Certified</Link></li>
                <li><Link href="/brokers" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Find a Broker</Link></li>
                <li><Link href="/events" className="text-gray-600 dark:text-gray-400 font-medium hover:text-black dark:hover:text-white transition-colors">Events</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Subscribe */}
          <div className="md:col-span-6 lg:col-span-5 border-y md:border-y-0 md:border-l border-gray-200 dark:border-gray-800 py-8 md:py-0 md:pl-8 lg:pl-12">
            <h4 className="text-xl font-bold mb-6 text-black dark:text-white tracking-wide">Subscribe to our Daily News Wrap</h4>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-black dark:text-white placeholder-gray-500 px-4 py-3 rounded focus:outline-none focus:ring-1 focus:ring-brand-blue transition-all font-medium"
              />
              <button className="bg-brand-blue text-white px-8 py-3 rounded font-bold hover:bg-blue-600 shadow-md hover:shadow-lg transition-all whitespace-nowrap">
                Subscribe
              </button>
            </div>
            
            <label className="flex items-start gap-3 cursor-pointer group mb-6">
              <div className="relative flex items-center mt-1">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-brand-blue focus:ring-brand-blue bg-white dark:bg-gray-900 focus:ring-offset-white dark:focus:ring-offset-gray-900" />
              </div>
              <span className="text-xs text-gray-500 leading-relaxed">
                By submitting my contact details and message above, I acknowledge and agree to the UpDownLive <Link href="/terms" className="text-brand-blue hover:text-blue-400 transition-colors underline">Terms of Service</Link>
              </span>
            </label>

            <p className="text-xs text-gray-600 mb-0">
              This site is protected by reCAPTCHA and the Google <Link href="#" className="hover:text-gray-300 transition-colors underline">Privacy Policy</Link> and <Link href="#" className="hover:text-gray-300 transition-colors underline">Terms of Service</Link> apply.
            </p>
          </div>

          {/* Follow Us */}
          <div className="md:col-span-12 lg:col-span-3 lg:pl-8 flex flex-col justify-center lg:justify-start">
            <h4 className="text-xl font-bold mb-6 text-black dark:text-white tracking-wide">Follow Us</h4>
            <div className="flex flex-wrap gap-3">
               <Link href={socialLinks.twitter} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all" aria-label="Twitter"><Twitter size={18} /></Link>
               <Link href={socialLinks.telegram} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-white transition-all" aria-label="Telegram"><Send size={18} /></Link>
               <Link href={socialLinks.youtube} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all" aria-label="YouTube"><Youtube size={18} /></Link>
               <Link href={socialLinks.facebook} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all" aria-label="Facebook"><Facebook size={18} /></Link>
               <Link href={socialLinks.linkedin} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all" aria-label="LinkedIn"><Linkedin size={18} /></Link>
               <Link href={socialLinks.rss} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:text-warning hover:border-warning hover:text-orange-500 hover:border-orange-500 transition-all" aria-label="RSS"><Rss size={18} /></Link>
               <Link href={socialLinks.instagram} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:bg-gradient-to-tr hover:from-yellow-400 hover:to-pink-600 hover:text-white hover:border-transparent transition-all" aria-label="Instagram"><Instagram size={18} /></Link>
            </div>
          </div>

        </div>

        {/* Horizontal Divider */}
        <div className="w-full h-px bg-gray-200 dark:bg-gray-900 my-10 hidden md:block"></div>

        {/* Warnings Section */}
        <div className="flex flex-col gap-5 text-xs text-gray-500 leading-relaxed text-justify mt-8 md:mt-0 max-w-none">
          <p>
            <strong className="text-gray-300 font-semibold">High risk warning:</strong> Foreign exchange trading carries a high level of risk that may not be suitable for all investors. Leverage creates additional risk and loss exposure. Before you decide to trade foreign exchange, carefully consider your investment objectives, experience level, and risk tolerance. You could lose some or all of your initial investment; do not invest money that you cannot afford to lose. Educate yourself on the risks associated with foreign exchange trading and seek advice from an independent financial or tax advisor if you have any questions.
          </p>
          <p>
            <strong className="text-gray-300 font-semibold">Advisory warning:</strong> UpDownLive is not an investment advisor, UpDownLive provides references and links to selected news, blogs and other sources of economic and market information for informational purposes and as an educational service to its clients and prospects and does not endorse the opinions or recommendations of the blogs or other sources of information. Clients and prospects are advised to carefully consider the opinions and analysis offered in the blogs or other information sources in the context of the client or prospect's individual analysis and decision making. None of the blogs or other sources of information is to be considered as constituting a track record. Past performance is no guarantee of future results and UpDownLive specifically hereby acknowledges clients and prospects to carefully review all claims and representations made by advisors, bloggers, money managers and system vendors before investing any funds or opening an account with any Forex dealer. Any news, opinions, research, data, or other information contained within this website is provided on an "as-is" basis as a general market commentary and does not constitute investment or trading advice, and we do not purport to present the entire relevant or available public information with respect to a specific market or security. UpDownLive expressly disclaims any liability for any lost principal or profits which may arise directly or indirectly from the use of or reliance on such information, or with respect to any of the content presented within its website, nor its editorial choices.
          </p>
          <p>
            <strong className="text-gray-300 font-semibold">Disclaimer:</strong> UpDownLive may be compensated by the advertisers that appear on the website, based on your interaction with the advertisements or advertisers.
          </p>
        </div>

      </div>
      
      {/* Bottom Legal */}
      <div className="border-t border-gray-200 dark:border-gray-900 py-6 text-gray-600 dark:text-gray-500 text-xs font-medium bg-gray-50 dark:bg-black mt-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} UpDownLive Limited — Part of Ultimate Group</p>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
             <span>Read our</span>
             <Link href="/terms" className="hover:text-black dark:hover:text-white transition-colors underline underline-offset-4 decoration-gray-300 dark:decoration-gray-700 hover:decoration-black dark:hover:decoration-white">Terms</Link> 
             <Link href="/cookies" className="hover:text-black dark:hover:text-white transition-colors underline underline-offset-4 decoration-gray-300 dark:decoration-gray-700 hover:decoration-black dark:hover:decoration-white">Cookies</Link> and 
             <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors underline underline-offset-4 decoration-gray-300 dark:decoration-gray-700 hover:decoration-black dark:hover:decoration-white">Privacy Notice</Link>
          </div>
          <Link href="/manage-cookies" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-semibold">Manage Cookies</Link>
        </div>
      </div>
    </footer>
  );
}

