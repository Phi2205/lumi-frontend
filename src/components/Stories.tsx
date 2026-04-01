"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import { Plus, X, Upload, Image as ImageIcon, Video, ChevronRight, ChevronLeft } from "lucide-react"
import { GlassButton } from "@/lib/components/glass-button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { createStory, getStoryFriends, getStories } from "@/services/story.service"
import { formatTime } from "@/utils/format"
import type { StoryFriend, Story as StoryApi } from "@/apis/story.api"
import { playHlsPreview } from "@/lib/hls"
import { SkeletonStories } from "@/components/skeleton"
import { ModalStory } from "@/components/ModalStory"
import type { User } from "@/types/user.type"
import { useStoryContext } from "@/contexts/StoryContext"
import { StoryAvatar } from "@/components/ui/avatar"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"

const cdnUrl = (publicId: string, mediaType: string) => {
  console.log(publicId, mediaType);
  if (mediaType == 'video') {
    return `https://res.cloudinary.com/dibvkarvg/video/upload/so_0/${publicId}.jpg`
  } else {
    return `https://res.cloudinary.com/dibvkarvg/image/upload/v1769332463/${publicId}.jpg`
  }
}

const cdnUrlImage = (publicId: string) => {
  return `https://res.cloudinary.com/dibvkarvg/image/upload/v1769332463/${publicId}.jpg`
}

// Dynamic import for HLS.js to avoid SSR issues
// Note: Make sure to install hls.js: npm install hls.js
let Hls: any = null
if (typeof window !== 'undefined') {
  // @ts-ignore - hls.js module may not be installed yet
  import('hls.js').then((module: any) => {
    Hls = module.default
  }).catch(() => {
    console.warn('HLS.js not available. Please install: npm install hls.js')
  })
}

