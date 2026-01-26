"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, X, Upload, Image as ImageIcon, Video } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { createStory, getStoryFriends, getStories } from "@/services/story.service"
import { formatTime } from "@/utils/format"
import type { StoryFriend, Story as StoryApi } from "@/apis/story.api"
import { playHlsPreview } from "@/lib/hls"
import { SkeletonStories } from "@/components/skeleton"
import { ModalStory } from "@/components/ModalStory"

interface StoryItem {
  id: string
  username: string
  name: string
  avatar: string
  image: string
  timestamp: string
  hasViewed: boolean
  storyCount: number
  latest_story_media_url?: string
  latest_story_media_type?: string
}

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
  const router = useRouter()
  const [stories, setStories] = useState<StoryItem[]>([])
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
  const cacheUserStories = useRef<Record<string, StoryApi[]>>({})

  // Fetch stories from API
  const fetchStories = async () => {
    try {
      setIsLoading(true)
      const response = await getStoryFriends(1, 20)
      const storyFriends: StoryFriend[] = response.data.items || []
      console.log(storyFriends)
      // Map StoryFriend to StoryItem format
      const mappedStories: StoryItem[] = storyFriends.map((friend) => ({
        id: friend.id,
        username: friend.username,
        name: friend.name,
        avatar: friend.avatar_url || "/avatar-default.jpg",
        image: friend.avatar_url || "/placeholder.svg", // Using avatar as placeholder for story image
        timestamp: formatTime(friend.lastest_story_time),
        hasViewed: false, // TODO: Implement viewed status from API if available
        storyCount: friend.story_count,
        latest_story_media_url: friend.latest_story_media_url || '',
        latest_story_media_type: friend.latest_story_media_type || 'video',
      }))
      console.log(mappedStories)
      setStories(mappedStories)
    } catch (error) {
      console.error("Fetch stories failed:", error)
      setStories([])
    } finally {
      setIsLoading(false)
    }
  }

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
      setUploadError("Please select an image (JPEG, PNG, WebP) or video (MP4, WebM)")
      return
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      setUploadError("File size must be less than 50MB")
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
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        video.currentTime = 0.1
      }
      video.onloadeddata = () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          setPreview(canvas.toDataURL())
        }
      }
      video.src = URL.createObjectURL(file)
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
        "Failed to upload story. Please try again."
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
      let storiesData: StoryApi[] = []
      
      // Check cache first
      if (cacheUserStories.current[userId]) {
        storiesData = cacheUserStories.current[userId]
      } else {
        // Fetch if not in cache
        const response = await getStories(userId)
        storiesData = response.data.stories || []
        // Save to cache
        cacheUserStories.current[userId] = storiesData
      }
      
      if (storiesData.length > 0) {
        const firstStory = storiesData[0]
        if (firstStory.media_type === 'video' && firstStory.streaming_url) {
          const publicId = extractPublicId(firstStory.streaming_url)
          if (publicId && previewVideoRef.current) {
            previewRef.current = playHlsPreview(previewVideoRef.current, publicId)
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch story for preview:", error)
    }
  }

  const onLeave = () => {
    previewRef.current?.stop()
    previewRef.current = null
  }
  
  return (
    <>
      {/* Stories Container */}
      <div className="backdrop-blur-3xl bg-white/6 border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/8 mb-6 p-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
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
                <span className="text-xs text-white font-semibold mt-1">Add</span>
              </div>
            </div>
            <p className="text-xs text-center text-white font-medium mt-2">Your Story</p>
          </div>

          {/* Story Items */}
          {isLoading ? (
            <SkeletonStories count={5} />
          ) : stories.length > 0 ? (
            stories.map((story) => (
              <div
                key={story.id}
                className="flex-shrink-0 cursor-pointer group"
                onMouseEnter={() => onHover(story.id)}
                onMouseLeave={onLeave}
                onClick={() => {
                  router.push(`/stories/${story.username}`)
                }}
              >
                <div
                  className={`relative h-24 w-20 rounded-lg overflow-hidden ring-2 transition-all ${!story.hasViewed ? "" : "ring-white/30"}`}
                  style={!story.hasViewed ? { 
                    '--tw-ring-color': 'var(--brand-primary)',
                    ringColor: 'var(--brand-primary)'
                  } as React.CSSProperties & { ringColor?: string } : {}}
                >
                  <img
                    src={story.latest_story_media_url 
                      ? cdnUrl(story.latest_story_media_url || '', story.latest_story_media_type || 'video')
                      : story.image || "/placeholder.svg"}
                    alt={story.username}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Avatar 
                    className="h-6 w-6 ring-2 ring-offset-1"
                    style={{ 
                      '--tw-ring-color': 'color-mix(in srgb, var(--brand-primary) 50%, transparent)',
                      ringColor: 'color-mix(in srgb, var(--brand-primary) 50%, transparent)'
                    } as React.CSSProperties & { ringColor?: string }}
                  >
                    <AvatarImage src={story.avatar || "/avatar-default.jpg"} alt={story.username} />
                    <AvatarFallback>{story.username[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-xs text-center text-white font-medium mt-1 truncate">{story.name}</p>
              </div>
            ))
          ) : (
            <div className="flex-shrink-0">
              <p className="text-xs text-center text-white/50 font-medium">No stories</p>
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
        storyFriend={selectedStory ? stories.find((s) => s.id === selectedStory) || null : null}
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
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-black rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-white text-lg font-semibold">Create Story</h2>
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
                    <p className="text-white text-center mb-2">Upload Photo or Video</p>
                    <p className="text-white/60 text-sm text-center mb-6">
                      Share a photo or video as your story
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/webm"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="story-file-input"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-white rounded-lg"
                      style={{
                        background: 'linear-gradient(to right, var(--brand-primary), var(--brand-primary-dark))'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, var(--brand-primary-dark), var(--brand-primary))'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, var(--brand-primary), var(--brand-primary-dark))'
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select File
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Preview */}
                  <div className="mb-4 rounded-lg overflow-hidden bg-black">
                    {selectedFile.type.startsWith('image/') ? (
                      <img
                        src={preview || ""}
                        alt="Preview"
                        className="w-full max-h-96 object-contain"
                      />
                    ) : (
                      <div className="relative">
                        <img
                          src={preview || ""}
                          alt="Video preview"
                          className="w-full max-h-96 object-contain"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Video className="h-16 w-16 text-white/80" />
                        </div>
                      </div>
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
                    <Button
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
                      className="flex-1 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                    >
                      Change
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="flex-1 text-white rounded-lg disabled:opacity-50"
                      style={{
                        background: 'linear-gradient(to right, var(--brand-primary), var(--brand-primary-dark))'
                      }}
                      onMouseEnter={(e) => {
                        if (!isUploading) {
                          e.currentTarget.style.background = 'linear-gradient(to right, var(--brand-primary-dark), var(--brand-primary))'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isUploading) {
                          e.currentTarget.style.background = 'linear-gradient(to right, var(--brand-primary), var(--brand-primary-dark))'
                        }
                      }}
                    >
                      {isUploading ? "Uploading..." : "Upload Story"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
