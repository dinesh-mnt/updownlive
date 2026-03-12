"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, AlertCircle, Eye, EyeOff, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: authError } = await authClient.signUp.email({
        email,
        password,
        name
      });

      if (authError) {
        throw new Error(authError.message || 'Registration failed');
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a] font-outfit relative overflow-hidden">
      {/* Premium Animated Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-red/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(6,66,240,0.05)_0%,transparent_70%)]"></div>
      
      <div className="w-full max-w-[440px] relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-brand-blue to-brand-blue/60 shadow-[0_0_50px_rgba(6,66,240,0.3)] mb-6 transform rotate-3 hover:rotate-0 transition-all duration-500 cursor-default group">
            <UserPlus size={40} className="text-white group-hover:scale-110 transition-transform" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            Sign Up
          </h1>
          <p className="text-gray-400 font-medium tracking-wide">
            Create your UpDownLive account
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white/3 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[20px_20px_60px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-white/20">
          {error && (
            <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red p-4 rounded-2xl mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm font-semibold tracking-wide lowercase first-letter:uppercase">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2 group">
              <label 
                htmlFor="name" 
                className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] pl-1 group-focus-within:text-brand-blue transition-colors"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-blue transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  id="name" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:bg-white/8 focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all duration-300 font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label 
                htmlFor="email" 
                className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] pl-1 group-focus-within:text-brand-blue transition-colors"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-blue transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  id="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:bg-white/8 focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all duration-300 font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label 
                htmlFor="password" 
                className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] pl-1 group-focus-within:text-brand-blue transition-colors"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-blue transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:bg-white/8 focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all duration-300 font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-brand-blue transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="group relative w-full flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-4 rounded-2xl shadow-[0_10px_30px_-10px_rgba(6,66,240,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(6,66,240,0.6)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden mt-4"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span className="tracking-wide">Creating Account...</span>
                </>
              ) : (
                <>
                  <span className="tracking-wide">Sign Up</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest leading-none">
                <span className="bg-[#121212] px-4 text-gray-500">Or continue with</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={async () => {
                await authClient.signIn.social({
                  provider: "google",
                  callbackURL: window.location.origin + "/",
                });
              }}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                />
              </svg>
              <span className="tracking-wide">Google</span>
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <p className="text-gray-500 text-sm font-medium tracking-wide">
              Already have an account? 
              <Link href="/admin/login" className="text-brand-blue hover:text-white font-bold transition-all px-3 py-1.5 hover:bg-brand-blue/10 rounded-xl ml-1">
                Sign In
              </Link>
            </p>
        </div>
      </div>
    </div>
  );
}
