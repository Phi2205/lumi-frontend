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
}

export function UserReelsFeed({ userId, startIndex = 0 }: UserReelsFeedProps) {
    const { consumeReelData } = useReelContext()

    const [reels, setReels] = useState<Reel[]>([])
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [initialLoaded, setInitialLoaded] = useState(false)

    const cursorRef = useRef<string | undefined>(undefined)
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

    // Lần đầu load: ưu tiên dữ liệu từ context nếu có
    useEffect(() => {
        const contextData = consumeReelData()
        const contextUserId = contextData?.userId || null

        if (contextData && contextData.reels.length > 0 && contextUserId === userId) {
            setReels(contextData.reels)
            cursorRef.current = contextData.cursor
            setHasMore(contextData.hasMore)
            setInitialLoaded(true)
        } else {
            // Reset state
            setReels([])
            cursorRef.current = undefined
            setHasMore(true)
            fetchReels()
        }
    }, [userId, fetchReels, consumeReelData])

    const handleLoadMore = useCallback(() => {
        if (!hasMore || loadingRef.current) return
        fetchReels(cursorRef.current, true)
    }, [hasMore, fetchReels])

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
            viewMode="user"
        />
    )
}
