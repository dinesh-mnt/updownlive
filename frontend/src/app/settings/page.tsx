"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import { authClient } from "@/lib/auth-client";
import { 
  User, 
  Palette, 
  Loader2, 
  ArrowLeft,
  Mail,
  ShieldAlert,
  Sun,
  Moon,
  Monitor,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/UI/Tabs";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/admin/login");
    }
  }, [isPending, session, router]);

  if (isPending || !mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-brand-blue animate-spin mx-auto mb-4" />
          <p className="text-brand-black dark:text-white font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user;

  const handlePasswordReset = async () => {
      setResetLoading(true);
      try {
        await authClient.requestPasswordReset({
          email: user.email,
          redirectTo: "/reset-password",
        });
        setResetSent(true);
      } catch (error) {
        console.error(error);
      } finally {
        setResetLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-white dark:bg-black font-outfit transition-colors duration-300 flex flex-col">
      <Navbar />
      <MarketTicker />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link 
              href="/profile" 
              className="inline-flex items-center text-sm font-bold text-brand-blue hover:text-brand-black dark:hover:text-white transition-colors mb-4"
            >
              <ArrowLeft size={14} className="mr-1" /> Back to Profile
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-black dark:text-white tracking-tight mb-4">
              Account Settings
            </h1>
            <p className="text-brand-gray dark:text-gray-400 text-lg">
              Manage your personal information and application preferences.
            </p>
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8 bg-brand-light dark:bg-white/5 border border-brand-border dark:border-white/10 rounded-2xl p-1 h-auto">
              <TabsTrigger 
                value="profile"
                className="py-3 rounded-xl data-[state=active]:bg-brand-blue data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-brand-gray dark:text-gray-400"
              >
                <User size={18} className="mr-2" />Profile
              </TabsTrigger>
              <TabsTrigger 
                value="appearance"
                className="py-3 rounded-xl data-[state=active]:bg-brand-blue data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-brand-gray dark:text-gray-400"
              >
                <Palette size={18} className="mr-2" />Appearance
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-brand-light dark:bg-white/5 backdrop-blur-2xl border border-brand-border dark:border-white/10 rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-brand-black dark:text-white mb-6">User Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-brand-gray dark:text-gray-400 text-sm font-semibold mb-1">Full Name</p>
                    <p className="text-lg font-bold text-brand-black dark:text-white bg-white dark:bg-black/50 p-4 rounded-xl border border-brand-border dark:border-white/10">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-brand-gray dark:text-gray-400 text-sm font-semibold mb-1">Email Address</p>
                    <p className="text-lg font-bold text-brand-black dark:text-white bg-white dark:bg-black/50 p-4 rounded-xl border border-brand-border dark:border-white/10 flex flex-wrap items-center gap-2 justify-between">
                      <span className="truncate">{user.email}</span>
                      {user.emailVerified ? (
                        <span className="flex shrink-0 items-center text-xs font-bold text-green-600 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full"><CheckCircle2 size={12} className="mr-1"/> Verified</span>
                      ) : (
                        <span className="flex shrink-0 items-center text-xs font-bold text-brand-red bg-brand-red/10 px-2 py-1 rounded-full"><XCircle size={12} className="mr-1"/> Unverified</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-brand-gray dark:text-gray-400 text-sm font-semibold mb-1">Role</p>
                    <p className="text-lg font-bold text-brand-black dark:text-white bg-white dark:bg-black/50 p-4 rounded-xl border border-brand-border dark:border-white/10 capitalize">{(user as any).role || 'User'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-brand-light dark:bg-white/5 backdrop-blur-2xl border border-brand-border dark:border-white/10 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldAlert className="text-brand-blue" size={24} />
                  <h2 className="text-2xl font-bold text-brand-black dark:text-white">Security Settings</h2>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-white dark:bg-black/50 rounded-xl border border-brand-border dark:border-white/10">
                  <div className="mb-4 md:mb-0">
                    <h4 className="text-brand-black dark:text-white font-bold text-lg">Change Password</h4>
                    <p className="text-brand-gray dark:text-gray-400 text-sm mt-1">We will send a secure verification link to <strong>{user.email}</strong> to reset your password.</p>
                  </div>
                  {resetSent ? (
                     <div className="flex shrink-0 items-center text-green-600 font-bold bg-green-50 dark:bg-green-500/10 px-4 py-3 rounded-xl border border-green-200 dark:border-green-500/20">
                       <CheckCircle2 className="mr-2" size={20} /> Reset link sent!
                     </div>
                  ) : (
                    <button
                      onClick={handlePasswordReset}
                      disabled={resetLoading}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-black dark:bg-white hover:bg-brand-gray dark:hover:bg-gray-200 text-white dark:text-black font-bold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shrink-0 shadow-lg"
                    >
                      {resetLoading ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />}
                      {resetLoading ? 'Sending...' : 'Verify by Mail'}
                    </button>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-brand-light dark:bg-white/5 backdrop-blur-2xl border border-brand-border dark:border-white/10 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Palette className="text-brand-blue" size={24} />
                  <h2 className="text-2xl font-bold text-brand-black dark:text-white">Theme Preference</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Light Mode Button */}
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${
                      theme === "light" 
                        ? "border-brand-blue bg-blue-50 dark:bg-blue-500/10 shadow-lg shadow-brand-blue/10" 
                        : "border-brand-border dark:border-white/10 bg-white dark:bg-black/50 hover:border-brand-gray dark:hover:border-gray-500"
                    }`}
                  >
                    <div className="w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mb-4">
                      <Sun size={32} />
                    </div>
                    <span className="font-bold text-brand-black dark:text-white text-lg">Light Mode</span>
                    <span className="text-sm text-brand-gray dark:text-gray-400 mt-1">Clean and bright</span>
                  </button>

                  {/* Dark Mode Button */}
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${
                      theme === "dark" 
                        ? "border-brand-blue bg-blue-50 dark:bg-blue-500/10 shadow-lg shadow-brand-blue/10" 
                        : "border-brand-border dark:border-white/10 bg-white dark:bg-black/50 hover:border-brand-gray dark:hover:border-gray-500"
                    }`}
                  >
                    <div className="w-16 h-16 rounded-full bg-zinc-800 text-white flex items-center justify-center mb-4">
                      <Moon size={32} />
                    </div>
                    <span className="font-bold text-brand-black dark:text-white text-lg">Dark Mode</span>
                    <span className="text-sm text-brand-gray dark:text-gray-400 mt-1">Easy on the eyes</span>
                  </button>

                  {/* System Mode Button */}
                  <button
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${
                      theme === "system" 
                        ? "border-brand-blue bg-blue-50 dark:bg-blue-500/10 shadow-lg shadow-brand-blue/10" 
                        : "border-brand-border dark:border-white/10 bg-white dark:bg-black/50 hover:border-brand-gray dark:hover:border-gray-500"
                    }`}
                  >
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                      <Monitor size={32} />
                    </div>
                    <span className="font-bold text-brand-black dark:text-white text-lg">System</span>
                    <span className="text-sm text-brand-gray dark:text-gray-400 mt-1">Matches your device</span>
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}