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
import { useTranslation } from "react-i18next"
import { GlassButton } from "@/lib/components"
import { FriendActionButton } from "@/components/profile/FriendActionButton"
import { sendFriendRequestApi, acceptFriendRequestApi, cancelFriendRequestApi } from "@/apis/friendRequest.api"
import { deleteFriendApi } from "@/apis/friend.api"
import { useMiniChat } from "@/components/messages/MiniChatContext"
import { useAuth } from "@/contexts/AuthContext"
import { getOrCreatePrivateConversationApi } from "@/apis/conversation.api"
import { mapConversationToUI } from "@/services/conversation.service"
import "@/lib/i18n"

interface UserHoverCardProps {
    userId: string
    name: string
    avatar: string
    education?: string
    location?: string
    mutualFriends?: number
    onFollow?: () => void
    onAddFriend?: () => void
    onUnfriend?: () => void
    onCancelRequest?: () => void
    onAcceptRequest?: () => void
    isLoading?: boolean
    onMessage?: () => void
    username?: string
    hasStory?: boolean
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
    onFollow,
    onAddFriend,
    onUnfriend,
    onCancelRequest,
    onAcceptRequest,
    isLoading: parentIsLoading = false,
    onMessage,
    username,
    hasStory = false,
    children,
    className,
}: UserHoverCardProps) {
    const { t } = useTranslation()
    const router = useRouter()
    const { openChat } = useMiniChat()
    const { user: currentUser } = useAuth()
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

    const handleInternalAddFriend = async () => {
        if (!userId || isLoading) return
        setIsLoading(true)
        try {
            await sendFriendRequestApi({ receiver_id: userId })
            setUserData(prev => prev ? { ...prev, friend_status: 'pending' } : null)
        } catch (err) {
            console.error("Error adding friend:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInternalAcceptRequest = async () => {
        if (!userId || isLoading) return
        setIsLoading(true)
        try {
            await acceptFriendRequestApi({ requester_id: userId })
            setUserData(prev => prev ? { ...prev, friend_status: 'accepted' } : null)
        } catch (err) {
            console.error("Error accepting friend request:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInternalCancelRequest = async () => {
        if (!userId || isLoading) return
        setIsLoading(true)
        try {
            await cancelFriendRequestApi({ receiver_id: userId })
            setUserData(prev => prev ? { ...prev, friend_status: 'none' } : null)
        } catch (err) {
            console.error("Error cancelling friend request:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInternalUnfriend = async () => {
        if (!userId || isLoading) return
        setIsLoading(true)
        try {
            await deleteFriendApi(userId)
            setUserData(prev => prev ? { ...prev, friend_status: 'none' } : null)
        } catch (err) {
            console.error("Error unfriending:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInternalChat = async () => {
        if (!userId || isLoading) return
        setIsLoading(true)
        try {
            const res = await getOrCreatePrivateConversationApi(userId)
            if (res.data.success) {
                const conversation = res.data.data
                const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024
                if (isMobile) {
                    router.push(`/messages?conversationId=${conversation.id}`)
                } else {
                    const mapped = mapConversationToUI(conversation, currentUser?.id || "")
                    openChat({
                        recipientId: userId,
                        recipientName: userData?.name || name || "User",
                        recipientAvatar: userData?.avatar_url || avatar || "/avatar-default.jpg",
                        conversationId: conversation.id,
                        participants: mapped.participants,
                        lastSeenMessageId: mapped.lastSeenMessageId,
                    })
                }
                setIsOpen(false)
            }
        } catch (error) {
            console.error("Failed to start chat from hover card:", error)
        } finally {
            setIsLoading(false)
        }
    }

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
                        const href = hasStory ? `/stories/${username}` : `/users/${username}`
                        router.push(href)
                    }
                }}
            >
                {children}
            </div>

            {/* Hover Card */}
            {isOpen && mounted && createPortal(
                <GlassCard
                    className="fixed z-[9999] w-[26rem] p-6 rounded-[2.5rem] !backdrop-blur-3xl !bg-gradient-to-br !from-white/20 !to-white/5 !border-white/20 shadow-2xl"
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
                        className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full transition cursor-pointer"
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
                                <Avatar className="w-20 h-20 border-2 border-white/20 shadow-xl">
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
                                <h3 className="text-white font-bold text-xl tracking-tight leading-tight">{userData?.name || name}</h3>
                                {(userData?.friend_count ?? mutualFriends) > 0 && (
                                    <p className="text-white/50 text-xs mt-1 font-medium">
                                        {t('friends.friends_count', { count: userData?.friend_count ?? mutualFriends })}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {!isLoading && !userData && !name && (
                        <p className="text-white/40 text-sm text-center py-4">{t('common.error_loading')}</p>
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
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            {/* Message Button */}
                            <GlassButton
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (onMessage) {
                                        onMessage()
                                    } else {
                                        handleInternalChat()
                                    }
                                }}
                                className="flex-1 !rounded-[1rem] h-10 font-bold bg-white/10 hover:bg-white/20 border-white/20"
                            >
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {t('common.message')}
                            </GlassButton>

                            <FriendActionButton
                                status={userData?.friend_status}
                                name={userData?.name || name}
                                onAddFriend={onAddFriend || handleInternalAddFriend}
                                onUnfriend={onUnfriend || handleInternalUnfriend}
                                onCancelRequest={onCancelRequest || handleInternalCancelRequest}
                                onAcceptRequest={onAcceptRequest || handleInternalAcceptRequest}
                                isLoading={isLoading || parentIsLoading}
                                className="flex-1 !rounded-[1rem] h-10 font-bold"
                            />

                            {/* Profile Button */}
                            <GlassButton
                                onClick={(e) => {
                                    e.stopPropagation()
                                    const u = userData?.username || username
                                    if (u) router.push(`/users/${u}`)
                                    setIsOpen(false)
                                }}
                                className="!rounded-[1rem] h-10 w-10 shrink-0 bg-white/5 hover:bg-white/10 border-white/10 !p-0"
                            >
                                <User className="w-5 h-5" />
                            </GlassButton>
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
    }
    onFollow?: () => void
    onAddFriend?: () => void
    onUnfriend?: () => void
    onCancelRequest?: () => void
    onAcceptRequest?: () => void
    onMessage?: () => void
    className?: string
}

export function UserNameWithHover({
    userId,
    name,
    userInfo,
    onFollow,
    onAddFriend,
    onUnfriend,
    onCancelRequest,
    onAcceptRequest,
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
            onFollow={onFollow}
            onAddFriend={onAddFriend}
            onUnfriend={onUnfriend}
            onCancelRequest={onCancelRequest}
            onAcceptRequest={onAcceptRequest}
            onMessage={onMessage}
            className={className}
        >
            <span className="text-blue-400 hover:text-blue-500 transition-colors cursor-pointer font-semibold">
                {name}
            </span>
        </UserHoverCard>
    )
}
