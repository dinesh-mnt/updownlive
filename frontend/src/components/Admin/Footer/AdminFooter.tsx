import React from 'react';

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t border-brand-border dark:border-white/10 bg-white dark:bg-black py-6 mt-auto transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm font-medium text-brand-gray dark:text-gray-500">
          &copy; {currentYear} UpDownLive. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-sm font-bold text-brand-gray dark:text-gray-400">
          <a href="#" className="hover:text-brand-blue transition-colors">Documentation</a>
          <a href="#" className="hover:text-brand-blue transition-colors">Support Portal</a>
          <a href="#" className="hover:text-brand-blue transition-colors">System Status</a>
        </div>
      </div>
    </footer>
  );
}
