"use client";
import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '@/lib/axios';
import {
  Send, Check, AlertCircle,
  Building2, MapPin, Phone, Mail, Clock, Globe, ChevronDown, Search
} from 'lucide-react';

const COUNTRIES = [
  { code: '+91', iso: 'in', name: 'India' },
  { code: '+1', iso: 'us', name: 'United States' },
  { code: '+1', iso: 'ca', name: 'Canada' },
  { code: '+44', iso: 'gb', name: 'United Kingdom' },
  { code: '+61', iso: 'au', name: 'Australia' },
  { code: '+49', iso: 'de', name: 'Germany' },
  { code: '+33', iso: 'fr', name: 'France' },
  { code: '+81', iso: 'jp', name: 'Japan' },
  { code: '+86', iso: 'cn', name: 'China' },
  { code: '+971', iso: 'ae', name: 'UAE' },
  { code: '+65', iso: 'sg', name: 'Singapore' },
  { code: '+60', iso: 'my', name: 'Malaysia' },
  { code: '+55', iso: 'br', name: 'Brazil' },
  { code: '+27', iso: 'za', name: 'South Africa' },
  { code: '+234', iso: 'ng', name: 'Nigeria' },
  { code: '+254', iso: 'ke', name: 'Kenya' },
  { code: '+966', iso: 'sa', name: 'Saudi Arabia' },
  { code: '+92', iso: 'pk', name: 'Pakistan' },
  { code: '+880', iso: 'bd', name: 'Bangladesh' },
  { code: '+94', iso: 'lk', name: 'Sri Lanka' },
  { code: '+20', iso: 'eg', name: 'Egypt' },
  { code: '+62', iso: 'id', name: 'Indonesia' },
  { code: '+82', iso: 'kr', name: 'South Korea' },
  { code: '+52', iso: 'mx', name: 'Mexico' },
  { code: '+31', iso: 'nl', name: 'Netherlands' },
];

function FlagImg({ iso }: { iso: string }) {
  return (
    <img
      src={`https://flagcdn.com/w20/${iso}.png`}
      srcSet={`https://flagcdn.com/w40/${iso}.png 2x`}
      width={20}
      height={15}
      alt={iso}
      className="rounded-sm object-cover shrink-0"
    />
  );
}

