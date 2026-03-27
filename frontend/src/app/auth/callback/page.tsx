"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, isPending } = useAuth();

  useEffect(() => {
    if (isPending) return;
    if (user) {
      window.location.href = user.role === 'admin' ? '/admin/dashboard' : '/';
    } else {
      router.push('/admin/login');
    }
  }, [user, isPending, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-outfit bg-linear-to-br from-brand-blue/5 to-brand-red/5">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-2xl mb-6">
          <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
        </div>
        <h3 className="text-xl font-bold text-brand-black mb-2">Completing sign in...</h3>
        <p className="text-brand-gray">Please wait while we redirect you</p>
      </div>
    </div>
  );
}
