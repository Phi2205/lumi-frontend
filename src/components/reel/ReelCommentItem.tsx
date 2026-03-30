import { useState, memo } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { SendButton } from "@/components/ui/SendButton";
import { ReelComment } from "@/apis/reel.api";
import { StoryAvatar } from "@/components/ui/avatar";
import { formatTime } from "@/utils/format";
import { useAuth } from "@/contexts/AuthContext";
import { createReelCommentService, getReelCommentRepliesService } from "@/services/reel.service";

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
function getInitials(name: string) {
    return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

/* ─────────────────────────────────────────────────────────
   ACTION BUTTON helper
───────────────────────────────────────────────────────── */
interface ActionBtnProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

function ActionBtn({ active, onClick, children }: ActionBtnProps) {
    const [hovered, setHovered] = useState(false);
    const isOn = active || hovered;
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "4px 8px", borderRadius: 6,
                color: isOn ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                fontSize: 12, fontWeight: 600, fontFamily: "inherit",
                cursor: "pointer", transition: "all 0.16s ease",
            }}
        >
            {children}
        </button>
    );
}

/* ─────────────────────────────────────────────────────────
   COMMENT ITEM (Recursive Tree Layout)
───────────────────────────────────────────────────────── */
interface ReelCommentItemProps {
    comment: ReelComment;
    depth?: number;
    isLast?: boolean;
    onDelete: (commentId: string) => void;
}

