"use client"

import { useState } from "react"
import { Globe, ChevronDown, Link2, Loader2 } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Modal } from "@/lib/components/modal"
import { useAuth } from "@/contexts/AuthContext"
import { sharePost } from "@/services/post.service"
import type { Post } from "./PostCard"

interface ShareModalProps {
  post: Post
  onClose: () => void
  onShared?: () => void
}

export function ShareModal({ post, onClose, onShared }: ShareModalProps) {
  const { user } = useAuth()
  const [content, setContent] = useState("")
  const [isSharing, setIsSharing] = useState(false)
  const [copied, setCopied] = useState(false)

  // Determine the actual post ID to share (the original post if this is already a share)
  const shareTargetId = post.original_post_id ?? post.id

  const handleShare = async () => {
    if (isSharing) return
    setIsSharing(true)
    try {
      await sharePost(shareTargetId, content)
      onShared?.()
      onClose()
    } catch (error) {
      console.error("Failed to share post:", error)
    } finally {
      setIsSharing(false)
    }
  }

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/p/${shareTargetId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const input = document.createElement("input")
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand("copy")
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const title = (
    <div className="flex items-center justify-center w-full">
      <span className="text-lg font-bold">Chia sẻ</span>
    </div>
  )

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={title}
      maxWidthClassName="max-w-[520px]"
      closeOnOverlayClick
    >
      <div className="-mx-6 -my-5 overflow-y-auto" style={{ maxHeight: "70vh" }}>
        {/* User info + caption area */}
        <div className="px-5 pt-5 pb-4">
          {/* User row */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage
                src={user?.avatar_url ?? undefined}
                alt={user?.name ?? "User"}
              />
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-semibold truncate">
                {user?.name ?? "User"}
              </p>

              {/* Privacy badge row */}
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-[11px] text-white/70 font-medium">
                  Bảng feed
                </span>
                <button className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-white/10 text-[11px] text-white/70 font-medium hover:bg-white/15 transition-colors cursor-pointer">
                  <Globe size={10} className="text-white/50" />
                  <span>Công khai</span>
                  <ChevronDown size={10} className="text-white/40" />
                </button>
              </div>
            </div>
          </div>

          {/* Caption textarea */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Hãy nói gì đó về nội dung này..."
            rows={3}
            className="w-full bg-transparent text-white/90 text-sm placeholder-white/30 border-none outline-none resize-none leading-relaxed"
          />

          {/* Share button */}
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="w-full mt-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {isSharing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Đang chia sẻ...
              </>
            ) : (
              "Chia sẻ ngay"
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Share to section */}
        <div className="px-5 pt-4 pb-5">
          <p className="text-white/60 text-xs font-semibold mb-3 uppercase tracking-wider">
            Chia sẻ lên
          </p>

          <div className="grid grid-cols-4 gap-3">
            {/* Copy link */}
            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                copied
                  ? "bg-green-500/20 border border-green-400/30"
                  : "bg-white/10 border border-white/15 group-hover:bg-white/15"
              }`}>
                {copied ? (
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-400" strokeWidth={2.5}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <Link2 size={20} className="text-white/70" />
                )}
              </div>
              <span className="text-[11px] text-white/60 leading-tight text-center">
                {copied ? "Đã sao chép!" : "Sao chép liên kết"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
