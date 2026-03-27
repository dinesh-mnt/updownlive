"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, AlertCircle, Eye, EyeOff, Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useAuth, invalidateSession } from "@/hooks/use-auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();
  const { user, isPending } = useAuth();

  useEffect(() => {
    if (isPending) return;
    if (user) {
      router.push(user.role === "admin" ? "/admin/dashboard" : "/");
    } else {
      setCheckingSession(false);
    }
  }, [user, isPending, router]);

  const handleGoogleSignIn = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!name.trim()) { setError("Name is required"); setLoading(false); return; }
    if (!email.trim()) { setError("Email is required"); setLoading(false); return; }
    if (!password.trim()) { setError("Password is required"); setLoading(false); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); setLoading(false); return; }
    try {
      const { data } = await axiosInstance.post("/auth/register", { name: name.trim(), email: email.trim(), password });
      invalidateSession();
      window.location.href = data.role === "admin" ? "/admin/dashboard" : "/";
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  if (isPending || checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-outfit relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(/assets/images/img03.jpg)" }} />
        <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/40 to-black/60" />
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl mb-6">
            <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Checking authentication...</h3>
          <p className="text-white/80">Please wait while we verify your session</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-outfit relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(/assets/images/img03.jpg)" }} />
      <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/40 to-black/60" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-brand-blue/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-brand-red/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="w-full max-w-6xl relative z-10">
        <div className="bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-brand-black dark:text-white mb-2">Create Account</h2>
                <p className="text-brand-gray dark:text-gray-400 text-sm italic">Sign up to get started with UpDownLive</p>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-3">
                  <AlertCircle size={20} className="shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-brand-black dark:text-white mb-2">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-gray group-focus-within:text-brand-blue transition-colors"><User size={20} /></div>
                    <input type="text" id="name" required value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-zinc-800/80 border border-gray-200 dark:border-white/10 rounded-2xl text-brand-black dark:text-white placeholder-brand-gray focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 outline-none transition-all font-medium"
                      placeholder="Enter your full name" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-brand-black dark:text-white mb-2">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-gray group-focus-within:text-brand-blue transition-colors"><Mail size={20} /></div>
                    <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-zinc-800/80 border border-gray-200 dark:border-white/10 rounded-2xl text-brand-black dark:text-white placeholder-brand-gray focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 outline-none transition-all font-medium"
                      placeholder="Enter your email" />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-brand-black dark:text-white mb-2">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-gray group-focus-within:text-brand-blue transition-colors"><Lock size={20} /></div>
                    <input type={showPassword ? "text" : "password"} id="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-white/80 dark:bg-zinc-800/80 border border-gray-200 dark:border-white/10 rounded-2xl text-brand-black dark:text-white placeholder-brand-gray focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 outline-none transition-all font-medium"
                      placeholder="Create a strong password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-gray hover:text-brand-blue transition-colors">
                      {showPassword ? <span>Hide</span> : <span>Show</span>}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-linear-to-r from-brand-blue to-brand-blue/90 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-70 shadow-lg shadow-brand-blue/30 hover:-translate-y-1 transform">
                  {loading ? <div className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={20} /><span>Creating Account...</span></div>
                    : <div className="flex items-center justify-center gap-2"><span>Sign Up</span><ArrowRight size={18} /></div>}
                </button>
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-white/10" /></div>
                  <div className="relative flex justify-center"><span className="bg-white dark:bg-zinc-900 px-4 text-sm text-brand-gray font-medium">Or continue with</span></div>
                </div>
                <button type="button" onClick={handleGoogleSignIn} disabled={loading} className="w-full bg-white/90 dark:bg-zinc-800 hover:bg-white dark:hover:bg-zinc-700 text-brand-black dark:text-white font-semibold py-4 rounded-2xl border border-gray-200 dark:border-white/10 transition-all disabled:opacity-70 shadow-lg hover:-translate-y-1 transform">
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
                    </svg>
                    <span>Continue with Google</span>
                  </div>
                </button>
              </form>
              <div className="mt-8 text-center">
                <p className="text-sm text-brand-gray dark:text-gray-400">
                  Already have an account?{" "}
                  <Link href="/admin/login" className="font-semibold text-brand-blue hover:text-brand-blue/80 transition-colors">Sign In</Link>
                </p>
              </div>
            </div>
            <div className="bg-brand-black dark:bg-black p-12 flex flex-col justify-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl shadow-lg mb-8">
                  <UserPlus size={32} className="text-white" />
                </div>
                <h1 className="text-4xl font-bold mb-4">Join UpDownLive<br />Today</h1>
                <p className="text-white/90 text-lg mb-8 leading-relaxed">Start your journey with the most comprehensive trading platform for market analysis and insights.</p>
                <div className="space-y-4">
                  {["Free Account Setup", "Personalized Dashboard", "24/7 Market Access"].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <span className="font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
