"use client";
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { Building2, MapPin, Phone, Mail, Save, Loader2, Info } from 'lucide-react';
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

  if (loading) return null;

  const inputClass =
    "w-full bg-white dark:bg-zinc-800 border border-brand-border dark:border-white/10 text-brand-black dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all font-medium placeholder:text-brand-gray dark:placeholder:text-gray-500";

  const fields: { name: keyof GeneralInfo; label: string; icon: React.ElementType; placeholder: string; type?: string; textarea?: boolean }[] = [
    { name: 'companyName', label: 'Company Name', icon: Building2, placeholder: 'UpDownLive Ltd.' },
    { name: 'officeAddress', label: 'Office Address', icon: MapPin, placeholder: '123 Financial District, New York, NY 10004', textarea: true },
    { name: 'companyAddress', label: 'Company / Registered Address', icon: MapPin, placeholder: '456 Corporate Park, London, EC2V 7HH', textarea: true },
    { name: 'phone', label: 'Phone Number', icon: Phone, placeholder: '+1 (555) 123-4567' },
    { name: 'email', label: 'Contact Email', icon: Mail, placeholder: 'support@updownlive.com' },
    { name: 'businessHours', label: 'Business Hours', icon: Info, placeholder: 'Mon–Fri 8:00 AM – 6:00 PM EST' },
  ];

  return (
    <>
      <div className="mb-10 animate-in fade-in duration-500">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black dark:text-white mb-2 tracking-tight">General Information</h1>
        <p className="text-brand-gray dark:text-gray-400 text-lg italic">
          Manage your company&apos;s contact details. These are displayed on the public Contact page.
        </p>
      </div>

      <Card className="rounded-3xl border-brand-border dark:border-white/10 shadow-sm bg-white dark:bg-zinc-900 transition-colors duration-300">
        <CardHeader className="border-b border-brand-border dark:border-white/10 bg-brand-light/50 dark:bg-white/5 rounded-t-3xl px-8 py-6">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-brand-black dark:text-white">
            <Building2 size={22} className="text-brand-blue" /> Company Contact Details
          </CardTitle>
          <CardDescription className="text-brand-gray dark:text-gray-400">
            These fields are shown on the website&apos;s Contact page under Office & Company Information.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <div className="bg-brand-blue/5 dark:bg-brand-blue/10 border border-brand-blue/20 dark:border-brand-blue/30 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 transition-colors">
            {fields.map(field => (
              <div key={field.name} className={field.textarea ? 'lg:col-span-2' : ''}>
                <label className="flex items-center gap-2 text-xs font-bold text-brand-gray dark:text-gray-400 uppercase tracking-widest mb-2 transition-colors">
                  <field.icon size={14} className="text-brand-blue" /> {field.label}
                </label>
                {field.textarea ? (
                  <textarea
                    name={field.name}
                    value={info[field.name]}
                    onChange={handleChange}
                    rows={2}
                    className={`${inputClass} resize-none`}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={info[field.name]}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}

            <div className="flex lg:col-span-2 justify-end mt-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-red transition-colors shadow-lg shadow-brand-blue/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto justify-center h-[50px]"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <><Save size={18} /> Save Information</>
                )}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
