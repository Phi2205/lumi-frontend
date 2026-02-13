"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronRight, Sparkles, Zap, Shield, Users, TrendingUp, Star } from "lucide-react"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden" ref={containerRef}>
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 transition-all duration-[5000ms]"
          style={{
            background: `linear-gradient(
              ${45 + (scrollY * 0.05)}deg,
              #667eea 0%,
              #764ba2 25%,
              #f093fb 50%,
              #4facfe 75%,
              #667eea 100%
            )`,
          }}
        />
        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 opacity-40" style={{
          background: `radial-gradient(ellipse 80% 60% at ${50 + (scrollY * 0.02)}% ${50 - (scrollY * 0.01)}%, rgba(255,255,255,0.15) 0%, transparent 70%)`
        }} />
        {/* Subtle noise */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        />
      </div>

      {/* Floating Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-full px-8 py-4 flex items-center justify-between shadow-lg">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-lg text-white">Lumi</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection("hero")} className="text-white/80 hover:text-white transition">Hero</button>
              <button onClick={() => scrollToSection("features")} className="text-white/80 hover:text-white transition">Features</button>
              <button onClick={() => scrollToSection("stats")} className="text-white/80 hover:text-white transition">Stats</button>
              <button onClick={() => scrollToSection("testimonials")} className="text-white/80 hover:text-white transition">Testimonials</button>
            </div>

            {/* CTA Button */}
            <button className="backdrop-blur-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-2 rounded-full font-medium transition transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section id="hero" className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div
              className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-3xl p-12 md:p-20 shadow-2xl text-center transition-all duration-500 hover:bg-white/15 hover:shadow-3xl"
              style={{
                transform: `translateY(${Math.min(scrollY * -0.1, 50)}px)`,
              }}
            >
              {/* Badge */}
              <div className="inline-block backdrop-blur-lg bg-white/20 border border-white/30 rounded-full px-4 py-2 mb-6">
                <span className="text-white/90 text-sm font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Next-Gen Social Platform
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance leading-tight">
                Connect & Share Like Never Before
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto text-balance">
                Experience a premium social platform with glassmorphism design. Share stories, connect with friends, and explore a vibrant community in style.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <button className="backdrop-blur-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition transform hover:scale-105 flex items-center gap-2 group">
                  Start Exploring
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
                <button className="backdrop-blur-lg bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold transition">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16 text-balance">
              Premium Features
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Sparkles,
                  title: "Beautiful Stories",
                  description: "Share your moments with stunning visual effects and smooth animations",
                },
                {
                  icon: Users,
                  title: "Community Driven",
                  description: "Connect with friends and build meaningful relationships in real-time",
                },
                {
                  icon: Shield,
                  title: "Privacy First",
                  description: "Your data is encrypted and protected with enterprise-grade security",
                },
                {
                  icon: TrendingUp,
                  title: "Trending Content",
                  description: "Discover what's hot with our intelligent trending algorithm",
                },
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Experience blazing-fast load times and smooth interactions",
                },
                {
                  icon: Star,
                  title: "Premium Experience",
                  description: "Ad-free experience with exclusive features and early access",
                },
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400/30 to-purple-500/30 flex items-center justify-center mb-4 group-hover:from-pink-400/50 group-hover:to-purple-500/50 transition">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-3xl p-12 md:p-16 shadow-2xl">
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { number: "2.5M+", label: "Active Users" },
                  { number: "150M+", label: "Stories Shared" },
                  { number: "99.9%", label: "Uptime" },
                  { number: "50+", label: "Countries" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-white/70 text-sm font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16 text-balance">
              Loved by Users Worldwide
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Sarah Chen",
                  role: "Content Creator",
                  feedback: "The design is absolutely stunning! I love how smooth and premium everything feels.",
                  avatar: "SC",
                },
                {
                  name: "Marcus Johnson",
                  role: "Tech Enthusiast",
                  feedback: "Best social platform I've used. Fast, secure, and incredibly intuitive.",
                  avatar: "MJ",
                },
                {
                  name: "Emma Rodriguez",
                  role: "Photographer",
                  feedback: "The story features are game-changing. My followers love the visual quality.",
                  avatar: "ER",
                },
                {
                  name: "Alex Kim",
                  role: "Student",
                  feedback: "Finally a platform that respects my privacy while being super fun to use.",
                  avatar: "AK",
                },
                {
                  name: "Jessica White",
                  role: "Entrepreneur",
                  feedback: "Perfect for building my brand. The analytics are incredible.",
                  avatar: "JW",
                },
                {
                  name: "David Brown",
                  role: "Designer",
                  feedback: "The glassmorphism design is the future. Absolutely beautiful.",
                  avatar: "DB",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:shadow-xl"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">{testimonial.name}</div>
                      <div className="text-white/60 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">"{testimonial.feedback}"</p>
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Join?</h2>
              <p className="text-white/70 text-lg mb-8 text-balance">
                Start your journey with Lumi today and experience the future of social networking.
              </p>
              <button className="backdrop-blur-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-semibold transition transform hover:scale-105">
                Get Started Free
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Scroll indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
        <div className="text-white/50 text-xs text-center">
          {scrollY === 0 && "Scroll to explore"}
        </div>
      </div>
    </div>
  )
}
