"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { MapPin, Calendar, Heart, MessageSquare, Send, ArrowLeft, Pencil, Edit, Share2, Play, LayoutGrid, Plus, Loader2, Camera, Bell, Users } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback, StoryAvatar } from "@/components/ui/avatar"
import { GlassCard, GlassButton, GlassStatCard, GlassCardVariant } from "@/lib/components"
import { cn } from "@/lib/utils"
import { User, FriendshipStatus } from "@/types/user.type"
import { ProfileSkeleton } from "@/components/skeleton"
import { EditProfileModal } from "@/components/profile/EditProfileModal"
import { FriendListModal } from "@/components/profile/FriendListModal"
import { CreateReelModal } from "@/components/profile/CreateReelModal"
import { FriendsPreview } from "@/components/profile/FriendsPreview"
import { getFriendsService, getMutualFriendsService, getCountFriendsService, getFriendsUserIdService } from "@/services/friend.service"
import { getMyReelsService, getUserReelsService } from "@/services/reel.service"
import { getPostsByMe, getPostsByUserId } from "@/services/post.service"
import { useReelContext } from "@/contexts/ReelContext"
import { useAuth } from "@/contexts/AuthContext"
import { Reel } from "@/apis/reel.api"
import { Post as ApiPost } from "@/apis/post.api"
import { FriendActionButton } from "./FriendActionButton"
import { setCachedPost } from "@/lib/post-cache"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"
import { changeAvatar, changeCoverImage } from "@/services/user.service"
import { Notification, NotificationType } from "@/lib/components/notification"

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
    const searchParams = useSearchParams()
    const { setReelData } = useReelContext()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [initialEditField, setInitialEditField] = useState<'bio' | 'birthday' | 'location' | null>(null)
    const [isFriendModalOpen, setIsFriendModalOpen] = useState(false)
    const [friendModalType, setFriendModalType] = useState<"friends" | "mutual">("friends")
    const { updateUser } = useAuth()
    const [friendsCount, setFriendsCount] = useState(0)
    const [mutualCount, setMutualCount] = useState(0)
    const [friendsPreview, setFriendsPreview] = useState<User[]>([])
    const [mutualPreview, setMutualPreview] = useState<User[]>([])
    const [friendsLoading, setFriendsLoading] = useState(false)
    const [isAvatarUploading, setIsAvatarUploading] = useState(false)
    const [isCoverUploading, setIsCoverUploading] = useState(false)
    const [notification, setNotification] = useState<{
        isOpen: boolean;
        type: NotificationType;
        title: string;
        message: string;
        duration?: number;
    }>({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        duration: 3000
    })
    const fileInputRef = useRef<HTMLInputElement>(null)
    const coverInputRef = useRef<HTMLInputElement>(null)

    // Initialize tab from URL
    const [activeContentTab, setActiveContentTab] = useState<"posts" | "friends" | "reels">(() => {
        const tab = searchParams.get("tab")
        if (tab === "reels") return "reels"
        if (tab === "friends") return "friends"
        return "posts"
    })

    // Handle tab change and update URL
    const handleTabChange = (tab: "posts" | "friends" | "reels") => {
        setActiveContentTab(tab)
        const url = new URL(window.location.href)
        if (tab !== "posts") {
            url.searchParams.set("tab", tab)
        } else {
            url.searchParams.delete("tab")
        }
        router.replace(url.pathname + url.search, { scroll: false })
    }

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

    // Friends pagination state
    const [friendsPage, setFriendsPage] = useState(1)
    const [hasMoreFriends, setHasMoreFriends] = useState(true)
    const [isFriendsFetchingMore, setIsFriendsFetchingMore] = useState(false)
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsAvatarUploading(true)
        try {
            const updatedUser = await changeAvatar(file)
            if (userProfile) {
                onProfileUpdate({ ...userProfile, avatar_url: updatedUser.avatar_url })
            }
            updateUser(updatedUser)

            setNotification({
                isOpen: true,
                type: 'success',
                title: t('profile.avatar_updated'),
                message: t('profile.avatar_updated_desc', { defaultValue: 'Your profile picture has been updated.' }),
                duration: 4000
            })
        } catch (error: any) {
            console.error("Error updating avatar:", error)
            setNotification({
                isOpen: true,
                type: 'error',
                title: t('common.error', { defaultValue: 'Error' }),
                message: error.response?.data?.message || t('profile.avatar_update_failed', { defaultValue: 'Failed to update avatar. Please try again.' }),
                duration: 5000
            })
        } finally {
            setIsAvatarUploading(false)
            if (e.target) e.target.value = ''
        }
    }

    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsCoverUploading(true)
        try {
            const updatedUser = await changeCoverImage(file)
            if (userProfile) {
                onProfileUpdate({ ...userProfile, cover_image: updatedUser.cover_image })
            }
            updateUser(updatedUser)

            setNotification({
                isOpen: true,
                type: 'success',
                title: t('profile.cover_updated', { defaultValue: 'Cover Updated' }),
                message: t('profile.cover_description', { defaultValue: 'Your cover photo has been updated successfully.' }),
                duration: 4000
            })
        } catch (error: any) {
            console.error("Error updating cover:", error)
            setNotification({
                isOpen: true,
                type: 'error',
                title: t('common.error', { defaultValue: 'Error' }),
                message: error.response?.data?.message || t('profile.cover_update_failed', { defaultValue: 'Failed to update cover. Please try again.' }),
                duration: 5000
            })
        } finally {
            setIsCoverUploading(false)
            if (e.target) e.target.value = ''
        }
    }

    const fetchFriendData = async (page: number = 1) => {
        if (!userProfile?.id || activeContentTab !== "friends") return

        const isInitial = page === 1
        if (isInitial) {
            setFriendsLoading(true)
            setFriendsPreview([])
            setFriendsPage(1)
            setHasMoreFriends(true)
        } else {
            setIsFriendsFetchingMore(true)
        }

        try {
            if (isInitial) {
                // Fetch counts
                const countRes = await getCountFriendsService(userProfile.id)
                if (countRes.success) {
                    setFriendsCount(countRes.data.total_friends)
                    setMutualCount(countRes.data.mutual_friends)
                }
            }

            // Fetch list
            const limit = "10"
            const friendsRes = isOwnProfile
                ? await getFriendsService(limit, page.toString())
                : await getFriendsUserIdService(userProfile.id, limit, page.toString())

            if (friendsRes.success) {
                const newFriends = friendsRes.data || []
                setFriendsPreview(prev => isInitial ? newFriends : [...prev, ...newFriends])
                setHasMoreFriends(newFriends.length === parseInt(limit))
                setFriendsPage(page)
            }

            if (isInitial && !isOwnProfile) {
                const mutualRes = await getMutualFriendsService(userProfile.id)
                if (mutualRes.success) {
                    setMutualPreview((mutualRes.data || []).slice(0, 10))
                }
            }
        } catch (error) {
            console.error("Error fetching friend data:", error)
        } finally {
            if (isInitial) setFriendsLoading(false)
            else setIsFriendsFetchingMore(false)
        }
    }

    useEffect(() => {
        if (activeContentTab === "friends" && friendsPreview.length === 0) {
            fetchFriendData(1)
        }
    }, [userProfile?.id, activeContentTab])

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

        const handleReelCreated = (e: any) => {
            const newReel = e.detail;
            if (isOwnProfile) {
                setReels(prev => {
                    // Prevent duplicates
                    if (prev.find(r => r.id === newReel.id)) return prev;
                    return [newReel, ...prev];
                });
            }
        };

        window.addEventListener('postUpdate', handlePostUpdate);
        window.addEventListener('reelCreated', handleReelCreated);
        return () => {
            window.removeEventListener('postUpdate', handlePostUpdate);
            window.removeEventListener('reelCreated', handleReelCreated);
        };
    }, [isOwnProfile]);

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

    const handleShareProfile = () => {
        if (!userProfile?.username) return

        const baseUrl = window.location.origin
        const shareUrl = `${baseUrl}/users/${userProfile.username}`

        navigator.clipboard.writeText(shareUrl).then(() => {
            setNotification({
                isOpen: true,
                type: 'success',
                title: t('common.success'),
                message: t('profile.link_copied', { defaultValue: 'Profile link copied to clipboard!' }),
                duration: 3000
            })
        }).catch(err => {
            console.error('Failed to copy: ', err)
        })
    }

    return (
        <>
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="mb-4">
                    <GlassButton variant="ghost" size="sm" className="text-white/70 hover:text-white flex items-center gap-2" onClick={() => typeof window !== 'undefined' && window.history.back()}>
                        <ArrowLeft className="w-4 h-4" />
                        <span>{t('profile.back')}</span>
                    </GlassButton>
                </div>

                <input
                    type="file"
                    ref={coverInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleCoverChange}
                />

                <GlassCard variant="lg" className="h-72 md:h-96 rounded-3xl overflow-hidden mb-0 p-0 relative group/cover">
                    <Image
                        src={userProfile?.cover_image || "/bg12.jpg"}
                        alt="Profile cover"
                        fill
                        className={cn("object-cover h-[50%] transition-all duration-500", isCoverUploading && "opacity-50 blur-sm")}
                    />

                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                    {isOwnProfile && (
                        <div
                            className={cn(
                                "absolute top-4 right-4 z-10 opacity-100 sm:opacity-0 sm:group-hover/cover:opacity-100 transition-all duration-300",
                                isCoverUploading && "opacity-100"
                            )}
                        >
                            <GlassButton
                                size="sm"
                                onClick={() => !isCoverUploading && coverInputRef.current?.click()}
                                className="bg-black/30 hover:bg-black/40 text-white border-white/20 backdrop-blur-md flex items-center gap-2 py-2 px-4 shadow-xl pointer-events-auto"
                            >
                                {isCoverUploading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Camera className="w-4 h-4 border-none" />
                                        <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider">{t('profile.change_cover', { defaultValue: 'Change Cover' })}</span>
                                    </>
                                )}
                            </GlassButton>
                        </div>
                    )}
                </GlassCard>

                <GlassCardVariant className="relative -mt-37 md:-mt-57 mb-8 p-4 md:p-8 !rounded-b-3xl !overflow-visible">
                    <div className="flex flex-row items-end gap-4 md:gap-6 !overflow-visible">
                        <div className="shrink-0 relative group/avatar">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                            <div className={cn("relative", isOwnProfile && "cursor-pointer")} onClick={() => isOwnProfile && !isAvatarUploading && fileInputRef.current?.click()}>
                                <StoryAvatar
                                    src={userProfile?.avatar_url || "/avatar-default.jpg"}
                                    alt={userProfile?.name || ""}
                                    hasStory={userProfile?.has_story}
                                    username={!isOwnProfile && userProfile?.has_story ? userProfile?.username : undefined}
                                    storyRingSize="lg"
                                    isSeen={!userProfile?.has_unseen}
                                    className={cn("h-20 w-20 md:h-40 md:w-40 rounded-full ring-4 ring-white/20 shadow-2xl transition-all duration-300 group-hover/avatar:ring-brand-primary/40", isAvatarUploading && "opacity-50 blur-sm")}
                                />

                                {isOwnProfile && (
                                    <div className={cn(
                                        "absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-100 sm:opacity-0 sm:group-hover/avatar:opacity-100 transition-all duration-300 border-2 border-dashed border-white/40 m-1",
                                        isAvatarUploading && "opacity-100 bg-black/60"
                                    )}>
                                        {isAvatarUploading ? (
                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 text-white">
                                                <Camera className="w-6 h-6 md:w-8 md:h-8" />
                                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{t('profile.change')}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 text-left">
                            <div className="mb-3 md:mb-4 flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl md:text-3xl font-bold text-white">{userProfile?.name || ""}</h1>
                                    <p className="text-brand-primary text-sm md:text-lg">{userProfile?.username || ""}</p>
                                </div>
                                {/* <GlassButton
                                    size="sm"
                                    className="bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border-brand-primary/20"
                                    onClick={() => setNotification({
                                        isOpen: true,
                                        type: 'success',
                                        title: 'Test Notification',
                                        message: 'Thông báo hoạt động hoàn hảo!',
                                        duration: 5000
                                    })}
                                >
                                    <Bell className="w-4 h-4" />
                                    <span className="ml-2 hidden sm:inline">Test Notice</span>
                                </GlassButton> */}
                            </div>

                            <div className="flex gap-2 items-center flex-wrap">
                                {isOwnProfile ? (
                                    <GlassButton onClick={() => setIsEditModalOpen(true)} className="bg-white/10 hover:bg-white/20 text-xs md:text-base flex items-center gap-2 min-w-0">
                                        <Edit className="w-4 h-4 shrink-0" />
                                        <span className="truncate max-w-[80px] xs:max-w-[140px] md:max-w-none">{t('profile.edit_profile')}</span>
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
                                {/* <GlassButton
                                    className="bg-white/10 hover:bg-white/20"
                                    title={t('profile.share_profile')}
                                    onClick={handleShareProfile}
                                >
                                    <Share2 className="w-4 h-4 md:w-6 md:h-6" />
                                </GlassButton> */}
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



                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8 border-b border-white/10">
                        <div className="flex items-center gap-8">
                            <button
                                onClick={() => handleTabChange("posts")}
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
                                onClick={() => handleTabChange("friends")}
                                className={cn(
                                    "flex items-center gap-2 pb-4 text-sm font-semibold transition-all relative",
                                    activeContentTab === "friends" ? "text-white" : "text-white/40 hover:text-white/60"
                                )}
                            >
                                <Users className="w-4 h-4" />
                                <div className="flex items-center gap-1">
                                    <span>{t('profile.friends').toUpperCase()}</span>
                                </div>
                                {activeContentTab === "friends" && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary shadow-[0_-2px_8px_rgba(var(--brand-primary-rgb),0.5)]" />
                                )}
                            </button>
                            <button
                                onClick={() => handleTabChange("reels")}
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

                    </div>

                    {activeContentTab === "friends" ? (
                        <GlassCard className="p-8">
                            {friendsLoading ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 animate-pulse">
                                            <div className="w-16 h-16 rounded-lg bg-white/5" />
                                            <div className="flex flex-col gap-2">
                                                <div className="w-32 h-4 rounded bg-white/5" />
                                                <div className="w-20 h-3 rounded bg-white/5" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <FriendsPreview
                                    userId={userProfile?.id}
                                    friends={friendsPreview}
                                    mutualFriends={mutualPreview}
                                    totalCount={friendsCount}
                                    hasMore={hasMoreFriends}
                                    onLoadMore={() => fetchFriendData(friendsPage + 1)}
                                    isLoadingMore={isFriendsFetchingMore}
                                    onShowAll={() => { setFriendModalType("friends"); setIsFriendModalOpen(true); }}
                                    className="w-full"
                                    isOwnProfile={isOwnProfile}
                                />
                            )}
                        </GlassCard>
                    ) : activeContentTab === "posts" ? (
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
                            {isOwnProfile && (
                                <div className="flex justify-end mb-3">
                                    <GlassButton
                                        size="sm"
                                        onClick={() => setIsCreateReelModalOpen(true)}
                                        className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>{t('profile.create_reel')}</span>
                                    </GlassButton>
                                </div>
                            )}
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
                                                    // Sử dụng Dynamic Route mới: /reels/[userId]
                                                    router.push(`/reels/${userProfile?.id}?startIndex=${index}&reel_id=${reel.id}`)
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
            )
            }

            {
                userProfile && (
                    <FriendListModal
                        isOpen={isFriendModalOpen}
                        onClose={() => setIsFriendModalOpen(false)}
                        userId={userProfile.id}
                        isOwnProfile={isOwnProfile}
                        type={friendModalType}
                        title={friendModalType === "friends" ? t('profile.friends') : t('profile.mutual_friends')}
                    />
                )
            }

            <CreateReelModal
                isOpen={isCreateReelModalOpen}
                onClose={() => setIsCreateReelModalOpen(false)}
                onSuccess={() => {
                    // Switch to reels tab so the user is ready to see the newly uploaded reel
                    if (activeContentTab !== "reels") {
                        handleTabChange("reels")
                    }
                }}
            />

            <Notification
                isOpen={notification.isOpen}
                onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                duration={notification.duration}
            />
        </>
    )
}
