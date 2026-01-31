"use client"

import { ArrowRight, Sparkles, Zap, Shield, Layers, Eye, Code2, Palette, Zap as ZapIcon } from "lucide-react"
import Link from "next/link"
import { GlassCard } from "@/lib/components/glass-card"
import { GlassButton } from "@/lib/components/glass-button"
import { GlassContainer } from "@/lib/components/glass-container"
import { GlassBadge } from "@/lib/components/glass-badge"
import { GlassStatCard } from "@/lib/components/glass-stat-card"

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59, 130, 246, 0.25) 0%, rgba(3, 0, 20, 0.85) 45%, #000000 100%)'
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: 'radial-gradient(circle 600px at 20% 50%, rgba(34, 211, 238, 0.15) 0%, transparent 70%)'
          }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background: 'radial-gradient(circle 800px at 85% 85%, rgba(168, 85, 247, 0.12) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Navigation Header */}
        <header className="px-6 md:px-8 py-6 md:py-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Lumi</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white/70 hover:text-white transition">Features</a>
              <a href="#showcase" className="text-white/70 hover:text-white transition">Showcase</a>
              <a href="#contact" className="text-white/70 hover:text-white transition">Contact</a>
            </nav>
            <Link href="/dashboard">
              <GlassButton variant="primary" size="sm" blur={20} refraction={0.15} depth={3}>
                Enter App
              </GlassButton>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 md:px-8 py-16 md:py-28 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <GlassBadge variant="cyan" blur={18} refraction={0.2} depth={2}>
                ✨ Welcome to Glass Design
              </GlassBadge>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance leading-tight">
              Experience the Art of
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"> Glass Depth</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto text-balance mb-10">
              Discover the perfect harmony of blur, transparency, and shadow depth. A modern glassmorphism system that transforms your interface into a visual masterpiece.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <GlassButton variant="primary" blur={22} refraction={0.18} depth={4}>
                  <span className="flex items-center gap-2">
                    Explore Now <ArrowRight className="w-4 h-4" />
                  </span>
                </GlassButton>
              </Link>
              <GlassButton variant="secondary" blur={20} refraction={0.12} depth={2}>
                View Components
              </GlassButton>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section id="features" className="px-6 md:px-8 py-12 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Three Pillars of Glass</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Blur Control Card */}
            <GlassCard 
              variant="default" 
              interactive 
              blur={26}
              refraction={0.16}
              depth={4}
              className="hover:scale-105 transition-all duration-300 group"
            >
              <div className="flex flex-col h-full">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500/40 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:from-blue-500/50 group-hover:to-cyan-500/30 transition-all">
                  <Eye className="w-7 h-7 text-cyan-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Blur Control</h3>
                <p className="text-white/60 text-sm mb-6 flex-grow">
                  Fine-tune backdrop blur from 0-100px. Perfect clarity or deep focus—choose your visual flow.
                </p>
                <GlassButton variant="ghost" size="sm" blur={18} refraction={0.1} depth={2}>
                  Learn More
                </GlassButton>
              </div>
            </GlassCard>

            {/* Refraction Card - Center Featured */}
            <GlassCard 
              variant="default" 
              interactive 
              blur={28}
              refraction={0.18}
              depth={5}
              className="hover:scale-110 transition-all duration-300 group md:scale-110 md:hover:scale-120"
            >
              <div className="flex flex-col h-full">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500/40 to-pink-500/20 flex items-center justify-center mb-4 group-hover:from-purple-500/50 group-hover:to-pink-500/30 transition-all">
                  <Layers className="w-7 h-7 text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Refraction</h3>
                <p className="text-white/60 text-sm mb-6 flex-grow">
                  Control transparency 0-100%. Blend content beautifully with optimized opacity levels.
                </p>
                <GlassButton variant="ghost" size="sm" blur={18} refraction={0.1} depth={2}>
                  Explore
                </GlassButton>
              </div>
            </GlassCard>

            {/* Depth Card */}
            <GlassCard 
              variant="default" 
              interactive 
              blur={26}
              refraction={0.16}
              depth={4}
              className="hover:scale-105 transition-all duration-300 group"
            >
              <div className="flex flex-col h-full">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-yellow-500/40 to-orange-500/20 flex items-center justify-center mb-4 group-hover:from-yellow-500/50 group-hover:to-orange-500/30 transition-all">
                  <ZapIcon className="w-7 h-7 text-yellow-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Depth Layers</h3>
                <p className="text-white/60 text-sm mb-6 flex-grow">
                  Shadow depth 0-10 levels. Create visual hierarchy and stunning dimensionality.
                </p>
                <GlassButton variant="ghost" size="sm" blur={18} refraction={0.1} depth={2}>
                  Discover
                </GlassButton>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Stats Showcase */}
        <section className="px-6 md:px-8 py-14 max-w-7xl mx-auto">
          <GlassContainer blur={29} refraction={0.14} depth={5} className="p-10 md:p-14">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">Why Glassmorphism?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassStatCard 
                label="Visual Depth" 
                value="∞" 
                change="Unlimited combinations" 
                changeType="neutral"
                blur={24}
                refraction={0.15}
                depth={3}
                icon={<Eye className="w-6 h-6 text-cyan-400" />}
              />
              <GlassStatCard 
                label="Performance" 
                value="99.9%" 
                change="+15% faster rendering" 
                changeType="up"
                blur={24}
                refraction={0.15}
                depth={3}
                icon={<ZapIcon className="w-6 h-6 text-yellow-400" />}
              />
              <GlassStatCard 
                label="Design Clarity" 
                value="100%" 
                change="+25% user satisfaction" 
                changeType="up"
                blur={24}
                refraction={0.15}
                depth={3}
                icon={<Palette className="w-6 h-6 text-purple-400" />}
              />
              <GlassStatCard 
                label="Code Quality" 
                value="A+" 
                change="Production ready" 
                changeType="neutral"
                blur={24}
                refraction={0.15}
                depth={3}
                icon={<Code2 className="w-6 h-6 text-pink-400" />}
              />
            </div>
          </GlassContainer>
        </section>

        {/* Depth Spectrum Showcase */}
        <section id="showcase" className="px-6 md:px-8 py-14 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Depth in Motion</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { depth: 1, label: "Subtle", desc: "Minimal shadow" },
              { depth: 3, label: "Light", desc: "Soft depth" },
              { depth: 5, label: "Medium", desc: "Balanced" },
              { depth: 7, label: "Deep", desc: "Strong presence" },
              { depth: 10, label: "Maximum", desc: "Full impact" }
            ].map((item) => (
              <div key={item.depth} className="group">
                <GlassCard 
                  variant="sm"
                  blur={22}
                  refraction={0.14}
                  depth={item.depth}
                  className="flex flex-col items-center justify-center h-44 hover:scale-110 transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{item.depth}</div>
                    <p className="text-sm font-semibold text-cyan-300 mb-1">{item.label}</p>
                    <p className="text-xs text-white/50">{item.desc}</p>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Deep Dive */}
        <section className="px-6 md:px-8 py-14 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Perfect Balance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <GlassCard 
              variant="lg" 
              blur={27}
              refraction={0.17}
              depth={5}
              className="bg-gradient-to-br from-blue-500/12 via-cyan-500/6 to-transparent hover:from-blue-500/15 hover:via-cyan-500/8 transition-all"
            >
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-cyan-400" />
                Production Grade
              </h3>
              <p className="text-white/70 mb-6">
                Built with performance as priority. Hardware-accelerated CSS filters, zero layout shifts, and optimized rendering for 60fps smooth animations.
              </p>
              <div className="space-y-3">
                <GlassBadge variant="cyan" blur={20} refraction={0.12} depth={2}>✓ Zero Dependencies</GlassBadge>
                <GlassBadge variant="blue" blur={20} refraction={0.12} depth={2}>✓ Fully Responsive</GlassBadge>
              </div>
            </GlassCard>

            {/* Right Column */}
            <GlassCard 
              variant="lg" 
              blur={27}
              refraction={0.17}
              depth={5}
              className="bg-gradient-to-br from-purple-500/12 via-pink-500/6 to-transparent hover:from-purple-500/15 hover:via-pink-500/8 transition-all"
            >
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Layers className="w-6 h-6 text-purple-400" />
                Ultimate Control
              </h3>
              <p className="text-white/70 mb-6">
                Adjust blur, refraction, and depth independently on every component. Create unique designs without touching a single line of CSS.
              </p>
              <div className="space-y-3">
                <GlassBadge variant="purple" blur={20} refraction={0.12} depth={2}>blur: 0-100px</GlassBadge>
                <GlassBadge variant="purple" blur={20} refraction={0.12} depth={2}>depth: 0-10 levels</GlassBadge>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-6 md:px-8 py-14 max-w-7xl mx-auto">
          <GlassContainer 
            blur={30} 
            refraction={0.2} 
            depth={6}
            className="p-12 md:p-16 text-center bg-gradient-to-br from-blue-500/18 via-purple-500/12 to-pink-500/8 hover:from-blue-500/22 hover:via-purple-500/15 hover:to-pink-500/10 transition-all"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">Ready to Transform?</h2>
            <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto text-balance">
              Step into the world of premium glassmorphism. Build stunning interfaces with unparalleled control and beauty.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <GlassButton 
                  variant="primary" 
                  blur={26} 
                  refraction={0.22} 
                  depth={5}
                >
                  <span className="flex items-center gap-2">
                    Start Designing <ArrowRight className="w-4 h-4" />
                  </span>
                </GlassButton>
              </Link>
              <GlassButton 
                variant="secondary" 
                blur={24} 
                refraction={0.18} 
                depth={4}
              >
                Documentation
              </GlassButton>
            </div>
          </GlassContainer>
        </section>

        {/* Footer */}
        <footer className="px-6 md:px-8 py-12 max-w-7xl mx-auto border-t border-white/10 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Lumi</span>
              </div>
              <p className="text-white/60 text-sm">Premium glassmorphism design system.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="#" className="hover:text-white transition">Components</a></li>
                <li><a href="#" className="hover:text-white transition">Docs</a></li>
                <li><a href="#" className="hover:text-white transition">Gallery</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">License</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-white/50 text-sm">
            <p>&copy; 2024 Lumi Premium Design System. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
