"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { MapPin, Link as LinkIcon, Mail, Calendar, Heart, MessageSquare, Share2, Send, ArrowLeft, Play } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { GlassCard, GlassButton, GlassStatCard, GlassCardVariant } from "@/lib/components"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { RightSidebar } from "@/components/RightSidebar"
import { formatViews } from "@/utils/format"
import { getUserByUsername } from "@/services/user.service"
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest } from "@/services/friendRequest.service"
import { User, FriendshipStatus } from "@/types/user.type"
import { ProfileSkeleton } from "@/components/skeleton"
import { useMiniChat } from "@/components/messages/MiniChatContext"
import { getOrCreatePrivateConversationApi } from "@/apis/conversation.api"
import { useAuth } from "@/contexts/AuthContext"
import { mapConversationToUI } from "@/services/conversation.service"

interface Post {
  id: number
  image: string
  likes: number
  comments: number
  views: number
}

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [activeTab, setActiveTab] = useState("home")
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false

    // Check localStorage first
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode !== null) {
      return savedMode === 'true'
    }

    // Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const { openChat } = useMiniChat()
  const { user } = useAuth()
  const [isStartingChat, setIsStartingChat] = useState(false)

  const handleDarkModeToggle = (checked: boolean) => {
    setIsDarkMode(checked)
    localStorage.setItem('darkMode', checked.toString())
  }

  // Listen to system preference changes (only if no user preference)
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Only listen if user hasn't set a preference
    if (localStorage.getItem('darkMode') !== null) return

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    darkModeQuery.addEventListener('change', handleChange)
    return () => darkModeQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    // Only preload image if not dark mode
    if (isDarkMode) return

    if (typeof window === 'undefined') return

    const img = document.createElement('img')
    img.src = "/bg12.jpg"

    img.onload = () => {
      setImageLoaded(true)
    }

    img.onerror = () => {
      setImageError(true)
    }

    imgRef.current = img as any

    return () => {
      // Cleanup
      if (imgRef.current) {
        imgRef.current.onload = null
        imgRef.current.onerror = null
      }
    }
  }, [isDarkMode])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsInitialLoading(true);
        const response = await getUserByUsername(username);
        const user = response.data;
        setUserProfile(user);
      } catch (error) {
        console.error("Fetch user failed:", error);
      } finally {
        setIsInitialLoading(false);
      }
    }
    fetchUser()
  }, [username]);

  const handleAddFriend = async () => {
    if (!userProfile?.id || isLoading) return;
    try {
      setIsLoading(true);
      await sendFriendRequest(userProfile.id);
      // Update status to pending
      setUserProfile(prev => prev ? { ...prev, friend_status: 'pending' } : null);
    } catch (error) {
      console.error("Send friend request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!userProfile?.id || isLoading) return;
    try {
      setIsLoading(true);
      await acceptFriendRequest(userProfile.id);
      // Update status to friend
      setUserProfile(prev => prev ? { ...prev, friend_status: 'friend' } : null);
    } catch (error) {
      console.error("Accept friend request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!userProfile?.id || isLoading) return;
    try {
      setIsLoading(true);
      await cancelFriendRequest(userProfile.id);
      // Update status to none
      setUserProfile(prev => prev ? { ...prev, friend_status: 'none' } : null);
    } catch (error) {
      console.error("Cancel friend request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!userProfile?.id || isLoading) return;
    try {
      setIsLoading(true);
      await rejectFriendRequest(userProfile.id);
      // Update status to rejected
      setUserProfile(prev => prev ? { ...prev, friend_status: 'rejected' } : null);
    } catch (error) {
      console.error("Reject friend request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = async () => {
    if (!userProfile?.id || isStartingChat) return

    try {
      setIsStartingChat(true)
      const res = await getOrCreatePrivateConversationApi(userProfile.id)
      if (res.data.success) {
        const conversation = res.data.data
        console.log("Conversation:", conversation)
        const mapped = mapConversationToUI(conversation, user?.id || "")
        openChat({
          recipientId: userProfile.id,
          recipientName: userProfile.name || "User",
          recipientAvatar: userProfile.avatar_url || "/avatar-default.jpg",
          conversationId: conversation.id,
          participants: mapped.participants,
        })
      }
    } catch (error) {
      console.error("Failed to start chat:", error)
    } finally {
      setIsStartingChat(false)
    }
  }

  // Get button configuration based on status
  const getButtonConfig = (status: FriendshipStatus | undefined) => {
    switch (status) {
      case 'none':
        return {
          text: 'Add Friend',
          onClick: handleAddFriend,
          disabled: isLoading,
          className: 'bg-linear-to-r from-brand-primary to-brand-primary-dark whitespace-nowrap'
        };
      case 'friend':
        return {
          text: 'Friends',
          onClick: undefined,
          disabled: true,
          className: 'bg-white/10 whitespace-nowrap'
        };
      case 'pending':
        return {
          text: isLoading ? 'Processing...' : 'Request Sent',
          onClick: handleCancelRequest,
          disabled: isLoading,
          className: 'bg-white/10 hover:bg-white/20 whitespace-nowrap'
        };
      case 'accepted':
        // accepted should display as friend
        return {
          text: 'Friends',
          onClick: undefined,
          disabled: true,
          className: 'bg-white/10 whitespace-nowrap'
        };
      case 'rejected':
        return {
          text: 'Add Friend',
          onClick: handleAddFriend,
          disabled: isLoading,
          className: 'bg-linear-to-r from-brand-primary to-brand-primary-dark whitespace-nowrap'
        };
      case 'received_pending':
        return {
          text: isLoading ? 'Processing...' : 'Accept Request',
          onClick: handleAcceptRequest,
          disabled: isLoading,
          className: 'bg-linear-to-r from-brand-primary to-brand-primary-dark whitespace-nowrap'
        };
      default:
        return {
          text: 'Add Friend',
          onClick: handleAddFriend,
          disabled: isLoading,
          className: 'bg-linear-to-r from-brand-primary to-brand-primary-dark whitespace-nowrap'
        };
    }
  };

  // Calculate button config only after userProfile is loaded
  const buttonConfig = useMemo(() => {
    if (!userProfile || isInitialLoading) {
      return {
        text: 'Add Friend',
        onClick: undefined,
        disabled: true,
        className: 'bg-white/10 whitespace-nowrap'
      };
    }
    return getButtonConfig(userProfile.friend_status);
  }, [userProfile, isLoading, isInitialLoading]);

  // Mock stats for demo
  const userStats = {
    followers: 1250,
    following: 450,
    posts: 42
  }

  const userPosts: Post[] = [
    { id: 1, image: "/bg3.jpg", likes: 298, comments: 38, views: 4000000 },
    { id: 2, image: "/bg3.jpg", likes: 412, comments: 56, views: 7100000 },
    { id: 3, image: "/bg3.jpg", likes: 567, comments: 89, views: 2600000 },
    { id: 4, image: "/bg3.jpg", likes: 234, comments: 29, views: 1500000 },
    { id: 5, image: "/bg3.jpg", likes: 489, comments: 72, views: 1400000 },
    { id: 6, image: "/bg3.jpg", likes: 345, comments: 48, views: 1800000 },
  ]


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background - Dark mode or image */}
      {isDarkMode ? (
        <>
          <div
            className="fixed inset-0 -z-10 transition-all duration-1000 ease-out"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(3, 0, 20, 0.8) 0%, #030014 50%, #020010 100%)'
            }}
          />
          <div
            className="fixed inset-0 -z-10 opacity-40 transition-opacity duration-1000"
            style={{
              background: 'radial-gradient(ellipse 60% 40% at 20% 30%, rgba(182, 196, 162, 0.15) 0%, transparent 70%), radial-gradient(ellipse 50% 30% at 80% 70%, rgba(182, 196, 162, 0.08) 0%, transparent 60%)'
            }}
          />
        </>
      ) : (
        <>
          <div
            className="fixed inset-0 -z-10"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)',
              backgroundColor: '#030014'
            }}
          />
          <div
            className={`fixed inset-0 bg-cover bg-no-repeat bg-center -z-10 transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(/bg12.jpg)`
            }}
          />
        </>
      )}

      <Header isDarkMode={isDarkMode} onDarkModeToggle={handleDarkModeToggle} />
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="md:ml-64 lg:mr-80 pt-20 pb-20 md:pb-4 relative z-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <GlassButton
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-2"
              onClick={() => typeof window !== 'undefined' && window.history.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </GlassButton>
          </div>

          {isInitialLoading ? (
            <ProfileSkeleton />
          ) : (
            <>
              {/* Cover Photo */}
              <GlassCard variant="lg" className="h-72 md:h-96 rounded-3xl overflow-hidden mb-0 p-0">
                <Image
                  src={"/bg12.jpg"}
                  alt="Profile cover"
                  fill
                  className="object-cover h-[50%]"
                />
              </GlassCard>

              {/* Profile Header Section */}
              <GlassCardVariant className="relative -mt-37 md:-mt-57 mb-8 p-4 md:p-8 !rounded-b-3xl">
                <div className="flex flex-row items-end gap-4 md:gap-6">
                  <div className="shrink-0">
                    <Avatar className="h-20 w-20 md:h-40 md:w-40 ring-4 ring-white/20 shadow-2xl">
                      <AvatarImage src={userProfile?.avatar_url || "/avatar-default.jpg"} alt={userProfile?.name || ""} />
                      <AvatarFallback className="text-xl md:text-4xl bg-linear-to-br from-brand-primary to-brand-primary-dark">
                        {userProfile?.name?.[0] || ""}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 text-left">
                    <div className="mb-3 md:mb-4">
                      <h1 className="text-xl md:text-3xl font-bold text-white">{userProfile?.name || ""}</h1>
                      <p className="text-brand-primary text-sm md:text-lg">{userProfile?.username || ""}</p>
                    </div>

                    <div className="flex gap-2 md:gap-3 items-center flex-wrap">
                      {userProfile?.friend_status === 'received_pending' ? (
                        <>
                          <GlassButton onClick={handleAcceptRequest} disabled={isLoading} className="bg-linear-to-r from-brand-primary to-brand-primary-dark text-xs md:text-base">
                            {isLoading ? 'Processing...' : 'Accept'}
                          </GlassButton>
                          <GlassButton onClick={handleRejectRequest} disabled={isLoading} className="bg-white/10 hover:bg-white/20 text-xs md:text-base">
                            {isLoading ? 'Processing...' : 'Reject'}
                          </GlassButton>
                        </>
                      ) : (
                        <GlassButton
                          onClick={buttonConfig.onClick}
                          disabled={buttonConfig.disabled}
                          className={`${buttonConfig.className} text-xs md:text-base`}
                        >
                          {buttonConfig.text}
                        </GlassButton>
                      )}

                      <GlassButton
                        className="bg-white/10 hover:bg-white/20"
                        title="Send message"
                        onClick={handleStartChat}
                        disabled={isStartingChat}
                      >
                        <Send className="w-4 h-4 md:w-6 md:h-6" />
                      </GlassButton>

                      <GlassButton className="bg-white/10 hover:bg-white/20" title="Share profile">
                        <Share2 className="w-4 h-4 md:w-6 md:h-6" />
                      </GlassButton>
                    </div>
                  </div>
                </div>
              </GlassCardVariant>

              {/* Bio & Information */}
              <GlassCard variant="lg" className="mb-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-3">Information</h2>
                    <p className="text-white/80 text-base leading-relaxed">
                      {userProfile?.bio || "No bio available."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-white/70">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-primary" />
                      {userProfile?.location || "Not specified"}
                    </div>
                    {userProfile?.website && (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-brand-primary" />
                        <a href={userProfile.website} target="_blank" className="text-brand-primary hover:underline">
                          {userProfile.website}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-primary" />
                      Joined {userProfile?.joinDate || "recently"}
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <GlassStatCard label="Posts" value={userStats.posts.toString()} />
                <GlassStatCard label="Followers" value={userStats.followers.toString()} />
                <GlassStatCard label="Following" value={userStats.following.toString()} />
              </div>

              {/* Posts Grid */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userPosts.map((post) => (
                    <div key={post.id} className="group overflow-hidden cursor-pointer relative rounded-2xl">
                      <div className="relative w-full h-64">
                        <Image
                          src={post.image}
                          alt="Post"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 flex gap-4">
                            <div className="flex items-center gap-1 text-white bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-md">
                              <Heart className="w-4 h-4 fill-current" />
                              {post.likes}
                            </div>
                            <div className="flex items-center gap-1 text-white bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-md">
                              <MessageSquare className="w-4 h-4" />
                              {post.comments}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <RightSidebar />
    </div>
  )
}
