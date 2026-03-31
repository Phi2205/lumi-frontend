"use client"

import React, { useState, useEffect } from "react"
import { Modal } from "@/lib/components/modal"
import { User } from "@/types/user.type"
import { getFriendsService, getMutualFriendsService, getFriendsUserIdService } from "@/services/friend.service"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/skeleton"
import { Loader2, Users } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"

interface FriendListModalProps {
    isOpen: boolean
    onClose: () => void
    userId: string
    isOwnProfile: boolean
    type: "friends" | "mutual"
    title: string
}

export function FriendListModal({ isOpen, onClose, userId, isOwnProfile, type, title }: FriendListModalProps) {
    const { t } = useTranslation()
    const [friends, setFriends] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isFetchingMore, setIsFetchingMore] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const LIMIT = 20

    useEffect(() => {
        if (isOpen && userId) {
            setFriends([])
            setPage(1)
            setHasMore(true)
            fetchFriends(1, true)
        }
    }, [isOpen, userId, type])

    const fetchFriends = async (pageNum: number, isInitial: boolean = false) => {
        if (!hasMore && !isInitial) return

        try {
            if (isInitial) setIsLoading(true)
            else setIsFetchingMore(true)

            setError(null)
            let data: User[] = [];

            if (type === "friends") {
                const res = isOwnProfile
                    ? await getFriendsService(LIMIT.toString(), pageNum.toString())
                    : await getFriendsUserIdService(userId, LIMIT.toString(), pageNum.toString())
                data = res.data || []
                // If we got fewer items than the limit, there are no more
                setHasMore(data.length === LIMIT)
            } else {
                // Mutual friends doesn't seem to support pagination in current service
                const res = await getMutualFriendsService(userId)
                data = res.data || []
                setHasMore(false)
            }

            setFriends(prev => isInitial ? data : [...prev, ...data])
        } catch (err) {
            console.error(`Failed to fetch ${type}:`, err)
            setError(t('profile.load_failed', { type: t(`profile.${type}`) }))
        } finally {
            setIsLoading(false)
            setIsFetchingMore(false)
        }
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
        // Load more when 50px from bottom
        if (scrollHeight - scrollTop - clientHeight < 50 && !isFetchingMore && hasMore && !isLoading) {
            const nextPage = page + 1
            setPage(nextPage)
            fetchFriends(nextPage)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/20 rounded-lg">
                        <Users className="w-5 h-5 text-brand-primary" />
                    </div>
                    <span>{title}</span>
                </div>
            }
            maxWidthClassName="max-w-md"
        >
            <div
                className="min-h-[300px] max-h-[60vh] overflow-y-auto pr-2 custom-scrollba scroll-glass"
                onScroll={handleScroll}
            >
                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 animate-pulse">
                                <Skeleton width="w-10" height="h-10" rounded="rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton width="w-24" height="h-4" />
                                    <Skeleton width="w-16" height="h-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center p-6">
                        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4">
                            !
                        </div>
                        <p className="text-white/60 mb-4">{error}</p>
                        <button
                            onClick={() => fetchFriends(1, true)}
                            className="text-brand-primary hover:underline text-sm font-medium"
                        >
                            {t('profile.try_again')}
                        </button>
                    </div>
                ) : friends.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center p-6">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/20 mb-4">
                            <Users className="w-6 h-6" />
                        </div>
                        <p className="text-white/40">{t('profile.no_friends')}</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {friends.map((friend) => (
                            <Link
                                key={friend.id}
                                href={`/users/${friend.username}`}
                                onClick={onClose}
                                className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-brand-primary/20 rounded-2xl transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={friend.avatar_url || "/avatar-default.jpg"} />
                                        <AvatarFallback>{friend.name?.[0] || ""}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-semibold text-white group-hover:text-brand-primary transition-colors">{friend.name}</p>
                                        <p className="text-xs text-white/40">@{friend.username}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {isFetchingMore && (
                            <div className="flex justify-center p-4">
                                <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    )
}
