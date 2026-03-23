"use client";
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { Trash2, Mail, Calendar, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Card } from '@/components/UI/Card';

interface Subscriber {
  _id: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
}

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await axiosInstance.get('/newsletter/subscribers');
      setSubscribers(res.data.subscribers);
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncUsers = async () => {
    setSyncLoading(true);
    setSyncMessage(null);
    
    try {
      const res = await axiosInstance.post('/newsletter/sync-users');
      setSyncMessage({
        type: 'success',
        text: `Synced ${res.data.synced} users, ${res.data.skipped} already existed`
      });
      
      // Refresh subscribers list
      await fetchSubscribers();
      
      // Auto-hide message after 5 seconds
      setTimeout(() => setSyncMessage(null), 5000);
    } catch (error: any) {
      console.error('Failed to sync users:', error);
      setSyncMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to sync users'
      });
      
      // Auto-hide error after 5 seconds
      setTimeout(() => setSyncMessage(null), 5000);
    } finally {
      setSyncLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;

    setDeleteLoading(id);
    try {
      await axiosInstance.delete(`/newsletter/subscribers/${id}`);
      setSubscribers(prev => prev.filter(sub => sub._id !== id));
    } catch (error) {
      console.error('Failed to delete subscriber:', error);
      alert('Failed to delete subscriber');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-black dark:text-white">Newsletter Subscribers</h1>
          <p className="text-sm text-brand-gray dark:text-gray-400 mt-1">
            Manage your newsletter subscribers ({subscribers.length} total)
          </p>
        </div>
        
        <button
          onClick={handleSyncUsers}
          disabled={syncLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-lg font-semibold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${syncLoading ? 'animate-spin' : ''}`} />
          {syncLoading ? 'Syncing...' : 'Sync Registered Users'}
        </button>
      </div>

      {/* Sync Message Toast */}
      {syncMessage && (
        <div className={`p-4 rounded-lg border ${
          syncMessage.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
        }`}>
          <div className="flex items-center gap-3">
            {syncMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 shrink-0" />
            )}
            <p className="font-medium">{syncMessage.text}</p>
            <button
              onClick={() => setSyncMessage(null)}
              className="ml-auto text-current hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-brand-light dark:bg-white/5 border-b border-brand-border dark:border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-brand-gray dark:text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-brand-gray dark:text-slate-500 uppercase tracking-wider">
                  Subscribed Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-brand-gray dark:text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-brand-gray dark:text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border dark:divide-white/10">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-brand-gray dark:text-gray-400">
                    No subscribers yet
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber) => (
                  <tr key={subscriber._id} className="hover:bg-brand-light dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-brand-blue" />
                        </div>
                        <span className="font-medium text-brand-black dark:text-white">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-brand-gray dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(subscriber.subscribedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {subscriber.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                          <XCircle className="w-3.5 h-3.5" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(subscriber._id)}
                        disabled={deleteLoading === subscriber._id}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deleteLoading === subscriber._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
