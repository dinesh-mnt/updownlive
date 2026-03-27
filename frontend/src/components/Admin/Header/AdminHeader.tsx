"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';
import { navigation } from '../Sidebar/AdminSidebar';
import { useAuth } from '@/hooks/use-auth';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminHeader() {
  const pathname = usePathname();
  const { user } = useAuth();

  let currentTitle = "System Administration";
  for (const item of navigation) {
    if (item.href && (pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/admin/dashboard'))) {
      currentTitle = item.title;
      break;
    }
    if (item.subItems) {
      const subItem = item.subItems.find(sub => pathname === sub.href || pathname.startsWith(sub.href + '/'));
      if (subItem) { currentTitle = subItem.title; break; }
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-brand-border dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md px-6 sticky top-0 z-30 font-outfit transition-colors duration-300">
      <div className="flex items-center gap-2">
        <h2 className="ml-1 font-bold text-brand-black dark:text-white tracking-tight text-lg">{currentTitle}</h2>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="flex items-center gap-3 pl-4 border-l border-brand-border dark:border-white/10 ml-2">
          <div className="hidden sm:flex flex-col min-w-0 text-right">
            <span className="text-sm font-bold text-brand-black dark:text-white truncate leading-tight">
              {user?.name ?? 'Admin'}
            </span>
            <span className="text-xs text-brand-gray dark:text-gray-500 truncate leading-snug">
              {user?.email ?? ''}
            </span>
          </div>
          <div className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center font-black text-base shadow-md shrink-0 uppercase">
            {user?.name?.charAt(0) ?? <User size={18} />}
          </div>
        </div>
      </div>
    </header>
  );
}
