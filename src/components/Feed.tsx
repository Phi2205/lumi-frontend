"use client"

import { PostCard, type Post } from "./PostCard"
import { Stories } from "./Stories"
import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"
import { Modal } from "@/lib/components/modal"
import { createPost } from "@/services/post.service"
import type { PostMediaItem, PostMediaType } from "@/apis/post.api"

const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg",
    },
    timestamp: "2 hours ago",
    content:
      "Just finished an amazing hike in the mountains! The views were absolutely breathtaking. Can't wait to explore more trails this season.",
    image: "/bg3.jpg",
    images: ["/bg3.jpg", "/bg12.jpg", "/bg7.jpg"],
    likes: 234,
    comments: 12,
    hasLiked: false,
  },
  {
    id: "2",
    author: {
      name: "Mike Johnson",
      avatar: "/placeholder.svg",
    },
    timestamp: "4 hours ago",
    content:
      "Excited to announce that I've just launched my new project! Check it out and let me know what you think. Your feedback means a lot to me.",
    image: "/bg3.jpg",
    images: ["/bg3.jpg", "/bg8.jpg", "/bg9.jpg", "/bg10.jpg"],
    likes: 567,
    comments: 34,
    hasLiked: false,
  },
  {
    id: "3",
    author: {
      name: "Emma Davis",
      avatar: "/placeholder.svg",
    },
    timestamp: "6 hours ago",
    content:
      "Coffee and creativity - the perfect combination for a productive morning! What's your go-to productivity hack?",
    image: "/bg3.jpg",
    images: ["/bg3.jpg", "/bg6.jpg", "/bg11.jpg", "/bg2.jpg", "/bg4.jpg"],
    likes: 189,
    comments: 8,
    hasLiked: true,
  },
  {
    id: "4",
    author: {
      name: "Alex Rivera",
      avatar: "/placeholder.svg",
    },
    timestamp: "8 hours ago",
    content:
      "Grateful for amazing friends who celebrate wins and support through challenges. Here's to the people who make life better!",
    image: "/bg3.jpg",
    images: ["/bg3.jpg", "/bg5.jpg", "/bg1.jpg"],
    likes: 445,
    comments: 22,
    hasLiked: false,
  },
]

