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
      
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="w-full">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <Link 
              href="/profile" 
              className="inline-flex items-center text-sm font-bold text-brand-blue hover:text-brand-black dark:hover:text-white transition-colors mb-4"
            >
              <ArrowLeft size={14} className="mr-1" /> Back to Profile
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-black dark:text-white tracking-tight mb-3">
              Account Settings
            </h1>
            <p className="text-brand-gray dark:text-gray-400 text-base md:text-lg">
              Manage your personal information and application preferences.
            </p>
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-xs sm:max-w-sm mb-6 md:mb-8 bg-brand-light dark:bg-white/5 border border-brand-border dark:border-white/10 rounded-2xl p-1 h-auto">
              <TabsTrigger 
                value="profile"
                className="py-2.5 rounded-xl data-[state=active]:bg-brand-blue data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-brand-gray dark:text-gray-400 text-sm"
              >
                <User size={16} className="mr-1.5" />Profile
              </TabsTrigger>
              <TabsTrigger 
                value="appearance"
                className="py-2.5 rounded-xl data-[state=active]:bg-brand-blue data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-brand-gray dark:text-gray-400 text-sm"
              >
                <Palette size={16} className="mr-1.5" />Appearance
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-brand-light dark:bg-white/5 backdrop-blur-2xl border border-brand-border dark:border-white/10 rounded-2xl p-5 md:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-brand-black dark:text-white">User Information</h2>
                  <Link 
                    href="/profile"
                    className="text-sm font-bold text-brand-blue hover:text-brand-black dark:hover:text-white transition-colors shrink-0"
                  >
                    Edit Profile →
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: User, label: 'Full Name', value: userProfile?.name },
                    { icon: Mail, label: 'Email Address', value: user.email },
                    { icon: Phone, label: 'Phone Number', value: userProfile?.phone },
                    { icon: MapPin, label: 'Address', value: userProfile?.address },
                    { icon: MapPin, label: 'City', value: userProfile?.city },
                    { icon: MapPin, label: 'State/Province', value: userProfile?.state },
                    { icon: MapPin, label: 'Zip/Postal Code', value: userProfile?.zipcode },
                    { icon: MapPin, label: 'Country', value: userProfile?.country },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="p-4 bg-white dark:bg-black/50 rounded-xl border border-brand-border dark:border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                          <Icon size={14} />
                        </div>
                        <p className="text-brand-gray dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</p>
                      </div>
                      <p className="text-sm md:text-base font-bold text-brand-black dark:text-white truncate">
                        {value || 'Not provided'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-brand-light dark:bg-white/5 backdrop-blur-2xl border border-brand-border dark:border-white/10 rounded-2xl p-5 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-5 md:mb-6">
                  <Palette className="text-brand-blue" size={22} />
                  <h2 className="text-xl md:text-2xl font-bold text-brand-black dark:text-white">Theme Preference</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { value: 'light', label: 'Light Mode', sub: 'Clean and bright', icon: Sun, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
                    { value: 'dark', label: 'Dark Mode', sub: 'Easy on the eyes', icon: Moon, iconBg: 'bg-zinc-800', iconColor: 'text-white' },
                    { value: 'system', label: 'System', sub: 'Matches your device', icon: Monitor, iconBg: 'bg-gray-100 dark:bg-zinc-800', iconColor: 'text-emerald-600 dark:text-emerald-400' },
                  ].map(({ value, label, sub, icon: Icon, iconBg, iconColor }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className={`flex flex-col items-center p-5 md:p-6 rounded-2xl border-2 transition-all ${
                        theme === value
                          ? 'border-brand-blue bg-blue-50 dark:bg-blue-500/10 shadow-lg shadow-brand-blue/10'
                          : 'border-brand-border dark:border-white/10 bg-white dark:bg-black/50 hover:border-brand-gray dark:hover:border-gray-500'
                      }`}
                    >
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${iconBg} ${iconColor} flex items-center justify-center mb-3`}>
                        <Icon size={24} className="md:hidden" />
                        <Icon size={32} className="hidden md:block" />
                      </div>
                      <span className="font-bold text-brand-black dark:text-white text-base md:text-lg">{label}</span>
                      <span className="text-xs md:text-sm text-brand-gray dark:text-gray-400 mt-1">{sub}</span>
                    </button>
                  ))}
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