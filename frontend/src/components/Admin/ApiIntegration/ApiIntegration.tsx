"use client";
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { Key, Eye, EyeOff, Save, Loader2, CheckCircle, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/Card";
import { useToast } from "@/hooks/use-toast";

interface ApiSection {
  id: string;
  title: string;
  endpoint: string;
  placeholder: string;
  tagColor: string;
}

const SECTIONS: ApiSection[] = [
  {
    id: "forex",
    title: "Forex & Gold",
    endpoint: "news-api-key",
    placeholder: "Enter NewsAPI key…",
    tagColor: "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
  },
  {
    id: "crypto",
    title: "Crypto",
    endpoint: "crypto-api-key",
    placeholder: "Enter CoinGecko API key…",
    tagColor: "bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700",
  },
  {
    id: "stocks",
    title: "Stocks",
    endpoint: "stocks-api-key",
    placeholder: "Enter Stocks API key…",
    tagColor: "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700",
  },
];

interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 border border-brand-border dark:border-white/10">
        <h3 className="text-lg font-bold text-brand-black dark:text-white mb-2">Edit API Key?</h3>
        <p className="text-brand-gray dark:text-gray-400 text-sm mb-6">
          Are you sure you want to edit this API key? The current key will be replaced.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-xl border border-brand-border dark:border-white/10 text-brand-gray dark:text-gray-400 font-semibold hover:bg-brand-light dark:hover:bg-white/5 transition-colors"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-brand-blue text-white font-semibold hover:bg-brand-red transition-colors"
          >
            Yes, Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApiIntegration() {
  const { toast } = useToast();
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [savedKeys, setSavedKeys] = useState<Record<string, string>>({});
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.all(
        SECTIONS.map(async (s) => {
          try {
            const res = await axiosInstance.get(`/settings/${s.endpoint}`);
            return { id: s.id, key: res.data?.apiKey || '' };
          } catch {
            return { id: s.id, key: '' };
          }
        })
      );
      const map: Record<string, string> = {};
      results.forEach(r => { map[r.id] = r.key; });
      setKeys(map);
      setSavedKeys(map);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const handleSave = async (s: ApiSection) => {
    setSaving(v => ({ ...v, [s.id]: true }));
    try {
      await axiosInstance.post(`/settings/${s.endpoint}`, { apiKey: keys[s.id] || '' });
      setSavedKeys(v => ({ ...v, [s.id]: keys[s.id] }));
      setEditing(v => ({ ...v, [s.id]: false }));
      toast({ variant: 'success' as any, description: `${s.title} API key saved.` });
    } catch {
      toast({ variant: 'destructive', description: `Failed to save ${s.title} API key.` });
    } finally {
      setSaving(v => ({ ...v, [s.id]: false }));
    }
  };

  const isSaved = (id: string) => !!savedKeys[id] && !editing[id];

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={32} className="animate-spin text-brand-blue" />
    </div>
  );

  return (
    <>
      {confirmId && (
        <ConfirmModal
          onConfirm={() => {
            setEditing(v => ({ ...v, [confirmId]: true }));
            setConfirmId(null);
          }}
          onCancel={() => setConfirmId(null)}
        />
      )}

      <div className="mb-10 animate-in fade-in duration-500">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black dark:text-white mb-2 tracking-tight">
          API Integrations
        </h1>
        <p className="text-brand-gray dark:text-gray-400 text-lg">
          Manage API keys for each data source. Keys are stored securely in MongoDB.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {SECTIONS.map((s) => (
          <Card key={s.id} className="rounded-3xl border-brand-border dark:border-white/10 shadow-sm bg-white dark:bg-zinc-900 transition-colors duration-300">
            <CardHeader className="border-b border-brand-border dark:border-white/10 bg-brand-light/50 dark:bg-white/5 rounded-t-3xl px-8 py-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-brand-black dark:text-white">
                  <Key size={20} className="text-brand-blue" /> {s.title}
                </CardTitle>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${s.tagColor}`}>
                  {s.title}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-brand-gray dark:text-gray-400 uppercase tracking-widest mb-2">
                    API Key
                  </label>
                  <div className="relative">
                    <input
                      type={show[s.id] ? "text" : "password"}
                      value={keys[s.id] || ''}
                      onChange={(e) => setKeys(k => ({ ...k, [s.id]: e.target.value }))}
                      disabled={isSaved(s.id)}
                      className="w-full bg-white dark:bg-zinc-800 border border-brand-border dark:border-white/10 text-brand-black dark:text-white px-4 py-3 pr-12 rounded-xl focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all font-mono disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder={s.placeholder}
                    />
                    <button
                      onClick={() => setShow(v => ({ ...v, [s.id]: !v[s.id] }))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray dark:text-gray-500 hover:text-brand-blue transition-colors focus:outline-none"
                    >
                      {show[s.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {isSaved(s.id) ? (
                  <button
                    onClick={() => setConfirmId(s.id)}
                    className="bg-zinc-100 dark:bg-zinc-800 text-brand-black dark:text-white border border-brand-border dark:border-white/10 px-8 py-3 rounded-xl font-bold hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-colors flex items-center gap-2 w-full md:w-auto justify-center h-[50px]"
                  >
                    <Pencil size={16} /> Edit Key
                  </button>
                ) : (
                  <button
                    onClick={() => handleSave(s)}
                    disabled={saving[s.id] || !keys[s.id]}
                    className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-red transition-colors shadow-lg shadow-brand-blue/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto justify-center h-[50px]"
                  >
                    {saving[s.id] ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <><Save size={18} /> Save Key</>
                    )}
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
