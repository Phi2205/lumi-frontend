"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Reel } from "@/apis/reel.api"
import { getUserReelsService } from "@/services/reel.service"
import { useReelContext } from "@/contexts/ReelContext"
import { ReelViewer } from "./ReelViewer"
import { ReelSkeleton } from "@/components/skeleton"

interface UserReelsFeedProps {
    userId: string
    startIndex?: number
    initialReelId?: string
}

export function UserReelsFeed({ userId, startIndex = 0, initialReelId }: UserReelsFeedProps) {
    const { data: contextData, consumeReelData } = useReelContext()

    // Khởi tạo state đồng bộ từ contextData để tránh skeleton flash
    const [reels, setReels] = useState<Reel[]>(() => {
        return (contextData && contextData.userId === userId) ? contextData.reels : []
    })
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(() => {
        return (contextData && contextData.userId === userId) ? contextData.hasMore : true
    })
    const [initialLoaded, setInitialLoaded] = useState(() => {
        return (contextData && contextData.userId === userId && contextData.reels.length > 0)
    })
    const [isViewerReady, setIsViewerReady] = useState(false)

    const cursorRef = useRef<string | undefined>(
        (contextData && contextData.userId === userId) ? contextData.cursor : undefined
    )
    const loadingRef = useRef(false)

    const fetchReels = useCallback(async (cursor?: string, isAppend: boolean = false) => {
        if (!userId || loadingRef.current) return
        loadingRef.current = true
        setLoading(true)

        try {
            const currentCursor = cursor || ""
            const limit = 12
            const res = await getUserReelsService(userId, currentCursor, limit)

            if (res.success) {
                const paginated = res.data as any
                const items = paginated.items || []
                const nextCursor = paginated.nextCursor || undefined
                const more = paginated.hasMore || false

                setReels(prev => isAppend ? [...prev, ...items] : items)
                cursorRef.current = nextCursor
                setHasMore(more)
            }
        } catch (error) {
            console.error("Error fetching user reels:", error)
        } finally {
            setLoading(false)
            setInitialLoaded(true)
            loadingRef.current = false
        }
    }, [userId])

    // Lần đầu mount: ưu tiên dữ liệu từ context nếu có
    useEffect(() => {
        if (initialLoaded) {
            // Đã load sync từ context rồi, giờ chỉ cần xóa cache để dọn dẹp
            consumeReelData()
            return
        }

        // Nếu context không khớp, fetch mới từ server
        fetchReels()
    }, [userId, initialLoaded, consumeReelData, fetchReels])

    const handleLoadMore = useCallback(() => {
        if (!hasMore || loadingRef.current) return
        fetchReels(cursorRef.current, true)
    }, [hasMore, fetchReels])

    return (
        <>
            {(!initialLoaded || !isViewerReady) && (
                <div className={`fixed inset-0 z-[100] transition-opacity duration-500 ease-in-out ${initialLoaded && isViewerReady ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                    <ReelSkeleton />
                </div>
            )}

            {reels.length > 0 && (
                <ReelViewer
                    reels={reels}
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    loading={loading}
                    startIndex={startIndex}
                    viewMode="user"
                    onReady={() => setIsViewerReady(true)}
                />
            )}
        </>
    )
}
