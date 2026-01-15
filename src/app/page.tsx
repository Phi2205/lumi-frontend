"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { RightSidebar } from "@/components/RightSidebar"
import { Feed } from "@/components/Feed"
import { MessagesView } from "@/components/messages/MessagesView"

export default function Home() {
  const [activeTab, setActiveTab] = useState("home")
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const router = useRouter()
  const { user, isLoading } = useAuth()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Preload the background image
    const img = new Image()
    img.src = "/bg12.jpg"
    
    img.onload = () => {
      setImageLoaded(true)
    }
    
    img.onerror = () => {
      setImageError(true)
    }

    imgRef.current = img

    return () => {
      // Cleanup
      if (imgRef.current) {
        imgRef.current.onload = null
        imgRef.current.onerror = null
      }
    }
  }, [])

  // Show loading or nothing while checking auth or redirecting
  if (isLoading || !user) {
    return (
      <div className="min-h-screen relative">
        {/* Background Image */}
        <div 
          className="fixed inset-0 bg-cover bg-no-repeat bg-center -z-10"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(/bg12.jpg)`
          }}
        />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white/80">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Gradient Fallback - Always visible */}
      <div 
        className="fixed inset-0 -z-10"
        style={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)'
        }}
      />

      {/* Blurred Placeholder - Shows while loading */}
      {!imageLoaded && !imageError && (
        <div 
          className="fixed inset-0 bg-cover bg-no-repeat bg-center -z-10 transition-opacity duration-500"
          style={{ 
            backgroundImage: `url(/bg12.jpg)`,
            filter: 'blur(20px) brightness(0.3)',
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* Full Background Image - Fades in when loaded */}
      <div 
        className={`fixed inset-0 bg-cover bg-no-repeat bg-center -z-10 transition-opacity duration-1000 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(/bg12.jpg)`
        }}
      />

      <Header />
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      {activeTab === "messages" ? (
        <MessagesView />
      ) : (
        <main className="md:ml-64 lg:mr-80 pt-4 pb-20 md:pb-4 relative z-10">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            {activeTab === "home" && (
              <Feed />
            )}
          </div>
        </main>
      )}

      {activeTab !== "messages" && <RightSidebar />}
    </div>
  )
}
