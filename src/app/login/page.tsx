"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, CheckSquare, Square, ShieldCheck, AlertCircle, CheckCircle2, X } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/hooks/useDarkMode";
import { forgotPassword, resetPassword } from "@/services/auth.service";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

export default function LoginPage() {
  const { login, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, handleDarkModeToggle } = useDarkMode();
  const { t } = useTranslation();

  // Forgot Password state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'otp'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    try {
      await forgotPassword({ email: forgotEmail });
      setForgotStep('otp');
    } catch (error: any) {
      setForgotError(error?.response?.data?.message || error?.message || 'Failed to send OTP');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setForgotError('New passwords do not match');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    try {
      await resetPassword({ email: forgotEmail, otp, newPassword });
      setForgotSuccess('Your password has been successfully reset. Please log in with your new password.');
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotStep('email');
        setForgotSuccess('');
        setForgotEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmNewPassword('');
      }, 3000);
    } catch (error: any) {
      setForgotError(error?.response?.data?.message || error?.message || 'Failed to reset password');
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    if (!forgotLoading) {
      setIsForgotModalOpen(false);
      setForgotStep('email');
      setForgotError('');
      setForgotSuccess('');
    }
  };

  // Set full height on mount and window resize
  useEffect(() => {
    const setFullHeight = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${window.innerHeight}px`;
      }
    };

    setFullHeight();
    window.addEventListener('resize', setFullHeight);

    return () => {
      window.removeEventListener('resize', setFullHeight);
    };
  }, []);

  // Redirect to home if user is already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    <div
      ref={containerRef}
      className="relative min-h-screen"
    >
      <section className="py-28">
        <div className="container mx-auto px-4">
          {/* Lumi Logo */}
          <div className="flex justify-center mb-12">
            <span
              className="text-7xl md:text-8xl font-normal text-white block"
              style={{
                fontFamily: 'var(--font-dancing-script), "Brush Script MT", cursive',
                letterSpacing: '4px',
                fontWeight: 500,
                textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                transform: 'rotate(-1.5deg)',
                display: 'inline-block'
              }}
            >
              Lumi
            </span>
          </div>

          {/* Form Container */}
          <div className="flex justify-center">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <div className="relative text-white/90">
                <h3 className="mb-6 text-center text-white font-light">Have an account?</h3>

                <form onSubmit={handleSubmit} className="signin-form">
                  {/* Email Field */}
                  <div className="relative mb-4">
                    <input
                      type="email"
                      className="w-full h-[50px] bg-white/15 border border-transparent rounded-full pl-5 pr-5 text-white placeholder-white/80 transition-all duration-300 focus:outline-none focus:bg-white/10 focus:border-white/50 hover:bg-white/10 hover:border-white/50"
                      placeholder="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading || authLoading}
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="relative mb-4">
                    <input
                      id="password-field"
                      type={showPassword ? "text" : "password"}
                      className="w-full h-[50px] bg-white/15 border border-transparent rounded-full pl-5 pr-12 text-white placeholder-white/80 transition-all duration-300 focus:outline-none focus:bg-white/10 focus:border-white/50 hover:bg-white/10 hover:border-white/50"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading || authLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-[15px] -translate-y-1/2 text-white/90 cursor-pointer hover:text-white transition"
                      disabled={isLoading || authLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-500/30 border border-red-400/50 rounded-full text-white text-sm">
                      {errorMessage}
                    </div>
                  )}

                  {/* Sign In Button */}
                  <div className="mb-4">
                    <button
                      type="submit"
                      disabled={isLoading || authLoading}
                      className="w-full h-[50px] rounded-full text-sm uppercase font-normal cursor-pointer transition-all duration-300 focus:outline-none shadow-none disabled:opacity-50 disabled:cursor-not-allowed border"
                      style={{
                        backgroundColor: 'var(--brand-primary)',
                        borderColor: 'var(--brand-primary)',
                        color: 'black'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--brand-primary)';
                        e.currentTarget.style.borderColor = 'var(--brand-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
                        e.currentTarget.style.color = 'black';
                        e.currentTarget.style.borderColor = 'var(--brand-primary)';
                      }}
                    >
                      {isLoading || authLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex mb-4">
                    <div className="w-full text-right">
                      <button
                        type="button"
                        onClick={() => setIsForgotModalOpen(true)}
                        className="text-white transition-all duration-300 hover:text-white/80 bg-transparent border-none cursor-pointer p-0"
                        style={{ '--hover-color': 'var(--brand-primary)' } as React.CSSProperties}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                        disabled={isLoading || authLoading}
                      >
                        Forgot Password
                      </button>
                    </div>
                  </div>
                </form>

                {/* Separator */}
                {/* <p className="w-full text-center my-4">&mdash; Google &mdash;</p> */}

                {/* Google Login Button */}
                {/* <div className="flex justify-center">
                  <button
                    type="button"
                    className="w-full h-[50px] rounded-full text-sm uppercase font-normal cursor-pointer transition-all duration-300 focus:outline-none shadow-none border flex items-center justify-center gap-3"
                    style={{
                      backgroundColor: 'var(--brand-primary)',
                      borderColor: 'var(--brand-primary)',
                      color: 'black'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--brand-primary)';
                      e.currentTarget.style.borderColor = 'var(--brand-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
                      e.currentTarget.style.color = 'black';
                      e.currentTarget.style.borderColor = 'var(--brand-primary)';
                    }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="font-medium">Google</span>
                  </button>
                </div> */}

                {/* Sign Up Link */}
                <p className="mt-8 text-center text-sm text-white/90">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium transition-all duration-300 hover:opacity-80"
                    style={{ color: 'var(--brand-primary)' }}
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-neutral-900/90 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-white text-xl font-semibold">
                {forgotStep === 'email' ? 'Forgot Password' : 'Reset Password'}
              </h2>
              <button
                className="text-white/60 hover:text-white transition-all p-1 cursor-pointer"
                onClick={closeForgotModal}
                disabled={forgotLoading}
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {forgotSuccess ? (
                <div className="flex flex-col items-center justify-center py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <p className="text-white text-center font-medium">{forgotSuccess}</p>
                </div>
              ) : (
                <form onSubmit={forgotStep === 'email' ? handleForgotPassword : handleResetPassword} className="space-y-6">
                  {forgotStep === 'email' ? (
                    <>
                      <p className="text-white/60 text-sm">
                        Enter your email address and we'll send you an OTP code to reset your password.
                      </p>
                      <div className="relative">
                        <input
                          type="email"
                          className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all font-medium"
                          placeholder="your@email.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          required
                          disabled={forgotLoading}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-white/60 text-sm">
                        Please enter the OTP sent to <strong>{forgotEmail}</strong> and your new password.
                      </p>
                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all font-medium"
                            placeholder="OTP Code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            disabled={forgotLoading}
                          />
                        </div>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 pr-10 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all font-medium"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={forgotLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                          >
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            className="w-full h-12 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all font-medium"
                            placeholder="Confirm New Password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                            disabled={forgotLoading}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {forgotError && (
                    <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-sm animate-in shake duration-300">
                      <AlertCircle className="w-4 h-4" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full h-12 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
                    style={{
                      backgroundColor: 'var(--brand-primary)',
                      color: 'black'
                    }}
                  >
                    {forgotLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      forgotStep === 'email' ? 'Send OTP' : 'Reset Password'
                    )}
                  </button>

                  {forgotStep === 'otp' && (
                    <button
                      type="button"
                      onClick={() => setForgotStep('email')}
                      className="w-full text-center text-white/60 hover:text-white text-sm transition-colors mt-2"
                      disabled={forgotLoading}
                    >
                      Use a different email
                    </button>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
