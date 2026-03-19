"use client";
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Search, User } from 'lucide-react';
import { navigation } from '../Sidebar/AdminSidebar';
import { authClient } from '@/lib/auth-client';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminHeader() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: sessionData } = await authClient.getSession();
        if (sessionData) {
          setProfile(sessionData.user);
        }
      } catch (e) {
        console.error("Failed to fetch profile in header: ", e);
      }
    };
    fetchProfile();
  }, []);

  // Find the matching navigation item title
  let currentTitle = "System Administration";
  
  for (const item of navigation) {
    if (item.href && (pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/admin/dashboard'))) {
      currentTitle = item.title;
      break;
    }
    
    if (item.subItems) {
      const subItem = item.subItems.find(sub => pathname === sub.href || pathname.startsWith(sub.href + '/'));
      if (subItem) {
        currentTitle = subItem.title; // Or `{item.title} / {subItem.title}` 
        break;
      }
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-brand-border dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md px-6 sticky top-0 z-30 font-outfit transition-colors duration-300">
      <div className="flex items-center gap-2">
        <h2 className="ml-1 font-bold text-brand-black dark:text-white tracking-tight text-lg">{currentTitle}</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex relative text-brand-black dark:text-white">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray dark:text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search admin panel..." 
            className="pl-9 pr-4 py-2 bg-brand-light dark:bg-zinc-900 border border-brand-border dark:border-white/10 rounded-full text-sm font-medium focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all w-64 text-brand-black dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button className="relative p-2.5 text-brand-gray dark:text-gray-400 hover:text-brand-blue rounded-full hover:bg-brand-light dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/10 shadow-sm transition-colors">
            <Bell size={18} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand-red border-2 border-white dark:border-black rounded-full"></span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3 pl-4 border-l border-brand-border dark:border-white/10 ml-2">
          <div className="hidden sm:flex flex-col min-w-0 text-right">
            <span className="text-sm font-bold text-brand-black dark:text-white truncate leading-tight">
              {profile?.name ?? 'Admin'}
            </span>
            <span className="text-xs text-brand-gray dark:text-gray-500 truncate leading-snug">
              {profile?.email ?? 'admin@updownlive.com'}
            </span>
          </div>
          <div className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center font-black text-base shadow-md shrink-0 uppercase">
            {profile?.name?.charAt(0) ?? <User size={18} />}
          </div>
        </div>
      </div>
    </header>
  );
}
