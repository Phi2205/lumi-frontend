"use client"

import type React from "react"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "sm" | "lg"
  interactive?: boolean
  blur?: number
  refraction?: number
  depth?: number
}

export function GlassCard({ 
  children, 
  className = "", 
  variant = "default", 
  interactive = false,
  blur = 20,
  refraction = 0.12,
  depth = 3
}: GlassCardProps) {
  // Clamp values to valid ranges
  const clampedBlur = Math.max(0, Math.min(100, blur))
  const clampedRefraction = Math.max(0, Math.min(1, refraction))
  const clampedDepth = Math.max(0, Math.min(10, depth))

  // Calculate dynamic styles based on props
  const blurClass = `backdrop-blur-[${clampedBlur}px]`
  const bgOpacity = `bg-white/${Math.round(clampedRefraction * 100)}`
  const borderOpacity = `border-white/${Math.round((clampedRefraction + 0.08) * 100)}`
  const shadowIntensity = clampedDepth > 5 ? "shadow-2xl" : clampedDepth > 2 ? "shadow-xl" : "shadow-lg"
  
  const baseStyles = `${blurClass} ${bgOpacity} border ${borderOpacity} rounded-2xl ${shadowIntensity} transition-all duration-300`

  const variantStyles = {
    default: "p-6",
    sm: "p-4",
    lg: "p-8",
  }

  const interactiveStyles = interactive 
    ? `hover:${bgOpacity === "bg-white/12" ? "hover:bg-white/15" : "hover:bg-white/18"} hover:shadow-2xl hover:${borderOpacity === "border-white/20" ? "hover:border-white/30" : "hover:border-white/35"}` 
    : ""

  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      style={{
        backdropFilter: `blur(${clampedBlur}px)`,
        backgroundColor: `rgba(255, 255, 255, ${clampedRefraction})`,
        borderColor: `rgba(255, 255, 255, ${clampedRefraction + 0.08})`,
        boxShadow: `0 ${Math.ceil(clampedDepth * 2)}px ${Math.ceil(clampedDepth * 4)}px rgba(0, 0, 0, ${0.1 + clampedDepth * 0.05})`
      }}
    >
      {children}
    </div>
  )
}
