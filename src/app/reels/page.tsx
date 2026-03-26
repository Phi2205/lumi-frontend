"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect, useCallback, useRef, Suspense } from "react"
import { Reel } from "@/apis/reel.api"
import { getMyReelsService, getUserReelsService } from "@/services/reel.service"
import { useReelContext } from "@/contexts/ReelContext"
import { ReelViewer } from "@/components/reel/ReelViewer"
import { Loader2 } from "lucide-react"

import { ReelSkeleton } from "@/components/skeleton"

/**
 * Trang Reels — linh hoạt theo query params:
 */

function ReelsContent() {
    const searchParams = useSearchParams()
    const userId = searchParams.get("userId")
    const startIndex = parseInt(searchParams.get("startIndex") || "0", 10)

    const { consumeReelData } = useReelContext()

    const [reels, setReels] = useState<Reel[]>([])
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [initialLoaded, setInitialLoaded] = useState(false)

    const cursorRef = useRef<string | undefined>(undefined)
    const loadingRef = useRef(false)

    const fetchReels = useCallback(async (cursor?: string) => {
        if (loadingRef.current) return
        loadingRef.current = true
        setLoading(true)

        try {
            // cursor là bắt buộc bên backend, nếu không có thì truyền empty string
            const currentCursor = cursor || ""
            const limit = 12
            console.log("user id", userId)
            const res = userId
                ? await getUserReelsService(userId, currentCursor, limit)
                : await getMyReelsService(currentCursor, limit)

            if (res.success) {
                const { items, nextCursor, hasMore: more } = res.data
                setReels(prev => cursor ? [...prev, ...items] : items)
                cursorRef.current = nextCursor || undefined
                setHasMore(more)
            }
        } catch (error) {
            console.error("Error fetching reels:", error)
        } finally {
            setLoading(false)
            setInitialLoaded(true)
            loadingRef.current = false
        }
    }, [userId])

    // Lần đầu load
    useEffect(() => {
        const contextData = consumeReelData()

        const contextUserId = contextData?.userId || null
        const queryUserId = userId || null

        // Nếu có data qua Context và khớp userId đang xem
        if (contextData && contextData.reels.length > 0 && contextUserId === queryUserId) {
            setReels(contextData.reels)
            cursorRef.current = contextData.cursor
            setHasMore(contextData.hasMore)
            setInitialLoaded(true)
        } else {
            fetchReels()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleLoadMore = useCallback(() => {
        if (!hasMore || loadingRef.current) return
        fetchReels(cursorRef.current)
    }, [hasMore, fetchReels])

    // Loading ban đầu
    if (!initialLoaded) {
        return <ReelSkeleton />
    }

    return (
        <ReelViewer
            reels={reels}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loading={loading}
            startIndex={startIndex}
        />
    )
}

export default function ReelsPage() {
    return (
        <Suspense fallback={<ReelSkeleton />}>
            <ReelsContent />
        </Suspense>
    )
}
