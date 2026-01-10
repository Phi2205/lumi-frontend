import { MoreHorizontal, Share2 } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LikeButton } from "./LikeButton"
import { CommentSection } from "./CommentSection"
import { useState } from "react"

export interface Post {
  id: string
  author: {
    name: string
    avatar: string
  }
  timestamp: string
  content: string
  image?: string
  likes: number
  comments: number
  hasLiked?: boolean
}

interface PostCardProps {
  post: Post
  onLike?: (postId: string) => void
}

export function PostCard({ post, onLike }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="border-border bg-card mb-4 overflow-hidden hover:shadow-md transition-shadow">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">{post.timestamp}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Post Content */}
      <CardContent className="p-4">
        <p className="text-foreground text-sm leading-relaxed mb-4">{post.content}</p>

        {/* Post Image */}
        {post.image && (
          <img
            src={post.image || "/placeholder.svg"}
            alt="Post"
            className="w-full rounded-lg mb-4 max-h-96 object-cover"
          />
        )}
      </CardContent>

      {/* Post Stats */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-b border-border text-xs text-muted-foreground">
        <span>{post.likes} likes</span>
        <span>{post.comments} comments</span>
      </div>

      {/* Post Actions */}
      <div className="flex items-center gap-2 p-4">
        <LikeButton postId={post.id} liked={post.hasLiked || false} count={post.likes} onLike={onLike} />
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          💬 Comment
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Comments Section */}
      {isExpanded && <CommentSection postId={post.id} />}
    </Card>
  )
}
