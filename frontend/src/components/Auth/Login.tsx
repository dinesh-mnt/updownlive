"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogIn,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data: sessionData } = await authClient.getSession();
        if (sessionData?.user) {
          const isAdmin = (sessionData.user as any)?.role === "admin";
          if (isAdmin) {
            router.push("/admin/dashboard");
          } else {
            router.push("/");
          }
          return;
        }
      } catch (err) {
        // No session or error, continue to login page
      } finally {
        setCheckingSession(false);
      }
    };

    checkExistingSession();
  }, [router]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin + "/",
      });
      // Note: The redirect happens automatically after successful Google auth
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setError(err?.message || "Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login...'); // Debug log
      
      const { data, error: authError } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      console.log('Login response:', { data, authError }); // Debug log

      if (authError) {
        throw new Error(authError.message || "Login failed");
      }

      if (!data?.user) {
        throw new Error("No user data returned");
      }

      console.log('User logged in:', data.user); // Debug log

      // Check role immediately from login response
      const isAdmin = (data.user as any)?.role === "admin";
      console.log('User role from login:', isAdmin); // Debug log

      if (!isAdmin) {
        setError("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }

      // Wait for cookies to be set properly
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Force a full page reload to ensure cookies are available
      // This is more reliable in production than router.push
      window.location.href = "/admin/dashboard";
      
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials.",
      );
      setLoading(false);
    }
  };

  // Show loading while checking existing session
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-outfit relative overflow-hidden">
        {/* Full Screen Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/assets/images/img01.jpg)" }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/40 to-black/60"></div>
        
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
      {/* Full Screen Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/assets/images/img01.jpg)" }}
      ></div>
      
      {/* Gradient Overlay for better readability */}
      <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/40 to-black/60"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-brand-blue/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-brand-red/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Login Card */}
      <div className="w-full max-w-6xl relative z-10">
        <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Side - Company Details */}
            <div className="bg-brand-black  p-12 flex flex-col justify-center text-white relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl shadow-lg mb-8 transform hover:scale-105 transition-transform duration-300">
                  <LogIn size={32} className="text-white" />
                </div>
                
                <h1 className="text-4xl font-bold mb-4">
                  Welcome to<br />UpDownLive
                </h1>
                
                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                  Your trusted platform for real-time market insights, trading signals, and financial analysis.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Real-Time Market Data</h3>
                      <p className="text-white/80 text-sm">Access live forex, crypto, and commodity prices</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Advanced Analytics</h3>
                      <p className="text-white/80 text-sm">Professional charts and technical indicators</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Expert Insights</h3>
                      <p className="text-white/80 text-sm">Stay informed with market news and analysis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="p-12">
              {/* Header Section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-brand-black mb-2">
                  Welcome Back
                </h2>
                <p className="text-brand-gray text-sm">
                  Sign in to access your account
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle size={20} className="shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-brand-black mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-gray group-focus-within:text-brand-blue transition-colors">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/80 border border-gray-200 rounded-2xl text-brand-black placeholder-brand-gray focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 outline-none transition-all duration-300 font-medium backdrop-blur-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-brand-black"
                    >
                      Password
                    </label>
                    <Link
                      href="#"
                      className="text-sm font-medium text-brand-blue hover:text-brand-blue/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-gray group-focus-within:text-brand-blue transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-white/80 border border-gray-200 rounded-2xl text-brand-black placeholder-brand-gray focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 outline-none transition-all duration-300 font-medium backdrop-blur-sm"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-gray hover:text-brand-blue transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-brand-blue to-brand-blue/90 hover:from-brand-blue/90 hover:to-brand-blue text-white font-semibold py-4 rounded-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-brand-blue/30 hover:shadow-brand-blue/50 hover:-translate-y-1 transform"
                  disabled={loading || googleLoading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Sign In</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-brand-gray font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading || googleLoading}
                  className="w-full bg-white/90 hover:bg-white text-brand-black font-semibold py-4 rounded-2xl border border-gray-200 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-1 transform backdrop-blur-sm"
                >
                  {googleLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="animate-spin" size={20} />
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
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
                      <span>Continue with Google</span>
                    </div>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-sm text-brand-gray">
                  Don't have an account?{" "}
                  <Link
                    href="/admin/register"
                    className="font-semibold text-brand-blue hover:text-brand-blue/80 transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
