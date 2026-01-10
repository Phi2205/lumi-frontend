import { PostCard, type Post } from "./PostCard"
import { Stories } from "./Stories"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"

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
    image: "/post-1.jpg",
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
    image: "/post-2.jpg",
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
    image: "/post-3.jpg",
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
    image: "/post-4.jpg",
    likes: 445,
    comments: 22,
    hasLiked: false,
  },
]

export function Feed() {
  const [posts, setPosts] = useState(mockPosts)
  const [newPost, setNewPost] = useState("")

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, hasLiked: !post.hasLiked, likes: post.likes + (post.hasLiked ? -1 : 1) } : post,
      ),
    )
  }

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: String(posts.length + 1),
        author: {
          name: "You",
          avatar: "/placeholder.svg",
        },
        timestamp: "just now",
        content: newPost,
        likes: 0,
        comments: 0,
        hasLiked: false,
      }
      setPosts([post, ...posts])
      setNewPost("")
    }
  }

  return (
    <div className="space-y-4">
      {/* Stories Section */}
      <Stories />

      {/* Create Post Card */}
      <Card className="border-border bg-card p-4">
        <div className="space-y-4">
          {/* User Input Section */}
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src="/placeholder.svg" alt="You" />
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <Input
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="flex-1 rounded-full border-border bg-secondary placeholder:text-muted-foreground"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2 pl-13">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <ImageIcon className="h-4 w-4" />
              Photo
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handlePostSubmit}
              disabled={!newPost.trim()}
            >
              Post
            </Button>
          </div>
        </div>
      </Card>

      {/* Feed Posts */}
      <div className="space-y-2">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={handleLike} />
        ))}
      </div>
    </div>
  )
}
