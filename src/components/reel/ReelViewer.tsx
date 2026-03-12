"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
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

    const toggleGlobalMute = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setIsGlobalMuted(prev => !prev)
    }, [])

    // Khi gần cuối danh sách, gọi loadMore
    useEffect(() => {
        if (activeIndex >= reels.length - 2 && hasMore && !loading) {
            onLoadMore?.()
        }
    }, [activeIndex, reels.length, hasMore, loading, onLoadMore])

    const goToReel = useCallback((index: number) => {
        if (index < 0 || index >= reels.length) return
        setActiveIndex(index)
    }, [reels.length])

    // Keyboard: ↑↓ hoặc j/k
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown" || e.key === "j") goToReel(activeIndex + 1)
            if (e.key === "ArrowUp" || e.key === "k") goToReel(activeIndex - 1)
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [activeIndex, goToReel])

    // Scroll wheel
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        let isScrolling = false
        let timeout: NodeJS.Timeout

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault()
            if (isScrolling) return
            isScrolling = true

            if (e.deltaY > 0) goToReel(activeIndex + 1)
            else if (e.deltaY < 0) goToReel(activeIndex - 1)

            timeout = setTimeout(() => { isScrolling = false }, 600)
        }

        container.addEventListener("wheel", handleWheel, { passive: false })
        return () => {
            container.removeEventListener("wheel", handleWheel)
            clearTimeout(timeout)
        }
    }, [activeIndex, goToReel])

    // Touch swipe
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        let startY = 0

        const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY }
        const onTouchEnd = (e: TouchEvent) => {
            const diff = startY - e.changedTouches[0].clientY
            if (Math.abs(diff) > 50) {
                if (diff > 0) goToReel(activeIndex + 1)
                else goToReel(activeIndex - 1)
            }
        }

        container.addEventListener("touchstart", onTouchStart, { passive: true })
        container.addEventListener("touchend", onTouchEnd, { passive: true })
        return () => {
            container.removeEventListener("touchstart", onTouchStart)
            container.removeEventListener("touchend", onTouchEnd)
        }
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
        <div ref={containerRef} className="fixed inset-0 bg-black z-50 overflow-hidden">
            {/* Nút quay lại */}
            <button
                onClick={() => window.history.back()}
                className="fixed top-5 left-5 z-[60] p-2.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all"
            >
                <ArrowLeft className="w-5 h-5 text-white/80" />
            </button>

            {/* Reels slides */}
            <div
                className="h-full w-full transition-transform duration-500 ease-out"
                style={{ transform: `translateY(-${activeIndex * 100}%)` }}
            >
                {reels.map((reel, index) => (
                    <ReelPlayer
                        key={reel.id}
                        reel={reel}
                        isActive={index === activeIndex}
                        isMuted={isGlobalMuted}
                        toggleMute={toggleGlobalMute}
                    />
                ))}

                {/* Loading khi đang tải thêm */}
                {loading && (
                    <div className="h-screen w-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                    </div>
                )}
            </div>

            {/* Số thứ tự */}
            <div className="fixed left-1/2 -translate-x-1/2 bottom-3 z-[60] text-[10px] text-white/30 font-medium bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                {activeIndex + 1} / {reels.length}
            </div>
        </div>
    )
}
