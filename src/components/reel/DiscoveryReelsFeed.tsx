"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Reel } from "@/apis/reel.api"
import { getReelRecommendationsService } from "@/services/reel.service"
import { ReelViewer } from "./ReelViewer"
import { ReelSkeleton } from "@/components/skeleton"

export function DiscoveryReelsFeed({ startIndex = 0 }: { startIndex?: number }) {
    const [reels, setReels] = useState<Reel[]>([])
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [initialLoaded, setInitialLoaded] = useState(false)
    const loadingRef = useRef(false)

    const fetchReels = useCallback(async (isAppend: boolean = false) => {
        if (loadingRef.current) return
        loadingRef.current = true
        setLoading(true)

        try {
            const limit = 12
            const res = await getReelRecommendationsService(limit)

            if (res.success) {
                const items = res.data as Reel[]
                setReels(prev => {
                    if (!isAppend) return items

                    const existingIds = new Set(prev.map(r => r.id))
                    const uniqueNewItems = items.filter(item => !existingIds.has(item.id))

                    // If no new items but we got data, maybe stop to avoid loops
                    if (uniqueNewItems.length === 0 && items.length > 0) {
                        setHasMore(false)
                    }

                    return [...prev, ...uniqueNewItems]
                })
                setHasMore(items.length > 0)
            }
        } catch (error) {
            console.error("Error fetching discovery reels:", error)
        } finally {
            setLoading(false)
            setInitialLoaded(true)
            loadingRef.current = false
        }
    }, [])

    useEffect(() => {
        fetchReels()
    }, [fetchReels])

    const handleLoadMore = useCallback(() => {
        if (!hasMore || loadingRef.current) return
        fetchReels(true)
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
            viewMode="discovery"
        />
    )
}
