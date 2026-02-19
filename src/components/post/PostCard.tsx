"use client"

import { cn } from "@/lib/utils"

import { MoreHorizontal, Share2 } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback, StoryAvatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import ImagePreview from "@/components/ui/ImagePreview"
import { LikeButton } from "../LikeButton"
import { CommentSection } from "./CommentSection"
import { useState } from "react"
import { formatTime } from "@/utils/format"

export interface Post {
  id: string
  user: {
    name: string
    avatar: string
  }
  timestamp: string
  content: string
  media: PostMedia[]
  likes: number
  comments: number
  shares: number
  has_liked?: boolean
}

export interface PostMedia {
  id: string;
  media_url: string;
  media_type: string;
  order: number;
}

interface PostCardProps {
  post: Post
  onLike?: (postId: string) => void
}


function  PostMediaGrid({ media }: { media: PostMedia[] }) {
  const count = media.length
  const allImages = media.filter(m => m.media_type !== "video").map(m => m.media_url)

  if (count === 0) return null

  if (count === 1) {
    const item = media[0]
    return (
      <div className="overflow-hidden rounded-xl mb-4">
        {item.media_type === "video" ? (
          <video src={item.media_url} controls className="w-full max-h-[500px] object-cover" />
        ) : (
          <ImagePreview src={item.media_url} allImages={allImages} className="w-full object-cover" />
        )}
      </div>
    )
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-1 mb-4 overflow-hidden rounded-lg">
        {media.map((item) => (
          <div key={item.id} className="relative">
            {item.media_type === "video" ? (
              <video src={item.media_url} controls className="h-60 w-full object-cover" />
            ) : (
              <ImagePreview src={item.media_url} allImages={allImages} className="h-60 w-full object-cover" />
            )}
          </div>
        ))}
      </div>
    )
  }

  if (count === 3) {
    return (
      <div className="grid grid-cols-2 gap-1 mb-4 overflow-hidden rounded-lg">
        <div className="col-span-2 relative">
          {media[0].media_type === "video" ? (
            <video src={media[0].media_url} controls className="h-64 w-full object-cover" />
          ) : (
            <ImagePreview src={media[0].media_url} allImages={allImages} className="h-64 w-full object-cover" />
          )}
        </div>
        <div className="relative">
          {media[1].media_type === "video" ? (
            <video src={media[1].media_url} controls className="h-40 w-full object-cover" />
          ) : (
            <ImagePreview src={media[1].media_url} allImages={allImages} className="h-40 w-full object-cover" />
          )}
        </div>
        <div className="relative">
          {media[2].media_type === "video" ? (
            <video src={media[2].media_url} controls className="h-40 w-full object-cover" />
          ) : (
            <ImagePreview src={media[2].media_url} allImages={allImages} className="h-40 w-full object-cover" />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-1 mb-4 overflow-hidden rounded-lg">
      {media.slice(0, 4).map((item, index) => (
        <div key={item.id} className="relative">
          {item.media_type === "video" ? (
            <video src={item.media_url} controls className="h-48 w-full object-cover" />
          ) : (
            <ImagePreview src={item.media_url} allImages={allImages} count={count} index={index} className="h-48 w-full object-cover" />
          )}
        </div>
      ))}
    </div>
  )
}

export function PostCard({ post, onLike }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="backdrop-blur-3xl bg-white/6 border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/8 overflow-hidden mb-4">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <StoryAvatar className="h-12 w-12" src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} hasStory={false} isSeen={false} />
          <div>
            <p className="font-semibold text-white">{post.user.name}</p>
            <p className="text-xs text-white/50">{formatTime(post.timestamp)}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/10 rounded-lg">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <p className="text-white text-sm leading-relaxed mb-4">{post.content}</p>

        {/* Post Media */}
        {post.media && <PostMediaGrid media={post.media} />}
      </div>

      {/* Post Stats */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-b border-white/10 text-xs text-white/50">
        <span className="mx-16">{post.likes} likes</span>
        <span className="mx-16">{post.comments} comments</span>
        <span className="mx-16">{post.shares} shares</span>
      </div>

      {/* Post Actions */}
      <div className="flex items-center gap-2 p-4">
        <LikeButton postId={post.id} liked={post.has_liked || false} count={post.likes} onLike={onLike} />
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-2 text-white/60 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          💬 Comment
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-2 text-white/60 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>

      {/* Comments Section */}
      {isExpanded && <CommentSection postId={post.id} />}
    </div>
  )
}

export { SkeletonPostCard as PostCardSkeleton } from "@/components/skeleton"
