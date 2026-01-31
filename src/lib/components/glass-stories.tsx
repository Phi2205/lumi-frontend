"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { GlassCard } from "./glass-card"

interface Story {
  id: string
  username: string
  avatar: string
  image: string
  timestamp: string
  hasViewed: boolean
}

interface GlassStoriesProps {
  blur?: number
  refraction?: number
  depth?: number
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

export function GlassStories({ 
  blur = 20, 
  refraction = 0.12, 
  depth = 3 
}: GlassStoriesProps) {
  const [selectedStory, setSelectedStory] = useState<string | null>(null)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      {/* Stories Container with Background */}
      <div
        className="min-h-screen bg-cover bg-no-repeat bg-center relative"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(/bg12.jpg)`
        }}
      >

        <div className="relative z-10 p-4 md:p-6">
          <GlassCard variant="lg" className="mb-6" blur={blur} refraction={refraction} depth={depth}>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {/* Add Story Card */}
              <div className="flex-shrink-0">
                <div className="relative h-24 w-20 rounded-xl overflow-hidden backdrop-blur-lg bg-white/10 border-2 border-blue-400/50 flex items-center justify-center cursor-pointer hover:border-blue-400/80 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-500/60 rounded-full p-2 group-hover:bg-blue-500/80 transition-colors">
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs text-white font-semibold mt-2 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                      Add
                    </span>
                  </div>
                </div>
                <p className="text-xs text-center text-white font-medium mt-2 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                  Your Story
                </p>
              </div>

              {/* Story Items */}
              {mockStories.slice(1).map((story) => (
                <div
                  key={story.id}
                  className="flex-shrink-0 cursor-pointer group"
                  onClick={() => setSelectedStory(story.id)}
                >
                  <div
                    className={`relative h-24 w-20 rounded-xl overflow-hidden ${
                      !story.hasViewed
                        ? "ring-2 ring-blue-400/80 ring-offset-2 ring-offset-transparent"
                        : "ring-2 ring-white/30"
                    } transition-all duration-300 group-hover:ring-blue-400/60`}
                  >
                    <img
                      src={story.image || "/placeholder.svg"}
                      alt={story.username}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 backdrop-blur-[1px]"></div>
                  </div>
                  <div className="mt-2 flex items-center justify-center">
                    <div
                      className={`h-8 w-8 rounded-full overflow-hidden ${
                        !story.hasViewed
                          ? "ring-2 ring-blue-400/80"
                          : "ring-2 ring-white/40"
                      } backdrop-blur-lg bg-white/20`}
                    >
                      <img
                        src={story.avatar || "/placeholder.svg"}
                        alt={story.username}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = `<div class="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500/60 to-purple-500/60 text-white text-xs font-bold">${getInitials(story.username)}</div>`
                          }
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-center text-white font-medium mt-1 truncate max-w-[80px] [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                    {story.username}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Stories List Modal */}
      {selectedStory && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden backdrop-blur-3xl bg-white/10 border border-white/20 shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 backdrop-blur-md bg-black/30 border-b border-white/20 p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]">
                Tất cả Stories
              </h2>
              <button
                onClick={() => setSelectedStory(null)}
                className="h-8 w-8 rounded-full backdrop-blur-lg bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-all duration-300 flex items-center justify-center [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Stories Grid */}
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockStories.slice(1).map((story) => (
                  <div
                    key={story.id}
                    className={`group cursor-pointer rounded-xl overflow-hidden backdrop-blur-lg bg-white/10 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      !story.hasViewed
                        ? "border-blue-400/60 ring-2 ring-blue-400/40"
                        : "border-white/30"
                    } ${selectedStory === story.id ? "ring-4 ring-blue-400/60" : ""}`}
                    onClick={() => setSelectedStory(story.id)}
                  >
                    {/* Story Image */}
                    <div className="relative aspect-[9/16] overflow-hidden">
                      <img
                        src={story.image || "/placeholder.svg"}
                        alt={story.username}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      {/* Story Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`h-10 w-10 rounded-full overflow-hidden ring-2 ${
                              !story.hasViewed ? "ring-blue-400/80" : "ring-white/50"
                            } backdrop-blur-lg bg-white/20`}
                          >
                            <img
                              src={story.avatar || "/placeholder.svg"}
                              alt={story.username}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = "none"
                                const parent = target.parentElement
                                if (parent) {
                                  parent.innerHTML = `<div class="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500/60 to-purple-500/60 text-white text-sm font-bold">${getInitials(story.username)}</div>`
                                }
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold text-sm [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]">
                              {story.username}
                            </p>
                            <p className="text-white/80 text-xs [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                              {story.timestamp} ago
                            </p>
                          </div>
                        </div>
                        
                        {/* Viewed Badge */}
                        {story.hasViewed && (
                          <div className="inline-flex items-center px-2 py-1 rounded-full backdrop-blur-md bg-white/20 border border-white/30">
                            <span className="text-xs text-white/80 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                              Đã xem
                            </span>
                          </div>
                        )}
                        {!story.hasViewed && (
                          <div className="inline-flex items-center px-2 py-1 rounded-full backdrop-blur-md bg-blue-500/40 border border-blue-400/50">
                            <span className="text-xs text-white font-medium [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                              Mới
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {mockStories.length === 1 && (
                <div className="text-center py-12">
                  <p className="text-white/60 text-lg [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                    Chưa có stories nào
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
