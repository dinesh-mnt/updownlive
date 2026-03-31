"use client";
import React, { useState, useRef } from 'react';
import axiosInstance from '@/lib/axios';
import { Send, Mail, Type, MessageSquare, ImagePlus, X, Loader2, Eye } from 'lucide-react';
import { Card } from '@/components/UI/Card';

export default function SendMail() {
  const [formData, setFormData] = useState({ subject: '', title: '', message: '' });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const form = new FormData();
      Array.from(files).forEach(f => form.append('images', f));
      const res = await axiosInstance.post('/upload/newsletter-images', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) setImages(prev => [...prev, ...res.data.urls]);
    } catch {
      setError('Failed to upload images');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = (url: string) => setImages(prev => prev.filter(u => u !== url));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.title || !formData.message) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await axiosInstance.post('/newsletter/send-bulk-email', { ...formData, images });
      setSuccess(true);
      setFormData({ subject: '', title: '', message: '' });
      setImages([]);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send emails');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Build preview HTML matching the backend email template
  const imagesHtml = images.length > 0
    ? `<div style="margin:20px 0;display:flex;flex-wrap:wrap;gap:10px;">${images.map(url =>
        `<img src="${url}" style="max-width:100%;width:${images.length === 1 ? '100%' : '48%'};border-radius:8px;object-fit:cover;display:block;" />`
      ).join('')}</div>`
    : '';

  const previewHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f3f4f6;padding:24px;">
      <div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#3b82f6,#2563eb);padding:32px 30px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">${formData.title || 'Email Title'}</h1>
        </div>
        <div style="padding:32px 30px;">
          ${imagesHtml}
          <p style="white-space:pre-wrap;font-size:15px;color:#374151;line-height:1.8;margin:0;">${formData.message || 'Your message will appear here...'}</p>
        </div>
        <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 30px;text-align:center;font-size:12px;color:#6b7280;">
          <p style="margin:0 0 6px;">You're receiving this because you subscribed to UpDownLive newsletter.</p>
          <a href="#" style="color:#3b82f6;text-decoration:none;">Unsubscribe</a>
        </div>
      </div>
    </div>
  `;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-brand-black dark:text-white">Send Newsletter</h1>
        <p className="text-sm text-brand-gray dark:text-gray-400 mt-1">Send an email to all active newsletter subscribers</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* ── Form ── */}
        <div className="flex-1 min-w-0">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-brand-black dark:text-white mb-2">
                  <Mail className="w-4 h-4" /> Email Subject
                </label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange}
                  placeholder="Enter email subject line"
                  className="w-full px-4 py-3 rounded-lg border border-brand-border dark:border-white/10 bg-white dark:bg-white/5 text-brand-black dark:text-white placeholder-brand-gray dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all"
                  required />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-brand-black dark:text-white mb-2">
                  <Type className="w-4 h-4" /> Email Title
                </label>
                <input type="text" name="title" value={formData.title} onChange={handleChange}
                  placeholder="Enter email title (displayed in email header)"
                  className="w-full px-4 py-3 rounded-lg border border-brand-border dark:border-white/10 bg-white dark:bg-white/5 text-brand-black dark:text-white placeholder-brand-gray dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all"
                  required />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-brand-black dark:text-white mb-2">
                  <MessageSquare className="w-4 h-4" /> Message
                </label>
                <textarea name="message" value={formData.message} onChange={handleChange}
                  placeholder="Enter your message content..." rows={8} maxLength={5000}
                  className="w-full px-4 py-3 rounded-lg border border-brand-border dark:border-white/10 bg-white dark:bg-white/5 text-brand-black dark:text-white placeholder-brand-gray dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all resize-none"
                  required />
                <p className="text-xs text-brand-gray dark:text-gray-500 mt-1">{formData.message.length}/5000</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-brand-black dark:text-white mb-2">
                  <ImagePlus className="w-4 h-4" /> Attach Images
                  <span className="text-brand-gray dark:text-gray-500 font-normal">(optional, up to 10)</span>
                </label>
                <div onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-brand-border dark:border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-brand-blue hover:bg-brand-blue/5 transition-all">
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2 text-brand-blue">
                      <Loader2 size={20} className="animate-spin" /> Uploading...
                    </div>
                  ) : (
                    <>
                      <ImagePlus size={28} className="mx-auto text-brand-gray dark:text-gray-500 mb-2" />
                      <p className="text-sm text-brand-gray dark:text-gray-400">Click to upload images</p>
                      <p className="text-xs text-brand-gray dark:text-gray-500 mt-1">JPG, PNG, GIF, WebP — max 5MB each</p>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                    {images.map((url, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden border border-brand-border dark:border-white/10 aspect-square">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(url)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 shadow-lg min-w-[300px] flex items-center gap-3">
                    <p className="text-sm text-red-600 dark:text-red-400 flex-1">{error}</p>
                    <button onClick={() => setError('')}><X size={16} className="text-red-500" /></button>
                  </div>
                </div>
              )}
              {success && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 shadow-lg min-w-[300px] flex items-center gap-3">
                    <p className="text-sm text-green-600 dark:text-green-400 flex-1">Email sent successfully to all subscribers!</p>
                    <button onClick={() => setSuccess(false)}><X size={16} className="text-green-500" /></button>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-brand-border dark:border-white/10">
                <button type="submit" disabled={loading || uploading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-600 transition-all shadow-lg shadow-brand-blue/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send className="w-5 h-5" />
                  {loading ? 'Sending...' : 'Send to All Subscribers'}
                </button>
              </div>
            </form>
          </Card>
        </div>

        {/* ── Preview Panel ── */}
        <div className="w-full xl:w-[420px] shrink-0">
          <div className="sticky top-6">
            <div className="flex items-center gap-2 mb-3">
              <Eye size={16} className="text-brand-blue" />
              <span className="text-sm font-bold text-brand-black dark:text-white">Email Preview</span>
              {formData.subject && (
                <span className="ml-auto text-xs text-brand-gray dark:text-gray-500 truncate max-w-[180px]">
                  Subject: {formData.subject}
                </span>
              )}
            </div>
            {/* Simulated email client frame */}
            <div className="rounded-2xl border border-brand-border dark:border-white/10 overflow-hidden shadow-lg bg-white dark:bg-zinc-900">
              {/* Fake email client header */}
              <div className="bg-brand-light dark:bg-zinc-800 px-4 py-3 border-b border-brand-border dark:border-white/10 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-brand-gray dark:text-gray-400 ml-2 font-medium">
                  {formData.subject || 'No subject'}
                </span>
              </div>
              {/* Preview iframe */}
              <div className="overflow-auto max-h-[600px]">
                <iframe
                  srcDoc={previewHtml}
                  title="Email Preview"
                  className="w-full border-0"
                  style={{ height: '560px' }}
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
            <p className="text-xs text-brand-gray dark:text-gray-500 mt-2 text-center">
              Live preview updates as you type
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
