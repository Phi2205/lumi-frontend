"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2, X, MoreHorizontal, Heart, Share2 } from "lucide-react"
import { getPostById, likePost } from "@/services/post.service"
import type { Post as ApiPost, PostMedia as ApiMedia } from "@/apis/post.api"
import { getCachedPost } from "@/lib/post-cache"
import { StoryAvatar } from "@/components/ui/avatar"
import { formatTime } from "@/utils/format"
import { PostMediaCarousel } from "@/components/post/PostMediaCarousel"
import { CommentSection, CommentInput } from "@/components/post/CommentSection"
import { ShareModal } from "@/components/post/ShareModal"
import { Button } from "@/components/ui/button"
import { SharedPostPreview } from "@/components/post/PostCard"
import { cn } from "@/lib/utils"

export interface UI_Post {
    id: string
    user: {
        id: string
        name: string
        avatar_url: string
        username: string
        has_story: boolean
    }
    timestamp: string
    content: string
    media: ApiMedia[]
    likes: number
    comments: number
    shares: number
    has_liked?: boolean
    original_post_id?: string
    original_post?: UI_Post
}

function mapPost(post: ApiPost): UI_Post {
    return {
        id: post.id,
        user: {
            id: post.user?.id || "",
            name: post.user?.name || post.user?.username || "User",
            avatar_url: post.user?.avatar_url || "/avatar-default.jpg",
            username: post.user?.username || "",
            has_story: post.user?.has_story || false,
        },
        timestamp: post.created_at,
        content: post.content,
        media: post.post_media,
        likes: post.like_count,
        comments: post.comment_count,
        shares: post.share_count,
        has_liked: post.has_liked,
        original_post_id: post.original_post_id,
        original_post: post.original_post ? mapPost(post.original_post) : undefined,
    }
}

interface PostDetailViewProps {
    postId: string
    onClose?: () => void
    isModal?: boolean
}