function PhoneCountrySelect({
  selected, onSelect,
}: {
  selected: typeof COUNTRIES[0];
  onSelect: (c: typeof COUNTRIES[0]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.includes(search)
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0 self-stretch">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 h-full text-sm font-medium text-brand-black dark:text-white border-r border-brand-gray/20 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <FlagImg iso={selected.iso} />
        <span className="text-xs text-brand-gray dark:text-gray-400 font-semibold">{selected.code}</span>
        <ChevronDown size={12} className={`text-brand-gray dark:text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-60 bg-white dark:bg-zinc-900 border border-brand-border dark:border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-brand-border dark:border-white/10">
            <div className="flex items-center gap-2 px-3 py-2 bg-brand-light dark:bg-zinc-800 rounded-lg">
              <Search size={13} className="text-brand-gray dark:text-gray-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search country..."
                className="flex-1 bg-transparent text-sm text-brand-black dark:text-white outline-none placeholder:text-brand-gray/50 dark:placeholder:text-gray-500"
              />
            </div>
          </div>
          {/* List */}
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-xs text-brand-gray dark:text-gray-500 py-4">No results</p>
            ) : filtered.map((c, i) => (
              <button
                key={`${c.iso}-${i}`}
                type="button"
                onClick={() => { onSelect(c); setOpen(false); setSearch(''); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                  c.iso === selected.iso
                    ? 'bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue'
                    : 'text-brand-black dark:text-white hover:bg-brand-light dark:hover:bg-white/5'
                }`}
              >
                <FlagImg iso={c.iso} />
                <span className="flex-1 font-medium">{c.name}</span>
                <span className="text-xs text-brand-gray dark:text-gray-400">{c.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
    department: 'Support', firstName: '', lastName: '', email: '',
    phone: '', companyName: '', message: '', agreedToTerms: false,
  });
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [phoneError, setPhoneError] = useState('');
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
      setStatus('error');
      setErrorMessage('You must agree to the Terms of Service to submit.');
      return;
    }

    setPhoneError('');
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const response = await axiosInstance.post(`/enquiries`, {
        ...formData,
        phone: formData.phone ? `${selectedCountry.code} ${formData.phone}` : '',
      });
      
      console.log('Enquiry response:', response.data);
      setStatus('success');
      setFormData({ department: 'Support', firstName: '', lastName: '', email: '', phone: '', companyName: '', message: '', agreedToTerms: false });
      setSelectedCountry(COUNTRIES[0]);
      setPhoneError('');
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
    'w-full px-5 py-3.5 bg-brand-light dark:bg-zinc-800 border border-transparent dark:border-white/5 rounded-lg text-brand-black dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all font-medium placeholder:text-brand-gray/50 dark:placeholder:text-gray-500';

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
    <div className="bg-brand-light dark:bg-black min-h-screen py-10 md:py-20 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Page Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red font-semibold text-sm mb-4 md:mb-5">
            <Send size={14} /> Get In Touch
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-black dark:text-white tracking-tight mb-3 md:mb-4">
            Contact <span className="text-brand-blue">Us</span>
          </h1>
          <p className="text-base md:text-lg text-brand-gray dark:text-gray-400 max-w-xl mx-auto">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">

          {/* ── LEFT: Company Info Panel ── */}
          <aside className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-5">
            <div className="bg-brand-black dark:bg-zinc-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-brand-black/20 dark:shadow-black/50">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-blue rounded-full opacity-20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-brand-red rounded-full opacity-20 blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-xl md:text-2xl font-extrabold mb-2">
                  {generalInfo.companyName || 'UpDownLive'}
                </h2>
                <p className="text-white/70 text-sm font-medium mb-6 leading-relaxed">
                  Your premier source for global market news, forex analysis, and real-time financial data.
                </p>
                {infoLoading ? (
                  <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-14 rounded-xl bg-white/10 animate-pulse" />)}</div>
                ) : infoCards.length > 0 ? (
                  <div className="space-y-3">
                    {infoCards.map((card, i) => {
                      const Icon = card.icon;
                      return (
                        <div key={i} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/15 transition-colors">
                          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                            <Icon size={16} className="text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-0.5">{card.label}</p>
                            <p className="text-white font-medium text-sm leading-snug wrap-break-word">{card.value}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-white/50 text-sm italic">Contact details not configured yet.</p>
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-brand-border dark:border-white/10 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-gray dark:text-gray-400 mb-4">Quick Links</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Live Market Feed', href: '/' },
                  { label: 'Latest News', href: '/news' },
                  { label: 'Broker Reviews', href: '/brokers' },
                  { label: 'Economic Calendar', href: '/economic-calendar' },
                ].map(link => (
                  <a key={link.href} href={link.href} className="flex items-center gap-2 text-sm font-semibold text-brand-gray dark:text-gray-400 hover:text-brand-blue transition-colors py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />{link.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* ── RIGHT: Contact Form ── */}
          <div className="flex-1 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-brand-border dark:border-white/10 p-5 sm:p-8 md:p-10">
            <h2 className="text-xl md:text-2xl font-extrabold text-brand-black dark:text-white mb-1">Send Us a Message</h2>
            <p className="text-brand-gray dark:text-gray-400 text-sm mb-6 md:mb-8">Fill in the form below and we'll get back to you within 24 hours.</p>

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
                <label htmlFor="department" className="text-sm font-semibold text-brand-black dark:text-white">
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
                  <label htmlFor="firstName" className="text-sm font-semibold text-brand-black dark:text-white">First name</label>
                  <input type="text" id="firstName" required value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={inputClass} placeholder="First name" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="text-sm font-semibold text-brand-black dark:text-white">Last name</label>
                  <input type="text" id="lastName" required value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={inputClass} placeholder="Last name" />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-brand-black dark:text-white">
                  Email <span className="text-brand-red">*</span>
                </label>
                <input type="email" id="email" required value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass} placeholder="you@example.com" />
              </div>

              {/* Phone & Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-brand-black dark:text-white">Phone</label>
                  <div className="flex items-stretch w-full bg-brand-light dark:bg-zinc-800 border border-transparent dark:border-white/5 rounded-lg focus-within:bg-white dark:focus-within:bg-zinc-900 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all overflow-visible">
                    <PhoneCountrySelect selected={selectedCountry} onSelect={setSelectedCountry} />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => { setFormData(p => ({ ...p, phone: e.target.value })); if (phoneError) setPhoneError(''); }}
                      placeholder="Phone number"
                      className="flex-1 bg-transparent text-brand-black dark:text-white text-sm font-medium px-4 py-3.5 outline-none placeholder:text-brand-gray/50 dark:placeholder:text-gray-500"
                    />
                  </div>
                  {phoneError && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                      <AlertCircle size={12} /> {phoneError}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="companyName" className="text-sm font-semibold text-brand-black dark:text-white">Company Name</label>
                  <input type="text" id="companyName" value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className={inputClass} placeholder="Your Company" />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-brand-black dark:text-white">Message</label>
                <textarea id="message" required rows={4} value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={inputClass + ' resize-none'}
                  placeholder="How can we help you today?" />
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  id="terms" 
                  type="checkbox" 
                  checked={formData.agreedToTerms}
                  onChange={(e) => {
                    setFormData({ ...formData, agreedToTerms: e.target.checked });
                    if (e.target.checked && status === 'error' && errorMessage.includes('Terms of Service')) {
                      setStatus('idle');
                      setErrorMessage('');
                    }
                  }}
                  className="mt-1 w-4 h-4 rounded border-gray-300 accent-brand-blue cursor-pointer"
                  required
                />
                <label htmlFor="terms" className="text-sm text-brand-gray dark:text-gray-400 cursor-pointer leading-relaxed">
                  By submitting, I acknowledge and agree to UpDownLive{' '}
                  <a href="/terms" className="text-brand-blue hover:underline font-semibold">Terms of Service</a>
                  {' '}<span className="text-brand-red">*</span>
                </label>
              </div>

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
            className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-in fade-in zoom-in duration-300 border dark:border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                <Check size={40} />
              </div>
              <h3 className="text-2xl font-extrabold text-brand-black dark:text-white mb-3">Message Sent!</h3>
              <p className="text-brand-gray dark:text-gray-400 mb-8 leading-relaxed">
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
