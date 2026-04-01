"use client"

export const dynamic = 'force-dynamic'

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useDarkMode } from "@/hooks/useDarkMode"
import { useBackgroundImage } from "@/hooks/useBackgroundImage"
import { BackgroundRenderer } from "@/components/BackgroundRenderer"
import { ReelSkeleton } from "@/components/skeleton"
import { UserReelsFeed } from "@/components/reel/UserReelsFeed"
import { DiscoveryReelsFeed } from "@/components/reel/DiscoveryReelsFeed"

/**
 * Trang Reels — linh hoạt theo query params:
 */

function ReelsContent() {
    const searchParams = useSearchParams()
    const userId = searchParams.get("userId")
    const startIndex = parseInt(searchParams.get("startIndex") || "0", 10)

    const { isDarkMode } = useDarkMode()
    const { imageLoaded, imageError } = useBackgroundImage("/bg12.jpg", isDarkMode)

    return (
        <>
            <BackgroundRenderer
                isDarkMode={isDarkMode}
                imageLoaded={imageLoaded}
                imageError={imageError}
            />
            {userId ? (
                <UserReelsFeed userId={userId} startIndex={startIndex} />
            ) : (
                <DiscoveryReelsFeed startIndex={startIndex} />
            )}
        </>
    )
}

export default function ReelsPage() {
    return (
        <Suspense fallback={<ReelSkeleton />}>
            <ReelsContent />
        </Suspense>
    )
}
