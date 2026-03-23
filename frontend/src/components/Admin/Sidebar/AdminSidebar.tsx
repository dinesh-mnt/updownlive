"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  LogOut, LayoutDashboard, Settings, Globe, Database, User, ChevronDown, ChevronRight, Mail, Send, MessageSquare
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export interface SubMenuItem {
  title: string;
  href: string;
}

export interface NavigationItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  subItems?: SubMenuItem[];
}

export const navigation: NavigationItem[] = [
  {
    title: 'Dashboard Overview',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
  },
  {
    title: 'API Integrations',
    icon: Database,
    href: '/admin/dashboard/api-integration',
  },
  {
    title: 'Enquiry Detail',
    icon: Mail,
    href: '/admin/dashboard/enquiries',
  },
  {
    title: 'User Management',
    icon: User,
    href: '/admin/dashboard/users',
  },
  {
    title: 'Comments',
    icon: MessageSquare,
    href: '/admin/dashboard/comments',
  },
  {
    title: 'Newsletter',
    icon: Send,
    subItems: [
      { title: 'Subscribers', href: '/admin/dashboard/newsletter/subscribers' },
      { title: 'Send Mail', href: '/admin/dashboard/newsletter/send-mail' }
    ]
  },
  {
    title: 'Settings',
    icon: Settings,
    subItems: [
      { title: 'General Information', href: '/admin/dashboard/settings/general' },
      { title: 'Social Media', href: '/admin/dashboard/settings/social-media' },
      { title: 'SEO Settings', href: '/admin/dashboard/settings/seo' }
    ]
  },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const isMainItemActive = useCallback((href: string) => {
    if (href === '/admin/dashboard') return pathname === href;
    return pathname.startsWith(href);
  }, [pathname]);

  const isSubItemActive = useCallback((href: string) => {
    if (href === '/admin/dashboard') return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  }, [pathname]);

  const hasAnyActiveChild = useCallback((subItems: SubMenuItem[]) => {
    return subItems.some(sub => isSubItemActive(sub.href));
  }, [isSubItemActive]);

  useEffect(() => {
    const activeParents = navigation
      .filter(item => item.subItems && hasAnyActiveChild(item.subItems))
      .map(item => item.title);

    if (activeParents.length > 0) {
      setExpandedItems(prev => [...new Set([...prev, ...activeParents])]);
    }
  }, [pathname, hasAnyActiveChild]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex h-full w-64 shrink-0 flex-col font-outfit bg-white dark:bg-brand-black border-r border-brand-border dark:border-white/10 shadow-sm z-40 text-brand-black dark:text-white transition-colors duration-300">
      {/* Logo Header */}
      <div className="flex px-4 py-5 border-b border-brand-border dark:border-white/10 items-center justify-center">
        <Link href="/admin/dashboard" className="flex items-center justify-center w-full rounded-lg p-2 shadow-sm hover:opacity-90 transition-opacity">
          <h1 className="text-2xl font-black tracking-tighter flex items-center">
            <span className="text-brand-blue">Up</span>
            <span className="text-brand-black dark:text-white">Down</span>
            <span className="text-brand-red">Live</span>
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        <div className="px-3 mb-3 mt-1 text-[10px] font-bold uppercase tracking-widest text-brand-gray dark:text-gray-400">
          Platform Control
        </div>
        
        {navigation.map((item) => {
          const isExpanded = expandedItems.includes(item.title);
          const Icon = item.icon;

          // If item has href, render as single link
          if (item.href) {
            const itemIsActive = isMainItemActive(item.href);

            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "w-full flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 group mb-1",
                  itemIsActive
                    ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20"
                    : "text-brand-gray dark:text-gray-300 hover:bg-brand-blue/10 hover:text-brand-blue dark:hover:bg-white/10 dark:hover:text-white",
                )}
              >
                <Icon
                  className={cn(
                    "mr-3 h-[18px] w-[18px] transition-colors",
                    itemIsActive ? "text-white" : "text-brand-gray dark:text-gray-400 group-hover:text-brand-blue dark:group-hover:text-white",
                  )}
                />
                <span>{item.title}</span>
              </Link>
            );
          }

          // If item has subItems, render as expandable section
          const parentHasActiveChild = item.subItems ? hasAnyActiveChild(item.subItems) : false;

          return (
            <div key={item.title} className="space-y-1 mb-1">
              {/* Main Menu Item */}
              <button
                onClick={() => toggleExpanded(item.title)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 group",
                  parentHasActiveChild
                    ? "bg-brand-blue/10 dark:bg-white/10 text-brand-blue dark:text-white"
                    : "text-brand-gray dark:text-gray-300 hover:bg-brand-blue/10 hover:text-brand-blue dark:hover:bg-white/10 dark:hover:text-white",
                  "focus:outline-none",
                )}
              >
                <div className="flex items-center">
                  <Icon
                    className={cn(
                      "mr-3 h-[18px] w-[18px] transition-colors",
                      parentHasActiveChild
                        ? "text-brand-blue dark:text-white"
                        : "text-brand-gray dark:text-gray-400 group-hover:text-brand-blue dark:group-hover:text-white"
                    )}
                  />
                  <span>{item.title}</span>
                </div>
                <div className="flex items-center">
                  {parentHasActiveChild && (
                    <div className="w-2 h-2 bg-brand-blue dark:bg-white rounded-full mr-2" />
                  )}
                  {isExpanded ? (
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      parentHasActiveChild ? "text-brand-blue dark:text-white" : "text-brand-gray dark:text-gray-400"
                    )} />
                  ) : (
                    <ChevronRight className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      parentHasActiveChild ? "text-brand-blue dark:text-white" : "text-brand-gray dark:text-gray-400"
                    )} />
                  )}
                </div>
              </button>

              {/* Sub Menu Items */}
              {isExpanded && item.subItems && (
                <div className="ml-6 space-y-1 border-l-2 border-white/20 pl-4 py-1">
                  {item.subItems.map((subItem) => {
                    const subItemIsActive = isSubItemActive(subItem.href);

                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 group relative",
                          subItemIsActive
                            ? "bg-brand-blue text-white shadow-md font-medium"
                            : "text-brand-gray dark:text-gray-300 hover:bg-brand-blue/10 hover:text-brand-blue dark:hover:bg-white/10 dark:hover:text-white",
                        )}
                      >
                        {subItemIsActive && (
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-full -ml-4" />
                        )}
                        <span>{subItem.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="border-t border-brand-border dark:border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-4 py-3 text-sm font-bold text-brand-black dark:text-white rounded-lg hover:bg-brand-red hover:text-white transition-all group"
        >
          <LogOut className="mr-3 h-[18px] w-[18px] group-hover:-translate-x-0.5 transition-transform" />
          Log out
        </button>
      </div>
    </div>
  );
}
