"use client"

import type React from "react"

interface GlassContainerProps {
  children: React.ReactNode
  className?: string
  blur?: number
  refraction?: number
  depth?: number
}

export function GlassContainer({ 
  children, 
  className = "",
  blur = 20,
  refraction = 0.12,
  depth = 3
}: GlassContainerProps) {
  // Clamp values to valid ranges
  const clampedBlur = Math.max(0, Math.min(100, blur))
  const clampedRefraction = Math.max(0, Math.min(1, refraction))
  const clampedDepth = Math.max(0, Math.min(10, depth))

  return (
    <div 
      className={`rounded-3xl border ${className}`}
      style={{
        backdropFilter: `blur(${clampedBlur}px)`,
        backgroundColor: `rgba(255, 255, 255, ${clampedRefraction})`,
        borderColor: `rgba(255, 255, 255, ${clampedRefraction + 0.08})`,
        boxShadow: `0 ${Math.ceil(clampedDepth * 3)}px ${Math.ceil(clampedDepth * 6)}px rgba(0, 0, 0, ${0.1 + clampedDepth * 0.05})`
      }}
    >
      {children}
    </div>
  )
}
