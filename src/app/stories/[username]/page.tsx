"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { ModalStory } from "@/components/ModalStory"
import { Header } from "@/components/header"
import { getUserByUsername } from "@/services/user.service"
import { getStories } from "@/services/story.service"
import type { User } from "@/types/user.type"
import type { Story as StoryApi } from "@/apis/story.api"
import { StorySkeleton } from "@/components/skeleton"
import { useDarkMode } from "@/hooks/useDarkMode"
import { useBackgroundImage } from "@/hooks/useBackgroundImage"
import { BackgroundRenderer } from "@/components/BackgroundRenderer"
import { useStoryContext } from "@/contexts/StoryContext"

export default function StoryPage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string

  const [user, setUser] = useState<User | null>(null)
  const [userStories, setUserStories] = useState<StoryApi[]>([])
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingStories, setIsLoadingStories] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isDarkMode, handleDarkModeToggle } = useDarkMode()
  const { imageLoaded, imageError } = useBackgroundImage("/bg12.jpg", isDarkMode)
  const storyCtx = useStoryContext()

  // Fetch user info and stories
  useEffect(() => {
    const fetchData = async () => {
      if (!username) return

      // Check context first
      if (storyCtx?.data?.friends) {
        const friend = storyCtx.data.friends.find(f => f.user.username === username)
        if (friend) {
          console.log("Using story data from context", friend)
          setUser(friend.user)
          setUserStories(friend.stories || [])
          setCurrentStoryIndex(0)
          setIsLoading(false)
          return
        }
      }

      try {
        setIsLoading(true)
        setError(null)

        // Fetch user info
        const userResponse = await getUserByUsername(username)
        // getUserByUsername returns ApiResponse<User>, so we need to access .data
        const userData = userResponse.data || userResponse
        setUser(userData)

        // Fetch user stories
        setIsLoadingStories(true)
        const storiesResponse = await getStories(userData.id)
        const storiesData = storiesResponse.data.stories || []
        setUserStories(storiesData)
        setCurrentStoryIndex(0)
      } catch (err: any) {
        console.error("Failed to fetch story data:", err)
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load story. Please try again."
        )
      } finally {
        setIsLoading(false)
        setIsLoadingStories(false)
      }
    }

    fetchData()
  }, [username])

  const handleClose = () => {
    router.back()
  }

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
    } else {
      // Navigate to previous friend's stories if available in context
      if (storyCtx?.data?.friends) {
        const currentIndex = storyCtx.data.friends.findIndex(f => f.user.username === username)
        if (currentIndex > 0) {
          const prevFriend = storyCtx.data.friends[currentIndex - 1]
          router.replace(`/stories/${prevFriend.user.username}`)
        }
      }
    }
  }

  const handleNext = () => {
    if (currentStoryIndex < userStories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
    } else {
      // Navigate to next friend's stories if available in context
      if (storyCtx?.data?.friends) {
        const currentIndex = storyCtx.data.friends.findIndex(f => f.user.username === username)
        if (currentIndex !== -1 && currentIndex < storyCtx.data.friends.length - 1) {
          const nextFriend = storyCtx.data.friends[currentIndex + 1]
          router.replace(`/stories/${nextFriend.user.username}`)
        } else {
          router.back()
        }
      } else {
        router.back()
      }
    }
  }

  // Convert User to StoryFriend format for ModalStory
  const storyFriend = user ? {
    id: user.id,
    username: user.username,
    name: user.name || user.username,
    avatar: user.avatar_url || "/avatar-default.jpg"
  } : null

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <BackgroundRenderer
          isDarkMode={isDarkMode}
          imageLoaded={imageLoaded}
          imageError={imageError}
        />
        <Header isDarkMode={isDarkMode} onDarkModeToggle={handleDarkModeToggle} />
        <div className="pt-16 h-[calc(100vh-4rem)]">
          <StorySkeleton />
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <BackgroundRenderer
          isDarkMode={isDarkMode}
          imageLoaded={imageLoaded}
          imageError={imageError}
        />
        <Header isDarkMode={isDarkMode} onDarkModeToggle={handleDarkModeToggle} />
        <div className="pt-16 flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Story Not Found</h1>
            <p className="text-white/70 mb-6">{error || "User not found"}</p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentIndex = storyCtx?.data?.friends?.findIndex(f => f.user.username === username) ?? -1
  const hasPreviousFriend = currentIndex > 0
  const hasNextFriend = currentIndex !== -1 && currentIndex < (storyCtx?.data?.friends?.length ?? 0) - 1

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundRenderer
        isDarkMode={isDarkMode}
        imageLoaded={imageLoaded}
        imageError={imageError}
      />
      <Header isDarkMode={isDarkMode} onDarkModeToggle={handleDarkModeToggle} />
      <div className="mt-16  h-[calc(100vh-4rem)]">
        <ModalStory
          isOpen={true}
          storyFriend={storyFriend}
          userStories={userStories}
          currentStoryIndex={currentStoryIndex}
          isLoadingUserStories={isLoadingStories}
          onClose={handleClose}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPreviousFriend={hasPreviousFriend}
          hasNextFriend={hasNextFriend}
        />
      </div>
    </div>
  )
}
