"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, X } from "lucide-react"
import { PostCard, type Post } from "@/components/post/PostCard"
import { getPostById, likePost } from "@/services/post.service"
import type { Post as ApiPost } from "@/apis/post.api"

function mapPost(post: ApiPost): Post {
  return {
    id: post.id,
    user: {
      id: post.user?.id || "",
      username: post.user?.username || "",
      name: post.user?.name || "User",
      avatar_url: post.user?.avatar_url || "/avatar-default.jpg",
      has_story: post.user?.has_story || false,
    },
    timestamp: post.created_at,
    content: post.content,
    media: post.post_media,
    likes: post.like_count,
    comments: post.comment_count,
    shares: post.share_count,
    has_liked: post.has_liked,
    original_post_id: post.original_post_id,
    original_post: post.original_post ? mapPost(post.original_post) : undefined,
  }
}

export default function ReelModal() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleClose = useCallback(() => {
    router.back()
  }, [router])

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [handleClose])

  useEffect(() => {
    if (!postId) return
    const fetchPost = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await getPostById(postId)
        const apiPost = res.data as ApiPost
        setPost(mapPost(apiPost))
      } catch (err: any) {
        console.error("Failed to load reel:", err)
        if (err?.response?.status === 404) {
          setError("Video không tồn tại hoặc đã bị xóa.")
        } else {
          setError("Không thể tải video. Vui lòng thử lại sau.")
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchPost()
  }, [postId])

  const handleLike = (id: string) => {
    likePost(id)
    if (post && post.id === id) {
      setPost({
        ...post,
        has_liked: !post.has_liked,
        likes: post.likes + (post.has_liked ? -1 : 1),
      })
    }
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
        style={{ animation: "fadeIn 0.25s ease" }}
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-[101] overflow-y-auto">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(24px) scale(0.97);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="fixed top-4 right-4 z-[110] w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all cursor-pointer backdrop-blur-xl hover:scale-105 active:scale-95"
          aria-label="Đóng"
        >
          <X size={20} />
        </button>

        {/* Reel badge */}
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[110]">
          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/20 text-pink-300 text-xs font-semibold tracking-wide uppercase backdrop-blur-xl">
            Reel
          </span>
        </div>

        {/* Centered content */}
        <div
          className="flex min-h-full items-start justify-center px-4 py-16 sm:py-20"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose()
          }}
        >
          <div
            className="w-full max-w-2xl"
            style={{ animation: "slideUp 0.35s ease" }}
          >
            {/* Loading */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
                  <Loader2 className="w-6 h-6 text-pink-400 animate-spin" />
                </div>
                <p className="text-white/40 text-sm font-medium">
                  Đang tải video...
                </p>
              </div>
            )}

            {/* Error */}
            {!isLoading && error && (
              <div className="flex flex-col items-center justify-center py-32 gap-5">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
                  <span className="text-3xl">🎬</span>
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white/90 mb-2">
                    Không tìm thấy video
                  </h2>
                  <p className="text-white/50 text-sm max-w-[320px] leading-relaxed">
                    {error}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Quay lại
                </button>
              </div>
            )}

            {/* Post/Reel card */}
            {!isLoading && !error && post && (
              <PostCard post={post} onLike={handleLike} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
