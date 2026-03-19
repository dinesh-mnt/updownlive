"use client";
import React from 'react';
import AdminSidebar from '@/components/Admin/Sidebar/AdminSidebar';
import AdminHeader from '@/components/Admin/Header/AdminHeader';
import AdminFooter from '@/components/Admin/Footer/AdminFooter';
import AdminProtected from '@/components/Admin/AdminProtected';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProtected>
      <div className="flex h-screen w-full bg-white dark:bg-black font-outfit transition-colors duration-300">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto bg-white dark:bg-black">
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
          <AdminFooter />
        </div>
      </div>
    </AdminProtected>
  );
}
