"use client"

import { Mail, MapPin, Link as LinkIcon, Settings, Share2, Camera, Heart, MessageCircle, Share } from "lucide-react"
import { GlassCard } from "@/lib/components/glass-card"
import { GlassButton } from "@/lib/components/glass-button"
import { GlassStatCard } from "@/lib/components/glass-stat-card"
import { GlassContainer } from "@/lib/components/glass-container"
import { GlassInput } from "@/lib/components/glass-input"
import { GlassBadge } from "@/lib/components/glass-badge"

export default function ProfilePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Complex Gradient Background */}
      <div
        className="fixed inset-0 -z-10 transition-all duration-1000"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(3, 0, 20, 0.8) 0%, #030014 50%, #020010 100%)'
        }}
      />
      <div
        className="fixed inset-0 -z-10 opacity-40 transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 70% 50%, rgba(34, 211, 238, 0.15) 0%, transparent 70%)'
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 p-6 md:p-8 max-w-4xl mx-auto">
        {/* Profile Header */}
        <GlassCard
          variant="lg"
          className="mb-8 relative"
          blur={30}
          refraction={0.15}
          depth={5}
        >
          {/* Background Image */}
          <div
            className="h-32 bg-gradient-to-r from-blue-500/30 via-cyan-500/20 to-purple-500/30 rounded-t-3xl -m-6 mb-4 relative"
            style={{
              backgroundImage: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(34,211,238,0.2) 50%, rgba(168,85,247,0.2) 100%)'
            }}
          />

          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-32 h-32 rounded-full border-4 border-white/30 overflow-hidden bg-gradient-to-br from-blue-500/40 to-purple-500/40 flex items-center justify-center shadow-xl"
                style={{
                  backdropFilter: 'blur(10px)',
                }}
              >
                <span className="text-5xl font-bold text-white">AP</span>
              </div>
              <button className="absolute bottom-2 right-2 p-2 rounded-full bg-blue-500/50 hover:bg-blue-500/70 text-white transition-all">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-white">Alex Phoenix</h1>
                  <p className="text-white/70 text-sm">@alexphoenix</p>
                </div>
                <div className="flex gap-2">
                  <GlassButton variant="ghost" size="sm" blur={20} refraction={0.1} depth={2}>
                    <Share2 className="w-4 h-4" />
                  </GlassButton>
                  <GlassButton variant="primary" size="sm" blur={20} refraction={0.1} depth={2}>
                    Follow
                  </GlassButton>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                <GlassBadge variant="blue" blur={15} refraction={0.12} depth={2}>
                  Creator
                </GlassBadge>
                <GlassBadge variant="cyan" blur={15} refraction={0.12} depth={2}>
                  Verified
                </GlassBadge>
                <GlassBadge variant="yellow" blur={15} refraction={0.12} depth={2}>
                  Featured
                </GlassBadge>
              </div>

              <p className="text-white/80 text-base leading-relaxed mb-4">
                Digital creator & designer. Building beautiful experiences with modern glassmorphism design patterns. Passionate about web technologies and user experience.
              </p>

              <div className="flex flex-wrap gap-4 text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>alex@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  <span>www.alexphoenix.com</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Stats Overview */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Stats Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassStatCard
              label="Posts"
              value="284"
              icon={<span className="text-2xl">📝</span>}
              change="12 this week"
              changeType="up"
              blur={20}
              refraction={0.12}
              depth={3}
            />
            <GlassStatCard
              label="Followers"
              value="48.2K"
              icon={<span className="text-2xl">👥</span>}
              change="+2.5K this month"
              changeType="up"
              blur={20}
              refraction={0.12}
              depth={3}
            />
            <GlassStatCard
              label="Engagement"
              value="92.5%"
              icon={<span className="text-2xl">📊</span>}
              change="Excellent"
              changeType="neutral"
              blur={20}
              refraction={0.12}
              depth={3}
            />
            <GlassStatCard
              label="Likes Received"
              value="15.8K"
              icon={<span className="text-2xl">❤️</span>}
              change="+1.2K this week"
              changeType="up"
              blur={20}
              refraction={0.12}
              depth={3}
            />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Recent Activity</h3>
          <GlassContainer
            className="p-6"
            blur={25}
            refraction={0.12}
            depth={4}
          >
            <div className="space-y-4">
              {[
                {
                  type: "post",
                  content: "Just launched my new glassmorphism design system!",
                  timestamp: "2 hours ago",
                  likes: 234,
                  comments: 45,
                },
                {
                  type: "post",
                  content: "Check out these amazing glass components with dynamic props",
                  timestamp: "1 day ago",
                  likes: 892,
                  comments: 156,
                },
                {
                  type: "follow",
                  content: "Started following Sarah Designer",
                  timestamp: "2 days ago",
                  likes: 0,
                  comments: 0,
                },
                {
                  type: "post",
                  content: "Exploring new color palettes for modern web design",
                  timestamp: "3 days ago",
                  likes: 567,
                  comments: 89,
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="pb-4 border-b border-white/10 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start gap-4 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">👤</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{activity.type === "post" ? "You posted:" : "You followed:"}</p>
                      <p className="text-white/80 text-base mt-1">{activity.content}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between ml-14">
                    <span className="text-white/50 text-xs">{activity.timestamp}</span>
                    {activity.type === "post" && (
                      <div className="flex gap-4 text-white/60 text-xs">
                        <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                          <Heart className="w-3 h-3" /> {activity.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                          <MessageCircle className="w-3 h-3" /> {activity.comments}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassContainer>
        </div>

        {/* Settings Panel */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Profile Settings</h3>
          <GlassContainer
            className="p-6"
            blur={25}
            refraction={0.12}
            depth={4}
          >
            <div className="space-y-6">
              <GlassInput
                label="Full Name"
                placeholder="Enter your full name"
                defaultValue="Alex Phoenix"
                blur={20}
                refraction={0.12}
                depth={3}
              />
              <GlassInput
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                defaultValue="alex@example.com"
                blur={20}
                refraction={0.12}
                depth={3}
              />
              <GlassInput
                label="Bio"
                placeholder="Tell us about yourself"
                defaultValue="Digital creator & designer. Building beautiful experiences with modern glassmorphism design patterns."
                blur={20}
                refraction={0.12}
                depth={3}
              />
              <GlassInput
                label="Location"
                placeholder="Your location"
                defaultValue="San Francisco, CA"
                blur={20}
                refraction={0.12}
                depth={3}
              />

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <GlassButton
                  variant="primary"
                  blur={20}
                  refraction={0.12}
                  depth={3}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Save Changes
                </GlassButton>
                <GlassButton
                  variant="ghost"
                  blur={20}
                  refraction={0.12}
                  depth={3}
                >
                  Cancel
                </GlassButton>
              </div>
            </div>
          </GlassContainer>
        </div>
      </main>
    </div>
  )
}
