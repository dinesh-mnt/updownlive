"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LogOut, LayoutDashboard, Settings, Globe, Database, 
  TrendingUp, Users, Activity, Loader2, Eye, EyeOff, Save, Key, CheckCircle
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import axios from 'axios';

export default function AdminDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  // API Integration States
  const [newsApiKey, setNewsApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchProfileAndSettings = async () => {
      try {
        const { data: sessionData, error } = await authClient.getSession();

        if (error || !sessionData) {
          throw new Error('Not authorized');
        }
        setProfile(sessionData.user);
        
        // Fetch Current API Key
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        try {
          const res = await axios.get(`${apiUrl}/settings/news-api-key`);
          if (res.data?.apiKey) {
            setNewsApiKey(res.data.apiKey);
          }
        } catch (setupErr) {
          console.error('API key retrieval issue:', setupErr);
        }

      } catch (err) {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndSettings();
  }, [router]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSaveApiKey = async () => {
    setIsSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      await axios.post(`${apiUrl}/settings/news-api-key`, { apiKey: newsApiKey });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving API Key:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center bg-white text-brand-gray">
        <Loader2 size={48} className="animate-spin text-brand-blue mb-4" />
        <p className="font-semibold text-lg text-brand-blue">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-light min-h-[calc(100vh-80px)] font-sans">
      <div className="container-custom py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm sticky top-28">
            <div className="flex items-center gap-4 pb-6 mb-6 border-b border-brand-border">
              <div className="w-14 h-14 bg-brand-blue text-white rounded-full flex items-center justify-center text-2xl font-black shadow-lg shadow-brand-blue/20 uppercase">
                {profile?.name?.charAt(0) || 'D'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-black">{profile?.name || 'Admin User'}</h3>
                <p className="text-sm text-brand-gray mb-1 truncate max-w-[150px]">{profile?.email || 'admin@updownlive.local'}</p>
                <div className="inline-block px-2 py-0.5 bg-brand-blue/10 text-brand-blue font-bold text-xs uppercase tracking-wider rounded-md">
                  {profile?.role || 'admin'}
                </div>
              </div>
            </div>
            
            <nav className="flex flex-col gap-2 mb-8">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors w-full text-left ${activeTab === 'overview' ? 'bg-brand-blue/10 text-brand-blue' : 'hover:bg-brand-light text-brand-gray hover:text-brand-black'}`}
              >
                <LayoutDashboard size={18} /> Dashboard Overview
              </button>
              <button 
                onClick={() => setActiveTab('content')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors w-full text-left ${activeTab === 'content' ? 'bg-brand-blue/10 text-brand-blue' : 'hover:bg-brand-light text-brand-gray hover:text-brand-black'}`}
              >
                <Globe size={18} /> Manage Content
              </button>
              <button 
                onClick={() => setActiveTab('api')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors w-full text-left ${activeTab === 'api' ? 'bg-brand-blue/10 text-brand-blue' : 'hover:bg-brand-light text-brand-gray hover:text-brand-black'}`}
              >
                <Database size={18} /> API Integrations
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors w-full text-left ${activeTab === 'settings' ? 'bg-brand-blue/10 text-brand-blue' : 'hover:bg-brand-light text-brand-gray hover:text-brand-black'}`}
              >
                <Settings size={18} /> User Settings
              </button>
            </nav>

            <button 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-brand-red/20 text-brand-red font-bold hover:bg-brand-red hover:text-white transition-colors group"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black mb-2 tracking-tight">
              {activeTab === 'overview' && "Admin Dashboard"}
              {activeTab === 'api' && "API Integrations & Webhooks"}
              {activeTab === 'content' && "Content Management"}
              {activeTab === 'settings' && "System Settings"}
            </h1>
            <p className="text-brand-gray text-lg">
              {activeTab === 'overview' && `Welcome back, ${profile?.name || 'Admin'}. Here's what's happening today.`}
              {activeTab === 'api' && "Manage third-party API keys securely."}
            </p>
          </div>

          {/* Overview Tab Content */}
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-4 right-4 text-brand-blue/20 group-hover:text-brand-blue/40 transition-colors">
                    <Database size={100} className="absolute -top-6 -right-6" />
                  </div>
                  <h3 className="text-brand-gray font-bold uppercase tracking-wider text-sm mb-4 relative z-10">Total API Calls</h3>
                  <div className="text-4xl font-extrabold text-brand-black mb-2 relative z-10">1,254</div>
                  <div className="flex items-center gap-1 text-green-500 font-bold text-sm relative z-10">
                    <TrendingUp size={16} /> +12% this week
                  </div>
                </div>
                
                <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-4 right-4 text-brand-red/10 group-hover:text-brand-red/20 transition-colors">
                    <Users size={100} className="absolute -top-6 -right-6" />
                  </div>
                  <h3 className="text-brand-gray font-bold uppercase tracking-wider text-sm mb-4 relative z-10">Active Users</h3>
                  <div className="text-4xl font-extrabold text-brand-black mb-2 relative z-10">328</div>
                  <div className="flex items-center gap-1 text-green-500 font-bold text-sm relative z-10">
                    <TrendingUp size={16} /> +5% this week
                  </div>
                </div>
                
                <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-4 right-4 text-brand-black/5 group-hover:text-brand-black/10 transition-colors">
                    <Activity size={100} className="absolute -top-6 -right-6" />
                  </div>
                  <h3 className="text-brand-gray font-bold uppercase tracking-wider text-sm mb-4 relative z-10">System Status</h3>
                  <div className="text-4xl font-extrabold text-brand-black mb-2 relative z-10">Connected</div>
                  <div className="flex items-center gap-1 text-green-500 font-bold text-sm relative z-10">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div> Online
                  </div>
                </div>
              </div>
            </>
          )}

          {/* API Integrations Tab */}
          {activeTab === 'api' && (
            <div className="bg-white border border-brand-border rounded-3xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="border-b border-brand-border bg-brand-light/50 px-8 py-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-brand-black flex items-center gap-2">
                  <Key size={22} className="text-brand-blue" /> External Webmaster Tools
                </h2>
                {saveSuccess && (
                  <span className="flex items-center gap-1 text-sm font-bold text-green-600 animate-in fade-in slide-in-from-right-4">
                    <CheckCircle size={16} /> Successfully updated
                  </span>
                )}
              </div>
              
              <div className="p-8">
                <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-2xl p-6 mb-8">
                  <h3 className="text-lg font-bold text-brand-black mb-2">NewsAPI.ai (Event Registry) Integration</h3>
                  <p className="text-brand-gray text-sm mb-6 leading-relaxed">
                    Set up your API Key below to actively pull the latest global business news and market highlights directly into the portal. Keys are encrypted at rest.
                  </p>

                  <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full relative">
                      <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Project API Key</label>
                      <div className="relative">
                        <input
                          type={showKey ? "text" : "password"}
                          value={newsApiKey}
                          onChange={(e) => setNewsApiKey(e.target.value)}
                          className="w-full bg-white border border-brand-border text-brand-black px-4 py-3 pr-12 rounded-xl focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all font-medium font-mono"
                          placeholder="Paste your NewsAPI.ai Key..."
                        />
                        <button 
                          onClick={() => setShowKey(!showKey)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-blue transition-colors focus:outline-none"
                        >
                          {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleSaveApiKey}
                      disabled={isSaving || !newsApiKey}
                      className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-red transition-colors shadow-lg shadow-brand-blue/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto justify-center h-[50px]"
                    >
                      {isSaving ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          <Save size={18} /> Update Key
                        </>
                      )}
                    </button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-brand-blue/10 flex justify-between items-center text-xs text-brand-gray">
                     <span>Last verified: {new Date().toLocaleDateString()}</span>
                     <span className="flex items-center gap-1 text-green-600 font-bold"><div className="w-2 h-2 rounded-full bg-green-500"></div> Connected active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {(activeTab === 'content' || activeTab === 'settings') && (
            <div className="bg-white border border-brand-border rounded-3xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="border-b border-brand-border bg-brand-light/50 px-8 py-6">
                <h2 className="text-xl font-bold text-brand-black flex items-center gap-2">
                  {activeTab === 'content' ? <Globe size={22} className="text-brand-blue" /> : <Settings size={22} className="text-brand-blue" />} 
                  {activeTab === 'content' ? 'Content Management' : 'System Settings'}
                </h2>
              </div>
              <div className="p-8">
                <p className="text-brand-gray text-lg leading-relaxed max-w-2xl mb-8">
                  {activeTab === 'content' 
                    ? 'Basic Admin Panel for managing the news feed, static pages, and application settings. Currently operating in connected mode.' 
                    : 'Configure global application parameters, admin roles, and display configurations here.'}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="btn-secondary">{activeTab === 'content' ? 'Clear API Cache' : 'Reset Defaults'}</button>
                  <button className="btn-primary">{activeTab === 'content' ? 'Refresh Market Data' : 'Save Setup'}</button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
