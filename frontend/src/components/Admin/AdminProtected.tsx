"use client";
import React from 'react';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import Link from 'next/link';

interface AdminProtectedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AdminProtected({ children, fallback }: AdminProtectedProps) {
  const { loading, isAdmin, accessDenied, user } = useAdminAuth();
  const router = useRouter();

  if (loading) {
    return fallback || (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center bg-white text-brand-gray">
        <Loader2 size={48} className="animate-spin text-brand-blue mb-4" />
        <p className="font-semibold text-lg text-brand-blue">Verifying Admin Access...</p>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-red-50 to-red-100 p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center border border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield size={40} className="text-red-600" />
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-2 font-medium">
            You don't have permission to access this admin area.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            This section is restricted to administrators only.
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertTriangle size={16} className="text-amber-600" />
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
              Unauthorized Access Attempt
            </span>
          </div>
          
          {user && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs text-blue-600 font-medium">
                Logged in as: <span className="font-bold">{user.email}</span>
              </p>
              <p className="text-xs text-blue-500 mt-1">
                Role: <span className="font-bold capitalize">{(user as any)?.role || 'User'}</span>
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <Link 
              href="/" 
              className="block w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-brand-blue/20"
            >
              Return to Homepage
            </Link>
            <button 
              onClick={() => {
                authClient.signOut();
                router.push('/admin/login');
              }}
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all text-sm"
            >
              Sign Out & Login as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  // Fallback - should not reach here
  return null;
}