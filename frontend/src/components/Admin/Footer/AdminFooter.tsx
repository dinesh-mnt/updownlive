import React from 'react';

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t border-brand-border bg-white py-6 mt-auto">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm font-medium text-brand-gray">
          &copy; {currentYear} UpDownLive. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-sm font-bold text-brand-gray">
          <a href="#" className="hover:text-brand-blue transition-colors">Documentation</a>
          <a href="#" className="hover:text-brand-blue transition-colors">Support Portal</a>
          <a href="#" className="hover:text-brand-blue transition-colors">System Status</a>
        </div>
      </div>
    </footer>
  );
}
