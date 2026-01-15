"use client"

import { MoreHorizontal, Share2 } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LikeButton } from "./LikeButton"
import { CommentSection } from "./CommentSection"
import { useState } from "react"

export interface Post {
  id: string
  author: {
    name: string
    avatar: string
  }
  timestamp: string
  content: string
  image?: string
  likes: number
  comments: number
  hasLiked?: boolean
}

interface PostCardProps {
  post: Post
  onLike?: (postId: string) => void
}

export function PostCard({ post, onLike }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="backdrop-blur-3xl bg-white/6 border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/8 overflow-hidden mb-4">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-blue-400/50">
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-white">{post.author.name}</p>
            <p className="text-xs text-white/50">{post.timestamp}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/10 rounded-lg">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <p className="text-white text-sm leading-relaxed mb-4">{post.content}</p>

        {/* Post Image */}
        {post.image && (
          <img
            src={post.image || "/placeholder.svg"}
            alt="Post"
            className="w-full rounded-lg mb-4 max-h-96 object-cover opacity-90 hover:opacity-100 transition-opacity"
          />
        )}
      </div>

      {/* Post Stats */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-b border-white/10 text-xs text-white/50">
        <span>{post.likes} likes</span>
        <span>{post.comments} comments</span>
      </div>

      {/* Post Actions */}
      <div className="flex items-center gap-2 p-4">
        <LikeButton postId={post.id} liked={post.hasLiked || false} count={post.likes} onLike={onLike} />
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-2 text-white/60 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          💬 Comment
        </Button>
        <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Comments Section */}
      {isExpanded && <CommentSection postId={post.id} />}
    </div>
  )
}
