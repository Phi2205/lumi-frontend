"use client"

import { useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { PostDetailView } from "@/components/post/PostDetailView"

export default function PostModal() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const handleClose = useCallback(() => {
    router.back()
  }, [router])

  return (
    <PostDetailView postId={postId} onClose={handleClose} isModal={true} />
  )
} 
