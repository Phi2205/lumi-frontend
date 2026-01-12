"use client";

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await login(email, password);
      // AuthContext will handle redirect to home page
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(
        error?.response?.data?.message || 
        error?.message || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand & Features */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-300 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-green-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-20">

            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 relative">
                <Image
                  src="/lumi-logo-v2.png"
                  alt="Lumi Logo"
                  width={96}
                  height={96}
                  className="object-contain"
                  priority
                />
              </div>
            <span className="text-3xl font-bold tracking-tight -ml-9 mt-2 italic">umi</span>
            </div>
          </div>

          {/* Chat Illustration */}
          <div className="mb-16">
            <div className="relative w-full h-96 flex items-center justify-center">
              {/* Person 1 - Left side */}
              <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
                {/* Avatar */}
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                {/* Chat bubble from person 1 */}
                <div className="bg-white rounded-2xl rounded-bl-none p-4 shadow-xl max-w-xs">
                  <p className="text-gray-800 text-sm font-medium">Chào bạn! 👋</p>
                  <p className="text-gray-600 text-xs mt-1">Bạn có rảnh cuối tuần không?</p>
                </div>
              </div>

              {/* Person 2 - Right side */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3s' }}>
                {/* Avatar */}
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                {/* Chat bubble from person 2 */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl rounded-br-none p-4 shadow-xl max-w-xs">
                  <p className="text-white text-sm font-medium">Có nhé! 😊</p>
                  <p className="text-blue-50 text-xs mt-1">Mình đi cafe nhé?</p>
                </div>
              </div>

              {/* Center - Connection visual */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {/* Animated message icons flowing between */}
                <div className="relative w-64">
                  {/* Message icon 1 */}
                  <div className="absolute left-0 top-0 animate-ping" style={{ animationDuration: '2s' }}>
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm">💬</span>
                    </div>
                  </div>
                  {/* Message icon 2 */}
                  <div className="absolute right-0 top-0 animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }}>
                    <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm">❤️</span>
                    </div>
                  </div>
                  {/* Connecting line */}
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-gradient-to-r from-orange-400 via-yellow-300 to-cyan-400 opacity-50"></div>
                </div>
              </div>

              {/* Social post card - top center */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl w-64 animate-pulse" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full"></div>
                  <div>
                    <div className="w-20 h-2 bg-gray-300 rounded-full"></div>
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full mt-1"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-3/4 h-2 bg-gray-300 rounded-full"></div>
                </div>
                <div className="flex gap-4 mt-3 text-xs text-gray-500">
                  <span>❤️ 24</span>
                  <span>💬 8</span>
                  <span>🔗 3</span>
                </div>
              </div>

              {/* Status update - bottom left */}
              <div className="absolute bottom-20 left-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-3 shadow-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
                <p className="text-white text-xs font-medium">📍 Đang ở quán cafe gần nhà</p>
              </div>

              {/* Notification badge - top right */}
              <div className="absolute top-20 right-16 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-xl font-bold animate-bounce" style={{ animationDuration: '2s' }}>
                5
              </div>
            </div>
          </div>

          <div className="space-y-6 text-white text-center">
            <h1 className="text-6xl font-bold leading-tight">
              Chia sẻ.<br />
              Kết nối.<br />
              <span className="text-yellow-300">
                Gần bạn hơn.
              </span>
            </h1>
          </div>
        </div>

        <div className="relative z-10 text-white/90 text-base font-light flex items-center justify-center gap-2">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 border-2 border-white"></div>
          </div>
          <span>Tham gia cùng 50,000+ người dùng tại Việt Nam</span>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">L</span>
              </div>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              lumi
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="you@example.com"
                    disabled={isLoading || authLoading}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your password"
                    disabled={isLoading || authLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    disabled={isLoading || authLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" disabled={isLoading} />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or continue with</span>
                </div>
              </div>

              <button className="mt-4 w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Create one
              </a>
            </p>

            <p className="mt-6 text-center text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}