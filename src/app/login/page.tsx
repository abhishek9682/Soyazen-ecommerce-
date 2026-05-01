"use client";
import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Mail, Lock, ArrowRight, Leaf, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import API from "@/lib/api";
import Logo from "@/components/layout/Logo";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await API.post("/users/login", { email, password });
      setUser(data);
      const redirect = searchParams.get("redirect");
      router.push(redirect ? `/${redirect}` : data.isAdmin ? "/admin" : "/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="flex flex-col items-center group">
            <Logo className="h-32 w-auto mb-6 transition-transform duration-500 group-hover:scale-110" />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
              create a new account
            </Link>
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-10 px-6 shadow-2xl shadow-green-100 sm:rounded-3xl sm:px-12 border border-green-50"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-2xl text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-11 pr-4 py-3 border border-gray-100 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-50"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-11 pr-4 py-3 border border-gray-100 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="#" className="font-medium text-green-600 hover:text-green-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center space-x-2 py-4 px-4 border border-transparent rounded-2xl shadow-sm text-lg font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-green-50 rounded-2xl">
            <p className="text-xs font-bold text-green-700 mb-2 uppercase tracking-widest">Demo Credentials</p>
            <div className="space-y-1 text-xs text-green-600">
              <p><span className="font-semibold">Admin:</span> admin@soyazen.com / admin123</p>
              <p><span className="font-semibold">Customer:</span> priya@example.com / password123</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Leaf size={16} className="text-green-600" />
              <span>100% Secure Plant-Based Shopping</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
