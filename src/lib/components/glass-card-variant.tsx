"use client"

import type React from "react"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "sm" | "lg"
  interactive?: boolean
  vibrant?: boolean
  intensity?: "light" | "medium" | "strong" // Deprecated: dùng mobileIntensity và desktopIntensity thay thế
  mobileIntensity?: "light" | "medium" | "strong"
  desktopIntensity?: "light" | "medium" | "strong"
}

export function GlassCardVariant({ 
  children, 
  className = "", 
  variant = "default", 
  interactive = false,
  vibrant = false,
  intensity, // Deprecated
  mobileIntensity,
  desktopIntensity
}: GlassCardProps) {
  // Map intensity to actual classes
  const intensityMap = {
    light: "from-white/5 via-white/2 to-transparent dark:from-white/4 dark:via-white/1",
    medium: "from-white/10 via-white/5 to-transparent dark:from-white/8 dark:via-white/3",
    strong: "from-white/20 via-white/10 to-transparent dark:from-white/15 dark:via-white/8"
  }

  // Desktop intensity map (thêm md: prefix)
  const desktopIntensityMap = {
    light: "md:from-white/5 md:via-white/2 md:to-transparent md:dark:from-white/4 md:dark:via-white/1",
    medium: "md:from-white/10 md:via-white/5 md:to-transparent md:dark:from-white/8 md:dark:via-white/3",
    strong: "md:from-white/20 md:via-white/10 md:to-transparent md:dark:from-white/15 md:dark:via-white/8"
  }

  // Xác định intensity cho mobile và desktop
  // Nếu có mobileIntensity/desktopIntensity thì dùng, nếu không thì fallback về intensity
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

  // Combine mobile và desktop intensity classes
  const overlayClasses = `${intensityMap[finalMobileIntensity]} ${desktopIntensityMap[finalDesktopIntensity]}`

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyles} ${className}`}>
      <div className="relative z-10">{children}</div>
    </div>
  )
}