"use client"

import type React from "react"

interface GlassBadgeProps {
  children: React.ReactNode
  variant?: "blue" | "cyan" | "yellow" | "purple"
  className?: string
  blur?: number
  refraction?: number
  depth?: number
}

export function GlassBadge({ 
  children, 
  variant = "blue", 
  className = "",
  blur = 15,
  refraction = 0.15,
  depth = 2
}: GlassBadgeProps) {
  // Clamp values to valid ranges
  const clampedBlur = Math.max(0, Math.min(100, blur))
  const clampedRefraction = Math.max(0, Math.min(1, refraction))
  const clampedDepth = Math.max(0, Math.min(10, depth))

  const variantColors = {
    blue: { bg: "rgb(59, 130, 246)", border: "rgb(96, 165, 250)" },
    cyan: { bg: "rgb(34, 211, 238)", border: "rgb(165, 243, 252)" },
    yellow: { bg: "rgb(250, 204, 21)", border: "rgb(253, 224, 71)" },
    purple: { bg: "rgb(168, 85, 247)", border: "rgb(196, 181, 253)" },
  }

  const colors = variantColors[variant]

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border text-white/90 ${className}`}
      style={{
        backdropFilter: `blur(${clampedBlur}px)`,
        backgroundColor: `rgba(${colors.bg}, ${clampedRefraction})`,
        borderColor: `rgba(${colors.border}, ${clampedRefraction + 0.15})`,
        boxShadow: `0 ${Math.ceil(clampedDepth)}px ${Math.ceil(clampedDepth * 1.5)}px rgba(0, 0, 0, ${0.05 + clampedDepth * 0.02})`
      }}
    >
      {children}
    </span>
  )
}
