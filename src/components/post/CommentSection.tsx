"use client"

import { Button } from "@/components/ui/button"
import { SendButton } from "@/components/ui/SendButton"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { StoryAvatar } from "@/components/ui/avatar"
import { CommentItem } from "./CommentItem"
import { useAuth } from "@/contexts/AuthContext"
import { Comment } from "@/apis/post.api"
import { postComments, sendComment } from "@/services/post.service"
import { SkeletonComments } from "@/components/skeleton"

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Pagination State
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)

  const {user} = useAuth()

  // Initial Fetch
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        setPage(1) // Reset page on new post
        const response = await postComments(postId, 10, 1)
        // console.log("response: ", response.data.items)
        setComments(response.data.items)
        setHasMore(response.data.items.length >= 10)
      } catch (error) {
        console.error("Failed to load comments", error)
      } finally {
        setLoading(false)
      }
    }
    fetchComments()
  }, [postId])

  // Infinite Scroll Observer
  useEffect(() => {
    if (loading || isFetchingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, isFetchingMore, hasMore]);


  const handleLoadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const nextPage = page + 1;
      const response = await postComments(postId, 10, nextPage);
      const newItems = response.data.items;

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setComments(prev => [...prev, ...newItems]);
        setPage(nextPage);
        if (newItems.length < 10) setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more comments", error);
    } finally {
      setIsFetchingMore(false);
    }
  }

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        setIsSubmitting(true)
        const response = await sendComment(postId, newComment)
        console.log("response: ", response.data)
        setComments([response.data, ...comments])
        setNewComment("")
      } catch (error) {
        console.error("Failed to add comment", error)
      } finally {
        setIsSubmitting(false)
      }
    }
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
            <>
              {isSubmitting && <SkeletonComments count={1} />}
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} depth={0} />
              ))}
              
              {/* Load More Trigger & Indicator */}
              {hasMore && (
                <div ref={observerTarget} className="py-2">
                   {isFetchingMore && <SkeletonComments count={1} />}
                </div>
              )}
            </>
        )}
      </div>

      {/* Add Comment */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <StoryAvatar className="w-11 h-11 shrink-0" src={user?.avatar_url || "/avatar-default.jpg"} alt={user?.name || "You"} />
        <div className="flex-1">
          <div className="relative flex items-end">
            <TextareaAutosize
              minRows={1}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleAddComment()
                }
              }}
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