export function PostDetailView({ postId, onClose, isModal = false }: PostDetailViewProps) {
    const router = useRouter()
    const pathname = usePathname()
    const cachedPost = getCachedPost(postId)
    const [post, setPost] = useState<UI_Post | null>(cachedPost ? mapPost(cachedPost) : null)
    const [isLoading, setIsLoading] = useState(!cachedPost)
    const [error, setError] = useState<string | null>(null)
    const [showShare, setShowShare] = useState(false)

    useEffect(() => {
        const handlePostUpdate = (e: any) => {
            const { id, has_liked, like_count, comment_count, share_count } = e.detail;
            if (post && post.id === id) {
                setPost(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        has_liked: has_liked !== undefined ? has_liked : prev.has_liked,
                        likes: like_count !== undefined ? like_count : prev.likes,
                        comments: comment_count !== undefined ? comment_count : prev.comments,
                        shares: share_count !== undefined ? share_count : prev.shares
                    };
                });
            }
        };

        window.addEventListener('postUpdate', handlePostUpdate);
        return () => window.removeEventListener('postUpdate', handlePostUpdate);
    }, [post]);

    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = ""
        }
    }, [])

    // If we're in a modal context, we should ensure scroll is restored if the path changes
    useEffect(() => {
        if (!isModal) return;

        const isPostPath = pathname.includes(`/p/${postId}`) || pathname.includes(`/v/${postId}`);
        if (!isPostPath) {
            document.body.style.overflow = "";
        }
    }, [pathname, postId, isModal])

    useEffect(() => {
        if (!postId) return
        const fetchPost = async () => {
            if (!post) setIsLoading(true)
            setError(null)
            try {
                const res = await getPostById(postId)
                if (res.success) {
                    setPost(mapPost(res.data))
                }
            } catch (err: any) {
                console.error("Failed to load post:", err)
                if (!post) setError("Không thể tải bài viết. Vui lòng thử lại sau.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchPost()
    }, [postId])

    const handleLike = () => {
        if (!post) return
        const newHasLiked = !post.has_liked
        const newLikes = post.likes + (post.has_liked ? -1 : 1)

        setPost({
            ...post,
            has_liked: newHasLiked,
            likes: newLikes,
        })

        likePost(post.id)

        window.dispatchEvent(new CustomEvent('postUpdate', {
            detail: {
                id: post.id,
                has_liked: newHasLiked,
                like_count: newLikes
            }
        }));
    }

    // If we're in a modal context, we should ensure scroll is restored/modal is hidden if the path changes
    if (isModal) {
        const isPostPath = pathname.includes(`/p/${postId}`) || pathname.includes(`/v/${postId}`);
        if (!isPostPath) return null;
    }

    return (
        <>
            <div
                className={cn(
                    "mt-5 fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-10",
                    showShare && "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
                )}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 animate-in fade-in duration-300"
                    onClick={onClose}
                />

                {/* Modal Container */}
                <div
                    className={cn(
                        "bg-black/60 backdrop-blur-sm border border-white/10 w-full max-w-[1200px] max-h-[90vh] h-full rounded-2xl md:rounded-3xl overflow-hidden pointer-events-auto flex flex-col md:flex-row shadow-2xl relative z-10 animate-in zoom-in-[0.98] fade-in duration-300 ease-out will-change-transform",
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button - Mobile */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-[210] p-2 bg-black/50 hover:bg-black/80 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md md:hidden"
                    >
                        <X size={20} />
                    </button>

                    {/* Close button - Desktop (Outside) */}
                    <X
                        size={24}
                        className="absolute top-4 right-[-48px] text-white/70 hover:text-white cursor-pointer hidden md:block"
                        onClick={onClose}
                    />

                    {/* Left Column - Media */}
                    <div className="w-full md:w-[60%] lg:w-[65%] bg-black/20 flex items-center justify-center h-[50vh] md:h-full relative select-none border-b md:border-b-0 md:border-r border-white/10">
                        {isLoading && !post ? (
                            <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                        ) : error && !post ? (
                            <div className="p-10 text-center">
                                <p className="text-white/40 italic">{error}</p>
                                <Button onClick={onClose} variant="ghost" className="mt-4 text-brand-primary">Quay lại</Button>
                            </div>
                        ) : post?.original_post ? (
                            <div className="w-full h-full p-4 md:p-8 overflow-y-auto scroll-glass flex items-center justify-center">
                                <div className="w-full max-w-lg">
                                    <p className="text-white/40 text-xs mb-3 flex items-center gap-2">
                                        <Share2 size={12} />
                                        Đã chia sẻ một bài viết
                                    </p>
                                    <SharedPostPreview post={post.original_post as any} />
                                </div>
                            </div>
                        ) : post?.media && post.media.length > 0 ? (
                            <PostMediaCarousel
                                media={post.media}
                                aspectRatio="h-full w-full"
                                className="space-y-0"
                            />
                        ) : (
                            <div className="p-10 text-center">
                                <p className="text-white/40 italic">{post?.content}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Details */}
                    <div className="flex-1 flex flex-col bg-white/[0.03] border-l border-white/10 h-full relative overflow-hidden">
                        {post && (
                            <>
                                {/* Header */}
                                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => {
                                                if (onClose) onClose()
                                                router.push(`/users/${post.user.username}`)
                                            }}
                                        >
                                            <StoryAvatar className="h-10 w-10" src={post.user.avatar_url} alt={post.user.name} hasStory={post.user.has_story} isSeen={false} username={post.user.username} />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1">
                                                <span
                                                    className="font-bold text-white text-[14px] hover:underline cursor-pointer"
                                                    onClick={() => {
                                                        if (onClose) onClose()
                                                        router.push(`/users/${post.user.username}`)
                                                    }}
                                                >
                                                    {post.user.name}
                                                </span>
                                                {/* <span className="text-white/40 text-[14px]">·</span> */}
                                                {/* <span className="text-blue-500 font-bold text-[14px] hover:text-white cursor-pointer">Follow</span> */}
                                            </div>
                                            <span className="text-[12px] text-white/40 leading-none mt-0.5 font-medium">{formatTime(post.timestamp)}</span>
                                        </div>
                                    </div>
                                    <button className="text-white/70 hover:text-white transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                {/* Scrollable Comments/Content Section */}
                                <div className="flex-1 overflow-y-auto scroll-glass">
                                    {/* Post Content Area */}
                                    {post.content && post.content.trim() !== "" && (
                                        <>
                                            <div className="px-4 pt-2 pb-4">
                                                <p className="text-white text-[15px] leading-relaxed whitespace-pre-wrap selection:bg-brand-primary/30">
                                                    {post.content}
                                                </p>
                                            </div>

                                            {/* Divider Line */}
                                            <div className="border-t border-white/10 mx-4" />
                                        </>
                                    )}

                                    {/* Comment Filter/Header */}
                                    {/* <div className="px-4 py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-white/50 hover:text-white/80 transition-colors cursor-pointer group">
                                            <span className="text-[13px] font-bold">Phù hợp nhất</span>
                                            <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div> */}

                                    <div className="px-4 pb-4">
                                        <style>{`.comment-no-scroll .overflow-y-auto { max-height: none !important; }`}</style>
                                        <div className="comment-no-scroll">
                                            <CommentSection
                                                postId={post.id}
                                                showInput={false}
                                                showBorder={false}
                                                showBackground={false}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Actions & Input Footer */}
                                <div className="px-4 py-3 border-t border-white/10 bg-transparent shrink-0">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-5">
                                            <button onClick={handleLike} className={cn("transition-all hover:scale-110 active:scale-95 cursor-pointer", post.has_liked ? "text-red-500" : "text-white hover:text-white/70")}>
                                                <Heart size={26} fill={post.has_liked ? "currentColor" : "none"} strokeWidth={2.5} />
                                            </button>
                                            <button onClick={() => setShowShare(true)} className="text-white hover:text-green-400 transition-all hover:scale-110 active:scale-95 cursor-pointer">
                                                <Share2 size={26} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="font-bold text-white text-[14px]">
                                            {post.likes.toLocaleString()} likes
                                        </div>
                                        <span className="text-white/20 text-[10px]">·</span>
                                        <div className="text-white/60 text-[14px]">
                                            {post.comments.toLocaleString()} comments
                                        </div>
                                        <span className="text-white/20 text-[10px]">·</span>
                                        <div className="text-white/60 text-[14px]">
                                            {post.shares.toLocaleString()} shares
                                        </div>
                                    </div>
                                    <div className="text-white/30 text-[10px] uppercase tracking-wider mb-2 font-semibold">
                                        {new Date(post.timestamp).toLocaleDateString()}
                                    </div>

                                    <div className="pt-2">
                                        <CommentInput postId={post.id} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showShare && post && (
                <ShareModal
                    post={post as any}
                    onClose={() => setShowShare(false)}
                    onShared={onClose}
                />
            )}

            <style jsx global>{`
        .scroll-glass::-webkit-scrollbar {
          width: 6px;
        }
        .scroll-glass::-webkit-scrollbar-track {
          background: transparent;
        }
        .scroll-glass::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .scroll-glass::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
        </>
    )
}
