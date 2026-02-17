"use client"

import { Button } from "@/components/ui/button"
import { SendButton } from "@/components/ui/SendButton"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { StoryAvatar } from "./ui/avatar"
import { CommentItem } from "./CommentItem"
import { useAuth } from "@/contexts/AuthContext"
import { Comment } from "@/apis/post.api"
import { postComments } from "@/services/post.service"
import { SkeletonComments } from "@/components/skeleton"

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const {user} = useAuth()

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        const response = await postComments(postId, 10, 1)
        console.log("response: ", response.data.items)
        setComments(response.data.items)
      } catch (error) {
        console.error("Failed to load comments", error)
      } finally {
        setLoading(false)
      }
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
    <div className="border-t border-white/10 backdrop-blur-none bg-white/3 px-4 py-4 space-y-4">
      {/* Existing Comments */}
      <div className="flex flex-col gap-[10px] max-h-64 overflow-y-auto p-1 scroll-glass">
        <style>{`
          @keyframes fadeSlide {
            from { opacity: 0; transform: translateY(-6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        
        {loading ? (
             <SkeletonComments count={3} />
        ) : (
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} depth={0} />
            ))
        )}
      </div>

      {/* Add Comment */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <StoryAvatar className="w-9 h-9 shrink-0" src={user?.avatar_url || "/avatar-default.jpg"} alt={user?.name || "You"} />
        <div className="flex-1">
          <div className="relative flex items-end">
            <TextareaAutosize
              minRows={1}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-[24px] pl-4 pr-12 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all resize-none min-h-[48px] overflow-hidden"
            />
            <div className="absolute right-1.5 bottom-1">
                <SendButton 
                    size="md"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