export const ReelCommentItem = memo(function ReelCommentItem({ comment, depth = 0, isLast = false, onDelete }: ReelCommentItemProps) {
    const [liked, setLiked] = useState(false);
    const [likeOffset, setLikeOffset] = useState(0);
    const [baseLikes] = useState(() => Math.floor(Math.random() * 22) + 1);
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState("");
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reply specific states
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoadingReplies, setIsLoadingReplies] = useState(false);

    // Using a local cursor to support pagination
    const [nextCursor, setNextCursor] = useState<string | null>(null);

    const currentReplies = comment.replies || [];
    const [hasMore, setHasMore] = useState(comment.has_replies && currentReplies.length === 0);

    const totalLikes = baseLikes + likeOffset;

    const handleFetchReplies = async () => {
        try {
            setIsLoadingReplies(true);
            const limit = 5;
            const response = await getReelCommentRepliesService(comment.reel_id, comment.id, nextCursor || undefined, limit);
            if (response && response.success && response.data) {
                if (!comment.replies) comment.replies = [];

                // Append new items
                response.data.items.forEach((item: ReelComment) => comment.replies.push(item));
                setNextCursor(response.data.nextCursor);
                setHasMore(response.data.hasMore);
            }
        } catch (error) {
            console.error("Failed to fetch reel replies", error);
        } finally {
            setIsLoadingReplies(false);
        }
    };

    const toggleReplies = async () => {
        const repliesCount = comment.replies?.length || 0;
        if (!isExpanded && repliesCount === 0 && comment.has_replies) {
            await handleFetchReplies();
        }
        setIsExpanded(prev => !prev);
    }

    const handleLike = () => {
        setLikeOffset(prev => liked ? prev - 1 : prev + 1);
        setLiked(prev => !prev);
    };

    const handleReplyComment = async () => {
        if (replyText.trim()) {
            try {
                setIsSubmitting(true)
                const response = await createReelCommentService(comment.reel_id, replyText, comment.id)

                if (!isExpanded) setIsExpanded(true);
                setReplyText("")
                setShowReplyBox(false)
            } catch (error) {
                console.error("Failed to add reel comment reply", error)
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    return (
        <div className="relative group">
            {/* 1. Main Content Row */}
            <div className="flex gap-3 relative z-10">
                {/* Avatar Column */}
                <div className="relative flex flex-col items-center shrink-0">
                    {/* Connector Curve */}
                    {depth > 0 && (
                        <div className="absolute top-[-16px] w-[38px] h-[34px] border-b-2 border-l-2 border-white/10 rounded-bl-2xl pointer-events-none"
                            style={{ left: -19 }} />
                    )}

                    <StoryAvatar className="w-10 h-10" src={comment.user.avatar_url || "/avatar-default.jpg"} alt={comment.user.name || "User"} />
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                    {/* Bubble */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl px-4 py-3 inline-block min-w-[200px] hover:bg-white/10 transition-colors">
                        <div className="flex items-center justify-between mb-1 gap-4">
                            <span className="font-bold text-sm text-white/90">{comment.user.name}</span>
                        </div>
                        <p className="text-[13.5px] leading-relaxed text-white/80 whitespace-pre-wrap">{comment.content}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 mt-1 ml-1 select-none">
                        {/* <ActionBtn active={liked} onClick={handleLike}>
                            <span className={liked ? "text-red-400" : ""}>{liked ? "Liked" : "Like"}</span>
                            {totalLikes > 0 && <span className="ml-1 opacity-60 font-normal">{totalLikes}</span>}
                        </ActionBtn>
                        <div className="w-0.5 h-0.5 rounded-full bg-white/20" /> */}
                        <ActionBtn active={showReplyBox} onClick={() => setShowReplyBox(p => !p)}>
                            Reply
                        </ActionBtn>
                        <div className="w-0.5 h-0.5 rounded-full bg-white/20" />
                        <span className="text-xs text-white/30 ml-2 font-medium">{formatTime(comment.created_at)}</span>

                        {user?.id === comment.user_id && (
                            <>
                                <div className="w-0.5 h-0.5 rounded-full bg-white/20 ml-2" />
                                <button
                                    onClick={() => onDelete(comment.id)}
                                    className="text-xs font-semibold text-white/40 hover:text-red-400 transition-colors ml-1 cursor-pointer"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>

                    {/* Reply Box */}
                    {showReplyBox && (
                        <div className="flex gap-3 mt-3 mb-2 animation-fadeSlide">
                            <StoryAvatar className="w-8 h-8 shrink-0" src={user?.avatar_url || "/avatar-default.jpg"} alt={user?.name || "You"} />
                            <div className="flex-1 relative flex items-end">
                                <TextareaAutosize
                                    minRows={1}
                                    placeholder={`Reply to ${comment.user.name}…`}
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleReplyComment();
                                        }
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-[24px] pl-4 pr-12 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all resize-none min-h-[48px] overflow-hidden"
                                />
                                <div className="absolute right-1.5 bottom-1">
                                    <SendButton
                                        size="md"
                                        onClick={handleReplyComment}
                                        disabled={!replyText.trim() || isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Replies Container */}
            {isExpanded && (
                <div className="flex relative">
                    <div className="w-[36px] min-h-full relative shrink-0 flex justify-center">
                        <div className="w-[2px] bg-white/10 absolute top-[-10px] bottom-0 left-[50%] -translate-x-1/2" />
                    </div>
                    <div className="flex-1 flex flex-col gap-5 pt-3 relative">
                        {currentReplies.map((reply, idx) => (
                            <ReelCommentItem
                                key={reply.id}
                                comment={reply}
                                depth={depth + 1}
                                isLast={idx === currentReplies.length - 1}
                                onDelete={onDelete}
                            />
                        ))}

                        {hasMore && (
                            <button
                                onClick={handleFetchReplies}
                                disabled={isLoadingReplies}
                                className="text-xs font-semibold text-white/50 hover:text-white/80 text-left mt-1 w-fit transition-colors cursor-pointer"
                            >
                                {isLoadingReplies ? "Loading..." : "Load more replies"}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Toggle Replies Button */}
            {!isExpanded && (comment.has_replies || currentReplies.length > 0) && (
                <div className="flex gap-3 mt-2">
                    <div className="w-[36px] shrink-0" />
                    <button
                        onClick={toggleReplies}
                        className="text-xs font-bold text-white/60 hover:text-white/90 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        <div className="w-6 h-[1px] bg-white/20" />
                        {isLoadingReplies ? "Loading..." : "View replies"}
                    </button>
                </div>
            )}
        </div>
    );
});
