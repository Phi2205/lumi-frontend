"use client"

import type React from "react"

interface GlassBadgeProps {
  children: React.ReactNode
  variant?: "blue" | "cyan" | "yellow" | "purple"
  className?: string
}

export function GlassBadge({ children, variant = "blue", className = "" }: GlassBadgeProps) {
  const variantStyles = {
    blue: "bg-blue-500/30 border-blue-400/40 text-blue-100",
    cyan: "bg-cyan-500/30 border-cyan-400/40 text-cyan-100",
    yellow: "bg-yellow-400/30 border-yellow-300/40 text-yellow-100",
    purple: "bg-purple-500/30 border-purple-400/40 text-purple-100",
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-lg border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
