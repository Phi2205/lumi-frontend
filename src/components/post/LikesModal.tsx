"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Modal } from "@/lib/components/modal"
import { Skeleton } from "@/components/skeleton"
import { getLikes } from "@/services/post.service"
import type { Like } from "@/apis/post.api"

interface LikesModalProps {
  postId: string
  totalLikes: number
  onClose: () => void
}

const PAGE_SIZE = 20

// Skeleton row — mirrors the real user row layout
const SkeletonLikeRow = () => (
  <div className="flex items-center gap-3 px-6 py-3">
    <Skeleton width="w-10" height="h-10" rounded="rounded-full" />
    <div className="flex-1">
      <Skeleton width="w-32" height="h-4" rounded="rounded" />
    </div>
    <Skeleton width="w-4" height="h-4" rounded="rounded-full" />
  </div>
)

const SkeletonLikeList = ({ count = 6 }: { count?: number }) => (
  <div>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonLikeRow key={i} />
    ))}
  </div>
)

export function LikesModal({ postId, totalLikes, onClose }: LikesModalProps) {
  const [likes, setLikes] = useState<Like[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const observerRef = useRef<HTMLDivElement | null>(null)

  const fetchLikes = useCallback(
    async (pageNum: number) => {
      if (pageNum === 1) setInitialLoading(true)
      else setLoadingMore(true)

      try {
        const res = await getLikes(postId, PAGE_SIZE, pageNum)
        const items: Like[] = (res?.data as any)?.items ?? []
        setLikes((prev) => (pageNum === 1 ? items : [...prev, ...items]))
        setHasMore(items.length === PAGE_SIZE)
      } catch {
        setHasMore(false)
      } finally {
        setInitialLoading(false)
        setLoadingMore(false)
      }
    },
    [postId]
  )

  // Initial fetch
  useEffect(() => {
    fetchLikes(1)
  }, [fetchLikes])

  // Infinite scroll sentinel
  useEffect(() => {
    if (!hasMore || loadingMore || initialLoading) return
    const sentinel = observerRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => {
            const next = p + 1
            fetchLikes(next)
            return next
          })
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, initialLoading, fetchLikes])

  const title = (
    <div className="flex items-center gap-2">
      <ThumbsUp className="h-4 w-4 text-blue-400 fill-blue-400" />
      <span>
        {totalLikes.toLocaleString()} {totalLikes === 1 ? "Like" : "Likes"}
      </span>
    </div>
  )

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={title}
      maxWidthClassName="max-w-sm"
      closeOnOverlayClick
    >
      {/* Scrollable list */}
      <div className="overflow-y-auto -mx-6 -my-5" style={{ height: "55vh" }}>

        {/* Initial loading → skeleton list */}
        {initialLoading && <SkeletonLikeList count={6} />}

        {/* Empty state */}
        {!initialLoading && likes.length === 0 && (
          <p className="text-center text-white/40 text-sm py-10 px-4">
            No likes yet. Be the first! 👍
          </p>
        )}

        {/* Loaded rows */}
        {!initialLoading &&
          likes.map((like) => (
            <div
              key={like.user_id}
              className="flex items-center gap-3 px-6 py-3 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage
                  src={like.user.avatar_url ?? undefined}
                  alt={like.user.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold">
                  {like.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-medium truncate">
                  {like.user.name}
                </p>
                {/* <p className="text-white/40 text-xs truncate">
                  @{like.user.username}
                </p> */}
              </div>
              <ThumbsUp className="h-3.5 w-3.5 text-blue-400 fill-blue-400 shrink-0 opacity-70" />
            </div>
          ))}

        {/* Infinite scroll sentinel */}
        {hasMore && !initialLoading && <div ref={observerRef} className="h-4" />}

        {/* Load-more skeleton (pagination) */}
        {loadingMore && <SkeletonLikeList count={3} />}

        {/* End of list */}
        {!hasMore && !initialLoading && likes.length > 0 && (
          <p className="text-center text-white/25 text-xs py-3">
            That's everyone ✨
          </p>
        )}
      </div>
    </Modal>
  )
}
