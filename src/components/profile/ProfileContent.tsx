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
import { getPostsByMe, getPostsByUserId } from "@/services/post.service"
import { useReelContext } from "@/contexts/ReelContext"
import { Reel } from "@/apis/reel.api"
import { Post as ApiPost } from "@/apis/post.api"
import { FriendActionButton } from "./FriendActionButton"
import { setCachedPost } from "@/lib/post-cache"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"

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
    handleCancelRequest?: () => void;
    handleAddFriend?: () => void;
    handleDeleteFriend?: () => void;
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
    handleCancelRequest,
    handleAddFriend,
    handleDeleteFriend,
    handleStartChat,
    onProfileUpdate
}: ProfileContentProps) {
    const { t } = useTranslation()
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

    // Posts state
    const [posts, setPosts] = useState<ApiPost[]>([])
    const [postsLoading, setPostsLoading] = useState(false)
    const [postsCursor, setPostsCursor] = useState<string | undefined>(undefined)
    const [postsHasMore, setPostsHasMore] = useState(true)
    const [postsInitialLoaded, setPostsInitialLoaded] = useState(false)

    // Reels state
    const [reels, setReels] = useState<Reel[]>([])
    const [reelsLoading, setReelsLoading] = useState(false)
    const [reelsCursor, setReelsCursor] = useState<string | undefined>(undefined)
    const [reelsHasMore, setReelsHasMore] = useState(true)
    const [reelsInitialLoaded, setReelsInitialLoaded] = useState(false)
    const postsObserverRef = useRef<IntersectionObserver | null>(null)
    const reelsObserverRef = useRef<IntersectionObserver | null>(null)
    const loadMorePostsRef = useRef<HTMLDivElement | null>(null)
    const loadMoreReelsRef = useRef<HTMLDivElement | null>(null)

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

    // Fetch posts
    const fetchPosts = useCallback(async (cursor?: string) => {
        if (!userProfile?.id || postsLoading) return
        setPostsLoading(true)
        try {
            const res = isOwnProfile
                ? await getPostsByMe(cursor)
                : await getPostsByUserId(userProfile.id, cursor)

            if (res.success) {
                const { items, nextCursor } = res.data
                setPosts(prev => cursor ? [...prev, ...items] : items)
                setPostsCursor(nextCursor || undefined)
                setPostsHasMore(!!nextCursor)
            }
        } catch (error) {
            console.error("Error fetching posts:", error)
        } finally {
            setPostsLoading(false)
            setPostsInitialLoaded(true)
        }
    }, [userProfile?.id, isOwnProfile, postsLoading])

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

    // Fetch posts when component mounts or user changes
    useEffect(() => {
        if (userProfile?.id) {
            setPosts([])
            setPostsCursor(undefined)
            setPostsHasMore(true)
            setPostsInitialLoaded(false)
            fetchPosts()
        }
    }, [userProfile?.id])

    // Fetch reels when switching to reels tab
    useEffect(() => {
        if (activeContentTab === "reels" && !reelsInitialLoaded && userProfile?.id) {
            fetchReels()
        }
    }, [activeContentTab, reelsInitialLoaded, userProfile?.id])

    // Infinite scroll observer for posts
    useEffect(() => {
        if (postsObserverRef.current) postsObserverRef.current.disconnect()

        postsObserverRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && postsHasMore && !postsLoading) {
                fetchPosts(postsCursor)
            }
        }, { threshold: 0.1 })

        if (loadMorePostsRef.current) {
            postsObserverRef.current.observe(loadMorePostsRef.current)
        }

        return () => postsObserverRef.current?.disconnect()
    }, [postsCursor, postsHasMore, postsLoading, fetchPosts])

    useEffect(() => {
        const handlePostUpdate = (e: any) => {
            const { id, has_liked, like_count, comment_count, share_count } = e.detail;
            setPosts(prev => prev.map(p => {
                if (p.id === id) {
                    return {
                        ...p,
                        has_liked: has_liked !== undefined ? has_liked : p.has_liked,
                        like_count: like_count !== undefined ? like_count : p.like_count,
                        comment_count: comment_count !== undefined ? comment_count : p.comment_count,
                        share_count: share_count !== undefined ? share_count : p.share_count
                    };
                }
                return p;
            }));
        };

        window.addEventListener('postUpdate', handlePostUpdate);
        return () => window.removeEventListener('postUpdate', handlePostUpdate);
    }, []);

    // Infinite scroll observer for reels
    useEffect(() => {
        if (reelsObserverRef.current) reelsObserverRef.current.disconnect()

        reelsObserverRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && reelsHasMore && !reelsLoading) {
                fetchReels(reelsCursor)
            }
        }, { threshold: 0.1 })

        if (loadMoreReelsRef.current) {
            reelsObserverRef.current.observe(loadMoreReelsRef.current)
        }

        return () => reelsObserverRef.current?.disconnect()
    }, [reelsCursor, reelsHasMore, reelsLoading, fetchReels])

    // Mock stats
    const userStats = { followers: 1250, following: 450, posts: userProfile?.post_count || 0 }

    if (isInitialLoading) return <ProfileSkeleton />

    return (
        <>
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="mb-4">
                    <GlassButton variant="ghost" size="sm" className="text-white/70 hover:text-white flex items-center gap-2" onClick={() => typeof window !== 'undefined' && window.history.back()}>
                        <ArrowLeft className="w-4 h-4" />
                        <span>{t('profile.back')}</span>
                    </GlassButton>
                </div>

                <GlassCard variant="lg" className="h-72 md:h-96 rounded-3xl overflow-hidden mb-0 p-0">
                    <Image src="/bg12.jpg" alt="Profile cover" fill className="object-cover h-[50%]" />
                </GlassCard>

                <GlassCardVariant className="relative -mt-37 md:-mt-57 mb-8 p-4 md:p-8 !rounded-b-3xl !overflow-visible">
                    <div className="flex flex-row items-end gap-4 md:gap-6 !overflow-visible">
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
                                        <span>{t('profile.edit_profile')}</span>
                                    </GlassButton>
                                ) : (
                                    <>
                                        <FriendActionButton
                                            status={userProfile?.friend_status}
                                            name={userProfile?.name || ""}
                                            onAddFriend={handleAddFriend || (() => { })}
                                            onUnfriend={handleDeleteFriend || (() => { })}
                                            onCancelRequest={handleCancelRequest || (() => { })}
                                            onAcceptRequest={handleAcceptRequest || (() => { })}
                                            isLoading={isLoading || false}
                                            className="text-xs md:text-base"
                                        />
                                        <GlassButton className="bg-white/10 hover:bg-white/20" title={t('profile.send_message')} onClick={handleStartChat} disabled={isStartingChat}>
                                            <Send className="w-4 h-4 md:w-6 md:h-6" />
                                        </GlassButton>
                                    </>
                                )}
                                <GlassButton className="bg-white/10 hover:bg-white/20" title={t('profile.share_profile')}>
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
                                <h2 className="text-xl font-semibold text-white">{t('profile.information')}</h2>
                                {isOwnProfile && (
                                    <button onClick={() => { setInitialEditField('bio'); setIsEditModalOpen(true); }} className="p-2 hover:bg-white/10 rounded-full text-brand-primary transition-colors flex items-center gap-2 text-xs font-semibold">
                                        <Pencil className="w-4 h-4" />
                                        <span>{t('profile.edit_bio')}</span>
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
                                {t('profile.joined', { year: userProfile?.created_at?.slice(0, 4) || "recently" })}
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <div className={cn("grid gap-4 mb-8", isOwnProfile ? "grid-cols-2" : "grid-cols-3")}>
                    <GlassStatCard label={t('profile.posts')} value={userStats.posts.toString()} />
                    <GlassStatCard
                        label={t('profile.friends')}
                        value={friendsCount.toString()}
                        onClick={() => { setFriendModalType("friends"); setIsFriendModalOpen(true); }}
                    />
                    {!isOwnProfile && (
                        <GlassStatCard
                            label={t('profile.mutual_friends')}
                            value={mutualCount.toString()}
                            onClick={() => { setFriendModalType("mutual"); setIsFriendModalOpen(true); }}
                        />
                    )}
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
                                <span>{t('profile.posts').toUpperCase()}</span>
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
                                <span>{t('common.reels').toUpperCase()}</span>
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
                                    <span className="text-xs font-bold">{t('profile.create_reel')}</span>
                                </GlassButton>
                            </div>
                        )}
                    </div>

                    {activeContentTab === "posts" ? (
                        <>
                            {postsLoading && !postsInitialLoaded ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="rounded-2xl h-64 bg-white/5 animate-pulse" />
                                    ))}
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-white/40">
                                    <LayoutGrid className="w-12 h-12 mb-4 opacity-30" />
                                    <p className="text-lg font-semibold">{t('profile.no_posts')}</p>
                                    <p className="text-sm mt-1">{t('profile.posts_appear_here')}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-3 gap-0.5 md:gap-4">
                                        {posts.map((post) => (
                                            <div
                                                key={post.id}
                                                className="group overflow-hidden cursor-pointer relative aspect-[3/4] rounded-sm md:rounded-2xl bg-white/5"
                                                onClick={() => {
                                                    setCachedPost(post.id, post);
                                                    router.push(`/p/${post.id}`, { scroll: false });
                                                }}
                                            >
                                                {post.post_media?.[0]?.media_url ? (
                                                    <>
                                                        <Image
                                                            src={post.post_media[0].media_type === 'video' ? post.post_media[0].media_url.replace('.mp4', '.jpg') : post.post_media[0].media_url}
                                                            alt="Post"
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                        {/* {post.post_media[0].media_type === 'video' && (
                                                            <div className="absolute top-2 right-2 z-10">
                                                                <Play className="w-4 h-4 text-white drop-shadow-lg" />
                                                            </div>
                                                        )} */}
                                                    </>
                                                ) : (
                                                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 p-4 text-center">
                                                        <span className="text-xs md:text-sm italic line-clamp-4">{post.content.slice(0, 80)}...</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 hidden md:flex">
                                                    <div className="flex gap-4">
                                                        <div className="flex items-center gap-1 text-white bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-md">
                                                            <Heart className="w-4 h-4 fill-current" />
                                                            {post.like_count}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-white bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-md">
                                                            <MessageSquare className="w-4 h-4" />
                                                            {post.comment_count}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Infinite scroll trigger for posts */}
                                    {postsHasMore && (
                                        <div ref={loadMorePostsRef} className="flex justify-center py-8">
                                            {postsLoading && (
                                                <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </>
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
                                    <p className="text-lg font-semibold">{t('profile.no_reels')}</p>
                                    <p className="text-sm mt-1">{t('profile.reels_appear_here')}</p>
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
                                                        userId: userProfile?.id,
                                                    })
                                                    router.push(`/reels?userId=${userProfile?.id}&startIndex=${index}&reel_id=${reel.id}`)
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
                                                        <span>{reel.music_name || t('profile.original_audio')}</span>
                                                    </div>
                                                </div>
                                                <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white/80 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {Math.floor(reel.duration / 60)}:{String(Math.floor(reel.duration % 60)).padStart(2, '0')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Infinite scroll trigger for reels */}
                                    {reelsHasMore && (
                                        <div ref={loadMoreReelsRef} className="flex justify-center py-8">
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
                    title={friendModalType === "friends" ? t('profile.friends') : t('profile.mutual_friends')}
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
