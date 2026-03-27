"use client";
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { Users, Mail, Plug, TrendingUp, Clock, Building, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  createdAt: string;
  role: string;
}

interface Enquiry {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  message: string;
  companyName: string;
  createdAt: string;
}

interface Stats {
  userCount: number;
  enquiryCount: number;
  apiCount: number;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ userCount: 0, enquiryCount: 0, apiCount: 0 });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, enquiriesRes, ...apiKeyResults] = await Promise.allSettled([
          axiosInstance.get('/users'),
          axiosInstance.get('/enquiries'),
          axiosInstance.get('/settings/news-api-key'),
          axiosInstance.get('/settings/forex-news-api-key'),
          axiosInstance.get('/settings/forex-api-key'),
          axiosInstance.get('/settings/crypto-api-key'),
          axiosInstance.get('/settings/metals-api-key'),
        ]);

        // Users
        if (usersRes.status === 'fulfilled') {
          const users: User[] = usersRes.value.data || [];
          const sorted = [...users].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRecentUsers(sorted.slice(0, 5));
          setStats(prev => ({ ...prev, userCount: users.length }));
        }

        // Enquiries
        if (enquiriesRes.status === 'fulfilled') {
          const enquiries: Enquiry[] = enquiriesRes.value.data?.data || [];
          const sorted = [...enquiries].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRecentEnquiries(sorted.slice(0, 5));
          setStats(prev => ({ ...prev, enquiryCount: enquiries.length }));
        }

        // Count connected API keys
        const connectedCount = apiKeyResults.filter(
          r => r.status === 'fulfilled' && r.value.data?.apiKey
        ).length;
        setStats(prev => ({ ...prev, apiCount: connectedCount }));

      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const statCards = [
    {
      label: 'Active Users',
      value: stats.userCount,
      icon: Users,
      color: 'text-brand-blue',
      bg: 'bg-brand-blue/10 dark:bg-brand-blue/20',
      border: 'border-brand-blue/20',
      href: '/admin/dashboard/users',
    },
    {
      label: 'Enquired Leads',
      value: stats.enquiryCount,
      icon: Mail,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500/10 dark:bg-purple-500/20',
      border: 'border-purple-500/20',
      href: '/admin/dashboard/enquiries',
    },
    {
      label: 'APIs Connected',
      value: stats.apiCount,
      icon: Plug,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-500/10 dark:bg-green-500/20',
      border: 'border-green-500/20',
      href: '/admin/dashboard/api-integration',
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-blue to-blue-600 flex items-center justify-center shadow-lg shadow-brand-blue/20">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-black dark:text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-xs text-brand-gray dark:text-gray-400">Overview of your platform activity</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 p-6 hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <ArrowRight className="w-4 h-4 text-brand-gray dark:text-gray-600 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="text-3xl font-bold text-brand-black dark:text-white mb-1">
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
              ) : (
                card.value
              )}
            </div>
            <p className="text-sm text-brand-gray dark:text-gray-400 font-medium">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Users */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border dark:border-white/10">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-blue" />
              <h2 className="font-bold text-brand-black dark:text-white">New Users</h2>
            </div>
            <Link
              href="/admin/dashboard/users"
              className="text-xs font-semibold text-brand-blue hover:text-blue-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-brand-border dark:divide-white/10">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={`user-skel-${i}`} className="flex items-center gap-3 px-6 py-4">
                  <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-zinc-700 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-32 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
                    <div className="h-3 w-44 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse" />
                  </div>
                </div>
              ))
            ) : recentUsers.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-brand-gray dark:text-gray-500">
                No users registered yet
              </div>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id || user.email} className="flex items-center gap-3 px-6 py-4 hover:bg-brand-light dark:hover:bg-white/5 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-brand-blue to-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-black dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-brand-gray dark:text-gray-500 truncate">{user.email}</p>
                  </div>
                  <span className="text-xs text-brand-gray dark:text-gray-500 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {timeAgo(user.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border dark:border-white/10">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h2 className="font-bold text-brand-black dark:text-white">New Enquiries</h2>
            </div>
            <Link
              href="/admin/dashboard/enquiries"
              className="text-xs font-semibold text-brand-blue hover:text-blue-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-brand-border dark:divide-white/10">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={`enq-skel-${i}`} className="flex items-center gap-3 px-6 py-4">
                  <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-zinc-700 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-32 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
                    <div className="h-3 w-44 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse" />
                  </div>
                </div>
              ))
            ) : recentEnquiries.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-brand-gray dark:text-gray-500">
                No enquiries received yet
              </div>
            ) : (
              recentEnquiries.map((enq) => (
                <div key={enq._id} className="flex items-center gap-3 px-6 py-4 hover:bg-brand-light dark:hover:bg-white/5 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {enq.firstName?.charAt(0)?.toUpperCase() || 'E'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-brand-black dark:text-white truncate">
                        {enq.firstName} {enq.lastName}
                      </p>
                      <span className="text-xs font-semibold text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-full shrink-0">
                        {enq.department}
                      </span>
                    </div>
                    <p className="text-xs text-brand-gray dark:text-gray-500 truncate">
                      {enq.companyName ? (
                        <span className="flex items-center gap-1"><Building className="w-3 h-3 shrink-0" /> {enq.companyName}</span>
                      ) : (
                        enq.email
                      )}
                    </p>
                  </div>
                  <span className="text-xs text-brand-gray dark:text-gray-500 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {timeAgo(enq.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
