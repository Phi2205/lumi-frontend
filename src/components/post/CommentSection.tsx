"use client"

import { Button } from "@/components/ui/button"
import { SendButton } from "@/components/ui/SendButton"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useState, useEffect, useRef, useCallback } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { StoryAvatar } from "@/components/ui/avatar"
import { CommentItem } from "./CommentItem"
import { useAuth } from "@/contexts/AuthContext"
import { Comment } from "@/apis/post.api"
import { postComments, sendComment } from "@/services/post.service"
import { SkeletonComments } from "@/components/skeleton"
import { useCommentRealtime } from "@/socket/comment/useCommentRealtime"
import { deleteComment } from "@/services/post.service"
import { Modal } from "@/lib/components/modal"

interface CommentSectionProps {
  postId: string
  showInput?: boolean
  showBorder?: boolean
  showBackground?: boolean
}

export function CommentInput({ postId }: { postId: string }) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        setIsSubmitting(true)
        const res = await sendComment(postId, newComment)
        setNewComment("")

        // Notify lists that a comment was added
        // Note: we don't have the new total count here easily, 
        // but we can either fetch it or just increment if we are sure.
        // For simplicity and since list only shows count:
        window.dispatchEvent(new CustomEvent('postUpdate', {
          detail: {
            id: postId,
            // We can't know the exact new count without API response or state tracking,
            // but usually we can just send the event to trigger a refresh or generic update.
            // If the listener handles 'undefined' as 'no change', we can't increment easily.
            // Let's assume we want to trigger a refresh in the list if possible, or we need to manage counts.
          }
        }));

      } catch (error) {
        console.error("Failed to add comment", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="flex gap-3 items-center">
      <StoryAvatar className="w-10 h-10 shrink-0" src={user?.avatar_url || "/avatar-default.jpg"} alt={user?.name || "You"} username={user?.username} />
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
              disabled={!newComment.trim() || isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const insertCommentToTree = (
  comments: Comment[],
  newComment: Comment
): Comment[] => {
  // Nếu là comment root
  if (!newComment.parent_id) {
    return [newComment, ...comments];
  }

  const insertRecursively = (nodes: Comment[]): Comment[] => {
    return nodes.map((node) => {
      if (node.id === newComment.parent_id) {
        if (!node.replies) node.replies = [];
        return {
          ...node,
          has_replies: true,
          replies: [
            ...node.replies,
            { ...newComment, replies: [] },
          ],
        };
      }

      if (node.replies.length > 0) {
        return {
          ...node,
          replies: insertRecursively(node.replies),
        };
      }

      return node;
    });
  };

  return insertRecursively(comments);
};

export const removeCommentFromTree = (
  comments: Comment[],
  commentId: string
): Comment[] => {
  console.log("commentId: ", commentId)
  return comments
    .filter((c) => c.id !== commentId)
    .map((c) => ({
      ...c,
      replies: c.replies ? removeCommentFromTree(c.replies, commentId) : [],
    }))
}


export function CommentSection({
  postId,
  showInput = true,
  showBorder = true,
  showBackground = true
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  // Pagination State
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null)

  // 🔥 callback ổn định (rất quan trọng)
  const handleReceive = useCallback((comment: Comment) => {
    console.log("comment: ", comment)
    setComments((prev) => insertCommentToTree(prev, comment));
  }, []);

  const handleDelete = useCallback((data: { post_id: string, comment_id: string }) => {
    console.log("comment: ", data)
    setComments((prev) => removeCommentFromTree(prev, data.comment_id));
  }, []);

  // 🔥 gắn realtime
  useCommentRealtime(postId, handleReceive, handleDelete);

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

  // handleAddComment is now in CommentInput

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return
    try {
      await deleteComment(postId, commentToDelete)
    } catch (error) {
      console.error("Failed to delete comment", error)
    } finally {
      setDeleteModalOpen(false)
      setCommentToDelete(null)
    }
  }

  return (
    <div className={cn(
      "px-4 py-4 space-y-4",
      showBorder && "border-t border-white/10",
      showBackground && "bg-white/3"
    )}>
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
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} depth={0} onDelete={handleDeleteComment} />
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
      {showInput && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <CommentInput postId={postId} />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Comment"
        description=""
        maxWidthClassName="max-w-md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-white/80">
          This will permanently remove the comment and all its replies.
        </p>
      </Modal>
    </div>
  )
}
