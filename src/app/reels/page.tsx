"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ReelSkeleton } from "@/components/skeleton"
import { UserReelsFeed } from "@/components/reel/UserReelsFeed"
import { DiscoveryReelsFeed } from "@/components/reel/DiscoveryReelsFeed"

/**
 * Trang Reels — linh hoạt theo query params:
 */

function ReelsContent() {
    const searchParams = useSearchParams()
    const userId = searchParams.get("userId")
    const reelId = searchParams.get("reel_id")
    const startIndex = parseInt(searchParams.get("startIndex") || "0", 10)

    return (
        userId ? (
            <UserReelsFeed userId={userId} startIndex={startIndex} />
        ) : (
            <DiscoveryReelsFeed startIndex={startIndex} initialReelId={reelId} />
        )
    )
}

export default function ReelsPage() {
    return (
        <Suspense fallback={<ReelSkeleton />}>
            <ReelsContent />
        </Suspense>
    )
}
