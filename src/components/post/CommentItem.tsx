import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { SendButton } from "@/components/ui/SendButton";
import { Comment } from "@/apis/post.api";
import { StoryAvatar } from "@/components/ui/avatar";
import { formatTime } from "@/utils/format";
import { useAuth } from "@/contexts/AuthContext";
import { sendComment, getReplies } from "@/services/post.service";

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

/* ─────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────── */
const ReplyIcon = () => (
  <svg width={13} height={13} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width={13} height={13} viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
  </svg>
);

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
   BUTTON STYLES
───────────────────────────────────────────────────────── */
const cancelBtnStyle: React.CSSProperties = {
  padding: "5px 14px", borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.13)",
  background: "transparent", color: "rgba(255,255,255,0.48)",
  fontSize: 12, fontFamily: "inherit", cursor: "pointer",
};

const postBtnStyle: React.CSSProperties = {
  padding: "5px 16px", borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.22)",
  background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.88)",
  fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
  transition: "all 0.15s",
};

/* ─────────────────────────────────────────────────────────
   COMMENT ITEM (Recursive Tree Layout)
───────────────────────────────────────────────────────── */
interface CommentItemProps {
  comment: Comment;
  depth?: number;
  isLast?: boolean;
  onDelete: (commentId: string) => void;
}

export function CommentItem({ comment, depth = 0, isLast = false, onDelete }: CommentItemProps) {
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
  const [page, setPage] = useState(1);

  // Use prop directly, safeguard if current value is undefined
  const currentReplies = comment.replies || [];
  const [hasMore, setHasMore] = useState(comment.has_replies && currentReplies.length === 0);

  const hasReplies = currentReplies.length > 0;
  const totalLikes = baseLikes + likeOffset;

  const handleFetchReplies = async () => {
    try {
      setIsLoadingReplies(true);
      const limit = 5;
      const response = await getReplies(comment.post_id, comment.id, limit, page);
      if (response && response.data && response.data.items) {
        if (!comment.replies) comment.replies = [];
        console.log("response: ", response.data)

        // Append new items to the existing array reference
        response.data.items.forEach(item => comment.replies.push(item));
        console.log("comment.replies: ", comment.replies)
        setPage(prev => prev + 1);
        setHasMore(response.data.pagination.page < response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch replies", error);
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
        const response = await sendComment(comment.post_id, replyText, comment.id)
        console.log("response: ", response.data)

        // Push single item
        // if (!comment.replies) comment.replies = [];
        // comment.replies.push(response.data);

        if (!isExpanded) setIsExpanded(true);
        setReplyText("")
        setShowReplyBox(false)
      } catch (error) {
        console.error("Failed to add comment", error)
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
          {/* Connector Curve (only for children) */}
          {depth > 0 && (
            <div className="absolute top-[-16px] w-[38px] h-[34px] border-b-2 border-l-2 border-white/10 rounded-bl-2xl pointer-events-none"
              style={{ left: -19 }} />
          )}

          {/* Avatar */}
          {/* <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 bg-white/5 relative z-10">
                {comment.user.avatar_url ? (
                    <img src={comment.user.avatar_url} alt={comment.user.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white/70">
                        {getInitials(comment.user.name)}
                    </div>
                )}
             </div> */}
          <StoryAvatar className="w-10 h-10" src={comment.user.avatar_url || "/avatar-default.jpg"} alt={comment.user.name || "You"} username={comment.user.username} />
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
            </ActionBtn> */}
            <div className="w-0.5 h-0.5 rounded-full bg-white/20" />
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
                  className="text-xs font-semibold text-white/40 hover:text-red-400 transition-colors ml-1"
                >
                  Delete
                </button>
              </>
            )}
          </div>

          {/* Reply Box */}
          {showReplyBox && (
            <div className="flex gap-3 mt-3 mb-2 animation-fadeSlide">
              {/* Avatar */}
              <StoryAvatar className="w-8 h-8 shrink-0" src={user?.avatar_url || "/avatar-default.jpg"} alt={user?.name || "You"} username={user?.username} />

              {/* Input */}
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
          {/* Spacer Column for Vertical Line */}
          <div className="w-[36px] min-h-full relative shrink-0 flex justify-center">
            {/* The Line */}
            <div className="w-[2px] bg-white/10 absolute top-[-10px] bottom-0 left-[50%] -translate-x-1/2" />
          </div>

          {/* Replies List */}
          <div className="flex-1 flex flex-col gap-5 pt-3 relative">
            {currentReplies.map((reply, idx) => (
              <CommentItem
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
                className="text-xs font-semibold text-white/50 hover:text-white/80 text-left mt-1 w-fit transition-colors"
              >
                {isLoadingReplies ? "Loading..." : "Load more replies"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Toggle Replies Button (if hidden but has replies, or if loaded) */}
      {!isExpanded && (comment.has_replies || currentReplies.length > 0) && (
        <div className="flex gap-3 mt-2">
          <div className="w-[36px] shrink-0" /> {/* Spacer */}
          <button
            onClick={toggleReplies}
            className="text-xs font-bold text-white/60 hover:text-white/90 transition-colors flex items-center gap-2"
          >
            <div className="w-6 h-[1px] bg-white/20" />
            {isLoadingReplies ? "Loading..." : "View replies"}
          </button>
        </div>
      )}
    </div>
  );
}
