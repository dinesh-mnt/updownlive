"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Share2, Save, Loader2, Twitter, Youtube, Facebook, Linkedin, Rss, Instagram, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/UI/Card";
import { useToast } from "@/hooks/use-toast";

export default function SocialMedia() {
  const { toast } = useToast();
  const [links, setLinks] = useState({
    twitter: '',
    telegram: '',
    youtube: '',
    facebook: '',
    linkedin: '',
    rss: '',
    instagram: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${apiUrl}/settings/social-media`);
        if (res.data?.links) {
          setLinks(prev => ({ ...prev, ...res.data.links }));
        }
      } catch (err) {
        console.error('Social media fetch issue:', err);
        toast({ variant: "destructive", description: 'Failed to load social media links' });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveLinks = async () => {
    setIsSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      await axios.post(`${apiUrl}/settings/social-media`, { links });
      toast({ variant: "success" as any, description: 'Successfully updated Social Media Links.' });
    } catch (err) {
      console.error('Error saving Links:', err);
      toast({ variant: "destructive", description: 'Error saving Social Media Links.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinks({ ...links, [e.target.name]: e.target.value });
  };

  const socialFields = [
    { name: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' },
    { name: 'telegram', label: 'Telegram', icon: Send, color: 'text-blue-500' },
    { name: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-500' },
    { name: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { name: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
    { name: 'rss', label: 'RSS Feed', icon: Rss, color: 'text-orange-500' },
    { name: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
  ];

  if (loading) return null;

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black mb-2 tracking-tight">Social Media Settings</h1>
        <p className="text-brand-gray text-lg">Manage your dynamic social media links for the website footer.</p>
      </div>

      <Card className="rounded-3xl border-brand-border shadow-sm">
        <CardHeader className="border-b border-brand-border bg-brand-light/50 rounded-t-3xl px-8 py-6">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Share2 size={22} className="text-brand-blue" /> Dynamic Profile Links
          </CardTitle>
          <CardDescription>
            These links are automatically reflected on the user-facing website footer.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-2xl p-6 mb-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {socialFields.map(field => (
              <div key={field.name} className="flex-1 w-full relative">
                <label className="flex items-center gap-2 text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">
                  <field.icon size={14} className={field.color} /> {field.label} URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name={field.name}
                    value={links[field.name as keyof typeof links] || ''}
                    onChange={handleChange}
                    className="w-full bg-white border border-brand-border text-brand-black px-4 py-3 rounded-xl focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all font-medium font-mono"
                    placeholder={`https://${field.name}.com/yourprofile`}
                  />
                </div>
              </div>
            ))}

            <div className="flex lg:col-span-2 justify-end mt-4">
              <button 
                onClick={handleSaveLinks}
                disabled={isSaving}
                className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-red transition-colors shadow-lg shadow-brand-blue/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto justify-center h-[50px]"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} /> Update Links
                  </>
                )}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
