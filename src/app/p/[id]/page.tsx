"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, X } from "lucide-react"
import { PostCard, type Post } from "@/components/post/PostCard"
import { getPostById, likePost } from "@/services/post.service"
import type { Post as ApiPost } from "@/apis/post.api"
import { HomeLayout } from "@/components/HomeLayout"

function mapPost(post: ApiPost): Post {
  return {
    id: post.id,
    user: {
      name: post.user?.name || "User",
      avatar_url: post.user?.avatar_url || "/avatar-default.jpg",
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

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleClose = useCallback(() => {
    router.push("/")
  }, [router])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
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
        console.error("Failed to load post:", err)
        if (err?.response?.status === 404) {
          setError("Bài viết không tồn tại hoặc đã bị xóa.")
        } else {
          setError("Không thể tải bài viết. Vui lòng thử lại sau.")
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
    <HomeLayout>
      {/* Modal overlay */}
      <div className="fixed inset-0 z-[100]">
        <style>{`
          @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes modalSlideUp {
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

        {/* Dark backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
          style={{ animation: "modalFadeIn 0.25s ease" }}
        />

        {/* Scrollable content */}
        <div
          className="absolute inset-0 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose()
          }}
        >
          <div
            className="flex min-h-full items-start justify-center px-4 py-10 sm:py-16"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose()
            }}
          >
            <div
              className="w-full max-w-2xl bg-[#242526] rounded-xl overflow-hidden shadow-2xl relative z-[1]"
              style={{ animation: "modalSlideUp 0.35s ease" }}
            >
              {/* Facebook-style header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="w-10" /> {/* Spacer */}
                <h2 className="text-lg font-bold text-white text-center flex-1">
                  {post ? `Bài viết của ${post.user.name}` : "Bài viết"}
                </h2>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Đóng"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Post content */}
              <div>
                {/* Loading */}
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
                      <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                    </div>
                    <p className="text-white/40 text-sm font-medium">
                      Đang tải bài viết...
                    </p>
                  </div>
                )}

                {/* Error */}
                {!isLoading && error && (
                  <div className="flex flex-col items-center justify-center py-32 gap-5">
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
                      <span className="text-3xl">😔</span>
                    </div>
                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-white/90 mb-2">
                        Không tìm thấy bài viết
                      </h2>
                      <p className="text-white/50 text-sm max-w-[320px] leading-relaxed">
                        {error}
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="mt-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Về trang chủ
                    </button>
                  </div>
                )}

                {/* Post card */}
                {!isLoading && !error && post && (
                  <PostCard post={post} onLike={handleLike} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  )
}
