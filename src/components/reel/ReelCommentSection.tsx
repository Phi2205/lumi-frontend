"use client"

import { Button } from "@/components/ui/button"
import { SendButton } from "@/components/ui/SendButton"
import { useState, useEffect, useRef, useCallback } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { StoryAvatar } from "@/components/ui/avatar"
import { ReelCommentItem } from "./ReelCommentItem"
import { useAuth } from "@/contexts/AuthContext"
import { ReelComment } from "@/apis/reel.api"
import { getReelCommentsService, createReelCommentService, deleteReelCommentService } from "@/services/reel.service"
import { SkeletonComments } from "@/components/skeleton"
import { useReelCommentRealtime } from "@/socket/reel/useReelCommentRealtime"
import { Modal } from "@/lib/components/modal"
import { X } from "lucide-react"

interface ReelCommentSectionProps {
    reelId: string;
    onClose: () => void;
}

export const insertReelCommentToTree = (
    comments: ReelComment[],
    newComment: ReelComment
): ReelComment[] => {
    if (!newComment.parent_id) {
        return [newComment, ...comments];
    }

    const insertRecursively = (nodes: ReelComment[]): ReelComment[] => {
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

            if (node.replies && node.replies.length > 0) {
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

export const removeReelCommentFromTree = (
    comments: ReelComment[],
    commentId: string
): ReelComment[] => {
    return comments
        .filter((c) => c.id !== commentId)
        .map((c) => ({
            ...c,
            replies: c.replies ? removeReelCommentFromTree(c.replies, commentId) : [],
        }))
}


export function ReelCommentSection({ reelId, onClose }: ReelCommentSectionProps) {
    const [comments, setComments] = useState<ReelComment[]>([])
    const [loading, setLoading] = useState(true)
    const [newComment, setNewComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Pagination State
    const [nextCursor, setNextCursor] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const [isFetchingMore, setIsFetchingMore] = useState(false)
    const observerTarget = useRef<HTMLDivElement>(null)
    const { user } = useAuth()

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null)

    const handleReceive = useCallback((comment: ReelComment) => {
        setComments((prev) => insertReelCommentToTree(prev, comment));
    }, []);

    const handleDelete = useCallback((data: { reel_id: string, comment_id: string }) => {
        setComments((prev) => removeReelCommentFromTree(prev, data.comment_id));
    }, []);

    useReelCommentRealtime(reelId, handleReceive, handleDelete);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true)
                const response = await getReelCommentsService(reelId, undefined, 10)
                if (response && response.success && response.data) {
                    setComments(response.data.items)
                    setHasMore(response.data.hasMore)
                    setNextCursor(response.data.nextCursor)
                }
            } catch (error) {
                console.error("Failed to load reel comments", error)
            } finally {
                setLoading(false)
            }
        }
        fetchComments()
    }, [reelId])

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
            const response = await getReelCommentsService(reelId, nextCursor || undefined, 10);
            if (response && response.success && response.data) {
                const newItems = response.data.items;
                if (newItems.length === 0) {
                    setHasMore(false);
                } else {
                    setComments(prev => [...prev, ...newItems]);
                    setNextCursor(response.data.nextCursor);
                    setHasMore(response.data.hasMore);
                }
            }
        } catch (error) {
            console.error("Failed to load more reel comments", error);
        } finally {
            setIsFetchingMore(false);
        }
    }

    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                setIsSubmitting(true)
                await createReelCommentService(reelId, newComment)
                setNewComment("")
            } catch (error) {
                console.error("Failed to add reel comment", error)
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    const handleDeleteComment = (commentId: string) => {
        setCommentToDelete(commentId)
        setDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!commentToDelete) return
        try {
            await deleteReelCommentService(reelId, commentToDelete)
        } catch (error) {
            console.error("Failed to delete reel comment", error)
        } finally {
            setDeleteModalOpen(false)
            setCommentToDelete(null)
        }
    }

    return (
        <div className="flex flex-col h-full bg-[#121212] border-l border-white/10 w-full sm:w-[360px] md:w-[400px]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 shrink-0">
                <h3 className="text-white font-bold text-lg">Comments</h3>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Existing Comments */}
            <div className="flex-1 overflow-y-auto p-4 scroll-glass space-y-4">
                <style>{`
          @keyframes fadeSlide {
            from { opacity: 0; transform: translateY(-6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

                {loading ? (
                    <SkeletonComments count={5} />
                ) : comments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/40 space-y-2 mt-10">
                        <span className="text-4xl">💬</span>
                        <p>No comments yet. Be the first!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {isSubmitting && <SkeletonComments count={1} />}
                        {comments.map((comment) => (
                            <ReelCommentItem key={comment.id} comment={comment} depth={0} onDelete={handleDeleteComment} />
                        ))}

                        {/* Load More Trigger & Indicator */}
                        {hasMore && (
                            <div ref={observerTarget} className="py-2">
                                {isFetchingMore && <SkeletonComments count={1} />}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add Comment */}
            <div className="flex gap-3 px-4 py-4 border-t border-white/10 shrink-0 bg-[#121212]">
                <StoryAvatar className="w-10 h-10 shrink-0" src={user?.avatar_url || "/avatar-default.jpg"} alt={user?.name || "You"} />
                <div className="flex-1 relative flex items-end">
                    <TextareaAutosize
                        minRows={1}
                        maxRows={4}
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleAddComment()
                            }
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-[24px] pl-4 pr-12 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all resize-none min-h-[40px]"
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
