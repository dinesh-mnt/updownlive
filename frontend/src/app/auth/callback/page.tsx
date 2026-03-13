"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Wait a moment for the OAuth callback to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get the session to check user role
        const { data: sessionData } = await authClient.getSession();
        
        if (sessionData?.user) {
          const isAdmin = (sessionData.user as any)?.role === "admin";
          
          if (isAdmin) {
            // Admin users go to dashboard
            window.location.href = "/admin/dashboard";
          } else {
            // Regular users go to home page
            window.location.href = "/";
          }
        } else {
          // No session, redirect to login
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/admin/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-outfit bg-gradient-to-br from-brand-blue/5 to-brand-red/5">
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
