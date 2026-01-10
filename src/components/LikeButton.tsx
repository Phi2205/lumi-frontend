import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface LikeButtonProps {
  postId: string
  liked: boolean
  count: number
  onLike?: (postId: string) => void
}

export function LikeButton({ postId, liked, count, onLike }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(liked)
  const [likeCount, setLikeCount] = useState(count)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    onLike?.(postId)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`flex-1 gap-2 ${
        isLiked
          ? "text-destructive hover:bg-destructive/10"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      }`}
      onClick={handleLike}
    >
      <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
      {isLiked ? "Liked" : "Like"}
    </Button>
  )
}
