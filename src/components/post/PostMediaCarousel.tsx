"use client"

import { useState, useMemo, useEffect } from "react"
import { PostMedia } from "./PostCard"
import { cn } from "@/lib/utils"
import { Image, Video, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ImagePreview from "@/components/ui/ImagePreview"

interface PostMediaCarouselProps {
    media: PostMedia[]
    aspectRatio?: string
    className?: string
}

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
        scale: 0.95
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
        scale: 0.95
    })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};

export function PostMediaCarousel({
    media,
    aspectRatio = "aspect-[4/5] sm:aspect-square md:aspect-[4/3] rounded-2xl border border-white/10 shadow-2xl",
    className
}: PostMediaCarouselProps) {
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

    const [[page, direction], setPage] = useState([0, 0]);

    // Use modular arithmetic to get index
    const currentIndex = ((page % currentMedia.length) + currentMedia.length) % currentMedia.length;

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    }

    // Reset index when tab changes
    useEffect(() => {
        setPage([0, 0])
    }, [activeTab])

    const showTabs = images.length > 0 && videos.length > 0

    if (!media || media.length === 0) return null

    const currentItem = currentMedia[currentIndex];

    return (
        <div className={cn("space-y-4 w-full h-full flex flex-col", className)}>
            {/* Tab Switcher - Only show if we have both types */}
            {showTabs && (
                <div className="flex gap-1 p-1 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 w-fit mx-auto shrink-0 z-20">
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
            <div className={cn(
                "relative flex-1 group overflow-hidden bg-black/50 w-full flex items-center justify-center",
                aspectRatio
            )}>
                {/* Media Counter */}
                {currentMedia.length > 1 && (
                    <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-[11px] font-bold text-white/90">
                        {currentIndex + 1} / {currentMedia.length}
                    </div>
                )}

                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                            scale: { duration: 0.2 }
                        }}
                        drag={currentMedia.length > 1 ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            if (currentMedia.length <= 1) return;
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                        className={cn(
                            "absolute inset-0 w-full h-full flex items-center justify-center touch-none select-none",
                            currentMedia.length > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
                        )}
                    >
                        {currentItem.media_type === "video" ? (
                            <video
                                src={currentItem.media_url}
                                className="w-full h-full object-contain pointer-events-auto"
                                controls
                                playsInline
                            />
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
                                <ImagePreview
                                    src={currentItem.media_url}
                                    alt="Post media"
                                    className="max-w-full max-h-full object-contain rounded-none pointer-events-none"
                                    allImages={images.map(i => i.media_url)}
                                />
                                <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {currentMedia.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                paginate(-1);
                            }}
                            className={cn(
                                "hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 text-white shadow-xl transition-all z-20 hover:scale-110 active:scale-95 group-hover:opacity-100 opacity-60",
                            )}
                        >
                            <ChevronLeft size={20} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                paginate(1);
                            }}
                            className={cn(
                                "hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 text-white shadow-xl transition-all z-20 hover:scale-110 active:scale-95 group-hover:opacity-100 opacity-60",
                            )}
                        >
                            <ChevronRight size={20} strokeWidth={2.5} />
                        </button>

                        {/* Pagination Dots */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 px-3 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/5">
                            {currentMedia.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        const diff = i - currentIndex;
                                        if (diff !== 0) paginate(diff);
                                    }}
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
