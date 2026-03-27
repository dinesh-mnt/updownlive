"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

interface AdminAuthState {
  loading: boolean;
  isAdmin: boolean;
  accessDenied: boolean;
  user: any;
}

export function useAdminAuth(): AdminAuthState {
  const { user, isPending } = useAuth();
  const [state, setState] = useState<AdminAuthState>({
    loading: true,
    isAdmin: false,
    accessDenied: false,
    user: null,
  });
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace('/admin/login');
      return;
    }

    const isAdmin = user.role === 'admin';

    if (!isAdmin) {
      setState({ loading: false, isAdmin: false, accessDenied: true, user });
      return;
    }

    setState({ loading: false, isAdmin: true, accessDenied: false, user });
  }, [user, isPending, router]);

  return state;
}
