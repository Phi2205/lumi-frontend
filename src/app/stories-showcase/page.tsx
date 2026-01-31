"use client"

import { GlassStories } from "@/lib/components/glass-stories"
import { GlassCard } from "@/lib/components/glass-card"
import { GlassButton } from "@/lib/components/glass-button"
import { GlassContainer } from "@/lib/components/glass-container"
import { Heart, MessageCircle, Share2 } from "lucide-react"

export default function StoriesPage() {
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
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(34, 211, 238, 0.15) 0%, transparent 70%)'
        }}
      />

      <main className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Stories & Feed
          </h1>
          <p className="text-white/70 text-lg">
            Discover and share moments from the community
          </p>
        </div>

        {/* Stories Component */}
        <div className="mb-12">
          <GlassStories 
            blur={25}
            refraction={0.12}
            depth={4}
          />
        </div>

        {/* Feed Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">Your Feed</h2>
            <div className="space-y-6">
              {[
                {
                  author: "Sarah Designer",
                  avatar: "SD",
                  time: "2 hours ago",
                  content:
                    "Just completed designing a stunning glassmorphism UI kit! The new blur, refraction, and depth props make it so easy to create beautiful layered effects.",
                  image: "🎨",
                  likes: 234,
                  comments: 45,
                  shares: 12,
                },
                {
                  author: "Mike Developer",
                  avatar: "MD",
                  time: "4 hours ago",
                  content:
                    "Amazing new component library just dropped! Love how flexible the glass components are. Building with these is pure joy.",
                  image: "⚡",
                  likes: 892,
                  comments: 156,
                  shares: 67,
                },
                {
                  author: "Emma Creative",
                  avatar: "EC",
                  time: "6 hours ago",
                  content:
                    "Breaking news: We just launched the most advanced glassmorphism design system ever. Dynamic props for blur, refraction, and depth give you full control!",
                  image: "🚀",
                  likes: 1250,
                  comments: 234,
                  shares: 145,
                },
                {
                  author: "Alex Phoenix",
                  avatar: "AP",
                  time: "8 hours ago",
                  content:
                    "The new glass components are game-changers. Supporting customizable blur, refraction, and depth opens up endless design possibilities.",
                  image: "✨",
                  likes: 567,
                  comments: 89,
                  shares: 34,
                },
              ].map((post, index) => (
                <GlassCard
                  key={index}
                  variant="lg"
                  interactive
                  className="flex flex-col"
                  blur={20}
                  refraction={0.12}
                  depth={3}
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">{post.avatar}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{post.author}</h3>
                        <p className="text-white/60 text-xs">{post.time}</p>
                      </div>
                    </div>
                    <button className="text-white/60 hover:text-white transition-colors">
                      ⋮
                    </button>
                  </div>

                  {/* Post Content */}
                  <p className="text-white/90 mb-4 leading-relaxed">{post.content}</p>

                  {/* Post Image */}
                  <div className="h-40 rounded-lg bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent flex items-center justify-center text-5xl mb-4">
                    {post.image}
                  </div>

                  {/* Post Stats */}
                  <div className="text-xs text-white/60 mb-4 pb-4 border-b border-white/10">
                    <span>{post.likes} likes • {post.comments} comments • {post.shares} shares</span>
                  </div>

                  {/* Post Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 text-white/70 hover:text-red-400 transition-colors text-sm font-medium">
                      <Heart className="w-4 h-4" />
                      Like
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 text-white/70 hover:text-blue-400 transition-colors text-sm font-medium">
                      <MessageCircle className="w-4 h-4" />
                      Comment
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 text-white/70 hover:text-cyan-400 transition-colors text-sm font-medium">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <GlassButton
                variant="secondary"
                size="lg"
                blur={20}
                refraction={0.12}
                depth={3}
              >
                Load More Posts
              </GlassButton>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* What's Happening */}
            <GlassContainer
              className="p-6"
              blur={25}
              refraction={0.12}
              depth={4}
            >
              <h3 className="text-xl font-bold text-white mb-4">What's Happening</h3>
              <div className="space-y-4">
                {[
                  {
                    category: "TRENDING",
                    title: "Glassmorphism Design",
                    posts: "234K posts",
                  },
                  {
                    category: "TECHNOLOGY",
                    title: "Web Components",
                    posts: "89K posts",
                  },
                  {
                    category: "DESIGN",
                    title: "UI/UX Trends",
                    posts: "156K posts",
                  },
                  {
                    category: "COMMUNITY",
                    title: "Creator Community",
                    posts: "45K posts",
                  },
                ].map((trend, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-3 rounded-lg hover:bg-white/10 transition-all group"
                  >
                    <p className="text-white/60 text-xs font-medium group-hover:text-white/80">
                      {trend.category}
                    </p>
                    <p className="text-white font-semibold group-hover:text-blue-400">
                      {trend.title}
                    </p>
                    <p className="text-white/60 text-xs">{trend.posts}</p>
                  </button>
                ))}
              </div>
            </GlassContainer>

            {/* Recommended Creators */}
            <GlassContainer
              className="p-6"
              blur={25}
              refraction={0.12}
              depth={4}
            >
              <h3 className="text-xl font-bold text-white mb-4">Recommended Creators</h3>
              <div className="space-y-3">
                {[
                  { name: "Design Studio", username: "@designstudio", followers: "125K" },
                  { name: "Dev Community", username: "@devcommunity", followers: "89K" },
                  { name: "Creative Hub", username: "@creativehub", followers: "156K" },
                  { name: "Tech Innovators", username: "@techinnovators", followers: "203K" },
                ].map((creator, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/15 transition-all"
                  >
                    <div>
                      <p className="text-white font-semibold text-sm">{creator.name}</p>
                      <p className="text-white/60 text-xs">{creator.username}</p>
                      <p className="text-white/60 text-xs">{creator.followers} followers</p>
                    </div>
                    <GlassButton
                      variant="primary"
                      size="sm"
                      blur={15}
                      refraction={0.1}
                      depth={2}
                    >
                      Follow
                    </GlassButton>
                  </div>
                ))}
              </div>
            </GlassContainer>

            {/* Stats */}
            <GlassContainer
              className="p-6"
              blur={25}
              refraction={0.12}
              depth={4}
            >
              <h3 className="text-xl font-bold text-white mb-4">Community Stats</h3>
              <div className="space-y-3 text-white/80 text-sm">
                <div className="flex justify-between">
                  <span>Active Users</span>
                  <span className="font-semibold text-white">1.2M</span>
                </div>
                <div className="flex justify-between">
                  <span>Posts Today</span>
                  <span className="font-semibold text-white">450K</span>
                </div>
                <div className="flex justify-between">
                  <span>New Creators</span>
                  <span className="font-semibold text-white">8.5K</span>
                </div>
                <div className="flex justify-between">
                  <span>Global Reach</span>
                  <span className="font-semibold text-white">185+ Countries</span>
                </div>
              </div>
            </GlassContainer>
          </div>
        </div>
      </main>
    </div>
  )
}
