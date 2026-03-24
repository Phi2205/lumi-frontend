"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageCircle, UserPlus, MoreHorizontal, MapPin, Briefcase, User, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { GlassCard } from "@/lib/components"
import { userHoverCard as getUserHoverCard } from "@/services/user.service"
import { UserHoverCard as UserHoverCardType } from "@/types/user.type"
import { Skeleton, SkeletonAvatar } from "@/components/skeleton"
import { useRouter } from "next/navigation"

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
    username?: string
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
    username,
    children,
    className,
}: UserHoverCardProps) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [userData, setUserData] = useState<UserHoverCardType | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const closeTimeout = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    useEffect(() => {
        if (isOpen && userId && !userData && !isLoading) {
            const fetchData = async () => {
                setIsLoading(true)
                try {
                    const data = await getUserHoverCard(userId)
                    console.log(data)
                    setUserData(data.data)
                } catch (err) {
                    console.error("Error fetching user hover card:", err)
                } finally {
                    setIsLoading(false)
                }
            }
            fetchData()
        }
    }, [isOpen, userId, userData, isLoading])

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        if (closeTimeout.current) {
            clearTimeout(closeTimeout.current)
            closeTimeout.current = null
        }

        const rect = e.currentTarget.getBoundingClientRect()
        setPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 8,
        })
        setIsOpen(true)
    }

    const handleMouseLeave = () => {
        closeTimeout.current = setTimeout(() => {
            setIsOpen(false)
        }, 100)
    }

    const handleCardMouseEnter = () => {
        if (closeTimeout.current) {
            clearTimeout(closeTimeout.current)
            closeTimeout.current = null
        }
    }

    return (
        <div
            className={cn("relative inline-block", className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Trigger Element */}
            <div
                className="cursor-pointer"
                onClick={(e) => {
                    if (username) {
                        e.stopPropagation()
                        router.push(`/users/${username}`)
                    }
                }}
            >
                {children}
            </div>

            {/* Hover Card */}
            {isOpen && mounted && createPortal(
                <GlassCard
                    className="fixed z-[9999] w-96 p-6 rounded-3xl !backdrop-blur-2xl !bg-gradient-to-br !from-white/15 !to-white/10 !border-white/30"
                    variant="lg"
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        transform: "translateX(-50%) translateY(-100%)",
                        pointerEvents: "auto",
                    } as React.CSSProperties}
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full transition"
                    >
                        <X className="w-5 h-5 text-white/70" />
                    </button>

                    {/* Header Section */}
                    {isLoading && !userData ? (
                        <div className="flex items-start gap-4 mb-4">
                            <SkeletonAvatar size="h-16" className="border-4 border-blue-400 shadow-lg ring-0" />
                            <div className="flex-1 space-y-2 py-1">
                                <Skeleton height="h-6" width="w-3/4" className="bg-white/15 rounded" />
                                <Skeleton height="h-4" width="w-1/2" className="bg-white/10 rounded" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-4 mb-4">
                            {/* Profile Picture */}
                            <div className="relative">
                                <Avatar className="w-16 h-16 border-4 border-blue-400 shadow-lg">
                                    <AvatarImage src={userData?.avatar_url || avatar} alt={userData?.name || name} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                                        {(userData?.name || name)
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* User Info */}
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg leading-tight">{userData?.name || name}</h3>
                                {(userData?.friend_count ?? mutualFriends) > 0 && (
                                    <p className="text-white/60 text-xs mt-1">
                                        {userData?.friend_count ?? mutualFriends} bạn bè
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {!isLoading && !userData && !name && (
                        <p className="text-white/40 text-sm text-center py-4">Có lỗi xảy ra khi tải thông tin</p>
                    )}

                    {/* Education */}
                    {isLoading && !userData ? (
                        <div className="flex gap-3 mb-3">
                            <Skeleton height="h-4" width="w-4" className="bg-white/10 rounded shrink-0 mt-0.5" />
                            <Skeleton height="h-4" width="w-full" className="bg-white/10 rounded" />
                        </div>
                    ) : (
                        education && (
                            <div className="flex gap-3 mb-3">
                                <Briefcase className="w-4 h-4 text-white/60 flex-shrink-0 mt-0.5" />
                                <p className="text-white/80 text-sm leading-snug">{education}</p>
                            </div>
                        )
                    )}

                    {/* Location */}
                    {isLoading && !userData ? (
                        <div className="flex gap-3 mb-4">
                            <Skeleton height="h-4" width="w-4" className="bg-white/10 rounded shrink-0 mt-0.5" />
                            <Skeleton height="h-4" width="w-2/3" className="bg-white/10 rounded" />
                        </div>
                    ) : (
                        (userData?.address || location) && (
                            <div className="flex gap-3 mb-4">
                                <MapPin className="w-4 h-4 text-white/60 flex-shrink-0 mt-0.5" />
                                <p className="text-white/80 text-sm leading-snug">{userData?.address || location}</p>
                            </div>
                        )
                    )}

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0 mb-4" />

                    {/* Action Buttons */}
                    {isLoading && !userData ? (
                        <div className="flex gap-2">
                            <Skeleton height="h-10" width="w-full" className="flex-1 rounded-xl bg-white/10" />
                            <Skeleton height="h-10" width="w-full" className="flex-1 rounded-xl bg-white/10" />
                            <Skeleton height="h-10" width="w-10" className="rounded-xl bg-white/10 shrink-0" />
                            <Skeleton height="h-10" width="w-10" className="rounded-xl bg-white/10 shrink-0" />
                        </div>
                    ) : (
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
                                onClick={() => {
                                    const u = userData?.username || username
                                    if (u) router.push(`/users/${u}`)
                                    setIsOpen(false)
                                }}
                                className="backdrop-blur-lg bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl h-10 w-10 shrink-0"
                            >
                                <User className="w-4 h-4" />
                            </Button>

                            {/* More Options */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="backdrop-blur-lg bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl h-10 w-10 shrink-0"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </GlassCard>,
                document.body
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
