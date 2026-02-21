"use client"

import { PostCard, type Post } from "./post/PostCard"
import { Stories } from "./Stories"
import { SkeletonFeed } from "@/components/skeleton"
import { useEffect, useState, useRef } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImageIcon, Ghost, Loader2 } from "lucide-react"
import { Modal } from "@/lib/components/modal"
import { GlassButton } from "@/lib/components/glass-button"
import { createPost } from "@/services/post.service"
import type { PostMediaItem, PostMediaType, Post as ApiPost } from "@/apis/post.api"
import * as postService from "@/services/post.service"
import { useAuth } from "@/contexts/AuthContext"

function mapPost(post: ApiPost): Post {
  return {
    id: post.id,
    user: {
      name: post.user?.name || "You",
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


export function Feed() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [draftContent, setDraftContent] = useState("")
  const [draftMedia, setDraftMedia] = useState<Array<PostMediaItem & { previewUrl: string }>>([])
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number>(0)
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hideLoader, setHideLoader] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // If initially loading or fetching more, we don't need to re-attach observer yet, 
    // BUT we must ensure we attach it when loading finishes.
    // Actually, always observing loaderRef is safer, conditional logic inside callback.
    if (isLoading || isFetchingMore || hideLoader) return; 

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      {
        root: null,
        rootMargin: "100px",  // Adjust margin if needed
        threshold: 0
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading, isFetchingMore, hideLoader]);

  // Reset hideLoader when scrolling away from bottom
  useEffect(() => {
    if (!hideLoader) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      // If user scrolls up (distance to bottom > 300px), show loader again so it can trigger next time they scroll down
      if (scrollHeight - scrollTop - clientHeight > 300) {
        setHideLoader(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideLoader]);

  const loadMorePosts = async () => {
    if (isFetchingMore) return;
    setIsFetchingMore(true);
    try {
      const response = await postService.getUnseenPosts(5, 1);
      const newItems = response.data.items;

      if (newItems.length === 0) {
        setHideLoader(true);
        return;
      }

      setPosts(prev => [...prev, ...newItems.map(mapPost)]);
      
      // If we successfully loaded posts, ensure loader is visible for next batch
      setHideLoader(false);
      
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsFetchingMore(false);
    }
  }

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const response = await postService.getUnseenPosts(5, 1);
      // console.log("response", response);

      setPosts(response.data.items.map(mapPost));
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = (postId: string) => {
    postService.likePost(postId);
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, has_liked: !post.has_liked, likes: post.likes + (post.has_liked ? -1 : 1) } : post,
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

      const uiPost: Post = {
        id: created.id,
        user: {
          name: created.user?.name || created.user?.username || "You",
          avatar_url: created.user?.avatar_url || "/avatar-default.jpg",
        },
        timestamp: "just now",
        content: created.content,
        media: created.post_media,
        likes: 0,
        comments: 0,
        shares: 0,
        has_liked: false,
      }

      setPosts([uiPost, ...posts])
      setIsCreateOpen(false)
      resetCreateForm()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWheel = (e: any) => {
    console.log("handleWheel", e.deltaY)
    if (hideLoader && e.deltaY > 0) {
      setHideLoader(false)
    }
  }

  return (
    <div className="space-y-4" onWheel={handleWheel}>
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
              <AvatarImage src={user?.avatar_url || "/avatar-default.jpg"} alt="You" />
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
            <GlassButton
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation()
                setIsCreateOpen(true)
              }}
            >
              <ImageIcon className="h-4 w-4" />
              Photo
            </GlassButton>
            <GlassButton
              variant="primary"
              size="sm"
              className="bg-[var(--brand-primary)]/80 hover:bg-[var(--brand-primary)] border-[var(--brand-primary)]/40 text-black/80 font-semibold"
              onClick={(e) => {
                e.stopPropagation()
                setIsCreateOpen(true)
              }}
              disabled
            >
              Post
            </GlassButton>
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
      <div className="space-y-4">
        {isLoading ? (
          <SkeletonFeed count={5} />
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-white/5 p-6 rounded-full mb-4 backdrop-blur-xl border border-white/10 shadow-lg ring-1 ring-white/5">
              <Ghost className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="text-xl font-semibold text-white/90 mb-2">No posts yet</h3>
            <p className="text-white/50 max-w-[280px] leading-relaxed">
              Your feed is quiet for now. Follow more people or create a new post to get started!
            </p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <div key={post.id} id={post.id}>
                <PostCard post={post} onLike={handleLike} />
              </div>
            ))}
            {isFetchingMore && <SkeletonFeed count={1} />}
          </>
        )}
      </div>
      <div 
        ref={loaderRef} 
        className={`flex items-center justify-center p-4 py-6 ${hideLoader ? 'hidden' : ''}`}
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-sm">
          <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
          <span className="text-sm font-medium text-white/60">Loading more...</span>
        </div>
      </div>
    </div>
  )
}
