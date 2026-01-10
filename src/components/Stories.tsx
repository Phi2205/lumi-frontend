import { useState } from "react"
import { Plus } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

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

  return (
    <>
      {/* Stories Container */}
      <Card className="border-border bg-card mb-6 p-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {/* Add Story Card */}
          <div className="flex-shrink-0">
            <div className="relative h-24 w-20 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
              <div className="flex flex-col items-center">
                <Plus className="h-6 w-6 text-primary" />
                <span className="text-xs text-primary font-semibold mt-1">Add</span>
              </div>
            </div>
            <p className="text-xs text-center text-foreground font-medium mt-2">Your Story</p>
          </div>

          {/* Story Items */}
          {mockStories.slice(1).map((story) => (
            <div
              key={story.id}
              className="flex-shrink-0 cursor-pointer group"
              onClick={() => setSelectedStory(story.id)}
            >
              <div
                className={`relative h-24 w-20 rounded-lg overflow-hidden ${!story.hasViewed ? "ring-2 ring-primary" : "ring-2 ring-muted"}`}
              >
                <img
                  src={story.image || "/placeholder.svg"}
                  alt={story.username}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="mt-2 flex items-center justify-center gap-1">
                <Avatar className="h-6 w-6 ring-2 ring-offset-1 ring-primary">
                  <AvatarImage src={story.avatar || "/placeholder.svg"} alt={story.username} />
                  <AvatarFallback>{story.username[0]}</AvatarFallback>
                </Avatar>
              </div>
              <p className="text-xs text-center text-foreground font-medium mt-1 truncate">{story.username}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-[9/16] bg-black rounded-2xl overflow-hidden">
            <img
              src={mockStories.find((s) => s.id === selectedStory)?.image || "/placeholder.svg"}
              alt="Story"
              className="w-full h-full object-cover"
            />

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/40 to-transparent p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
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
                className="text-white hover:bg-white/20"
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
    </>
  )
}
