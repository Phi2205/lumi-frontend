"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { RightSidebar } from "@/components/RightSidebar"
import { Feed } from "@/components/Feed"
import { MessagesView } from "@/components/messages/MessagesView"
import { Modal } from "@/lib/components/modal"
import { Loading } from "@/lib/components/glass-loading"
import { useDarkMode } from "@/hooks/useDarkMode"
import { useBackgroundImage } from "@/hooks/useBackgroundImage"
import { BackgroundRenderer } from "@/components/BackgroundRenderer"
import { Notification } from "@/lib/components/notification"

export default function Home() {
  const [activeTab, setActiveTab] = useState("home")
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { isDarkMode, handleDarkModeToggle } = useDarkMode()
  const { imageLoaded, imageError } = useBackgroundImage("/bg12.jpg", isDarkMode)

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundRenderer
        isDarkMode={isDarkMode}
        imageLoaded={imageLoaded}
        imageError={imageError}
      />

      <Header isDarkMode={isDarkMode} onDarkModeToggle={handleDarkModeToggle} />
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      {activeTab === "messages" ? (
        <MessagesView />
      ) : (
        <main className={`md:ml-64 lg:mr-80 pt-20 pb-20 md:pb-4 relative z-10 transition-all duration-300 ${isDarkMode ? 'backdrop-blur-[0.5px]' : ''
          }`}>
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
