"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { StoryAvatar } from "./ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import { Comment } from "@/apis/post.api"
import { postComments } from "@/services/post.service"

interface CommentSectionProps {
  postId: string
}


export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const {user} = useAuth()

  useEffect(() => {
    const fetchComments = async () => {
      const response = await postComments(postId, 10, 1)
      console.log("response: ", response.data.items)
      setComments(response.data.items)
    }
    fetchComments()
  }, [postId])

  const handleAddComment = () => {
    // if (newComment.trim()) {
    //   const comment: Comment = {
    //     id: String(comments.length + 1),
    //     user_id: user?.id || "",
    //     post_id: postId,
    //     content: newComment,
    //     depth: 0,
    //     created_at: new Date().toISOString(),
    //     user: {
    //       id: user?.id || "",
    //       username: user?.username || "",
    //       name: user?.name || "",
    //       avatar_url: user?.avatar_url || "",
    //     },
    //     replies: [],
    //   }
    //   setComments([...comments, comment])
    //   setNewComment("")
    // }
  }

  return (
    <div className="border-t border-white/10 backdrop-blur-2xl bg-white/3 px-4 py-4 space-y-4">
      {/* Existing Comments */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <StoryAvatar className="w-10 h-10" src={comment.user.avatar_url || "/avatar-default.jpg"} alt={comment.user.name} />
            <div className="flex-1 backdrop-blur-2xl bg-white/5 border border-white/15 rounded-lg p-3">
              <p className="font-semibold text-sm text-white">{comment.user.name}</p>
              <p className="text-sm text-white/90">{comment.content}</p>
              <p className="text-xs text-white/50 mt-1">{comment.created_at}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Comment */}
      <div className="flex gap-2 pt-2 border-t border-white/10">
        <StoryAvatar className="w-10 h-10" src={user?.avatar_url || "/avatar-default.jpg"} alt={user?.name || "You"} />
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
