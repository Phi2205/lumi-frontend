"use client"

import type React from "react"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "sm" | "lg"
  interactive?: boolean
}

export function GlassCard({ children, className = "", variant = "default", interactive = false }: GlassCardProps) {
  const baseStyles =
    "backdrop-blur-3xl bg-white/12 border border-white/20 rounded-2xl shadow-xl transition-all duration-300"

  const variantStyles = {
    default: "p-6",
    sm: "p-4",
    lg: "p-8",
  }

  const interactiveStyles = interactive ? "hover:bg-white/15 hover:shadow-2xl hover:border-white/30" : ""

  return <div className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyles} ${className}`}>{children}</div>
}
