"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { RightSidebar } from "@/components/RightSidebar"
import { Feed } from "@/components/Feed"
import { useDarkMode } from "@/hooks/useDarkMode"
import { useBackgroundImage } from "@/hooks/useBackgroundImage"
import { BackgroundRenderer } from "@/components/BackgroundRenderer"
import { useStoryRealtime } from "@/socket/story/useStoryRealtime"
import { SearchPanel } from "@/components/SearchPanel"

interface HomeLayoutProps {
  children?: React.ReactNode
}

function HomeContent({ children }: HomeLayoutProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "home")
  const { user, isLoading } = useAuth()
  const { isDarkMode, handleDarkModeToggle } = useDarkMode()
  const { imageLoaded, imageError } = useBackgroundImage("/bg12.jpg", isDarkMode)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Listen for story status changes and broadcast them via window events
  useStoryRealtime()

  // Sync activeTab with query param if it changes
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [searchParams, activeTab])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  // Show loading or nothing while checking auth or redirecting
  if (isLoading || !user) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {isDarkMode ? (
          <>
            <div
              className="fixed inset-0 -z-10 transition-all duration-1000"
              style={{
                background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(3, 0, 20, 0.8) 0%, #030014 50%, #020010 100%)'
              }}
            />
            <div
              className="fixed inset-0 -z-10 opacity-40 transition-opacity duration-1000"
              style={{
                background: 'radial-gradient(ellipse 60% 40% at 20% 30%, rgba(182, 196, 162, 0.15) 0%, transparent 70%)'
              }}
            />
            <div
              className="fixed inset-0 -z-10 opacity-[0.03]"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'4\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                backgroundSize: '200px 200px'
              }}
            />
          </>
        ) : (
          <div
            className="fixed inset-0 -z-10"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(/bg12.jpg)`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />
        )}
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 animate-in fade-in duration-700">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse" />
            <img
              src="/lumi-logo-v2.png"
              alt="Lumi Logo"
              className="relative w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-1000 animate-pulse"
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span
              className="text-3xl text-white font-semibold tracking-wider"
              style={{
                fontFamily: 'var(--font-dancing-script), cursive',
                textShadow: '0 0 20px rgba(255,255,255,0.3)'
              }}
            >
              Lumi
            </span>
            <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundRenderer
        isDarkMode={isDarkMode}
        imageLoaded={imageLoaded}
        imageError={imageError}
      />

      <Header
        isDarkMode={isDarkMode}
        onDarkModeToggle={handleDarkModeToggle}
        onSearchToggle={toggleSearch}
      />
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isSearchOpen={isSearchOpen}
        onSearchToggle={toggleSearch}
      />

      <SearchPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className={`${(activeTab === "messages" || isSearchOpen) ? "md:ml-20" : "md:ml-64"} lg:mr-80 pt-20 pb-20 md:pb-4 relative z-10 transition-all duration-300 ${isDarkMode ? 'backdrop-blur-[0.5px]' : ''
        }`}>
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {children ? (
            children
          ) : (
            activeTab === "home" && <Feed />
          )}
        </div>
      </main>

      <RightSidebar />
    </div>
  )
}

export function HomeLayout(props: HomeLayoutProps) {
  return (
    <Suspense fallback={null}>
      <HomeContent {...props} />
    </Suspense>
  )
}

