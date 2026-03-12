"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Website/Header/Header";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Website/Footer/Footer";
import { authClient } from "@/lib/auth-client";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Loader2, 
  Save,
  ArrowLeft,
  Moon,
  Sun,
  Volume2,
  VolumeX
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  
  // Settings state
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketAlerts: true,
    newsUpdates: false
  });
  
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'en',
    currency: 'USD',
    timezone: 'UTC',
    soundEnabled: true
  });
  
  const [saving, setSaving] = useState(false);

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
          <p className="text-white font-medium">Loading settings...</p>
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
          <p className="text-white font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  const handleSaveSettings = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    // You can add actual API call here to save settings
  };

  const user = session.user;
  const isAdmin = (user as any)?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-outfit">
      <Navbar />
      <MarketTicker />
      
      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link 
              href="/profile" 
              className="inline-flex items-center text-sm font-bold text-brand-blue hover:text-white transition-colors mb-4"
            >
              <ArrowLeft size={14} className="mr-1" /> Back to Profile
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Account Settings
            </h1>
            <p className="text-gray-400 text-lg">
              Customize your UpDownLive experience and manage your preferences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-4">Settings Menu</h3>
                <nav className="space-y-2">
                  {[
                    { icon: User, label: "Profile", active: false },
                    { icon: Bell, label: "Notifications", active: true },
                    { icon: Palette, label: "Appearance", active: false },
                    { icon: Shield, label: "Privacy", active: false },
                    { icon: Globe, label: "Language", active: false }
                  ].map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={index}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                          item.active 
                            ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/25' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <IconComponent size={18} />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Notifications Settings */}
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="text-brand-blue" size={24} />
                  <h2 className="text-2xl font-bold text-white">Notification Preferences</h2>
                </div>
                
                <div className="space-y-6">
                  {[
                    { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
                    { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
                    { key: 'marketAlerts', label: 'Market Alerts', description: 'Price and market movement alerts' },
                    { key: 'newsUpdates', label: 'News Updates', description: 'Financial news and analysis' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <h4 className="text-white font-semibold">{item.label}</h4>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          notifications[item.key as keyof typeof notifications] ? 'bg-brand-blue' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                          notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appearance Settings */}
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Palette className="text-brand-blue" size={24} />
                  <h2 className="text-2xl font-bold text-white">Appearance & Display</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">Theme</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'dark', label: 'Dark Mode', icon: Moon },
                        { value: 'light', label: 'Light Mode', icon: Sun }
                      ].map((theme) => {
                        const IconComponent = theme.icon;
                        return (
                          <button
                            key={theme.value}
                            onClick={() => setPreferences(prev => ({ ...prev, theme: theme.value }))}
                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                              preferences.theme === theme.value
                                ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
                                : 'border-white/10 bg-white/5 text-gray-400 hover:border-brand-blue/50'
                            }`}
                          >
                            <IconComponent size={20} />
                            {theme.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sound Settings */}
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      {preferences.soundEnabled ? <Volume2 className="text-brand-blue" size={20} /> : <VolumeX className="text-gray-400" size={20} />}
                      <div>
                        <h4 className="text-white font-semibold">Sound Effects</h4>
                        <p className="text-gray-400 text-sm">Enable notification sounds</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        preferences.soundEnabled ? 'bg-brand-blue' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                        preferences.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Regional Settings */}
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="text-brand-blue" size={24} />
                  <h2 className="text-2xl font-bold text-white">Regional Settings</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Currency</label>
                    <select 
                      value={preferences.currency}
                      onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Timezone</label>
                    <select 
                      value={preferences.timezone}
                      onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">EST - Eastern Time</option>
                      <option value="PST">PST - Pacific Time</option>
                      <option value="GMT">GMT - Greenwich Mean Time</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="flex items-center gap-2 px-8 py-4 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-2xl transition-all shadow-lg shadow-brand-blue/25 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Settings
                    </>
                  )}
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