"use client"

import React, { useState, useEffect } from "react"
import { Modal } from "@/lib/components/modal"
import { User } from "@/types/user.type"
import { getFriendsService, getMutualFriendsService, getFriendsUserIdService } from "@/services/friend.service"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/skeleton"
import { Loader2, Users } from "lucide-react"
import Link from "next/link"

interface FriendListModalProps {
    isOpen: boolean
    onClose: () => void
    userId: string
    isOwnProfile: boolean
    type: "friends" | "mutual"
    title: string
}

export function FriendListModal({ isOpen, onClose, userId, isOwnProfile, type, title }: FriendListModalProps) {
    const [friends, setFriends] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen && userId) {
            fetchFriends()
        }
    }, [isOpen, userId, type])

    const fetchFriends = async () => {
        try {
            setIsLoading(true)
            setError(null)
            let data;
            if (type === "friends") {
                const res = isOwnProfile
                    ? await getFriendsService("20", "1")
                    : await getFriendsUserIdService(userId, "20", "1")
                data = res.data
            } else {
                const res = await getMutualFriendsService(userId)
                data = res.data
            }
            setFriends(data || [])
        } catch (err) {
            console.error(`Failed to fetch ${type}:`, err)
            setError(`Failed to load ${type}. Please try again.`)
        } finally {
            setIsLoading(false)
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
            <div className="min-h-[300px] max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
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
                            onClick={fetchFriends}
                            className="text-brand-primary hover:underline text-sm font-medium"
                        >
                            Try again
                        </button>
                    </div>
                ) : friends.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center p-6">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/20 mb-4">
                            <Users className="w-6 h-6" />
                        </div>
                        <p className="text-white/40">No friends found.</p>
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
                    </div>
                )}
            </div>
        </Modal>
    )
}
