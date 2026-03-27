"use client";
import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '@/lib/axios';

export interface AuthUser {
  id: string;
  _id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: AuthUser | null;
  isPending: boolean;
}

// Module-level cache
let cachedUser: AuthUser | null = null;
let hasFetched = false;
let fetchPromise: Promise<AuthUser | null> | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

async function fetchSession(): Promise<AuthUser | null> {
  if (fetchPromise) return fetchPromise;
  fetchPromise = axiosInstance
    .get('/auth/session')
    .then((res) => {
      cachedUser = res.data.user ?? null;
      return cachedUser;
    })
    .catch(() => {
      cachedUser = null;
      return null;
    })
    .finally(() => {
      hasFetched = true;
      fetchPromise = null;
      notify();
    });
  return fetchPromise;
}

export function invalidateSession() {
  cachedUser = null;
  hasFetched = false;
  notify();
}

export function useAuth(): AuthState & { refetch: () => void } {
  const [state, setState] = useState<AuthState>({
    user: cachedUser,
    isPending: !hasFetched,
  });

  const sync = useCallback(() => {
    setState({ user: cachedUser, isPending: !hasFetched });
  }, []);

  useEffect(() => {
    listeners.add(sync);

    if (!hasFetched && !fetchPromise) {
      fetchSession();
    } else if (hasFetched) {
      // Already fetched — sync immediately
      setState({ user: cachedUser, isPending: false });
    }

    return () => {
      listeners.delete(sync);
    };
  }, [sync]);

  const refetch = useCallback(() => {
    cachedUser = null;
    hasFetched = false;
    setState({ user: null, isPending: true });
    fetchSession();
  }, []);

  return { ...state, refetch };
}

export async function signOut() {
  await axiosInstance.post('/auth/logout').catch(() => {});
  cachedUser = null;
  hasFetched = false;
  notify();
}
