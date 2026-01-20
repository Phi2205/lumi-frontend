"use client"

import { useState } from "react"
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
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState("home")

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
        className="fixed inset-0 -z-10"
        style={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)'
        }}
      />
      
      <div 
        className="fixed inset-0 bg-cover bg-no-repeat bg-center -z-10"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(/bg12.jpg)`
        }}
      />

      <Header />
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="md:ml-64 lg:mr-80 pt-4 pb-20 md:pb-4 relative z-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

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
            <div className="flex-shrink-0">
              <Avatar className="h-40 w-40 ring-4 ring-white/20 shadow-2xl">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-400 to-cyan-400">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                  <p className="text-cyan-300 text-lg">{user.username}</p>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <GlassButton
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={isFollowing ? "bg-white/10" : "bg-gradient-to-r from-blue-500 to-cyan-500"}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </GlassButton>
                  <GlassButton className="bg-white/10 hover:bg-white/20" title="Send message">
                    <Send className="w-5 h-5" />
                  </GlassButton>
                  <GlassButton className="bg-white/10 hover:bg-white/20" title="Share profile">
                    <Share2 className="w-5 h-5" />
                  </GlassButton>
                </div>
              </div>

              <p className="text-white/80 text-base mb-4">{user.bio}</p>

              {/* User Details */}
              <div className="flex flex-wrap gap-4 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  {user.location}
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-cyan-400" />
                  <a href="#" className="text-cyan-300 hover:text-cyan-200">
                    {user.website}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  {user.joinDate}
                </div>
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
            change={`${isFollowing ? "+1" : ""}`}
            changeType="up"
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
                  className="flex items-center gap-2 text-white/70 hover:text-cyan-300 transition-colors"
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
                <div className="relative w-full h-64 bg-gradient-to-br from-blue-400 to-cyan-400">
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
        </div>
      </main>

      <RightSidebar />
    </div>
  )
}
