"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Play, Pause, Volume2, VolumeX, Heart, MessageCircle, Send, Music2, MoreHorizontal, ChevronDown } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Reel } from "@/apis/reel.api"
import { likeReelService, viewReelService } from "@/services/reel.service"
import { ReelCommentSection } from "./ReelCommentSection"
import { ReelSkeleton } from "@/components/skeleton"

// Hàm format số lượng 
const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
}

interface ReelPlayerProps {
    reel: Reel
    isActive: boolean
    isAdjacent?: boolean
    isMuted: boolean
    toggleMute: (e: React.MouseEvent) => void
}

export function ReelPlayer({ reel, isActive, isAdjacent = false, isMuted, toggleMute }: ReelPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [isLiked, setIsLiked] = useState(reel.has_liked)
    const [likeCount, setLikeCount] = useState(reel.like_count || 0)
    const [showFullCaption, setShowFullCaption] = useState(false)
    const [showPlayIcon, setShowPlayIcon] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const playIconTimeout = useRef<NodeJS.Timeout | null>(null)

    // Đồng bộ state khi nhận được Reel mới (đổi sang video khác) 
    useEffect(() => {
        setIsLiked(reel.has_liked)
        setLikeCount(reel.like_count || 0)
        setProgress(0)
        setShowFullCaption(false)
        setShowComments(false)
    }, [reel])

    // Auto play/pause khi active thay đổi
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        if (isActive) {
            video.currentTime = 0
            video.play().then(() => setIsPlaying(true)).catch(() => { })
        } else {
            video.pause()
            setIsPlaying(false)
        }
    }, [isActive])

    // Tracking xem Reel (View) - Tính là view ngay khi vừa hiện
    useEffect(() => {
        if (isActive) {
            viewReelService(reel.id).catch(err =>
                console.error(`Failed to mark reel ${reel.id} as seen:`, err)
            );
        }
    }, [isActive, reel.id]);

    // Theo dõi progress
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handleTimeUpdate = () => {
            if (video.duration) {
                setProgress((video.currentTime / video.duration) * 100)
            }
        }

        video.addEventListener("timeupdate", handleTimeUpdate)
        return () => video.removeEventListener("timeupdate", handleTimeUpdate)
    }, [])

    const togglePlay = () => {
        const video = videoRef.current
        if (!video) return

        if (video.paused) {
            video.play().then(() => setIsPlaying(true))
        } else {
            video.pause()
            setIsPlaying(false)
        }

        // Hiển thị icon play/pause rồi ẩn
        setShowPlayIcon(true)
        if (playIconTimeout.current) clearTimeout(playIconTimeout.current)
        playIconTimeout.current = setTimeout(() => setShowPlayIcon(false), 800)
    }

    const toggleLike = async (e: React.MouseEvent) => {
        e.stopPropagation()
        const previousLiked = isLiked
        const previousCount = likeCount

        // Optimistic UI updates
        setIsLiked(!previousLiked)
        setLikeCount(prev => previousLiked ? Math.max(0, prev - 1) : prev + 1)

        try {
            await likeReelService(reel.id)
        } catch (error) {
            // Revert on error
            setIsLiked(previousLiked)
            setLikeCount(previousCount)
            console.error("Failed to toggle like:", error)
        }
    }

    const captionTruncated = reel.caption && reel.caption.length > 60

    return (
        <div className="h-screen w-full relative flex items-center justify-center bg-transparent select-none sm:py-6">

            <div className="flex w-full h-full max-w-full justify-center relative z-10 transition-all duration-300 ease-in-out">
                {/* ─── Main Player Container ─── */}
                {/* Giới hạn max-width cho máy tính, điện thoại thì full màn */}
                <div className={`relative w-full h-full sm:max-w-[420px] md:max-w-[480px] lg:max-w-[600px] sm:rounded-[2rem] overflow-hidden bg-black flex items-center justify-center z-10 sm:ring-1 sm:ring-white/10 shadow-2xl flex-shrink-0 transition-all duration-300`}>

                    {/* ─── Video ─── */}
                    <video
                        ref={videoRef}
                        src={reel.streaming_url || reel.video_url}
                        className="absolute inset-0 w-full h-full object-contain cursor-pointer"
                        loop
                        muted={isMuted}
                        playsInline
                        preload={isActive || isAdjacent ? "auto" : "metadata"}
                        poster={reel.thumbnail_url}
                        onClick={togglePlay}
                        onLoadStart={() => setIsLoading(true)}
                        onLoadedData={() => setIsLoading(false)}
                        onWaiting={() => setIsLoading(true)}
                        onPlaying={() => setIsLoading(false)}
                    />

                    {/* ─── Skeleton ─── */}
                    {isLoading && (
                        <div className="absolute inset-0 z-20">
                            <ReelSkeleton />
                        </div>
                    )}

                    {/* ─── Play/Pause Icon trung tâm ─── */}
                    {showPlayIcon && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                            <div className="w-20 h-20 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center animate-in zoom-in-50 fade-in duration-150">
                                {isPlaying ? (
                                    <Pause className="w-9 h-9 text-white fill-current" />
                                ) : (
                                    <Play className="w-9 h-9 text-white fill-current ml-1" />
                                )}
                            </div>
                        </div>
                    )}

                    {/* ─── Progress bar ở trên cùng ─── */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10 z-30">
                        <div
                            className="h-full bg-white/80 transition-[width] duration-200 ease-linear"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* ─── Gradient dưới ─── */}
                    <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />

                    {/* ─── Info dưới trái ─── */}
                    <div className="absolute bottom-6 left-4 right-[72px] z-20">
                        {/* User info */}
                        <div className="flex items-center gap-2.5 mb-3">
                            <Link href={`/users/${reel.user?.id}`} className="shrink-0">
                                <Avatar className="h-10 w-10 ring-2 ring-white/30 hover:ring-white/80 transition-all">
                                    <AvatarImage src={reel.user?.avatar_url || "/avatar-default.jpg"} alt={reel.user?.name || ""} />
                                    <AvatarFallback className="bg-white/20 text-white text-xs font-bold">
                                        {reel.user?.name?.[0] || "?"}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                            <Link href={`/users/${reel.user?.id}`} className="text-white font-bold text-[14px] hover:text-white/80 transition-colors drop-shadow-md">
                                {reel.user?.name || "Unknown"}
                            </Link>
                            {reel.user_id !== reel.user?.id && (
                                <span className="text-white/80 text-[14px]">·</span>
                            )}
                            <button
                                className="text-white text-[13px] font-semibold border border-white/40 rounded-lg px-3 py-1 hover:bg-white/20 transition-colors backdrop-blur-sm cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Follow
                            </button>
                        </div>

                        {/* Caption */}
                        {reel.caption && (
                            <div className="mb-3">
                                <p className="text-white/95 text-[14px] leading-relaxed drop-shadow-md">
                                    {showFullCaption || !captionTruncated
                                        ? reel.caption
                                        : `${reel.caption.slice(0, 60)}... `}
                                    {captionTruncated && !showFullCaption && (
                                        <button
                                            className="text-white/70 font-bold hover:text-white transition-colors cursor-pointer"
                                            onClick={(e) => { e.stopPropagation(); setShowFullCaption(true) }}
                                        >
                                            See more
                                        </button>
                                    )}
                                </p>
                            </div>
                        )}

                        {/* Music */}
                        <div className="flex items-center gap-2 bg-black/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
                            <Music2 className="w-3.5 h-3.5 text-white animate-[spin_3s_linear_infinite]" />
                            <p className="text-white text-[13px] truncate max-w-[180px] font-medium">
                                {reel.music_name || "Original Audio"}
                            </p>
                        </div>
                    </div>

                    {/* ─── Nút bấm bên phải ─── */}
                    <div className="absolute right-3 bottom-8 z-20 flex flex-col items-center gap-6">
                        {/* Like */}
                        <button
                            onClick={toggleLike}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
                            ${isLiked ? "bg-red-500/20" : "bg-black/20 hover:bg-black/40 backdrop-blur-sm"}`}
                            >
                                <Heart className={`w-6 h-6 transition-all duration-200 
                                ${isLiked
                                        ? "text-red-500 fill-red-500 scale-110"
                                        : "text-white group-hover:scale-110"
                                    }`}
                                />
                            </div>
                            <span className="text-white text-[12px] font-bold drop-shadow-md">
                                {formatCount(likeCount)}
                            </span>
                        </button>

                        {/* Comment */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowComments(prev => !prev)
                            }}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all">
                                <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="text-white text-[12px] font-bold drop-shadow-md">
                                {formatCount(reel.comment_count || 0)}
                            </span>
                        </button>

                        {/* Share */}
                        <button
                            onClick={(e) => e.stopPropagation()}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all">
                                <Send className="w-5 h-5 text-white group-hover:scale-110 transition-transform -rotate-12" />
                            </div>
                            <span className="text-white text-[12px] font-bold drop-shadow-md">
                                {formatCount(reel.share_count || 0)}
                            </span>
                        </button>

                        {/* More */}
                        <button
                            onClick={(e) => e.stopPropagation()}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all">
                                <MoreHorizontal className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                            </div>
                        </button>

                        {/* Album / Music disc */}
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 mt-2 shadow-lg relative group flex items-center justify-center bg-zinc-900 cursor-pointer hover:border-white/60 transition-colors">
                            <img
                                src={reel.user?.avatar_url || "/avatar-default.jpg"}
                                alt="music"
                                className={`w-6 h-6 rounded-full object-cover ${isPlaying ? "animate-[spin_4s_linear_infinite]" : ""}`}
                            />
                        </div>
                    </div>

                    {/* ─── Nút âm lượng ─── */}
                    <button
                        onClick={toggleMute}
                        className="absolute top-6 right-4 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-all border border-white/10 cursor-pointer"
                    >
                        {isMuted ? (
                            <VolumeX className="w-5 h-5 text-white/80" />
                        ) : (
                            <Volume2 className="w-5 h-5 text-white" />
                        )}
                    </button>
                </div>

                {/* ─── Comments Panel (Slide out right) ─── */}
                <div
                    className={`absolute right-0 bottom-0 top-0 sm:relative w-full h-full transition-all duration-300 ease-in-out sm:rounded-[2rem] overflow-hidden z-30 shadow-2xl flex-shrink-0
                        ${showComments ? "translate-x-0 opacity-100 sm:w-[400px] sm:ml-4 pointer-events-auto" : "translate-x-full sm:translate-x-0 sm:w-0 sm:ml-0 opacity-0 pointer-events-none"} 
                    `}
                >
                    {showComments && <ReelCommentSection reelId={reel.id} onClose={() => setShowComments(false)} />}
                </div>
            </div>
        </div>
    )
}
