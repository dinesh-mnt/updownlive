"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import { authClient } from "@/lib/auth-client";
import { User, Mail, Shield, Calendar, LogOut, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import axios from "axios";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch additional user details including verification status
  const fetchUserDetails = async (userId: string) => {
    try {
      setLoadingDetails(true);
      setFetchError(null);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/users/${userId}`);
      setUserDetails(response.data);
    } catch (error: any) {
      console.error('Error fetching user details:', error);
      setFetchError(error.response?.data?.message || 'Failed to load user details');
      // If user not found in users collection, they might be admin or new user
      setUserDetails({ verifiedStatus: 'pending' });
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    // Don't fetch user details for admin users since they're not in the users collection
    if (session?.user?.id && !((session.user as any)?.role === 'admin')) {
      fetchUserDetails(session.user.id);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    // Handle redirect for unauthenticated users
    if (!isPending && !session) {
      router.push("/admin/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-brand-blue animate-spin mx-auto mb-4" />
          <p className="text-white font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!session && !isPending) {
    return null; // Will redirect via useEffect
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-brand-blue animate-spin mx-auto mb-4" />
          <p className="text-white font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const { user } = session;
    const isAdmin = (user as any)?.role === 'admin';
    const verificationStatus = userDetails?.verifiedStatus || 'pending';

    return (
        <div className="min-h-screen bg-[#0a0a0a] font-outfit">
            <Navbar />
            <MarketTicker />
            
            <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                            {isAdmin ? 'Admin Account' : 'My Account'}
                        </h1>
                        <p className="text-gray-400 text-lg">
                            {isAdmin ? 'System administration and management' : 'Manage your profile and account settings.'}
                        </p>
                    </div>
                    
                    <div className="bg-white/3 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                        {/* Banner Gradient */}
                        <div className="h-40 bg-linear-to-r from-brand-blue/30 via-brand-blue/10 to-brand-red/20 relative">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,66,240,0.1),transparent)]"></div>
                        </div>

                        <div className="px-8 pb-12 -mt-16 relative z-10">
                            <div className="flex flex-col md:flex-row items-end gap-6 mb-12">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-900 border-4 border-[#0a0a0a] flex items-center justify-center text-white text-4xl font-black shadow-2xl relative group overflow-hidden">
                                    <div className="w-full h-full bg-brand-blue flex items-center justify-center">
                                        {isAdmin ? 'A' : (user.name ? user.name.charAt(0).toUpperCase() : <User size={48} />)}
                                    </div>
                                </div>
                                <div className="flex-1 pb-2 text-center md:text-left">
                                    <h2 className="text-3xl font-extrabold text-white">{isAdmin ? 'Admin' : user.name}</h2>
                                    <p className="text-brand-blue font-semibold tracking-wide mt-1">{user.email}</p>
                                </div>
                            </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Account Details */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Personal Information</h3>
                            <div className="grid gap-4">
                                <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 group hover:bg-white/[0.07] transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Full Name</p>
                                        <p className="text-white font-bold">{isAdmin ? 'Admin' : user.name}</p>
                                    </div>
                                </div>
                                <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 group hover:bg-white/[0.07] transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Email Address</p>
                                        <p className="text-white font-bold">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security & System Details */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Security & Access</h3>
                            <div className="grid gap-4">
                                <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 group hover:bg-white/[0.07] transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform">
                                        <Shield size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Access Level</p>
                                        {loadingDetails ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 size={14} className="animate-spin text-brand-blue" />
                                                <span className="text-white font-bold">Loading...</span>
                                            </div>
                                        ) : fetchError ? (
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <p className="text-amber-500 font-bold">Unable to verify status</p>
                                                    <p className="text-xs text-gray-500 mt-1">{fetchError}</p>
                                                </div>
                                                <button
                                                    onClick={() => session?.user?.id && fetchUserDetails(session.user.id)}
                                                    className="ml-2 p-2 rounded-lg bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue transition-colors"
                                                    title="Retry loading verification status"
                                                >
                                                    <RefreshCw size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <p className={cn(
                                                "font-bold",
                                                (user as any)?.role === 'admin' ? "text-brand-blue" : 
                                                verificationStatus === 'approved' ? "text-green-500" : 
                                                verificationStatus === 'rejected' ? "text-red-500" : "text-white"
                                            )}>
                                                {(user as any)?.role === 'admin' ? 'Administrator' : 
                                                 verificationStatus === 'approved' ? 'Verified User' : 
                                                 verificationStatus === 'rejected' ? 'Not Verified User' : 'Standard User'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 group hover:bg-white/[0.07] transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Joining Date</p>
                                        <p className="text-white font-bold">
                                            {userDetails?.createdAt 
                                                ? new Date(userDetails.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                                : user?.createdAt 
                                                ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                                : 'Recently joined'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between">
                        <div>
                            <h4 className="text-white font-bold">Sign Out?</h4>
                            <p className="text-gray-500 text-xs font-medium">Log out of your current session.</p>
                        </div>
                        <button 
                            onClick={() => authClient.signOut().then(() => router.push('/'))}
                            className="flex items-center gap-2 px-8 py-4 bg-brand-red/10 text-brand-red border border-brand-red/20 rounded-2xl font-bold hover:bg-brand-red hover:text-white transition-all shadow-lg active:scale-95"
                        >
                            <LogOut size={18} />
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}