"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MapPin, Calendar, Heart, MessageSquare, Send, ArrowLeft, Pencil, Edit, Share2, Play, LayoutGrid, Plus, Loader2 } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { GlassCard, GlassButton, GlassStatCard, GlassCardVariant } from "@/lib/components"
import { cn } from "@/lib/utils"
import { User, FriendshipStatus } from "@/types/user.type"
import { ProfileSkeleton } from "@/components/skeleton"
import { EditProfileModal } from "@/components/profile/EditProfileModal"
import { FriendListModal } from "@/components/profile/FriendListModal"
import { CreateReelModal } from "@/components/profile/CreateReelModal"
import { getFriendsService, getMutualFriendsService, getCountFriendsService } from "@/services/friend.service"
import { getMyReelsService, getUserReelsService } from "@/services/reel.service"
import { useReelContext } from "@/contexts/ReelContext"
import { Reel } from "@/apis/reel.api"

interface Post {
    id: number
    image: string
    likes: number
    comments: number
    views: number
}

interface ProfileContentProps {
    userProfile: User | null;
    isInitialLoading: boolean;
    isOwnProfile: boolean;
    isLoading?: boolean;
    isStartingChat?: boolean;
    buttonConfig?: {
        text: string;
        onClick?: () => void;
        disabled: boolean;
        className: string;
    };
    handleAcceptRequest?: () => void;
    handleRejectRequest?: () => void;
    handleStartChat?: () => void;
    onProfileUpdate: (user: User) => void;
}

