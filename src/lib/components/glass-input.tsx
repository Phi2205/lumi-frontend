"use client"

import type React from "react"

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  variant?: "default" | "sm"
  blur?: number
  refraction?: number
  depth?: number
}

export function GlassInput({ 
  label, 
  variant = "default", 
  className = "", 
  blur = 20,
  refraction = 0.12,
  depth = 3,
  ...props 
}: GlassInputProps) {
  // Clamp values to valid ranges
  const clampedBlur = Math.max(0, Math.min(100, blur))
  const clampedRefraction = Math.max(0, Math.min(1, refraction))
  const clampedDepth = Math.max(0, Math.min(10, depth))

  const baseStyles =
    "text-white placeholder-white/70 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/30 [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]"

  const sizeStyles = {
    default: "px-4 py-2.5 text-base",
    sm: "px-3 py-1.5 text-sm",
  }

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] mb-2">{label}</label>}
      <input 
        className={`${baseStyles} ${sizeStyles[variant]} w-full ${className}`}
        style={{
          backdropFilter: `blur(${clampedBlur}px)`,
          backgroundColor: `rgba(255, 255, 255, ${clampedRefraction})`,
          borderColor: `rgba(255, 255, 255, ${clampedRefraction + 0.08})`,
          border: `1px solid rgba(255, 255, 255, ${clampedRefraction + 0.08})`,
          boxShadow: `0 ${Math.ceil(clampedDepth / 2)}px ${Math.ceil(clampedDepth / 2)}px rgba(0, 0, 0, ${0.05 + clampedDepth * 0.02})`
        }}
        {...props} 
      />
    </div>
  )
}
