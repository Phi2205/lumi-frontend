"use client"

import { HomeLayout } from "@/components/HomeLayout"
import { useState, useEffect } from "react"
import { getRecommendedUsers } from "@/services/recommend.service"
import type { RecommendedUser } from "@/apis/recommend.api"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { SkeletonFriendRequests } from "@/components/skeleton"
import { ArrowLeft, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { sendFriendRequest, acceptFriendRequest, cancelFriendRequest } from "@/services/friendRequest.service"
import { deleteFriendService } from "@/services/friend.service"
import { FriendActionButton } from "@/components/profile/FriendActionButton"
import { GlassButton } from "@/lib/components"
import { Modal } from "@/lib/components/modal"
import { AlertCircle } from "lucide-react"
import { Notification } from "@/lib/components/notification"
import { cn } from "@/lib/utils"
import { FriendshipStatus } from "@/types/user.type"

export default function SuggestedUsersPage() {
    const router = useRouter()
    const [recommendedUsers, setRecommendedUsers] = useState<RecommendedUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [actionLoadingIds, setActionLoadingIds] = useState<Set<string>>(new Set())
    const [notif, setNotif] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
        open: false,
        type: 'success',
        message: ''
    })
    const [unfriendTarget, setUnfriendTarget] = useState<{ id: string, name: string } | null>(null)

    useEffect(() => {
        const fetchRecommends = async () => {
            try {
                setIsLoading(true)
                const response = await getRecommendedUsers(20)
                setRecommendedUsers(response.data.recommendations || [])
            } catch (error) {
                console.error("Fetch recommended users failed:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchRecommends()
    }, [])

    const handleAddFriend = async (userId: string) => {
        if (actionLoadingIds.has(userId)) return

        try {
            setActionLoadingIds(prev => new Set(prev).add(userId))
            await sendFriendRequest(userId)
            setRecommendedUsers(prev => prev.map(item =>
                item.user.id === userId ? { ...item, user: { ...item.user, friend_status: 'pending' as FriendshipStatus } } : item
            ))
            setNotif({ open: true, type: 'success', message: "Friend request sent" })
        } catch (error) {
            console.error("Send friend request failed:", error)
            setNotif({ open: true, type: 'error', message: "Failed to send friend request" })
        } finally {
            setActionLoadingIds(prev => {
                const next = new Set(prev)
                next.delete(userId)
                return next
            })
        }
    }

    const handleAcceptRequest = async (userId: string) => {
        if (actionLoadingIds.has(userId)) return

        try {
            setActionLoadingIds(prev => new Set(prev).add(userId))
            await acceptFriendRequest(userId)
            setRecommendedUsers(prev => prev.map(item =>
                item.user.id === userId ? { ...item, user: { ...item.user, friend_status: 'friend' as FriendshipStatus } } : item
            ))
            setNotif({ open: true, type: 'success', message: "Friend request accepted" })
        } catch (error) {
            console.error("Accept friend request failed:", error)
            setNotif({ open: true, type: 'error', message: "Failed to accept friend request" })
        } finally {
            setActionLoadingIds(prev => {
                const next = new Set(prev)
                next.delete(userId)
                return next
            })
        }
    }

    const handleCancelRequest = async (userId: string) => {
        if (actionLoadingIds.has(userId)) return

        try {
            setActionLoadingIds(prev => new Set(prev).add(userId))
            await cancelFriendRequest(userId)
            setRecommendedUsers(prev => prev.map(item =>
                item.user.id === userId ? { ...item, user: { ...item.user, friend_status: 'none' as FriendshipStatus } } : item
            ))
            setNotif({ open: true, type: 'success', message: "Friend request cancelled" })
        } catch (error) {
            console.error("Cancel friend request failed:", error)
            setNotif({ open: true, type: 'error', message: "Failed to cancel friend request" })
        } finally {
            setActionLoadingIds(prev => {
                const next = new Set(prev)
                next.delete(userId)
                return next
            })
        }
    }

    const handleDeleteFriend = (userId: string, name: string) => {
        setUnfriendTarget({ id: userId, name })
    }

    const confirmDeleteFriend = async () => {
        if (!unfriendTarget || actionLoadingIds.has(unfriendTarget.id)) return

        const { id, name } = unfriendTarget
        try {
            setActionLoadingIds(prev => new Set(prev).add(id))
            await deleteFriendService(id)
            setRecommendedUsers(prev => prev.map(item =>
                item.user.id === id ? { ...item, user: { ...item.user, friend_status: 'none' as FriendshipStatus } } : item
            ))
            setNotif({ open: true, type: 'success', message: "Unfriended successfully" })
            setUnfriendTarget(null)
        } catch (error) {
            console.error("Unfriend failed:", error)
            setNotif({ open: true, type: 'error', message: "Failed to unfriend" })
        } finally {
            setActionLoadingIds(prev => {
                const next = new Set(prev)
                next.delete(id)
                return next
            })
        }
    }

    return (
        <HomeLayout>
            <div className="max-w-[600px] mx-auto pt-4 md:pt-8 px-4">
                <div className="mb-6">
                    <h1 className="text-base font-bold text-white mb-6">Suggested</h1>
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="space-y-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-11 h-11 rounded-full bg-white/10 animate-pulse" />
                                        <div className="flex-1 space-y-2">
                                            <div className="w-24 h-3 bg-white/10 rounded animate-pulse" />
                                            <div className="w-32 h-2 bg-white/5 rounded animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="w-20 h-8 bg-white/10 rounded-lg animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : recommendedUsers.filter(item => item.user.friend_status !== 'friend' && item.user.friend_status !== 'accepted').length > 0 ? (
                        recommendedUsers
                            .filter(item => item.user.friend_status !== 'friend' && item.user.friend_status !== 'accepted')
                            .map((item) => (
                                <div
                                    key={item.user.id}
                                    className="flex items-center justify-between group p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 !overflow-visible"
                                >
                                    <div
                                        className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                                        onClick={() => router.push(`/users/${item.user.username}`)}
                                    >
                                        <Avatar className="h-11 w-11 ring-1 ring-white/10 shadow-lg">
                                            <AvatarImage src={item.user.avatar_url || "/avatar-default.jpg"} alt={item.user.name} />
                                            <AvatarFallback className="bg-linear-to-br from-brand-primary to-brand-primary-dark text-white text-xs">
                                                {item.user.name[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <div className="flex flex-col">
                                                <p className="text-sm font-bold text-white truncate hover:text-brand-primary-light transition-colors leading-tight">
                                                    {item.user.name}
                                                </p>
                                                <p className="text-[12px] text-white/40 truncate leading-tight mt-0.5">
                                                    Suggested for you
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <FriendActionButton
                                        status={item.user.friend_status}
                                        name={item.user.name}
                                        onAddFriend={() => handleAddFriend(item.user.id)}
                                        onUnfriend={() => handleDeleteFriend(item.user.id, item.user.name)}
                                        onCancelRequest={() => handleCancelRequest(item.user.id)}
                                        onAcceptRequest={() => handleAcceptRequest(item.user.id)}
                                        isLoading={actionLoadingIds.has(item.user.id)}
                                        className="ml-4 rounded-xl h-9 text-xs px-5 shadow-lg"
                                    />
                                </div>
                            ))
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-white/50 text-sm">No suggestions found at the moment.</p>
                        </div>
                    )}
                </div>
            </div>

            <Notification
                isOpen={notif.open}
                type={notif.type}
                message={notif.message}
                onClose={() => setNotif(prev => ({ ...prev, open: false }))}
            />

            <Modal
                isOpen={!!unfriendTarget}
                onClose={() => setUnfriendTarget(null)}
                title={
                    <div className="flex items-center gap-3 text-red-500">
                        <AlertCircle className="w-6 h-6" />
                        <span>Unfriend?</span>
                    </div>
                }
                maxWidthClassName="max-w-md"
            >
                <div className="space-y-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                        <p className="text-white/80 text-center leading-relaxed">
                            Are you sure you want to unfriend <span className="text-white font-bold">{unfriendTarget?.name}</span>?
                            This will remove them from your friend list.
                        </p>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <GlassButton
                            className="flex-1 bg-white/5 hover:bg-white/10"
                            onClick={() => setUnfriendTarget(null)}
                        >
                            Cancel
                        </GlassButton>
                        <GlassButton
                            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/30 font-bold h-11 rounded-xl"
                            onClick={confirmDeleteFriend}
                            disabled={unfriendTarget ? actionLoadingIds.has(unfriendTarget.id) : false}
                        >
                            {unfriendTarget && actionLoadingIds.has(unfriendTarget.id) ? "Processing..." : "Unfriend"}
                        </GlassButton>
                    </div>
                </div>
            </Modal>
        </HomeLayout>
    )
}
