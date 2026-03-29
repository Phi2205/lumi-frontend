"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ArrowLeft, Loader2, ChevronUp, ChevronDown, CheckCircle2, Play, AlertCircle } from "lucide-react"
import { Reel } from "@/apis/reel.api"
import { ReelPlayer } from "./ReelPlayer"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ReelViewerProps {
    /** Danh sách reels hiện tại */
    reels: Reel[]
    /** Gọi khi cần load thêm data */
    onLoadMore?: () => void
    /** Có còn data để load không */
    hasMore?: boolean
    /** Đang loading không */
    loading?: boolean
    /** Index reel bắt đầu (ví dụ click vào reel thứ 3 từ profile) */
    startIndex?: number
    /** Chế độ xem: discovery (sidebar) hoặc user (từ profile) */
    viewMode?: 'discovery' | 'user'
}

export function ReelViewer({
    reels,
    onLoadMore,
    hasMore = false,
    loading = false,
    startIndex = 0,
    viewMode = 'discovery',
}: ReelViewerProps) {
    console.log("reels", reels)
    const [activeIndex, setActiveIndex] = useState(startIndex)
    const [isGlobalMuted, setIsGlobalMuted] = useState(true)
    const [isReady, setIsReady] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const reelRefs = useRef<(HTMLDivElement | null)[]>([])

    const toggleGlobalMute = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setIsGlobalMuted(prev => !prev)
    }, [])

    const hasInitialScrolled = useRef(false)

    // Lần đầu load: Cuộn tới reel được chọn (theo ID hoặc Index)
    useEffect(() => {
        if (hasInitialScrolled.current) return;

        if (reels.length > 0 && typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search)
            const reelId = params.get("reel_id")
            let targetIndex = -1

            if (reelId) {
                targetIndex = reels.findIndex(r => r.id === reelId)
            } else if (startIndex > 0 && startIndex < reels.length) {
                targetIndex = startIndex
            }

            // Nếu tìm thấy reel mục tiêu, cuộn tới nó
            if (targetIndex !== -1) {
                // Nếu là reel đầu tiên, không cần cuộn dài và không cần ẩn
                if (targetIndex === 0) {
                    setIsReady(true)
                }

                setTimeout(() => {
                    if (reelRefs.current[targetIndex]) {
                        reelRefs.current[targetIndex]?.scrollIntoView({ behavior: 'auto' })
                        setActiveIndex(targetIndex)
                        // Một chút delay cho việc scroll hoàn tất trước khi hiện
                        setTimeout(() => setIsReady(true), 150)
                    }
                }, 100)

                // Cập nhật URL nếu thiếu reel_id
                if (!reelId) {
                    const url = new URL(window.location.href)
                    url.searchParams.set("reel_id", reels[targetIndex].id)
                    window.history.replaceState({}, "", url.toString())
                }
                hasInitialScrolled.current = true
            } else if (!reelId && reels[0]) {
                // Mặc định là reel đầu tiên
                const url = new URL(window.location.href)
                url.searchParams.set("reel_id", reels[0].id)
                window.history.replaceState({}, "", url.toString())
                setIsReady(true)
                hasInitialScrolled.current = true
            }
        }
    }, [reels, startIndex])

    // Intersection Observer để phát hiện reel nào đang xem
    useEffect(() => {
        const currentContainer = containerRef.current;
        if (!currentContainer) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Check if element is mostly in view
                if (entry.isIntersecting) {
                    const indexStr = entry.target.getAttribute('data-index');
                    if (indexStr === null) return; // Ignore elements without data-index (like the end-of-feed message)

                    const index = Number(indexStr);
                    setActiveIndex(index);

                    // Update URL
                    const currentReel = reels[index];
                    if (currentReel && typeof window !== 'undefined') {
                        const url = new URL(window.location.href);
                        url.searchParams.set("reel_id", currentReel.id);
                        window.history.replaceState({}, "", url.toString());
                    }
                }
            });
        }, {
            root: currentContainer,
            threshold: 0.6 // Cần hiển thị > 60% để tính là active
        });

        reelRefs.current.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [reels]);

    // Khi gần cuối danh sách, gọi loadMore
    useEffect(() => {
        if (activeIndex >= reels.length - 2 && hasMore && !loading) {
            onLoadMore?.()
        }
    }, [activeIndex, reels.length, hasMore, loading, onLoadMore])

    const goToReel = useCallback((index: number) => {
        if (index < 0 || index >= reels.length) return
        reelRefs.current[index]?.scrollIntoView({ behavior: 'smooth' })
    }, [reels.length])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown" || e.key === "j") goToReel(activeIndex + 1)
            if (e.key === "ArrowUp" || e.key === "k") goToReel(activeIndex - 1)
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [activeIndex, goToReel])

    if (reels.length === 0 && !loading) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-2xl">
                    <CheckCircle2 className="w-10 h-10 text-brand-primary animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">
                    {viewMode === 'discovery' ? "You're All Caught Up!" : "No Reels Available"}
                </h3>
                <p className="text-white/40 text-base max-w-[320px] leading-relaxed font-medium">
                    {viewMode === 'discovery'
                        ? "We've shown you all the best recommendations for now. Check back soon for more amazing content!"
                        : "This creator hasn't shared any reels yet. Try exploring other profiles to find something fresh!"
                    }
                </p>
                <Link
                    href="/"
                    className="mt-10 px-10 py-4 rounded-2xl bg-brand-primary text-white font-bold hover:bg-brand-primary/90 transition-all active:scale-95 shadow-2xl shadow-brand-primary/20"
                >
                    Explore More
                </Link>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                "fixed inset-0 bg-transparent z-50 overflow-y-scroll snap-y snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-all duration-300",
                isReady ? "opacity-100 scale-100" : "opacity-0 scale-105"
            )}
        >
            {/* Nút quay lại */}
            <button
                onClick={() => window.history.back()}
                className="fixed top-5 left-5 z-[60] p-2.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all cursor-pointer"
            >
                <ArrowLeft className="w-5 h-5 text-white/80" />
            </button>

            {/* Reels list */}
            <div className="flex flex-col w-full relative">
                {reels.map((reel, index) => (
                    <div
                        key={reel.id}
                        ref={el => {
                            if (el) reelRefs.current[index] = el
                        }}
                        data-index={index}
                        className="w-full h-screen snap-start snap-always shrink-0"
                    >
                        <ReelPlayer
                            reel={reel}
                            isActive={index === activeIndex}
                            isAdjacent={Math.abs(index - activeIndex) <= 1}
                            isMuted={isGlobalMuted}
                            toggleMute={toggleGlobalMute}
                        />
                    </div>
                ))}

                {/* Loading khi đang tải thêm */}
                {loading && (
                    <div className="h-[20vh] w-full flex items-center justify-center snap-start shrink-0 text-brand-primary">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                )}

                {/* Kết thúc danh sách - End of feed message */}
                {!hasMore && reels.length > 0 && !loading && (
                    <div className="w-full h-screen snap-start snap-always shrink-0 flex flex-col items-center justify-center p-6 text-center">
                        <div className="max-w-[400px] flex flex-col items-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-brand-primary/20 rounded-full blur-2xl group-hover:bg-brand-primary/30 transition-all duration-500" />
                                <div className="w-24 h-24 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center relative shadow-2xl">
                                    <CheckCircle2 className="w-10 h-10 text-brand-primary animate-pulse" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-white tracking-tight">
                                    {viewMode === 'discovery' ? "You're All Caught Up!" : "That's All for Now!"}
                                </h3>
                                <p className="text-white/50 text-base font-medium leading-relaxed">
                                    {viewMode === 'discovery'
                                        ? "You've seen all the latest recommendations. Follow more friends or creators to keep your feed fresh!"
                                        : "You've reached the end of this user's reels. Check out other profiles or go back to Discovery!"
                                    }
                                </p>
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full">
                                <Link
                                    href="/"
                                    className="flex-1 flex items-center justify-center px-8 py-4 rounded-2xl bg-brand-primary text-white font-bold hover:bg-brand-primary/90 transition-all active:scale-95 shadow-xl shadow-brand-primary/20"
                                >
                                    {viewMode === 'discovery' ? "Explore More" : "Back to Feed"}
                                </Link>
                                {viewMode === 'user' && reels[0]?.user && (
                                    <Link
                                        href={`/users/${reels[0].user.username}`}
                                        className="flex-1 flex items-center justify-center px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all active:scale-95 backdrop-blur-md"
                                    >
                                        View Profile
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Swipe Notice (Invisible, functional through Touch Events) */}

            {/* Nút Navigation Lên/Xuống */}
            <div className="hidden sm:flex fixed right-5 top-1/2 -translate-y-1/2 z-[60] flex-col gap-4">
                <button
                    onClick={() => goToReel(activeIndex - 1)}
                    disabled={activeIndex <= 0}
                    className="p-3 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Previous reel"
                >
                    <ChevronUp className="w-6 h-6" />
                </button>
                <button
                    onClick={() => goToReel(activeIndex + 1)}
                    disabled={activeIndex >= reels.length - 1 && !hasMore}
                    className="p-3 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Next reel"
                >
                    <ChevronDown className="w-6 h-6" />
                </button>
            </div>

            {/* Số thứ tự */}
            <div className="fixed left-1/2 -translate-x-1/2 bottom-3 z-[60] text-[10px] text-white/30 font-medium bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full pointer-events-none">
                {activeIndex + 1} / {reels.length}
            </div>
        </div>
    )
}
