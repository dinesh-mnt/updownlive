"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import { useAuth } from "@/hooks/use-auth";
import { 
  User, 
  Palette, 
  Loader2, 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Sun,
  Moon,
  Monitor
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/UI/Tabs";
import { useTheme } from "next-themes";
import axiosInstance from '@/lib/axios';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  role?: string;
}

export default function SettingsPage() {
  const { user: sessionUser, isPending } = useAuth();
  const session = sessionUser ? { user: sessionUser } : null;
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      setLoadingProfile(true);
      const response = await axiosInstance.get(`/users/${userId}`);
      setUserProfile(response.data);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      // Set default values from session if API fails
      if (session?.user) {
        setUserProfile({
          name: session.user.name || '',
          email: session.user.email || '',
          role: (session.user as any)?.role || 'user',
        });
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserProfile(session.user.id);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [isPending, session, router]);

  if (isPending || !mounted || loadingProfile) {
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

  return (
    <div className="min-h-screen bg-white dark:bg-black font-outfit transition-colors duration-300 flex flex-col">
      <Navbar />
      <MarketTicker />
      
      <main className="flex-1 max-w-420 w-full mx-auto px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-brand-black dark:text-white">User Information</h2>
                  <Link 
                    href="/profile"
                    className="text-sm font-bold text-brand-blue hover:text-brand-black dark:hover:text-white transition-colors"
                  >
                    Edit Profile →
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="p-5 bg-white dark:bg-black/50 rounded-xl border border-brand-border dark:border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <User size={18} />
                      </div>
                      <p className="text-brand-gray dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Full Name</p>
                    </div>
                    <p className="text-lg font-bold text-brand-black dark:text-white ml-13">
                      {userProfile?.name || 'Not provided'}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="p-5 bg-white dark:bg-black/50 rounded-xl border border-brand-border dark:border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <Mail size={18} />
                      </div>
                      <p className="text-brand-gray dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Email Address</p>
                    </div>
                    <p className="text-lg font-bold text-brand-black dark:text-white ml-13 truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="p-5 bg-white dark:bg-black/50 rounded-xl border border-brand-border dark:border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <Phone size={18} />
                      </div>
                      <p className="text-brand-gray dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Phone Number</p>
                    </div>
                    <p className="text-lg font-bold text-brand-black dark:text-white ml-13">
                      {userProfile?.phone || 'Not provided'}
                    </p>
                  </div>

                  {/* Address */}
                  <div className="p-5 bg-white dark:bg-black/50 rounded-xl border border-brand-border dark:border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <MapPin size={18} />
                      </div>
                      <p className="text-brand-gray dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Address</p>
                    </div>
                    <p className="text-lg font-bold text-brand-black dark:text-white ml-13">
                      {userProfile?.address || 'Not provided'}
                    </p>
                  </div>

                  {/* City */}
                  <div className="p-5 bg-white dark:bg-black/50 rounded-xl border border-brand-border dark:border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <MapPin size={18} />
                      </div>
                      <p className="text-brand-gray dark:text-gray-400 text-xs font-bold uppercase tracking-wider">City</p>
                    </div>
                    <p className="text-lg font-bold text-brand-black dark:text-white ml-13">
                      {userProfile?.city || 'Not provided'}
                    </p>
                  </div>

                  {/* State */}
                  <div className="p-5 bg-white dark:bg-black/50 rounded-xl border border-brand-border dark:border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <MapPin size={18} />
                      </div>
                      <p className="text-brand-gray dark:text-gray-400 text-xs font-bold uppercase tracking-wider">State/Province</p>
                    </div>
                    <p className="text-lg font-bold text-brand-black dark:text-white ml-13">
                      {userProfile?.state || 'Not provided'}
                    </p>
                  </div>

                  {/* Zipcode */}
                  <div className="p-5 bg-white dark:bg-black/50 rounded-xl border border-brand-border dark:border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <MapPin size={18} />
                      </div>
                      <p className="text-brand-gray dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Zip/Postal Code</p>
                    </div>
                    <p className="text-lg font-bold text-brand-black dark:text-white ml-13">
                      {userProfile?.zipcode || 'Not provided'}
                    </p>
                  </div>

                  {/* Country */}
                  <div className="p-5 bg-white dark:bg-black/50 rounded-xl border border-brand-border dark:border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <MapPin size={18} />
                      </div>
                      <p className="text-brand-gray dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Country</p>
                    </div>
                    <p className="text-lg font-bold text-brand-black dark:text-white ml-13">
                      {userProfile?.country || 'Not provided'}
                    </p>
                  </div>
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