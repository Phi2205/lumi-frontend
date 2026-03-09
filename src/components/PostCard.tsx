"use client"

import { MoreHorizontal, Send, Heart, MessageCircle, Share2 } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { CommentSection } from "./CommentSection"
import { useState } from "react"
import { ImageCarousel } from "./ImageCarousel"

export interface Post {
  id: string
  author: {
    name: string
    avatar: string
    verified?: boolean
  }
  timestamp: string
  content: string
  image?: string
  images?: string[]
  likes: number
  comments: number
  hasLiked?: boolean
  lastCommentAuthor?: {
    avatar: string
    name: string
  }
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
      className="rounded-lg overflow-hidden mb-6 transition-all duration-300 group"
      style={isDarkMode ? {
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(20, 20, 20, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      } : {
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* Compact Post Header - Instagram Style */}
      <div 
        className="flex items-center justify-between px-3 py-2.5 border-b"
        style={{
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'
        }}
      >
        <div className="flex items-center gap-2 flex-1">
          <Avatar 
            className="h-9 w-9 ring-1.5"
            style={{
              ringColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'
            }}
          >
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
              {post.author.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1">
            <p 
              className="font-semibold text-xs leading-none"
              style={{
                color: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(20, 20, 20)'
              }}
            >
              {post.author.name}
            </p>
            {post.author.verified && (
              <span className="text-blue-400 text-xs">✓</span>
            )}
          </div>
          <span 
            className="text-xs"
            style={{
              color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'
            }}
          >
            {post.timestamp}
          </span>
        </div>
        
        <button 
          className="p-1.5 rounded-full hover:opacity-70 transition-opacity"
          style={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Image Carousel - Main Focus */}
      {(post.images && post.images.length > 0) ? (
        <ImageCarousel images={post.images} isDarkMode={isDarkMode} />
      ) : post.image ? (
        <div className="relative overflow-hidden bg-black/20 aspect-square">
          <img
            src={post.image}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>
      ) : null}

      {/* Action Buttons - Below Image */}
      <div 
        className="flex items-center justify-between px-3 py-2.5"
        style={{
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className="p-1.5 rounded-full hover:opacity-70 transition-opacity"
            style={{
              color: liked ? 'rgb(239, 68, 68)' : isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'
            }}
          >
            <Heart 
              className="h-5 w-5" 
              fill={liked ? 'currentColor' : 'none'}
            />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-full hover:opacity-70 transition-opacity"
            style={{
              color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'
            }}
          >
            <MessageCircle className="h-5 w-5" />
          </button>
          <button
            className="p-1.5 rounded-full hover:opacity-70 transition-opacity"
            style={{
              color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'
            }}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        <button
          className="p-1.5 rounded-full hover:opacity-70 transition-opacity"
          style={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'
          }}
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Likes Count */}
      <div 
        className="px-3 py-2 text-xs font-semibold"
        style={{
          color: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(20, 20, 20)'
        }}
      >
        {post.likes + (liked && !post.hasLiked ? 1 : 0)} likes
      </div>

      {/* Post Caption */}
      {post.content && (
        <div 
          className="px-3 pb-2 text-xs"
          style={{
            color: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(20, 20, 20)'
          }}
        >
          <span className="font-semibold">{post.author.name}</span>
          <span className="ml-2">{post.content}</span>
        </div>
      )}

      {/* View Comments */}
      {post.comments > 0 && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="px-3 py-1.5 text-xs transition-opacity hover:opacity-70"
          style={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'
          }}
        >
          View all {post.comments} comments
        </button>
      )}

      {/* Last Comment Preview */}
      {!isExpanded && post.lastCommentAuthor && (
        <div 
          className="px-3 py-1.5 text-xs flex items-center gap-2"
          style={{
            color: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(20, 20, 20)'
          }}
        >
          <Avatar className="h-5 w-5">
            <AvatarImage src={post.lastCommentAuthor.avatar} />
            <AvatarFallback className="text-[0.5rem] bg-blue-500 text-white">
              {post.lastCommentAuthor.name[0]}
            </AvatarFallback>
          </Avatar>
          <span>
            <span className="font-semibold">{post.lastCommentAuthor.name}</span>
            <span className="ml-1">left a comment</span>
          </span>
        </div>
      )}

      {/* Comments Section */}
      {isExpanded && (
        <div 
          style={{
            borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`
          }}
        >
          <CommentSection postId={post.id} />
        </div>
      )}
    </div>
  )
}
