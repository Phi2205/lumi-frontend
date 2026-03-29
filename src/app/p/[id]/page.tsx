"use client"

import { useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { HomeLayout } from "@/components/HomeLayout"
import { PostDetailView } from "@/components/post/PostDetailView"

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const handleClose = useCallback(() => {
    // If we have history, go back, otherwise go home
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }, [router])

  return (
    <HomeLayout>
      <PostDetailView postId={postId} onClose={handleClose} />
    </HomeLayout>
  )
}
