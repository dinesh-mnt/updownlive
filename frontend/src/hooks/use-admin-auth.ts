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
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const { data: sessionData, error } = await authClient.getSession();
        
        console.log('Admin auth check:', { 
          hasSession: !!sessionData, 
          hasUser: !!sessionData?.user,
          error: error?.message 
        }); // Debug log
        
        if (error) {
          console.error('Session error:', error);
        }
        
        if (!sessionData?.user) {
          // No session, redirect to login
          console.log('No session found, redirecting to login');
          router.replace('/admin/login'); // Use replace instead of push
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
        router.replace('/admin/login');
      }
    };
    
    verifyAdminAuth();
  }, [router]);

  return state;
}