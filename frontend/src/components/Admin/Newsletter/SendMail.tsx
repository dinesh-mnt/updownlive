"use client";
import React, { useState } from 'react';
import axiosInstance from '@/lib/axios';
import { Send, Mail, Type, MessageSquare } from 'lucide-react';
import { Card } from '@/components/UI/Card';

export default function SendMail() {
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
    setSuccess(false);
  };

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
      const res = await axiosInstance.post('/newsletter/send-bulk-email', formData);
      setSuccess(true);
      setFormData({ subject: '', title: '', message: '' });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send emails');
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-brand-black dark:text-white">Send Newsletter</h1>
        <p className="text-sm text-brand-gray dark:text-gray-400 mt-1">
          Send an email to all active newsletter subscribers
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Subject */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-brand-black dark:text-white mb-2">
              <Mail className="w-4 h-4" />
              Email Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter email subject line"
              className="w-full px-4 py-3 rounded-lg border border-brand-border dark:border-white/10 bg-white dark:bg-white/5 text-brand-black dark:text-white placeholder-brand-gray dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-brand-black dark:text-white mb-2">
              <Type className="w-4 h-4" />
              Email Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter email title (displayed in email header)"
              className="w-full px-4 py-3 rounded-lg border border-brand-border dark:border-white/10 bg-white dark:bg-white/5 text-brand-black dark:text-white placeholder-brand-gray dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-brand-black dark:text-white mb-2">
              <MessageSquare className="w-4 h-4" />
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message content..."
              rows={8}
              className="w-full px-4 py-3 rounded-lg border border-brand-border dark:border-white/10 bg-white dark:bg-white/5 text-brand-black dark:text-white placeholder-brand-gray dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all resize-none"
              required
            />
            <p className="text-xs text-brand-gray dark:text-gray-500 mt-2">
              This message will be sent to all active subscribers
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 shadow-lg min-w-[300px]">
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-300">Error!</p>
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                  <button
                    onClick={() => setError('')}
                    className="shrink-0 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 shadow-lg min-w-[300px]">
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-800 dark:text-green-300">Success!</p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Email sent successfully to all subscribers!
                    </p>
                  </div>
                  <button
                    onClick={() => setSuccess(false)}
                    className="shrink-0 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-brand-border dark:border-white/10">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-600 transition-all shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {loading ? 'Sending...' : 'Send to All Subscribers'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
