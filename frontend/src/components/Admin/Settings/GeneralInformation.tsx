"use client";
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { Building2, MapPin, Phone, Mail, Save, Loader2, Info, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/UI/Card";
import { useToast } from "@/hooks/use-toast";

interface GeneralInfo {
  companyName: string;
  officeAddress: string;
  companyAddress: string;
  phone: string;
  email: string;
  businessHours: string;
}

const DEFAULT_INFO: GeneralInfo = {
  companyName: '',
  officeAddress: '',
  companyAddress: '',
  phone: '',
  email: '',
  businessHours: '',
};

export default function GeneralInformation() {
  const { toast } = useToast();
  const [info, setInfo] = useState<GeneralInfo>(DEFAULT_INFO);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axiosInstance.get(`/settings/general-info`);
        if (res.data?.info) {
          setInfo(prev => ({ ...prev, ...res.data.info }));
        }
      } catch (err) {
        console.error('General info fetch issue:', err);
        toast({ variant: "destructive", description: 'Failed to load general information.' });
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.post(`/settings/general-info`, { info });
      toast({ variant: "success" as any, description: 'General information updated successfully.' });
    } catch (err) {
      console.error('Error saving general info:', err);
      toast({ variant: "destructive", description: 'Error saving general information.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  const fields: { name: keyof GeneralInfo; label: string; icon: React.ElementType; placeholder: string; type?: string; textarea?: boolean; description?: string; fullWidth?: boolean }[] = [
    { 
      name: 'companyName', 
      label: 'Company Name', 
      icon: Building2, 
      placeholder: 'UpDownLive Ltd.',
      description: 'Your official company or business name',
      fullWidth: true
    },
    { 
      name: 'officeAddress', 
      label: 'Office Address', 
      icon: MapPin, 
      placeholder: '123 Financial District, New York, NY 10004', 
      textarea: true,
      description: 'Physical office location for visitors'
    },
    { 
      name: 'companyAddress', 
      label: 'Registered Address', 
      icon: MapPin, 
      placeholder: '456 Corporate Park, London, EC2V 7HH', 
      textarea: true,
      description: 'Legal registered business address'
    },
    { 
      name: 'phone', 
      label: 'Phone Number', 
      icon: Phone, 
      placeholder: '+1 (555) 123-4567',
      description: 'Primary contact number'
    },
    { 
      name: 'email', 
      label: 'Contact Email', 
      icon: Mail, 
      placeholder: 'support@updownlive.com',
      type: 'email',
      description: 'Main support or inquiry email'
    },
    { 
      name: 'businessHours', 
      label: 'Business Hours', 
      icon: Info, 
      placeholder: 'Mon–Fri 8:00 AM – 6:00 PM EST',
      description: 'Operating hours and timezone',
      fullWidth: true
    },
  ];

  return (
    <div className="max-w-420 mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-blue to-blue-600 flex items-center justify-center shadow-lg shadow-brand-blue/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-black dark:text-white tracking-tight">
              General Information
            </h1>
            <p className="text-xs text-brand-gray dark:text-gray-400">
              Manage company contact details displayed on your website
            </p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <Card className="border-brand-border dark:border-white/10 shadow-xl bg-white dark:bg-zinc-900 overflow-hidden">
        <CardHeader className="border-b border-brand-border dark:border-white/10 bg-linear-to-r from-brand-light/50 to-transparent dark:from-white/5 dark:to-transparent px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-brand-black dark:text-white mb-1">
                Company Contact Details
              </CardTitle>
              <CardDescription className="text-xs text-brand-gray dark:text-gray-400 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                Information shown on public Contact page
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {fields.map((field, index) => (
              <div 
                key={field.name} 
                className={`${field.fullWidth ? 'lg:col-span-2' : ''} group`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <label className="flex items-center gap-2 text-base font-semibold text-brand-black dark:text-white mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center group-hover:bg-brand-blue/20 dark:group-hover:bg-brand-blue/30 transition-colors">
                    <field.icon className="w-3.5 h-3.5 text-brand-blue" />
                  </div>
                  <span>{field.label}</span>
                </label>
                
                {/* {field.description && (
                  <p className="text-xs text-brand-gray dark:text-gray-500 mb-1.5 ml-9">
                    {field.description}
                  </p>
                )} */}
                
                {field.textarea ? (
                  <textarea
                    name={field.name}
                    value={info[field.name]}
                    onChange={handleChange}
                    rows={2}
                    className="w-full bg-white dark:bg-zinc-800 border-2 border-brand-border dark:border-white/10 text-brand-black dark:text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all resize-none placeholder:text-brand-gray/50 dark:placeholder:text-gray-600 hover:border-brand-blue/50 text-sm"
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={info[field.name]}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-zinc-800 border-2 border-brand-border dark:border-white/10 text-brand-black dark:text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all placeholder:text-brand-gray/50 dark:placeholder:text-gray-600 hover:border-brand-blue/50 text-sm"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6 pt-5 border-t border-brand-border dark:border-white/10">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="group relative bg-linear-to-r from-brand-blue to-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-xl hover:shadow-brand-blue/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-brand-blue opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-2">
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Information</span>
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
