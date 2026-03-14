"use client";
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import {
  Send, Check, AlertCircle,
  Building2, MapPin, Phone, Mail, Clock, Globe
} from 'lucide-react';

interface GeneralInfo {
  companyName?: string;
  officeAddress?: string;
  companyAddress?: string;
  phone?: string;
  email?: string;
  businessHours?: string;
}

export default function ContactPage() {
  // ── General Info (from Admin → Settings → General Information) ──
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo>({});
  const [infoLoading, setInfoLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axiosInstance.get(`/settings/general-info`);
        if (res.data?.info) setGeneralInfo(res.data.info);
      } catch (err) {
        console.warn('Could not load general info:', err);
      } finally {
        setInfoLoading(false);
      }
    };
    fetchInfo();
  }, []);

  // ── Form ──
  const [formData, setFormData] = useState({
    department: 'Support',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    message: '',
    agreedToTerms: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'success') timer = setTimeout(() => setStatus('idle'), 5000);
    return () => clearTimeout(timer);
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      setErrorMessage('You must agree to the Terms of Service to submit.');
      return;
    }
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const response = await axiosInstance.post(`/enquiries`, formData);
      
      console.log('Enquiry response:', response.data);
      setStatus('success');
      setFormData({
        department: 'Support',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyName: '',
        message: '',
        agreedToTerms: false,
      });
    } catch (err: any) {
      console.error('Enquiry submission error:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      
      setStatus('error');
      
      if (err.code === 'ECONNABORTED') {
        setErrorMessage('Request timeout. Please check your internet connection and try again.');
      } else if (err.message === 'Network Error') {
        setErrorMessage('Network error. Please check if the API server is running and accessible.');
      } else if (err.response?.status === 0) {
        setErrorMessage('Cannot connect to server. This might be a CORS issue or the server is not responding.');
      } else {
        setErrorMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
    }
  };

  const inputClass =
    'w-full px-5 py-3.5 bg-brand-light border border-transparent rounded-lg text-brand-black focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all font-medium placeholder:text-brand-gray/50';

  // Info cards to display on left panel
  const infoCards = [
    {
      icon: Building2,
      label: 'Company',
      value: generalInfo.companyName,
      color: 'bg-brand-blue/10 text-brand-blue',
    },
    {
      icon: MapPin,
      label: 'Office Address',
      value: generalInfo.officeAddress,
      color: 'bg-brand-red/10 text-brand-red',
    },
    {
      icon: Globe,
      label: 'Company / Registered Address',
      value: generalInfo.companyAddress,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: generalInfo.phone,
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Mail,
      label: 'Email',
      value: generalInfo.email,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: Clock,
      label: 'Business Hours',
      value: generalInfo.businessHours,
      color: 'bg-brand-black/8 text-brand-black',
    },
  ].filter(card => card.value); // only show fields that have content

  return (
    <div className="bg-[#f9f9f9] min-h-screen py-20 font-sans">
      <div className="max-w-420 mx-auto px-6">

        {/* Page Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red font-semibold text-sm mb-5">
            <Send size={14} /> Get In Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-black tracking-tight mb-4">
            Contact <span className="text-brand-blue">Us</span>
          </h1>
          <p className="text-lg text-brand-gray max-w-xl mx-auto">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── LEFT: Company Info Panel ── */}
          <aside className="w-full lg:w-[480px] shrink-0 flex flex-col gap-5">
            <div className="bg-brand-black rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-brand-black/20">
              {/* Decorative blobs */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-blue rounded-full opacity-20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-brand-red rounded-full opacity-20 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-2xl font-extrabold mb-2">
                  {generalInfo.companyName || 'UpDownLive'}
                </h2>
                <p className="text-white/70 text-sm font-medium mb-8 leading-relaxed">
                  Your premier source for global market news, forex analysis, and real-time financial data.
                </p>

                {infoLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-14 rounded-xl bg-white/10 animate-pulse" />
                    ))}
                  </div>
                ) : infoCards.length > 0 ? (
                  <div className="space-y-4">
                    {infoCards.map((card, i) => {
                      const Icon = card.icon;
                      return (
                        <div key={i} className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                          <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                            <Icon size={18} className="text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">
                              {card.label}
                            </p>
                            <p className="text-white font-medium text-sm leading-snug whitespace-pre-line break-words">
                              {card.value}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-white/50 text-sm italic">
                    Contact details not configured yet. Set them in Admin → Settings → General Information.
                  </p>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-gray mb-4">Quick Links</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Live Market Feed', href: '/' },
                  { label: 'Latest News', href: '/news' },
                  { label: 'Broker Reviews', href: '/brokers' },
                  { label: 'Economic Calendar', href: '/economic-calendar' },
                ].map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 text-sm font-semibold text-brand-gray hover:text-brand-blue transition-colors py-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue flex-shrink-0" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* ── RIGHT: Contact Form ── */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-brand-border p-8 md:p-10">
            <h2 className="text-2xl font-extrabold text-brand-black mb-1">Send Us a Message</h2>
            <p className="text-brand-gray text-sm mb-8">Fill in the form below and we'll get back to you within 24 hours.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Error Banner */}
              {status === 'error' && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 border border-red-200">
                  <AlertCircle size={18} />
                  <span className="font-medium text-sm">{errorMessage}</span>
                </div>
              )}

              {/* Department */}
              <div className="flex flex-col gap-2">
                <label htmlFor="department" className="text-sm font-semibold text-brand-black">
                  Which department do you want to contact?
                </label>
                <div className="relative">
                  <select
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className={inputClass + ' appearance-none'}
                    required
                  >
                    <option value="Newsroom">Newsroom</option>
                    <option value="Advertise">Advertise</option>
                    <option value="Support">Support</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-brand-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className="text-sm font-semibold text-brand-black">First name</label>
                  <input type="text" id="firstName" required value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={inputClass} placeholder="First name" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="text-sm font-semibold text-brand-black">Last name</label>
                  <input type="text" id="lastName" required value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={inputClass} placeholder="Last name" />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-brand-black">
                  Email <span className="text-brand-red">*</span>
                </label>
                <input type="email" id="email" required value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass} placeholder="you@example.com" />
              </div>

              {/* Phone & Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-brand-black">Phone</label>
                  <input type="tel" id="phone" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={inputClass} placeholder="+1 (123) 456-7890" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="companyName" className="text-sm font-semibold text-brand-black">Company Name</label>
                  <input type="text" id="companyName" value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className={inputClass} placeholder="Your Company" />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-brand-black">Message</label>
                <textarea id="message" required rows={4} value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={inputClass + ' resize-none'}
                  placeholder="How can we help you today?" />
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  id="terms" type="checkbox" checked={formData.agreedToTerms}
                  onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded border-gray-300 accent-brand-blue cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-brand-gray cursor-pointer leading-relaxed">
                  By submitting, I acknowledge and agree to UpDownLive{' '}
                  <a href="#" className="text-brand-blue hover:underline font-semibold">Terms of Service</a>
                </label>
              </div>

              {/* reCAPTCHA note */}
              <p className="text-xs italic text-brand-gray/70">
                This site is protected by reCAPTCHA and the Google{' '}
                <a href="#" className="text-brand-blue hover:underline">Privacy Policy</a> and{' '}
                <a href="#" className="text-brand-blue hover:underline">Terms of Service</a> apply.
              </p>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {status === 'loading' ? (
                    'Submitting...'
                  ) : (
                    <><Send size={16} /> Submit Message</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── Success Modal ── */}
      {status === 'success' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setStatus('idle')}
        >
          <div
            className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                <Check size={40} />
              </div>
              <h3 className="text-2xl font-extrabold text-brand-black mb-3">Message Sent!</h3>
              <p className="text-brand-gray mb-8 leading-relaxed">
                Thank you for reaching out. We've received your details and will get back to you shortly.
                A confirmation email has been sent to your address.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-blue/90 transition-colors w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
