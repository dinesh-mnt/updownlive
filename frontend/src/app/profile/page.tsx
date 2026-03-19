"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import { authClient } from "@/lib/auth-client";
import { User, Mail, Phone, MapPin, Calendar, LogOut, Loader2, Save, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axiosInstance from '@/lib/axios';
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  role?: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      setLoadingProfile(true);
      const response = await axiosInstance.get(`/users/${userId}`);
      const profile = response.data;
      setUserProfile(profile);
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || '',
      });
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      // Set default values from session if API fails
      if (session?.user) {
        setUserProfile({
          name: session.user.name || '',
          email: session.user.email || '',
          role: (session.user as any)?.role || 'user',
        });
        setFormData({
          name: session.user.name || '',
          phone: '',
          address: '',
          city: '',
          country: '',
        });
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  // Save profile updates
  const handleSaveProfile = async () => {
    if (!session?.user?.id) return;

    try {
      setIsSaving(true);
      await axiosInstance.put(`/users/${session.user.id}`, formData);
      
      // Refresh profile data
      await fetchUserProfile(session.user.id);
      
      setIsEditing(false);
      toast({
        variant: 'success' as any,
        description: 'Profile updated successfully!',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        description: error.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        country: userProfile.country || '',
      });
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserProfile(session.user.id);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/admin/login");
    }
  }, [isPending, session, router]);

  if (isPending || loadingProfile) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-brand-blue animate-spin mx-auto mb-4" />
          <p className="text-brand-black dark:text-white font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const { user } = session;
  const isAdmin = (user as any)?.role === 'admin';

  return (
    <div className="min-h-screen bg-white dark:bg-black font-outfit transition-colors duration-300">
      <Navbar />
      <MarketTicker />
      
      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-black dark:text-white tracking-tight mb-4">
              {isAdmin ? 'Admin Profile' : 'My Profile'}
            </h1>
            <p className="text-brand-gray dark:text-gray-400 text-lg">
              {isAdmin ? 'System administration account' : 'Manage your personal information and preferences.'}
            </p>
          </div>
          
          <div className="bg-brand-light dark:bg-white/3 backdrop-blur-2xl border border-brand-border dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
            {/* Banner Gradient */}
            <div className="h-40 bg-gradient-to-r from-brand-blue/30 via-brand-blue/10 to-brand-red/20 relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,66,240,0.1),transparent)]"></div>
            </div>

            <div className="px-8 pb-12 -mt-16 relative z-10">
              <div className="flex flex-col md:flex-row items-end gap-6 mb-12">
                <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-900 border-4 border-white dark:border-[#0a0a0a] flex items-center justify-center text-white text-4xl font-black shadow-2xl relative group overflow-hidden">
                  <div className="w-full h-full bg-brand-blue flex items-center justify-center">
                    {isAdmin ? 'A' : (formData.name ? formData.name.charAt(0).toUpperCase() : <User size={48} />)}
                  </div>
                </div>
                <div className="flex-1 pb-2 text-center md:text-left">
                  <h2 className="text-3xl font-extrabold text-brand-black dark:text-white">
                    {isAdmin ? 'Administrator' : formData.name || 'User'}
                  </h2>
                  <p className="text-brand-blue font-semibold tracking-wide mt-1">{user.email}</p>
                  {userProfile?.role && (
                    <span className="inline-block mt-2 px-3 py-1 bg-brand-blue/10 text-brand-blue text-xs font-bold rounded-full uppercase tracking-wider">
                      {userProfile.role}
                    </span>
                  )}
                </div>
                {!isAdmin && (
                  <button
                    onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
                    className="px-6 py-3 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue border border-brand-blue/20 rounded-xl font-bold transition-all flex items-center gap-2"
                  >
                    {isEditing ? (
                      <>Cancel</>
                    ) : (
                      <>
                        <Edit2 size={16} />
                        Edit Profile
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xs font-black text-brand-gray dark:text-gray-500 uppercase tracking-[0.2em] pl-1 mb-6">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="p-5 bg-white dark:bg-white/5 border border-brand-border dark:border-white/5 rounded-2xl flex items-center gap-4 group hover:bg-white/[0.07] transition-all">
                      <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform shrink-0">
                        <User size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-brand-gray dark:text-gray-500 uppercase tracking-widest leading-none mb-2">
                          Full Name
                        </p>
                        {isEditing && !isAdmin ? (
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-transparent text-brand-black dark:text-white font-bold border-b border-brand-blue/30 focus:border-brand-blue outline-none pb-1"
                            placeholder="Enter your name"
                          />
                        ) : (
                          <p className="text-brand-black dark:text-white font-bold truncate">
                            {formData.name || 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="p-5 bg-white dark:bg-white/5 border border-brand-border dark:border-white/5 rounded-2xl flex items-center gap-4 group hover:bg-white/[0.07] transition-all">
                      <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform shrink-0">
                        <Mail size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-brand-gray dark:text-gray-500 uppercase tracking-widest leading-none mb-2">
                          Email Address
                        </p>
                        <p className="text-brand-black dark:text-white font-bold truncate">{user.email}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="p-5 bg-white dark:bg-white/5 border border-brand-border dark:border-white/5 rounded-2xl flex items-center gap-4 group hover:bg-white/[0.07] transition-all">
                      <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform shrink-0">
                        <Phone size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-brand-gray dark:text-gray-500 uppercase tracking-widest leading-none mb-2">
                          Phone Number
                        </p>
                        {isEditing && !isAdmin ? (
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-transparent text-brand-black dark:text-white font-bold border-b border-brand-blue/30 focus:border-brand-blue outline-none pb-1"
                            placeholder="Enter phone number"
                          />
                        ) : (
                          <p className="text-brand-black dark:text-white font-bold truncate">
                            {formData.phone || 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Joining Date */}
                    <div className="p-5 bg-white dark:bg-white/5 border border-brand-border dark:border-white/5 rounded-2xl flex items-center gap-4 group hover:bg-white/[0.07] transition-all">
                      <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform shrink-0">
                        <Calendar size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-brand-gray dark:text-gray-500 uppercase tracking-widest leading-none mb-2">
                          Member Since
                        </p>
                        <p className="text-brand-black dark:text-white font-bold truncate">
                          {userProfile?.createdAt 
                            ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                            : 'Recently joined'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                {!isAdmin && (
                  <div>
                    <h3 className="text-xs font-black text-brand-gray dark:text-gray-500 uppercase tracking-[0.2em] pl-1 mb-6">
                      Location Details
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {/* Address */}
                      <div className="p-5 bg-white dark:bg-white/5 border border-brand-border dark:border-white/5 rounded-2xl flex items-start gap-4 group hover:bg-white/[0.07] transition-all">
                        <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform shrink-0">
                          <MapPin size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-brand-gray dark:text-gray-500 uppercase tracking-widest leading-none mb-2">
                            Street Address
                          </p>
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              className="w-full bg-transparent text-brand-black dark:text-white font-bold border-b border-brand-blue/30 focus:border-brand-blue outline-none pb-1"
                              placeholder="Enter your address"
                            />
                          ) : (
                            <p className="text-brand-black dark:text-white font-bold">
                              {formData.address || 'Not provided'}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* City */}
                        <div className="p-5 bg-white dark:bg-white/5 border border-brand-border dark:border-white/5 rounded-2xl">
                          <p className="text-[10px] font-bold text-brand-gray dark:text-gray-500 uppercase tracking-widest leading-none mb-2">
                            City
                          </p>
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              className="w-full bg-transparent text-brand-black dark:text-white font-bold border-b border-brand-blue/30 focus:border-brand-blue outline-none pb-1"
                              placeholder="Enter city"
                            />
                          ) : (
                            <p className="text-brand-black dark:text-white font-bold">
                              {formData.city || 'Not provided'}
                            </p>
                          )}
                        </div>

                        {/* Country */}
                        <div className="p-5 bg-white dark:bg-white/5 border border-brand-border dark:border-white/5 rounded-2xl">
                          <p className="text-[10px] font-bold text-brand-gray dark:text-gray-500 uppercase tracking-widest leading-none mb-2">
                            Country
                          </p>
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.country}
                              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                              className="w-full bg-transparent text-brand-black dark:text-white font-bold border-b border-brand-blue/30 focus:border-brand-blue outline-none pb-1"
                              placeholder="Enter country"
                            />
                          ) : (
                            <p className="text-brand-black dark:text-white font-bold">
                              {formData.country || 'Not provided'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                {isEditing && !isAdmin && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-8 py-4 bg-brand-blue text-white rounded-2xl font-bold hover:bg-brand-blue/90 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Sign Out Section */}
              <div className="mt-12 pt-10 border-t border-brand-border dark:border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-brand-black dark:text-white font-bold">Sign Out?</h4>
                  <p className="text-brand-gray dark:text-gray-500 text-xs font-medium">Log out of your current session.</p>
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
