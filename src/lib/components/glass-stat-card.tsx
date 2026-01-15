"use client"

import type React from "react"
import { GlassCard } from "./glass-card"

interface GlassStatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  change?: string
  changeType?: "up" | "down" | "neutral"
}

export function GlassStatCard({ label, value, icon, change, changeType = "neutral" }: GlassStatCardProps) {
  const changeColor = {
    up: "text-green-400",
    down: "text-red-400",
    neutral: "text-yellow-400",
  }

  return (
    <GlassCard variant="sm" interactive>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-white/60 mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && <p className={`text-xs mt-1 ${changeColor[changeType]}`}>{change}</p>}
        </div>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
    </GlassCard>
  )
}
