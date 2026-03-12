"use client"

import { useState, useRef, useEffect } from "react"
import { Heart, MessageCircle, Share2, Music } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export interface Reel {
  id: string
  user_id: string
  video_url: string
  streaming_url: string
  thumbnail_url: string
  caption: string
  music_name: string
  duration: number
  like_count: number
  comment_count: number
  share_count: number
  view_count: number
  user: {
    id: string
    name: string
    username: string
    avatar_url: string
  }
}

interface ReelCardProps {
  reel: Reel
  isActive: boolean
  isDarkMode?: boolean
}

export function ReelCard({ reel, isActive, isDarkMode = true }: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(isActive)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(reel.like_count)

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }, [isActive])

  const toggleLike = () => {
    setLiked(!liked)
    setLikes(liked ? likes - 1 : likes + 1)
  }

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        src={reel.video_url}
        poster={reel.thumbnail_url}
        className="w-full h-full object-cover"
        onClick={handleVideoClick}
        loop
        playsInline
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Play/Pause Indicator */}
      {!isPlaying && isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/30 backdrop-blur-sm rounded-full p-4 animate-pulse">
            <svg className="w-12 h-12 text-white fill-white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Header - User Info */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src={reel.user.avatar_url} alt={reel.user.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              {reel.user.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-semibold text-sm">{reel.user.name}</p>
            <p className="text-white/70 text-xs">@{reel.user.username}</p>
          </div>
          <button className="ml-auto px-4 py-1.5 bg-white text-black rounded-full font-semibold text-sm hover:bg-white/90 transition">
            Follow
          </button>
        </div>
      </div>

      {/* Right Side - Action Buttons */}
      <div className="absolute bottom-20 right-4 z-20 flex flex-col gap-6">
        {/* Like Button */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={toggleLike}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition transform hover:scale-110"
          >
            <Heart
              className="w-6 h-6 text-white transition-all"
              fill={liked ? "currentColor" : "none"}
              color={liked ? "rgb(239, 68, 68)" : "white"}
            />
          </button>
          <span className="text-white text-xs font-semibold">{likes > 999 ? (likes / 1000).toFixed(1) + "K" : likes}</span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center gap-1">
          <button className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition transform hover:scale-110">
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
          <span className="text-white text-xs font-semibold">
            {reel.comment_count > 999 ? (reel.comment_count / 1000).toFixed(1) + "K" : reel.comment_count}
          </span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center gap-1">
          <button className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition transform hover:scale-110">
            <Share2 className="w-6 h-6 text-white" />
          </button>
          <span className="text-white text-xs font-semibold">
            {reel.share_count > 999 ? (reel.share_count / 1000).toFixed(1) + "K" : reel.share_count}
          </span>
        </div>
      </div>

      {/* Bottom - Caption & Music */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black to-transparent">
        {/* Username & Caption */}
        <div className="mb-3">
          <p className="text-white">
            <span className="font-semibold">{reel.user.name}</span>
            <span className="text-white/80 ml-2">{reel.caption}</span>
          </p>
        </div>

        {/* Music Info */}
        {reel.music_name && (
          <div className="flex items-center gap-2 text-white text-xs">
            <Music className="w-3.5 h-3.5" />
            <span className="truncate">{reel.music_name}</span>
          </div>
        )}

        {/* Video Duration */}
        <div className="mt-2 text-white/60 text-xs">{reel.duration}s</div>
      </div>
    </div>
  )
}
