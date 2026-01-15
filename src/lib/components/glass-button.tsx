"use client"

import type React from "react"

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export function GlassButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: GlassButtonProps) {
  const baseStyles = "backdrop-blur-lg border font-medium transition-all duration-300 rounded-xl"

  const variantStyles = {
    primary: "bg-blue-500/80 border-blue-400/30 text-white hover:bg-blue-600/90 hover:shadow-lg",
    secondary: "bg-white/12 border-white/20 text-white hover:bg-white/18 hover:shadow-lg",
    accent: "bg-yellow-400/60 border-yellow-300/30 text-slate-900 hover:bg-yellow-500/70",
    ghost: "bg-transparent border-white/10 text-white hover:bg-white/8",
  }

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
