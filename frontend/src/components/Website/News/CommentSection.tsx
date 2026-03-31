"use client";
import { useEffect, useState } from 'react';
import { MessageSquare, Send, Trash2, User, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface Comment {
  _id: string;
  userName: string;
  userEmail: string;
  content: string;
  createdAt: string;
}

interface Props {
  articleUrl: string;
  articleTitle: string;
}

export default function CommentSection({ articleUrl, articleTitle }: Props) {
  const { user: sessionUser } = useAuth();
  const session = sessionUser ? { user: sessionUser } : null;
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = (session?.user as { role?: string })?.role === 'admin';

  useEffect(() => {
    fetchComments();
  }, [articleUrl]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?articleUrl=${encodeURIComponent(articleUrl)}`);
      const data = await res.json();
      if (data.success) setComments(data.comments);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const token = typeof window !== 'undefined'
        ? (localStorage.getItem('userToken') || sessionStorage.getItem('userToken') ||
           localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken'))
        : null;

      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ articleUrl, articleTitle, content }),
      });
      const data = await res.json();
      if (data.success) {
        setComments(prev => [data.comment, ...prev]);
        setContent('');
      } else {
        setError(data.message || 'Failed to post comment');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment?')) return;
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setComments(prev => prev.filter(c => c._id !== id));
    } catch {
      // silent
    }
  };

  if (!session) return null;

  return (
    <div className="mt-12 pt-8 border-t border-brand-border dark:border-white/10">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare size={22} className="text-brand-blue" />
        <h3 className="text-xl font-bold text-brand-black dark:text-white">
          Comments <span className="text-brand-gray dark:text-gray-400 font-normal text-base">({comments.length})</span>
        </h3>
      </div>

      {/* Post comment form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-blue flex items-center justify-center shrink-0 mt-1">
            <User size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              maxLength={1000}
              className="w-full px-4 py-3 rounded-xl border border-brand-border dark:border-white/10 bg-white dark:bg-zinc-800 text-brand-black dark:text-white placeholder-brand-gray dark:placeholder-gray-500 outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all resize-none text-sm"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-brand-gray dark:text-gray-500">{content.length}/1000</span>
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="inline-flex items-center gap-2 bg-brand-blue text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Post
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={28} className="animate-spin text-brand-blue" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-brand-gray dark:text-gray-500">
          <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No comments yet. Be the first to share your thoughts.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment._id} className="flex gap-3 group">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-brand-blue to-brand-red flex items-center justify-center shrink-0 text-white text-sm font-bold">
                {comment.userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 bg-brand-light dark:bg-zinc-800 rounded-2xl px-4 py-3 border border-brand-border dark:border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-brand-black dark:text-white">{comment.userName}</span>
                    <span className="text-xs text-brand-gray dark:text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-gray hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                      title="Delete comment"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-brand-black dark:text-gray-200 leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
