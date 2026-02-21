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
  const baseStyles = "cursor-pointer backdrop-blur-[20px] bg-gradient-to-br from-white/8 via-white/4 to-white/2 border border-white/15 font-medium transition-all duration-300 ease-out rounded-2xl active:scale-[0.98] hover:border-white/25"

  const variantStyles = {
    primary: "bg-gradient-to-br from-brand-primary/20 via-brand-primary/12 to-brand-primary/8 border-brand-primary/25 text-white hover:from-brand-primary/25 hover:via-brand-primary/15 hover:to-brand-primary/10 hover:border-brand-primary/35",
    secondary: "text-white",
    accent: "bg-gradient-to-br from-yellow-400/20 via-yellow-400/12 to-yellow-400/8 border-yellow-300/25 text-white hover:from-yellow-400/25 hover:via-yellow-400/15 hover:to-yellow-400/10 hover:border-yellow-300/35",
    ghost: "bg-gradient-to-br from-white/6 via-white/3 to-white/1 border-white/12 text-white hover:from-white/8 hover:via-white/4 hover:to-white/2 hover:border-white/20",
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
