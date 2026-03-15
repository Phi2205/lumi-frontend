"use client"

import { useState, useMemo, useEffect } from "react"
import { PostMedia } from "./PostCard"
import { cn } from "@/lib/utils"
import { Image, Video, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import ImagePreview from "@/components/ui/ImagePreview"

interface PostMediaCarouselProps {
    media: PostMedia[]
}

export function PostMediaCarousel({ media }: PostMediaCarouselProps) {
    const images = useMemo(() => media.filter(m => m.media_type !== "video"), [media])
    const videos = useMemo(() => media.filter(m => m.media_type === "video"), [media])

    const [activeTab, setActiveTab] = useState<'all' | 'images' | 'videos'>(
        images.length > 0 && videos.length > 0 ? 'all' : images.length > 0 ? 'images' : 'videos'
    )

    const currentMedia = useMemo(() => {
        if (activeTab === 'all') return media
        if (activeTab === 'images') return images
        if (activeTab === 'videos') return videos
        return media
    }, [activeTab, media, images, videos])

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isScrolling, setIsScrolling] = useState(false)

    // Sync index with scroll position
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (isScrolling) return
        const container = e.currentTarget
        const index = Math.round(container.scrollLeft / container.clientWidth)
        if (index !== currentIndex) {
            setCurrentIndex(index)
        }
    }

    // Handle manual navigation (arrows/dots)
    const scrollTo = (index: number) => {
        const container = document.getElementById(`carousel-${media[0].id}`)
        if (container) {
            setIsScrolling(true)
            container.scrollTo({
                left: index * container.clientWidth,
                behavior: "smooth"
            })
            setCurrentIndex(index)
            // Unlock after animation
            setTimeout(() => setIsScrolling(false), 500)
        }
    }

    // Reset index when tab changes
    useEffect(() => {
        scrollTo(0)
    }, [activeTab])

    const showTabs = images.length > 0 && videos.length > 0

    if (!media || media.length === 0) return null

    return (
        <div className="space-y-3">
            {/* Tab Switcher - Only show if we have both types */}
            {showTabs && (
                <div className="flex gap-1 p-1 bg-white/[0.03] backdrop-blur-md rounded-xl border border-white/10 w-fit mx-auto">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={cn(
                            "px-4 py-1.5 text-[11px] font-semibold rounded-lg transition-all flex items-center gap-1.5 uppercase tracking-wider",
                            activeTab === 'all' ? "bg-white/10 text-white shadow-lg border border-white/10" : "text-white/40 hover:text-white/70 hover:bg-white/5"
                        )}
                    >
                        Tất cả
                    </button>
                    {images.length > 0 && (
                        <button
                            onClick={() => setActiveTab('images')}
                            className={cn(
                                "px-4 py-1.5 text-[11px] font-semibold rounded-lg transition-all flex items-center gap-1.5 uppercase tracking-wider",
                                activeTab === 'images' ? "bg-white/10 text-white shadow-lg border border-white/10" : "text-white/40 hover:text-white/70 hover:bg-white/5"
                            )}
                        >
                            <Image size={12} />
                            Ảnh
                        </button>
                    )}
                    {videos.length > 0 && (
                        <button
                            onClick={() => setActiveTab('videos')}
                            className={cn(
                                "px-4 py-1.5 text-[11px] font-semibold rounded-lg transition-all flex items-center gap-1.5 uppercase tracking-wider",
                                activeTab === 'videos' ? "bg-white/10 text-white shadow-lg border border-white/10" : "text-white/40 hover:text-white/70 hover:bg-white/5"
                            )}
                        >
                            <Video size={12} />
                            Video
                        </button>
                    )}
                </div>
            )}

            {/* Media Display Area */}
            <div className="relative group overflow-hidden rounded-2xl bg-black/20 aspect-[4/5] sm:aspect-square md:aspect-[4/3] flex items-center justify-center border border-white/10 shadow-2xl">
                {/* Media Counter */}
                {currentMedia.length > 1 && (
                    <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-[11px] font-bold text-white/90">
                        {currentIndex + 1} / {currentMedia.length}
                    </div>
                )}

                {/* Carousel Content - Scrollable with Snap */}
                <div
                    id={`carousel-${media[0].id}`}
                    onScroll={handleScroll}
                    className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
                >
                    {currentMedia.map((item) => (
                        <div key={item.id} className="w-full h-full flex-shrink-0 snap-start snap-always relative overflow-hidden flex items-center justify-center bg-black/40">
                            {item.media_type === "video" ? (
                                <video
                                    src={item.media_url}
                                    className="w-full h-full object-contain"
                                    controls
                                    playsInline
                                />
                            ) : (
                                <div className="relative w-full h-full">
                                    <ImagePreview
                                        src={item.media_url}
                                        alt="Post media"
                                        className="w-full h-full object-cover rounded-none"
                                        allImages={images.map(i => i.media_url)}
                                    />
                                    <div className="absolute inset-0 bg-black/5 pointer-events-none group-hover:bg-transparent transition-colors" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                {currentMedia.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                scrollTo(Math.max(0, currentIndex - 1));
                            }}
                            className={cn(
                                "hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 text-white shadow-xl transition-all z-20 hover:scale-110 active:scale-95 group-hover:opacity-100 opacity-0",
                                currentIndex === 0 && "cursor-not-allowed opacity-0 group-hover:opacity-20 pointer-events-none"
                            )}
                        >
                            <ChevronLeft size={20} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                scrollTo(Math.min(currentMedia.length - 1, currentIndex + 1));
                            }}
                            className={cn(
                                "hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 text-white shadow-xl transition-all z-20 hover:scale-110 active:scale-95 group-hover:opacity-100 opacity-0",
                                currentIndex === currentMedia.length - 1 && "cursor-not-allowed opacity-0 group-hover:opacity-20 pointer-events-none"
                            )}
                        >
                            <ChevronRight size={20} strokeWidth={2.5} />
                        </button>

                        {/* Pagination Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 px-3 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/5">
                            {currentMedia.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => scrollTo(i)}
                                    className={cn(
                                        "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                        i === currentIndex ? "bg-white w-4 scale-110" : "bg-white/30 hover:bg-white/50"
                                    )}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
