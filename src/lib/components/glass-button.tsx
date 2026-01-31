"use client"

import type React from "react"

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
  blur?: number
  refraction?: number
  depth?: number
}

export function GlassButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  blur = 20,
  refraction = 0.12,
  depth = 3,
  ...props
}: GlassButtonProps) {
  // Clamp values to valid ranges
  const clampedBlur = Math.max(0, Math.min(100, blur))
  const clampedRefraction = Math.max(0, Math.min(1, refraction))
  const clampedDepth = Math.max(0, Math.min(10, depth))

  const baseStyles = "bg-gradient-to-br font-medium transition-all duration-300 ease-out rounded-2xl active:scale-[0.98] border"

  const variantStyles = {
    primary: "from-blue-500/30 via-blue-500/20 to-blue-500/10 border-blue-400/40 text-white hover:from-blue-500/40 hover:via-blue-500/30 hover:to-blue-500/15 hover:border-blue-400/60",
    secondary: "from-white/20 via-white/10 to-white/5 border-white/30 text-white hover:from-white/30 hover:via-white/20 hover:to-white/10 hover:border-white/40",
    accent: "from-yellow-400/30 via-yellow-400/20 to-yellow-400/10 border-yellow-300/40 text-white hover:from-yellow-400/40 hover:via-yellow-400/30 hover:to-yellow-400/15 hover:border-yellow-300/60",
    ghost: "from-white/15 via-white/8 to-white/3 border-white/25 text-white hover:from-white/25 hover:via-white/15 hover:to-white/8 hover:border-white/35",
  }

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      style={{
        backdropFilter: `blur(${clampedBlur}px)`,
        boxShadow: `0 ${Math.ceil(clampedDepth * 2)}px ${Math.ceil(clampedDepth * 4)}px rgba(0, 0, 0, ${0.1 + clampedDepth * 0.05})`
      }}
      {...props}
    >
      {children}
    </button>
  )
}
