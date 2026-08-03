"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Loader2, Lock, AlertCircle, EyeOff, Eye } from "lucide-react";

interface LoginFormProps {
  onNavigateToForgot: () => void;
}

export const LoginForm = ({ onNavigateToForgot }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Authenticate with Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // 2. Set a session cookie for the Middleware to read
      // This allows the server to know you are logged in
      document.cookie = "session=true; path=/; max-age=3600; SameSite=Lax";

      // 3. Redirect to the dashboard and refresh the server state
      router.push("/");
      router.refresh();
    } catch (err: any) {
      // console.error("Login error:", err);
      // Friendly error messages for common Firebase issues
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-8">
        {/* <div className="bg-blue-50 p-4 rounded-full mb-4">
          <Lock className="text-blue-600" size={28} />
        </div> */}
        <img src="https://firebasestorage.googleapis.com/v0/b/knockerball-map.firebasestorage.app/o/kblocations%2Fkb-logo.webp?alt=media&token=40a9618b-23d0-42d0-8727-c90f11c78b3f" alt="Knockerball logo" width={120} />
        <h1 className="text-2xl font-bold text-gray-900">Knockerball Map</h1>
        <p className="text-gray-500 text-sm mt-1 text-center">
          Sign in to manage all knockerball locations.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 ml-1">
            Email Address
          </label>
          <input
            required
            type="email"
            autoComplete="email"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400"
            placeholder="quinn@knockerball.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 ml-1">
            Password
          </label>
          <div className="relative">
            <input
              required
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>


        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onNavigateToForgot}
            className="text-sm font-medium text-black hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:opacity-90 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Signing in...</span>
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Footer Info */}
      {/* <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
          Forgot Password?
        </p>
      </div> */}
    </div>
  );
};