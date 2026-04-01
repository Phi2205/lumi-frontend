"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Reel } from "@/apis/reel.api"
import { getReelRecommendationsService, getReelByIdService } from "@/services/reel.service"
import { ReelViewer } from "./ReelViewer"
import { ReelSkeleton } from "@/components/skeleton"

export function DiscoveryReelsFeed({ startIndex = 0, initialReelId }: { startIndex?: number, initialReelId?: string | null }) {
    const [reels, setReels] = useState<Reel[]>([])
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [initialLoaded, setInitialLoaded] = useState(false)
    const [isViewerReady, setIsViewerReady] = useState(false)
    const loadingRef = useRef(false)

    const fetchReels = useCallback(async (isAppend: boolean = false) => {
        if (loadingRef.current) return
        loadingRef.current = true
        setLoading(true)

        try {
            let sharedReel: Reel | null = null
            if (!isAppend && initialReelId) {
                try {
                    const specificReelRes = await getReelByIdService(initialReelId)
                    if (specificReelRes && specificReelRes.success) {
                        sharedReel = specificReelRes.data as Reel
                    }
                } catch (e) {
                    console.error("Failed to load shared reel:", e)
                }
            }

            const limit = 12
            const res = await getReelRecommendationsService(limit)

            if (res.success) {
                const recommendItems = res.data as Reel[]

                setReels(prev => {
                    if (!isAppend) {
                        let newItems = recommendItems
                        if (sharedReel) {
                            newItems = [sharedReel, ...recommendItems.filter(r => r.id !== sharedReel?.id)]
                        }
                        return newItems
                    }

                    const existingIds = new Set(prev.map(r => r.id))
                    const uniqueNewItems = recommendItems.filter(item => !existingIds.has(item.id))

                    // If no new items but we got data, maybe stop to avoid loops
                    if (uniqueNewItems.length === 0 && recommendItems.length > 0) {
                        setHasMore(false)
                    }

                    return [...prev, ...uniqueNewItems]
                })
                setHasMore(recommendItems.length > 0)

                // If the first load is empty, we must tell the feed we are "ready" to show empty state
                if (!isAppend && recommendItems.length === 0 && !sharedReel) {
                    setIsViewerReady(true)
                }
            }
        } catch (error) {
            console.error("Error fetching discovery reels:", error)
        } finally {
            setLoading(false)
            setInitialLoaded(true)
            loadingRef.current = false
        }
    }, [initialReelId])

    useEffect(() => {
        fetchReels()
    }, [fetchReels])

    const handleLoadMore = useCallback(() => {
        if (!hasMore || loadingRef.current) return
        fetchReels(true)
    }, [hasMore, fetchReels])

    return (
        <>
            {(!initialLoaded || !isViewerReady) && (
                <div className={`fixed inset-0 z-[100] transition-opacity duration-500 ease-in-out ${initialLoaded && isViewerReady ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                    <ReelSkeleton />
                </div>
            )}

            {initialLoaded && (
                <ReelViewer
                    reels={reels}
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    loading={loading}
                    startIndex={startIndex}
                    viewMode="discovery"
                    onReady={() => setIsViewerReady(true)}
                />
            )}
        </>
    )
}
