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
    const verifyAdminAuth = async () => {
      try {
        // Add a small delay to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { data: sessionData, error } = await authClient.getSession();
        
        console.log('Admin auth check:', { sessionData, error }); // Debug log
        
        if (error || !sessionData) {
          // No session, redirect to login
          console.log('No session found, redirecting to login');
          router.push('/admin/login');
          return;
        }

        const user = sessionData.user;
        const isAdmin = (user as any)?.role === 'admin';

        console.log('User role check:', { user, isAdmin }); // Debug log

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
        router.push('/admin/login');
      }
    };
    
    verifyAdminAuth();
  }, [router]);

  return state;
}