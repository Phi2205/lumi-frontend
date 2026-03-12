"use client"

import { useState, useEffect } from "react"
import { ReelCard, type Reel } from "@/components/ReelCard"
import { useDarkMode } from "@/hooks/useDarkMode"
import { ChevronDown, ChevronUp } from "lucide-react"

// Mock data - replace with API call
const mockReels: Reel[] = [
  {
    id: "11",
    user_id: "2",
    video_url: "https://res.cloudinary.com/dibvkarvg/video/upload/v1773304314/reels/nnzrh0bcxqdsvz3k2bd2.mp4",
    streaming_url: "https://res.cloudinary.com/dibvkarvg/video/upload/sp_auto/reels/nnzrh0bcxqdsvz3k2bd2.m3u8",
    thumbnail_url: "https://res.cloudinary.com/dibvkarvg/video/upload/v1773304314/reels/nnzrh0bcxqdsvz3k2bd2.jpg",
    caption: "hello",
    music_name: "Original Audio",
    duration: 17,
    like_count: 0,
    comment_count: 0,
    share_count: 0,
    view_count: 0,
    user: {
      id: "2",
      name: "Phi Dương",
      username: "phi.duong",
      avatar_url: "/placeholder.svg",
    },
  },
  {
    id: "10",
    user_id: "2",
    video_url: "https://res.cloudinary.com/dibvkarvg/video/upload/v1773304287/reels/vpxeqt9dqjmevkdgy9yj.mp4",
    streaming_url: "https://res.cloudinary.com/dibvkarvg/video/upload/sp_auto/reels/vpxeqt9dqjmevkdgy9yj.m3u8",
    thumbnail_url: "https://res.cloudinary.com/dibvkarvg/video/upload/v1773304287/reels/vpxeqt9dqjmevkdgy9yj.jpg",
    caption: "Hello",
    music_name: "Original Audio",
    duration: 17,
    like_count: 0,
    comment_count: 0,
    share_count: 0,
    view_count: 0,
    user: {
      id: "2",
      name: "Phi Dương",
      username: "phi.duong",
      avatar_url: "/placeholder.svg",
    },
  },
  {
    id: "9",
    user_id: "2",
    video_url: "https://res.cloudinary.com/dibvkarvg/video/upload/v1773304115/reels/usvnu9yfvajidqvfuuxb.mp4",
    streaming_url: "https://res.cloudinary.com/dibvkarvg/video/upload/sp_auto/reels/usvnu9yfvajidqvfuuxb.m3u8",
    thumbnail_url: "https://res.cloudinary.com/dibvkarvg/video/upload/v1773304115/reels/usvnu9yfvajidqvfuuxb.jpg",
    caption: "hello",
    music_name: "Original Audio",
    duration: 23,
    like_count: 0,
    comment_count: 0,
    share_count: 0,
    view_count: 0,
    user: {
      id: "2",
      name: "Phi Dương",
      username: "phi.duong",
      avatar_url: "/placeholder.svg",
    },
  },
  {
    id: "8",
    user_id: "2",
    video_url: "https://res.cloudinary.com/dibvkarvg/video/upload/v1773304023/reels/ct8aadx1c7ebszextn6o.mp4",
    streaming_url: "https://res.cloudinary.com/dibvkarvg/video/upload/sp_auto/reels/ct8aadx1c7ebszextn6o.m3u8",
    thumbnail_url: "https://res.cloudinary.com/dibvkarvg/video/upload/v1773304023/reels/ct8aadx1c7ebszextn6o.jpg",
    caption: "hello",
    music_name: "Original Audio",
    duration: 23,
    like_count: 0,
    comment_count: 0,
    share_count: 0,
    view_count: 0,
    user: {
      id: "2",
      name: "Phi Dương",
      username: "phi.duong",
      avatar_url: "/placeholder.svg",
    },
  },
  {
    id: "7",
    user_id: "2",
    video_url: "https://res.cloudinary.com/dibvkarvg/video/upload/v1773303529/reels/gmoznn2nwirdfqyqup65.mp4",
    streaming_url: "https://res.cloudinary.com/dibvkarvg/video/upload/sp_auto/reels/gmoznn2nwirdfqyqup65.m3u8",
    thumbnail_url: "https://res.cloudinary.com/dibvkarvg/video/upload/v1773303529/reels/gmoznn2nwirdfqyqup65.jpg",
    caption: "1234",
    music_name: "Original Audio",
    duration: 197,
    like_count: 0,
    comment_count: 0,
    share_count: 0,
    view_count: 0,
    user: {
      id: "2",
      name: "Phi Dương",
      username: "phi.duong",
      avatar_url: "/placeholder.svg",
    },
  },
]

export default function ReelsPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reels, setReels] = useState<Reel[]>(mockReels)
  const { isDarkMode } = useDarkMode()

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        // Scroll down - next reel
        setCurrentIndex((prev) => (prev + 1) % reels.length)
      } else {
        // Scroll up - previous reel
        setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setCurrentIndex((prev) => (prev + 1) % reels.length)
      } else if (e.key === "ArrowUp") {
        setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length)
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: true })
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [reels.length])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Reel Container */}
      <div className="relative w-full h-full">
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <ReelCard reel={reel} isActive={index === currentIndex} isDarkMode={isDarkMode} />
          </div>
        ))}
      </div>

      {/* Navigation Indicators - Left Side */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
        {reels.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 rounded-full transition-all ${
              index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to reel ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-4">
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length)}
          className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition"
          aria-label="Previous reel"
        >
          <ChevronUp className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % reels.length)}
          className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition"
          aria-label="Next reel"
        >
          <ChevronDown className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Reel Counter */}
      <div className="absolute top-4 right-4 z-30 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-semibold">
        {currentIndex + 1} / {reels.length}
      </div>
    </div>
  )
}
