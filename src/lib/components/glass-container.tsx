"use client"

import type React from "react"

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GlassContainer({ children, className = "", ...props }: GlassContainerProps) {
  return (
    <div
      className={`backdrop-blur-3xl bg-white/8 border border-white/15 rounded-3xl shadow-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
