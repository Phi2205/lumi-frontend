"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ArrowLeft, Loader2, ChevronUp, ChevronDown } from "lucide-react"
import { Reel } from "@/apis/reel.api"
import { ReelPlayer } from "./ReelPlayer"
import Link from "next/link"

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
}

export function ReelViewer({
    reels,
    onLoadMore,
    hasMore = false,
    loading = false,
    startIndex = 0,
}: ReelViewerProps) {
    const [activeIndex, setActiveIndex] = useState(startIndex)
    const [isGlobalMuted, setIsGlobalMuted] = useState(true)
    const containerRef = useRef<HTMLDivElement>(null)
    const reelRefs = useRef<(HTMLDivElement | null)[]>([])

    const toggleGlobalMute = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setIsGlobalMuted(prev => !prev)
    }, [])

    // Lần đầu load: Check nếu có reel_id trên URL thì cuộn tới nó
    useEffect(() => {
        if (reels.length > 0 && typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search)
            const reelId = params.get("reel_id")
            if (reelId) {
                const foundIndex = reels.findIndex(r => r.id === reelId)
                if (foundIndex !== -1) {
                    setTimeout(() => {
                        reelRefs.current[foundIndex]?.scrollIntoView({ behavior: 'auto' })
                    }, 50)
                }
            } else {
                const url = new URL(window.location.href)
                url.searchParams.set("reel_id", reels[0].id)
                window.history.replaceState({}, "", url.toString())
            }
        }
    }, [reels])

    // Intersection Observer để phát hiện reel nào đang xem
    useEffect(() => {
        const currentContainer = containerRef.current;
        if (!currentContainer) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Check if element is mostly in view
                if (entry.isIntersecting) {
                    const index = Number(entry.target.getAttribute('data-index'));
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
            <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-white/40">
                <p className="text-lg font-semibold">Không có reel nào</p>
                <Link href="/" className="mt-4 text-sm text-brand-primary hover:underline">
                    Quay lại trang chủ
                </Link>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 bg-black z-50 overflow-y-scroll snap-y snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
