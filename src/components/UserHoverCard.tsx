"use client"

import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageCircle, UserPlus, MoreHorizontal, MapPin, Briefcase, User, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { GlassCard } from "@/lib/components"

interface UserHoverCardProps {
  userId: string
  name: string
  avatar: string
  education?: string
  location?: string
  mutualFriends?: number
  isFollowing?: boolean
  onFollow?: () => void
  onMessage?: () => void
  children: React.ReactNode
  className?: string
}

export function UserHoverCard({
  userId,
  name,
  avatar,
  education,
  location,
  mutualFriends = 0,
  isFollowing = false,
  onFollow,
  onMessage,
  children,
  className,
}: UserHoverCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPosition({
      x: rect.left,
      y: rect.bottom + 8,
    })
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    setIsOpen(false)
  }

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Element */}
      <div className="cursor-pointer">{children}</div>

      {/* Hover Card */}
      {isOpen && (
        <GlassCard
          className="fixed z-50 w-80 p-6 rounded-3xl !backdrop-blur-2xl !bg-gradient-to-br !from-white/15 !to-white/10 !border-white/30"
          variant="lg"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: "translateX(-50%) translateX(50px)",
          } as React.CSSProperties}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full transition"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>

          {/* Header Section */}
          <div className="flex items-start gap-4 mb-4">
            {/* Profile Picture */}
            <div className="relative">
              <Avatar className="w-16 h-16 border-4 border-blue-400 shadow-lg">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg leading-tight">{name}</h3>
              {mutualFriends > 0 && (
                <p className="text-white/60 text-xs mt-1">
                  {mutualFriends} bạn chung
                </p>
              )}
            </div>
          </div>

          {/* Education */}
          {education && (
            <div className="flex gap-3 mb-3">
              <Briefcase className="w-4 h-4 text-white/60 flex-shrink-0 mt-0.5" />
              <p className="text-white/80 text-sm leading-snug">{education}</p>
            </div>
          )}

          {/* Location */}
          {location && (
            <div className="flex gap-3 mb-4">
              <MapPin className="w-4 h-4 text-white/60 flex-shrink-0 mt-0.5" />
              <p className="text-white/80 text-sm leading-snug">{location}</p>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0 mb-4" />

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Message Button */}
            <Button
              onClick={onMessage}
              className="flex-1 backdrop-blur-lg bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition transform hover:scale-105 flex items-center justify-center gap-2 h-10"
            >
              <MessageCircle className="w-4 h-4" />
              Nhắn tin
            </Button>

            {/* Follow Button */}
            <Button
              onClick={onFollow}
              className={cn(
                "flex-1 backdrop-blur-lg rounded-xl font-semibold transition transform hover:scale-105 flex items-center justify-center gap-2 h-10",
                isFollowing
                  ? "bg-white/10 hover:bg-white/20 border border-white/30 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              )}
            >
              <UserPlus className="w-4 h-4" />
              {isFollowing ? "Đã theo dõi" : "Theo dõi"}
            </Button>

            {/* Profile Button */}
            <Button
              variant="ghost"
              size="icon"
              className="backdrop-blur-lg bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl h-10 w-10"
            >
              <User className="w-4 h-4" />
            </Button>

            {/* More Options */}
            <Button
              variant="ghost"
              size="icon"
              className="backdrop-blur-lg bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl h-10 w-10"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </GlassCard>
      )}
    </div>
  )
}

// Export a wrapper component for easier use with usernames
interface UserNameHoverProps {
  userId: string
  name: string
  userInfo: {
    avatar: string
    education?: string
    location?: string
    mutualFriends?: number
    isFollowing?: boolean
  }
  onFollow?: () => void
  onMessage?: () => void
  className?: string
}

export function UserNameWithHover({
  userId,
  name,
  userInfo,
  onFollow,
  onMessage,
  className,
}: UserNameHoverProps) {
  return (
    <UserHoverCard
      userId={userId}
      name={name}
      avatar={userInfo.avatar}
      education={userInfo.education}
      location={userInfo.location}
      mutualFriends={userInfo.mutualFriends}
      isFollowing={userInfo.isFollowing}
      onFollow={onFollow}
      onMessage={onMessage}
      className={className}
    >
      <span className="text-blue-400 hover:underline cursor-pointer font-semibold">
        {name}
      </span>
    </UserHoverCard>
  )
}