export function Stories() {
  const { t } = useTranslation()
  const router = useRouter()
  const storyCtx = useStoryContext()
  const [stories, setStories] = useState<StoryFriend[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStory, setSelectedStory] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [userStories, setUserStories] = useState<StoryApi[]>([])
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [isLoadingUserStories, setIsLoadingUserStories] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewVideoRef = useRef<HTMLVideoElement>(null)
  const previewRef = useRef<{ stop: () => void } | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const cacheUserStories = useRef<Record<string, StoryApi[]>>({})
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  // Fetch stories from API
  const fetchStories = async (p: number = 1, append: boolean = false) => {
    try {
      if (append) setIsLoadingMore(true)
      else setIsLoading(true)

      const response = await getStoryFriends(p, 20)
      const storyFriends: StoryFriend[] = response.data.items || []
      const pagination = response.data.pagination

      if (append) {
        setStories(prev => [...prev, ...storyFriends])
      } else {
        setStories(storyFriends)
      }

      setHasMore(p < pagination.totalPages)
      setPage(p)
    } catch (error) {
      console.error("Fetch stories failed:", error)
      if (!append) setStories([])
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      fetchStories(page + 1, true)
    }
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      const scrollAmount = 400

      // If moving right and nearing the end of current list, fetch more if available
      if (direction === 'right' && hasMore && !isLoadingMore) {
        // If we're within 150px of the end
        if (scrollLeft + clientWidth >= scrollWidth - 150) {
          handleLoadMore()
        }
      }

      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })

      // The scroll listener will update the arrows
    }
  }

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 5)
      // Allow scroll right if there is content to the right OR if we can load more
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5 || hasMore)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      checkScroll()
    }, 500) // Small delay to let initial list render
    return () => clearTimeout(timer)
  }, [stories, hasMore])

  useEffect(() => {
    fetchStories()
  }, [])

  // Fetch user stories when a story is selected
  useEffect(() => {
    const fetchUserStories = async () => {
      if (!selectedUserId) return
      console.log(cacheUserStories.current)
      // Check cache first
      if (cacheUserStories.current[selectedUserId]) {
        setUserStories(cacheUserStories.current[selectedUserId])
        setCurrentStoryIndex(0)
        return
      }

      try {
        setIsLoadingUserStories(true)
        const response = await getStories(selectedUserId)
        const storiesData = response.data.stories || []

        // Save to cache
        cacheUserStories.current[selectedUserId] = storiesData

        setUserStories(storiesData)
        setCurrentStoryIndex(0)
      } catch (error) {
        console.error("Fetch user stories failed:", error)
        setUserStories([])
      } finally {
        setIsLoadingUserStories(false)
      }
    }

    fetchUserStories()
  }, [selectedUserId])


  const handleAddStoryClick = () => {
    setIsCreateModalOpen(true)
    setSelectedFile(null)
    setPreview(null)
    setUploadError("")
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
    if (!validTypes.includes(file.type)) {
      setUploadError(t('stories.invalid_type'))
      return
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      setUploadError(t('stories.file_too_large'))
      return
    }

    setSelectedFile(file)
    setUploadError("")

    // Create preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      // Use Object URL for video to allow playing the actual video file
      const url = URL.createObjectURL(file)
      setPreview(url)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadError("")

    try {
      await createStory(selectedFile)
      // Close modal and refresh stories
      setIsCreateModalOpen(false)
      setSelectedFile(null)
      setPreview(null)
      // Refresh stories list
      await fetchStories()
    } catch (error: any) {
      console.error("Upload story error:", error)
      setUploadError(
        error?.response?.data?.message ||
        error?.message ||
        t('stories.upload_failed')
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleCloseModal = () => {
    if (!isUploading) {
      setIsCreateModalOpen(false)
      setSelectedFile(null)
      setPreview(null)
      setUploadError("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Extract public_id from streaming_url
  const extractPublicId = (streamingUrl: string): string | null => {
    try {
      // Format: https://res.cloudinary.com/dibvkarvg/video/upload/sp_auto/{publicId}.m3u8
      const match = streamingUrl.match(/\/upload\/sp_auto\/([^\/]+)\.m3u8/)
      if (match && match[1]) {
        return match[1]
      }
      // Fallback: try to extract from other formats
      const match2 = streamingUrl.match(/\/upload\/([^\/]+)\.m3u8/)
      if (match2 && match2[1]) {
        return match2[1]
      }
      return null
    } catch {
      return null
    }
  }

  const onHover = async (userId: string) => {
    try {
      // Find the story in our already-fetched state
      const storyFriend = stories.find(s => s.user.id === userId)
      if (!storyFriend || !storyFriend.stories || storyFriend.stories.length === 0) return

      const storiesData = storyFriend.stories
      const firstStory = storiesData[0]

      if (firstStory.media_type === 'video' && firstStory.streaming_url) {
        // 1. Play the tiny hidden preview if possible
        const publicId = extractPublicId(firstStory.streaming_url)
        if (publicId && previewVideoRef.current) {
          previewRef.current = playHlsPreview(previewVideoRef.current, publicId)
        }

        // 2. Prefetch the HLS stream for the actual viewer
        // This populates the browser cache so it's ready when navigating
        if (Hls && Hls.isSupported()) {
          const hls = new Hls({ enableWorker: true })
          hls.loadSource(firstStory.streaming_url)
          // Just loading the source triggers manifest and segment prefetching
          // We don't need to attach it to an element
          // We can destroy it after some time or keep it briefly
          setTimeout(() => hls.destroy(), 10000)
        }
      }
    } catch (error) {
      console.error("Failed to prepare story preview:", error)
    }
  }

  const onLeave = () => {
    previewRef.current?.stop()
    previewRef.current = null
  }

  return (
    <>
      {/* Stories Container */}
      <div className="relative group/stories backdrop-blur-3xl bg-white/6 border border-white/20 rounded-2xl shadow-xl transition-all duration-300 hover:bg-white/8 mb-6 p-4 overflow-hidden">
        {/* Navigation Buttons - Desktop Only */}
        {canScrollLeft && (
          <button
            className="hidden md:flex absolute left-2 top-11 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 items-center justify-center opacity-0 group-hover/stories:opacity-100 transition-all shadow-lg active:scale-95 cursor-pointer"
            onClick={() => handleScroll('left')}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        {canScrollRight && (
          <button
            className="hidden md:flex absolute right-2 top-11 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 items-center justify-center opacity-0 group-hover/stories:opacity-100 transition-all shadow-lg active:scale-95 cursor-pointer"
            onClick={() => handleScroll('right')}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
          onScroll={checkScroll}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style dangerouslySetInnerHTML={{
            __html: `
            @media (min-width: 768px) {
              .flex::-webkit-scrollbar {
                display: none;
              }
            }
          `}} />

          {/* Add Story Card */}
          <div className="flex-shrink-0">
            <div
              className="relative h-24 w-20 rounded-lg overflow-hidden border-2 border-white/30 flex items-center justify-center cursor-pointer hover:border-white/50 transition-all"
              style={{
                background: 'linear-gradient(to bottom right, color-mix(in srgb, var(--brand-primary) 30%, transparent), color-mix(in srgb, var(--brand-primary) 30%, transparent))'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to bottom right, color-mix(in srgb, var(--brand-primary) 40%, transparent), color-mix(in srgb, var(--brand-primary) 40%, transparent))'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to bottom right, color-mix(in srgb, var(--brand-primary) 30%, transparent), color-mix(in srgb, var(--brand-primary) 30%, transparent))'
              }}
              onClick={handleAddStoryClick}
            >
              <div className="flex flex-col items-center">
                <Plus className="h-6 w-6 text-white" />
                <span className="text-xs text-white font-semibold mt-1">{t('stories.add')}</span>
              </div>
            </div>
            <p className="text-xs text-center text-white font-medium mt-2">{t('stories.your_story')}</p>
          </div>

          {/* Story Items */}
          {isLoading ? (
            <SkeletonStories count={5} />
          ) : stories.length > 0 ? (
            stories.map((story) => {
              const latestStory = story.stories && story.stories.length > 0 ? story.stories[0] : null
              return (
                <div
                  key={story.user.id}
                  className="flex-shrink-0 cursor-pointer group"
                  onMouseEnter={() => onHover(story.user.id)}
                  onMouseLeave={onLeave}
                  onClick={() => {
                    if (storyCtx) {
                      storyCtx.setStoryData({ friends: stories })
                    }
                    router.push(`/stories/${story.user.username}`)
                  }}
                >
                  <div
                    className={`relative h-24 w-20 rounded-lg overflow-hidden ring-2 transition-all ${!story.has_unseen ? "ring-white/30" : ""}`}
                    style={story.has_unseen ? {
                      '--tw-ring-color': 'var(--brand-primary)',
                      ringColor: 'var(--brand-primary)'
                    } as React.CSSProperties & { ringColor?: string } : {}}
                  >
                    <img
                      src={latestStory
                        ? cdnUrl(latestStory.media_url || '', latestStory.media_type || 'video')
                        : story.user.avatar_url || "/avatar-default.jpg"}
                      alt={story.user.username}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <StoryAvatar
                      src={story.user.avatar_url || "/avatar-default.jpg"}
                      alt={story.user.username}
                      className="h-6 w-6"
                      hasStory={story.stories && story.stories.length > 0}
                      isSeen={!story.has_unseen}
                      username={story.user.username}
                    />
                  </div>
                  <p className="text-xs text-center text-white font-medium mt-1 truncate">{story.user.name}</p>
                </div>
              )
            })
          ) : (
            <div className="flex-shrink-0">
              <p className="text-xs text-center text-white/50 font-medium">{t('stories.no_stories')}</p>
            </div>
          )}

          {/* Load More Button - Mobile Only */}
          {hasMore && stories.length > 0 && !isLoading && (
            <div className="flex-shrink-0 md:hidden">
              <div
                className="relative h-24 w-20 rounded-lg overflow-hidden border-2 border-white/20 flex items-center justify-center cursor-pointer hover:border-white/40 transition-all bg-white/5"
                onClick={handleLoadMore}
              >
                {isLoadingMore ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <div className="flex flex-col items-center">
                    <ChevronRight className="h-6 w-6 text-white/80" />
                    <span className="text-[10px] text-white/60 font-semibold mt-1">{t('stories.more')}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-center text-white/50 font-medium mt-2">{t('stories.see_more')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden video element for preview */}
      <video
        ref={previewVideoRef}
        className="hidden"
        style={{ display: 'none' }}
      />

      {/* Story Modal */}
      <ModalStory
        isOpen={!!selectedStory && !!selectedUserId}
        storyFriend={selectedStory ? (() => {
          const s = stories.find((s) => s.user.id === selectedStory);
          if (!s) return null;
          return {
            id: s.user.id,
            username: s.user.username,
            name: s.user.name,
            avatar: s.user.avatar_url || "/avatar-default.jpg"
          };
        })() : null}
        userStories={userStories}
        currentStoryIndex={currentStoryIndex}
        isLoadingUserStories={isLoadingUserStories}
        onClose={() => {
          setSelectedStory(null)
          setSelectedUserId(null)
          setUserStories([])
          setCurrentStoryIndex(0)
        }}
        onPrevious={() => {
          if (currentStoryIndex > 0) {
            setCurrentStoryIndex(currentStoryIndex - 1)
          }
        }}
        onNext={() => {
          if (currentStoryIndex < userStories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1)
          }
        }}
      />

      {/* Create Story Modal */}
      {isCreateModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-black/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-white text-lg font-semibold">{t('stories.create_story')}</h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
                onClick={handleCloseModal}
                disabled={isUploading}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!selectedFile ? (
                <>
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="mb-4 p-6 rounded-full bg-white/10">
                      <Upload className="h-12 w-12 text-white/80" />
                    </div>
                    <p className="text-white text-center mb-2">{t('stories.upload_desc')}</p>
                    <p className="text-white/60 text-sm text-center mb-6">
                      {t('stories.share_desc')}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/webm"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="story-file-input"
                    />
                    <GlassButton
                      onClick={() => fileInputRef.current?.click()}
                      className="text-white min-w-[140px]"
                      variant="primary"
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      {t('stories.select_file')}
                    </GlassButton>
                  </div>
                </>
              ) : (
                <>
                  {/* Preview */}
                  <div className="mb-4 rounded-lg overflow-hidden bg-black max-h-96 flex items-center justify-center">
                    {selectedFile.type.startsWith('image/') ? (
                      <img
                        src={preview || ""}
                        alt="Preview"
                        className="w-full max-h-96 object-contain"
                      />
                    ) : (
                      <video
                        src={preview || ""}
                        className="w-full max-h-96 object-contain"
                        controls
                        autoPlay
                        muted
                        loop
                      />
                    )}
                  </div>

                  {/* File Info */}
                  <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      {selectedFile.type.startsWith('image/') ? (
                        <ImageIcon className="h-4 w-4 text-white/60" />
                      ) : (
                        <Video className="h-4 w-4 text-white/60" />
                      )}
                      <span className="text-white text-sm font-medium">
                        {selectedFile.name}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  {/* Error Message */}
                  {uploadError && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                      <p className="text-red-300 text-sm">{uploadError}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <GlassButton
                      variant="ghost"
                      onClick={() => {
                        setSelectedFile(null)
                        setPreview(null)
                        setUploadError("")
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ""
                        }
                      }}
                      disabled={isUploading}
                      className="flex-1 text-white/60 hover:text-white"
                    >
                      {t('stories.change')}
                    </GlassButton>
                    <GlassButton
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="flex-1 text-white"
                      variant="primary"
                    >
                      {isUploading ? t('stories.uploading') : t('stories.upload_story')}
                    </GlassButton>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
