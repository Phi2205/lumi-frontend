"use client"

import { TrendingUp, Users, BarChart3, Zap, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { GlassCard } from "@/lib/components/glass-card"
import { GlassButton } from "@/lib/components/glass-button"
import { GlassStatCard } from "@/lib/components/glass-stat-card"
import { GlassContainer } from "@/lib/components/glass-container"
import { GlassBadge } from "@/lib/components/glass-badge"

export default function DashboardPage() {
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
          background: 'radial-gradient(ellipse 60% 40% at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)'
        }}
      />
      <div
        className="fixed inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'4\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px'
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-balance">
            Welcome Back, Creator
          </h1>
          <p className="text-white/70 text-lg">
            Your analytics and performance overview
          </p>
        </div>

        {/* Hero Section with Glass Card */}
        <GlassCard 
          variant="lg" 
          className="mb-8 bg-gradient-to-br from-blue-500/15 via-cyan-500/5 to-transparent border-blue-400/30"
          blur={30}
          refraction={0.15}
          depth={5}
          interactive
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <GlassBadge variant="blue" blur={20} refraction={0.12} depth={2}>
                  Featured
                </GlassBadge>
                <GlassBadge variant="cyan" blur={20} refraction={0.12} depth={2}>
                  New
                </GlassBadge>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Launch Your Next Project
              </h2>
              <p className="text-white/80 text-base leading-relaxed">
                Get started with our new glassmorphism design system. Create stunning, modern interfaces with our enhanced glass components featuring dynamic blur, refraction, and depth controls.
              </p>
            </div>
            <div className="flex gap-3 flex-col md:flex-row">
              <GlassButton 
                variant="primary" 
                size="lg"
                blur={25}
                refraction={0.15}
                depth={4}
              >
                Get Started
              </GlassButton>
              <GlassButton 
                variant="secondary" 
                size="lg"
                blur={25}
                refraction={0.15}
                depth={4}
              >
                Learn More
              </GlassButton>
            </div>
          </div>
        </GlassCard>

        {/* Stats Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Key Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassStatCard 
              label="Total Users" 
              value="12,584" 
              icon={<Users className="text-blue-400" />}
              change="+12.5% from last month"
              changeType="up"
              blur={20}
              refraction={0.12}
              depth={3}
            />
            <GlassStatCard 
              label="Revenue" 
              value="$48,200" 
              icon={<BarChart3 className="text-cyan-400" />}
              change="+8.2% from last month"
              changeType="up"
              blur={20}
              refraction={0.12}
              depth={3}
            />
            <GlassStatCard 
              label="Engagement" 
              value="84.5%" 
              icon={<TrendingUp className="text-yellow-400" />}
              change="-2.3% from last month"
              changeType="down"
              blur={20}
              refraction={0.12}
              depth={3}
            />
            <GlassStatCard 
              label="Performance" 
              value="98.7%" 
              icon={<Zap className="text-purple-400" />}
              change="Stable"
              changeType="neutral"
              blur={20}
              refraction={0.12}
              depth={3}
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Features & Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Advanced Analytics",
                description: "Real-time insights into your performance metrics",
                icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
              },
              {
                title: "User Management",
                description: "Comprehensive user profiles and activity tracking",
                icon: <Users className="w-8 h-8 text-cyan-400" />,
              },
              {
                title: "Growth Tracking",
                description: "Monitor trends and growth patterns over time",
                icon: <TrendingUp className="w-8 h-8 text-yellow-400" />,
              },
              {
                title: "Performance Optimization",
                description: "Tools to maximize efficiency and speed",
                icon: <Zap className="w-8 h-8 text-purple-400" />,
              },
              {
                title: "Real-time Updates",
                description: "Live data synchronization across all devices",
                icon: <TrendingUp className="w-8 h-8 text-green-400" />,
              },
              {
                title: "Security First",
                description: "Enterprise-grade security and data protection",
                icon: <BarChart3 className="w-8 h-8 text-red-400" />,
              },
            ].map((feature, index) => (
              <GlassCard
                key={index}
                variant="sm"
                interactive
                className="flex flex-col"
                blur={20}
                refraction={0.12}
                depth={3}
              >
                <div className="mb-3">{feature.icon}</div>
                <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-white/70 text-sm flex-1">{feature.description}</p>
                <GlassButton 
                  variant="ghost" 
                  size="sm"
                  className="mt-3 w-full"
                  blur={15}
                  refraction={0.1}
                  depth={2}
                >
                  Learn More
                </GlassButton>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
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
                  title: "New user registration spike",
                  description: "1,250 new users signed up in the last 24 hours",
                  time: "2 hours ago",
                  type: "up",
                },
                {
                  title: "System maintenance completed",
                  description: "All systems are now running at optimal performance",
                  time: "5 hours ago",
                  type: "neutral",
                },
                {
                  title: "Feature deployment",
                  description: "New analytics dashboard has been successfully deployed",
                  time: "1 day ago",
                  type: "up",
                },
                {
                  title: "Security audit passed",
                  description: "Passed comprehensive security audit with zero findings",
                  time: "3 days ago",
                  type: "up",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between pb-4 border-b border-white/10 last:border-b-0 last:pb-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold">{activity.title}</h4>
                      {activity.type === "up" && (
                        <ArrowUpRight className="w-4 h-4 text-green-400" />
                      )}
                      {activity.type === "down" && (
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <p className="text-white/70 text-sm">{activity.description}</p>
                  </div>
                  <span className="text-white/50 text-xs whitespace-nowrap ml-4">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </GlassContainer>
        </div>

        {/* CTA Section */}
        <GlassCard
          variant="lg"
          className="bg-gradient-to-br from-purple-500/15 via-pink-500/5 to-transparent border-purple-400/30 text-center"
          blur={30}
          refraction={0.15}
          depth={5}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take Your Project Further?
          </h2>
          <p className="text-white/80 text-lg mb-6 max-w-2xl mx-auto">
            Explore our advanced features and unlock the full potential of our glassmorphism design system.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <GlassButton 
              variant="accent" 
              size="lg"
              blur={25}
              refraction={0.15}
              depth={4}
            >
              Upgrade Now
            </GlassButton>
            <GlassButton 
              variant="ghost" 
              size="lg"
              blur={25}
              refraction={0.15}
              depth={4}
            >
              View Pricing
            </GlassButton>
          </div>
        </GlassCard>
      </main>
    </div>
  )
}
