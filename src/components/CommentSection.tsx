"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
}

interface CommentSectionProps {
  postId: string
}

const mockComments: Comment[] = [
  {
    id: "1",
    author: "Alex Rivera",
    avatar: "/placeholder.svg",
    content: "This is amazing! Love this so much.",
    timestamp: "2h ago",
  },
  {
    id: "2",
    author: "Emma Davis",
    avatar: "/placeholder.svg",
    content: "Couldn't agree more with you on this one!",
    timestamp: "1h ago",
  },
]

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState(mockComments)
  const [newComment, setNewComment] = useState("")

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: String(comments.length + 1),
        author: "You",
        avatar: "/placeholder.svg",
        content: newComment,
        timestamp: "just now",
      }
      setComments([...comments, comment])
      setNewComment("")
    }
  }

  return (
    <div className="border-t border-white/10 backdrop-blur-2xl bg-white/3 px-4 py-4 space-y-4">
      {/* Existing Comments */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-blue-400/50">
              <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
              <AvatarFallback>{comment.author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 backdrop-blur-2xl bg-white/5 border border-white/15 rounded-lg p-3">
              <p className="font-semibold text-sm text-white">{comment.author}</p>
              <p className="text-sm text-white/90">{comment.content}</p>
              <p className="text-xs text-white/50 mt-1">{comment.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Comment */}
      <div className="flex gap-2 pt-2 border-t border-white/10">
        <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-blue-400/50">
          <AvatarImage src="/placeholder.svg" alt="You" />
          <AvatarFallback>Y</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
            className="rounded-full border-white/20 backdrop-blur-2xl bg-white/5 text-white placeholder:text-white/50"
          />
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 rounded-full shadow-lg"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  )
}
