"use client"

import type React from "react"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "sm" | "lg"
  interactive?: boolean
  vibrant?: boolean
  intensity?: "light" | "medium" | "strong"
  mobileIntensity?: "light" | "medium" | "strong"
  desktopIntensity?: "light" | "medium" | "strong"
  blur?: number
  refraction?: number
  depth?: number
}

export function GlassCardVariant({ 
  children, 
  className = "", 
  variant = "default", 
  interactive = false,
  vibrant = false,
  intensity,
  mobileIntensity,
  desktopIntensity,
  blur = 20,
  refraction = 0.12,
  depth = 3
}: GlassCardProps) {
  // Clamp values to valid ranges
  const clampedBlur = Math.max(0, Math.min(100, blur))
  const clampedRefraction = Math.max(0, Math.min(1, refraction))
  const clampedDepth = Math.max(0, Math.min(10, depth))

  const intensityMap = {
    light: "from-white/5 via-white/2 to-transparent dark:from-white/4 dark:via-white/1",
    medium: "from-white/10 via-white/5 to-transparent dark:from-white/8 dark:via-white/3",
    strong: "from-white/20 via-white/10 to-transparent dark:from-white/15 dark:via-white/8"
  }

  const desktopIntensityMap = {
    light: "md:from-white/5 md:via-white/2 md:to-transparent md:dark:from-white/4 md:dark:via-white/1",
    medium: "md:from-white/10 md:via-white/5 md:to-transparent md:dark:from-white/8 md:dark:via-white/3",
    strong: "md:from-white/20 md:via-white/10 md:to-transparent md:dark:from-white/15 md:dark:via-white/8"
  }

  const finalMobileIntensity = mobileIntensity || intensity || "medium"
  const finalDesktopIntensity = desktopIntensity || intensity || "medium"

  const baseStyles = vibrant
    ? "glass glass-vibrant glass-text relative overflow-hidden"
    : "glass glass-elevated glass-text relative overflow-hidden"

  const variantStyles = {
    default: "p-6",
    sm: "p-4",
    lg: "p-8",
  }

  const interactiveStyles = interactive 
    ? "glass-interactive cursor-pointer" 
    : ""

  const overlayClasses = `${intensityMap[finalMobileIntensity]} ${desktopIntensityMap[finalDesktopIntensity]}`

  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      style={{
        backdropFilter: `blur(${clampedBlur}px)`,
        backgroundColor: `rgba(255, 255, 255, ${clampedRefraction})`,
        boxShadow: `0 ${Math.ceil(clampedDepth * 2)}px ${Math.ceil(clampedDepth * 4)}px rgba(0, 0, 0, ${0.1 + clampedDepth * 0.05})`
      }}
    >
      <div className="relative z-10">{children}</div>
    </div>
  )
}
