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
      const { data, error: authError } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (authError) {
        throw new Error(authError.message || "Login failed");
      }

      // Redirect based on role
      if ((data?.user as any)?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking existing session
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-black font-outfit">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-brand-blue animate-spin mx-auto mb-4" />
          <p className="text-white font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-outfit relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/assets/images/img01.jpg)" }}
      ></div>

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Login Card */}
      <div className="w-full max-w-[560px] relative z-10">
        <div className="bg-white backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[20px_20px_60px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-white/20">
          {error && (
            <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red p-4 rounded-2xl mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm font-semibold tracking-wide lowercase first-letter:uppercase">
                {error}
              </p>
            </div>
          )}

          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-brand-black tracking-tight mb-2">
              Sign In
            </h1>
            <p className="text-gray-400 font-medium tracking-wide">
              Access your UpDownLive account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 group md:col-span-2">
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
                    className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:bg-white/8 focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all duration-300 font-medium"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2 group md:col-span-2">
                <div className="flex justify-between items-center px-1">
                  <label
                    htmlFor="password"
                    className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] group-focus-within:text-brand-blue transition-colors"
                  >
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-[10px] font-bold text-brand-blue hover:text-white transition-colors tracking-widest uppercase"
                  >
                    Forgot?
                  </Link>
                </div>
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
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:bg-white/8 focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all duration-300 font-medium"
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
            </div>

            <div className="space-y-6 mt-8">
              <button
                type="submit"
                className="group relative w-full flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-5 rounded-2xl shadow-[0_10px_30px_-10px_rgba(6,66,240,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(6,66,240,0.6)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden text-lg"
                disabled={loading || googleLoading}
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span className="tracking-wide">Signing in...</span>
                  </>
                ) : (
                  <>
                    <span className="tracking-wide">Sign In</span>
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest leading-none">
                  <span className="bg-transparent px-4 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-medium py-5 rounded-2xl transition-all duration-300 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-lg"
              >
                {googleLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
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
                )}
                <span className="tracking-wide">
                  {googleLoading ? "Signing in..." : "Continue with Google"}
                </span>
              </button>
            </div>
          </form>

          {/* Footer info */}
          <div className="mt-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <p className="text-gray-500 text-sm font-medium tracking-wide">
              Don't have an account?
              <Link
                href="/admin/register"
                className="text-brand-blue hover:text-white font-bold transition-all px-3 py-1.5 hover:bg-brand-blue/10 rounded-xl ml-1"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
