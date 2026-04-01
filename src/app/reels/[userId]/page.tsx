"use client"

import { Suspense, use } from "react"
import { useSearchParams } from "next/navigation"
import { ReelSkeleton } from "@/components/skeleton"
import { UserReelsFeed } from "@/components/reel/UserReelsFeed"

interface UserReelsPageProps {
    params: Promise<{ userId: string }>
}

function UserReelsContent({ userId }: { userId: string }) {
    const searchParams = useSearchParams()
    const startIndex = parseInt(searchParams.get("startIndex") || "0", 10)
    const reelId = searchParams.get("reel_id")

    return (
        <UserReelsFeed
            userId={userId}
            startIndex={startIndex}
            initialReelId={reelId || undefined}
        />
    )
}

export default function UserReelsPage({ params }: UserReelsPageProps) {
    const { userId } = use(params)

    return (
        <Suspense fallback={<ReelSkeleton />}>
            <UserReelsContent userId={userId} />
        </Suspense>
    )
}
