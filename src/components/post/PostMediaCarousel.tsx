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
        filter: "blur(10px)"
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        filter: "blur(0px)"
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
        filter: "blur(10px)"
    })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};

export function PostMediaCarousel({
    media,
    aspectRatio = "aspect-square rounded-2xl border border-white/10 shadow-2xl",
    className
}: PostMediaCarouselProps) {
    const [[page, direction], setPage] = useState([0, 0]);

    if (!media || media.length === 0) return null

    // Use modular arithmetic to get index
    const currentIndex = ((page % media.length) + media.length) % media.length;

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    }

    const currentMedia = media;
    const currentItem = media[currentIndex];

    return (
        <div className={cn("space-y-4 w-full h-full flex flex-col", className)}>
            {/* Media Display Area */}
            <div className={cn(
                "relative flex-1 group overflow-hidden bg-black/50 w-full flex items-center justify-center",
                aspectRatio
            )}>
                {/* Media Counter */}
                {media.length > 1 && (
                    <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-[11px] font-bold text-white/90">
                        {currentIndex + 1} / {media.length}
                    </div>
                )}

                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 260, damping: 28 },
                            opacity: { duration: 0.35 },
                            filter: { duration: 0.35 }
                        }}
                        drag={currentMedia.length > 1 ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            if (currentMedia.length <= 1) return;
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold || offset.x < -100) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold || offset.x > 100) {
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
                                className="w-full h-full object-cover pointer-events-auto"
                                controls
                                playsInline
                            />
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
                                <ImagePreview
                                    src={currentItem.media_url}
                                    alt="Post media"
                                    className="w-full h-full object-cover rounded-none pointer-events-none"
                                    allImages={media.filter(m => m.media_type !== "video").map(i => i.media_url)}
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
