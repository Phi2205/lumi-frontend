"use client"

import { useState, useEffect, useCallback } from "react"
import { HomeLayout } from "@/components/HomeLayout"
import { getStoryFriends } from "@/services/story.service"
import { StoryFriend } from "@/apis/story.api"
import { useRouter } from "next/navigation"
import { useStoryContext } from "@/contexts/StoryContext"
import { StoryAvatar } from "@/components/ui/avatar"
import { Ghost, Loader2 } from "lucide-react"

/**
 * StoriesPage component - Displays a dedicated grid of friend stories
 * Uses HomeLayout for consistent Header, Sidebar, and RightSidebar
 */
export default function StoriesPage() {
    const router = useRouter()
    const storyCtx = useStoryContext()
    const [stories, setStories] = useState<StoryFriend[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const setStoryData = storyCtx?.setStoryData

    // Helper to generate CDN URLs for story previews
    const cdnUrl = (publicId: string, mediaType: string) => {
        if (mediaType === 'video') {
            return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/video/upload/so_0/${publicId}.jpg`
        } else {
            return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload/v1769332463/${publicId}.jpg`
        }
    }

    const fetchAllStories = useCallback(async () => {
        try {
            setIsLoading(true)
            // Fetch friend stories feed (p=1, limit=20 for a full page view)
            const response = await getStoryFriends(1, 20)
            const storyFriends = response.data.items || []
            setStories(storyFriends)

            // Save to context to enable seamless navigation in the Story Viewer
            if (setStoryData) {
                setStoryData({ friends: storyFriends })
            }
        } catch (error) {
            console.error("Failed to fetch stories:", error)
            setStories([])
        } finally {
            setIsLoading(false)
        }
    }, [setStoryData])

    useEffect(() => {
        fetchAllStories()
    }, [fetchAllStories])

    return (
        <HomeLayout>
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Stories</h1>
                        <p className="text-white/50 text-sm mt-1">Check out what your friends are up to</p>
                    </div>
                </div>

                {/* Stories Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-10 h-10 text-blue-400 animate-spin mb-4" />
                        <p className="text-white/40 font-medium">Gathering stories...</p>
                    </div>
                ) : stories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl">
                        <div className="bg-white/5 p-6 rounded-full mb-4 ring-1 ring-white/10">
                            <Ghost className="w-12 h-12 text-white/20" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white/90 mb-2">Your field is empty</h3>
                        <p className="text-white/50 max-w-[320px] leading-relaxed">
                            When your friends share stories, they'll appear here for 24 hours.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {stories.map((story) => {
                            const latestStory = story.stories && story.stories.length > 0 ? story.stories[0] : null

                            return (
                                <div
                                    key={story.user.id}
                                    className="relative aspect-[3/4.5] rounded-[2.5rem] overflow-hidden cursor-pointer group border border-white/15 hover:border-white/30 transition-all duration-500 shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2"
                                    onClick={() => router.push(`/stories/${story.user.username}`)}
                                >
                                    {/* Content Preview */}
                                    <img
                                        src={latestStory
                                            ? cdnUrl(latestStory.media_url || '', latestStory.media_type || 'video')
                                            : story.user.avatar_url || "/avatar-default.jpg"}
                                        alt={story.user.username}
                                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />

                                    {/* Premium Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2.5rem] pointer-events-none" />

                                    {/* User Profile Info */}
                                    <div className="absolute bottom-6 left-0 right-0 px-4 flex flex-col items-center text-center">
                                        <div className="mb-3 transform group-hover:scale-110 transition-transform duration-500">
                                            <StoryAvatar
                                                src={story.user.avatar_url || "/avatar-default.jpg"}
                                                alt={story.user.username}
                                                className="h-14 w-14 ring-4 ring-black/40 border-2 border-transparent"
                                                hasStory={true}
                                                isSeen={!story.has_unseen}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-white truncate max-w-full drop-shadow-md">
                                                {story.user.name || story.user.username}
                                            </p>
                                            <p className="text-[10px] text-white/60 font-medium uppercase tracking-widest mt-0.5">
                                                {story.has_unseen ? "New Story" : "Viewed"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Indicator */}
                                    {story.has_unseen && (
                                        <div className="absolute top-5 right-5 h-3 w-3 bg-blue-500 rounded-full ring-4 ring-black/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse" />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </HomeLayout>
    )
}
