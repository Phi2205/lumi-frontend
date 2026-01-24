"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { MapPin, Link as LinkIcon, Mail, Calendar, Heart, MessageSquare, Share2, Send, ArrowLeft, Play } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { GlassCard, GlassButton, GlassStatCard } from "@/lib/components"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { RightSidebar } from "@/components/RightSidebar"
import { formatViews } from "@/utils/format"
import { getUserByUsername } from "@/services/user.service"
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest } from "@/services/friendRequest.service"
import { User, FriendshipStatus } from "@/types/user.type"
import { ProfileSkeleton } from "@/components/skeleton"

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

  // Get button configuration based on status
  const getButtonConfig = (status: FriendshipStatus | undefined) => {
    console.log(status);
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

  // Mock user data - In a real app, fetch this based on username
  const userDatabase: Record<string, any> = {
    "phi-duong": {
      name: "Phi Dương",
      username: "@phi.duong",
      bio: "Full-stack Developer | Tech Enthusiast | Open source contributor",
      location: "Hồ Chí Minh, Vietnam",
      website: "phi-duong.dev",
      email: "phi@example.com",
      joinDate: "Joined March 2020",
      followers: 5420,
      following: 892,
      posts: 234,
      avatar: "/profile-avatar.jpg",
      cover: "/profile-cover.jpg",
    },
    "alex-johnson": {
      name: "Alex Johnson",
      username: "@alexjohnson",
      bio: "Product Designer | Tech Enthusiast | Always learning something new",
      location: "New York, NY",
      website: "alexjohnson.dev",
      email: "alex@example.com",
      joinDate: "Joined January 2021",
      followers: 8750,
      following: 542,
      posts: 156,
      avatar: "/profile-avatar.jpg",
      cover: "/profile-cover.jpg",
    },
    "sarah-smith": {
      name: "Sarah Smith",
      username: "@sarahsmith",
      bio: "Content Creator | Marketing Expert | Digital Strategy",
      location: "San Francisco, CA",
      website: "sarahsmith.com",
      email: "sarah@example.com",
      joinDate: "Joined June 2019",
      followers: 12500,
      following: 1240,
      posts: 487,
      avatar: "/profile-avatar.jpg",
      cover: "/profile-cover.jpg",
    },
  }

  const user = userDatabase[username] || {
    name: "Unknown User",
    username: `@${username}`,
    bio: "User not found",
    location: "Somewhere",
    website: "example.com",
    email: "user@example.com",
    joinDate: "Unknown",
    followers: 0,
    following: 0,
    posts: 0,
    avatar: "/profile-avatar.jpg",
    cover: "/profile-cover.jpg",
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
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#1e293b_0%,#0f172a_50%,#1e293b_100%)]"
      />
      
      <div
        className="fixed inset-0 bg-cover bg-no-repeat bg-center -z-10 bg-[linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)),url(/bg12.jpg)]"
      />
      <Header />
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="md:ml-64 lg:mr-80 pt-4 pb-20 md:pb-4 relative z-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          {/* <Modal isOpen={true} onClose={() => {console.log("close")}} />   */}
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.history.back();
                }
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {isInitialLoading ? (
            <ProfileSkeleton />
          ) : (
            <>
              {/* Cover Photo */}
              <GlassCard variant="lg" className="h-48 md:h-64 rounded-3xl overflow-hidden mb-0">
          <div className="relative w-full h-full">
            <Image
              src={user.cover || "/placeholder.svg"}
              alt="Profile cover"
              fill
              className="object-cover"
            />
          </div>
        </GlassCard>

        {/* Profile Header Section */}
        <GlassCard className="relative -mt-20 mb-8 p-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              <Avatar className="h-40 w-40 ring-4 ring-white/20 shadow-2xl">
                <AvatarImage src={userProfile?.avatar_url || "/placeholder.svg"} alt={userProfile?.name || ""} />
                <AvatarFallback className="text-4xl bg-linear-to-br from-brand-primary to-brand-primary-dark">
                  {userProfile?.name?.[0] || ""}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-white">{userProfile?.name || ""}</h1>
                <p className="text-brand-primary text-lg">{userProfile?.username || ""}</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 items-center flex-wrap">
                {userProfile?.friend_status === 'received_pending' && (
                  <>
                    <GlassButton
                      type="button"
                      onClick={handleAcceptRequest}
                      disabled={isLoading}
                      className="bg-linear-to-r from-brand-primary to-brand-primary-dark whitespace-nowrap"
                    >
                      {isLoading ? 'Processing...' : 'Accept'}
                    </GlassButton>
                    <GlassButton
                      type="button"
                      onClick={handleRejectRequest}
                      disabled={isLoading}
                      className="bg-white/10 hover:bg-white/20 whitespace-nowrap"
                    >
                      {isLoading ? 'Processing...' : 'Reject'}
                    </GlassButton>
                  </>
                )}
                {userProfile?.friend_status !== 'received_pending' && buttonConfig && (
                  <GlassButton
                    type="button"
                    onClick={buttonConfig.onClick}
                    disabled={buttonConfig.disabled}
                    className={buttonConfig.className}
                  >
                    {buttonConfig.text}
                  </GlassButton>
                )}
                <GlassButton className="bg-white/10 hover:bg-white/20" title="Send message">
                  <Send className="w-6 h-6" />
                </GlassButton>
                <GlassButton className="bg-white/10 hover:bg-white/20" title="Share profile">
                  <Share2 className="w-6 h-6" />
                </GlassButton>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Bio & User Details Section */}
        <GlassCard className="mb-8">
          <div className="space-y-6">
            {/* Bio */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Information</h2>
              <p className="text-white/80 text-base leading-relaxed">
                {userProfile?.bio || "Bio"}
              </p>
            </div>

            {/* User Details */}
            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-primary" />
                {userProfile?.location || "Địa chỉ"}
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-brand-primary" />
                <a href="#" className="text-brand-primary hover:text-brand-primary-light">
                  {userProfile?.website || "website"}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-primary" />
                {userProfile?.joinDate || "Ngày sinh"}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <GlassStatCard label="Posts" value={user.posts.toString()} />
          <GlassStatCard
            label="Followers"
            value={`${(user.followers / 1000).toFixed(1)}K`}
          />
          <GlassStatCard label="Following" value={user.following.toString()} />
        </div>

        {/* About Section */}
        <GlassCard className="mb-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">About</h2>
              <p className="text-white/80 leading-relaxed">
                {user.name} is a talented professional with a passion for creating amazing digital experiences. Always
                exploring new technologies and sharing knowledge with the community.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {["Web Development", "Design", "Problem Solving", "Team Collaboration", "Innovation", "Learning"].map(
                  (skill) => (
                    <div
                      key={skill}
                      className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm text-white/80 hover:bg-white/15 transition-all"
                    >
                      {skill}
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
              <div className="flex flex-col gap-2">
                <a
                  href={`mailto:${user.email}`}
                  className="flex items-center gap-2 text-white/70 hover:text-brand-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {user.email}
                </a>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Posts Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userPosts.map((post) => (
              <div key={post.id} className="group overflow-hidden cursor-pointer relative">
                <div className="relative w-full h-64 bg-linear-to-br from-brand-primary to-brand-primary-dark">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt="Post"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Views count - Bottom left corner */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white font-semibold">
                    <Play className="w-4 h-4 fill-white" />
                    <span className="text-sm">{formatViews(post.views)}</span>
                  </div>

                  {/* Hover overlay with likes and comments */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-4">
                      <div className="flex items-center gap-1 text-white bg-black/50 px-3 py-2 rounded-lg backdrop-blur-md">
                        <Heart className="w-4 h-4 fill-current" />
                        {post.likes}
                      </div>
                      <div className="flex items-center gap-1 text-white bg-black/50 px-3 py-2 rounded-lg backdrop-blur-md">
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