export function Feed() {
  const [posts, setPosts] = useState(mockPosts)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [draftContent, setDraftContent] = useState("")
  const [draftMedia, setDraftMedia] = useState<Array<PostMediaItem & { previewUrl: string }>>([])
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number>(0)

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, hasLiked: !post.hasLiked, likes: post.likes + (post.hasLiked ? -1 : 1) } : post,
      ),
    )
  }

  const resetCreateForm = () => {
    setDraftContent("")
    // cleanup object URLs
    draftMedia.forEach((m) => URL.revokeObjectURL(m.previewUrl))
    setDraftMedia([])
    setSelectedMediaIndex(0)
  }

  const detectMediaType = (file: File): PostMediaType => {
    if (file.type?.startsWith("video/")) return "video"
    return "image"
  }

  const handlePickFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const startOrder = draftMedia.length
    const next: Array<PostMediaItem & { previewUrl: string }> = Array.from(files).map((file, idx) => ({
      file,
      media_type: detectMediaType(file),
      order: startOrder + idx,
      previewUrl: URL.createObjectURL(file),
    }))
    setDraftMedia([...draftMedia, ...next])
    // nếu chưa có media thì chọn item đầu tiên
    if (draftMedia.length === 0) setSelectedMediaIndex(0)
  }

  const handleRemoveMedia = (order: number) => {
    const removed = draftMedia.find((m) => m.order === order)
    if (removed) URL.revokeObjectURL(removed.previewUrl)
    const next = draftMedia.filter((m) => m.order !== order).map((m, idx) => ({ ...m, order: idx }))
    setDraftMedia(next)
    // adjust selected index to stay in range
    setSelectedMediaIndex((prev) => {
      const max = Math.max(0, next.length - 1)
      return Math.min(prev, max)
    })
  }

  const handlePostSubmit = async () => {
    if (!draftContent.trim() && draftMedia.length === 0) return
    try {
      setIsSubmitting(true)
      const res = await createPost(
        draftContent.trim(),
        draftMedia.map(({ previewUrl: _previewUrl, ...m }, idx) => ({ ...m, order: idx })),
      )
      const created = res.data

      const firstImage = created.post_media.find((m) => m.media_type === "image")?.media_url

      const uiPost: Post = {
        id: created.id,
        author: {
          name: created.user?.name || created.user?.username || "You",
          avatar: created.user?.avatar_url || "/placeholder.svg",
        },
        timestamp: "just now",
        content: created.content,
        image: firstImage,
        likes: 0,
        comments: 0,
        hasLiked: false,
      }

      setPosts([uiPost, ...posts])
      setIsCreateOpen(false)
      resetCreateForm()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Stories Section */}
      <Stories />

      {/* Create Post Card */}
      <div
        className="backdrop-blur-3xl bg-white/6 border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/8 p-4 cursor-pointer"
        onClick={() => setIsCreateOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setIsCreateOpen(true)
        }}
      >
        <div className="space-y-4">
          {/* User Input Section */}
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-blue-400/50">
              <AvatarImage src="/placeholder.svg" alt="You" />
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <Input
              placeholder="What's on your mind?"
              value=""
              readOnly
              onFocus={() => setIsCreateOpen(true)}
              className="flex-1 rounded-full border-white/20 backdrop-blur-2xl bg-white/5 border border-white/15 placeholder:text-white/50 text-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2 pl-13">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-white/60 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
              onClick={(e) => {
                e.stopPropagation()
                setIsCreateOpen(true)
              }}
            >
              <ImageIcon className="h-4 w-4" />
              Photo
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 rounded-lg shadow-lg"
              onClick={(e) => {
                e.stopPropagation()
                setIsCreateOpen(true)
              }}
              disabled
            >
              Post
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => {
          if (isSubmitting) return
          setIsCreateOpen(false)
        }}
        title="Create post"
        description="Write something and optionally attach images/videos."
        maxWidthClassName="max-w-[640px]"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => {
                if (isSubmitting) return
                setIsCreateOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
              onClick={handlePostSubmit}
              disabled={isSubmitting || (!draftContent.trim() && draftMedia.length === 0)}
            >
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex gap-3 items-start">
            <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-blue-400/50">
              <AvatarImage src="/placeholder.svg" alt="You" />
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <textarea
              placeholder="What's on your mind?"
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              className="w-full min-h-[120px] rounded-2xl border border-white/15 bg-white/5 backdrop-blur-2xl p-4 text-white placeholder:text-white/40 outline-none focus:border-white/25"
            />
          </div>

          <div className="rounded-2xl border border-white/12 bg-white/4 backdrop-blur-2xl p-4">
            <div className="text-sm font-medium text-white mb-3">Media</div>
            <div className="flex flex-col sm:flex-row gap-2 items-start">
              <label className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 backdrop-blur-2xl px-4 py-2 text-white/90 hover:bg-white/8 cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => {
                    handlePickFiles(e.target.files)
                    // allow re-selecting same file
                    e.currentTarget.value = ""
                  }}
                />
                Choose files
              </label>
              <div className="text-xs text-white/60 pt-2">
                Supported: images/videos. You can select multiple files.
              </div>
            </div>

            {draftMedia.length > 0 && (
              <div className="mt-3 space-y-3">
                {/* Main preview (like FB) */}
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 bg-black/30">
                  {(() => {
                    const selected = draftMedia[Math.min(selectedMediaIndex, draftMedia.length - 1)]
                    if (!selected) return null
                    return selected.media_type === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={selected.previewUrl} alt={selected.file.name} className="w-full h-full object-cover" />
                    ) : (
                      <video src={selected.previewUrl} className="w-full h-full object-cover" controls />
                    )
                  })()}

                  <button
                    type="button"
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 border border-white/15 text-white/90 hover:bg-black/55 backdrop-blur flex items-center justify-center"
                    onClick={() => handleRemoveMedia(draftMedia[Math.min(selectedMediaIndex, draftMedia.length - 1)]?.order)}
                    aria-label="Remove selected media"
                  >
                    ✕
                  </button>
                </div>

                {/* Thumbnails grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {draftMedia.map((m, idx) => (
                    <button
                      key={m.order}
                      type="button"
                      onClick={() => setSelectedMediaIndex(idx)}
                      className={`relative aspect-square rounded-xl overflow-hidden border ${
                        idx === selectedMediaIndex ? "border-white/40 ring-2 ring-white/20" : "border-white/10"
                      } bg-black/25`}
                      aria-label={`Select ${m.file.name}`}
                    >
                      {m.media_type === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.previewUrl} alt={m.file.name} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <video src={m.previewUrl} className="w-full h-full object-cover" muted />
                          <div className="absolute bottom-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white/90">
                            video
                          </div>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Feed Posts */}
      <div className="space-y-2">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={handleLike} />
        ))}
      </div>
    </div>
  )
}
