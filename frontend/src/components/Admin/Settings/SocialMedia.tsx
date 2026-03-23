"use client";
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { Share2, Save, Loader2, Twitter, Youtube, Facebook, Linkedin, Instagram, Send, CheckCircle2, ExternalLink } from 'lucide-react';
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
    instagram: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get(`/settings/social-media`);
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
      await axiosInstance.post(`/settings/social-media`, { links });
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
    { name: 'twitter', label: 'Twitter / X', icon: Twitter, color: 'text-blue-400', bgColor: 'bg-blue-400/10', borderColor: 'border-blue-400/20' },
    { name: 'telegram', label: 'Telegram', icon: Send, color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
    { name: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' },
    { name: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600', bgColor: 'bg-blue-600/10', borderColor: 'border-blue-600/20' },
    { name: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', bgColor: 'bg-blue-700/10', borderColor: 'border-blue-700/20' },
    { name: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600', bgColor: 'bg-pink-600/10', borderColor: 'border-pink-600/20' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-brand-blue to-blue-600 flex items-center justify-center shadow-lg shadow-brand-blue/20">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-black dark:text-white tracking-tight">
              Social Media Links
            </h1>
            <p className="text-sm text-brand-gray dark:text-gray-400 mt-0.5">
              Connect your social profiles to the website footer
            </p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <Card className="border-brand-border dark:border-white/10 shadow-xl bg-white dark:bg-zinc-900 overflow-hidden">
        <CardHeader className="border-b border-brand-border dark:border-white/10 bg-linear-to-r from-brand-light/50 to-transparent dark:from-white/5 dark:to-transparent px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-brand-black dark:text-white mb-2">
                Social Profile URLs
              </CardTitle>
              <CardDescription className="text-brand-gray dark:text-gray-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Links automatically appear in website footer
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {socialFields.map((field, index) => (
              <div 
                key={field.name} 
                className="group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-brand-black dark:text-white mb-2">
                  <div className={`w-10 h-10 rounded-xl ${field.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform border ${field.borderColor}`}>
                    <field.icon className={`w-5 h-5 ${field.color}`} />
                  </div>
                  <span>{field.label}</span>
                </label>
                
                <div className="relative">
                  <input
                    type="url"
                    name={field.name}
                    value={links[field.name as keyof typeof links] || ''}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-zinc-800 border-2 border-brand-border dark:border-white/10 text-brand-black dark:text-white pl-4 pr-10 py-3 rounded-xl focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all font-mono text-sm placeholder:text-brand-gray/50 dark:placeholder:text-gray-600 hover:border-brand-blue/50"
                    placeholder={`https://${field.name === 'twitter' ? 'x' : field.name}.com/yourprofile`}
                  />
                  {links[field.name as keyof typeof links] && (
                    <a
                      href={links[field.name as keyof typeof links]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-blue transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-8 p-5 bg-linear-to-br from-brand-blue/10 to-blue-600/10 dark:from-brand-blue/20 dark:to-blue-600/20 rounded-2xl border border-brand-blue/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-blue/20 flex items-center justify-center shrink-0 mt-0.5">
                <Share2 className="w-4 h-4 text-brand-blue" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-black dark:text-white mb-1">
                  How it works
                </h4>
                <p className="text-xs text-brand-gray dark:text-gray-400 leading-relaxed">
                  Add your social media profile URLs here. They will automatically appear as clickable icons in your website footer. Leave any field empty to hide that social platform from the footer.
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8 pt-6 border-t border-brand-border dark:border-white/10">
            <button 
              onClick={handleSaveLinks}
              disabled={isSaving}
              className="group relative bg-linear-to-r from-brand-blue to-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-blue/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-brand-blue opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-2">
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Update Links</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
