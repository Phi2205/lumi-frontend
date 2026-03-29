import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface LikeButtonProps {
  postId: string
  liked: boolean
  count: number
  onLike?: (postId: string) => void
}

export function LikeButton({ postId, liked, count, onLike }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(liked)
  const [likeCount, setLikeCount] = useState(count)

  // Sync with props when they change (e.g. from modal update)
  useEffect(() => {
    setIsLiked(liked)
    setLikeCount(count)
  }, [liked, count])

  const handleLike = () => {
    const nextLiked = !isLiked
    const nextCount = isLiked ? likeCount - 1 : likeCount + 1

    setIsLiked(nextLiked)
    setLikeCount(nextCount)
    onLike?.(postId)

    // Dispatch global event for synchronization
    window.dispatchEvent(new CustomEvent('postUpdate', {
      detail: {
        id: postId,
        has_liked: nextLiked,
        like_count: nextCount
      }
    }));
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`flex-1 gap-2 rounded-lg transition-all ${isLiked
        ? "text-red-400 hover:bg-red-500/10"
        : "text-white/60 hover:text-white hover:bg-white/10"
        }`}
      onClick={handleLike}
    >
      <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
      {isLiked ? "Liked" : "Like"}
    </Button>
  )
}
