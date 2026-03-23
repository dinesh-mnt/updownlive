"use client";
import { useEffect, useState } from 'react';
import { MessageSquare, Trash2, Loader2, ExternalLink, Search } from 'lucide-react';

interface Comment {
  _id: string;
  userName: string;
  userEmail: string;
  content: string;
  articleTitle: string;
  articleUrl: string;
  createdAt: string;
}

export default function CommentsManager() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filtered, setFiltered] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q
        ? comments.filter(
            c =>
              c.userName.toLowerCase().includes(q) ||
              c.userEmail.toLowerCase().includes(q) ||
              c.content.toLowerCase().includes(q) ||
              c.articleTitle.toLowerCase().includes(q)
          )
        : comments
    );
  }, [search, comments]);

  const fetchComments = async () => {
    try {
      const res = await fetch('/api/comments/all');
      const data = await res.json();
      if (data.success) {
        setComments(data.comments);
        setFiltered(data.comments);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setComments(prev => prev.filter(c => c._id !== id));
      }
    } catch {
      // silent
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-black dark:text-white">Comments</h1>
          <p className="text-brand-gray dark:text-gray-400 text-sm mt-1">
            {comments.length} total comment{comments.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray" />
          <input
            type="text"
            placeholder="Search comments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-brand-border dark:border-white/10 bg-white dark:bg-zinc-900 text-brand-black dark:text-white text-sm outline-none focus:border-brand-blue transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 size={36} className="animate-spin text-brand-blue" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10">
          <MessageSquare size={40} className="mx-auto text-brand-border dark:text-white/20 mb-4" />
          <p className="text-brand-gray dark:text-gray-400">
            {search ? 'No comments match your search.' : 'No comments yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(comment => (
            <div
              key={comment._id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-brand-border dark:border-white/10 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-red flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {comment.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* User info */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                      <span className="font-bold text-brand-black dark:text-white text-sm">{comment.userName}</span>
                      <span className="text-xs text-brand-gray dark:text-gray-500">{comment.userEmail}</span>
                      <span className="text-xs text-brand-gray dark:text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {/* Comment content */}
                    <p className="text-sm text-brand-black dark:text-gray-200 leading-relaxed mb-3">
                      {comment.content}
                    </p>
                    {/* Article reference */}
                    <div className="flex items-center gap-1.5 text-xs text-brand-gray dark:text-gray-500">
                      <MessageSquare size={12} />
                      <span className="truncate max-w-xs">{comment.articleTitle}</span>
                      <a
                        href={`/news/${encodeURIComponent(comment.articleUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-blue hover:underline shrink-0 flex items-center gap-0.5"
                      >
                        View <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(comment._id)}
                  disabled={deleting === comment._id}
                  className="shrink-0 p-2 rounded-lg text-brand-gray hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                  title="Delete comment"
                >
                  {deleting === comment._id
                    ? <Loader2 size={16} className="animate-spin" />
                    : <Trash2 size={16} />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
