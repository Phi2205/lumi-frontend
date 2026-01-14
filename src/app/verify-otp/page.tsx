"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { verifyOtp, resendOtp } from "@/services/auth.service"

export default function VerifyOtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [countdown, setCountdown] = useState(0)
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

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      router.push("/register")
    }
  }, [email, router])

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setOtp(value)
    setErrorMessage("")
  }

  // Generate dynamic placeholder: "xxxxxx" -> "1xxxxx" -> "12xxxx" -> ...
  const getPlaceholder = () => {
    if (otp.length === 0) return "xxxxxx"
    return otp + "x".repeat(6 - otp.length)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otp || otp.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP")
      return
    }

    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const response = await verifyOtp({ email, otp })
      
      if (response.success) {
        setSuccessMessage("Email verified successfully! Redirecting to login...")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (error: any) {
      console.error("OTP verification error:", error)
      setErrorMessage(
        error?.response?.data?.message || 
        error?.message || 
        "Invalid OTP. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return

    setIsResending(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const response = await resendOtp({email})
      
      if (response.success) {
        setSuccessMessage("OTP has been resent to your email")
        setCountdown(60) // 60 seconds countdown
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error)
      setErrorMessage(
        error?.response?.data?.message || 
        error?.message || 
        "Failed to resend OTP. Please try again."
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div 
      ref={containerRef}
      className="bg-cover bg-no-repeat bg-center relative"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(/bg12.jpg)`
      }}
    >
      
      <section className="py-28">
        <div className="container mx-auto px-4">
          {/* Lumi Logo - Instagram Style */}
          <div className="flex justify-center mb-12">
            <div className="relative inline-block">
              {/* Instagram-style gradient background circle with glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 via-orange-500 to-yellow-400 rounded-full blur-2xl opacity-50 -z-10 scale-[2]"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 via-orange-500 to-yellow-400 rounded-full blur-lg opacity-70 -z-10 scale-150"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 via-orange-500 to-yellow-400 rounded-full -z-10"></div>
              
              {/* Lumi Logo Text - Handwritten Script Style */}
              <div className="relative px-10 py-5">
                <span 
                  className="text-7xl md:text-8xl font-normal text-white block"
                  style={{ 
                    fontFamily: 'var(--font-dancing-script), "Brush Script MT", cursive',
                    letterSpacing: '4px',
                    fontWeight: 500,
                    textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.2)',
                    transform: 'rotate(-1.5deg)',
                    display: 'inline-block',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
                  }}
                >
                  Lumi
                </span>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="flex justify-center">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <div className="relative text-white/90">
                <h3 className="mb-2 text-center text-white font-light">Verify Your Email</h3>
                <p className="mb-6 text-center text-white/80 text-sm">
                  We've sent a 6-digit code to<br />
                  <span className="font-medium" style={{ color: 'var(--brand-primary)' }}>{email}</span>
                </p>
                
                <form onSubmit={handleSubmit} className="verify-otp-form">
                  {/* OTP Input Field */}
                  <div className="relative mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full h-[50px] bg-white/15 border border-transparent rounded-full pl-5 pr-5 text-transparent transition-all duration-300 focus:outline-none focus:bg-white/10 focus:border-white/50 hover:bg-white/10 hover:border-white/50 text-center text-2xl font-semibold"
                        style={{ letterSpacing: '0.5em', caretColor: 'transparent' }}
                        value={otp}
                        onChange={handleOtpChange}
                        disabled={isLoading || isResending}
                        required
                        maxLength={6}
                        autoFocus
                      />
                      {/* Dynamic Placeholder Overlay */}
                      <div 
                        className="absolute inset-0 flex items-center justify-center pointer-events-none text-center text-2xl font-semibold text-white/80"
                        style={{ 
                          paddingLeft: '1.25rem', 
                          paddingRight: '1.25rem',
                          letterSpacing: '0.5em'
                        }}
                      >
                        {getPlaceholder()}
                      </div>
                    </div>
                    {errorMessage && <p className="mt-1 text-sm text-red-300 text-center">{errorMessage}</p>}
                    {successMessage && <p className="mt-1 text-sm text-green-300 text-center">{successMessage}</p>}
                  </div>

                  {/* Verify Button */}
                  <div className="mb-4">
                    <button 
                      type="submit" 
                      disabled={isLoading || isResending || otp.length !== 6}
                      className="w-full h-[50px] rounded-full text-sm uppercase font-normal cursor-pointer transition-all duration-300 focus:outline-none shadow-none disabled:opacity-50 disabled:cursor-not-allowed border"
                      style={{
                        backgroundColor: 'var(--brand-primary)',
                        borderColor: 'var(--brand-primary)',
                        color: 'black'
                      }}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.color = 'var(--brand-primary)'
                          e.currentTarget.style.borderColor = 'var(--brand-primary)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.backgroundColor = 'var(--brand-primary)'
                          e.currentTarget.style.color = 'black'
                          e.currentTarget.style.borderColor = 'var(--brand-primary)'
                        }
                      }}
                    >
                      {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </div>

                  {/* Resend OTP */}
                  <div className="mb-4 text-center">
                    <p className="text-white/80 text-sm mb-2">
                      Didn't receive the code?
                    </p>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResending || countdown > 0 || isLoading}
                      className="text-sm font-medium transition-all duration-300 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ color: 'var(--brand-primary)' }}
                    >
                      {countdown > 0 
                        ? `Resend OTP in ${countdown}s` 
                        : isResending 
                        ? 'Sending...' 
                        : 'Resend OTP'}
                    </button>
                  </div>
                </form>

                {/* Back to Register Link */}
                <p className="mt-8 text-center text-sm text-white/90">
                  Wrong email?{" "}
                  <Link 
                    href="/register" 
                    className="font-medium transition-all duration-300 hover:opacity-80"
                    style={{ color: 'var(--brand-primary)' }}
                  >
                    Go back
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
