"use client"

import { cn } from "@/lib/utils"

import { Globe, MoreHorizontal, Share2 } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback, StoryAvatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import ImagePreview from "@/components/ui/ImagePreview"
import { LikeButton } from "../LikeButton"
import { CommentSection } from "./CommentSection"
import { LikesModal } from "./LikesModal"
import { ShareModal } from "./ShareModal"
import { useState, useEffect, useRef } from "react"
import { formatTime } from "@/utils/format"
import { UserHoverCard } from "../UserHoverCard"
import { PostMediaCarousel } from "./PostMediaCarousel"
import { markAsViewed } from "@/services/post.service"


export interface Post {
  id: string
  user: {
    name: string
    avatar_url: string
  }
  timestamp: string
  content: string
  media: PostMedia[]
  likes: number
  comments: number
  shares: number
  has_liked?: boolean
  original_post_id?: string
  original_post?: Post
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



/** Embedded preview of the original post inside a share — Facebook-style */
export function SharedPostPreview({ post }: { post: Post }) {
  return (
    <div className="rounded-xl border border-white/15 overflow-hidden bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <StoryAvatar className="h-10 w-10" src={post.user.avatar_url || "/avatar-default.jpg"} alt={post.user.name} hasStory={false} isSeen={false} />
        <div className="min-w-0 flex-1">
          <p className="text-white text-[13px] font-semibold leading-tight truncate">{post.user.name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-white/40 text-[11px]">{formatTime(post.timestamp)}</span>
            <span className="text-white/20 text-[10px]">·</span>
            <Globe size={10} className="text-white/30" />
          </div>
        </div>
      </div>

      {/* Text */}
      {post.content && (
        <p className="text-white/80 text-[13px] leading-relaxed px-4 pb-3 whitespace-pre-wrap">{post.content}</p>
      )}

      {/* Media — full grid, same as normal post */}
      {post.media?.length > 0 && (
        <div className="overflow-hidden">
          <PostMediaCarousel media={post.media} />
        </div>
      )}

      {/* Footer stats */}
      {true && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.07]">
          {true && (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-blue-500 text-[10px]">👍</span>
              <span className="text-white/40 text-[11px]">{post.likes}</span>
            </div>
          )}
          {true && (
            <span className="text-white/35 text-[11px] ml-auto">{post.comments} bình luận</span>
          )}
        </div>
      )}
    </div>
  )
}

export function PostCard({ post, onLike }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showLikes, setShowLikes] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const isShared = post.original_post != null
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentRef = cardRef.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            markAsViewed(post.id)
            observer.unobserve(currentRef)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(currentRef)

    return () => {
      observer.disconnect()
    }
  }, [post.id])

  return (
    <div ref={cardRef} className="backdrop-blur-3xl bg-white/6 border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/8 overflow-hidden mb-4">

      {/* Post Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <UserHoverCard
            userId={"user-1"}
            name={post.user.name}
            avatar={post.user.avatar_url || "default-avatar.jpg"}
            education={""}
            location={""}
          >
            <StoryAvatar className="h-12 w-12" src={post.user.avatar_url || "/avatar-default.jpg"} alt={post.user.name} hasStory={false} isSeen={false} />
          </UserHoverCard>
          <div>
            <p className="font-semibold text-white">{post.user.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-white/50">{formatTime(post.timestamp)}</span>
              {isShared && (
                <>
                  <span className="text-white/20 text-[10px]">·</span>
                  <Share2 size={11} className="text-white/40" />
                  <span className="text-xs text-white/40">Đã chia sẻ</span>
                </>
              )}
              <span className="text-white/20 text-[10px]">·</span>
              <Globe size={11} className="text-white/35" />
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/10 rounded-lg">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Post Content */}
      <div className="p-4">
        {/* Sharer's caption */}
        {post.content && (
          <p className="text-white text-sm leading-relaxed mb-3">{post.content}</p>
        )}

        {/* If this is a share: embed original post; otherwise show own media */}
        {isShared ? (
          <SharedPostPreview post={post.original_post!} />
        ) : (
          post.media && <PostMediaCarousel media={post.media} />
        )}
      </div>

      {/* Post Stats */}
      <div className="flex items-center justify-around px-4 py-2 border-t border-b border-white/10 text-xs text-white/50">
        <button
          onClick={() => setShowLikes(true)}
          className="hover:text-white/80 hover:underline underline-offset-2 transition-colors cursor-pointer"
        >
          {post.likes} likes
        </button>
        <span className="">{post.comments} comments</span>
        <span className="">{post.shares} shares</span>
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
          onClick={() => setShowShare(true)}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>

      {/* Comments Section */}
      {isExpanded && <CommentSection postId={post.id} />}

      {/* Likes Modal */}
      {showLikes && (
        <LikesModal
          postId={post.id}
          totalLikes={post.likes}
          onClose={() => setShowLikes(false)}
        />
      )}

      {/* Share Modal */}
      {showShare && (
        <ShareModal
          post={post}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  )
}

export { SkeletonPostCard as PostCardSkeleton } from "@/components/skeleton"
