"use client"

import { useRef, useEffect } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatTime } from "@/utils/format"
import type { Story as StoryApi } from "@/apis/story.api"

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

// Dynamic import for HLS.js to avoid SSR issues
let Hls: any = null
if (typeof window !== 'undefined') {
  // @ts-ignore - hls.js module may not be installed yet
  import('hls.js').then((module: any) => {
    Hls = module.default
  }).catch(() => {
    console.warn('HLS.js not available. Please install: npm install hls.js')
  })
}

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
    if (!videoRef.current || !userStories.length || !Hls) return

    const currentStory = userStories[currentStoryIndex]
    if (!currentStory || currentStory.media_type !== 'video') return

    const streamUrl = currentStory.streaming_url
    if (!streamUrl) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(streamUrl)
      hls.attachMedia(videoRef.current)

      return () => {
        hls.destroy()
      }
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // iOS Safari
      videoRef.current.src = streamUrl
    }
  }, [userStories, currentStoryIndex])

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
          className="absolute left-0 top-0 bottom-0 w-1/2 cursor-pointer z-10"
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
          className="absolute right-0 top-0 bottom-0 w-1/2 cursor-pointer z-10"
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
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all z-20"
            onClick={onPrevious}
            disabled={currentStoryIndex === 0}
          >
            ←
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all z-20"
            onClick={onNext}
            disabled={currentStoryIndex === userStories.length - 1}
          >
            →
          </button>
        </>
      )}

      <div 
        className="relative bg-black rounded-3xl overflow-hidden shadow-2xl z-0"
        style={{
          height: '100%',
          aspectRatio: '9/16',
          maxHeight: '100%'
        }}
      >
        {isLoadingUserStories ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white">Loading...</div>
          </div>
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
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4 flex items-center justify-between">
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
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
                onClick={onClose}
              >
                ✕
              </Button>
            </div>

            {/* Progress Bars */}
            <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 h-1">
              {userStories.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-0.5 rounded-full ${
                    index === currentStoryIndex ? "bg-white" : "bg-white/30"
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
    </div>
  )
}
