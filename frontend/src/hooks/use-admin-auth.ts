"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

interface AdminAuthState {
  loading: boolean;
  isAdmin: boolean;
  accessDenied: boolean;
  user: any;
}

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({
    loading: true,
    isAdmin: false,
    accessDenied: false,
    user: null
  });
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const verifyAdminAuth = async () => {
      try {
        // Give time for cookies to be available
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const { data: sessionData, error } = await authClient.getSession();
        
        console.log('Admin auth check:', { 
          hasSession: !!sessionData, 
          hasUser: !!sessionData?.user,
          error: error?.message,
          cookies: document.cookie
        }); // Debug log
        
        if (!mounted) return;

        if (error) {
          console.error('Session error:', error);
        }
        
        if (!sessionData?.user) {
          // No session, redirect to login
          console.log('No session found, redirecting to login');
          router.replace('/admin/login');
          return;
        }

        const user = sessionData.user;
        const isAdmin = (user as any)?.role === 'admin';

        console.log('User role check:', { 
          email: user.email, 
          role: (user as any)?.role,
          isAdmin 
        }); // Debug log

        if (!isAdmin) {
          // User is logged in but not admin
          setState({
            loading: false,
            isAdmin: false,
            accessDenied: true,
            user
          });
          return;
        }

        // User is admin, allow access
        setState({
          loading: false,
          isAdmin: true,
          accessDenied: false,
          user
        });
      } catch (err) {
        console.error('Admin auth verification error:', err);
        if (mounted) {
          router.replace('/admin/login');
        }
      }
    };
    
    verifyAdminAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  return state;
}