export function ProfileContent({
    userProfile,
    isInitialLoading,
    isOwnProfile,
    isLoading,
    isStartingChat,
    buttonConfig,
    handleAcceptRequest,
    handleRejectRequest,
    handleStartChat,
    onProfileUpdate
}: ProfileContentProps) {
    const router = useRouter()
    const { setReelData } = useReelContext()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [initialEditField, setInitialEditField] = useState<'bio' | 'birthday' | 'location' | null>(null)
    const [isFriendModalOpen, setIsFriendModalOpen] = useState(false)
    const [friendModalType, setFriendModalType] = useState<"friends" | "mutual">("friends")
    const [friendsCount, setFriendsCount] = useState(0)
    const [mutualCount, setMutualCount] = useState(0)
    const [activeContentTab, setActiveContentTab] = useState<"posts" | "reels">("posts")
    const [isCreateReelModalOpen, setIsCreateReelModalOpen] = useState(false)

    // Reels state
    const [reels, setReels] = useState<Reel[]>([])
    const [reelsLoading, setReelsLoading] = useState(false)
    const [reelsCursor, setReelsCursor] = useState<string | undefined>(undefined)
    const [reelsHasMore, setReelsHasMore] = useState(true)
    const [reelsInitialLoaded, setReelsInitialLoaded] = useState(false)
    const observerRef = useRef<IntersectionObserver | null>(null)
    const loadMoreRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const fetchCounts = async () => {
            if (!userProfile?.id) return
            try {
                const res = await getCountFriendsService(userProfile.id)
                if (res.success) {
                    setFriendsCount(res.data.total_friends)
                    setMutualCount(res.data.mutual_friends)
                }
            } catch (error) {
                console.error("Error fetching friend counts:", error)
            }
        }
        fetchCounts()
    }, [userProfile?.id])

    // Fetch reels
    const fetchReels = useCallback(async (cursor?: string) => {
        if (!userProfile?.id || reelsLoading) return
        setReelsLoading(true)
        try {
            const res = isOwnProfile
                ? await getMyReelsService(cursor)
                : await getUserReelsService(userProfile.id, cursor)

            if (res.success) {
                const { items, nextCursor, hasMore } = res.data
                setReels(prev => cursor ? [...prev, ...items] : items)
                setReelsCursor(nextCursor || undefined)
                setReelsHasMore(hasMore)
            }
        } catch (error) {
            console.error("Error fetching reels:", error)
        } finally {
            setReelsLoading(false)
            setReelsInitialLoaded(true)
        }
    }, [userProfile?.id, isOwnProfile, reelsLoading])

    // Fetch reels when switching to reels tab
    useEffect(() => {
        if (activeContentTab === "reels" && !reelsInitialLoaded && userProfile?.id) {
            fetchReels()
        }
    }, [activeContentTab, reelsInitialLoaded, userProfile?.id])

    // Infinite scroll observer
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect()

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && reelsHasMore && !reelsLoading) {
                fetchReels(reelsCursor)
            }
        }, { threshold: 0.1 })

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current)
        }

        return () => observerRef.current?.disconnect()
    }, [reelsCursor, reelsHasMore, reelsLoading])

    // Mock stats
    const userStats = { followers: 1250, following: 450, posts: 42 }
    const userPosts: Post[] = [
        { id: 1, image: "/bg3.jpg", likes: 298, comments: 38, views: 4000000 },
        { id: 2, image: "/bg3.jpg", likes: 412, comments: 56, views: 7100000 },
        { id: 3, image: "/bg3.jpg", likes: 567, comments: 89, views: 2600000 },
        { id: 4, image: "/bg2.jpg", likes: 234, comments: 29, views: 1500000 },
        { id: 5, image: "/bg3.jpg", likes: 489, comments: 72, views: 1400000 },
        { id: 6, image: "/bg1.jpg", likes: 345, comments: 48, views: 1800000 },
    ]

    if (isInitialLoading) return <ProfileSkeleton />

    return (
        <>
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="mb-4">
                    <GlassButton variant="ghost" size="sm" className="text-white/70 hover:text-white flex items-center gap-2" onClick={() => typeof window !== 'undefined' && window.history.back()}>
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </GlassButton>
                </div>

                <GlassCard variant="lg" className="h-72 md:h-96 rounded-3xl overflow-hidden mb-0 p-0">
                    <Image src="/bg12.jpg" alt="Profile cover" fill className="object-cover h-[50%]" />
                </GlassCard>

                <GlassCardVariant className="relative -mt-37 md:-mt-57 mb-8 p-4 md:p-8 !rounded-b-3xl">
                    <div className="flex flex-row items-end gap-4 md:gap-6">
                        <div className="shrink-0">
                            <Avatar className="h-20 w-20 md:h-40 md:w-40 ring-4 ring-white/20 shadow-2xl">
                                <AvatarImage src={userProfile?.avatar_url || "/avatar-default.jpg"} alt={userProfile?.name || ""} />
                                <AvatarFallback className="text-xl md:text-4xl bg-linear-to-br from-brand-primary to-brand-primary-dark">{userProfile?.name?.[0] || ""}</AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="flex-1 text-left">
                            <div className="mb-3 md:mb-4">
                                <h1 className="text-xl md:text-3xl font-bold text-white">{userProfile?.name || ""}</h1>
                                <p className="text-brand-primary text-sm md:text-lg">{userProfile?.username || ""}</p>
                            </div>

                            <div className="flex gap-2 items-center flex-wrap">
                                {isOwnProfile ? (
                                    <GlassButton onClick={() => setIsEditModalOpen(true)} className="bg-white/10 hover:bg-white/20 text-xs md:text-base flex items-center gap-2">
                                        <Edit className="w-4 h-4" />
                                        <span>Edit Profile</span>
                                    </GlassButton>
                                ) : (
                                    <>
                                        {userProfile?.friend_status === 'received_pending' ? (
                                            <>
                                                <GlassButton onClick={handleAcceptRequest} disabled={isLoading} className="bg-linear-to-r from-brand-primary to-brand-primary-dark text-xs md:text-base">
                                                    {isLoading ? 'Processing...' : 'Accept'}
                                                </GlassButton>
                                                <GlassButton onClick={handleRejectRequest} disabled={isLoading} className="bg-white/10 hover:bg-white/20 text-xs md:text-base">
                                                    {isLoading ? 'Processing...' : 'Reject'}
                                                </GlassButton>
                                            </>
                                        ) : (
                                            <GlassButton onClick={buttonConfig?.onClick} disabled={buttonConfig?.disabled} className={cn(buttonConfig?.className, "text-xs md:text-base")}>
                                                {buttonConfig?.text}
                                            </GlassButton>
                                        )}
                                        <GlassButton className="bg-white/10 hover:bg-white/20" title="Send message" onClick={handleStartChat} disabled={isStartingChat}>
                                            <Send className="w-4 h-4 md:w-6 md:h-6" />
                                        </GlassButton>
                                    </>
                                )}
                                <GlassButton className="bg-white/10 hover:bg-white/20" title="Share profile">
                                    <Share2 className="w-4 h-4 md:w-6 md:h-6" />
                                </GlassButton>
                            </div>
                        </div>
                    </div>
                </GlassCardVariant>

                <GlassCard variant="lg" className="mb-8">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-xl font-semibold text-white">Information</h2>
                                {isOwnProfile && (
                                    <button onClick={() => { setInitialEditField('bio'); setIsEditModalOpen(true); }} className="p-2 hover:bg-white/10 rounded-full text-brand-primary transition-colors flex items-center gap-2 text-xs font-semibold">
                                        <Pencil className="w-4 h-4" />
                                        <span>Edit Bio</span>
                                    </button>
                                )}
                            </div>
                            {userProfile?.bio && (
                                <p className="text-white/80 text-base leading-relaxed">{userProfile.bio}</p>
                            )}
                        </div>

                        <div className="flex flex-col items-start sm:flex-row sm:flex-wrap gap-3 sm:gap-4 text-sm text-white/70">
                            {userProfile?.user_location?.address && (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                                    <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
                                    <span className="flex-1">{userProfile.user_location.address}</span>
                                </div>
                            )}

                            {userProfile?.birthday && (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                                    <Calendar className="w-4 h-4 text-brand-primary" />
                                    <span>{new Date(userProfile.birthday).toLocaleDateString()}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                                <Calendar className="w-4 h-4 text-brand-primary" />
                                Joined {userProfile?.created_at?.slice(0, 4) || "recently"}
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <GlassStatCard label="Posts" value={userStats.posts.toString()} />
                    <GlassStatCard
                        label="Friends"
                        value={friendsCount.toString()}
                        onClick={() => { setFriendModalType("friends"); setIsFriendModalOpen(true); }}
                    />
                    <GlassStatCard
                        label="Mutual Friends"
                        value={mutualCount.toString()}
                        onClick={() => { setFriendModalType("mutual"); setIsFriendModalOpen(true); }}
                    />
                </div>

                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8 border-b border-white/10">
                        <div className="flex items-center gap-8">
                            <button
                                onClick={() => setActiveContentTab("posts")}
                                className={cn(
                                    "flex items-center gap-2 pb-4 text-sm font-semibold transition-all relative",
                                    activeContentTab === "posts" ? "text-white" : "text-white/40 hover:text-white/60"
                                )}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                <span>POSTS</span>
                                {activeContentTab === "posts" && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary shadow-[0_-2px_8px_rgba(var(--brand-primary-rgb),0.5)]" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveContentTab("reels")}
                                className={cn(
                                    "flex items-center gap-2 pb-4 text-sm font-semibold transition-all relative",
                                    activeContentTab === "reels" ? "text-white" : "text-white/40 hover:text-white/60"
                                )}
                            >
                                <Play className="w-4 h-4" />
                                <span>REELS</span>
                                {activeContentTab === "reels" && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary shadow-[0_-2px_8px_rgba(var(--brand-primary-rgb),0.5)]" />
                                )}
                            </button>
                        </div>

                        {isOwnProfile && activeContentTab === "reels" && (
                            <div className="pb-4">
                                <GlassButton
                                    size="sm"
                                    className="bg-linear-to-r from-brand-primary to-brand-primary-dark hover:shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.3)] transition-all duration-300 flex items-center gap-2 group py-1.5"
                                    onClick={() => setIsCreateReelModalOpen(true)}
                                >
                                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                                    <span className="text-xs font-bold">Create Reel</span>
                                </GlassButton>
                            </div>
                        )}
                    </div>

                    {activeContentTab === "posts" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userPosts.map((post) => (
                                <div key={post.id} className="group overflow-hidden cursor-pointer relative rounded-2xl h-64">
                                    <Image src={post.image} alt="Post" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-1 text-white bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-md"><Heart className="w-4 h-4 fill-current" />{post.likes}</div>
                                            <div className="flex items-center gap-1 text-white bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-md"><MessageSquare className="w-4 h-4" />{post.comments}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {reelsLoading && !reelsInitialLoaded ? (
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="rounded-2xl h-80 bg-white/5 animate-pulse" />
                                    ))}
                                </div>
                            ) : reels.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-white/40">
                                    <Play className="w-12 h-12 mb-4 opacity-30" />
                                    <p className="text-lg font-semibold">No reels yet</p>
                                    <p className="text-sm mt-1">Reels you create will appear here.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {reels.map((reel, index) => (
                                            <div
                                                key={reel.id}
                                                className="group overflow-hidden cursor-pointer relative rounded-2xl h-80"
                                                onClick={() => {
                                                    setReelData({
                                                        reels,
                                                        cursor: reelsCursor,
                                                        hasMore: reelsHasMore,
                                                        userId: isOwnProfile ? undefined : userProfile?.id,
                                                    })
                                                    router.push(isOwnProfile
                                                        ? `/reels?startIndex=${index}`
                                                        : `/reels?userId=${userProfile?.id}&startIndex=${index}`
                                                    )
                                                }}
                                            >
                                                <Image src={reel.thumbnail_url} alt={reel.caption || "Reel"} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    {reel.caption && (
                                                        <p className="text-white text-xs font-medium truncate mb-1.5">{reel.caption}</p>
                                                    )}
                                                    <div className="flex items-center gap-2 text-white/70 text-xs">
                                                        <Play className="w-3.5 h-3.5 fill-current" />
                                                        <span>{reel.music_name || "Original Audio"}</span>
                                                    </div>
                                                </div>
                                                <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white/80 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {Math.floor(reel.duration / 60)}:{String(Math.floor(reel.duration % 60)).padStart(2, '0')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Infinite scroll trigger */}
                                    {reelsHasMore && (
                                        <div ref={loadMoreRef} className="flex justify-center py-8">
                                            {reelsLoading && (
                                                <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            {userProfile && isOwnProfile && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    user={userProfile}
                    initialField={initialEditField}
                    onClose={() => {
                        setIsEditModalOpen(false)
                        setInitialEditField(null)
                    }}
                    onSuccess={onProfileUpdate}
                />
            )}

            {userProfile && (
                <FriendListModal
                    isOpen={isFriendModalOpen}
                    onClose={() => setIsFriendModalOpen(false)}
                    userId={userProfile.id}
                    isOwnProfile={isOwnProfile}
                    type={friendModalType}
                    title={friendModalType === "friends" ? "Friends" : "Mutual Friends"}
                />
            )}

            <CreateReelModal
                isOpen={isCreateReelModalOpen}
                onClose={() => setIsCreateReelModalOpen(false)}
                onSuccess={() => {
                    // Refresh reels list after creating a new reel
                    setReels([])
                    setReelsCursor(undefined)
                    setReelsHasMore(true)
                    setReelsInitialLoaded(false)
                    if (activeContentTab === "reels") {
                        fetchReels()
                    }
                }}
            />
        </>
    )
}
