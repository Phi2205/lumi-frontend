"use client"

import { useState, useEffect } from "react"
import { getFriendRequests, acceptFriendRequest, rejectFriendRequest, sendFriendRequest } from "@/services/friendRequest.service"
import { getRecommendedUsers } from "@/services/recommend.service"
import { SkeletonFriendRequests } from "@/components/skeleton"
import { Check, X, UserPlus, UserCheck, ChevronDown, MessageSquare } from "lucide-react"
import type { FriendRequestItem } from "@/apis/friendRequest.api"
import type { RecommendedUser } from "@/apis/recommend.api"
import { formatTime } from "@/utils/format"
import { useRouter } from "next/navigation"
import { StoryAvatar } from "@/components/ui/avatar"
import { GlassButton } from "@/lib/components/glass-button"
import { useMiniChat } from "@/components/messages/MiniChatContext"

export function FriendsPageContent() {
    const router = useRouter()
    const { openChat } = useMiniChat()
    const [requestFriendList, setRequestFriendList] = useState<FriendRequestItem[]>([])
    const [recommendedUsers, setRecommendedUsers] = useState<RecommendedUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRecommendLoading, setIsRecommendLoading] = useState(true)
    const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

    // Pagination states
    const [requestPage, setRequestPage] = useState(1)
    const [hasMoreRequests, setHasMoreRequests] = useState(false)
    const [isLoadingMoreRequests, setIsLoadingMoreRequests] = useState(false)

    const fetchFriendRequests = async (page: number, append = false) => {
        if (append) setIsLoadingMoreRequests(true)
        else setIsLoading(true)

        try {
            const res = await getFriendRequests(page, 4)
            const newItems = res.data.items || []
            setRequestFriendList(prev => append ? [...prev, ...newItems] : newItems)
            setHasMoreRequests(res.data.pagination.hasNextPage)
        } catch (error) {
            console.error("Fetch friend requests failed:", error)
        } finally {
            setIsLoading(false)
            setIsLoadingMoreRequests(false)
        }
    }

    const fetchRecommendations = async (limit: number = 40) => {
        setIsRecommendLoading(true)
        try {
            const res = await getRecommendedUsers(limit)
            setRecommendedUsers(res.data.recommendations || [])
        } catch (error) {
            console.error("Fetch recommendations failed:", error)
        } finally {
            setIsRecommendLoading(false)
        }
    }

    useEffect(() => {
        fetchFriendRequests(1)
        fetchRecommendations(40)
    }, [])

    const handleLoadMoreRequests = () => {
        const nextPage = requestPage + 1
        setRequestPage(nextPage)
        fetchFriendRequests(nextPage, true)
    }

    const handleAcceptRequest = async (requestId: string) => {
        if (processingIds.has(requestId)) return
        try {
            setProcessingIds((prev) => new Set(prev).add(requestId))
            await acceptFriendRequest(requestId)
            setRequestFriendList((prev) => prev.map((req) => {
                const id = req.id ?? req.requester_id
                if (id === requestId) return { ...req, actionStatus: 'accepted' as const }
                return req
            }))
        } catch (error) {
            console.error("Accept friend request failed:", error)
        } finally {
            setProcessingIds((prev) => {
                const newSet = new Set(prev)
                newSet.delete(requestId)
                return newSet
            })
        }
    }

    const handleRejectRequest = async (requestId: string) => {
        if (processingIds.has(requestId)) return
        try {
            setProcessingIds((prev) => new Set(prev).add(requestId))
            await rejectFriendRequest(requestId)
            setRequestFriendList((prev) => prev.map((req) => {
                const id = req.id ?? req.requester_id
                if (id === requestId) return { ...req, actionStatus: 'rejected' as const }
                return req
            }))
        } catch (error) {
            console.error("Reject friend request failed:", error)
        } finally {
            setProcessingIds((prev) => {
                const newSet = new Set(prev)
                newSet.delete(requestId)
                return newSet
            })
        }
    }

    const handleSendRequest = async (userId: string) => {
        if (processingIds.has(userId)) return
        try {
            setProcessingIds((prev) => new Set(prev).add(userId))
            await sendFriendRequest(userId)
            setRecommendedUsers((prev) => prev.filter((item) => item.user.id !== userId))
        } catch (error) {
            console.error("Send friend request failed:", error)
        } finally {
            setProcessingIds((prev) => {
                const newSet = new Set(prev)
                newSet.delete(userId)
                return newSet
            })
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Friend Requests Section */}
            {(isLoading || requestFriendList.length > 0) && (
                <section className="animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 rounded-xl bg-brand-primary/20 text-brand-primary">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Friend Requests</h2>
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-xs font-medium">
                            {requestFriendList.length}
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
                                    <SkeletonFriendRequests count={1} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {requestFriendList.map((req) => {
                                const requestId = req.id ?? req.requester_id
                                const isProcessing = processingIds.has(requestId)
                                return (
                                    <div
                                        key={requestId}
                                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all group"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <StoryAvatar
                                                src={req.requester?.avatar_url || "/avatar-default.jpg"}
                                                alt={req.requester?.name || "User"}
                                                className="h-12 w-12 shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className="text-base font-bold text-white truncate cursor-pointer hover:text-brand-primary transition-colors"
                                                    onClick={() => router.push(`/users/${req.requester?.username}`)}
                                                >
                                                    {req.requester?.name}
                                                </p>
                                                <p className="text-[10px] text-white/40 mt-1">{formatTime(req.created_at)}</p>
                                            </div>
                                        </div>
                                        {((req as any).actionStatus) ? (
                                            <div className="flex items-center justify-center py-2 px-4 bg-white/5 rounded-xl border border-white/10 w-full animate-in zoom-in-95 duration-300">
                                                <div className="flex items-center gap-2">
                                                    {(req as any).actionStatus === 'accepted' ? (
                                                        <Check className="w-4 h-4 text-green-400" />
                                                    ) : (
                                                        <X className="w-4 h-4 text-red-400" />
                                                    )}
                                                    <span className={((req as any).actionStatus === 'accepted') ? "text-green-400 text-xs font-bold" : "text-red-400 text-xs font-bold"}>
                                                        {(req as any).actionStatus === 'accepted' ? 'Đã chấp nhận lời mời' : 'Đã từ chối lời mời'}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <GlassButton
                                                    size="sm"
                                                    variant="ghost"
                                                    className="flex-1 text-xs rounded-xl bg-green-500/10 border-green-500/20 text-green-300 hover:bg-green-500/20 hover:border-green-500/30 disabled:opacity-50 h-9"
                                                    onClick={() => handleAcceptRequest(requestId)}
                                                    disabled={isProcessing}
                                                >
                                                    <Check className="w-3 h-3" />
                                                    {isProcessing ? 'Processing...' : 'Accept'}
                                                </GlassButton>
                                                <GlassButton
                                                    size="sm"
                                                    variant="ghost"
                                                    className="flex-1 text-xs rounded-xl bg-red-500/10 border-red-500/20 text-red-300 hover:bg-red-500/20 hover:border-red-500/30 disabled:opacity-50 h-9"
                                                    onClick={() => handleRejectRequest(requestId)}
                                                    disabled={isProcessing}
                                                >
                                                    <X className="w-3 h-3" />
                                                    {isProcessing ? 'Processing...' : 'Reject'}
                                                </GlassButton>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {hasMoreRequests && (
                        <div className="mt-8 flex justify-center">
                            <GlassButton
                                variant="ghost"
                                className="px-8 bg-white/5 border-white/10 text-white/70 hover:bg-white/10 rounded-xl gap-2"
                                onClick={handleLoadMoreRequests}
                                disabled={isLoadingMoreRequests}
                            >
                                {isLoadingMoreRequests ? (
                                    'Loading...'
                                ) : (
                                    <>
                                        <span>View More Requests</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </>
                                )}
                            </GlassButton>
                        </div>
                    )}
                </section>
            )}

            {/* Suggested Users Section */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 rounded-xl bg-brand-primary/20 text-brand-primary">
                        <UserPlus className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Suggested for you</h2>
                </div>

                {isRecommendLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-12 w-12 rounded-full bg-white/10 animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 w-32 bg-white/10 rounded animate-pulse" />
                                        <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                                    </div>
                                </div>
                                <div className="h-9 w-full bg-white/10 rounded-xl animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : recommendedUsers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {recommendedUsers.map((item) => (
                            <div
                                key={item.user.id}
                                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all group"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <StoryAvatar
                                        src={item.user.avatar_url || "/avatar-default.jpg"}
                                        alt={item.user.name || "User"}
                                        className="h-12 w-12 shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className="text-base font-bold text-white truncate cursor-pointer hover:text-brand-primary transition-colors"
                                            onClick={() => router.push(`/users/${item.user.username}`)}
                                        >
                                            {item.user.name}
                                        </p>
                                        <p className="text-[10px] text-white/30 mt-1">Suggested for you</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <GlassButton
                                        size="sm"
                                        variant="ghost"
                                        className="flex-1 text-xs bg-brand-primary/20 border-brand-primary/30 text-brand-primary hover:bg-brand-primary/30 rounded-xl h-9"
                                        onClick={() => handleSendRequest(item.user.id)}
                                        disabled={processingIds.has(item.user.id)}
                                    >
                                        <UserPlus className="w-3.5 h-3.5" />
                                        {processingIds.has(item.user.id) ? 'Sending...' : 'Add Friend'}
                                    </GlassButton>
                                    <GlassButton
                                        size="sm"
                                        variant="ghost"
                                        className="flex-1 text-xs bg-white/5 border-white/10 text-white/70 hover:bg-white/10 rounded-xl h-9"
                                        onClick={() => openChat({
                                            recipientId: item.user.id,
                                            recipientName: item.user.name,
                                            recipientAvatar: item.user.avatar_url || "/avatar-default.jpg"
                                        })}
                                    >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        Message
                                    </GlassButton>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                        <p className="text-white/40">No suggestions available at the moment</p>
                    </div>
                )}
            </section>
        </div>
    )
}
