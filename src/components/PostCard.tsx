"use client"

import { MoreHorizontal, Share2, Heart, MessageCircle } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LikeButton } from "./LikeButton"
import { CommentSection } from "./CommentSection"
import { useState } from "react"
import { GlassButton } from "@/lib/components/glass-button"
import { ImageCarousel } from "./ImageCarousel"

export interface Post {
  id: string
  author: {
    name: string
    avatar: string
  }
  timestamp: string
  content: string
  image?: string
  images?: string[]
  likes: number
  comments: number
  hasLiked?: boolean
}

interface PostCardProps {
  post: Post
  onLike?: (postId: string) => void
  isDarkMode?: boolean
}

export function PostCard({ post, onLike, isDarkMode = true }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [liked, setLiked] = useState(post.hasLiked || false)

  const handleLike = () => {
    setLiked(!liked)
    onLike?.(post.id)
  }

  return (
    <div 
      className="rounded-xl overflow-hidden mb-6 transition-all duration-300 hover:scale-105 group"
      style={isDarkMode ? {
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
      } : {
        backdropFilter: 'blur(15px)',
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* Post Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="flex items-center gap-3">
          <Avatar 
            className="h-10 w-10 ring-2"
            style={{
              ringColor: isDarkMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)'
            }}
          >
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              {post.author.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p 
              className="font-semibold text-sm"
              style={{
                color: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(20, 20, 20)'
              }}
            >
              {post.author.name}
            </p>
            <p 
              className="text-xs"
              style={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'
              }}
            >
              {post.timestamp}
            </p>
          </div>
        </div>
        <GlassButton 
          variant="ghost" 
          size="sm"
          blur={16}
          refraction={0.08}
          depth={2}
          className="h-8 w-8 p-0"
        >
          <MoreHorizontal 
            className="h-4 w-4"
            style={{
              color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'
            }}
          />
        </GlassButton>
      </div>

      {/* Post Images - Carousel */}
      {(post.images && post.images.length > 0) ? (
        <ImageCarousel images={post.images} isDarkMode={isDarkMode} />
      ) : post.image ? (
        <div className="relative overflow-hidden bg-black/20 aspect-square group">
          <img
            src={post.image}
            alt="Post"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Image overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ) : null}

      {/* Post Content */}
      <div className="p-4">
        <p 
          className="text-sm leading-relaxed"
          style={{
            color: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(20, 20, 20)'
          }}
        >
          {post.content}
        </p>
      </div>

      {/* Engagement Stats - Instagram style */}
      <div 
        className="flex items-center justify-between px-4 py-2 text-xs font-semibold border-t border-b"
        style={{
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
        }}
      >
        <span className="flex items-center gap-1">
          <Heart className="w-4 h-4" fill="currentColor" />
          {post.likes + (liked && !post.hasLiked ? 1 : 0)} likes
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          {post.comments} comments
        </span>
      </div>

      {/* Post Actions - Instagram style horizontal layout */}
      <div className="grid grid-cols-3 gap-1 p-2">
        <button
          onClick={handleLike}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all font-medium text-sm"
          style={liked ? {
            backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.15)',
            color: 'rgb(239, 68, 68)'
          } : {
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
          }}
        >
          <Heart 
            className="w-4 h-4" 
            fill={liked ? 'currentColor' : 'none'}
          />
          <span className="hidden sm:inline">Like</span>
        </button>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all font-medium text-sm"
          style={{
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
          }}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Comment</span>
        </button>
        <button
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all font-medium text-sm"
          style={{
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
          }}
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {isExpanded && (
        <div 
          className="border-t"
          style={{
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'
          }}
        >
          <CommentSection postId={post.id} />
        </div>
      )}
    </div>
  )
}
