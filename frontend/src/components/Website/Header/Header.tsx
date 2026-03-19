"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, MonitorPlay, Home, User, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    setIsProfileOpen(false);
    router.push('/');
  };

  const user = session?.user;
  const isAdmin = (user as any)?.role === 'admin';

  return (
    <nav className="bg-white dark:bg-black border-b border-brand-border dark:border-white/10 sticky top-0 z-50 backdrop-blur-md shadow-lg font-outfit transition-colors duration-300">
      {/* Top Row: Logo, Search, Login/Profile */}
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center">
            <span className="text-brand-blue">Up</span>
            <span className="text-brand-black dark:text-white">Down</span>
            <span className="text-brand-red">Live</span>
          </h1>
        </Link>

        {/* Search Bar (Hidden on very small screens) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search markets, news, brokers..." 
              className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-brand-border dark:border-white/10 bg-brand-light dark:bg-white/5 text-brand-black dark:text-white placeholder:text-brand-gray dark:placeholder:text-gray-400 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 transition-all font-medium text-sm"
            />
          </div>
        </div>

        {/* Right Actions: Theme Toggle, Login or Profile Dropdown */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <ThemeToggle />
          {isPending ? (
            <div className="w-28 h-10 bg-white/5 animate-pulse rounded-lg"></div>
          ) : session ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 pl-3 rounded-full bg-white/5 border border-white/10 hover:border-brand-blue/50 hover:bg-white/10 transition-all group cursor-pointer"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-bold text-brand-black dark:text-white leading-tight">
                    {isAdmin ? 'Admin' : user?.name}
                  </p>
                  <p className="text-[10px] text-brand-gray dark:text-gray-400 font-medium truncate max-w-[120px]">{user?.email}</p>
                </div>
               <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-blue to-brand-blue/60 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-blue/20">
                  {isAdmin ? 'A' : (user?.name ? user.name.charAt(0).toUpperCase() : <User size={20} />)}
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#121212] border border-brand-border dark:border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-brand-border dark:border-white/10 bg-brand-light dark:bg-white/2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-brand-blue to-brand-blue/60 flex items-center justify-center text-white font-bold shadow-lg overflow-hidden">
                        {isAdmin ? 'A' : (user?.name ? user.name.charAt(0).toUpperCase() : <User size={24} />)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-brand-black dark:text-white truncate">{isAdmin ? 'Admin' : user?.name}</p>
                        <p className="text-[10px] text-brand-gray dark:text-gray-400 truncate mt-0.5">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    {isAdmin ? (
                      <Link 
                        href="/admin/dashboard" 
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-brand-gray dark:text-gray-300 hover:text-white hover:bg-brand-blue rounded-xl transition-all"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <LayoutDashboard size={18} />
                        Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link 
                          href="/profile" 
                          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-brand-gray dark:text-gray-300 hover:text-white hover:bg-brand-blue rounded-xl transition-all"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User size={18} />
                          My Profile
                        </Link>
                        <Link 
                          href="/settings" 
                          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-brand-gray dark:text-gray-300 hover:text-brand-black dark:hover:text-white hover:bg-brand-light dark:hover:bg-white/5 rounded-xl transition-all"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings size={18} />
                          Settings
                        </Link>
                      </>
                    )}
                  </div>
                  
                  <div className="p-2 border-t border-brand-border dark:border-white/10 bg-red-500/5">
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-brand-red hover:text-white hover:bg-brand-red rounded-xl transition-all"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/admin/login" className="bg-brand-blue text-white hover:bg-brand-blue/90 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40">
              Log In
            </Link>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
          <ThemeToggle />
          {/* Mobile Menu Icon */}
          <button 
            className="text-brand-black dark:text-white focus:outline-none hover:bg-brand-light dark:hover:bg-white/10 p-2 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Bottom Row: Navigation Links (Desktop) */}
      <div className="hidden md:block border-t border-brand-border dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 text-sm font-semibold text-brand-black/80 dark:text-white/80 py-3 overflow-x-auto no-scrollbar">
            <Link 
              href="/" 
              className={cn("flex items-center gap-2 px-4 py-2 rounded-lg transition-all shrink-0", pathname === '/' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-brand-black/80 dark:text-white/80 hover:bg-brand-light dark:hover:bg-white/5 hover:text-brand-black dark:hover:text-white')}
            >
              <Home size={16} /> Home
            </Link>
            <Link 
              href="/live-feed" 
              className={cn("flex items-center gap-2 px-4 py-2 rounded-lg transition-all shrink-0", pathname === '/live-feed' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-brand-black/80 dark:text-white/80 hover:bg-brand-light dark:hover:bg-white/5 hover:text-brand-black dark:hover:text-white')}
            >
              <MonitorPlay size={16} /> Live Feed
            </Link>
            {['Economic Calendar', 'Forex', 'Gold', 'Crypto', 'Charts', 'Brokers', 'About Us', 'Contact Us'].map((item) => {
              const href = `/${item.toLowerCase().replace(/\s+/g, '-')}`;
              return (
                <Link 
                  key={item}
                  href={href} 
                  className={cn("px-4 py-2 rounded-lg transition-all shrink-0", pathname === href ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-brand-black/80 dark:text-white/80 hover:bg-brand-light dark:hover:bg-white/5 hover:text-brand-black dark:hover:text-white')}
                >
                  {item}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Menu Container */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col px-6 py-4 bg-white dark:bg-zinc-900 border-t border-brand-border dark:border-white/10 max-h-[calc(100vh-80px)] overflow-y-auto transition-colors duration-300">
          {session && (
            <div className="mb-8 p-4 bg-brand-light dark:bg-white/5 rounded-2xl border border-brand-border dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-brand-blue to-brand-blue/60 flex items-center justify-center text-white font-bold">
                   {isAdmin ? 'A' : (user?.name ? user.name.charAt(0).toUpperCase() : <User size={24} />)}
                </div>
                <div>
                  <p className="text-brand-black dark:text-white font-bold">{isAdmin ? 'Admin' : user?.name}</p>
                  <p className="text-xs text-brand-gray dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-brand-border dark:border-white/10">
                {isAdmin ? (
                  <Link href="/admin/dashboard" className="col-span-2 flex items-center justify-center gap-2 py-3 bg-brand-blue rounded-xl text-xs font-bold text-white shadow-lg shadow-brand-blue/20" onClick={() => setIsMenuOpen(false)}>
                    <LayoutDashboard size={16} /> Admin Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/profile" className="flex items-center justify-center gap-2 py-2.5 bg-brand-light dark:bg-white/10 rounded-xl text-xs font-bold text-brand-black dark:text-white border border-brand-border dark:border-transparent" onClick={() => setIsMenuOpen(false)}>
                      <User size={14} /> Profile
                    </Link>
                    <Link href="/settings" className="flex items-center justify-center gap-2 py-2.5 bg-brand-light dark:bg-white/10 rounded-xl text-xs font-bold text-brand-black dark:text-white border border-brand-border dark:border-transparent" onClick={() => setIsMenuOpen(false)}>
                      <Settings size={14} /> Settings
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray dark:text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-brand-border dark:border-white/10 bg-brand-light dark:bg-white/5 text-brand-black dark:text-white placeholder:text-brand-gray dark:placeholder:text-gray-400 outline-none focus:border-brand-blue transition-all font-medium text-sm"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <Link href="/" className="flex items-center gap-3 py-4 border-b border-brand-border dark:border-white/10 font-semibold text-brand-black dark:text-white" onClick={() => setIsMenuOpen(false)}>
              <Home size={20} /> Home
            </Link>
            <Link href="/live-feed" className="flex items-center gap-3 py-4 border-b border-brand-border dark:border-white/10 font-semibold text-brand-black dark:text-white" onClick={() => setIsMenuOpen(false)}>
              <MonitorPlay size={20} /> Live Feed
            </Link>
            {['Economic Calendar', 'Forex', 'Gold', 'Crypto', 'Charts', 'Brokers', 'About Us', 'Contact Us'].map((item) => (
               <Link key={item} href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="py-4 border-b border-brand-border dark:border-white/10 font-semibold text-brand-black dark:text-white" onClick={() => setIsMenuOpen(false)}>
                 {item}
               </Link>
            ))}
          </div>

          {!session ? (
            <Link href="/admin/login" className="bg-brand-blue text-white text-center mt-6 py-4 rounded-lg font-semibold w-full shadow-lg shadow-brand-blue/30" onClick={() => setIsMenuOpen(false)}>
              Log In
            </Link>
          ) : (
            <button 
              onClick={handleLogout}
              className="mt-6 flex items-center justify-center gap-3 py-4 bg-brand-red/10 text-brand-red rounded-xl font-bold border border-brand-red/20 shadow-lg"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}