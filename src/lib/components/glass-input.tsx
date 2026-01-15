"use client"

import type React from "react"

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  variant?: "default" | "sm"
}

export function GlassInput({ label, variant = "default", className = "", ...props }: GlassInputProps) {
  const baseStyles =
    "backdrop-blur-lg bg-white/10 border border-white/20 text-white placeholder-white/70 rounded-lg transition-all duration-300 focus:outline-none focus:border-white/40 focus:bg-white/15 focus:ring-2 focus:ring-blue-400/30 [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]"

  const sizeStyles = {
    default: "px-4 py-2.5 text-base",
    sm: "px-3 py-1.5 text-sm",
  }

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] mb-2">{label}</label>}
      <input className={`${baseStyles} ${sizeStyles[variant]} w-full ${className}`} {...props} />
    </div>
  )
}
