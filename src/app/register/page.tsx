"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, CheckSquare, Square } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { BackgroundImage } from "@/components/BackgroundImage"

export default function SignupPage() {
  const { register, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [errorMessage, setErrorMessage] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  // Set full height on mount and window resize
  useEffect(() => {
    const setFullHeight = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${window.innerHeight}px`
      }
    }

    setFullHeight()
    window.addEventListener('resize', setFullHeight)

    return () => {
      window.removeEventListener('resize', setFullHeight)
    }
  }, [])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!username) {
      newErrors.username = "Username is required"
    }

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      await register(email, password, username)
      // Redirect to OTP verification page
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`)
    } catch (error: any) {
      console.error("Register error:", error)
      setErrorMessage(
        error?.response?.data?.message || 
        error?.message || 
        "Registration failed. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      ref={containerRef}
      className="relative"
    >
      <BackgroundImage />
      
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
                <h3 className="mb-6 text-center text-white font-light">Join Lumi</h3>
                
                <form onSubmit={handleSubmit} className="signin-form">
                  {/* Username Field */}
                  <div className="relative mb-4">
                    <input
                      type="text"
                      className="w-full h-[50px] bg-white/15 border border-transparent rounded-full pl-5 pr-5 text-white placeholder-white/80 transition-all duration-300 focus:outline-none focus:bg-white/10 focus:border-white/50 hover:bg-white/10 hover:border-white/50"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading || authLoading}
                      required
                    />
                    {errors.username && <p className="mt-1 text-sm text-red-300">{errors.username}</p>}
                  </div>

                  {/* Email Field */}
                  <div className="relative mb-4">
                    <input
                      type="email"
                      className="w-full h-[50px] bg-white/15 border border-transparent rounded-full pl-5 pr-5 text-white placeholder-white/80 transition-all duration-300 focus:outline-none focus:bg-white/10 focus:border-white/50 hover:bg-white/10 hover:border-white/50"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading || authLoading}
                      required
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-300">{errors.email}</p>}
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
                    {errors.password && <p className="mt-1 text-sm text-red-300">{errors.password}</p>}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="relative mb-4">
                    <input
                      id="confirm-password-field"
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full h-[50px] bg-white/15 border border-transparent rounded-full pl-5 pr-12 text-white placeholder-white/80 transition-all duration-300 focus:outline-none focus:bg-white/10 focus:border-white/50 hover:bg-white/10 hover:border-white/50"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading || authLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute top-1/2 right-[15px] -translate-y-1/2 text-white/90 cursor-pointer hover:text-white transition"
                      disabled={isLoading || authLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-300">{errors.confirmPassword}</p>}
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-500/30 border border-red-400/50 rounded-full text-white text-sm">
                      {errorMessage}
                    </div>
                  )}

                  {/* Create Account Button */}
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
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'var(--brand-primary)'
                        e.currentTarget.style.borderColor = 'var(--brand-primary)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--brand-primary)'
                        e.currentTarget.style.color = 'black'
                        e.currentTarget.style.borderColor = 'var(--brand-primary)'
                      }}
                    >
                      {isLoading || authLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="mb-4">
                    <label className="block relative pl-8 cursor-pointer text-base font-medium select-none" style={{ color: 'var(--brand-primary)' }}>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="absolute opacity-0 cursor-pointer h-0 w-0"
                        disabled={isLoading || authLoading}
                        required
                      />
                      <span className="text-white/90">
                        I agree to the{" "}
                        <Link href="/terms" className="underline hover:opacity-80" style={{ color: 'var(--brand-primary)' }}>
                          Terms of Service
                        </Link>
                      </span>
                      <span className="absolute top-0 left-0">
                        {rememberMe ? (
                          <CheckSquare className="w-5 h-5 -mt-1 transition-all duration-300" style={{ color: 'var(--brand-primary)' }} />
                        ) : (
                          <Square className="w-5 h-5 -mt-1 transition-all duration-300" style={{ color: 'var(--brand-primary)' }} />
                        )}
                      </span>
                    </label>
                  </div>
                </form>

                {/* Separator */}
                <p className="w-full text-center my-4">&mdash; Google &mdash;</p>

                {/* Google Login Button */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="w-full h-[50px] rounded-full text-sm uppercase font-normal cursor-pointer transition-all duration-300 focus:outline-none shadow-none border flex items-center justify-center gap-3"
                    style={{
                      backgroundColor: 'var(--brand-primary)',
                      borderColor: 'var(--brand-primary)',
                      color: 'black'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--brand-primary)'
                      e.currentTarget.style.borderColor = 'var(--brand-primary)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--brand-primary)'
                      e.currentTarget.style.color = 'black'
                      e.currentTarget.style.borderColor = 'var(--brand-primary)'
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
                </div>

                {/* Sign In Link */}
                <p className="mt-8 text-center text-sm text-white/90">
                  Already have an account?{" "}
                  <Link 
                    href="/login" 
                    className="font-medium transition-all duration-300 hover:opacity-80"
                    style={{ color: 'var(--brand-primary)' }}
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
