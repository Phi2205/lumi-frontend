"use client"

import { useRef, useEffect } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatTime } from "@/utils/format"
import type { Story as StoryApi } from "@/apis/story.api"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { GlassButton } from "@/lib/components"
import { StorySkeletonContent } from "@/components/skeleton"
import { viewStory } from "@/services/story.service"

interface StoryFriend {
  id: string
  username: string
  name: string
  avatar: string
}

interface ModalStoryProps {
  isOpen: boolean
  storyFriend: StoryFriend | null
  userStories: StoryApi[]
  currentStoryIndex: number
  isLoadingUserStories: boolean
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

const cdnUrlImage = (publicId: string) => {
  return `https://res.cloudinary.com/dibvkarvg/image/upload/v1769332463/${publicId}.jpg`
}

// Import Hls.js normally - it will be empty on SSR anyway
import Hls from "hls.js"

export function ModalStory({
  isOpen,
  storyFriend,
  userStories,
  currentStoryIndex,
  isLoadingUserStories,
  onClose,
  onPrevious,
  onNext
}: ModalStoryProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Setup HLS video player
  useEffect(() => {
    if (!videoRef.current || !userStories.length) return

    const currentStory = userStories[currentStoryIndex]
    if (!currentStory || currentStory.media_type !== 'video' || !isOpen) return

    const streamUrl = currentStory.streaming_url
    if (!streamUrl) return

    let hls: Hls | null = null

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      })
      hls.loadSource(streamUrl)
      hls.attachMedia(videoRef.current)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current?.play().catch(() => { })
      })
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // iOS Safari handles HLS natively
      videoRef.current.src = streamUrl
    } else {
      // Fallback for non-HLS streams if necessary
      videoRef.current.src = currentStory.media_url
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
      if (videoRef.current) {
        videoRef.current.src = ""
      }
    }
  }, [userStories, currentStoryIndex, isOpen])

  // Preload next and previous stories
  useEffect(() => {
    if (!userStories.length || !isOpen) return

    const indicesToPreload = [currentStoryIndex - 1, currentStoryIndex + 1].filter(
      index => index >= 0 && index < userStories.length
    )

    indicesToPreload.forEach(index => {
      const story = userStories[index]
      if (story.media_type === 'image') {
        const img = new Image()
        img.src = cdnUrlImage(story.media_url)
      } else if (story.media_type === 'video' && story.streaming_url) {
        // Preload video (HLS manifest)
        if (Hls.isSupported()) {
          const hls = new Hls({ enableWorker: true })
          hls.loadSource(story.streaming_url)
          // We don't attach to a media element to avoid heavy resource usage, 
          // but loading the source kicks off manifest and some segment fetching.
          // Note: Hls.js will continue to load in background until destroyed or limit reached.
          setTimeout(() => hls.destroy(), 5000) // Clean up after a bit of prefetching
        }
      }
    })
  }, [userStories, currentStoryIndex, isOpen])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  // Mark story as viewed
  useEffect(() => {
    if (isOpen && userStories[currentStoryIndex]) {
      const storyId = userStories[currentStoryIndex].id
      viewStory(storyId).catch(err => {
        console.error("Failed to mark story as viewed:", err)
      })
    }
  }, [isOpen, currentStoryIndex, userStories])

  if (!isOpen || !storyFriend) return null

  const currentStory = userStories[currentStoryIndex]

  return (
    <div
      className="relative w-full h-full bg-black/80 flex items-center justify-center"
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      {/* Left clickable area - Previous story */}
      {userStories.length > 1 && !isLoadingUserStories && currentStory && currentStoryIndex > 0 && (
        <div
          className="absolute left-0 top-20 bottom-0 w-1/2 cursor-pointer z-10"
          onClick={onPrevious}
          style={{
            left: 0,
            width: '50%'
          }}
        />
      )}

      {/* Right clickable area - Next story */}
      {userStories.length > 1 && !isLoadingUserStories && currentStory && currentStoryIndex < userStories.length - 1 && (
        <div
          className="absolute right-0 top-20 bottom-0 w-1/2 cursor-pointer z-10"
          onClick={onNext}
          style={{
            right: 0,
            width: '50%'
          }}
        />
      )}

      {/* Navigation Buttons - Outside story container */}
      {userStories.length > 1 && !isLoadingUserStories && currentStory && (
        <>
          <GlassButton
            variant="ghost"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 !rounded-full p-0 z-20 shadow-xl disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer group"
            onClick={onPrevious}
            disabled={currentStoryIndex === 0}
          >
            <ChevronLeft size={32} className="group-hover:-translate-x-0.5 transition-transform" />
          </GlassButton>
          <GlassButton
            variant="ghost"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 !rounded-full p-0 z-20 shadow-xl disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer group"
            onClick={onNext}
            disabled={currentStoryIndex === userStories.length - 1}
          >
            <ChevronRight size={32} className="group-hover:translate-x-0.5 transition-transform" />
          </GlassButton>
        </>
      )}

      <div
        className="relative bg-black rounded-3xl overflow-hidden shadow-2xl z-20"
        style={{
          height: '100%',
          aspectRatio: '9/16',
          maxHeight: '100%'
        }}
      >
        {isLoadingUserStories ? (
          <StorySkeletonContent />
        ) : currentStory ? (
          <>
            {currentStory.media_type === 'video' ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={cdnUrlImage(currentStory.media_url) || "/placeholder.svg"}
                alt="Story"
                className="w-full h-full object-cover"
              />
            )}

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4 flex items-center justify-between z-50">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 ring-2 ring-white/50">
                  <AvatarImage src={storyFriend.avatar || "/avatar-default.jpg"} />
                  <AvatarFallback>{storyFriend.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white text-sm font-semibold">
                    {storyFriend.name}
                  </p>
                  <p className="text-white/70 text-xs">
                    {formatTime(currentStory.created_at)}
                  </p>
                </div>
              </div>
              <button
                className="text-white/60 hover:text-white transition-all p-1 cursor-pointer"
                onClick={onClose}
              >
                <X size={24} />
              </button>
            </div>

            {/* Progress Bars */}
            <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 h-1">
              {userStories.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-0.5 rounded-full ${index === currentStoryIndex ? "bg-white" : "bg-white/30"
                    }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white">No stories available</div>
          </div>
        )}
      </div>
    </div >
  )
}
