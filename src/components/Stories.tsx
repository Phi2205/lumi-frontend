"use client"

import { useState, useRef } from "react"
import { Plus, X, Upload, Image as ImageIcon, Video } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { createStory } from "@/services/story.service"

interface Story {
  id: string
  username: string
  avatar: string
  image: string
  timestamp: string
  hasViewed: boolean
}

const mockStories: Story[] = [
  {
    id: "1",
    username: "You",
    avatar: "/placeholder.svg",
    image: "/story-1.jpg",
    timestamp: "Now",
    hasViewed: true,
  },
  {
    id: "2",
    username: "Sarah Chen",
    avatar: "/placeholder.svg",
    image: "/story-2.jpg",
    timestamp: "2h",
    hasViewed: false,
  },
  {
    id: "3",
    username: "Mike Johnson",
    avatar: "/placeholder.svg",
    image: "/story-3.jpg",
    timestamp: "4h",
    hasViewed: true,
  },
  {
    id: "4",
    username: "Emma Davis",
    avatar: "/placeholder.svg",
    image: "/story-4.jpg",
    timestamp: "6h",
    hasViewed: false,
  },
  {
    id: "5",
    username: "Alex Rivera",
    avatar: "/placeholder.svg",
    image: "/story-5.jpg",
    timestamp: "8h",
    hasViewed: true,
  },
  {
    id: "6",
    username: "Julia Anderson",
    avatar: "/placeholder.svg",
    image: "/story-6.jpg",
    timestamp: "10h",
    hasViewed: false,
  },
]

export function Stories() {
  const [selectedStory, setSelectedStory] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      // TODO: Refresh stories list
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
  
  return (
    <>
      {/* Stories Container */}
      <div className="backdrop-blur-3xl bg-white/6 border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/8 mb-6 p-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {/* Add Story Card */}
          <div className="flex-shrink-0">
            <div 
              className="relative h-24 w-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border-2 border-white/30 flex items-center justify-center cursor-pointer hover:border-white/50 hover:bg-gradient-to-br hover:from-blue-500/40 hover:to-cyan-500/40 transition-all"
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
          {mockStories.slice(1).map((story) => (
            <div
              key={story.id}
              className="flex-shrink-0 cursor-pointer group"
              onClick={() => setSelectedStory(story.id)}
            >
              <div
                className={`relative h-24 w-20 rounded-lg overflow-hidden ring-2 transition-all ${!story.hasViewed ? "ring-blue-400" : "ring-white/30"}`}
              >
                <img
                  src={story.image || "/placeholder.svg"}
                  alt={story.username}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="mt-2 flex items-center justify-center gap-1">
                <Avatar className="h-6 w-6 ring-2 ring-offset-1 ring-blue-400/50">
                  <AvatarImage src={story.avatar || "/placeholder.svg"} alt={story.username} />
                  <AvatarFallback>{story.username[0]}</AvatarFallback>
                </Avatar>
              </div>
              <p className="text-xs text-center text-white font-medium mt-1 truncate">{story.username}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={mockStories.find((s) => s.id === selectedStory)?.image || "/placeholder.svg"}
              alt="Story"
              className="w-full h-full object-cover"
            />

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 ring-2 ring-white/50">
                  <AvatarImage src={mockStories.find((s) => s.id === selectedStory)?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{mockStories.find((s) => s.id === selectedStory)?.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white text-sm font-semibold">
                    {mockStories.find((s) => s.id === selectedStory)?.username}
                  </p>
                  <p className="text-white/70 text-xs">
                    {mockStories.find((s) => s.id === selectedStory)?.timestamp} ago
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
                onClick={() => setSelectedStory(null)}
              >
                ✕
              </Button>
            </div>

            {/* Progress Bars */}
            <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 h-1">
              {mockStories.slice(1).map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-0.5 rounded-full ${
                    index === (Number.parseInt(selectedStory) - 2) ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

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
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 rounded-lg"
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
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 rounded-lg disabled:opacity-50"
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
